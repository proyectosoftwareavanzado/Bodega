'use strict'

const express = require('express');

/*************Instancias controladores administrador****************/
const user = require('../controllers/users/bodega');
const auth = require('../controllers/mdl');
/*******************************************************************/

const api = express.Router();

api.get('/Bodega/obtenerInventario',auth.checkToken,user.obtenerInventario);
api.post('/Bodega/realizarDespacho',auth.checkToken,user.despacharOrden);

api.get('/Bodega/getInventarioReal',user.getInventarioReal);
api.get('/Bodega/getTiempoEntrega',user.getTiempoEntrega);
api.get('/Bodega/suscripcionTienda',user.suscripcionTienda);

api.get('/Bodega/consultarPIM/',user.catalogoPIM);

module.exports = api;