const mongoose = require('mongoose')

const connectdb = async () => {
    const url = process.env.MONGO_URL
    try {
        const conn = await mongoose.connect(url)
        console.log(`Mongodb conection successfully ${conn.connection.host}`.bgCyan.bold);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectdb;   