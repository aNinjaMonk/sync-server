var express = require('express');
const app = express();
const morgan = require('morgan');
const config = require('dotenv').config();
app.use(morgan('tiny'));

var { local1, local2, remote, common } = require('./router');

app.use('/v1', local1);
app.use('/v2', local2);
app.use('/remote', remote);
app.use('/', common);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req,res) => {
     console.log('server listening at :',PORT);
});
