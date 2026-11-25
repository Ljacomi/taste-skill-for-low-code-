#!/usr/bin/env node
// domain-model.mjs · Taste Skill para low-code
//
// O domain model é especificado em JSON antes de existir na plataforma, para
// ser validado e desenhado. Este script não cria nada no Mendix: ele confere a
// especificação e gera o diagrama de revisão. Formato: references/domain-model.md
//
// Uso:
//   node domain-model.mjs lint modelo.json [--json]
//   node domain-model.mjs mermaid modelo.json
//
// Saída 1 quando há FAIL.

import { readFileSync } from 'node:fs';

const [command, file, ...rest] = process.argv.slice(2);
if (!['lint', 'mermaid'].includes(command) || !file) {
  console.error('uso: node domain-model.mjs <lint|mermaid> modelo.json [--json]');
  process.exit(2);
}

let model;
try {
  model = JSON.parse(readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`domain-model: não foi possível ler ${file}: ${error.message}`);
  process.exit(2);
}

const entities = model.entities ?? [];
const associations = model.associations ?? [];
const enumerations = model.enumerations ?? [];
const byName = new Map(entities.map((e) => [e.name, e]));
const isExternal = (name) => typeof name === 'string' && name.includes('.');

const TYPES = new Set(['String', 'Integer', 'Long', 'Decimal', 'Boolean', 'DateTime', 'Enumeration', 'AutoNumber', 'Binary', 'HashString']);
const MULTIPLICITIES = new Set(['*-1', '1-1', '*-*']);
const DELETE = new Set(['delete', 'prevent', 'keep']);
const RESERVED = new Set(['id', 'guid', 'type', 'context', 'object', 'owner', 'changedby', 'createddate', 'changeddate', 'currentuser', 'submetaobjectname']);
const UPPER_CAMEL = /^[A-Z][A-Za-z0-9]*$/;
const MAX_ENTITIES = 15;
const MAX_ATTRIBUTES = 20;

// Profundidade: 0 para entidades-mestre (não dependem de ninguém do módulo).
function depths() {
  const depth = new Map();
  const visit = (name, trail) => {
    if (depth.has(name)) return depth.get(name);
    if (trail.has(name)) return 0;
    trail.add(name);
    const parents = associations
      .filter((a) => a.from === name && a.multiplicity !== '*-*' && byName.has(a.to) && a.to !== name)
      .map((a) => a.to);
    const value = parents.length ? 1 + Math.max(...parents.map((p) => visit(p, trail))) : 0;
    trail.delete(name);
    depth.set(name, value);
    return value;
  };
  entities.forEach((e) => visit(e.name, new Set()));
  return depth;
}

function lint() {
  const findings = [];
  const add = (level, id, where, message) => findings.push({ level, id, where, message });

  if (!model.module || !UPPER_CAMEL.test(model.module)) {
    add('FAIL', 'module-name', model.module ?? '(sem módulo)', 'o módulo precisa de um nome em UpperCamelCase');
  }
  if (entities.length === 0) add('FAIL', 'no-entities', model.module ?? '', 'o modelo não tem entidades');
  if (entities.length > MAX_ENTITIES) {
    add('WARN', 'module-size', model.module, `${entities.length} entidades; acima de ${MAX_ENTITIES} o módulo costuma ter dois subdomínios`);
  }

  const enumNames = new Set();
  for (const enumeration of enumerations) {
    const where = enumeration.name ?? '(enumeration sem nome)';
    if (!/^ENUM_[A-Z][A-Za-z0-9]*$/.test(enumeration.name ?? '')) {
      add('FAIL', 'enum-name', where, 'enumeration se chama ENUM_<Conceito>');
    }
    if (enumNames.has(enumeration.name)) add('FAIL', 'duplicate', where, 'enumeration repetida');
    enumNames.add(enumeration.name);
    const values = enumeration.values ?? [];
    if (values.length < 2) add('FAIL', 'enum-values', where, 'uma enumeration tem pelo menos dois valores');
    for (const value of values) {
      if (!UPPER_CAMEL.test(value)) add('FAIL', 'enum-values', `${where}.${value}`, 'valor em UpperCamelCase, sem espaço ou acento');
    }
  }

  const seenEntities = new Set();
  const usedEnums = new Set();
  for (const entity of entities) {
    const name = entity.name ?? '(entidade sem nome)';
    if (!UPPER_CAMEL.test(entity.name ?? '')) {
      add('FAIL', 'entity-name', name, 'entidade em UpperCamelCase, sem prefixo, espaço ou sublinhado');
    } else if (/[^su]s$/.test(name) && !/(ss|us|is)$/.test(name)) {
      add('WARN', 'entity-plural', name, 'parece plural; entidade nomeia uma instância, no singular');
    }
    if (seenEntities.has(name)) add('FAIL', 'duplicate', name, 'entidade repetida');
    seenEntities.add(name);
    if (!entity.doc || entity.doc.trim().length < 10) {
      add('FAIL', 'entity-doc', name, 'falta a documentação de uma frase: o que é uma instância dela');
    }
    const persistable = entity.persistable !== false;
    if (persistable && !(Array.isArray(entity.access) && entity.access.length)) {
      add('FAIL', 'entity-access', name, 'entidade persistível sem access rules por role ("access")');
    }
    if (entity.generalization && !/^(System|Administration)\./.test(entity.generalization)) {
      add('WARN', 'generalization', name, `herda de ${entity.generalization}; prefira associação 1-1 ou enumeration de tipo`);
    }

    const attributes = entity.attributes ?? [];
    if (attributes.length === 0 && !entity.generalization) {
      add('WARN', 'entity-empty', name, 'entidade sem atributos');
    }
    if (attributes.length > MAX_ATTRIBUTES) {
      add('WARN', 'entity-size', name, `${attributes.length} atributos; acima de ${MAX_ATTRIBUTES} costuma haver uma segunda entidade escondida`);
    }
    const seenAttributes = new Set();
    for (const attribute of attributes) {
      const where = `${name}.${attribute.name ?? '(sem nome)'}`;
      const attributeName = attribute.name ?? '';
      if (!UPPER_CAMEL.test(attributeName)) {
        add('FAIL', 'attribute-name', where, 'atributo em UpperCamelCase');
        continue;
      }
      if (seenAttributes.has(attributeName.toLowerCase())) add('FAIL', 'duplicate', where, 'atributo repetido');
      seenAttributes.add(attributeName.toLowerCase());
      if (RESERVED.has(attributeName.toLowerCase())) {
        add('FAIL', 'attribute-reserved', where, 'nome reservado pela plataforma');
      }
      if (attributeName.startsWith(name) && /^[A-Z]/.test(attributeName.slice(name.length))) {
        add('WARN', 'attribute-prefix', where, `repete o nome da entidade; use ${attributeName.slice(name.length)}`);
      }
      if (!TYPES.has(attribute.type)) {
        add('FAIL', 'attribute-type', where, `tipo "${attribute.type}" desconhecido`);
        continue;
      }
      if (attribute.type === 'Enumeration') {
        if (!attribute.enumeration) add('FAIL', 'enum-ref', where, 'atributo Enumeration sem "enumeration"');
        else if (!enumNames.has(attribute.enumeration) && !isExternal(attribute.enumeration)) {
          add('FAIL', 'enum-ref', where, `${attribute.enumeration} não está em "enumerations"`);
        } else usedEnums.add(attribute.enumeration);
      }
      if (attribute.type === 'Boolean') {
        if (!/^(Is|Has|Can|Should)[A-Z]/.test(attributeName)) {
          add('WARN', 'boolean-name', where, 'Boolean começa com Is, Has, Can ou Should');
        }
        if (typeof attribute.default !== 'boolean') {
          add('WARN', 'boolean-default', where, 'Boolean sem default explícito');
        }
      }
      if (attribute.type === 'DateTime' && !/(Date|On|At|Time)$/.test(attributeName)) {
        add('WARN', 'date-name', where, 'data termina em Date (dia) ou On/At (instante)');
      }
      if (attribute.type !== 'Decimal' && /(Amount|Price|Total|Cost|Value)$/.test(attributeName) && ['Integer', 'Long', 'String'].includes(attribute.type)) {
        add('WARN', 'money-type', where, 'valor monetário em Decimal');
      }
    }
  }

  for (const enumeration of enumerations) {
    if (enumeration.name && !usedEnums.has(enumeration.name)) {
      add('WARN', 'enum-unused', enumeration.name, 'enumeration sem nenhum atributo que a use');
    }
  }

  const seenAssociations = new Set();
  const linked = new Set();
  for (const association of associations) {
    const where = association.name ?? '(associação sem nome)';
    if (seenAssociations.has(association.name)) add('FAIL', 'duplicate', where, 'associação repetida');
    seenAssociations.add(association.name);
    if (!byName.has(association.from)) {
      add('FAIL', 'association-end', where, `"from" (${association.from}) não é uma entidade deste módulo; o dono é sempre local`);
      continue;
    }
    if (!byName.has(association.to) && !isExternal(association.to)) {
      add('FAIL', 'association-end', where, `"to" (${association.to}) não existe; entidade de outro módulo se escreve Modulo.Entidade`);
      continue;
    }
    linked.add(association.from);
    linked.add(association.to);
    const target = String(association.to).split('.').pop();
    const expected = `${association.from}_${target}`;
    if (!(association.name === expected || String(association.name).startsWith(`${expected}_`))) {
      add('FAIL', 'association-name', where, `use ${expected} (com _<Papel> no fim quando há mais de uma)`);
    }
    if (!MULTIPLICITIES.has(association.multiplicity)) {
      add('FAIL', 'association-multiplicity', where, 'multiplicity é "*-1", "1-1" ou "*-*"');
    } else if (association.multiplicity === '*-*') {
      add('WARN', 'many-to-many', where, 'muitos-para-muitos: se a relação tem dados próprios, vira entidade');
    }
    if (!DELETE.has(association.onDeleteOfTarget)) {
      add('FAIL', 'delete-behavior', where, 'decida "onDeleteOfTarget": delete, prevent ou keep');
    }
  }

  for (const entity of entities) {
    if (entity.persistable !== false && entities.length > 1 && !linked.has(entity.name)) {
      add('WARN', 'entity-orphan', entity.name, 'entidade persistível sem nenhuma associação');
    }
  }

  const count = (level) => findings.filter((f) => f.level === level).length;
  if (rest.includes('--json')) {
    console.log(JSON.stringify({ module: model.module, findings }, null, 2));
  } else {
    for (const f of findings) console.log(`${f.level.padEnd(4)} [${f.id}] ${f.where}  ${f.message}`);
    console.log(
      `\ndomain-model: ${model.module ?? '?'} · ${entities.length} entidades, ${associations.length} associações, ` +
        `${enumerations.length} enumerations · ${count('FAIL')} FAIL, ${count('WARN')} WARN`,
    );
  }
  process.exit(count('FAIL') ? 1 : 0);
}

function mermaid() {
  const depth = depths();
  const id = (name) => String(name).replace(/[^A-Za-z0-9_]/g, '_');
  const persistable = entities.filter((e) => e.persistable !== false);
  const transient = entities.filter((e) => e.persistable === false);
  const ordered = [...persistable].sort((a, b) => depth.get(a.name) - depth.get(b.name) || a.name.localeCompare(b.name));
  const lines = ['erDiagram'];
  lines.push(`    %% Módulo ${model.module ?? ''}: mestres primeiro, detalhes depois (leitura de cima para baixo).`);

  const block = (entity) => {
    lines.push(`    ${id(entity.name)} {`);
    for (const attribute of entity.attributes ?? []) {
      const type = attribute.type === 'Enumeration' ? id(attribute.enumeration ?? 'Enumeration') : attribute.type;
      lines.push(`        ${type} ${id(attribute.name)}`);
    }
    if (entity.generalization) lines.push(`        ${id(entity.generalization)} generalization`);
    lines.push('    }');
  };

  ordered.forEach(block);
  if (transient.length) {
    lines.push('    %% Não persistíveis: agrupadas à parte no diagrama do Studio Pro.');
    transient.sort((a, b) => a.name.localeCompare(b.name)).forEach(block);
  }

  const relation = { '*-1': ['||--o{', true], '1-1': ['||--o|', true], '*-*': ['}o--o{', false] };
  const sorted = [...associations].sort(
    (a, b) => (depth.get(a.to) ?? -1) - (depth.get(b.to) ?? -1) || String(a.name).localeCompare(String(b.name)),
  );
  for (const association of sorted) {
    const [symbol, targetFirst] = relation[association.multiplicity] ?? relation['*-1'];
    const [left, right] = targetFirst ? [association.to, association.from] : [association.from, association.to];
    lines.push(`    ${id(left)} ${symbol} ${id(right)} : "${association.name}"`);
  }
  console.log(lines.join('\n'));
}

if (command === 'lint') lint();
else mermaid();
