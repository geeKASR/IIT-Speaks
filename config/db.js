const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//Mongoose connection function
const connectDB = async () => {
  try{

    await mongoose.connect(db); 
    console.log("Mongo Server Connected.. ");
  
  }catch(err){
   
    console.log(err.message);
    
    //Exiting Process
    process.exit(1);
  
  }
}

module.exports = connectDB;