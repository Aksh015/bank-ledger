const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")

// 1 user can have multiple accounts for transactions
const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [ true, "Account must be associated with a user" ],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: [ "ACTIVE", "FROZEN", "CLOSED" ],
            message: "Status can be either ACTIVE, FROZEN or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [ true, "Currency is required for creating an account" ],
        default: "INR"
    }
},{timestamps:true})

//compound index : sorted by user and than by status...as 1 user can have multiple accounts (1 account = 1 status)
accountSchema.index({ user: 1, status: 1 })

// balance = (total debit) - (total credit)
accountSchema.methods.getBalance = async function(){
     const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } }, //find all ledger entries
        {
            $group: {
                _id: null,
                totalDebit: {//sum of debit
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "DEBIT" ] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {//sum of credit
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "CREDIT" ] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: [ "$totalCredit", "$totalDebit" ] }
            }
        }
    ])
    if (balanceData.length === 0) return 0
    return balanceData[ 0 ].balance
}

const accountModel = mongoose.model("account", accountSchema)
module.exports = accountModel