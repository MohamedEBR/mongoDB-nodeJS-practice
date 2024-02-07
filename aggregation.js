const {MongoClient } = require('mongodb');
require('dotenv').config()

const uri = require("./app_uri");
const client = new MongoClient(uri);

const pipeline = [
    //Stage 1: match accounts that are lesser than $1000
    {
        $match : { 
            account_type : "checking",
            balance : {
                $lt : 1000
            }
        }
    },
    //Stage 2: calculate avg balance ans sum
    {
        $group : {
            _id : "$account_type",
            total_balance : {
                $sum : "$balance"
            },
            avg_balance : {
                $avg: "$balance"
            }
        }
    },
    //stage 3 sort the balance in descending
    {
        $sort : {
            balance : -1
        }
    },
    // Stage 4 project
    {
        $project : {
            _id : 0,
            account_id : 1,
            account_type : 1,
            balance : 1,
        }
    }
];

const main =  async () => {
    try {
        await client.connect()
        console.log(`Connected to DB`)
        let accounts = client.db("bank").collection("accounts")
        let result = await accounts.aggregate(pipeline)
        for await (const doc of result) {
            console.log(doc)
        }
    } catch (err) {
        console.log(`Error : ${err}`)
    } finally {
        await client.close;
    }
}

main();