

import { use, serializeUser, deserializeUser, authenticate } from 'passport';
import googleStrategy from 'passport-google-oauth2';
import { userRegister } from './models/userSchema';
import wallet from './models/walletSchema';
require('dotenv').config();


use(new googleStrategy({


    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"https://flybee.store/auth/google/callback"
     },
     async(accessToken,refreshToken,profile,done)=>{
     
        try {
            const{id:googleId,email:User_email,displayName:User_name}=profile
            
            
            let user = await userRegister.findOne({User_email:User_email});
            if(!user){
                user=await userRegister.create({
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
           
            return done(error, null);
        }
     }
     
     )
     );
     serializeUser((user,done)=>{
        done(null,user.id)
     })
     deserializeUser(async(id,done)=>{
        try {
            const user=await userRegister.findById(id)
            done(null,user);
            
        } catch (error) {
            done(error, null);

        }
     })
     export const googleAuth = authenticate('google', { scope: ['profile', 'email'] });
export const googleCallback = authenticate('google', { failureRedirect: '/user' });
export function setupSession(req, res, next) {
    if (req.isAuthenticated()) {

        req.session.user_id = req.user._id;

    }

    res.redirect('/');

}
