'use strict'

const express = require('express');

/*************Instancias controladores administrador****************/
const user = require('../controllers/users/bodega');
/*******************************************************************/

const api = express.Router();

api.get('/Bodega/obtenerInventario',user.obtenerInventario);
api.post('/Bodega/realizarDespacho',user.despacharOrden)
//api.get('/odega/getCantidad/',user.obtenerInventarioUnico);

module.exports = api;