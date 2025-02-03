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

test()

after(async () => {
  await mongoose.connection.close();
});