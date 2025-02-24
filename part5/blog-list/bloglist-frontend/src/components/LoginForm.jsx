const LoginForm = (props) => {
  const { setUsername, setPassword, username, password, handleLogin } = props;

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label for="username">username</label>
        <br />
        <input
          data-testid="username"
          type="text"
          name="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        <label for="password">password</label>
        <br />
        <input
          data-testid="password"
          type="text"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type="submit"> Submit </button>
      </form>
    </div>
  );
};

export default LoginForm;
