import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { Command } from 'commander';

import yaml from 'js-yaml';

function loadYamlFile(filename) {
    console.log(`loadYamlFile: "filename" is ${filename}`);
    const yamlText = fs.readFileSync(filename, 'utf8');
    return yaml.load(yamlText);
}



async function getPartOfDataList(number_of_display, fetchUrl){
    let res = await fetch(fetchUrl);
    let dataList = await res.json();
    let partOfDataList = [];
    let j = 0;
    while(j < number_of_display && j < dataList.items.length){
        let temporaryList = {};
        temporaryList['title']   = dataList.items[j].title;
        temporaryList['link']    = dataList.items[j].link;
        temporaryList['pubDate'] = dataList.items[j].pubDate;
        partOfDataList.push(temporaryList);
        j++;
    }
    return partOfDataList;
}

async function getLatestFeed(number_of_display, feedUrl, ...theOtherUrls){
    if(typeof feedUrl === 'undefined'){
        throw new Error('LessArgumentsException: Number of argument is more than 2.');
    }

    const endpoint = 'https://api.rss2json.com/v1/api.json';
    let forSortList   = [];
    let forConcatList = [];
    let i = 0;

    forSortList = await getPartOfDataList(number_of_display, `${endpoint}?rss_url=${feedUrl}`);
    while(i < theOtherUrls.length){
        forConcatList = await getPartOfDataList(number_of_display, `${endpoint}?rss_url=${theOtherUrls[i]}`);
        forSortList = await forSortList.concat(forConcatList);
        i++;
    }

    forSortList.sort(function(a, b) {
        if (a.pubDate > b.pubDate) {
            return -1;
        }
        return 1;
    });
    forSortList = forSortList.slice(0, number_of_display);

    return forSortList;
}

function getTextLines(fileName){
    const separator = '\n';
    let text = fs.readFileSync(`./${fileName}`, 'utf8');
    let lines = text.toString().split(separator);
    return lines;
}

function writeFeedToText(sourceLines, destFileName, listOfLatestFeed, feedUrlZenn, feedUrlQiita){
    const separator       = '\n';
    const textOfStartPost = '<!--[START POSTS LIST]-->';
    const textOfEndPost   = '<!--[END POSTS LIST]-->';
    let isEnteringPostArea = false;
    let isPassedPostArea   = false;
    let k = 0;
    let feed;
    const numberOfInitial = 16;
    let imgFileNameZenn  = 'img/zenn.png';
    let imgFileNameQiita = 'img/qiita.png';
    let destLines = [];

    for(let i = 0; i < sourceLines.length; i++){
        if(sourceLines[i] == textOfEndPost){
            isPassedPostArea = true;
        }
        if(isEnteringPostArea ^ isPassedPostArea == 0){
            destLines.push(sourceLines[i]);
        }else{
            while(k <= listOfLatestFeed.length - 1){
                if(listOfLatestFeed[k]['link'].match(feedUrlZenn.substring(0, numberOfInitial))){
                    feed = `- ![](${imgFileNameZenn}) [${listOfLatestFeed[k]['title']}](${listOfLatestFeed[k]['link']})`;
                }else if(listOfLatestFeed[k]['link'].match(feedUrlQiita.substring(0, numberOfInitial))){
                    feed = `- ![](${imgFileNameQiita}) [${listOfLatestFeed[k]['title']}](${listOfLatestFeed[k]['link']})`;
                }
                destLines.push(feed);
                k++;
            }
        }
        if(sourceLines[i] == textOfStartPost){
            isEnteringPostArea = true;
        }
    };

    fs.writeFileSync(destFileName, String(destLines.join(separator)));
}

try {
    (async() => {
        const commander = new Command();
        commander.option('-c, --config-yaml <type>', 'file name for config with yaml').parse(process.argv);
        console.log(commander);

        const yamlFileName = String(commander._optionValues.configYaml);
        console.log(`index.js: yamlFileName is "${yamlFileName}"`);

        const __dirname    = path.dirname(url.fileURLToPath(import.meta.url));
        const configByYaml = loadYamlFile(path.join(__dirname, yamlFileName));
        console.log(configByYaml);

        const number_of_display = configByYaml.displayLimit;
        const feedUrlZenn       = configByYaml.feedUrlZenn;
        const feedUrlQiita      = configByYaml.feedUrlQiita;
        const feedUrlWordpress  = configByYaml.feedUrlWordpress;
        let   listOfLatestFeed  = await getLatestFeed(number_of_display, feedUrlZenn, feedUrlQiita, feedUrlWordpress);
        console.log(listOfLatestFeed);

        const sourceMdFileName = configByYaml.sourceMarkdownFileName;
        const lines = getTextLines(sourceMdFileName);
        console.log(lines);

        writeFeedToText(lines, sourceMdFileName, listOfLatestFeed, feedUrlZenn, feedUrlQiita);
    })();
} catch (error) {
    console.error(`Execute Step 1: ${error}`);
}

