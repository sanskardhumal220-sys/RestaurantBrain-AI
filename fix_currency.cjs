const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            // Replace $${ with ₹${
            content = content.replace(/\$\$\{/g, '₹${');
            // Replace $number with ₹number
            content = content.replace(/\$(\d)/g, '₹$1');
            // Replace ($) with (₹)
            content = content.replace(/\(\$\)/g, '(₹)');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated', fullPath);
            }
        }
    }
}
processDir('frontend/src');
