const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const token = request.token;

  const { title, author, url, likes } = request.body;
  const user = await User.findById(request.user.id);
  const id = user._id;
  const blog = Blog({ title, author, url, likes, user: id });

  const savedBlog = await blog.save();
  const populatedBlog = await Blog.findById(savedBlog._id).populate("user", {
    username: 1,
    name: 1,
  });
  return response.status(201).json(populatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  // verify token
  const token = request.token; // middleware lets this happen
  if (!token) {
    return response.status(401).json({ error: "token invalid" });
  }

  // identify blog
  const blogid = request.params.id;
  const blog = await Blog.findById(blogid);
  if (!blog) {
    return response.status(400).json({ error: "invalid blog id" })
  }

  // verify that the blog to be deleted is by the user making the request
  if (!blog.user.id == request.user.id) {
    return response.status(401).json({error: "unauthorized deletion"})
  }

  // finally delete the blog
  const res = await Blog.findByIdAndDelete(blogid);
  return response.status(204).send(res);
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const blogObj = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(id, blogObj, { new: true });

  if (updatedBlog) {
    response.status(200).json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
