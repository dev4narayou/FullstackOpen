const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userExtractor = require("../utils/middleware").userExtractor;

// currently returns all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs).status(200);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!request.user) {
    return response.status(403).json({ error: "user missing" }); // send forbidden code
  }

  // validate the rest of the required fields
  if (!title || !url) {
    return response.status(400).json({ error: "title and url are required" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: request.user.id,
  });

  const savedBlog = await blog.save();
  const populatedBlog = await Blog.findById(savedBlog._id).populate("user", {
    username: 1,
    name: 1,
  });

  return response.status(201).json(populatedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(403).json({ error: "user missing" }); // send forbidden code
  }

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(204).end(); // already gone, or doesn't exist...
  }

  // if the blog does exist, need to verify the user who added is the same one deleting it
  const blogUser = blog.user;
  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(403).json({ error: "user not authorized" });
  }

  // delete the blog
  await blog.deleteOne()

  // update the references in the user
  request.user.blogs = await request.user.blogs.filter((b) => b.id.toString() !== blog.id.toString());
  await request.user.save();
  response.status(204).end();
});

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  try {
    const body = request.body;
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return response.status(404).end();
    }

    response.status(200).json(updatedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

module.exports = blogsRouter;
