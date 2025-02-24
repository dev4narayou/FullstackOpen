const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    const user = {
      username: "fakeme",
      name: "fakename",
      password: "fakepassword",
    };
    await request.post("/api/users", {
      data: user,
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    // await page.getByRole("button", { name: "login" }).click();
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("fakeme");
      await page.getByTestId("password").fill("fakepassword");
      await page.getByRole("button", { name: "submit" }).click();
      await expect(page.getByText("fakename logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("wrongusername");
      await page.getByTestId("password").fill("wrongpassword");
      await page.getByRole("button", { name: "submit" }).click();
      const locator = await page.getByText("invalid username or password");
      await expect(locator).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username").fill("fakeme");
      await page.getByTestId("password").fill("fakepassword");
      await page.getByRole("button", { name: "submit" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("a title");
      await page.getByTestId("author").fill("an author");
      await page.getByTestId("url").fill("a url");
      await page.getByRole("button", { name: "create" }).click();
      // the message is displayed
      await expect(page.getByText("Added blog a title by an author")).toBeVisible();
      // the blog is displayed
      await expect(page.getByText("a title an author")).toBeVisible();

    });
  });
});
