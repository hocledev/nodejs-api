const express = require('express');
const notification = express.Router();

const Notification = require('../../models/notification/Notification');

notification.route('/notifications').post(async function (req, res) {
	const { accountId, name, color } = req.body;
	const notification = new Notification({accountId, name, color});
  
	Notification.findOne({ 'accountId' : accountId }, async function(err, data) {
		// check if same accountId exists..
		if (data) {
			// data with same accountId exists
			res.status(400).send({"err": "accountId already exists"});
		}
		else {
			try {
				// same accountId does not exist
				await notification.save();
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

// find one notification that matches provided account ID
notification.route('/notifications').get(async function (req, res) {
    let accountId = req.query.accountId;
    if(accountId !== undefined && accountId.trim() != "")
    {
        Notification.find({ 'accountId' : accountId }, async function(err, data) {
            if(err){
                return res.status(500).send(err);
            }
            // check if same accountId exists..
            if (data) {
                // data with same accountId exists
                return res.status(200).send({"notification data": data});  
            }
        });
    }
    else{
        return res.status(400).send({"err": "bad account ID or didn't provide accountId"});
    }
});


// find one notification that matches provided account ID
notification.route('/notifications').delete(async function (req, res) {
    let accountId = req.query.accountId;
    let color = req.query.color;
    
    if(accountId !== undefined && accountId.trim() != "" && color !== undefined && color.trim() != "")
    {
        try {
            let result = await Notification.findOneAndDelete({ 'accountId' : accountId, 'color' : color });
            
            if(!result)
            {
                return res.status(404).send({"err": "data doesn't exist with the account ID and color"});
            }
            else{
                return res.status(200).send({"message": 'Notification successfully deleted'});
            }
        }
        catch (err) {
            return res.status(500).send({"err": "Unknown server error or data type doesn't match"});
        }
    }
    else{
        return res.status(400).send({"err": "bad accountId / color or didn't provide accountId or color"});
    }
});

module.exports = notification;