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

[English](https://github.com/Mikoshiba-Kyu/gas-webapp-boilerplate/blob/main/README.md) / [日本語](https://github.com/Mikoshiba-Kyu/gas-webapp-boilerplate/blob/main/README_ja.md)

Boilerplate for creating web apps with Google Apps Script.  
We expect to develop in TypeScript and React.

# Feature

- **DevContainer** is used
- **Vite** and **clasp** generate files for eventual deployment in Google Apps Script
- Unit tests can be created with **Vitest** and E2E tests with **Playwright**

# Quick Start

```
git clone https://github.com/Mikoshiba-Kyu/gas-webapp-boilerplate.git
```

# Overview of Project Structure

The core development code is placed under the `src` folder for the front end and back end, respectively.

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

The `yarn build` creates files for Google Apps Script in the `gas/dist` folder.

```
📁 gas
├── 📁 dist
│   ├── 📄 index.html
│   └── 📄 main.js
└── 📄 appsscript.json
```

Other folders are described below.

- `.github`  
   Preset Github Actions for E2E test execution.
- `.husky`  
   Preset lint at pre commit time.
- `e2e`  
   Stores Playwright test files.

# Development

## Launch DecContainer

Clone the repository and start DevContainer in any way you wish.

## Front-end implementation

Implement the front-end side in `src/frontend`.  
Common UI frameworks, state management libraries, etc. can be used.

## Back-end implementation

Google Apps specific classes such as `SpreadsheetApp` cannot be used directly from the front end.  
You must call the function exposed to global in `backend/main.ts` via [gas-client](https://github.com/enuchi/gas-client) from the front end.

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
> In the above example, `import.meta.env.PROD` is used to branch by environment.  
> If created by `yarn build` and deployed in GAS, the environment uses `serverFunction`,
> And if it is running locally by `yarn dev`, it will work in an alternative way.

## Creating and running tests

### Unit testing

```bash
$ yarn test:unit
```

For front-end and unit testing, use Vitest.  
If you want to test Google Apps specific functions created in `serverFunctions`, you need to mock them.

### E2E testing

```bash
$ yarn test:e2e
```

Playwright is used for E2E testing.  
The URL of an already running GAS web app must be specified as `baseURL`.

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
> When conducting E2E testing, the target application must be made available to `everyone`.

## Deployment

First, compile with Vite.

```bash
$ yarn build
```

If you are not logged in to clasp, log in.

```bash
$ clasp login
```

Create a new project if one has not already been created.  
When you create a project as follows, a new file `appsscript.json` will be created in the root.  
If you want to use the one already placed in the `gas` folder, you can delete it.

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
> If you are using a project that has already been created,  
> manually create `.clasp.json` in the root and specify the `scriptId` directly.

> [!NOTE]  
> Set "timeZone" in `gas/appscript.json` according to your situation.

Replace the `rootDir` in the created `.clasp.json` with the path to the `gas` folder of the project.

```json
{
  "scriptId": "********",
  "rootDir": "/workspaces/gas-webapp-boilerplate/gas"
}
```

Execute deployment.

```bash
$ clasp push
$ clasp deploy
```

To open the deployed project page in a browser, use the following command.

```bash
$ clasp open
```
