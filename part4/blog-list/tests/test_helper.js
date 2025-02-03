const Blog = require("../models/blog");
const initialBlogs = [
  {
    title: "First Blog",
    author: "Author One",
    url: "http://example.com/1",
    likes: 10,
  },
  {
    title: "Second Blog",
    author: "Author Two",
    url: "http://example.com/2",
    likes: 20,
  },
  {
    title: "Third Blog",
    author: "Author Three",
    url: "http://example.com/3",
    likes: 30,
  },
  {
    title: "Fourth Blog",
    author: "Author Four",
    url: "http://example.com/4",
    likes: 40,
  },
  {
    title: "Fifth Blog",
    author: "Author Five",
    url: "http://example.com/5",
    likes: 50,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = { initialBlogs , blogsInDb};