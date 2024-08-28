const fs = require('fs');

function convertManifest(inputFile) {
    const data = fs.readFileSync(inputFile, 'utf8');
    const manifest = JSON.parse(data);

    const serviceWorker = manifest["background"]["service_worker"];
    manifest["background"] = {
        "scripts": [serviceWorker]
    };

    manifest["browser_specific_settings"] = {
        "gecko": {
          "strict_min_version": "125.0"
        }
    }

    fs.writeFileSync(inputFile, JSON.stringify(manifest, null, 2));
}

const inputFile = process.argv[2];
convertManifest(inputFile);
