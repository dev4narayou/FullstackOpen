const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);

});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;
  const user = await User.findOne();
  const id = user._id;
  const blog = Blog({title, author, url, likes, user: id})

  const savedBlog = await blog.save()
  const populatedBlog = await Blog.findById(savedBlog._id).populate("user", {
    username: 1,
    name: 1,
  });
  return response.status(201).json(populatedBlog);
});

blogsRouter.delete("/:id", (request, response) => {
  const id = request.params.id;
  Blog.findByIdAndDelete(id).then((result) => {
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).end();
    }
  });
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
