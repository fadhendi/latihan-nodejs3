const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const route = require('./route/route');
const myadmin = require('./route/myadmin');

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

app.use(
    session({
        secret: 'thunder_cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 200000}
    })
)

app.get('/', function(req,res) {
    res.send('Server running at port ' + app.get('port'));
});

app.get('/latihan', route.home);
app.get('/latihan/detail-product/:id_product', route.produk_detail);

app.get('/latihan/admin', myadmin.login);
app.get('/latihan/admin/login', myadmin.login);
app.post('/latihan/admin/login', myadmin.login);

app.get('/latihan/admin/home', myadmin.home);
app.get('/latihan/admin/add', myadmin.add_product);
app.post('/latihan/admin/add', myadmin.process_add_product);
app.get('/latihan/admin/edit/:id_product', myadmin.edit_product);
app.post('/latihan/admin/edit/:id_product', myadmin.process_edit_product);
app.get('/latihan/admin/delete_product/:id_product', myadmin.delete_product)
;

app.listen(app.get('port'), function() {
    console.log('Server running at port ' + app.get('port'));
});