//We only want to export a single thing, a middleware function. Thus, the best approach is to assign the function to module.exports as follows:

// Middleware for routes that require a logged in user
module.exports = function isLoggedIn(req, res, next) {
    // Pass the req & res to the next middleware/route handler
    if ( req.isAuthenticated() ) return next();
    //without passing next, the request won't make it to any middleware/routes that come after this middlware

    // Redirect to login if the user is not already logged in
    res.redirect('/auth/google');
}