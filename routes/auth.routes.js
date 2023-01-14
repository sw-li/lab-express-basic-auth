const User = require("../models/User.model")
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const saltRounds = 10



// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
router.get('/login', (req, res) => res.render('auth/login'));
// POST route ==> to process form data

//signup post bcrypt

router.post("/signup", (req,res)=> {
    const {name,password}=req.body

    if(!name || !password){
        res.render("auth/signup", {errorMessage: "You have to fill both fields"})
        return
    }

    bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword =>{
        console.log(`Password hash:${hashedPassword}`)
        return User.create({name,password:hashedPassword})
    })
    .then(()=>res.redirect("user"))
    .catch(err=> next(err))
})

module.exports = router;

