const express = require('express')
const mongoose = require('mongoose')
const ejsLayout = require('express-ejs-layouts')
const dotenv = require('dotenv')
const flash = require('express-flash')
const methodOverride = require('method-override')
// const flash = require('connect-flash')
const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const User = require('./model/User') // user model

// .env
require('dotenv/config')

const app = express()
// database using promises
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connected...'))
.catch(err => console.log(err))

  // ejs
  app.use(ejsLayout)
  app.set('view engine', 'ejs')
   

// body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

    // store: new MongoStore({mongooseConnection: mongoose.connection})
  })
)
// passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// flash middleware
app.use(flash());

// global variable for flash
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// router
app.use('/', require('./route/index'));
app.use('/user', require('./route/user'))
app.use('/auth', require('./route/auth'))

//   PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('server running...'))