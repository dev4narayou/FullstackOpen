const { test, after, beforeEach } = require("node:test");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const initialBlogs = require("./test_helper").initialBlogs;
const helper = require("./test_helper");
const mongoose = require("mongoose");
const User = require("../models/user");

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

test("adding a user with too short username", async () => {
  await api.post("/api/user").send({
    username: "sh",
    name: "longenoughname",
    password: "longenoughpassword"
  })
  .expect(400);
});

test("adding a user with too short name", async () => {
  await api
    .post("/api/user")
    .send({
        username: "longenoughusername",
        name: "sh",
        password: "longenoughpassword",
      }
    )
    .expect(400);
});

test("too short password", async () => {
  await api
    .post("/api/user")
    .send({
        username: "longenoughusername",
        name: "longenoughname",
        password: "sh",
      }
    )
    .expect(400);
})

after(async () => {
  await mongoose.connection.close();
});