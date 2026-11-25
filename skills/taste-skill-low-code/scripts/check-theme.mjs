#!/usr/bin/env node
// check-theme.mjs · Taste Skill para low-code
//
// Confere o contrato modular nos arquivos de tema de um app low-code (Mendix):
// nenhum estilo por instância, nenhum número fora dos tokens, e toda classe do
// módulo exposta por uma design property. Não abre navegador e não lê o modelo
// do app (.mpr): o que vive dentro do modelo é conferido no gate manual
// (references/gate.md).
//
// Uso:
//   node check-theme.mjs <pasta> [--prefix tk] [--include-vendor] [--json]
//
// <pasta> pode ser a raiz do app, theme/ ou themesource/<módulo>.
// Saída 1 quando há FAIL.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const root = resolve(args.find((a) => !a.startsWith('--') && a !== option('--prefix', null)) ?? '.');
const prefix = option('--prefix', 'tk');
const asJson = flag('--json');

// Módulos de terceiros: não são nossos para corrigir, a menos que apontados direto.
const VENDOR = new Set(['atlas_core', 'atlas_web_content', 'atlas_nativemobile_content', 'datawidgets', 'node_modules', '.git', 'deployment']);
const TOKEN_FILE = /^(_?tokens|_?custom-variables.*|_?exclusion-variables.*)\.scss$/;
const SCALE = new Set([0, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96]);
const SPACE_PROP = /^(margin|padding|gap|row-gap|column-gap)(-[a-z-]+)?$/;

const findings = [];
const report = (level, id, file, line, message) =>
  findings.push({ level, id, file: relative(process.cwd(), file) || file, line, message });

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (VENDOR.has(name) && !flag('--include-vendor')) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (name.endsWith('.scss') || name === 'design-properties.json') out.push(full);
  }
  return out;
}

function hexToHsl(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let hue;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  return { h: (hue * 60 + 360) % 360, s, l };
}

const isViolet = ({ h, s, l }) => h >= 250 && h <= 310 && s >= 0.15 && l > 0.08 && l < 0.95;

const definedClasses = new Set();
const classPattern = new RegExp(`\\.(${prefix}-[A-Za-z0-9_-]+)`, 'g');

function checkScss(file) {
  const isTokens = TOKEN_FILE.test(basename(file));
  let inBlockComment = false;
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((raw, index) => {
    const lineNo = index + 1;
    const allowed = /\/\/\s*tk-allow:/.test(raw);
    let line = raw;
    // Tira comentários mantendo a numeração das linhas.
    if (inBlockComment) {
      const end = line.indexOf('*/');
      if (end < 0) return;
      line = line.slice(end + 2);
      inBlockComment = false;
    }
    line = line.replace(/\/\*.*?\*\//g, '');
    const open = line.indexOf('/*');
    if (open >= 0) {
      line = line.slice(0, open);
      inBlockComment = true;
    }
    line = line.replace(/(^|[^:])\/\/.*$/, '$1');
    if (!line.trim()) return;

    for (const match of line.matchAll(classPattern)) definedClasses.add(match[1]);
    if (allowed) {
      report('INFO', 'allowed', file, lineNo, raw.trim());
      return;
    }

    if (/\.mx-name-/.test(line)) {
      report('FAIL', 'instance-selector', file, lineNo, 'seletor .mx-name-* estiliza uma instância; crie uma classe do módulo e uma design property');
    }
    if (/!important/.test(line)) {
      report('FAIL', 'important', file, lineNo, '!important; aumente a especificidade com a classe do módulo');
    }
    if (/transition\s*:\s*all\b/.test(line)) {
      report('WARN', 'transition-all', file, lineNo, 'transition: all; liste as propriedades que mudam');
    }

    const hexes = [...line.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g)].map((m) => m[0]);
    const functional = /\b(rgba?|hsla?)\(\s*[\d.]/.test(line);
    for (const hex of hexes) {
      if (isViolet(hexToHsl(hex))) {
        report('FAIL', 'violet', file, lineNo, `${hex} é violeta/lavanda; escolha outro matiz`);
      }
      if (/^#0{3}$|^#0{6}$/.test(hex)) {
        report('WARN', 'pure-black', file, lineNo, '#000 puro; use o quase-preto dos tokens');
      }
    }
    if (!isTokens && (hexes.length || functional)) {
      report('FAIL', 'raw-colour', file, lineNo, 'cor literal fora dos tokens; use var(--tk-*) ou uma variável do tema');
    }

    // Declarações da linha (uma ou várias, como em regras de uma linha só).
    for (const declaration of line.matchAll(/(?:^|[;{])\s*([a-z-]+)\s*:\s*([^;{}]+)/g)) {
      const [, property, value] = declaration;
      if (SPACE_PROP.test(property) && !isTokens) {
        for (const match of value.matchAll(/(-?\d*\.?\d+)px/g)) {
          const n = Math.abs(Number(match[1]));
          if (!SCALE.has(n)) {
            report('FAIL', 'off-scale', file, lineNo, `${property}: ${match[0]} fora da escala 4, 8, 12, 16, 24, 32, 48, 64, 96`);
          }
        }
      }
      if (property === 'font-size') {
        const px = value.trim().match(/^(\d*\.?\d+)px/);
        if (px && Number(px[1]) < 13) {
          report('FAIL', 'small-type', file, lineNo, `font-size ${px[0]}; nada abaixo de 13px`);
        }
      }
    }
    // Tokens de tipo também não descem de 13px.
    const typeToken = line.match(/^\s*(--[a-z-]*-t-[a-z-]+|\$font-size-[a-z0-9-]+)\s*:\s*(\d*\.?\d+)px/);
    if (typeToken && Number(typeToken[2]) < 13) {
      report('FAIL', 'small-type', file, lineNo, `${typeToken[1]}: ${typeToken[2]}px; nada abaixo de 13px`);
    }
  });
}

const propertyClasses = new Map();

function checkDesignProperties(file) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    report('FAIL', 'dp-json', file, 1, `JSON inválido: ${error.message}`);
    return;
  }
  const note = (cls, where) => {
    if (typeof cls === 'string' && cls.startsWith(`${prefix}-`)) propertyClasses.set(cls, where);
  };
  for (const [widget, properties] of Object.entries(data)) {
    if (!Array.isArray(properties)) {
      report('FAIL', 'dp-json', file, 1, `"${widget}" precisa ser uma lista de propriedades`);
      continue;
    }
    for (const property of properties) {
      const where = `${widget} > ${property.name ?? '(sem nome)'}`;
      if (!property.name || !property.type) {
        report('FAIL', 'dp-json', file, 1, `${where}: falta "name" ou "type"`);
        continue;
      }
      if (property.type === 'Toggle') {
        if (!property.class) report('FAIL', 'dp-json', file, 1, `${where}: Toggle sem "class"`);
        note(property.class, where);
      } else if (property.type === 'Spacing') {
        // Formato próprio do Atlas (margin/padding por lado); não é do kit.
      } else {
        if (!Array.isArray(property.options) || property.options.length === 0) {
          report('FAIL', 'dp-json', file, 1, `${where}: ${property.type} sem "options"`);
          continue;
        }
        for (const opt of property.options) {
          if (!opt.name || !(opt.class || opt.variable)) {
            report('FAIL', 'dp-json', file, 1, `${where}: opção sem "name" ou sem "class"`);
          }
          note(opt.class, where);
        }
      }
    }
  }
}

let files;
try {
  files = walk(root);
} catch (error) {
  console.error(`check-theme: não foi possível ler ${root}: ${error.message}`);
  process.exit(2);
}
const scssFiles = files.filter((f) => f.endsWith('.scss'));
const jsonFiles = files.filter((f) => f.endsWith('.json'));
scssFiles.forEach(checkScss);
jsonFiles.forEach(checkDesignProperties);

if (jsonFiles.length) {
  for (const [cls, where] of propertyClasses) {
    if (!definedClasses.has(cls)) {
      report('FAIL', 'dp-class-missing', jsonFiles[0], 1, `${where}: a classe .${cls} não existe em nenhum SCSS`);
    }
  }
  for (const cls of definedClasses) {
    if (!propertyClasses.has(cls) && !cls.includes('__')) {
      report('WARN', 'dp-orphan-class', jsonFiles[0], 1, `.${cls} existe no SCSS mas nenhuma design property a expõe`);
    }
  }
} else if (definedClasses.size) {
  report('WARN', 'dp-orphan-class', root, 1, `há classes ${prefix}-* mas nenhum design-properties.json: o estilo só seria aplicável pelo campo Class`);
}

const count = (level) => findings.filter((f) => f.level === level).length;
if (asJson) {
  console.log(JSON.stringify({ root, files: files.length, findings }, null, 2));
} else {
  const shown = findings.filter((f) => f.level !== 'INFO' || flag('--verbose'));
  for (const f of shown) console.log(`${f.level.padEnd(4)} [${f.id}] ${f.file}:${f.line}  ${f.message}`);
  const display = relative(process.cwd(), root).split(sep).join('/') || '.';
  console.log(
    `\ncheck-theme: ${scssFiles.length} SCSS, ${jsonFiles.length} design-properties em ${display} · ` +
      `${count('FAIL')} FAIL, ${count('WARN')} WARN, ${count('INFO')} dispensas (tk-allow)`,
  );
  if (!files.length) console.log('check-theme: nenhum arquivo de tema encontrado; confira a pasta.');
}
process.exit(count('FAIL') ? 1 : 0);
