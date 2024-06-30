# GAS-WebApp-BoilerPlate

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

### Launch DecContainer

Clone the repository and start DevContainer in any way you wish.

### Front-end implementation

Implement the front-end side in `src/frontend`.  
Common UI frameworks, state management libraries, etc. can be used.

### Back-end implementation

Google Apps specific classes such as `SpreadsheetApp` cannot be used directly from the front end.  
You must call the function exposed to global in `backend/main.ts` via `gas-client` from the front end.

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

### Creating and running tests

#### Unit testing

```bash
$ yarn test:unit
```

For front-end and unit testing, use Vitest.  
If you want to test Google Apps specific functions created in `serverFunctions`, you need to mock them.

#### E2E testing

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
