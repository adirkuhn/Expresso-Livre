<?php

if(!defined('ROOTPATH'))
    define('ROOTPATH', dirname(__FILE__).'/../..');

require_once ROOTPATH.'/api/controller.php';
require_once ROOTPATH.'/modules/calendar/constants.php';
require_once ROOTPATH.'/api/parseTPL.php';

use prototype\api\Config as Config;

$target = (gmdate('U') - 300 ).'000';

$parts = Controller::service('PostgreSQL')->execSql('SELECT DISTINCT calendar_participant.user_info_id as "user", co.id as "schedulable", co.allDay as "allDay" ,co.dtend as "endTime", co.dtstart as "startTime", co.summary as "summary", co.tzid as "timezone", co.location as "location", al.id as "id" '.
                            'FROM calendar_participant, calendar_alarm as "al", calendar_object as "co", calendar_repeat as "rep" WHERE ('.
                            "al.participant_id = calendar_participant.id AND ".
                            "calendar_participant.object_id = co.id AND ".
                            "al.action_id = '".ALARM_MAIL."' AND ".
                            "al.sent = '0' AND ".
                            "CASE WHEN rep.object_id = co.id ".
                            "THEN  ( select count(occurrence) FROM calendar_repeat_occurrence WHERE rep.object_id = co.id AND rep.id = calendar_repeat_occurrence.repeat_id AND ((occurrence - al.alarm_offset) >= '$target') AND  ((occurrence - al.alarm_offset) >= '".($target + 360000)."') ) > 0 ".
                            "ELSE (co.range_start - al.alarm_offset >= '$target') AND (co.range_start - al.alarm_offset < '".($target + 360000)."') END )");

if(!is_array($parts))
  return;

$ids = array();

foreach ($parts as $i => $part)
{
	///Montando lista de participantes

	$users = Controller::find( array( 'concept' => 'participant' ) , array( 'user', 'id', 'isExternal' ) ,array('filter' => array ('=', 'schedulable' , $part['schedulable'] ), 'deepness' => 1 ) );

	$attList = array();

	foreach( $users as $user )
	{
	    if( $part['user'] === $user['user']['id'] )
		$part['mail'] = $user['user']['mail'];

	    $attList[] = $user['user']['name'];
	}

        $timezone = new DateTimeZone('UTC');
	$sTime = new DateTime('@' . (int) ($part['startTime'] / 1000), $timezone);
	$eTime = new DateTime('@' . (int) ($part['endTime'] / 1000), $timezone);

        $timezone = $part['timezone'];
        $sTime->setTimezone(new DateTimeZone($part['timezone']));
        $eTime->setTimezone(new DateTimeZone($part['timezone']));
        
	$data = array('startDate' =>  date_format( $sTime , 'd/m/Y') ,
		      'startTime' =>  $part['allDay'] ? '' : date_format( $sTime , 'H:i'),
		      'endDate' =>  date_format( $eTime , 'd/m/Y') ,
		      'endTime' =>  $part['allDay'] ? '' : date_format( $eTime , 'H:i'),
		      'eventTitle' =>  $part['summary'],
		      'eventLocation' =>  $part['location'],
		      'timezone' => $timezone,
		      'participants' =>  '<UL> <LI> '.implode( '<LI></LI> ', $attList ).'</LI> </UL>');

	Controller::create( array( 'service' => 'SMTP' ), array( 'body' => parseTPL::load_tpl( $data, ROOTPATH.'/modules/calendar/templates/notify_alarm_body.tpl' ),
								  'isHtml' => true,
								  'subject' => 'Alarme de Calendario',
								  'from' => $part['mail'],
								  'to' => $part['mail'] ) );

	Config::regSet('noAlarm', TRUE); //Evita o envio de notificação ?????
	$ids[] = $part['id'];
}

if( !empty( $ids ) )
    Controller::update( array( 'concept' => 'alarm' ) , array('sent' => '1'), array('filter' => array( 'IN', 'id', $ids ) ));

?>
