const users = [];

const serverLogin = (req, res) => {
  res.render("login");
};

const login = (req, res) => {
  const { username } = req.body;

  if (!users.includes(username)) {
    return res.send("Invalid credentials, try registering");

    // res.redirect("/register");
  }

  req.session.user = username;

  res.render("bienvenida", { username });
};

const serverRegister = (req, res) => {
  res.render("register");
};

const register = (req, res) => {
  const { username } = req.body;

  if (users.includes(username)) {
    return res.send("Username already in use");
  }

  users.push(username);

  res.render("login");
};

const logout = (req, res) => {
  const username = req.session.user;
  req.session.destroy();

  res.render("logout", { username });
};

const serverWelcome = (req, res) => {
  const user = req.session.user;

  res.render("bienvenida", { user });
};

export const authController = {
  serverLogin,
  login,
  serverRegister,
  register,
  logout,
  serverWelcome,
};
