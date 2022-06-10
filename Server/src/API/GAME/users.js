const User = require('../../models/user.js');

const getUser = (req, res)=>{
	const {wax_name} = req.query;

	User
		.findOne({waxName: wax_name})
		.then(result => {
			const {battleHistory, coins, nftCollection, waxName, _id} = result;

			let res_obj = {
				id: _id,
				battleHistory, coins,
				nftCollection, waxName
			};

			res.status(200).json({status: 'success', result: res_obj})
		})
		.catch(err=> {
			res.status(400).json({status: 'DB err', err})
		})
}

const getCollectionId = (req, res)=>{
	const {wax_name} = req.query;

	User
		.findOne({waxName: wax_name})
		.then(result => {
			const {nftCollection} = result;
			var imagesId = [];
			let res_obj = imagesId;

			nftCollection.forEach((el, i) => {
				if(el.img_id)	imagesId.push(el.img_id);
			});

			res.status(200).json({status: 'success', result: res_obj})
		})
		.catch(err=> {
			res.status(400).json({status: 'DB err', err})
		})
}


const editUser = (req, res)=>{
	const {wax_name} = req.query;
	const {coins} = req.body;
	User
		.updateOne({waxName: wax_name}, {coins})
		.then(result => {
			res.status(200).json({status: 'success', result})
		})
		.catch(err=> {
			res.status(400).json({status: 'DB err', err})
		})
}

const editCoins = (req, res)=>{
	const {wax_name} = req.query;
	const {coins} = req.body;
	User
		.updateOne({waxName: wax_name}, {coins})
		.then(result => {
			res.status(200).json({status: 'success', result})
		})
		.catch(err=> {
			res.status(400).json({status: 'DB err', err})
		})
}





module.exports = {
	getUser, getCollectionId, editUser, editCoins
}
