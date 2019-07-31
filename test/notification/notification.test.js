const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const app = require('../../app');

const Notification = require('../../models/notification/Notification');

describe('DELETE /notifications', function(){

    this.timeout(5000);
    
	beforeEach(async () => {
		await Notification.remove();
	});

	it('should get notification from database', async() => {
		const data = {
			accountId: '111',
			name: 'Testo',
			color: 111
        };
        // save test data
		let res = await chai.request(app).post('/notifications').send(data);
        expect(res).to.have.status(200);

		// don't provide parameter
		let res1 = await chai.request(app).delete('/notifications');
		expect(res1).to.have.status(400);

		// test with wrong parameter
		let res2 = await chai.request(app).delete('/notifications?accountIsss');
		expect(res2).to.have.status(400);

        // test with wrong data type, i.e. color is string
		let res3 = await chai.request(app).delete('/notifications?accountId=111&color=sss');
		expect(res3).to.have.status(500);
		
        // check with none existing data
		let res4 = await chai.request(app).delete('/notifications?accountId=112&color=111');
		expect(res4).to.have.status(404);
		
		// check if delete is successful
		let res5 = await chai.request(app).delete('/notifications?accountId=111&color=111');
		expect(res5).to.have.status(200);		
		
	});

});

describe('GET /notifications', function(){

    this.timeout(5000);
    
	beforeEach(async () => {
		await Notification.remove();
	});

	it('should get notification from database', async() => {
		const data = {
			accountId: '111',
			name: 'Testo',
			color: 111
        };
        // save test data
		let res = await chai.request(app).post('/notifications').send(data);
        expect(res).to.have.status(200);

        // if same data exists
		let res2 = await chai.request(app).get('/notifications?accountId=111');
		expect(res2).to.have.status(200);
		expect(res2.body['notification data']).to.be.an('array').not.to.be.empty;

        // check with none existing data
		let res3 = await chai.request(app).get('/notifications?accountId=112');
		expect(res3).to.have.status(200);
		expect(res3.body['notification data']).to.be.an('array').empty;
		
		// don't provide parameter
		let res4 = await chai.request(app).get('/notifications');
		expect(res4).to.have.status(400);		
		
	});

});

describe('POST /notifications', function(){

    this.timeout(5000);
    
	beforeEach(async () => {
		await Notification.remove();
	});

	it('should add notification to database', async() => {
		const data = {
			accountId: '111',
			name: 'Testo',
			color: 111
        };
		
		// check its standard POST behavior 
		let res = await chai.request(app).post('/notifications').send(data);
		expect(res).to.have.status(200);

        // check if data is saved
		const notification = await Notification.findOne();
        expect(notification).to.exist;
        
        // if same data exists
		let res2 = await chai.request(app).post('/notifications').send(data);
        expect(res2).to.have.status(400);
        
    	// save without accountId
		const data2 = {
			name: 'Testo',
			color: 111
		};
		let res3 = await chai.request(app).post('/notifications').send(data2);
		expect(res3).to.have.status(500);

	});

});
