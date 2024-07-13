const nodemialer=require('nodemailer')
const createMail=nodemialer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true,
    auth:{
     user:'shamil880699@gmail.com',
     pass:'ilay ahlo otse kybo'
    }
 }) 
 
 function otp_email_generator(email) {
     const generateOTP = Math.floor(1000+Math.random() *9000)
 
     const setMail = {
         from: 'shamil880699@gmail.com',
         to: email,
         subject: 'OTP',
         text: generateOTP.toString()
     }
     createMail.sendMail(setMail, (error) => {
         if (error) {
             console.log(error)
         } else {
             
         }
     }
     )
     return generateOTP
 }
module.exports=otp_email_generator