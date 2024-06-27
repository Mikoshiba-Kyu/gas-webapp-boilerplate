import { expect, test } from "vitest";
import { sampleFunction } from "../src/backend/serverFunctions/index";

test("If 1 is given, 2 is returned.", () => {
  expect(sampleFunction(1)).toBe(2);
});
