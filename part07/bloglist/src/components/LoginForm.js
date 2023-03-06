import Togglable from './Togglable'

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => (
  <div>
    <Togglable buttonLabel="login">
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            name="username"
            value={username}
            onChange={handleUsernameChange}
          >
          </input>
        </div>
        <div>
          password
          <input
            name="password"
            value={password}
            onChange={handlePasswordChange}
          >
          </input>
          <div><button>login</button></div>
        </div>
      </form>
    </Togglable>
  </div>
)

export default LoginForm