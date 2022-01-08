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

### Execute in the machine by docker.

```dosbatch
npm run start
```

### Execute in the windows machine while the machine being booted by docker.

```dosbatch
docker ps
docker cp <container ID>:/usr/app/testtest.md .
```

## Test with Jast
Put test file into `__test__` folder to test with Jset.
Input this command to test with jest.

```dosbatch
npx jest
```

# Memo of index.mjs

## writeFeedToText()

![](memo_writeFeedToText.jpg)
