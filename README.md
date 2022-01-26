# FeedFetcher
"FeedFetcher" is a tool for displaying the latest RSS or ATOM feed in README.md, and so on.
Use after you create README.md file.

# Install
```shell
npm install https://github.com/Landmaster135/feed-fetcher
```

# Run
```shell
./node_modules/feed-fetcher/bin/run --config-yaml=configOfFeedFetcher.yml
```

# Config

Please set config with yaml. File name for config is `configOfFeedFetcher.yml` in default.

## Minimal configuration
```yaml
displayLimit: 5
feedUrlArray:
  - https://zenn.dev/kinkinbeer135ml/feed
  - https://qiita.com/Landmaster135/feed.atom
imgFileNameArray:
  - img/zenn.png
  - img/qiita.png
sourceMarkdownFileName: README.md
postArea:
  start: <!--[START POSTS LIST]-->
  end: <!--[END POSTS LIST]-->
```

## Output

Output is added between postArea.start and postArea.end .

### Raw

```markdown
<!--[START POSTS LIST]-->
- ![](img/qiita.png) [【Node.js】バージョンが古くてfetchが使えんのお](https://qiita.com/Landmaster135/items/19e67db282f2e35d1197)
- ![](img/zenn.png) [【Javascript】連想配列とかをディープコピーする前に](https://zenn.dev/kinkinbeer135ml/articles/79972f1e056887)
- ![](img/zenn.png) [【Docker】ファイル実行できるNode.js環境を作る](https://zenn.dev/kinkinbeer135ml/articles/6369ee73dd1508)
- ![](img/zenn.png) [Web上の画像をGoogleドライブに保存する](https://zenn.dev/kinkinbeer135ml/articles/44a5b20371482e)
- ![](img/zenn.png) [【Javascript】Kindleの蔵書のタイトルだけを一覧で取得するツールを作りました](https://zenn.dev/kinkinbeer135ml/articles/1500f99b37aece)
<!--[END POSTS LIST]-->
```

### Rendered

<!--[START POSTS LIST]-->
- ![](img/qiita.png) [【Node.js】バージョンが古くてfetchが使えんのお](https://qiita.com/Landmaster135/items/19e67db282f2e35d1197)
- ![](img/zenn.png) [【Javascript】連想配列とかをディープコピーする前に](https://zenn.dev/kinkinbeer135ml/articles/79972f1e056887)
- ![](img/zenn.png) [【Docker】ファイル実行できるNode.js環境を作る](https://zenn.dev/kinkinbeer135ml/articles/6369ee73dd1508)
- ![](img/zenn.png) [Web上の画像をGoogleドライブに保存する](https://zenn.dev/kinkinbeer135ml/articles/44a5b20371482e)
- ![](img/zenn.png) [【Javascript】Kindleの蔵書のタイトルだけを一覧で取得するツールを作りました](https://zenn.dev/kinkinbeer135ml/articles/1500f99b37aece)
<!--[END POSTS LIST]-->


