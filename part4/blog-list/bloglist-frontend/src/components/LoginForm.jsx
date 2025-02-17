const LoginForm = (props) => {
  const { setUsername, setPassword, username, password, handleLogin } = props

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">username</label>
        <br />
        <input
          type="text"
          name="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        <label htmlFor="password">password</label>
        <br />
        <input
          type="text"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type="submit"> Submit </button>
      </form>
    </div>
  )
}

export default LoginForm
