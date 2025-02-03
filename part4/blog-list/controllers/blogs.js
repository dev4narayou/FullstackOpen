const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
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
