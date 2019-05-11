'use strict'

const conn = require('../connect').connection;
const Request = require("request");

async function obtenerInventario(req,res){        

    var skus = req.body.arreglo; 
    var destino = req.body.destino;
    var origen = req.body.origen;

    var query = "SELECT SKU as sku , cantidad as inventario from producto WHERE ";
    //var query = "SELECT SKU as sku , cantidad as inventario , 0 as tiempo from producto WHERE ";

    var i = 0;

    for(var i = 0; i < skus.length; i++ ){        
        query += "sku = '"+skus[i]+"'";

        if(i != (skus.length-1)){
            query += " OR "
        }
    }

    //query += ";"
   
    console.log(query);

    /**var dias = 0;

    var queryDias = "SELECT * FROM countries WHERE countryName = '"+pais+"' or countryName = (select pais from localizacion);";

    await conn.query(queryDias, function (error, results, fields) {            
        
        if (error) 
        {
            console.log(error);
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }

        console.log(results);

        if(results.length > 1){

            if(results[0].continentName == results[1].continentName){
                dias = 3;
            }else{
                dias = 5;
            }

        }else{
            dias = 1;
        }        

    });**/


    await conn.query(query, function (error, results, fields) {
        
        if (error) 
        {
            console.log(error);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }

        /**results.forEach(element => {
            element.tiempo = dias;
        });**/

        var cad = "{\"products\":";

        cad+="[";

        for(var x = 0; x < results.length; x++){

            cad += "{\"sku\":\""+results[x].sku+"\",";
            cad += "\"inventario\":"+results[x].inventario;
            cad+="}"

            if(x != results.length -1 ){
                cad+=",";
            }

        }

        
        cad+="]}"

        console.log(cad);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.jsonp(JSON.parse(cad));


    });
}


async function despacharOrden(req,res){   

    var sku = req.body.sku;
    var cantidad = req.body.cantidad;
    var direccion = req.body.direccion;
    var pais = req.body.pais

    var query = "SELECT cantidad from producto WHERE SKU = '"+sku+"' ;";

    await conn.query(query, function (error, results, fields) {
        
        if (error) 
        {
            console.log(error);
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }

        var bool = false;
        
        var resultado = results[0].cantidad - cantidad;
        

        if( resultado >=0 ){
            bool = true;
        }

        //actualizamos la bd

        if(bool){

            conn.query("UPDATE producto SET cantidad = '"+resultado+"' WHERE SKU = '"+sku+"';", function (error, results, fields) {               

                if (error) 
                {
                    console.log(error);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.jsonp({error: 'Error al actualizar la cantidad del producto'})
                }

                console.log("Cantidad de producto actualizada");
            
            });

            conn.query("INSERT INTO orden (pais,valida,sku,cantidad,direccion)  VALUES ('"+pais+"','1','"+sku+"','"+cantidad+"','"+direccion+"');", function (error, results, fields) {               

                if (error) 
                {
                    console.log(error);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.jsonp({error: 'Error al guardar la orden aceptada'})
                }

                console.log("Se guardó la orden aceptada");
            
            });

            

        }else{


            conn.query("INSERT INTO orden (pais,valida,sku,cantidad,direccion)  VALUES ('"+pais+"','0','"+sku+"','"+cantidad+"','"+direccion+"');", function (error, results, fields) {               

                if (error) 
                {
                    console.log(error);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.jsonp({error: 'Error al guardar la orden rechazada'})
                }

                console.log("Se guardó la orden rechazada");
            
            });

        }

        var cad = "{\"resultado\":"+bool+"}"

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.jsonp(JSON.parse(cad));
    });

}



async function getInventarioReal(req,res){
    
    var sku = req.body.SKU;

    var query = "SELECT cantidad from producto WHERE SKU = '"+sku+"' ;";

    await conn.query(query, function (error, results, fields) {
        
        if (error)
        {
            console.log(error);
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }

        var cad = "{\"Result\":[{\"SKU\":"+sku+",\"cantidad\":"+results[0].cantidad+"}]}"

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.jsonp(JSON.parse(cad));
    });

}


async function getTiempoEntrega(req,res){
    
    
    var id_orden = req.body.ID_Orden;

    var dias = 0;

    var queryDias = "SELECT * from countries WHERE  countryName = (SELECT pais FROM orden WHERE idorden = '"+id_orden+"') OR  countryName = (select pais from localizacion);";

    console.log(queryDias);

    await conn.query(queryDias, function (error, results, fields) {            
        
        if (error) 
        {
            console.log(error);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }

        console.log(results);

        if(results.length > 1){

            if(results[0].continentName == results[1].continentName){
                dias = 3;
            }else{
                dias = 5;
            }

        }else{
            dias = 1;
        }  
        
        var cad = "{\"Result\":[{\"ID_Orden\":"+id_orden+",\"dias\":"+dias+"}]}"

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.jsonp(JSON.parse(cad));


    });

}



async function suscripcionTienda(req,res){
    
    var id_orden = req.body.ID_Tienda;

    var dias = 0;

    var queryDias = "INSERT INTO tienda (idtienda) VALUES ('"+id_orden+"')";

    console.log(queryDias);

    await conn.query(queryDias, function (error, results, fields) {            
        
        if (error) 
        {
            console.log(error);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }

        var cad = "{\"Result\":[{\"ID_Tienda\":"+id_orden+",\"EstadoTransaccion\":"+true+"}]}"
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.jsonp(JSON.parse(cad));

    });
}

/******************************** */
let jsonProductos;

async function catalogoPIM(req,res){

    await conn.query("DELETE FROM producto;", function (error, results, fields) {            
        
        if (error) 
        {
            console.log(error);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }
        
        console.log("Se limpiaron los productos");

    });

    res.setHeader('Access-Control-Allow-Origin', '*');    

    var options = {
        url : 'http://35.231.130.137:8081/PIM/obtenerCatalogo',
        method: 'GET',
        json: true,
        body: {}
    }
 
    await Request.get(options, (error, response, body) => {
                
        try {

            var productos = body.productos;
            
            var cantidad = productos.length;
            var inactividad = Math.ceil(productos.length*0.2);
            var inactivos = 0;
            var counter = 0;

            console.log("hay "+cantidad);
            console.log("deberian inactivarse "+inactividad);


            productos.forEach(element => {

                var cantidad = Math.floor(Math.random() * 200);   
                
                if(inactivos < inactividad && counter%2 == 0){                    
                        cantidad = 0;
                        inactivos++;                    
                }

                var sql = "INSERT INTO producto (SKU,cantidad,activo) VALUES ('"+element.sku+"','"+cantidad+"','"+element.activo+"');";
                console.log(sql);

                conn.query(sql, function (error, results, fields) {            
        
                    if (error) 
                    {
                        console.log(error);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.jsonp({error: 'Error de conexión a la base de datos.'})
                    }

                    console.log("Producto registrado exitosamente en la bodega");

                });

                counter++;
            });
            
            var cad = "{\"resultado\":\"correcto\"}"
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.jsonp(JSON.parse(cad));

        }catch(e){
            console.log(e);
            console.log("Hubo un error con el PIM");
        }

    });   

}


module.exports = {
    obtenerInventario,
    despacharOrden,
    getInventarioReal,
    getTiempoEntrega,
    suscripcionTienda,
    catalogoPIM
}