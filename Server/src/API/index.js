const express = require('express');
const router = express.Router();
const app = express();
app.use(express.urlencoded({extended: false})); // middle var - позволяет принимать body в запросах
const {login, getUser, editUser, editCoins, getCollectionId} = require('./GAME');

// POST
router.post('/api/login', (req,res) => login(req, res));
router.post('/api/user_edit', (req,res) => editUser(req,res));
router.post('/api/coins_change', (req,res) => editCoins(req,res));
// GET
router.get('/api/user', getUser);
router.get('/api/images_id', getCollectionId);


module.exports = router
