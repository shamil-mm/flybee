const express=require('express')
const mongoose=require('mongoose')
const session=require('express-session')
const app=express()
require('dotenv').config()
const nocache=require('nocache')
app.use(nocache())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:true
}))
const flash=require('connect-flash')
const commonData=require('./middleware/commonData')
app.use(commonData)

const adminRouter=require('./routes/adminRouter')
const userRouter=require('./routes/userRouter')
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
app.set('views','views/users')
app.use(express.static('public/users'))


app.use(flash())



app.use(express.static('public'))
app.use('/admin',adminRouter.adminRouter)
app.use('/',userRouter.userRouter)
app.use('*',(req,res)=>{
    res.render('error')
})



















app.listen(process.env.PORT,()=>{
    console.log('server running on port 3000')
})
mongoose.connect(process.env.DB_URL).then(()=>console.log("mongodb connected")).catch((err)=>console.log(err))