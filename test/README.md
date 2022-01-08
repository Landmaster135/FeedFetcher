# FeedFetcher_Development
This README.md file shows about the development for "FeedFethcher".

# Test

## Build Docker

```dosbatch
# DockerイメージをBuildする
docker build -t my-nodejs-app .
# Dockerイメージを起動する
docker run -it --rm --name my-running-app my-nodejs-app
```

## Test with Docker
```dosbatch:Execute in the machine by docker.
npm run start
```

```dosbatch:Execute in the windows machine.
docker ps
docker cp <container ID>:/usr/app/testtest.md .
```

# Memo of index.mjs

## writeFeedToText()

![](memo_writeFeedToText.jpg)
