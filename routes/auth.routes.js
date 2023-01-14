const User = require("../models/User.model")
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const saltRounds = 10
const mongoose = require("mongoose")


// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
router.get('/login', (req, res) => res.render('auth/login'));
router.get('/profile',  (req, res) => res.render('user/user-profile',{userInSession:req.session.currentUser}))
// POST route ==> to process form data

//signup post bcrypt
router.post("/signup", (req,res)=> {
    const {username,password}=req.body
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    //email and password client inputs validation
    if(!username || !password){
        res.render("auth/signup", {errorMessage: "You have to fill both fields"})
        return
    }else if(!regex.test(password)){
        res.render("auth/signup", {username, password, errorMessage:"The password has to have minimum 6 characters with at least one lower case and one upper case letter"})
        return
    }

    bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword =>{
        return User.create({username,password:hashedPassword})
    })
    .then(result =>{
        console.log(result)
/*         req.session.currentUser = result */
        res.redirect("/profile")})
    .catch(error=>{
        if(error instanceof mongoose.Error.ValidationError){
            res.status(500).render('auth/signup',{errorMessage: error.message})
        }else if(error.code = 11000){
            res.render("auth/signup", {errorMessage: "There is already an account associated with this email, Log in instead"})
        }else{
            next(error)
        }
            console.log(error)
})})

router.post("/login", (req,res)=>{

const {username, password} = req.body
if(!username || !password){
    res.render("auth/login", {errorMessage: "Please provide both username and password!"})
    return
}

User.findOne({username})
.then(user => {
    if(!user){
        //render the error message
        res.render("auth/login", {errorMessage: "Account doesn't exist, sign up right on signup tab!"})
        return 
    }else if(bcrypt.compareSync(password,user.password)){
        console.log(user)
        req.session.currentUser = user
        res.redirect('/profile')
        return
    }else{
        res.render("auth/login", {errorMessage: "Incorrect password!"})
        return 
    }
})
.catch(error => next(error))

})

router.post("/logout", (req,res)=>{
    req.session.destroy(error => {
        if(error) next(error)
        res.redirect("/login")
    })
})
module.exports = router;

