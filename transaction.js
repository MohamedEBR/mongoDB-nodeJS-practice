// transaction practice

const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const uri = require("./app_uri");
const client = new MongoClient(uri);

 
//Collections
const accounts = client.db("bank").collection("accounts");
const transfers = client.db("bank").collection("transfers");

 // Account information
 let account_id_sender = "MD574178290";
 let account_id_receiver = "MD528787393";
 let transaction_amount = 100;

//start a client session
const session = client.startSession();

const main = async () => {
  try {
        // Connect to the MongoDB client
 await client.connect();
 console.log("Connected successfully to server");
    


    const transactionResults = await session.withTransaction(async () => {
        // Update the sender's balance
        const updateSenderResults = await accounts.updateOne(
          { account_id: account_id_sender },
          { $inc: { balance: transaction_amount } },
          { session }
        );
        console.log(
          `${updateSenderResults.matchedCount} documents matched the filter, updated ${updateSenderResults.modifiedCount} documents for the sender account`
        );
  
        // Update the receiver's balance
        const updateReceiverResults = await accounts.updateOne(
          { account_id: account_id_receiver },
          { $inc: { balance: transaction_amount } },
          { session }
        );
        console.log(
          `${updateReceiverResults.matchedCount} documents matched the filter, updated ${updateReceiverResults.modifiedCount} documents for the receiver account`
        );
  
        // Insert the transfer document
        const transfer = {
          transfer_id: "RET879349",
          amount: transaction_amount,
          from_account: account_id_sender,
          to_account: account_id_receiver,
        };
  
        const insertTransferResults = await transfers.insertOne(transfer, { session });
        console.log(`successfully inserted ${insertTransferResults.insertedId} into the transfers collection`);
  
        // Update the sender's transfer_complete field
        await accounts.updateOne(
          { account_id: account_id_sender },
          { $push: { transfers_complete: transfer.transfer_id } },
          { session }
        );
  
        // Update the receiver's transfer_complete field
        await accounts.updateOne(
          { account_id: account_id_receiver },
          { $push: { transfers_complete: transfer.transfer_id } },
          { session }
        );
      }, {
        // Transaction options (if any)
      });

    console.log("commiting transaction ...")
    if (transactionResults) {
        console.log('The transaction was successfully committed');
      } else {
        console.log('The transaction was intentionally aborted');
      }
    } catch (err) {
      console.error(`Transaction aborted due to an error: ${err}`);
    } finally {
      await session.endSession();
      await client.close();
    }
  };

main()
