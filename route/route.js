exports.home = function (req, res) {
    req.getConnection(function(err, connect) {
        const query = connect.query("SELECT * FROM product", function(err, rows) {
            if(err) {
                console.log('Error message: %', err);
            }
            res.render('index', {
                page_title: 'Latihan Nodejs',
                data: rows
            });
        });
    });
}

exports.produk_detail = function (req, res) {
    const id_product = req.params.id_product
    req.getConnection(function (err, connect) {
        const query = connect.query('SELECT * FROM product WHERE id_product=?', id_product, function(err, rows) {
            if(err) {
                console.log('Error message: %', err);
            }
            res.render('detail-product', {
                page_title: 'Latihan Nodejs: Produk Detail',
                data: rows
            });
        });
    });
} 