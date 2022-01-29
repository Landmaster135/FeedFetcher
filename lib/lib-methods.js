import fs from 'fs';

import fetch from 'node-fetch';
import yaml from 'js-yaml';

export function loadYamlFile(filename) {
  console.log(`loadYamlFile: "filename" is ${filename}`);
  const yamlText = fs.readFileSync(filename, 'utf8');
  return yaml.load(yamlText);
}

export async function getPartOfDataList(number_of_display, fetchUrl, imgFileName){
  let res = await fetch(fetchUrl);
  let dataList = await res.json();
  let partOfDataList = [];
  let j = 0;
  while(j < number_of_display && j < dataList.items.length){
    let temporaryList = {};
    temporaryList['title']       = dataList.items[j].title;
    temporaryList['link']        = dataList.items[j].link;
    temporaryList['pubDate']     = dataList.items[j].pubDate;
    temporaryList['imgFileName'] = imgFileName;
    partOfDataList.push(temporaryList);
    j++;
  }
  return partOfDataList;
}

export async function getLatestFeed(number_of_display, feedUrlArray, imgFileNameArray){
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
    forConcatList = await getPartOfDataList(number_of_display, `${endpoint}?rss_url=${feedUrlArray[i]}`, imgFileNameArray[i]);
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

export function getTextLines(fileName){
  const separator = '\n';
  let text = fs.readFileSync(`./${fileName}`, 'utf8');
  let lines = text.toString().split(separator);
  return lines;
}

export function isLinkMatchedFeedUrl(link, feedUrl, numberOfInitial){
  if(link.match(feedUrl.substring(0, numberOfInitial))){
    return true;
  }
  return false;
}

export function writeFeedToText(sourceLines, destFileName, postArea, listOfLatestFeed, feedUrlArray, imgFileNameArray){
  const separator       = '\n';
  let isEnteringPostArea = false;
  let isPassedPostArea   = false;
  let k = 0;
  let feed;
  const numberOfInitial = 16;
  let destLines = [];

  for(let i = 0; i < sourceLines.length; i++){
    if(sourceLines[i] === postArea['end']){
      isPassedPostArea = true;
    }
    if(isEnteringPostArea ^ isPassedPostArea === false){
      destLines.push(sourceLines[i]);
    }else{
      while(k <= listOfLatestFeed.length - 1){
        feed = `- ![](${listOfLatestFeed[k]['imgFileName']}) [${listOfLatestFeed[k]['title']}](${listOfLatestFeed[k]['link']})`;
        destLines.push(feed);
        k++;
      }
    }
    if(sourceLines[i] === postArea['start']){
      isEnteringPostArea = true;
    }
  };

  fs.writeFileSync(destFileName, String(destLines.join(separator)));
}

export function writeImageScaling(sourceLines, destFileName, imageArea, imageSizeEmAfter){
  const separator       = '\n';
  let isEnteringImageArea = false;
  let isPassedImageArea   = false;
  const partOfEmImgTag  = 'em\" ';
  const initialImgTag   = '  <img height=\"'
  const numberOfInitial = initialImgTag.length;
  let indexOfPartOfEmImgTag = 0;
  let imageSizeEmBefore     = 0;
  let regExpOfImgSizeBefore = '';
  let replacedLine          = '';
  let destLines = [];

  for(let i = 0; i < sourceLines.length; i++){
    if(isEnteringImageArea === true && isPassedImageArea === true){
      isEnteringImageArea = false;
      isPassedImageArea   = false;
    }
    if(sourceLines[i] === imageArea['end']){
      isPassedImageArea = true;
    }
    if(isEnteringImageArea ^ isPassedImageArea === false){
      destLines.push(sourceLines[i]);
    }else{
      replacedLine = sourceLines[i];
      if(isLinkMatchedFeedUrl(sourceLines[i].substring(0, numberOfInitial), initialImgTag, numberOfInitial) === true){
        indexOfPartOfEmImgTag = sourceLines[i].indexOf(partOfEmImgTag);
        imageSizeEmBefore = sourceLines[i].substring(numberOfInitial, indexOfPartOfEmImgTag);
        regExpOfImgSizeBefore = new RegExp(`${initialImgTag}${imageSizeEmBefore}` + '(.*?)', 'g')
        replacedLine = sourceLines[i].replace(regExpOfImgSizeBefore, `${initialImgTag}${String(imageSizeEmAfter)}`);
        console.log(replacedLine);
      }
      destLines.push(replacedLine);
    }
    if(sourceLines[i] === imageArea['start']){
      isEnteringImageArea = true;
    }
  };

  fs.writeFileSync(destFileName, String(destLines.join(separator)));
}
