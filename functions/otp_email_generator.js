const nodemialer=require('nodemailer')
const createMail=nodemialer.createTransport({
    service:'Gmail',
    auth:{
     user:'shamil880699@gmail.com',
     pass:'ilay ahlo otse kybo'
    }
 }) 
 
 function otp_email_generator(email) {
     const generateOTP = Math.trunc(Math.random() *9000)
 
     const setMail = {
         from: 'shamil880699@gmail.com',
         to: email,
         subject: 'OTP',
         text: generateOTP.toString().padEnd(4,"0")
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