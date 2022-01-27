
import path from 'path';
import url from 'url';

import { Command } from 'commander';

import * as methods from './lib/lib-methods.js';

try {
  (async() => {
    const commander = new Command();
    commander.option('-c, --config-yaml <type>', 'file name for config with yaml').parse(process.argv);
    console.log(commander);

    const yamlFileName = String(commander._optionValues.configYaml);
    console.log(`image-scale.js: yamlFileName is "${yamlFileName}"`);

    const __dirname    = path.dirname(url.fileURLToPath(import.meta.url));
    const configByYaml = methods.loadYamlFile(path.join(__dirname, yamlFileName));
    console.log(configByYaml);

    const sourceMdFileName = configByYaml.sourceMarkdownFileName;
    const lines = methods.getTextLines(sourceMdFileName);
    console.log(lines);

    const imageArea = configByYaml.imageArea;
    const imageSizeEmAfter = configByYaml.imageSizeEmAfter;
    methods.writeImageScaling(lines, sourceMdFileName, imageArea, imageSizeEmAfter)
    console.log(methods.getTextLines(sourceMdFileName));
  })();
} catch (error) {
  console.error(`Execute Step 1: ${error}`);
}
