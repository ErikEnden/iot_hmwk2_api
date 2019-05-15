require('dotenv').config()
const pgp = require('pg-promise')()
const express = require('express')
const bp = require('body-parser')
const app = express()
const port = 3000
const cors = require('cors')
const db = pgp(
    'postgres://' +
    process.env.DB_USER + ':' +
    process.env.DB_PASS + '@' +
    process.env.DB_HOST + ':' +
    process.env.DB_PORT + '/' +
    process.env.DB_NAME
)

app.use(bp.urlencoded({ extended: false }))
app.use(cors())

app.get('/', function(req, res){
    res.send('working')
})

app.get('/hist', function(req, res){
    db.many('SELECT * FROM ' + process.env.TABLE_NAME + ' ORDER BY time DESC LIMIT 100')
    .then(function (resp) {
        res.send(resp)
      })
      .catch(function (error) {
        console.log(error)
        res.sendStatus(204)
      })
    })
app.post('/set-temp', function(req, res){
    curTemp = req.body.temp
    console.log(req.body.temp)
    db.none('INSERT INTO "' + process.env.TABLE_NAME + '"(measurement) VALUES (${temp})', {
        temp: curTemp
      })
      .then(function (response) {
        console.log(response)
        res.sendStatus(200)
      }).catch(function (error) {
        console.log(error)
        res.sendStatus(204)
      })
})

app.listen(port, () => console.log('Listening on 3000'))