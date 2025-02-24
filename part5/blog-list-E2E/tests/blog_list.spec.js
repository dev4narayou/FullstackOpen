const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // await page.getByRole("button", { name: "login" }).click();
    await page.getByTestId("username").fill("fakeme");
    await page.getByTestId("password").fill("fakepassword");
    await page.getByRole("button", { name: "submit" }).click();
    const locator = await page.getByText("fakenameSCARY logged in")
    await expect(locator).toBeVisible();
  });
});
