require('dotenv').config();
let express = require('express');
const cors = require('cors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const config = require("./config/keys");
const mongoose = require("mongoose");


const bodyParser = require("body-parser");


mongoose.connect(process.env.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

  
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video'));
app.use('/api/sub', require('./routes/subscription'));
app.use('/api/comment', require('./routes/comments'));
app.use('/uploads', express.static('uploads'));

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`twerking on ${port}`);
})

module.exports = app;
