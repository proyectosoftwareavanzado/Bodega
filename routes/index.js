'use strict'

const express = require('express');

/*************Instancias controladores administrador****************/
const user = require('../controllers/users/bodega');
/*******************************************************************/

const api = express.Router();

api.get('/Bodega/obtenerInventario',user.obtenerInventario);
api.get('/Bodega/getInventarioReal',user.getInventarioReal);
api.get('/Bodega/getTiempoEntrega',user.getTiempoEntrega);
api.get('/Bodega/suscripcionTienda',user.suscripcionTienda);
api.post('/Bodega/realizarDespacho',user.despacharOrden);


//api.get('/odega/getCantidad/',user.obtenerInventarioUnico);

module.exports = api;