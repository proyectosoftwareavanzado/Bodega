'use strict'

const express = require('express');

/*************Instancias controladores administrador****************/
const user = require('../controllers/users/bodega');
/*******************************************************************/

const api = express.Router();

api.get('/bodega',user.listUsers);
api.get('/bodega/getInventario/',user.obtenerInventario);
api.get('/bodega/getCantidad/',user.obtenerInventarioUnico);

module.exports = api;