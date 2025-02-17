import { useState, forwardRef } from "react";

const Blog = forwardRef(({ blog, updateBlog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    updateBlog(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
  };

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={hideWhenVisible}>
        {blog.title}
        <button onClick={toggleVisibility}>hide</button>
        <br></br>
        {blog.url}
        <br></br>
        {blog.likes}
        <button onClick={handleLike}>like</button>
        <br></br>
        {blog.author}
      </div>
    </div>
  );
});

export default Blog;
