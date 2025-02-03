const { test, after, beforeEach } = require("node:test");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const initialBlogs = require("./test_helper").initialBlogs;
const mongoose = require("mongoose");

const Blog = require("../models/blog");
const assert = require("node:assert");

// initialise the db
beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

"verifies that a blog can be correctly added to the db", async () => {
  const newBlog = {
    title: "verifying that a blog can be added to the db",
    author:"author of the blog",
    url: "http://example.com/with-an-id",
    likes: 101,

  }
}
test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});

test(
  "verifies that with an object w/ id, by default the database names the property _id.", async () => {
    const object = Blog({
      title: "blog with an id!",
      author: "author with an id!",
      url: "http://example.com/with-an-id",
      likes: 101,
      id: "this is an id"
    })

    await object.save();
    const retrievedBlogObject = await Blog.findOne({ title: "blog with an id!" });
    console.log(retrievedBlogObject);
    assert.strictEqual(retrievedBlogObject._id.toString(), object.id);
  }
);

test(
  "verifies that a blog can be correctly added to the db", async () => {
    const newBlog = {
      title: "verifying that a blog can be added to the db",
      author:"author of the blog",
      url: "http://example.com/with-an-id",
      likes: 1312
    }

    const numPrevBlogs = (await Blog.find({})).length;

    const res = await api.post("/api/blogs").send(newBlog);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(numPrevBlogs + 1, (await Blog.find({})).length);

    const retrievedBlogObject = await Blog.findOne({ title: "verifying that a blog can be added to the db" });
    assert.strictEqual(retrievedBlogObject.title, newBlog.title);
    assert.strictEqual(retrievedBlogObject.author, newBlog.author);
    assert.strictEqual(retrievedBlogObject.url, newBlog.url);
    assert.strictEqual(retrievedBlogObject.likes, newBlog.likes);
  }
)

test("verifies that if the likes property is missing, it will default to 0", async () => {
  const newBlog = Blog({
    title: "no likes",
    author: "author with no likes",
    url: "http://example.com/with-no-likes",
  });

  await newBlog.save();
  const retrievedBlogObject = await Blog.findOne({ title: "no likes" });
  assert.strictEqual(retrievedBlogObject.likes, 0);
});

test.only("verifies that when creating a new blog, if the title is missing, a 404 is returned"),
  async () => {
    const testBlog = Blog({
      author: "test author",
      url: "http://testauthor.com",
      likes: 11
    })

    const res = await testBlog.save();
    assert.strictEqual(res.status, 404);
  }

after(async () => {
  await mongoose.connection.close();
});