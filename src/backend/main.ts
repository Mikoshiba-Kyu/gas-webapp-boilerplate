import { sampleFunction } from "./serverFunctions";

declare const global: {
  [x: string]: unknown;
};

// This function is required to run as a webApp
global.doGet = (): GoogleAppsScript.HTML.HtmlOutput => {
  return HtmlService.createHtmlOutputFromFile("dist/index.html");
};

// Create the necessary functions below.
global.sampleFunction = sampleFunction;
