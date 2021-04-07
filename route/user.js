const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../model/User') // user model
const passport = require('passport')
const router = express.Router()

router.get('/login', ensureGuest, (req, res) => {
    res.render('login')
})

router.get('/register',  ensureGuest, (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    let {username, email, password, password2} = req.body
    let error = [];
    if(!username || !email || !password){
        error.push({msg: "Enter all fields to continue"})
    }
    if(password !== password2){
        error.push({msg: "Password do not match!"})
    }
    if(password < 6){
        error.push({msg: "Password must be atleast six characters"})
    }
    if(error.length > 0){
        res.render('register', {
            error,
            username,
            email,
            password,
            password2
        })
    }else{
        User.findOne({email})
        .then(user => {
            if(user){
                error.push({msg: "Email already registered!"})
                res.render('register', {
                    error,
                    username,
                    email,
                    password,
                    password2
                })
            }else{
                let newUser = new User(req.body)
                bcrypt.genSalt(10, (err, salt) =>{
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        newUser.password = hash
                        newUser.save()
                        .then(user =>{
                            req.flash('success_msg', 'Registration successfull! Login')
                            res.redirect('/user/login')
                        })
                        .catch(err => console.log(err))
                    })
                })
                
            }
        })
        .catch(err => console.log(err))
    }
})

// passport local login handle
require('../config/passport')(passport)
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
}))

// Logout handle
// router.get('/logout', (req, res) =>{
//     req.logout()
//     req.flash('success_msg', 'Logout Successful!')
//     res.redirect('/user/login')
// })


// or using method override
router.delete('/logout', (req, res) =>{
    req.logOut()
    req.flash('success_msg', 'Logout Successful!')
    res.redirect('/user/login')
})

// protecting route (login & register)
function ensureGuest(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/dashboard')
        
    }
    return next()
}

module.exports = router