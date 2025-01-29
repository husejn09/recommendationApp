import pkg from "pg";
const {Pool} = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect((err) =>{
    if(err){
        console.error("Error while connecting: ", err)
    } else{
        console.log("Connection successful")
    }
})

export default pool;
