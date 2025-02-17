import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // the returned object when logging in (jwt, username, user name)
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorColor, setErrorColor] = useState(null);

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

  const handleBlogUpdate = async (id, updatedBlog) => {
    try {
      const updated = await blogService.update(id, updatedBlog);
      setBlogs(blogs.map((blog) => (blog.id === id ? updated : blog)));
      setErrorMessage(`Blog ${updated.title} was updated successfully`);
      setErrorColor("green");
    } catch (error) {
      setErrorMessage("Failed to update blog");
      setErrorColor("red");
    }
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const Blogs = () => (
    <>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} updateBlog={handleBlogUpdate} />
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

  const blogFormRef = useRef();

  const blogForm = () => {
    return (
      <div>
        <h2>create new</h2>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>
    );
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const newBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(newBlog));
    setErrorColor("green");
    setErrorMessage(`Added blog ${newBlog.title} by ${newBlog.author}`);
    setTimeout(() => {
      setErrorMessage(null);
      setErrorColor("red");
    }, 5000);
  };

  return (
    <div>
      <h2>Blogs</h2>
      {/* notification for logged-in status */}
      {user && (
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      )}

      <Notification message={errorMessage} color={errorColor} />

      {user && blogForm()}

      {user == null && (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}

      {user !== null && <Blogs />}
    </div>
  );
};

export default App;
