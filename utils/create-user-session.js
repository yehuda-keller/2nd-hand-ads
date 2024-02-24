function createUserSession(req, res, next,user) {
    req.session.regenerate(function (err) {
        if (err) next(err)

        // store user information in session, typically a user id
        req.session.user = user.toJSON();

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
            if (err) return next(err);
            res.redirect('/')
        })
    })
}

module.exports = createUserSession;