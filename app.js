const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/codeTest', {
	autoReconnect: true,
	reconnectTries: 60,
	reconnectInterval: 10000,
	useNewUrlParser: true
});

const app = express();
app.listen(3000);

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/account', require('./api/account/create'));
app.use('/', require('./api/notification/notification'));

console.log('app running on port 3000...');

module.exports = app;
