const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const bodyParser = require('body-parser')
const connectdb = require('./config/db')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path');

const app = express()

//dot env config
dotenv.config()

//db
connectdb()

//middleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())


// end point

app.use('/api/v1/auth', require('./routes/authRoute'))

// app.get('/', (req, res) => res.send('hello'))


// static file
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})



// port
const PORT = process.env.PORT
//server
app.listen(PORT, () => {
    console.log(`server start in port no ${PORT}`.bgBlue);
})