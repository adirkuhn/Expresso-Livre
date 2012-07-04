<?php

use prototype\api\Config as Config;

class CalendarLastResource extends Resource{

    
    /**
    * Busca os eventos contidos nas agendas assinas do usuário
    *
    * @license    http://www.gnu.org/copyleft/gpl.html GPL
    * @author     Consórcio Expresso Livre - 4Linux (www.4linux.com.br) e Prognus Software Livre (www.prognus.com.br)
    * @sponsor    Caixa Econômica Federal
    * @author     Adriano Coutinho da Silva
    * @return     Lista dos ultimos 10 eventos do usuário
    * @access     public
    **/
    function GET($request){
	$this->secured();

	$calendar = Controller::find( array( 'concept' => 'calendarSignature' ), array('calendar'), array( 'filter' => array( '=', 'user',  Config::me("uidNumber") ) ) );

	
	
	
	if($calendar){
	    $calendars = array();
	    $timezones = array();

	    foreach($calendar as $key => $value)
		array_push($calendars, $value['calendar']);

	    $calendarTimezone = Controller::find( array( 'concept' => 'calendar' ), array('id', 'timezone'), array( 'filter' => array( 'IN', 'id',  $calendars ) ) );

	    foreach($calendarTimezone as $key => $value)
		$timezones[ $value['id'] ] = $value['timezone'];


	    $schedulables = Controller::find( array( 'concept' => 'schedulable' ), false, 
		    array( 'filter' => array('AND', array('>=','rangeStart', (time() - 86400).'000'), array('<=','rangeEnd', (time() + 2592000).'000') ,array( 'IN', 'calendar', $calendars )), 'deepness' => 2, 'timezones' => $timezones) );

	}
	
	$response = new Response($request);
	$response->code = Response::OK;
	$response->addHeader('Content-type', 'aplication/json');

	$response->body = json_encode(( isset($schedulables) && $schedulables) ?  $schedulables : array());
	return $response;
    }
}

?>
