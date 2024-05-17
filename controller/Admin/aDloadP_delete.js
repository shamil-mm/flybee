const add_pro=require('../../models/admin_pro_schema')
    const aDloadP_delete=async(req,res)=>{
        try {
            const id=req.query.id
            await add_pro.add_pro_model.deleteOne({_id:id})
          
        } catch (error) {
            console.log(error)
        }
    }
    module.exports=aDloadP_delete