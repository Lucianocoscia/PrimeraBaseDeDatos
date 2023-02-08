// // const users = [];

// const serverLogin = (req, res) => {
//   res.render("login");
// };

// const login = (req, res) => {
//   const { username, email, password } = req.body;

//   if (!users.includes(username, email, password)) {
//     return res.send("Invalid credentials, try registering");

//     // res.redirect("/register");
//   }

//   req.session.user = username;

//   res.render("bienvenida", { username, email });
// };

// const serverRegister = (req, res) => {
//   res.render("register");
// };

// const register = (req, res) => {
//   const { username, email, password } = req.body;

//   if (users.includes(username)) {
//     return res.send("Username already in use");
//   }

//   users.push(username, email, password);

//   res.render("login");
// };

// const logout = (req, res) => {
//   const username = req.session.user;
//   req.session.destroy();

//   res.render("logout", { username });
// };

// const serverWelcome = (req, res) => {
//   const user = req.session.user;

//   res.render("bienvenida", { user });
// };

// const getLoginFailiure = (req, res) => {
//   res.render("login-error");
// };

// const getRegisterFailiure = (req, res) => {
//   res.render("signup-error");
// };

// export const authController = {
//   serverLogin,
//   login,
//   serverRegister,
//   register,
//   logout,
//   serverWelcome,
//   getLoginFailiure,
//   getRegisterFailiure,
// };

const getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    console.log("Get login");

    return res.render("bienvenida", {
      usuario: user.username,
      email: user.email,
    });
  }
  res.render("login");
};

const getRegister = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.session.user;

    return res.render("bienvenida", {
      usuario: user.username,
      email: user.email,
    });
  }
  res.render("register");
};

const getLoginFailiure = (req, res) => {
  res.render("login-error");
};

const getRegisterFailiure = (req, res) => {
  res.render("signup-error");
};

const logOut = (req, res) => {
  req.logout();
  res.render("logout");
};

export const authController = {
  getLogin,
  getRegister,
  getLoginFailiure,
  getRegisterFailiure,
  logOut,
};
