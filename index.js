const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const route = require('./route/route')

const conn = require('express-myconnection')
const mysql = require('mysql');

app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');

// app.use(express.static(__dirname + '/public/'));
app.use('/public', express.static(path.join(__dirname + '/public/')));
app.use(bodyParser.urlencoded({extended: false}));

app.use(
    conn(mysql,{
        host: '127.0.0.1',
        user: 'root',
        password: '',
        port: 3306,
        database: 'express_db'
    }, 'single')
);

app.get('/', function(req,res) {
    res.send('Server running at port ' + app.get('port'));
});

app.get('/latihan', route.home);
app.get('/latihan/detail-product/:id_product', route.produk_detail);

app.listen(app.get('port'), function() {
    console.log('Server running at port ' + app.get('port'));
});