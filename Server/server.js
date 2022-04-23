const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

const { userDatabase } = require('./config/firebaseAdmin');
const {login, getUser, changeCoins, getCards, processCards} = require('./src/user/user.router')
const createPath = require('./src/helpers/createPath.js');


app.use(express.json({
    type: "application/json",
    limit: "4MB"
}));  // позволяет получать json-files
app.use(express.urlencoded({
    extended: false,
    limit: '50mb'
}));
app.use(cors({
    origin: 'http://localhost:5000',
    // optionsSuccessStatus: 200
}))

app.use('/', express.static('Front-end')); // путь для подгрузки всех элементов



app.post('/login', login)
app.post('/getUser', getUser)

app.post('/changeCoins', changeCoins)
app.get('/getCards', processCards)

app.get('/game', (req, res)=>{
	res.sendfile(createPath('game'))
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const schedule = require('node-schedule');

const job = schedule.scheduleJob('0 0 0 * * *', function(fireDate){
    userDatabase.get()
        .then((docs) => {
            docs.forEach((doc) => {
                doc.ref.update({
                    coins: doc.data().coins += 1000
                })
            })
        })
  });
