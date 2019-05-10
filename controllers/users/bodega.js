'use strict'

const conn = require('../connect').connection;

async function obtenerInventario(req,res){    
    
    var skus = JSON.parse(req.query.arreglo); 
    var pais = req.query.pais;
    var destino = req.query.destino;
    var origen = req.query.origen;

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
    
    var sku = req.query.sku;
    var cantidad = req.query.cantidad;
    var direccion = req.query.direccion;
    var pais = req.query.pais

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



module.exports = {
    obtenerInventario,
    despacharOrden
}