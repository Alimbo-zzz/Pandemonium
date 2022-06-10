const express = require('express');
const router = express.Router();
const app = express();
app.use(express.urlencoded({extended: false})); // middle var - позволяет принимать body в запросах
const {createPath} = require('./helpers');
// ___________

// _____routes

router.get('/', (req, res)=>{
	res.sendfile(createPath('index'))
})






router.use((req, res)=>{
	res
		.status(404)
		.sendfile(createPath('error'))
})

module.exports = router;
