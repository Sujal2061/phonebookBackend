const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = `mongodb://sujalkoirala404_db_user:sujal2061@ac-8mergjl-shard-00-00.jgjrnr1.mongodb.net:27017,ac-8mergjl-shard-00-01.jgjrnr1.mongodb.net:27017,ac-8mergjl-shard-00-02.jgjrnr1.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-hjkvgq-shard-0&authSource=admin&appName=Cluster0`;

console.log("connecting to ", url);

mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => console.log("error connecting to MongoDb:", error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
  },
  number: {
    type:String,
    minLength: 8,
    validate:{
      validator: (v)=>{
        return /^\d{2,3}-\d+$/.test(v);
      }
    }
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
