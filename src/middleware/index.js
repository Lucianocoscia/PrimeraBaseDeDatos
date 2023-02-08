// const authMiddleware = (req, res, next) => {
//   const user = req.session.user;

//   if (user) {
//     return next();
//   }

//   res.redirect("/login");
// };

// const checkNotLogged = (req, res, next) => {
//   const user = req.session.user;

//   if (!user) {
//     return next();
//   }

//   res.redirect("/welcome");
// };
const invalidUrl = (req, res, next) => {
  res.render("routing-error");
};
//checkNotLogged, authMiddleware,
export const authMiddlewares = { invalidUrl };
