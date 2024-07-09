const cookieParser = require("cookie-parser")
const express = require("express")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = require('./models/user')
const path = require('path')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "public")))
app.set('view engine', 'ejs');

app.use(cookieParser())

app.get('/', (req, res) => {
    res.render("index")
})
app.post('/create', (req, res) => {
    let { username, email, password, age } = req.body
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createUser = await userSchema.create({
                username,
                password: hash,
                email,
                age
            })

            let token = jwt.sign({email},'inzamam')

            res.cookie("token",token)
            res.send(createUser)
        })
    })
})

app.get("/login",(req,res)=>{
    res.render('login')
})

app.post('/login', async (req,res)=>{
    let user = await userSchema.findOne({email:req.body.email})
    if(!user) return res.send("Someing is wrong")
    bcrypt.compare(req.body.password , user.password, function(err, result) {
        if(result){
            let token = jwt.sign({email:user.email},'inzamam')

            res.cookie("token",token)
            res.send("your good")
        }
            
            else res.send("Someing is wrong")
    });
})

app.get('/logout',(req,res)=>{
    res.cookie('token',"")
    res.redirect("/")
})


app.listen(port, () => {
    console.log('Server is start now!')
})