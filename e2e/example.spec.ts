import { test, expect, Locator, FrameLocator } from '@playwright/test'

test('Clicking on it makes the count go to 1.', async ({ page }) => {
  await page.goto('')

  /**
   * Web apps running in Google Apps Script are actually content displayed in an iframe.
   * Therefore, any test begins by obtaining the 'FrameLocator' of the target iframe.
   * '#sandboxFrame' in 'page'. And '#userHtmlFrame' inside it.
   */
  const appFrame: FrameLocator = page
    .frameLocator('#sandboxFrame')
    .frameLocator('#userHtmlFrame')

  if (!appFrame) {
    throw new Error('appFrame is not found')
  }

  const countUpButton: Locator = appFrame!.getByRole('button')
  await countUpButton.click()

  await expect(countUpButton).toContainText('1')
})
