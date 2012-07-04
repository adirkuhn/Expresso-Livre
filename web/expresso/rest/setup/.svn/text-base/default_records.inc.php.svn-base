<?php

  /**************************************************************************\
  * eGroupWare - Setup                                                       *
  * http://www.egroupware.org                                                *
  * --------------------------------------------                             *
  *  This program is free software; you can redistribute it and/or modify it *
  *  under the terms of the GNU General Public License as published by the   *
  *  Free Software Foundation; either version 2 of the License, or (at your  *
  *  option) any later version.                                              *
  \**************************************************************************/

$secret = substr(md5(rand().rand()), 0, 16); //Gera senha aleatoria

$oProc->query("INSERT INTO rest_client (client_id, client_secret) values (1, '$secret');");
$dados = array();
$oProc->query("select * from phpgw_config where config_app='phpgwapi'");
while ($oProc->next_record())
{
    $test = @unserialize($oProc->f('config_value'));
    if($test)
        $dados[$oProc->f('config_name')] = $test;
    else
        $dados[$oProc->f('config_name')] = $oProc->f('config_value');
}

/*
Cria e configura o arquivo REST.ini 
*/
require_once dirname(__FILE__) . '/../../prototype/api/config.php';

use prototype\api\Config as Config;

$config = array();
$config['baseUri'] = $dados['webserver_url'].'/rest';
$config['oauth']['url_token'] = 'http://' . $_SERVER['HTTP_HOST'] . $dados['webserver_url'].'/rest/token';
$config['oauth']['client_id'] = 1;
$config['oauth']['client_secret'] = $secret;

Config::writeIniFile($config , dirname(__FILE__) . '/../../prototype/config/REST.ini', true);
    

?>
