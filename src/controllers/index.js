import util from "util";
import { fork } from "child_process";
import args from "../yargs.js";

const getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    console.log("Get login");

    return res.render("bienvenida", {
      username: user.username,
      email: user.email,
    });
  }
  res.render("login");
};

const getRegister = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    console.log("Get register");
    // console.log(user);

    return res.render("bienvenida", {
      username: user.username,
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
  console.log("Entre logou 1");
  const username = req.user.username;
  req.logout(() => {
    console.log("Entre logou 2");

    return res.render("logout", { username });
  });
};

// usando objeto process y fork
const getInfo = (req, res) => {
  res.render("info", {
    entryArgs: JSON.stringify(args),
    platform: process.platform,
    versionNode: process.version,
    memory: process.memoryUsage().rss,
    path: process.execPath,
    processID: process.pid,
    dir: process.cwd(),
  });
};

const getRandom = (req, res) => {
  const { cant } = req.query;
  const childProcess = fork("./src/child.js");
  const quantity = cant ? cant : 100000000;

  childProcess.send(quantity);

  childProcess.on("message", (response) => {
    res.json(response);
  });
};

export const authController = {
  getLogin,
  getRegister,
  getLoginFailiure,
  getRegisterFailiure,
  logOut,
  getInfo,
  getRandom,
};

// CONTROLLERS SIN PASSPORT
/* // const users = [];

const serverLogin = (req, res) => {
  res.render("login");
};

const login = (req, res) => {
  const { username, email, password } = req.body;

  if (!users.includes(username, email, password)) {
    return res.send("Invalid credentials, try registering");

    // res.redirect("/register");
  }

  req.session.user = username;

  res.render("bienvenida", { username, email });
};

const serverRegister = (req, res) => {
  res.render("register");
};

const register = (req, res) => {
  const { username, email, password } = req.body;

  if (users.includes(username)) {
    return res.send("Username already in use");
  }

  users.push(username, email, password);

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

const getLoginFailiure = (req, res) => {
  res.render("login-error");
};

const getRegisterFailiure = (req, res) => {
  res.render("signup-error");
};

export const authController = {
  serverLogin,
  login,
  serverRegister,
  register,
  logout,
  serverWelcome,
  getLoginFailiure,
  getRegisterFailiure,
}; */
