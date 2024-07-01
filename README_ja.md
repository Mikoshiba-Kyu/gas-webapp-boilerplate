![License](https://img.shields.io/github/license/Mikoshiba-Kyu/gas-webapp-boilerplate)
![Downloads](https://img.shields.io/github/downloads/Mikoshiba-Kyu/gas-webapp-boilerplate/total)
![Size](https://img.shields.io/github/languages/code-size/Mikoshiba-Kyu/gas-webapp-boilerplate)

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
![Vite](https://img.shields.io/badge/Vite-565656?logo=vite&style=flat")
![TypeScript](https://img.shields.io/badge/TypeScript-565656?logo=typescript&style=flat")
![React](https://img.shields.io/badge/React-565656?logo=react&style=flat")
![Vitest](https://img.shields.io/badge/Vitest-565656?logo=vitest&style=flat")
![Playwright](https://img.shields.io/badge/Playwright-565656?logo=playwright&style=flat")
![Github Actions](https://img.shields.io/badge/GithubActions-565656?logo=githubactions&style=flat")

# GAS-WebApp-BoilerPlate

Google Apps Script で Web アプリを作成するためのボイラープレートです。  
TypeScript と React での開発を想定しています。

# 特徴

- **DevContainer** を使用しています
- **Vite** と **clasp** により、最終的に Google Apps Script にデプロイするためのファイルを生成します
- ユニットテストは **Vitest**、E2Eテストは **Playwright** でそれぞれ作成できます

# クイックスタート

```
git clone https://github.com/Mikoshiba-Kyu/gas-webapp-boilerplate.git
```

# プロジェクト構成の概要

開発の中核となるコードは `src` フォルダ配下にフロントエンドとバックエンドでそれぞれ配置します。

```
📁 src
├── 📁 backend
│   ├── 📁 serverFunctions
│   │   ├── 📄 index.ts
│   │   └── 📄 and more...
│   └── 📄 main.ts
└── 📁 frontend
    ├── 📄 main.tsx
    └── 📄 and more...
```

`yarn build` によって `gas/dist` フォルダに Google Apps Script 向けのファイルが作成されます。

```
📁 gas
├── 📁 dist
│   ├── 📄 index.html
│   └── 📄 main.js
└── 📄 appsscript.json
```

その他のフォルダについては以下のとおりです。

- `.github`  
   E2Eテスト実行用の Github Actions がプリセットされています
- `.husky`  
   Pre Commit 時の lint がプリセットされています
- `e2e`  
   Playwright のテストファイルを格納します

# 開発

## DecContainerの起動

リポジトリをクローンし、任意の方法で DevContainer を起動します。

## フロントエンドの実装

`src/frontend` 内でフロントエンド側の実装を行います。  
一般的な UI フレームワークや状態管理ライブラリなどが使用できます。

## バックエンドの実装

`SpreadsheetApp` など、Google Apps 特有の class については、フロントエンド側から直接使用することはできません。  
フロントエンドからは `backend/main.ts` で global に露出させた関数を [gas-client](https://github.com/enuchi/gas-client) 経由で呼び出す必要があります。

```typescript
// backend/main.ts

import { sampleFunction } from './serverFunctions'

declare const global: {
  [x: string]: unknown
}

// This function is required to run as a webApp
global.doGet = (): GoogleAppsScript.HTML.HtmlOutput => {
  return HtmlService.createHtmlOutputFromFile('dist/index.html')
}

// Create the necessary functions below.
global.sampleFunction = sampleFunction
```

```typescript
// frontend/App.tsx

import { GASClient } from 'gas-client'
const { serverFunctions } = new GASClient()

...
...

const handleButton = async () => {
    if (import.meta.env.PROD) {
        try {
        const response: number = await serverFunctions.sampleFunction(count)
        setCount(response)
        } catch (err) {
        console.log(err)
        }
    } else {
        setCount(count + 1)
    }
}

...
...
```

> [!NOTE]  
> 上記の例では `import.meta.env.PROD` によって環境による分岐を行っています。  
> `yarn build` で作成し、GASにデプロイされた環境では `serverFunction` が使用され、  
> `yarn dev` によりローカルで動作している場合は代替する方法で動作します。

## テストの作成と実行

### ユニットテスト

```bash
$ yarn test:unit
```

フロントエンドおよびユニットテストについては Vitest を使用します。  
`serverFunctions` に作成した Google Apps 特有の関数をテストする場合はモック化する必要があります。

### E2Eテスト

```bash
$ yarn test:e2e
```

E2Eテストでは Playwright を使用します。  
すでに実行されている GAS の Web アプリの URL を `baseURL` として指定する必要があります。

```typescript
// playwright.config.ts

...
...

use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'your apps url',
  },

...
...
```

> [!IMPORTANT]  
> E2Eテストを行う際は、対象アプリの公開範囲を `全員` にしておく必要があります。

## デプロイ

はじめに、Viteによるコンパイルを行います。

```bash
$ yarn build
```

clasp にログインしていない場合はログインします。

```bash
$ clasp login
```

まだプロジェクトが作成されていない場合は新規作成します。  
以下の操作でプロジェクトを作成すると、ルートに `appsscript.json` が新しく作成されます。  
`gas` フォルダにあらかじめ配置されているものを使用する場合は、こちらは削除してしまって問題ありません。

```bash
$ clasp create

? Create which script?
  standalone
  docs
  sheets
  slides
  forms
> webapp
  api
```

> [!NOTE]  
> すでに作成済みのプロジェクトを使用する場合は、
> ルートに `.clasp.json` を手動で作成し、`scriptId` を直接指定します。

> [!NOTE]  
> `gas/appscript.json`の "timeZone" は状況に応じて設定してください。

作成された `.clasp.json` の `rootDir` を、プロジェクトの `gas` フォルダのパスに書き換えます。

```json
{
  "scriptId": "********",
  "rootDir": "/workspaces/gas-webapp-boilerplate/gas"
}
```

デプロイを実行します。

```bash
$ clasp push
$ clasp deploy
```

デプロイしたプロジェクトページをブラウザで開く場合は以下のコマンドを使用します。

```bash
$ clasp open
```
