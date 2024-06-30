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

### DecContainerの起動

リポジトリをクローンし、任意の方法で DevContainer を起動します。

### フロントエンドの実装

`src/frontend` 内でフロントエンド側の実装を行います。  
一般的な UI フレームワークや状態管理ライブラリなどが使用できます。

### バックエンドの実装

`SpreadsheetApp` など、Google Apps 特有の class については、フロントエンド側から直接使用することはできません。  
フロントエンドからは `backend/main.ts` で global に露出させた関数を `gas-client` 経由で呼び出す必要があります。

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

### テストの作成と実行

#### ユニットテスト

```bash
$ yarn test:unit
```

フロントエンドおよびユニットテストについては Vitest を使用します。  
`serverFunctions` に作成した Google Apps 特有の関数をテストする場合はモック化する必要があります。

#### E2Eテスト

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