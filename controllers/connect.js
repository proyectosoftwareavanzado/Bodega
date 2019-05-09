'use strict'

const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Mama26894_',
    database : 'bodega'
});

module.exports = {
    connection
}
