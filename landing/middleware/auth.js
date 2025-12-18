// Admin authentication middleware

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/admin/login');
};

const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/admin/login');
};

module.exports = { isAuthenticated, isLoggedIn };