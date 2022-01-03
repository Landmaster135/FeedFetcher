# FeedFetcher

## Test

### Build Docker

```dos
# DockerイメージをBuildする
docker build -t my-nodejs-app .
# Dockerイメージを起動する
docker run -it --rm --name my-running-app my-nodejs-app
```

### Test with Docker

```dos
docker ps
docker cp <container ID>:/usr/app/testtest.md .
```

## Memo of Execution

![](test/memo_writeFeedToText.jpg)
