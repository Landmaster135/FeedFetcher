import path from "path";
import url from "url";

import { Command } from "commander";

import * as methods from "./lib/lib-methods.js";

try {
  (async() => {
    const commander = new Command();
    commander.option("-c, --config-yaml <type>", "file name for config with yaml").parse(process.argv);
    console.log(commander);

    const yamlFileName = String(commander._optionValues.configYaml);
    console.log(`feed-fetch.js: yamlFileName is "${yamlFileName}"`);

    const __dirname    = path.dirname(url.fileURLToPath(import.meta.url));
    const configByYaml = methods.loadYamlFile(path.join(__dirname, yamlFileName));
    console.log(configByYaml);

    const number_of_display = configByYaml.displayLimit;
    const feedUrlArray     = configByYaml.feedUrlArray;
    const imgFileNameArray = configByYaml.imgFileNameArray;
    let   listOfLatestFeed = await methods.getLatestFeed(number_of_display, feedUrlArray, imgFileNameArray);
    console.log(listOfLatestFeed);

    const sourceMdFileName = configByYaml.sourceMarkdownFileName;
    const lines = methods.getTextLines(path.join(__dirname, sourceMdFileName));

    const postArea = configByYaml.postArea;
    methods.writeFeedToText(lines, sourceMdFileName, postArea, listOfLatestFeed, feedUrlArray, imgFileNameArray);
    console.log(methods.getTextLines(sourceMdFileName));
  })();
} catch (error) {
  console.error(`Execute Step 1: ${error}`);
}
