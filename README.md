# 'What's New' Demo

A Vue SPA news aggregator demo site.
This repository contains the starter code for the Daily Ocean article that demonstrates how to make a Vue-based SPA offline-available.

## Local Development Setup

- **Fork** the repository. This step is key to creating your own personal copy of the project in your GitHub account.
- Clone the repository to your computer
```
git clone https://github.com/{your-github-username}/whats-new.git
```
- Checkout the starter branch by running the following command
```
git checkout do/starter-code
```
- If you don't have one yet, get an API key from [News API](https://newsapi.org/).
- Create a copy of `.env.example` file and rename it to `.env`
- Replace the placeholder `your-news-api-key` value for `VITE_NEWS_API_KEY` with your API key from [News API](https://newsapi.org/) and save the `.env` file.
- Install the project dependencies
```
npm install
```
- To run the project locally, run the command below:
```
npm run dev
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
