const express = require('express');
const path = require('path');
const createPath = require('./src/helpers/createPath.js');
const API = require('./src/API');
const morgan = require('morgan');
const router = require('./src/routes.js');
const mongoose = require('mongoose');

const app  = express();
const PORT = 5000;
const db = `mongodb+srv://Pandemonium:pand8866@cluster0.3jivp.mongodb.net/Pandemonium?retryWrites=true&w=majority`;

mongoose
	.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(res=>{console.log('MongoDB -- connect')})
	.catch(err=>{console.log(err);})


app.use('/', express.static( path.resolve(__dirname, 'Front-end') ) ); // путь для всех элементов
app.use(morgan(':method :url :status :res[content-length] :response-time ms')); // выведение в консоль всех запросов
app.use(express.json());  // позволяет получать json-files
app.use(express.urlencoded({extended: false})); // middle var - позволяет принимать body в запросах
app.use(API); // API
app.use(router); // roter









// start server
app.listen(PORT, (err)=>{
	err ? console.log(err) : console.log(`PORT: ${PORT}`);
})
