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

after(async () => {
  await mongoose.connection.close();
});