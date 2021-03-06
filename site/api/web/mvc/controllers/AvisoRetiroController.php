<?php
require_once('./libs/GeoChe.php');
require_once('./mvc/models/VolumenMaterialesModel.php');
require_once('./mvc/models/FranjaHorariaModel.php');
require_once('./mvc/models/AvisoRetiroModel.php');
require_once('./mvc/controllers/ApiController.php');

class AvisoRetiroController extends ApiController {

    private $modelFranjaHoraria; 
    private $modelVolumen;
    private $modelAvisoRetiro;
  
    public function __construct() {
        parent::__construct();
        $this->modelFranjaHoraria = new FranjaHorariaModel();
        $this->modelVolumen = new VolumenMaterialesModel();
        $this->modelAvisoRetiro = new AvisoRetiroModel();
    }

    public function postAvisoRetiro() {
        $respuesta = []; 
        $codigo;
        $data = $this->getData();
        if ( ! empty($data->nombre) && ! empty($data->apellido) && ! empty($data->direccion) && ! empty($data->id_horario) && ! empty($data->id_volumen)) {
            $g = new GeoChe('Hipólito Yrigoyen 1178', 'tandil');
            $distancia = $g->distanciaDe($data->direccion);
            //$respuesta[ 'distancia' ] = $distancia;
            if ($distancia > -1 && $distancia < 6000) {
                $id = $this->modelAvisoRetiro->saveAvisoRetiro($data);
                if (isset($id)) {
                    $respuesta[ 'ok' ] = true;
                    $respuesta[ 'id' ] = $id;
                    $respuesta[ 'mensaje' ] = "El aviso de retiro de material ha sido cargado con éxito, un recolector pasará por su casa dentro de los horarios elegidos..";      
                    $codigo = 200;
                }
                else {
                    $respuesta[ 'ok' ] = false;
                    $respuesta[ 'mensaje' ] = "Algo salió mal :(";
                    $respuesta[ 'direccion' ] = false;
                    $codigo = 400;
                }
            }
            else {
                $respuesta[ 'ok' ] = false;
                $respuesta[ 'mensaje' ] = $distancia > -1 ? "Usted vive a más de 6km del centro de recolección, puede acercarse personalmente o vincularse a otros ciudadanos a traves de la cartelera de ofertas de transporte." : "No se encontró la dirección";
                $respuesta[ 'direccion' ] = $distancia > -1 ? true : false;
                $codigo = 400;
            }
        } 
        else {
            $respuesta[ 'ok' ] = false;
            $respuesta[ 'mensaje' ] = "Faltan ingresar datos";
            $respuesta[ 'direccion' ] = false;
            $codigo = 400;
        }
        $this->view->response($respuesta, $codigo);
    }

    public function getFranjasHorarias() { 
        $franjas = $this->modelFranjaHoraria->getFranjasHorarias();
        $this->view->response($franjas, 200);
    }  

    public function getVolumenesMateriales() { 
        $volumenes = $this->modelVolumen->getVolumenesMateriales();
        $this->view->response($volumenes, 200);
    }  

   public function getAvisosRetiro() {
       $avisos = $this->modelAvisoRetiro->getAvisosRetiro();
       $this->view->response($avisos, 200);
    }
}  