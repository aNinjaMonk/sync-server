var express = require('express');
const app = express();
const morgan = require('morgan');
const config = require('dotenv').config();
var bodyParser = require('body-parser');
app.use(morgan('tiny'));

var { local1, local2, remote } = require('./router');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/v1', local1);
app.use('/v2', local2);
app.use('/remote', remote);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req,res) => {
     console.log('server listening at :',PORT);
});
