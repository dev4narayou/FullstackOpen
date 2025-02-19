import { useState } from "react";

const BlogForm = ({ createBlog }) => {

  // blog creation related variables
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const resetBlogForm = () => {
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  const submitBlog = async (event) => {
    event.preventDefault();
    const newBlog = await createBlog({ title, author, url });
    resetBlogForm();

  };

  return (
    <div>
      <form onSubmit={submitBlog}>
        <label htmlFor="title">title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <br></br>
        <label htmlFor="author">author</label>
        <input
          type="text"
          name="author"
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br></br>
        <label htmlFor="url">url</label>
        <input
          type="text"
          name="url"
          id="url"
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
