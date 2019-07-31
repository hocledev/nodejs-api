const mongoose = require('mongoose');

const Notification = new mongoose.Schema({
	accountId: {type: String, required: true},
	name: {type: String},
	color: {type: Number},

}, {timestamps: true});

module.exports = mongoose.model('Notification', Notification);
