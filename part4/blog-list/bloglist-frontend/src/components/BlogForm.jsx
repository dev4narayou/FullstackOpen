const BlogForm = ({ handleSubmit, title, author, url , setTitle, setAuthor, setUrl}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
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
