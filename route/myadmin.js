let multer = require('multer');

exports.login = function(req, res) {
    let message = '';
    let sess = req.session;

    if (req.method == 'POST' ) {
        let post = req.body;
        let name = post.username;
        let pass = post.password; 

        req.getConnection(function(err, connect) {
            let sql = "SELECT id_admin, username FROM  myadmin_tbl WHERE username = '"+name+"' AND password = '"+pass+"'";
            let query = connect.query(sql, function(err, results) {
                if(results.length) {
                    req.session.myAdmin = results[0].id_admin;
                    req.session.admin = results[0];
                    console.log(results[0].id_admin);
                    res.redirect('./home');
                } else {
                    message = "Username and Password incorrect! please try again"
                    console.log(message)
                    res.render('./admin/login', {
                        message: message,
                        sql: sql
                    });
                }
            });
        });
    } else {
        res.render('./admin/login', {
            message: message
        });
    }
}

exports.home = function(req, res) {
    let admin = req.session.admin;
    let myAdmin= req.session.myAdmin;
    console.log('id_admin ' + myAdmin);

    if (myAdmin == null) {
        res.redirect('/latihan/admin/login');
        return
    }

    req.getConnection(function(err, connect) {
        let sql = "SELECT * FROM product ORDER BY id_product ASC";

        let query = connect.query(sql, function(err, results) {
            res.render('./admin/home', {
                pathname: 'home', 
                data: results
            });
        });
    });
}

exports.add_product = function(req, res) {
    let admin = req.session.admin;
    let myAdmin = req.session.myAdmin;
    console.log('id_admin= ' + myAdmin);

    if (myAdmin == null) {
        res.redirect('/latihan/admin/login');
        return;
    }

    res.render ('./admin/home', {
        pathname: 'add'
    });
}

exports.process_add_product = function (req, res) {
    var storage = multer.diskStorage({
        destination: './public/images',
        filename: function(req, file, callback) {
            callback( null, file.originalname );
        }
    });

    var upload = multer({ storage: storage }).single('image');
    let date = new Date(Date.now());

    upload(req, res, function(err) {
        if(err) {
            return res.end('Error uploading image');
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            let post = {
                nama_produk: req.body.title,
                des_product: req.body.description,
                harga_product: req.body.price,
                gambar_produk: req.file.filename,
                createdate: date
            }
            console.log(post);

            let sql = "INSERT INTO product SET ?";

            let query = connect.query(sql, post, function(err, results) {
                if(err) {
                    console.log('Error input product: %s', err);
                }
                res.redirect('/latihan/admin/home');
            })
        });
    });
}

exports.edit_product = function(req, res) {
    let admin = req.session.admin;
    let myAdmin = req.session.myAdmin;
    console.log('id_admin= ' + myAdmin);

    if (myAdmin == null) {
        res.redirect('/latihan/admin/login');
        return;
    }

   let id_product = req.params.id_product;

   req.getConnection(function(err, connect) {
       let sql = "SELECT * FROM product WHERE id_product=?";

       let query = connect.query(sql, id_product, function(err, results) {
           if(err) {
               console.log('Error show product: %s', err);
           }

           res.render ('./admin/home', {
               id_product: id_product,
               pathname: 'edit',
               data: results
           })
       })
   })
}

exports.process_edit_product = function(req,res) {
    let id_product = req.params.id_product;

    let storage = multer.diskStorage({
        destination: './public/images',
        filename: function(req, file, callback) {
            callback(null,file.originalname);
        }
    });

    let upload = multer({ storage: storage}).single('image');
    let date = new Date(Date.now());

    upload(req, res, function(err) {
        if(err) {
            var image = req.body.image_old;
            console.log('Error uploading image');
        } else if (req.file == undefined) {
            var image = req.body.image_old;
        } else {
            var image = req.file.filename;
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            let post = {
                nama_produk: req.body.title,
                des_product: req.body.description,
                harga_product: req.body.price,
                gambar_produk: image,
                createdate: date
            }

            let sql = "UPDATE product SET ? WHERE id_product=?";

            let query = connect.query(sql, [post, id_product], function(err, results) {
                if(err) {
                    console.log('Error edit product: %s', err);
                }
                res.redirect('/latihan/admin/home');
            })
        })
    });
}

exports.delete_product = function(req, res) {
    let id_product = req. params.id_product;

    req.getConnection(function(err, connect) {
        let sql = "DELETE FROM product WHERE id_product=?";

        let query= connect.query(sql, id_product, function(err, results) {
            if(err) {
                console.log("Error delete product: %s", err);
            }
            res.redirect('/latihan/admin/home');
        })
    })
}