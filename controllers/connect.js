'use strict'

const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '35.225.155.247',
    user     : 'root',
    password : '123',
    database : 'bodega'
});

var authConn = mysql.createConnection({
    host     : '35.225.155.247',
    user     : 'root',
    password : '123',
    database : 'auth'
});

module.exports = {
    connection,
    authConn
}
