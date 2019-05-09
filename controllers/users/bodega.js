'use strict'

const conn = require('../connect').connection;

async function listUsers(req,res){
    
    await conn.query('SELECT nombre from producto;', function (error, results, fields) {
        if (error) 
        {
            console.log(error);
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }
        console.log(fields);
        console.log(results);
        res.jsonp(results);
    });
}

async function obtenerInventario(req,res){
    
    var params = JSON.parse(req.query.skus);   

    await conn.query('SELECT SKU as sku, cantidad as inventario from producto ;', function (error, results, fields) {
        if (error) 
        {
            console.log(error);
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }

        var resultado = []

        for(var x = 0; x < results.length; x++){
            for(var y = 0; y < params.length; y++){
                if(results[x].sku == params[y]){
                    resultado.push(results[x]);
                }
            }
        }

        res.jsonp(resultado);
    });
}

async function obtenerInventarioUnico(req,res){
    
    var sku = JSON.parse(req.query.sku);   

    console.log(sku)

    await conn.query("SELECT SKU as sku, cantidad from producto WHERE sku = '"+sku+"';", function (error, results, fields) {
        
        if (error) 
        {
            console.log(error);
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }        

        res.jsonp(results);
    });
}

module.exports = {
    listUsers,
    obtenerInventario,
    obtenerInventarioUnico
}