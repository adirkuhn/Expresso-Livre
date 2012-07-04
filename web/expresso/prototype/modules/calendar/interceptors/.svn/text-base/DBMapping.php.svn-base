<?php

//Definindo Constantes
require_once ROOTPATH . '/modules/calendar/constants.php';

require_once ROOTPATH . '/modules/calendar/interceptors/Helpers.php';

use prototype\api\Config as Config;

class DBMapping extends Helpers {

    static function encodeCreateSchedulable(&$uri, &$params, &$criteria, $original) {
	$params['type_id'] = EVENT_ID;

	if (!is_numeric($params['startTime']))
	    $params['startTime'] = self::parseTimeDate($params['startTime'], $params['timezone']);

	if (!is_numeric($params['endTime'])) {
	    $params['endTime'] = self::parseTimeDate($params['endTime'], $params['timezone']);

	    if ($params['allDay'])
		$params['endTime'] = $params['endTime'] + 86400000;
	}

	$params['rangeEnd'] = $params['endTime'];
	$params['rangeStart'] = $params['startTime'];

	///////////////////////////////////////////////////////////////////

	$params['dtstamp'] = (isset($params['dtstamp'])) ? $params['dtstamp'] : time() . '000';
	$params['lastUpdate'] = (isset($params['lastUpdate'])) ? $params['lastUpdate'] : time() . '000';
	$params['type'] = EVENT_ID;
	$params['uid'] = isset($params['uid']) ? $params['uid'] : self::_makeUid();
    }

    static function parseTimeDate($time, $timezone) {
	return strtotime($time . ' ' . $timezone) . '000';
    }

     public function encodeCreateAlarm( &$uri , &$params , &$criteria , $original ){
      	
        if(!isset($params['schedulable']) || !isset($params['rangeStart']) || !isset($params['rangeEnd']) )
        {
            $participant = Controller::read( array( 'concept' => 'participant' , 'id' => $params['participant'] ) , array('schedulable')  );

            $params['schedulable'] = $participant['schedulable'];

	    $params['type'] = self::codeAlarmType($params['type']);

	    $params['offset'] = $params['time'] * 1000;

	    switch( strtolower($params['unit']) )
	    {
		case 'd': $params['offset'] *= 24;
		case 'h': $params['offset'] *= 60;
		case 'm': $params['offset'] *= 60;
	    }
        }
    }

    public function encodeCreateSuggestion(&$uri, &$params, &$criteria, $original) {
	$params['dtstamp'] = (isset($params['dtstamp'])) ? $params['dtstamp'] : time() . '000';
    }

    public function encodeUpdateAlarm(&$uri, &$params, &$criteria, $original) {
	if (isset($params['type']))
	    $params['type'] = self::codeAlarmType($params['type']);
    }

    public function encodeCreateAttachment(&$uri, &$params, &$criteria, $original) {

	if (!isset($params['source']))
	    return false;

	if (isset($_FILES[$params['source']]))
	    if (isset($params['id']))
		$params = array_merge($_FILES[$params['source']], array('id' => $params['id']));
	    else
		$params = $_FILES[$params['source']];

	if (isset($params['owner']))
	    $params['owner'] = Config::me('uidNumber');
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function encodeSignatureAlarmType(&$uri, &$params, &$criteria, $original) {
	$params['type'] = self::codeAlarmType($params['type']);
    }

    public function insertOwnerLink(&$uri, &$params, &$criteria, $original) {
	$params['owner'] = Config::me('uidNumber');
    }

    public function encodeServiceUser(&$uri, &$params, &$criteria, $original) {
	if (isset($params['isExternal']) && $params['isExternal'] == '1')
	    $uri['service'] = 'PostgreSQL';
    }

    public function prepareRepeat(&$uri, &$params, &$criteria, $original) {
	if (isset($params['startTime']) || isset($params['endTime'])) {
	    
	    if(!isset($params['schedulable']))
		$params = array_merge($params , Controller::read(array('concept' => 'repeat', 'id' => $params['id']), array('schedulable')));
 
	    $timezone = Controller::read(array('concept' => 'schedulable', 'id' => $params['schedulable']), array('timezone'));

	    if (isset($params['startTime']))
		$params['startTime'] = self::parseTimeDate($params['startTime'], $timezone['timezone']);
	    if (isset($params['endTime']))
		$params['endTime'] = self::parseTimeDate($params['endTime'], $timezone['timezone']);
	}
    }

    public function findSchedulable(&$uri, &$params, &$criteria, $original) {
	if (isset($criteria['filter'][2][1]) && $criteria['filter'][2][1] == 'calendar') {

	    $sql = ' SELECT calendar_object.id as id ,calendar_object.cal_uid as "uid", calendar_object.type_id as "type", '
		.'calendar_object.dtstart as "startTime", calendar_object.summary as "summary", '
		.'calendar_object.description as "description", calendar_object.dtend as "endTime" , '
		.'calendar_object.location as "location", calendar_object.allday as "allDay", '
		.'calendar_object.transp as "transparent", calendar_object.class_id as "class", '
		.'calendar_object.repeat as "repeat", calendar_object.range_start as "rangeStart", '
		.'calendar_object.range_end as "rangeEnd", calendar_object.last_update as "lastUpdate", '
		.'calendar_object.dtstamp as "dtstamp", calendar_object.sequence as "sequence", '
		.'calendar_object.tzid as "timezone" ,calendar_to_calendar_object.calendar_id as '
		.'calendar FROM calendar_to_calendar_object , calendar_object '
		.'WHERE ( calendar_to_calendar_object.calendar_id IN (\'' . implode('\',\'', $criteria['filter'][2][2]) . '\')) '
		.'AND calendar_to_calendar_object.calendar_object_id = calendar_object.id ';	
	    
	    if(isset($criteria['searchEvent']) && $criteria['searchEvent']){
		$where = 'AND (((upper("summary") like upper(\'%'.$criteria['filter'][1][1][2].'%\') OR upper("description") like upper(\'%'.$criteria['filter'][1][2][2].'%\')))) ORDER BY dtstart LIMIT '.$criteria['limit'].'  OFFSET '.$criteria['offset'].' ';
		$params = Controller::service('PostgreSQL')->execResultSql($sql.$where);

	    }else{
		$start = array( $criteria['filter'][1][1][1][2] , $criteria['filter'][1][2][1][2], $criteria['filter'][1][3][1][2] );
		$end = array( $criteria['filter'][1][1][2][2] , $criteria['filter'][1][2][2][2], $criteria['filter'][1][3][2][2] );

		$ids = array();
		$occ = array();

		if ($occurrences = self::checkOccurrences($start[0], $end[0], $criteria['filter'][2][2]))
		    foreach ($occurrences as $id => $occurrence) {
			$ids[] = $id;
			$occ[] = $occurrence;
		    }	

		$where = 'AND ((range_end >= \'' . $start[0] . '\' AND range_end <= \'' . $end[0] . '\') OR '
			.'(range_start >= \'' . $start[1] . '\' AND range_start <= \'' . $end[1] . '\') OR '
			.'(range_start <= \'' . $start[2] . '\' AND range_end >= \'' . $end[2] . '\')) '
		.(!empty($ids) ? ' ' .'AND calendar_object.id NOT IN (\'' . implode('\',\'', $ids) . '\') ' : ' ')
		.'AND calendar_object.dtstart NOT IN (SELECT calendar_repeat_occurrence.occurrence from calendar_repeat_occurrence, '
		.'calendar_repeat where (calendar_repeat_occurrence.repeat_id = calendar_repeat.id) '
		.'AND (calendar_repeat.object_id = calendar_object.id))';

		$params = Controller::service('PostgreSQL')->execResultSql($sql.$where);
		$params = array_merge($params, $occ);		
	    }
	    $params = self::deepnessFindEvent($uri, $params, $criteria, $original);
	    return false;
	}
    }

    public function deepnessFindRepeatOccurrence(&$uri, &$result, &$criteria, $original) {

	if (!isset($criteria['deepness']) || $criteria['deepness'] == 0)
	    return;

	foreach ($result as $i => &$res)
	    if (isset($res['repeat']))
		$res['repeat'] = Controller::read(array('concept' => 'repeat', 'id' => $res['repeat']), false, array('deepness' => intval($criteria['deepness']) - 1));
    }

    public function deepnessRepeat(&$uri, &$result, &$criteria, $original) {

	if (!isset($criteria['deepness']) || $criteria['deepness'] == 0)
	    return;

	$result['schedulable'] = Controller::find(array('concept' => 'schedulable'), false, array('filter' => array('=', 'id', $result['schedulable']), 'deepness' => intval($criteria['deepness']) - 1));
	$result['schedulable'] = $result['schedulable'][0];
    }

    public function saveOccurrences(&$uri, &$result, &$criteria, $original) {
	$ranges = Controller::find(array('concept' => 'repeatRange'), array('rangeStart', 'rangeEnd'), array('filter' => array('=', 'user', Config::me("uidNumber"))));

	if (!is_array($ranges) || !isset($ranges[0]['rangeStart']) || !isset($ranges[0]['rangeEnd']))
	    return;

	if (isset($result['id']))
	    $id = $result['id'];
	else
	    $id = $uri['id'];

	$repeat = Controller::read(array('concept' => 'repeat', 'id' => $id));

	unset($repeat['schedulable']);
	unset($repeat['id']);

	$exceptions = array();

	if (isset($original['properties']['exceptions'])) {
	    $exceptions = explode(',', $original['properties']['exceptions']);
	    unset($repeat['exceptions']);
	}

	$lastExceptions = Controller::find(array('concept' => 'repeatOccurrence'), array("occurrence"), array('filter' => array('AND', array('=', 'repeat', $id), array('=', 'exception', 1))));

	//Recurepa as execeções anteriores caso exista
	if (isset($lastExceptions) && count($lastExceptions) && $lastExceptions)
	    foreach ($lastExceptions as $value)
		array_push($exceptions, $value['occurrence']);

	$params = array_diff(self::decodeRepeat($repeat, $ranges[0]['rangeStart'], $ranges[0]['rangeEnd']), $exceptions);

	Controller::delete(array('concept' => 'repeatOccurrence'), false, array('filter' => array('=', 'repeat', $id)));

	if (!empty($params))
	    Controller::service('PostgreSQL')->execResultSql("INSERT INTO calendar_repeat_occurrence(repeat_id,exception,occurrence)VALUES('" . $id . "','0','" . implode("'),('" . $id . "','0','", $params) . "')" . ( empty($exceptions) ? "" : ",('" . $id . "','1','" . implode("'),('" . $id . "','1','", $exceptions) . "')" ));
	else if(!empty($exceptions))
	    Controller::service('PostgreSQL')->execResultSql("INSERT INTO calendar_repeat_occurrence(repeat_id,exception,occurrence)VALUES ('" . $id . "','1','" . implode("'),('" . $id . "','1','", $exceptions) . "')" );
    }	    

    public function checkOccurrences($start, $end, $calendarIds) {

	$ranges = Controller::find(array('concept' => 'repeatRange'), array('rangeStart', 'rangeEnd'), array('filter' => array('=', 'user', Config::me("uidNumber"))));
	$ranges = $ranges[0];

	$origStart = $start;
	$origEnd = $end;

	if ($initialized = (isset($ranges['rangeStart']) && isset($ranges['rangeEnd']))) {
	    if ($ranges['rangeStart'] <= $start)
		$start = false;
	    if ($ranges['rangeEnd'] >= $end)
		$end = false;
	}

	$repeats = self::findRepeats($calendarIds);
	if (!is_array($repeats) || empty($repeats))
	    return( false );

	$result = array();
	$ids = array();

	foreach ($repeats as $repeat) {
	    $ids[] = $id = $repeat['id'];
	    unset($repeat['id']);

	    if (!isset($result[$id]))
		$result[$id] = !$initialized ? array($repeat['startTime']) : array();

	    if (!$initialized)
		$result[$id] = array_merge($result[$id], self::decodeRepeat($repeat, $start, $end));
	    else {
		if ($start)
		    $result[$id] = array_merge($result[$id], self::decodeRepeat($repeat, $start, $ranges['rangeStart']));

		if ($end)
		    $result[$id] = array_merge($result[$id], self::decodeRepeat($repeat, $ranges['rangeEnd'], $end));
	    }

	    if (empty($result[$id]))
		unset($result[$id]);
	}

	if ($start || $end) {
	    Controller::begin(array('service' => 'PostgreSQL'));

	    foreach ($result as $id => $res){
		
                $ocurrences = array_unique($res);
                Controller::service('PostgreSQL')->execResultSql("INSERT INTO calendar_repeat_occurrence(repeat_id,occurrence)VALUES('" . $id . "','" . implode("'),('" . $id . "', '", $ocurrences) . "')");
            }
	    $data = array();

	    if ($start)
		$data['rangeStart'] = $start;

	    if ($end)
		$data['rangeEnd'] = $end;

	    if (!$initialized)
		$data['user'] = Config::me('uidNumber');

	    Controller::call(( $initialized ? 'replace' : 'create'), array('concept' => 'repeatRange'), $data, array('filter' => array('=', 'user', Config::me('uidNumber'))));

	    Controller::commit(array('service' => 'PostgreSQL'));
	}

// 	$return = Controller::find( array( 'concept' => 'repeatOccurrence' ), false, array( 'filter' => array( 'AND', array( '>=', 'occurrence', $origStart ), array( '<=', 'occurrence', $origEnd ), array( 'IN', 'repeat', $ids ) ), 'deepness' => $deep ) );

	$return = Controller::service('PostgreSQL')->execResultSql('SELECT calendar_repeat_occurrence.occurrence as "occurrence", calendar_repeat.object_id as "schedulable" FROM calendar_repeat, calendar_repeat_occurrence WHERE calendar_repeat_occurrence.occurrence >= \'' . $origStart . '\' AND calendar_repeat_occurrence.occurrence <= \'' . $origEnd . '\' AND calendar_repeat_occurrence.repeat_id IN (\'' . implode('\',\'', $ids) . '\') AND calendar_repeat.id = calendar_repeat_occurrence.repeat_id AND calendar_repeat_occurrence.exception != 1');

	if (!is_array($return))
	    return( false );

	$result = array();
	$params = array();

	foreach ($return as $ret) {
	    $currentId = $ret['schedulable'];

	    if (!isset($result[$currentId])) {
		$result[$currentId] = Controller::read(array('concept' => 'schedulable', 'id' => $currentId));
		$result[$currentId]['occurrences'] = array();

		$calendarToCalendarObj = self::schedulable2calendarToObject($currentId);
		$result[$currentId]['calendar'] = $calendarToCalendarObj[0]['calendar_id'];
	    }

	    $result[$currentId]['occurrences'][] = $ret['occurrence'];
	}

	return( $result );
    }

    public static function findRepeats($ids) {
	return Controller::service('PostgreSQL')->execResultSql('SELECT calendar_repeat.wkst as "wkst", calendar_repeat.byweekno as "byweekno", calendar_repeat.byminute as "byminute", calendar_repeat.bysecond as "bysecond", calendar_repeat.byyearday as "byyearday", calendar_repeat.bymonthday as "bymonthday", calendar_repeat.bysetpos as "bysetpos", calendar_repeat.byday as "byday", calendar_repeat.byhour as "byhour", calendar_repeat.interval as "interval", calendar_repeat.frequency as "frequency", calendar_repeat.until as "endTime", calendar_repeat.id as "id", calendar_repeat.count as "count", calendar_repeat.dtstart as "startTime" FROM calendar_repeat, calendar_to_calendar_object WHERE calendar_repeat.object_id = calendar_to_calendar_object.calendar_object_id AND calendar_to_calendar_object.calendar_id IN (\'' . implode('\',\'', $ids) . '\')');
    }

//HELPERS
    public static function decodeRepeat($repeat, $start, $end) {

	date_default_timezone_set('UTC');

	require_once ROOTPATH . '/plugins/when/When.php';

	$r = new When();

	if ($repeat['frequency'] === 'none')
	    return( array() );

	//Nao deve ser usando o horário da repeticao pois nela contem apenas o dias,
	//deve se recuperar o horário do evento para um correto calculo.
	if (max($start, $repeat['startTime']) != $repeat['startTime']) {
	    $time = new DateTime('@' . (int) ( $repeat['startTime'] / 1000 ), new DateTimeZone('UTC'));

	    $hoursOcurrence = new DateTime('@' . (int) ( $start / 1000 ), new DateTimeZone('UTC'));
	    $hoursOcurrence = $hoursOcurrence->format('H');

	    $diffTime = ((($time->format('H') - $hoursOcurrence) * (3600000)) + ($time->format('i') * (60000)));
	    $start = new DateTime('@' . (int) ( ( $start + $diffTime ) / 1000 ), new DateTimeZone('UTC'));
	}else
	    $start = new DateTime('@' . (int) ( max($start, $repeat['startTime']) / 1000 ), new DateTimeZone('UTC'));

	foreach ($repeat as $rule => $value) {
	    if (!isset($value) || !$value || $value === "0")
		continue;

	    switch (strtolower($rule)) {
		case "starttime": break;
		case "frequency":
		    $r->recur($start, $value);
		    break;
		case "endtime":
		    $r->until(new DateTime('@' . (int) ( $value / 1000 )));
		    break;
		case "count": case "interval": case "wkst":
		    $r->$rule($value);
		    break;
		default :
		    $r->$rule(!is_array($value) ? explode(',', $value) : $value );
		    break;
	    }
	}

	$return = array();

	while ($result = $r->next()) {
	    $u = $result->format('U') * 1000;

	    if ($u > $end) //data da repetição atual maior que a data final da busca do usuario ?
		break;

	    $return[] = $u;
	}

	return( $return );
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function updateCalendar(&$uri, &$params, &$criteria, $original) {       
        if (isset($params['calendar'])) {
            if(isset($params['lastCalendar'])){
                $calendarObjects = self::referenceCalendarToObject($uri['id'], $params['lastCalendar']);
                $params2['calendar'] = $params['calendar'];
            }else{
                $calendarObjects = self::schedulable2calendarToObject($uri['id']);
                $params2['calendar'] = $params['calendar'];
            }
	    
            foreach ($calendarObjects as $calendarObject)
		Controller::update(array('concept' => 'calendarToSchedulable', 'id' => $calendarObject['calendar_to_calendar_object']), $params2);

	    unset($params['calendar']);

	    if (count($params) < 1)
		return false;
	}
    }

//Encode Update

    public function encodeUpdateSchedulable(&$uri, &$params, &$criteria, $original) {

	$event = Controller::read(array('concept' => 'schedulable', 'id' => $params['id']));
	
	if (isset($params['startTime'])) {

	    if (!is_numeric($params['startTime']))
		$params['startTime'] = self::parseTimeDate($params['startTime'], $event['timezone']);

	    $params['rangeStart'] = $params['startTime'];
	}if (isset($params['endTime'])) {

	    if (!is_numeric($params['endTime'])) {
		$params['endTime'] = self::parseTimeDate($params['endTime'], $event['timezone']);

	    if ((isset($params['allDay']) && $params['allDay']) || ( !isset($params['allDay']) && $event['allDay']))
		$params['endTime'] = $params['endTime'] + 86400000;
	    }
	    $params['rangeEnd'] = $params['endTime'];
	}
    }

    static function putEvent(&$uri, &$result, &$criteria, $original) {
	if (Config::module('useCaldav', 'expressoCalendar')) { //Ignorar Put dos eventos ja vindos do caldav
	    require_once ROOTPATH . '/modules/calendar/interceptors/DAViCalAdapter.php';

	    $eventID = (isset($result['id'])) ? $result['id'] : $uri['id'];
	    $event = Controller::read(array('concept' => 'schedulable', 'id' => $eventID));

	    $participants = Controller::find(array('concept' => 'participant'), false, array('filter' => array('=', 'schedulable', $eventID)));

	    if (is_array($participants) && count($participants) > 0)
		foreach ($participants as $ii => $vv) {
		    if ($vv['isExternal'] == 1)
			$participants[$ii]['user'] = Controller::read(array('concept' => 'user', 'id' => $vv['user'], 'service' => 'PostgreSQL'));
		    else
			$participants[$ii]['user'] = Controller::read(array('concept' => 'user', 'id' => $vv['user']));
		}

	    $event['URI']['concept'] = 'schedulable';
	    $event['participants'] = $participants;

	    $ical = Controller::format(array('service' => 'iCal'), array($event));
	    $calendars = self::schedulable2calendarToObject($original['properties']['id']); //Busca os calendarios do usuario logado que contenham o evento
	    if (is_array($calendars))
		foreach ($calendars as $calendar)
		    DAViCalAdapter::putIcal($ical, array('uid' => $event['uid'], 'location' => $calendar['calendar_location']));
	}
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function verifyCalendarLocation(&$uri, &$params, &$criteria, $original) {
	if (!isset($params['location']))
	    $params['location'] = Config::me('uid') . '/' . $params['name'];
    }

    //TODO: Remover apos suporte a ManytoMany na api 
    public function createCalendarToSchedulable(&$uri, &$result, &$criteria, $original) {

	Controller::create(array('concept' => 'calendarToSchedulable'), array('calendar' => $original['properties']['calendar'], 'schedulable' => $result['id']));
    }

    public function createCreateSchedulableToAttachment(&$uri, &$params, &$criteria, $original) {
	if (array_key_exists('attachments', $original['properties']))
	    foreach ($original['properties']['attachments'] as $key => $value) {
		if (isset($params['id']))
		    Controller::create(array('concept' => 'schedulableToAttachment'), array('attachment' => $value['attachment'], 'schedulable' => $params['id']));
	    }
    }

    public function deepnessFindCalendarShared(&$uri, &$result, &$criteria, $original) {
	if (isset($original['criteria']['deepness']) && $original['criteria']['deepness'] != '0' && count($result) > 0) {

	    $calendarIds = array();
	    foreach ($result as $key => $value)
		array_push($calendarIds, $value['calendar']);

	    $calendar = Controller::find(array('concept' => 'calendar'), false, array('filter' => array('AND', array('IN', 'id', $calendarIds), $original['criteria']['filter'])));

	    if ($calendar && count($calendar) > 0){
		$newResult = array();
		foreach ($calendar as $key => $value) {
		    foreach ($result as $k => $r) {

			if ($r['calendar'] == $value['id']) {
			    $r['calendar'] = $value;
			    array_push($newResult, $r);
			}
		    }
		}

		foreach ($newResult as $key => &$value) {
		    if ($value['user'] != 0) {
			$user = $value['user'];
			$value['user'] = Controller::read(array('concept' => 'user', 'id' => $user));

			if (!$value['user'])
			    $value['user'] = Controller::read(array('concept' => 'group', 'id' => $user));
		    }
		}

		$result = $newResult;
	    }else
		$result = '';
	}
    }

    //TODO: Remover apos suporte a deepness na api 
    public function deepnessFindEvent(&$uri, &$result, &$criteria, $original) {
	if (isset($original['criteria']['deepness']) && $original['criteria']['deepness'] != 0) {
	    $Time = new DateTime('now', new DateTimeZone('UTC'));
	    $DayLigth = array();
	    foreach ($result as $i => $v) {

		if (!isset($currentTimezone) || $currentTimezone != $original['criteria']['timezones'][$v['calendar']]) {
		    $currentTimezone = isset($original['criteria']['timezones'][$v['calendar']]) ? $original['criteria']['timezones'][$v['calendar']] : $v['timezone'];
		    $Time->setTimezone(new DateTimeZone($currentTimezone));
		}

		$Time->setTimestamp((int) ($v['startTime'] / 1000));
		$DayLigth['calendar']['startTime'] = $Time->format('I') ? 1 : 0;

		$Time->setTimestamp((int) ($v['endTime'] / 1000));
		$DayLigth['calendar']['endTime'] = $Time->format('I') ? 1 : 0;

		if ($currentTimezone != $v['timezone']) {
		    $currentTimezone = $v['timezone'];
		    $Time->setTimezone(new DateTimeZone($v['timezone']));

		    $Time->setTimestamp((int) ($v['startTime'] / 1000));
		    $DayLigth['event']['startTime'] = $Time->format('I') ? 1 : 0;

		    $Time->setTimestamp((int) ($v['endTime'] / 1000));
		    $DayLigth['event']['endTime'] = $Time->format('I') ? 1 : 0;
		}else
		    $DayLigth['event'] = $DayLigth['calendar'];


		$result[$i]['DayLigth'] = $DayLigth;

		if (isset($v['id'])) {
		    $data = self::decodeParticipantsEvent($uri, $v, $criteria, $original);

		    $result[$i]['statusAttendees'] = isset($data['statusAttendees']) ? $data['statusAttendees'] : false;
		    $result[$i]['sizeAttendees'] = isset($data['sizeAttendees']) ? $data['sizeAttendees'] : false;
		    $result[$i]['participants'] = $data['attendees'];

		    $attachmentRelation = Controller::find(array('concept' => 'schedulableToAttachment'), false, array('filter' => array('=', 'schedulable', $v['id'])));
		    if (is_array($attachmentRelation)) {
			$attachments = array();
			foreach ($attachmentRelation as $key => $value)
			    if (isset($value['attachment']) || !!$value['attachment'])
				$attachments[$key] = $value['attachment'];
			//Pega os anexos sem source
			$result[$i]['attachments'] = Controller::find(array('concept' => 'attachment'), array('id', 'name', 'type', 'size'), array('filter' => array('IN', 'id', $attachments)));
		    }

		    $repeat = Controller::find(array('concept' => 'repeat'), false, array('filter' => array('=', 'schedulable', $v['id'])));

		    unset($result[$i]['repeat']);

		    if (is_array($repeat))
			$result[$i]['repeat'] = $repeat[0];
		}
	    }
	}

	return $result;
    }
    

//TODO: Remover apos suporte a deepness na api
    public function deepnessReadParticipant( &$uri , &$result , &$criteria , $original ){
	
       if(isset($original['criteria']['deepness']) && $original['criteria']['deepness'] != 0)
       {
            if(isset($result['id']) && isset($result['user']))
            {
		$result['user'] = Controller::read( array( 'concept' => 'user' , 'id' => $result['user'] , 'service' => ( $result['isExternal'] == 1 ? 'PostgreSQL' : 'OpenLDAP' ) ) );

		if($result['user']['id'] == Config::me('uidNumber'))
		  $result['alarms'] = Controller::find( array( 'concept' => 'alarm' ) , null , array('filter' => array('=', 'participant' ,$result['id'] ) ) );
            }
       }
       
      
       
   } 

    //TODO: Remover apos suporte a deepness na api 
    public function deepnessReadEvent( &$uri , &$result , &$criteria , $original ){		
    
       if(isset($original['criteria']['deepness']) && $original['criteria']['deepness'] != 0)
       {
            if(isset($result['id']))
            {
                $result['participants'] = Controller::find( array( 'concept' => 'participant' ) , false ,array( 'filter' => array('=' ,  'schedulable' ,  $result['id']), 'deepness' => $original['criteria']['deepness'] - 1) ); 

		$repeat =  Controller::find( array( 'concept' => 'repeat' ), false, array( 'filter' => array( '=', 'schedulable', $result['id'] ) ) );

                if(is_array($repeat))
		    $result['repeat'] = $repeat[0];
	    } 
	    
       }
   } 
   
    //TODO: Remover apos suporte a deepness na api 
    public function deepnessFindParticipant( &$uri , &$result , &$criteria , $original ){
       if(isset($original['criteria']['deepness']) && $original['criteria']['deepness'] != 0)
       {
           foreach ($result as $i => &$v)
           {
		self::deepnessReadParticipant( $uri, $v, $criteria, $original );
	   }
       }  
       
   } 

    //TODO: Remover apos suporte a deepness na api 
    public function deepnessReadCalendarSignature(&$uri, &$result, &$criteria, $original) {

	if (isset($original['criteria']['deepness']) && $original['criteria']['deepness'] != 0)
	    if (isset($result['calendar'])) {
		$result['calendar'] = Controller::read(array('concept' => 'calendar', 'id' => $result['calendar']));
		$result['defaultAlarms'] = Controller::find(array('concept' => 'calendarSignatureAlarm'), false, array('filter' => array('=', 'calendarSignature', $result['id'])));
	    }
    }

    //TODO: Remover apos suporte a deepness na api 
    public function deepnessFindCalendarSignature(&$uri, &$result, &$criteria, $original) {

	if (isset($original['criteria']['deepness']) && $original['criteria']['deepness'] != 0) {
	    foreach ($result as $i => $v) {
		if (isset($v['calendar'])) {
		    $result[$i]['calendar'] = Controller::read(array('concept' => 'calendar', 'id' => $v['calendar']), false, false);
		    $result[$i]['defaultAlarms'] = Controller::find(array('concept' => 'calendarSignatureAlarm'), false, array('filter' => array('=', 'calendarSignature', $v['id'])));
		    //Caso não seja o dono da agenda retorna o objeto permission com as acls
		    if ($result[$i]['isOwner'] == 0) {
			$permission = Controller::find(array('concept' => 'calendarToPermission'), false, array('filter' => array('AND', array('=', 'calendar', $v['calendar']), array('=', 'user', Config::me('uidNumber')))));

			if (!is_array($permission) || !$permission) {

			    $permission = Controller::find(array('concept' => 'calendarToPermission'), false, array('filter' => array('AND', array('=', 'calendar', $v['calendar']), array('=', 'type', '1'))));
			}
			$result[$i]['permission'] = $permission[0];
		    }
		}
		//TODO - Padronizar retorno do deepness
		if (isset($v['user']))
		    $result[$i]['user'] = Controller::read(array('concept' => 'user', 'id' => $v['user']), false, false);
	    }
	}
    }

//Decode Find       
    public function decodeFindConcept(&$uri, &$result, &$criteria, $original) {
	if ($result && is_array($result)) {
	    $m = array_flip(self::${$uri['concept'] . 'Map'});
	    $new = array();
	    foreach ($result as $i => $v)
		$new[$i] = self::parseConcept($result[$i], $m);


	    $result = $new;
	}
    }

    public function decodeFindSchedulable(&$uri, &$result, &$criteria, $original) {
	if ($result && is_array($result)) {
	    $m = array_flip(self::${$uri['concept'] . 'Map'});
	    $m['calendar_id'] = 'calendar';
	    $new = array();
	    foreach ($result as $i => $v)
		$new[$i] = self::parseConcept($result[$i], $m);


	    $result = $new;
	}
    }

    public function decodeFindAttachment(&$uri, &$result, &$criteria, $original) {
	if (isset($result))
	    foreach ($result as $key => &$value)
		$value['source'] = base64_decode($value['source']);
    }

    public function decodeSignatureAlarmType(&$uri, &$result, &$criteria, $original) {
	if (is_array($result))
	    foreach ($result as &$param)
		if (isset($param['type']))
		    $param['type'] = self::decodeAlarmType($param['type']);
    }

/////////////////////////////////////////////////////////////////////////

    static function decodeParticipantsEvent( &$uri, $result, &$criteria, $original) {
	$participants = Controller::find( array( 'concept' => 'participant' ) , false ,array( 'filter' => array('=', 'schedulable'  ,  $result['id']) ));

	if($participants && ($size = count($participants)) < 100){
	    if(isset($original['criteria']['deepness']) && $original['criteria']['deepness'] != 0){
		self::deepnessFindParticipant($uri, $participants, $criteria, $original);
		 $participants['attendees'] = $participants;
	    }
	    
	}else if($participants && ($size = count($participants)) > 100){
	    $owner = Controller::read( array( 'concept' => 'calendarSignature' ) , false ,array( 'filter' => array('AND', array('=', 'calendar'  ,  $result['calendar']), array('=', 'isOwner', '1'))));
	    $owner = Controller::read( array( 'concept' => 'participant' ) , false ,array( 'filter' => array('AND', array('=', 'schedulable'  ,  $result['id']), array('=', 'user', $owner[0]['user'])), 'deepness' => 2));

	    if(is_array($owner))
		$owner = $owner[0];

	    $reference = array_slice($participants, 0, 100);
	    $organizer = false;
	    $asOwner = false;

	    foreach($reference as $r => &$v){
		if($v['id'] == $owner['id']){
		    $v = $owner;
		    $asOwner = true;
		    continue;
		}

		self::deepnessReadParticipant($uri, $v, $criteria, $original);

		if($v['isOrganizer'] == "1" )
		    $organizer = $v;
	    }

	    if(!$organizer){
		$organizer = Controller::find( array( 'concept' => 'participant' ) , false ,array( 'filter' => array('AND', array('=', 'schedulable'  ,  $result['id']), array('=', 'isOrganizer', '1')), 'deepness' => 2));

		array_push($reference, $organizer[0]);

	    }else if($organizer && ($organizer['id'] != $owner['id']))
		array_merge($reference, $organizer);

	    if(!$asOwner)
		array_push($reference, $owner);

	    $statusAttendees = array( 'default' => 0, 'accepted' => 0, 'tentative' => 0, 'cancelled' => 0, 'unanswered' => 0, 'delegated' => 0 );
	    $statusLabels = array( 'default', 'accepted', 'tentative', 'cancelled', 'unanswered', 'delegated' );

	    foreach($participants as $k => &$p){
		if(!$organizer && $p['isOrganizer'] == "1"){
		    self::deepnessReadParticipant($uri, $p, $criteria, $original);
		    $reference = array_merge($reference, array($p));
		}

		$statusAttendees[$statusLabels[$p['status']]]++;
	    }

	    $participants['statusAttendees'] = $statusAttendees;
	    $participants['sizeAttendees'] = $size;
	    $participants['attendees'] = $reference;
	}
	
	return $participants;
    }
    
    static function dayAlarm( &$uri , &$params , &$criteria , $original ) {
        if(isset($criteria['filter'][1]) && $criteria['filter'][1] == 'date')
        {
	    $target = $criteria['filter'][2];

	    $params = array();

	    $al = Controller::service('PostgreSQL')->execSql("SELECT distinct co.id as \"id\", co.cal_uid as \"uid\", co.type_id as \"type\", co.dtstart as \"startTime\", co.summary as \"summary\", co.description as \"description\", co.dtend as \"endTime\", co.location as \"location\", co.allday as \"allDay\", co.transp as transparent, co.class_id as class, ".
		"co.range_start as \"rangeStart\", co.range_end as \"rangeEnd\", co.last_update as \"lastUpdate\", co.dtstamp as \"dtstamp\", co.sequence as \"sequence\", co.tzid as \"timezone\", CASE WHEN rep.object_id = co.id THEN occ.occurrence - al.alarm_offset ELSE co.dtstart - al.alarm_offset END as \"sendTime\", ".
		"al.unit as \"unit\", al.time as \"time\" FROM calendar_alarm as al, calendar_object as co, calendar_repeat as rep, calendar_repeat_occurrence as occ, calendar_participant as part WHERE ".
		"al.action_id = '".ALARM_ALERT."' AND al.sent = '0' AND ( (al.participant_id = part.id) AND (part.user_info_id = '". Config::me('uidNumber') ."') ) AND part.object_id = co.id AND ".
		"CASE WHEN rep.object_id = co.id ".
		"THEN rep.id = occ.repeat_id AND occ.occurrence - al.alarm_offset >= '$target' AND occ.occurrence - al.alarm_offset <= '".( $target + 86400000)."' ".
		"ELSE (co.range_start - al.alarm_offset) >= '$target' AND (co.range_start - al.alarm_offset) <= '".( $target + 86400000)."' END");
	    
	    if(is_array($al))
	      foreach( $al as $v )
		$params[] = array('schedulable' =>  $v);
	      
	    else
	      $params = false;
 
            return false;
        }
    } 
    
    static private function countMyCalendarsEvent($id, $owner) {
		$sig = Controller::find(array('concept' => 'calendarSignature'), array('user', 'calendar', 'isOwner'), array('filter' => array('AND', array('=', 'user', $owner), array('=', 'isOwner', '1'))));
		$calendars = array();
		foreach ($sig as $val)
			$calendars[] = $val['calendar'];

		$return = Controller::find(array('concept' => 'calendarToSchedulable'), null, array('filter' => array('AND', array('IN', 'calendar', $calendars), array('=', 'schedulable', $id))));

		return (isset($return[0])) ? count($return) : 0;
    }
    
    public function deleteSchedulable(&$uri, &$params, &$criteria, $original) {
        if (Config::module('useCaldav', 'expressoCalendar'))
	    require_once ROOTPATH . '/modules/calendar/interceptors/DAViCalAdapter.php';
        
        if(isset($criteria['filter']) && $criteria['filter'] && isset($criteria['filter'][1][2])){
            $idSchedulable = $criteria['filter'][1][2];
			$idCalendar = $criteria['filter'][2][2];
            $owner = $criteria['filter'][3][2];

            $qtdMyCalendars = self::countMyCalendarsEvent($idSchedulable, $owner);

            $link = Controller::read(array('concept' => 'calendarToSchedulable'), false, array('filter' => array('AND', array('=','calendar',$idCalendar), array('=','schedulable',$idSchedulable))));
            $link = (is_array($link) && isset($link[0])) ? $link[0] : $link;
            
            $calendar = Controller::read(array('concept' => 'calendar'), false, array('filter' => array('=','id',$idCalendar)));
            $calendar = (is_array($calendar) && isset($calendar[0])) ? $calendar[0] : $calendar;

            if($isAttende = !self::ownerSchedulable($idSchedulable, $owner)){
                Controller::delete(array('concept' => 'calendarToSchedulable', 'id' => $link['id']));
                
                if($qtdMyCalendars <= 1){

                    $participant = Controller::read(array('concept' => 'participant'), array('id'), array('filter' =>
                        array('AND',
                            array('=', 'user', $owner),
                            array('=', 'schedulable', $idSchedulable)
                        )));

                    Controller::call(('update'), array('concept' => 'participant', 'id' => $participant[0]['id']), array('status' => STATUS_CANCELLED));
                }

            }else{
                if($qtdMyCalendars > 1 )
                    Controller::delete(array('concept' => 'calendarToSchedulable', 'id' => $link['id']));
            }

            if (Config::module('useCaldav', 'expressoCalendar'))
		    DAViCalAdapter::deleteEvent($idSchedulable, array('location' => $calendar['location']));

            if($isAttende || ($qtdMyCalendars > 1))
                return false;

            $uri['id'] = $idSchedulable;
        }
        
    }

    public function deleteCalendarToPermissionDependences(&$uri, &$params, &$criteria, $original) {
	$permission = Controller::read($uri, array('user', 'calendar'));

	$calendarSignature = Controller::find(array('concept' => 'calendarSignature'), array('id'), array('filter' => array('AND', array('=', 'calendar', $permission['calendar']), array('=', 'user', $permission['user']), array('=', 'isOwner', '0'))));

	if ($calendarSignature)
	    Controller::delete(array('concept' => 'calendarSignature', 'id' => $calendarSignature[0]['id']));
    }

    public function deleteCalendarSignatureDependences(&$uri, &$params, &$criteria, $original) {
	$signature = Controller::read($uri, array('isOwner', 'calendar'));

	if ($signature['isOwner'] == '1') {
	    $calendarToSchedulables = Controller::find(array('concept' => 'calendarToSchedulable'), null, array('filter' => array('=', 'calendar', $signature['calendar'])));

	    $schedulables = array();
	    if (is_array($calendarToSchedulables))
		foreach ($calendarToSchedulables as $key => $calendarToSchedulable)
		    $schedulables[] = $calendarToSchedulable['schedulable'];

	    if (!empty($schedulables))
			Controller::deleteALL(array('concept' => 'schedulable'), null, array('filter' => array('IN', 'id', $schedulables)));

	    Controller::delete(array('concept' => 'calendar', 'id' => $signature['calendar']));
		
		$permissions = Controller::find(array('concept' => 'calendarToPermission'), array('id'), array('filter' => array('=', 'calendar', $signature['calendar'])));

		
		
		if($permissions && count($permissions) > 0){
			$ids = array();
			foreach($permissions as $key => $value)
				array_push($ids, $value['id']);
		
			Controller::deleteALL(array('concept' => 'calendarToPermission'), null, array('filter' => array('IN', 'id', $ids)));
			
		}
		
		
	}
    }

    public function decodeSchedulablettachment(&$uri, &$params, &$criteria, $original) {
	if (isset($original['URI']['id'])){
            $schedulableAttachment = Controller::read(array('concept' => 'schedulableToAttachment'), false, array('filter' => array( '=', 'attachment' , $original['URI']['id'] )));
            $uri['id'] = $schedulableAttachment[0]['id'];
        }
    }

    public function deleteAttachmentDependences(&$uri, &$params, &$criteria, $original) {
        Controller::delete(array('concept' => 'attachment', 'id' => $original['URI']['id']));
    }
    
    public function decodeDeleteCalendarSignatureAlarm(&$uri, &$params, &$criteria, $original) {
		if ($original['URI']['id'] == '' && isset($original['criteria']['filter'])){
			Controller::deleteAll(array('concept' => 'calendarSignatureAlarm'), null,$original['criteria']);
			return false;
		}
    }

    public function createDefaultSignature(&$uri, &$result, &$criteria, $original) {

	//Caso uma busca não retorne nenhum resultado e foi buscado pelas assinaturas do usuario logado apenas
	$isValidSignature = false;

	//Veirifica pois o usuário pode ter varias assinaturas mas não ser dona de nenhuma
	if (count($result) > 0) {
	    foreach ($result as $value) {
		if (isset($value['isOwner']) && $value['isOwner'] != 0)
		    $isValidSignature = true;
	    }
	}

	if (!$isValidSignature &&
		( $original['criteria']['filter'][1][0] == '=' &&
		$original['criteria']['filter'][1][1] == 'user' &&
		$original['criteria']['filter'][1][2] == $_SESSION['phpgw_session']['account_id']
		)) {

	    if (Config::module('useCaldav', 'expressoCalendar')) {
		require_once ROOTPATH . '/modules/calendar/interceptors/DAViCalAdapter.php';

		$calendario = DAViCalAdapter::findCalendars();
	    }

	    if (Config::module('useCaldav', 'expressoCalendar') && is_array($calendario) && count($calendario) > 0) {
		foreach ($calendario as $i => $v) {

		    $urlA = explode('/', $v->url);
		    $name = isset($v->displayname) ? $v->displayname : $urlA[(count($urlA) - 2)];
		    $cal = array('name' => $name,
			'description' => isset($v->description) ? $v->description : $name,
			'timezone' => isset($v->timezone) ? $v->timezone : (date_default_timezone_get()) ? date_default_timezone_get() : 'America/Sao_Paulo',
			'dtstamp' => time() . '000',
			'location' => $urlA[(count($urlA) - 3)] . '/' . $urlA[(count($urlA) - 2)]
		    );

		    $calCreated = Controller::create(array('concept' => 'calendar'), $cal);



		    $sig = array('user' => $_SESSION['wallet']['user']['uidNumber'],
			'calendar' => $calCreated['id'],
			'isOwner' => '1',
			'dtstamp' => time() . '000',
			'fontColor' => 'FFFFFF',
			'backgroundColor' => '3366CC',
			'borderColor' => '3366CC',
		    );

		    $sigCreated = Controller::create(array('concept' => 'calendarSignature'), $sig);


		    DAViCalAdapter::importCollection($v->url, $calCreated['id']);
		}
	    } else {
		//Criaremos uma agenda padrão
		$cal = array('name' => 'Calendario',
		    'description' => 'Calendario Padrão',
		    'timezone' => (date_default_timezone_get()) ? date_default_timezone_get() : 'America/Sao_Paulo',
		    'dtstamp' => time() . '000'
		);

		$calCreated = Controller::create(array('concept' => 'calendar'), $cal);

		$sig = array('user' => $_SESSION['wallet']['user']['uidNumber'],
		    'calendar' => $calCreated['id'],
		    'isOwner' => '1',
		    'dtstamp' => time() . '000',
		    'fontColor' => 'FFFFFF',
		    'backgroundColor' => '3366CC',
		    'borderColor' => '3366CC',
		);

		$sigCreated = Controller::create(array('concept' => 'calendarSignature'), $sig);
	    }

	    $result = Controller::find($original['URI'], $original['properties'] ? $original['properties'] : null, $original['criteria']);
	    return false;
	}
    }

    //TODO - Criar conceito separado para participantes externos e remover o criterio notExternal
    public function findExternalPaticipants(&$uri, &$result, &$criteria, $original) {
	if (Config::me('uidNumber') && !isset($criteria['notExternal'])) {
	    $newuri['concept'] = 'user';
	    $newuri['service'] = 'PostgreSQL';

	    $newCriteria = $original['criteria'];
	    $valid = true;

	    $newCriteria['filter'] = array('AND', $newCriteria['filter'], array('=', 'owner', Config::me('uidNumber')));
	    $externalUsers = Controller::find($newuri, $original['properties'] ? $original['properties'] : null, $newCriteria);

	    if (is_array($externalUsers)) {
		foreach ($externalUsers as $i => $v)
		    $externalUsers[$i]['isExternal'] = '1';
	    }
	    else
		$externalUsers = array();

	    if (!is_array($result))
		$result = array();

	    return array_merge($result, $externalUsers);
	}
    }

    public function davcalCreateCollection(&$uri, &$params, &$criteria, $original) {
	if (Config::module('useCaldav', 'expressoCalendar')) {
	    require_once ROOTPATH . '/modules/calendar/interceptors/DAViCalAdapter.php';
	    DAViCalAdapter::mkcalendar($params['location'], $params['name'], isset($params['description']) ? $params['description'] : '' );
	}
    }

    public function davcalDeleteCollection(&$uri, &$params, &$criteria, $original) {
	if (Config::module('useCaldav', 'expressoCalendar') && Config::module('onRemoveCascadeCalDav')) {
	    require_once ROOTPATH . '/modules/calendar/interceptors/DAViCalAdapter.php';
	    $calendar = Controller::read($uri);
	    DAViCalAdapter::rmCalendar($calendar['location']);
	}
    }

    public function davcalUpdateCollection(&$uri, &$params, &$criteria, $original) {
	if (Config::module('useCaldav', 'expressoCalendar')) {
	    require_once ROOTPATH . '/modules/calendar/interceptors/DAViCalAdapter.php';
	    if (isset($params['location'])) {
		$calendar = Controller::read($uri);
		if ($calendar['location'] !== $params['location'])
		    DAViCalAdapter::mvcalendar($calendar['location'], $params['location']);
	    }
	}
    }

    private static function _makeUid() {

	$date = date('Ymd\THisT');
	$unique = substr(microtime(), 2, 4);
	$base = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPrRsStTuUvVxXuUvVwWzZ1234567890';
	$start = 0;
	$end = strlen($base) - 1;
	$length = 6;
	$str = null;
	for ($p = 0; $p < $length; $p++)
	    $unique .= $base{mt_rand($start, $end)};

	return $date . $unique . '@expresso-calendar';
    }

    private function getStatus($id) {
	$a = array(
	    STATUS_CONFIRMED => 'CONFIRMED',
	    STATUS_CANCELLED => 'CANCELLED',
	    STATUS_TENATIVE => 'TENATIVE',
	    STATUS_UNANSWERED => 'NEEDS-ACTION',
	    STATUS_DELEGATED => 'DELEGATED'
	);
	return $a[$id];
    }

    private static function decodeAlarmType($id) {
	$a = array(ALARM_ALERT => 'alert',
	    ALARM_MAIL => 'mail',
	    ALARM_SMS => 'sms');

	return $a[$id];
    }

    private static function codeAlarmType($type) {
	$a = array('alert' => ALARM_ALERT,
	    'mail' => ALARM_MAIL,
	    'sms' => ALARM_SMS);

	return $a[$type];
    }

    private static function codeAlarmUnit($u) {
	if ($u === 'd')
	    return 'days';
	if ($u === 'm')
	    return 'minutes';
	if ($u === 'H')
	    return 'hours';
    }

    private static function ownerSchedulable($id, $me) {

	$isOwner = Controller::find(array('concept' => 'participant'), array('id'), array('filter' =>
		    array('AND',
			array('=', 'isOrganizer', '1'),
			array('=', 'user', $me),
			array('=', 'schedulable', $id)
			)));

	return ( isset($isOwner[0]['id']) ) ? true : false;
    }
    
    
    private static function referenceCalendarToObject($schedulable, $calendar) {
        return Controller::service('PostgreSQL')->execResultSql('SELECT calendar_to_calendar_object.id as calendar_to_calendar_Object FROM calendar_to_calendar_object'
            . ' WHERE calendar_to_calendar_object.calendar_id = '. $calendar
            . ' AND calendar_to_calendar_object.calendar_object_id = ' . addslashes($schedulable));
    }
    
    private static function schedulable2calendarToObject($Schedulable) {
	return Controller::service('PostgreSQL')->execResultSql('SELECT calendar_to_calendar_object.id as calendar_to_calendar_Object , calendar.name as calendar_name ,calendar.location as calendar_location, calendar.id as calendar_id FROM calendar_to_calendar_object , calendar , calendar_signature'
			. ' WHERE calendar_signature.user_uidnumber = ' . $_SESSION['wallet']['user']['uidNumber']
			//      .' AND calendar_signature.is_owner = 1'
			. ' AND calendar_signature.calendar_id = calendar.id'
			. ' AND calendar_to_calendar_object.calendar_id = calendar.id'
			. ' AND calendar_to_calendar_object.calendar_object_id = ' . addslashes($Schedulable));
    }

    protected static function isAllowDeleteInCalendar($calendar) {
	$f = Controller::find(array('concept' => 'calendarToPermission'), false, array('filter' => array('AND', array('=', 'user', Config::me('uidNumber')), array('=', 'calendar', $calendar))));
	return (strpos($f[0]['acl'], CALENDAR_ACL_REMOVE) === false) ? false : true;
    }

}

?>
