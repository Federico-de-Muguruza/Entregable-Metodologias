<?php

require_once "./mvc/controllers/MaterialController.php";
require_once "./mvc/controllers/AvisoRetiroController.php";
require_once "./libs/Router.php";
require_once "./libs/GeoChe.php";



$resource = $_GET["action"];

// método utilizado
$method = $_SERVER["REQUEST_METHOD"];

// instancia el router
$router = new Router();

// arma la tabla de ruteo

$router->addRoute("franjas_horarias", "GET", "AvisoRetiroController", "getFranjasHorarias");
$router->addRoute("volumenes_materiales", "GET", "AvisoRetiroController", "getVolumenesMateriales");
$router->addRoute("aviso_retiro","POST","AvisoRetiroController","postAvisoRetiro");
$router->addRoute("materiales_aceptados", "GET", "MaterialController", "getMateriales");
$router->addRoute("api/admin/avisos-retiro", "GET", "AvisoRetiroController", "getAvisosRetiro");
$router->addRoute("admin/material-aceptado/:id", "DELETE", "MaterialController", "deleteMaterial");
$router->addRoute("admin/material-aceptado", "POST", "MaterialController", "postMaterial");
$router->addRoute("admin/material-aceptado/:id", "PUT", "MaterialController", "postMaterial");

// rutea
$router->route($resource, $method);

