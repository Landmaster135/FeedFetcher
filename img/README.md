# Memo of logic of index.js

## writeFeedToText()

![writeFeedToText](memo_writeFeed.jpg)

# Icons

## Zenn icon

![ZennIcon](zenn.png)

## Qiita icon
![QiitaIcon](qiita.png)

# System overview

```mermaid
graph LR;
    subgraph Overview;
        subgraph Landmaster135;
            A[fab:fa-github GitHub Actions]
            B(README.md)
        end
        subgraph dev environment;
            I[fa:fa-laptop Macbook]
            J[fab:fa-docker Docker]
        end
        subgraph Firebase;
            K[<img src='https://simpleicons.org/icons/firebase.svg' width='20' /><br>Firebase-tools]
            L(<img src='https://simpleicons.org/icons/googlecloud.svg' width='20' /><br>cloud functions)
        end
        subgraph target sites;
            D(<img src='https://simpleicons.org/icons/zenn.svg' width='20' /><br>Zenn)
            E(<img src='https://simpleicons.org/icons/qiita.svg' width='20' /><br>Qiita)
            F(<img src='https://simpleicons.org/icons/wordpress.svg' width='20' /><br>WordPress)
            M(far:fa-sticky-note<br>note)
        end
        subgraph feed-fetcher: app;
            C[fab:fa-node feed-fetch]
        end
        A -->|Step2. Update| B
        A -->|Step1. Install app: GET| C
        C -->|Step1. Install app: Response| A
        C -->|GET| D
        D -->|Response <br>with feed|C
        C -->|GET| E
        E -->|Response <br>with feed|C
        C -->|GET| F
        F -->|Response <br>with feed|C
        C -->|GET| L
        L -->|Response <br>with feed|C
        L -->|GET| M
        M -->|Response <br>with feed|L
        C -->|clone| I
        I -->|build &<br> copy source| J
        J -->|test source| I
        I -->|Request<br>to deploy|K
        I -->|push| C
        K -->|deploy<br>functions| L
        style D fill:#ffffff,color:#000000,stroke:#000000,stroke-width:2
        style E fill:#ffffff,color:#000000,stroke:#000000,stroke-width:2
        style F fill:#ffffff,color:#000000,stroke:#000000,stroke-width:2
        style K fill:#ffffff,color:#000000,stroke:#000000,stroke-width:2
        style L fill:#ffffff,color:#000000,stroke:#000000,stroke-width:2
        style M fill:#ffffff,color:#000000,stroke:#000000,stroke-width:2
        linkStyle 0 stroke:#ee3,stroke-width:4px
        linkStyle 1 stroke:#ee3,stroke-width:4px
        linkStyle 2 stroke:#ee3,stroke-width:4px
    end
    style Overview fill:#3c4451
```

