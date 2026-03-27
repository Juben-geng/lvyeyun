#!/usr/bin/env node

// 批量品牌更新脚本
// 智途AI/OpenClaw → 旅业云AI/TripClaw

const fs = require('fs');
const path = require('path');

const replacements = {
  '智途AI': '旅业云AI',
  'OpenClaw': 'TripClaw',
  'Open Claw': 'TripClaw',
  '智途': '旅业云',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.match(/\.(html|js|md|json)$/)) {
      processFile(filePath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  Object.entries(replacements).forEach(([old, new]) => {
    if (content.includes(old)) {
      content = content.replace(new RegExp(old, 'g'), new);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ 已更新: ${filePath}`);
  }
}

// 处理项目目录
const projectDir = __dirname;
console.log('开始批量更新品牌名称...\n');
processDirectory(projectDir);
console.log('\n✅ 批量更新完成！');

console.log('\n更新内容：');
console.log('  智途AI     →  旅业云AI');
console.log('  OpenClaw   →  TripClaw');
console.log('\n请在 Git 中检查修改：');
console.log('  git diff');
console.log('\n提交更改：');
console.log('  git add .');
console.log('  git commit -m "rebrand: 品牌更新为旅业云AI · TripClaw"');
