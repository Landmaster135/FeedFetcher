# FeedFetcher
"FeedFetcher" is a tool for displaying the latest RSS or ATOM feed in README.md, and so on.
Use after you create README.md file.

# Install
```dos
npm install https://github.com/Landmaster135/FeedFetcher
```

# Requirement
Your README.md file must hold these sentences in order.

## 1. Start of feed list
```markdown
<!--[START POSTS LIST]-->
```

## 2. End of feed list
```markdown
<!--[END POSTS LIST]-->
```

# Config

## Minimal configuration
```yaml
displayLimit: 5
feedUrlZenn: https://zenn.dev/kinkinbeer135ml/feed
feedUrlQiita: https://qiita.com/Landmaster135/feed.atom
sourceMarkdownFileName: README.md
```

