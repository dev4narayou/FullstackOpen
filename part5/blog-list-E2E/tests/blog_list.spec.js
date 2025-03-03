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
      await expect(
        page.getByText("invalid username or password")
      ).toBeVisible();
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
      await expect(
        page.getByText("Added blog a title by an author")
      ).toBeVisible();
      await expect(page.getByText("a title an author")).toBeVisible();
    });

    describe("When a blog exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "new blog" }).click();
        await page.getByTestId("title").fill("a title");
        await page.getByTestId("author").fill("fakename");
        await page.getByTestId("url").fill("a url");
        await page.getByRole("button", { name: "create" }).click();
      });

      test("a user can like a blog", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("the same user can delete the blog", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();
        await expect(
          page.getByText("Blog was removed successfully")
        ).toBeVisible();
        await expect(
          page.getByText("a title fakename").isHidden()
        ).toBeTruthy();
      });
    });

    describe("When multiple blogs exist", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "new blog" }).click();
        await page.getByTestId("title").fill("a title");
        await page.getByTestId("author").fill("fakename");
        await page.getByTestId("url").fill("a url");
        await page.getByRole("button", { name: "create" }).click();

        await page.getByRole("button", { name: "new blog" }).click();
        await page.getByTestId("title").fill("another title");
        await page.getByTestId("author").fill("fakename");
        await page.getByTestId("url").fill("another url");
        await page.getByRole("button", { name: "create" }).click();

        await page.getByRole("button", { name: "new blog" }).click();
        await page.getByTestId("title").fill("yet another title");
        await page.getByTestId("author").fill("fakename");
        await page.getByTestId("url").fill("yet another url");
        await page.getByRole("button", { name: "create" }).click();
      });

      test("blogs are ordered by likes", async ({ page }) => {
        const locator = await page.getByRole("button", { name: "view" });
        const blogs = await locator.all();
        blogs.forEach((element) => {
          element.click();
        });
        const likeCountSpans = await page.getByTestId("like-count").all();
        const likeCounts = await Promise.all(
          likeCountSpans.map(async (span) => {
            return parseInt((await span.innerText()).replace("likes ", ""), 10);
          })
        );
        const sortedLikeCounts = [...likeCounts].sort((a, b) => b - a);
        expect(likeCounts).toEqual(sortedLikeCounts);
      });
    });
  });
});
