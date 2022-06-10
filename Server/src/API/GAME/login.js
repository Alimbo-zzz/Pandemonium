const User = require('../../models/user.js');
const axios = require('axios');


const login = (req, res) =>{
	const {waxName} = req.body;

	User
		.findOne({waxName})
		.then(result => {
			setCollection(waxName)
				.then(nftCollection => {

					if(result){ // зареган
						updateUser({waxName, nftCollection})
						.then(ev => res.status(200).json({status:'exists', result:ev}) )
						.catch(err => res.status(400).json({status:'failed', err}) )
					}else{//не зареган
						createUser({waxName, nftCollection})
							.then(ev => res.status(200).json({status:'register', result:ev}) )
							.catch(err => res.status(400).json({status:'failed', err}) )
					}

				})
				.catch(err => console.log(err))
		})
		.catch(err=> {
			res.status(400).json({status: 'failed', err})
		})

}

// funcs
function createUser(obj){
	return new Promise((res, rej)=>{
		const {waxName, nftCollection} = obj;

		let data = {
			waxName,
			coins: 1000,
			battleHistory: [],
			nftCollection
		};
		const user = new User(data);
		user
			.save()
			.then(result => res({message: 'user is create', id: result._id}) )
			.catch(err => rej({status: 'error DB', err}) )
	})
}
function updateUser(obj){
	return new Promise((res, rej)=>{
		const {waxName, nftCollection} = obj;

		User
			.updateOne({waxName}, {nftCollection})
			.then(result => res({message: 'collection update', id: result._id}) )
			.catch(err => rej({status: 'error DB', err}) )
	})
}
function setCollection(waxName){
	return new Promise((resolve, reject)=>{
		let body = {
			name: waxName,
			collection_name: 'pandemoniumw'
		}

		axios({
			method: 'GET',
			url:`https://wax.api.atomicassets.io/atomicassets/v1/assets?owner=${waxName}&collection_name=pandemoniumw`
		}).then(async (res) => {
			const {data} = res.data;
			var collection = [];

			data.forEach(el => {
					let {asset_id, data, owner, template} = el;
					let obj = {asset_id, data, owner, img_id: template.template_id};
					collection.push(obj);
			});

			resolve(collection)
		}).catch(err => reject(`setCollection error: ${err}`))
	})
}




module.exports = {
	login,
}
