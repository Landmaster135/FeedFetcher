// const methods = require("./../lib/lib-methods.js");
// import * as methods from "../lib/lib-methods";

import path from "path";
import url from "url";
import fs from "fs";

import _ from "lodash";

import fetch from "node-fetch";
jest.mock("node-fetch", () => jest.fn())

import {loadYamlFile,
  getTextLines,
  isLinkMatchedFeedUrl,
  writeFeedToText,
  writeImageScaling} from "../lib/lib-methods";

class TestClassForWriteFeed{
  constructor(){
    this.expctedPostArea = {"start": "<!--[START POSTS LIST]-->", "end": "<!--[END POSTS LIST]-->"};
    this.expectedLines = [this.expctedPostArea["start"],
    "- ![](img/endorphinbath.png) [【Node.js】Markdown内のimgタグの画像の大きさを変える。](https://www.endorphinbath.com/nodejs-markdown-scale-image/)",
    "- ![](img/endorphinbath.png) [【Node.js】GitHub ActionsでREADME.mdに投稿した記事のリンクを表示する（FirebaseでCORS対応）](https://www.endorphinbath.com/nodejs-readme-display-feed/)",
    "- ![](img/endorphinbath.png) [【Node.js】Seleniumでテスト自動化ツール用ライブラリを作った](https://www.endorphinbath.com/nodejs-selenium-auto-test-library/)",
    this.expctedPostArea["end"],
    ""];
    this.listOfLatestFeed = [
      {
        "title": "【Node.js】Markdown内のimgタグの画像の大きさを変える。",
        "link": "https://www.endorphinbath.com/nodejs-markdown-scale-image/",
        "pubDate": "2022-01-29 14:24:00",
        "imgFileName": "img/endorphinbath.png"
      },
      {
        "title": "【Node.js】GitHub ActionsでREADME.mdに投稿した記事のリンクを表示する（FirebaseでCORS対応）",
        "link": "https://www.endorphinbath.com/nodejs-readme-display-feed/",
        "pubDate": "2022-01-29 14:19:00",
        "imgFileName": "img/endorphinbath.png"
      },
      {
        "title": "【Node.js】Seleniumでテスト自動化ツール用ライブラリを作った",
        "link": "https://www.endorphinbath.com/nodejs-selenium-auto-test-library/",
        "pubDate": "2022-01-23 15:25:14",
        "imgFileName": "img/endorphinbath.png"
      }
    ];
  }
}

class TestClassForImageScale{
  constructor(number){
    this.number = number;
    this.expctedImageArea = {"start": "<!--[START IMAGE LIST]-->", "end": "<!--[END IMAGE LIST]-->"};
    this.expectedLines = [
      "<p align=\"left\">",
      this.expctedImageArea["start"],
      `  <img height=\"${this.number}em\" alt=\"Python\" src=\"https://www.vectorlogo.zone/logos/python/python-icon.svg\">`,
      `  <img height=\"${this.number}em\" alt=\"Google Apps Script\" src=\"https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Apps_Script.svg\">`,
      `  <img height=\"${this.number}em\" alt=\"Node.js\" src=\"https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg\">`,
      `  <img height=\"${this.number}em\" alt=\"AppSheet\" src=\"https://upload.wikimedia.org/wikipedia/commons/5/52/AppSheet_Logo.svg\">`,
      this.expctedImageArea["end"],
      "</p>",
      ""
    ];
  }
}

class TestClassForFeedFetch{
  constructor(){
    this.jsonOfDummyResponse = {
      "status": "ok",
      "feed": {
        "url": "https://zenn.dev/kinkinbeer135ml/feed",
        "title": "kinkinbeer135mlさんのフィード",
        "link": "https://zenn.dev/kinkinbeer135ml",
        "author": "",
        "description": "Zennのkinkinbeer135mlさん（@kinkinbeer135ml）のフィード",
        "image": "https://zenn.dev/images/logo-only-dark.png"
      },
      "items": [
        {
          "title": "【Node.js】Qiita/Zennの投稿をGitHubのProfileに自動反映する。（半分ポエム）",
          "pubDate": "2022-01-09 16:41:51",
          "link": "https://zenn.dev/kinkinbeer135ml/articles/968c7f8a5f0767",
          "guid": "https://zenn.dev/kinkinbeer135ml/articles/968c7f8a5f0767",
          "author": "kinkinbeer135ml",
          "thumbnail": "",
          "description": "はじまり\n" +
            "以下３つのお勉強のため、今回のツールを作りました。\n" +
            "\n" +
            "RSSフィードを読み取る\n" +
            "Node.jsを触る\n" +
            "GitHub Actionを作る\n" +
            "\n" +
            "３つとも初めての試みでしたが、以下の３つの先人の知恵を参考に取り組みました。（他にも沢山情報を見ましたが、一旦以下だけの紹介で・・・）\n" +
            "こちらは、小さい構成で作られているので、ざっくりと理解するのに役立ちました。\n" +
            "https://github.com/mikkame/mikkame\n" +
            "こちらは、RSSフィードを読み取って捏ねる部分をアプリで作っているので、アプリとしてActionを実行するのに参考になりました。\n" +
            "https://zenn.d...",
          "content": "はじまり\n" +
            "以下３つのお勉強のため、今回のツールを作りました。\n" +
            "\n" +
            "RSSフィードを読み取る\n" +
            "Node.jsを触る\n" +
            "GitHub Actionを作る\n" +
            "\n" +
            "３つとも初めての試みでしたが、以下の３つの先人の知恵を参考に取り組みました。（他にも沢山情報を見ましたが、一旦以下だけの紹介で・・・）\n" +
            "こちらは、小さい構成で作られているので、ざっくりと理解するのに役立ちました。\n" +
            "https://github.com/mikkame/mikkame\n" +
            "こちらは、RSSフィードを読み取って捏ねる部分をアプリで作っているので、アプリとしてActionを実行するのに参考になりました。\n" +
            "https://zenn.d...",
          "enclosure": [Object],
          "categories": []
        },
        {
          "title": "【Markdown】Mermaid.jsで使えない？文字",
          "pubDate": "2022-01-23 12:06:53",
          "link": "https://zenn.dev/kinkinbeer135ml/articles/f08ce790091aca",
          "guid": "https://zenn.dev/kinkinbeer135ml/articles/f08ce790091aca",
          "author": "kinkinbeer135ml",
          "thumbnail": "",
          "description": "はじまり\n" +
            "この記事を書いた発端は、以下の記述をしたときのことです。\n" +
            "\n" +
            " 動く記述\n" +
            "\n" +
            "動く.md\n" +
            "```mermaid\n" +
            "graph LR;\n" +
            "\tA[開発]--&gt;B[テスト動作確認];\n" +
            "\tB--&gt;C[結合環境にマージ];\n" +
            "\n" +
            "graph LR;\n" +
            "\tA[開発]--&gt;B[テスト動作確認];\n" +
            "\tB--&gt;C[結合環境にマージ];\n" +
            " 動かない記述\n" +
            "\n" +
            "動かない.md\n" +
            "```mermaid:\n" +
            "graph LR;\n" +
            "\tA[開発]--&gt;B[テスト・動作確認];\n" +
            "\tB--&gt;C[結合環境にマージ];\n" +
            "\n" +
            "graph LR;\n" +
            "\tA[開発]--&gt;B[テスト・動作確認];\n" +
            "\tB--...",
          "content": "はじまり\n" +
            "この記事を書いた発端は、以下の記述をしたときのことです。\n" +
            "\n" +
            " 動く記述\n" +
            "\n" +
            "動く.md\n" +
            "```mermaid\n" +
            "graph LR;\n" +
            "\tA[開発]--&gt;B[テスト動作確認];\n" +
            "\tB--&gt;C[結合環境にマージ];\n" +
            "\n" +
            "graph LR;\n" +
            "\tA[開発]--&gt;B[テスト動作確認];\n" +
            "\tB--&gt;C[結合環境にマージ];\n" +
            " 動かない記述\n" +
            "\n" +
            "動かない.md\n" +
            "```mermaid:\n" +
            "graph LR;\n" +
            "\tA[開発]--&gt;B[テスト・動作確認];\n" +
            "\tB--&gt;C[結合環境にマージ];\n" +
            "\n" +
            "graph LR;\n" +
            "\tA[開発]--&gt;B[テスト・動作確認];\n" +
            "\tB--...",
          "enclosure": [Object],
          "categories": []
        },
        {
          "title": "Web上の画像をGoogleドライブに保存する",
          "pubDate": "2021-12-26 10:06:05",
          "link": "https://zenn.dev/kinkinbeer135ml/articles/44a5b20371482e",
          "guid": "https://zenn.dev/kinkinbeer135ml/articles/44a5b20371482e",
          "author": "kinkinbeer135ml",
          "thumbnail": "",
          "description": "はじまり\n" +
            "以前にkindleの蔵書のタイトル一覧を読み取るツールを作ったのですが画像も欲しくなり、それを作るまでの記事になります。以前の記事はこれ。\n" +
            "https://zenn.dev/kinkinbeer135ml/articles/1500f99b37aece\n" +
            "\n" +
            " Chrome Extension APIは断念・・・\n" +
            "まず、参考にしたソースが、この拡張機能です。\n" +
            "https://chrome.google.com/webstore/detail/image-downloader/cnpniohnfphhjihaiiggeabnkjhpaldj\n" +
            "機能は正に僕がやろうとしていることなの...",
          "content": "はじまり\n" +
            "以前にkindleの蔵書のタイトル一覧を読み取るツールを作ったのですが画像も欲しくなり、それを作るまでの記事になります。以前の記事はこれ。\n" +
            "https://zenn.dev/kinkinbeer135ml/articles/1500f99b37aece\n" +
            "\n" +
            " Chrome Extension APIは断念・・・\n" +
            "まず、参考にしたソースが、この拡張機能です。\n" +
            "https://chrome.google.com/webstore/detail/image-downloader/cnpniohnfphhjihaiiggeabnkjhpaldj\n" +
            "機能は正に僕がやろうとしていることなの...",
          "enclosure": [Object],
          "categories": []
        },
        {
          "title": "【Python】ジェネレータとyieldでちと遊んだ",
          "pubDate": "2021-12-19 13:41:03",
          "link": "https://zenn.dev/kinkinbeer135ml/articles/60077154c86228",
          "guid": "https://zenn.dev/kinkinbeer135ml/articles/60077154c86228",
          "author": "kinkinbeer135ml",
          "thumbnail": "",
          "description": "はじまり\n" +
            "どこかのソースでyield()を使ったソースを見つけたので、どんな動きをするんだろうかと遊んでみました。\n" +
            "\n" +
            " 基本的な動き\n" +
            "以下のgenerator()のようにyield()を使用して値を返すやつがジェネレータと呼ばれるやつです。returnだと関数が終了してしまいますが、yieldだと関数が一時停止してくれる。\n" +
            "def generator():\n" +
            "    yield('1')\n" +
            "    yield('2')\n" +
            "    yield('3')\n" +
            "    \n" +
            "g = generator()\n" +
            "for i in generator():\n" +
            "    print(i, end=', ')\n" +
            "for ...",
          "content": "はじまり\n" +
            "どこかのソースでyield()を使ったソースを見つけたので、どんな動きをするんだろうかと遊んでみました。\n" +
            "\n" +
            " 基本的な動き\n" +
            "以下のgenerator()のようにyield()を使用して値を返すやつがジェネレータと呼ばれるやつです。returnだと関数が終了してしまいますが、yieldだと関数が一時停止してくれる。\n" +
            "def generator():\n" +
            "    yield('1')\n" +
            "    yield('2')\n" +
            "    yield('3')\n" +
            "    \n" +
            "g = generator()\n" +
            "for i in generator():\n" +
            "    print(i, end=', ')\n" +
            "for ...",
          "enclosure": [Object],
          "categories": []
        }
      ]
    };
    this.expectedArrayLatestFeed = [
      {
        "title": "【Markdown】Mermaid.jsで使えない？文字",
        "link": "https://zenn.dev/kinkinbeer135ml/articles/f08ce790091aca",
        "pubDate": "2022-01-23 12:06:53",
        "imgFileName": "img/zenn.png"
      },
      {
        "title": "【Node.js】Qiita/Zennの投稿をGitHubのProfileに自動反映する。（半分ポエム）",
        "pubDate": "2022-01-09 16:41:51",
        "link": "https://zenn.dev/kinkinbeer135ml/articles/968c7f8a5f0767",
        "imgFileName": "img/zenn.png"
      },
      {
        "title": "Web上の画像をGoogleドライブに保存する",
        "pubDate": "2021-12-26 10:06:05",
        "link": "https://zenn.dev/kinkinbeer135ml/articles/44a5b20371482e",
        "imgFileName": "img/zenn.png"
      }
    ];
    this.initialOfLink = "https://zenn.dev/";
    this.expectedLengthOfArrayLatestFeed = this.expectedArrayLatestFeed.length;
  }
  executeTest(testList, expectedArray){
    const initialOfDate1 = "2022";
    const initialOfDate2 = `${initialOfDate1}"-01"`;
    const initialOfDate3 = `${initialOfDate2}"-23"`;
    const initialOfDate4 = `${initialOfDate3}" 12"`;
    const initialOfDate5 = `${initialOfDate4}":06"`;
    const lengthOfInitialOfDate1 = initialOfDate1.length;
    const lengthOfInitialOfDate2 = initialOfDate2.length;
    const lengthOfInitialOfDate3 = initialOfDate3.length;
    const lengthOfInitialOfDate4 = initialOfDate4.length;
    const lengthOfInitialOfDate5 = initialOfDate5.length;

    expect(testList.length).toBe(expectedArray.length);
    expect(testList[0]["link"].substring(0, this.initialOfLink.length)).toBe(expectedArray[0]["link"].substring(0, this.initialOfLink.length));
    [lengthOfInitialOfDate1,
      lengthOfInitialOfDate2,
      lengthOfInitialOfDate3,
      lengthOfInitialOfDate4,
      lengthOfInitialOfDate5
    ].forEach(length => {
      expect(testList[0]["pubDate"].substring(length-1, length)).toBe(expectedArray[0]["pubDate"].substring(length-1, length));
    })
    expect(testList[0]["imgFileName"].substring(0, this.initialOfLink.length)).toBe(expectedArray[0]["imgFileName"].substring(0, this.initialOfLink.length));
  }
}

test("loadYamlFile", () => {
  let expectedObject = {};
  expectedObject["testNumber"] = 100;
  expectedObject["testString"] = "README.md";
  expectedObject["testArrayNumber"] = [1, 3];
  expectedObject["testArrayString"] = ["One", "three", "five"];
  expectedObject["testObject"] = {"ichi": "ichiichi", "ni": "nini"};

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const testYamlFileName = "testYaml.yml";
  let testObject = loadYamlFile(path.join(__dirname, testYamlFileName));

  expect(testObject["testNumber"]).toBe(expectedObject["testNumber"]);
  expect(testObject["testString"]).toBe(expectedObject["testString"]);
  expect(testObject["testArrayNumber"]).toStrictEqual(expectedObject["testArrayNumber"]);
  expect(testObject["testArrayString"]).toStrictEqual(expectedObject["testArrayString"]);
  expect(testObject["testObject"]).toStrictEqual(expectedObject["testObject"]);
});

test("getPartOfDataList", async() => {
  let expectedArray  = [];
  let expectedObject = {};
  expectedObject["title"] = "test1";
  expectedObject["link"]  = "https://zenn.dev/kinkinbeer135ml/articles/6369ee73dd1508";
  expectedObject["pubDate"]     = "2022-11-09 16:41:51";
  expectedObject["imgFileName"] = "img/zenn.png";
  expectedArray.push(await _.cloneDeep(expectedObject));
  expectedObject["title"] = "test2";
  expectedObject["link"]  = "https://zenn.dev/kinkinbeer135ml/articles/f08ce790091aca";
  expectedObject["pubDate"]     = "2022-01-23 12:06:53";
  expectedObject["imgFileName"] = "img/zenn.png";
  expectedArray.push(await _.cloneDeep(expectedObject));
  expectedObject["title"] = "test3";
  expectedObject["link"]  = "https://zenn.dev/kinkinbeer135ml/articles/968c7f8a5f0767";
  expectedObject["pubDate"]     = "2022-12-12 12:06:53";
  expectedObject["imgFileName"] = "img/zenn.png";
  expectedArray.push(await _.cloneDeep(expectedObject));
  expectedObject["title"] = "test4";
  expectedObject["link"]  = "https://zenn.dev/kinkinbeer135ml/articles/968c7f8a5f0767";
  expectedObject["pubDate"]     = "2022-12-03 04:06:53";
  expectedObject["imgFileName"] = "img/zenn.png";
  expectedArray.push(await _.cloneDeep(expectedObject));

  const testClassForFetch = new TestClassForFeedFetch();
  const dummyResponse = Promise.resolve({
    ok: true,
    status: 200,
    json: () => {
      return testClassForFetch.jsonOfDummyResponse;
    },
  });
  fetch.mockImplementation(() => dummyResponse)
  await dummyResponse;

  let methods = require("../lib/lib-methods");
  const testNumber      = 4;
  const testUrl         = "https://zenn.dev/kinkinbeer135ml/feed";
  const testImgFileName = "img/zenn.png";
  let testList = await methods.getPartOfDataList(testNumber, testUrl, testImgFileName);

  testClassForFetch.executeTest(testList, expectedArray);

});

test("getLatestFeed: normal", async() => {
  const testClassForFetch = new TestClassForFeedFetch();
  const dummyResponse = Promise.resolve({
    ok: true,
    status: 200,
    json: () => {
      return testClassForFetch.jsonOfDummyResponse;
    },
  });
  fetch.mockImplementation(() => dummyResponse)
  await dummyResponse;

  let methods = require("../lib/lib-methods");
  const testNumber      = testClassForFetch.expectedLengthOfArrayLatestFeed;
  const testUrl         = "https://zenn.dev/kinkinbeer135ml/feed";
  const testImgFileName = "img/zenn.png";

  let testList = await methods.getLatestFeed(testNumber, [testUrl], [testImgFileName]);

  testClassForFetch.executeTest(testList, testClassForFetch.expectedArrayLatestFeed);
  expect(testList).toStrictEqual(testClassForFetch.expectedArrayLatestFeed);
});

test("getLatestFeed: abnormal01", async() => {
  const testNumber = 2;
  await expect(async() => {
    let methods = require("../lib/lib-methods");
    await methods.getLatestFeed(testNumber);
  }).rejects.toEqual(new Error("LessArgumentsException: Number of argument is more than 2."));
});

test("getLatestFeed: abnormal02", async() => {
  const testNumber = 2;
  await expect(async() => {
    let methods = require("../lib/lib-methods");
    await methods.getLatestFeed(testNumber, []);
  }).rejects.toEqual(new Error("ArrayLengthException: Length of array must be more than 1."));
});

test("getTextLines", () => {
  const expectedArray = ["test","123","😂hogehage",""];

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const testMdFileName = "testReadMarkdown.md";
  const testArray = getTextLines(path.join(__dirname, testMdFileName));

  for(let i = 0; i < expectedArray.length; i++){
    expect(expectedArray[i]).toBe(testArray[i]);
  }
});

test("isLinkMatchedFeedUrl", () => {
  const testInitialImgTag = "  <a href=\"";
  const testNumberOfInitial = testInitialImgTag.length;

  const testLines1 = ["  <a href=\"https://www.google.com/?hl=ja\">test1<\/a>", "  <a href=\"https://www.google.com/?hl=ja\">test2<\/a>"]
  let testBool;
  for(let i = 0; i < testLines1.length; i++){
    testBool = isLinkMatchedFeedUrl(testLines1[i], testInitialImgTag, testNumberOfInitial);
    expect(true).toBe(testBool);
  }

  const testLines2 = ["  <a hreflang=\"ja\">test1<\/a>", "  <a hreflang=\"ja\">test2<\/a>"]
  for(let i = 0; i < testLines2.length; i++){
    testBool = isLinkMatchedFeedUrl(testLines2[i], testInitialImgTag, testNumberOfInitial);
    expect(false).toBe(testBool);
  }
});

test("writeFeedToTextAdd01", () => {
  const testClassForWrite = new TestClassForWriteFeed();

  const beforeLines = ["<!--[START POSTS LIST]-->","","<!--[END POSTS LIST]-->",""];
  const sourceMdFileName = "testWriteMarkdown01-01.md";
  const __dirname        = path.dirname(url.fileURLToPath(import.meta.url));
  const filename         = path.join(__dirname, sourceMdFileName)
  const expctedPostArea  = testClassForWrite.expctedPostArea;
  const listOfLatestFeed = testClassForWrite.listOfLatestFeed;
  writeFeedToText(beforeLines, filename, expctedPostArea, listOfLatestFeed);

  const testText  = fs.readFileSync(filename, "utf8");
  const separator = "\n";
  let   afterLines    = testText.toString().split(separator);
  const expectedLines = testClassForWrite.expectedLines;
  expect(expectedLines).toStrictEqual(afterLines);
});

test("writeFeedToTextAdd02", () => {
  const testClassForWrite = new TestClassForWriteFeed();

  const beforeLines = [
    "<!--[START POSTS LIST]-->",
    "- ![](img/endorphinbath.png) [【Node.js】。](https://www.endorphinbath.com/nodejs-markdown-scale-image/)",
    "- ![](img/endorphinbath.png) [【Node.js】GitHub Actionsでる（FirebaseでCORS対応）](https://www.endorphinbath.com/nodejs-readme-display-feed/)",
    "<!--[END POSTS LIST]-->",""
  ];
  const sourceMdFileName = "testWriteMarkdown01-02.md";
  const __dirname        = path.dirname(url.fileURLToPath(import.meta.url));
  const filename         = path.join(__dirname, sourceMdFileName)
  const expctedPostArea  = testClassForWrite.expctedPostArea;
  const listOfLatestFeed = testClassForWrite.listOfLatestFeed;
  writeFeedToText(beforeLines, filename, expctedPostArea, listOfLatestFeed);

  const testText  = fs.readFileSync(filename, "utf8");
  const separator = "\n";
  let   afterLines    = testText.toString().split(separator);
  const expectedLines = testClassForWrite.expectedLines;
  expect(expectedLines).toStrictEqual(afterLines);
});

test("writeFeedToTextSubtract", () => {
  const testClassForWrite = new TestClassForWriteFeed();

  const beforeLines = [
    "<!--[START POSTS LIST]-->",
    "- ![](img/endorphinbath.png) [【Node.js】。](https://www.endorphinbath.com/nodejs-markdown-scale-image/)",
    "- ![](img/endorphinbath.png) [【Node.js】GitHub Actionsでる（FirebaseでCORS対応）](https://www.endorphinbath.com/nodejs-readme-display-feed/)",
    "- ![](img/endorphinbath.png) [【Python】。](https://www.endorphinbath.com/nodejs-markdown-scale-image/)",
    "- ![](img/endorphinbath.png) [【GAS】GitHub Actionsでる（FirebaseでCORS対応）](https://www.endorphinbath.com/nodejs-readme-display-feed/)","<!--[END POSTS LIST]-->",""
  ];
  const sourceMdFileName = "testWriteMarkdown01-03.md";
  const __dirname        = path.dirname(url.fileURLToPath(import.meta.url));
  const filename         = path.join(__dirname, sourceMdFileName)
  const expctedPostArea  = testClassForWrite.expctedPostArea;
  const listOfLatestFeed = testClassForWrite.listOfLatestFeed;
  writeFeedToText(beforeLines, filename, expctedPostArea, listOfLatestFeed);

  const testText  = fs.readFileSync(filename, "utf8");
  const separator = "\n";
  const afterLines    = testText.toString().split(separator);
  const expectedLines = testClassForWrite.expectedLines;
  expect(expectedLines).toStrictEqual(afterLines);
});

test("writeImageScaling", () => {
  const expectedSizeEm = 20.3;
  const testClassForImageScale = new TestClassForImageScale(expectedSizeEm);

  const beforeLines = [
    "<p align=\"left\">",
    testClassForImageScale.expctedImageArea["start"],
    "  <img height=\"30.2em\" alt=\"Python\" src=\"https://www.vectorlogo.zone/logos/python/python-icon.svg\">",
    "  <img height=\"30.2em\" alt=\"Google Apps Script\" src=\"https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Apps_Script.svg\">",
    "  <img height=\"30.2em\" alt=\"Node.js\" src=\"https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg\">",
    "  <img height=\"30.2em\" alt=\"AppSheet\" src=\"https://upload.wikimedia.org/wikipedia/commons/5/52/AppSheet_Logo.svg\">",
    testClassForImageScale.expctedImageArea["end"],
    "</p>",
    ""
  ];
  const sourceMdFileName = "testWriteMarkdown02-01.md";
  const __dirname        = path.dirname(url.fileURLToPath(import.meta.url));
  const filename         = path.join(__dirname, sourceMdFileName)
  const expctedImageArea = testClassForImageScale.expctedImageArea;
  writeImageScaling(beforeLines, filename, expctedImageArea, expectedSizeEm);

  const testText  = fs.readFileSync(filename, "utf8");
  const separator = "\n";
  const afterLines    = testText.toString().split(separator);
  const expectedLines = testClassForImageScale.expectedLines;
  expect(expectedLines).toStrictEqual(afterLines);
});
