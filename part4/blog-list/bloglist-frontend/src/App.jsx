import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // the returned object when logging in (jwt, username, user name)
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorColor, setErrorColor] = useState(null);

  // blog creation related variables
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // for storing login in the browser
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const resetBlogForm = () => {
    setTitle(null);
    setAuthor(null);
    setUrl(null);
  };

  const submitBlog = async (event) => {
    event.preventDefault();
    const newBlog = await blogService.create({ title, author, url });
    setBlogs(blogs.concat(newBlog));
    resetBlogForm;
    setErrorColor("green");
    setErrorMessage(`Added blog ${newBlog.title} by ${newBlog.author}`);
    setTimeout(() => {
      setErrorMessage(null);
      setErrorColor("red");
    }, 5000);
  };

  const Blogs = () => (
    <>
      <h2>Blogs</h2>
      {/* notification for logged-in status */}
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      {/* form to submit blogs*/}
      <h2>create new</h2>
      <BlogForm
        handleSubmit={submitBlog}
        title={title}
        author={author}
        url={url}
        setTitle={setTitle}
        setAuthor={setAuthor}
        setUrl={setUrl}
      />

      {/* displays the blogs */}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.login({ username, password });
      if (response) {
        setUser(response);
        blogService.setToken(response.token);
        window.localStorage.setItem(
          "loggedBlogappUser",
          JSON.stringify(response)
        );
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      // console.log('Login error:', error);
      setErrorMessage(error.response?.data?.error || "Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  return (
    <div>
      <Notification message={errorMessage} color={errorColor} />

      {user == null ? (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      ) : (
        Blogs()
      )}
    </div>
  );
};

export default App;
