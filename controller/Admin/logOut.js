const logOut=async(req,res)=>{
    try {
    
     
     delete req.session.admin_id
  
     res.redirect('/admin')
    } catch (error) {
     console.log(error);
    }
 }
 module.exports=logOut