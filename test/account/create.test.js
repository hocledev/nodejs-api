const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const app = require('../../app');

const Account = require('../../models/account/Account');

describe('POST /account/create', function(){

	this.timeout(5000);

	beforeEach(async () => {
		await Account.remove();
	});

	it('should add account to database', async() => {
		const data = {
			email: 'test@gmail.com',
			name: 'Testo',
			age: 56
		};
		let res = await chai.request(app).post('/account/create').send(data);
		expect(res).to.have.status(200);

		// check if data is saved
		const account = await Account.findOne();
		expect(account).to.exist;

		// check if the same item exists
		let res2 = await chai.request(app).post('/account/create').send(data);
		expect(res2).to.have.status(400);

		// save without email
		const data2 = {
			name: 'Testo',
			age: 56
		};
		let res3 = await chai.request(app).post('/account/create').send(data2);
		expect(res3).to.have.status(500);

	});

});
