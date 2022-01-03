import fetch from 'node-fetch';
import fs from 'fs';

const feedUrlZenn  = 'https://zenn.dev/kinkinbeer135ml/feed';
const feedUrlQiita = 'https://qiita.com/Landmaster135/feed.atom';
const number_of_display = 5;
let listOfLatestFeed = [];

async function getPartOfDataList(number_of_display, fetchUrl){
    let res = await fetch(fetchUrl);
    // let res = fetch(fetchUrl);
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

    forSortList = await getPartOfDataList(number_of_display, `${endpoint}?rss_url=${feedUrl}`);
    console.log(forSortList);
    let i = 0;
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
    // let rowOfStartPost;
    // let rowOfEndPost;
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
            // rowOfEndPost = Number(i);
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
            // rowOfStartPost = Number(i);
            isEnteringPostArea = true;
        }
        // if(isEnteringPostArea == true){
            
        //     isPassedPostArea = true;

        //     // if(k <= listOfLatestFeed.length - 1){
        //     //     if(sourceLines[i] == textOfEndPost){
        //     //         while(k){

        //     //         }
        //     //     }else{
                    
        //     //     }
        //     // }else{
        //     //     // nothing to do.
        //     // }
            
        // }else{
            
        // }
        
        

        
        // if(isEnteringPostArea == true){
        //     console.log(i + "    " + listOfLatestFeed[k]['link']);
        //     console.log(i + "    " + feedUrlZenn.substring(0, numberOfInitial));
            
            
        //     if(sourceLines[i] == textOfEndPost){
        //         sourceLines.splice(i, 0, feed);
        //     }else{
        //         sourceLines[i] = feed;
        //     }
        // }
        // if(sourceLines[i] == textOfStartPost){
        //     // rowOfStartPost = Number(i);
        //     isEnteringPostArea = true;
        // }
    };

    // if(rowOfEndPost - rowOfStartPost != number_of_display + 1){

    // }

    fs.writeFileSync(destFileName, String(destLines.join(separator)));
}

try {
    (async() => {
        listOfLatestFeed = await getLatestFeed(number_of_display, feedUrlZenn, feedUrlQiita);
        console.log(listOfLatestFeed);
        let lines = getTextLines('README.md');
        console.log(lines);
        writeFeedToText(lines, 'testtest.md', listOfLatestFeed, feedUrlZenn, feedUrlQiita);
    })();
} catch (error) {
    console.error(`Execute Step 1: ${error}`);
}

try {
    
} catch (error) {
    console.error(`Execute Step 2: ${error}`);
}



