const add_pro=require('../../models/admin_pro_schema')
const aDdelete_render=async(req,res)=>{
    try {
        const data =await add_pro.add_pro_model.find({is_delete:true})
        
        res.render('Admindeletedproduct',{data})
    } catch (error) {
        console.log(error);
    }
}
module.exports=aDdelete_render