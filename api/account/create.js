const express = require('express');
const create = express.Router();

const Account = require('../../models/account/Account');

create.route('/create').post(async function (req, res) {

	const {email, name, age} = req.body;
	const account = new Account({email, name, age});
  
	Account.findOne({ 'email' : email }, async function(err, data) {
		if(err){
			return res.status(500).send(err);
		}
		// check if same email exists..
		if (data) {
			// data with same email exists
			return res.status(400).send({"err": "email already exists"});
		}
		else {
			try {
				// same email does not exist
				await account.save();
				return res.status(200).send({message: 'success'});  
			} catch(err) {
				if (err.name === 'MongoError' && err.code === 11000) {
					res.status(409).send(new MyError('Duplicate key', [err.message]));
				}
				else 
				{
					res.status(500).send(err);
				}
			}
		}
	});
});

module.exports = create;