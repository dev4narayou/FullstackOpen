import { useState } from "react";
const LoginForm = (
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
) => {
  const [loginVisible, setLoginVisible] = useState(false);
  const showWhenVisible = { display: loginVisible ? "" : "none" };
  const hideWhenVisible = { display: loginVisible ? "none" : "" };

  return (
    <div>
      <form onSubmit={handleSubmit} style={showWhenVisible}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => handleUsernameChange(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => handlePasswordChange(target.value)}
          />
        </div>
        <button type="submit">login</button>
        <button onClick={() => setLoginVisible(false)}>cancel</button>
      </form>
      <div style={hideWhenVisible}>
        <button onClick={() => setLoginVisible(true)}>login</button>
      </div>
    </div>
  );
};

export default LoginForm;
