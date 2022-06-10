const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	waxName: {type: String, required: true},
	coins: {type: Number, required: true},
	battleHistory: {type: Array, required: true},
	nftCollection: {type: Array, required: true},
}, {timestamps: true});



const User = mongoose.model('User', userSchema);


module.exports = User;
