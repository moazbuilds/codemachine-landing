const fs = require('fs');
const path = require('path');

const ARCH_DIR = '.codemachine/artifacts/architecture';
const OUTPUT_FILE = path.join(ARCH_DIR, 'architecture_manifest.json');

// Read all .md files in architecture directory
function findArchitectureFiles() {
  if (!fs.existsSync(ARCH_DIR)) {
    console.error(`Error: Architecture directory not found: $`);
    process.exit(1);
  }

  const files = fs.readdirSync(ARCH_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(ARCH_DIR, f));

  return files;
}

// Parse a single file for anchors
function parseAnchors(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  const anchors = [];
  const filename = path.basename(filepath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const anchorMatch = line.match(/<!--\s*anchor:\s*([^\s]+)\s*-->/);

    if (anchorMatch) {
      const key = anchorMatch[1];
      const lineNumber = i + 1; // 1-indexed
      const startAnchor = line.trim();

      // Get description from next non-empty line
      let description = '';
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('<!--')) {
          description = nextLine.replace(/^[#*\s-]+/, '').trim();
          break;
        }
      }

      anchors.push({
        key,
        line: lineNumber,
        start_anchor: startAnchor,
        description: description || 'No description available'
      });
    }
  }

  return { filename, anchors };
}

// Generate manifest
function generateManifest() {
  const files = findArchitectureFiles();
  const manifest = { files: {} };

  files.forEach(filepath => {
    const { filename, anchors } = parseAnchors(filepath);
    if (anchors.length > 0) {
      manifest.files[filename] = anchors;
    }
  });

  // Write manifest
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Architecture manifest generated: $`);
  console.log(`Found ${Object.keys(manifest.files).length} files with anchors`);
}

// Run
generateManifest();
