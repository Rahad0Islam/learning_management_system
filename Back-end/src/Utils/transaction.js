import { User } from "../Models/User.Model.js"
import { Bank } from "../Models/bank.model.js"
class transaction{
    constructor(fromUser,toUser,price,description){
        this.fromUser=fromUser,
        this.toUser=toUser,
        this.price=price,
        this.description=description
    }
    async tnx(){
        
        const fromuser=await User.findById(this.fromUser);
        const touser=await User.findById(this.toUser);
        if (!fromuser || !touser) {
        throw new Error("Invalid user IDs");
        }
        const bank=await Bank.create({
           fromUserID:this.fromUser,
           fromUserName:fromuser.UserName,
           fromUserEmail:fromuser.Email,
           toUserID:this.toUser,
           toUserName:touser.UserName,
           toUserEmail:touser.Email,
           transactionTime:new Date(),
           amount:this.price,
           description:this.description
        })

        return bank._id  //this is transaction id
    }
}

export {transaction}