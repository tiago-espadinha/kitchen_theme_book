const fs = require('fs');
const path = require('path');

/**
 * Recursively scans a directory for files.
 * @param {string} dir - The directory to scan.
 * @param {string} baseDir - The base directory to calculate relative paths from.
 * @returns {string[]} An array of relative file paths.
 */
function scanDir(dir, baseDir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            results = results.concat(scanDir(fullPath, baseDir));
        } else {
            // Only include .json files, excluding index.json
            if (file.endsWith('.json') && file !== 'index.json') {
                results.push(path.relative(baseDir, fullPath));
            }
        }
    });

    return results;
}

const dbDir = path.join(__dirname, '../database');
const indexPath = path.join(dbDir, 'index.json');

try {
    console.log('Scanning database folder...');
    const files = scanDir(dbDir, dbDir);
    
    // Sort alphabetically for consistency
    files.sort();

    fs.writeFileSync(indexPath, JSON.stringify(files, null, 2), 'utf8');
    console.log(`Successfully updated index.json with ${files.length} recipes.`);
} catch (error) {
    console.error('Error updating index.json:', error);
    process.exit(1);
}
