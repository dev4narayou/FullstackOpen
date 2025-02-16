import { useState } from "react";

const BlogForm = ({ createBlog }) => {

  // blog creation related variables
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [url, setUrl] = useState(null);

  const resetBlogForm = () => {
    setTitle(null);
    setAuthor(null);
    setUrl(null);
  };

  const submitBlog = async (event) => {
    event.preventDefault();
    const newBlog = await createBlog({ title, author, url });
    resetBlogForm();

  };

  return (
    <div>
      <form onSubmit={submitBlog}>
        <label for="title">title</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <br></br>
        <label for="author">author</label>
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br></br>
        <label for="url">url</label>
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <br></br>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
