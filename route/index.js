const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {user: req.user.username, usern: req.user.displayName})
})

// protecting dashboard route
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error_msg', "Login to continue!")
    res.redirect('/user/login')
}
module.exports = router