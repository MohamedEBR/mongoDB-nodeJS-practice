const { MongoClient, CommandStartedEvent } = require("mongodb");
const { ObjectId } = require("mongodb");
const uri = require("./app_uri");


const client = new MongoClient(uri);

const dbname = "bank";
const collection_name = "accounts";

const accountsCollection = client.db(dbname).collection(collection_name);

//connect to db
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to ${dbname} database`);
  } catch (err) {
    console.log(`Error connecting to database ${err}`);
  }
};

const sampleAccount = [
  {
    account_holder: "Linus PotatoHead",
    account_id: "MDJNIUN32",
    account_type: "checking",
    balance: 200,
    last_updated: new Date(),
  },
  {
    account_holder: "ninus TotatoHead",
    account_id: "MCJNIUN32",
    account_type: "checking",
    balance: 200,
    last_updated: new Date(),
  },
];

//find
const documentsToFind = { balance: { $gt: 4700 } };

//findOne
const documentToFind = { _id: new ObjectId("65bfd276bb7c032e7d14dd33") };

//updateOne
const documentToUpdate = { _id: new ObjectId("65bfd276bb7c032e7d14dd33") };

const update = { $inc: { balance: 100 } };

//updateMany
const documentsToUpdate = { account_type: "checking" };

const manyUpdate = { $push: { transfers_complete: "23932938" } };

//deleteOne
const documentToDelete = { _id: new ObjectId("65bfd276bb7c032e7d14dd34") };

//deleteMany
const documentsToDelete = { balance: { $gt: 300 } };

//main - login to db
const main = async () => {
  try {
    await connectToDatabase();
    // findOne && Find
    // let result = await accountsCollection.find(documentsToFind);
    // let resultOne = await accountsCollection.findOne(documentToFind);
    // let docCount = accountsCollection.countDocuments(documentsToFind)
    // console.log("found one")
    // console.log(resultOne)
    // console.log(`Inserted document: ${result.insertedCount}`);
    // await result.forEach((doc) => console.log(doc))
    // console.log(`found ${await docCount} documents and  single document`)

    // updateOne
    // let result = await accountsCollection.updateOne(documentToUpdate, update);
    // result.modifiedCount === 1
    //   ? console.log("update one document")
    //   : console.log("no updates done");

    //updateMany
    // let result = await accountsCollection.updateMany(documentsToUpdate, update);
    // result.modifiedCount > 1
    //   ? console.log(`updated ${result.modifiedCount} document`)
    //   : console.log("no updates done");

    // deleteOne
    // let result = await accountsCollection.deleteOne(documentToDelete);
    // result.deletedCount === 1
    //   ? console.log(`deleted one document`)
    //   : console.log("no delets done");

    //deleteMany
    // let result = await accountsCollection.deleteMany(documentsToDelete);
    // result.deletedCount > 1
    //   ? console.log(`deleted ${result.deletedCount} document`)
    //   : console.log("no delets done");
  } catch (err) {
    console.log(`Error connecting to database ${err}`);
  } finally {
    await client.close();
  }
};

// run main
main();
