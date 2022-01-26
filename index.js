import fs from 'fs';
import path from 'path';
import url from 'url';

import fetch from 'node-fetch';
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

async function getLatestFeed(number_of_display, feedUrlArray){
  if(typeof feedUrlArray === 'undefined'){
    throw new Error('LessArgumentsException: Number of argument is more than 2.');
  }
  if(feedUrlArray.length === 0){
    throw new Error('ArrayLengthException: Length of array must be more than 1.');
  }

  const endpoint = 'https://api.rss2json.com/v1/api.json';
  let forSortList   = [];
  let forConcatList = [];
  let i = 0;

  while(i < feedUrlArray.length){
    forConcatList = await getPartOfDataList(number_of_display, `${endpoint}?rss_url=${feedUrlArray[i]}`);
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

function isLinkMatchedFeedUrl(link, feedUrl, numberOfInitial){
  if(link.match(feedUrl.substring(0, numberOfInitial))){
    return true;
  }
  return false;
}

function writeFeedToText(sourceLines, destFileName, listOfLatestFeed, feedUrlArray, imgFileNameArray, postArea){
  const separator       = '\n';
  let isEnteringPostArea = false;
  let isPassedPostArea   = false;
  let k = 0;
  let feed;
  const numberOfInitial = 16;
  let destLines = [];

  for(let i = 0; i < sourceLines.length; i++){
    if(sourceLines[i] == postArea['end']){
      isPassedPostArea = true;
    }
    if(isEnteringPostArea ^ isPassedPostArea == 0){
      destLines.push(sourceLines[i]);
    }else{
      while(k <= listOfLatestFeed.length - 1){
        for(let i = 0; i < feedUrlArray.length; i++){
          if(isLinkMatchedFeedUrl(listOfLatestFeed[k]['link'], feedUrlArray[i], numberOfInitial) === true){
            feed = `- ![](${imgFileNameArray[i]}) [${listOfLatestFeed[k]['title']}](${listOfLatestFeed[k]['link']})`;
            break;
          }
        }
        destLines.push(feed);
        k++;
      }
    }
    if(sourceLines[i] == postArea['start']){
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
    const feedUrlArray     = configByYaml.feedUrlArray;
    const imgFileNameArray = configByYaml.imgFileNameArray;
    let   listOfLatestFeed = await getLatestFeed(number_of_display, feedUrlArray);
    console.log(listOfLatestFeed);

    const sourceMdFileName = configByYaml.sourceMarkdownFileName;
    const lines = getTextLines(sourceMdFileName);
    console.log(lines);

    const postArea = configByYaml.postArea;
    writeFeedToText(lines, sourceMdFileName, listOfLatestFeed, feedUrlArray, imgFileNameArray, postArea);
    console.log(getTextLines(sourceMdFileName));
  })();
} catch (error) {
  console.error(`Execute Step 1: ${error}`);
}
