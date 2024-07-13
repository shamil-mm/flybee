const passport=require('passport')
const googleStrategy=require('passport-google-oauth2')
const userSchema=require('./models/userSchema')
require('dotenv').config();
passport.use(new googleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/callback"
     },
     async(accessToken,refreshToken,profile,done)=>{
        // console.log(profile)
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
                // console.log(req.session.user_id);
            } 
            // console.log(req.session.user_id);
            res.redirect('/homePage');
            
        }
     }
