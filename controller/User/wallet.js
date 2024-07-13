const Wallet=require('../../models/walletSchema')
const addMoneyToWallet=async(req,res,next)=>{
    try {
  
      let payAmount=req.query.payment
      const addmoney=await Wallet.findOne({userId:req.session.user_id})
     if( addmoney){
        addmoney.userBalance+=Number(payAmount)
        addmoney.transferHistory.push( {
            type: 'CREDIT',
            amount:payAmount ,
            description: 'From Account',
          })
        await addmoney.save()  
        res.json('success')
     }
    } catch (error) {
        next(error)
    }
}
module.exports={addMoneyToWallet}