const passport=require('passport')
const googleStrategy=require('passport-google-oauth2')
const userSchema=require('./models/userSchema')
const wallet=require('./models/walletSchema')
require('dotenv').config();

passport.use(new googleStrategy({


    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"https://flybee.store/auth/google/callback"
     },
     async(accessToken,refreshToken,profile,done)=>{
     
        try {
            const{id:googleId,email:User_email,displayName:User_name}=profile
            
            
            let user = await userSchema.userRegister.findOne({User_email:User_email});
            if(!user){
                user=await userSchema.userRegister.create({
                    googleId,
                    User_email:User_email,
                    User_name,
                    password:googleId
                })
                const UserWallet=new wallet({
                    userId:user._id
                })
                await UserWallet.save()
            }
            return done(null,user)
        } catch (error) {
            console.error("Error during Google authentication:", error);
            return done(error, null);
        }
     }
     
     )
     );
     passport.serializeUser((user,done)=>{
        done(null,user.id)
     })
     passport.deserializeUser(async(id,done)=>{
        try {
            const user=await userSchema.userRegister.findById(id)
            done(null,user);
            
        } catch (error) {
            done(error, null);

        }
     })
     module.exports={
        googleAuth:passport.authenticate('google',{scope:['profile','email']}),
        googleCallback:passport.authenticate('google',{failureRedirect:'/user'}),
        setupSession:(req,res,next)=>{
            if (req.isAuthenticated()) {
         
                req.session.user_id = req.user._id;
               
            } 
           
            res.redirect('/');
            
        }
     }
