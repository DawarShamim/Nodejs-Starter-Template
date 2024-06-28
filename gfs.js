const fs = require('fs');
const path = require('path');

function printFolderStructure(dir, excludeDirs = [], indent = '') {
    let structure = '';
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                structure += `${indent}${file}/\n`;
                structure += printFolderStructure(filePath, excludeDirs, `${indent}   `);
            }
        } else {
            if (!excludeDirs.includes(file)) {
                structure += `${indent}${file}\n`;
            }
        }
    });
    return structure;
}

const rootDir = path.resolve(__dirname);
console.log('Generating Readme File');

const excludeDirs = ['node_modules', '.git', '.gitignore', '.env', 'Auth.js', '.env.example', '.eslintignore', 'public', 'private'];
const folderStructure = printFolderStructure(rootDir, excludeDirs);
fs.writeFileSync('readme.md', `# Project Folder Structure\n\n\`\`\`\n${folderStructure}\n\`\`\`\n`);

console.log('File Generated Successfully');
