import { useState, forwardRef, useEffect } from "react";

const Blog = forwardRef(({ blog, updateBlog, removeBlog, viewingUser, visibility, toggleVisibility }) => {

  const handleLike = () => {
    updateBlog(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id);
    }
  }

  const hideWhenVisible = { display: visibility ? "none" : "" };
  const showWhenVisible = { display: visibility ? "" : "none" };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="defaultVisible">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="defaultHidden">
        {blog.title}
        <button onClick={toggleVisibility}>hide</button>
        <br></br>
        {blog.url}
        <br></br>
        likes {blog.likes}
        <button onClick={handleLike}>like</button>
        <br></br>
        {blog.author}
        <br></br>
        {blog.author === viewingUser && (
          <button onClick={handleRemove}>remove</button>
        )}
      </div>
    </div>
  );
});

export default Blog;
