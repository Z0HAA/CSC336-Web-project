const isAuthenticated = (req, res, next) => {
  if (req.session?.user?.role === 'admin') {
    return next();
  }

  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  res.redirect('/admin/login');
};


const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/admin/login');
};

module.exports = {
  isAuthenticated,
  isLoggedIn
};
