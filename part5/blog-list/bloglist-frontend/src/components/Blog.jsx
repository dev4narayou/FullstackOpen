import {useState, forwardRef} from 'react';

const Blog = forwardRef(({ blog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  return (
    <div style={{ border: "1px solid black", padding: "5px", margin: "5px" }}>
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
        <br></br>
        {blog.author}
      </div>
    </div>
  );
});

export default Blog;
