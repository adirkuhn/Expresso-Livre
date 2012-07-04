<?php
	/**************************************************************************\
	* ExpressoLivre - Setup                                                     *
	* http://www.expressolivre.org                                              *
	* --------------------------------------------                             *
	* This program is free software; you can redistribute it and/or modify it  *
	* under the terms of the GNU General Public License as published by the    *
	* Free Software Foundation; either version 2 of the License, or (at your   *
	* option) any later version.                                               *
	\**************************************************************************/

	$test[] = '1.000';
	function expressoCalendar_upgrade1_000() {

		$oProc = $GLOBALS['phpgw_setup']->oProc;

		$oProc->query("ALTER TABLE calendar_participant ADD COLUMN acl character varying(10) not null DEFAULT 'r' ");
		
		$oProc->query("ALTER TABLE calendar_participant ADD COLUMN receive_notification smallint not null DEFAULT 1 ");
		$oProc->query('ALTER TABLE calendar_participant RENAME COLUMN delegated_to TO delegated_from ');
		
		$oProc->query("UPDATE calendar_participant SET acl = 'rowi' where is_organizer = 1 ");

		$oProc->query('ALTER TABLE calendar_object  ALTER COLUMN range_start TYPE bigint USING (date_part(\'epoch\',(cast(range_start as timestamp)))::bigint) * 1000');
		$oProc->query('ALTER TABLE calendar_object  ALTER COLUMN range_end TYPE bigint USING (date_part(\'epoch\',(cast(range_end as timestamp)))::bigint) * 1000');

		$oProc->query('ALTER TABLE calendar_alarm ALTER COLUMN range_end TYPE bigint USING (date_part(\'epoch\',(cast(range_end as timestamp)))::bigint) * 1000');
		$oProc->query('ALTER TABLE calendar_alarm ALTER COLUMN range_start TYPE bigint USING (date_part(\'epoch\',(cast(range_start as timestamp)))::bigint) * 1000');

		$oProc->query("ALTER TABLE attachment ADD COLUMN owner integer");

		$GLOBALS['setup_info']['expressoCalendar']['currentver'] = '1.001';
        return $GLOBALS['setup_info']['expressoCalendar']['currentver'];
	}

	$test[] = '1.001';
	function expressoCalendar_upgrade1_001() {

		$oProc = $GLOBALS['phpgw_setup']->oProc;

		$oProc->query("ALTER TABLE calendar_repeat ADD COLUMN dtstart bigint");
		$oProc->query('ALTER TABLE calendar_repeat ALTER COLUMN until DROP NOT NULL');

		$oProc->CreateTable('calendar_repeat_occurrence', array(
				'fd' => array(
				    'id' => array( 'type' => 'auto', 'nullable' => False),
				    'occurrence' => array(  'type' => 'bigint','precision' => '16', 'nullable' => False),
				    'repeat_id' => array(  'type' => 'int', 'precision' => '8', 'nullable' => False)
				),

				'pk' => array('id'),
				'fk' => array('repeat_id'),
				'ix' => array(),
				'uc' => array()
				)
		);

		$oProc->CreateTable('calendar_repeat_ranges', array(
				'fd' => array(
				    'id' => array( 'type' => 'auto', 'nullable' => False),
				    'range_start' => array(  'type' => 'bigint','precision' => '16', 'nullable' => False),
				    'range_end' => array(  'type' => 'bigint', 'precision' => '16', 'nullable' => False),
				    'user_info_id' => array(  'type' => 'bigint', 'precision' => '16', 'nullable' => False)
				),
				'pk' => array('id'),
				'fk' => array(),
				'ix' => array(),
				'uc' => array()
				    )
		);

		$oProc->query("ALTER TABLE calendar_participant ADD COLUMN receive_notification smallint not null DEFAULT 1 ");	

		$GLOBALS['setup_info']['expressoCalendar']['currentver'] = '1.002';
        return $GLOBALS['setup_info']['expressoCalendar']['currentver'];
	};

	$test[] = '1.002';
	function expressoCalendar_upgrade1_002() {

            $oProc = $GLOBALS['phpgw_setup']->oProc;

            $oProc->query("ALTER TABLE calendar_repeat_occurrence ADD COLUMN exception smallint DEFAULT 0");

            $GLOBALS['setup_info']['expressoCalendar']['currentver'] = '1.003';
            return $GLOBALS['setup_info']['expressoCalendar']['currentver'];
	};
        
        $test[] = '1.003';
	function expressoCalendar_upgrade1_003() {
            $GLOBALS['setup_info']['expressoCalendar']['currentver'] = '1.004';
            return $GLOBALS['setup_info']['expressoCalendar']['currentver'];
	};

	$test[] = '1.004';
	function expressoCalendar_upgrade1_004() {
            $oProc = $GLOBALS['phpgw_setup']->oProc;
            $oProc->query("ALTER TABLE calendar_repeat_occurrence  ALTER COLUMN exception SET default 0");

            $GLOBALS['setup_info']['expressoCalendar']['currentver'] = '1.005';
            return $GLOBALS['setup_info']['expressoCalendar']['currentver'];
	};
        
        $test[] = '1.005';
	function expressoCalendar_upgrade1_005() {
            $oProc = $GLOBALS['phpgw_setup']->oProc;
            $oProc->query("ALTER TABLE calendar_alarm ADD COLUMN alarm_offset bigint;");
	    $oProc->query("UPDATE calendar_alarm SET alarm_offset = obj.range_start - calendar_alarm.range_start FROM calendar_object as obj WHERE obj.id = object_id;");
	    $oProc->query("ALTER TABLE calendar_alarm DROP COLUMN range_start;");
	    $oProc->query("ALTER TABLE calendar_alarm DROP COLUMN range_end;");
            $GLOBALS['setup_info']['expressoCalendar']['currentver'] = '1.006';
            return $GLOBALS['setup_info']['expressoCalendar']['currentver'];
	};
	
	
	$test[] = '1.006';
	function expressoCalendar_upgrade1_006() {
            $GLOBALS['setup_info']['expressoCalendar']['currentver'] = '1.007';
            return $GLOBALS['setup_info']['expressoCalendar']['currentver'];
	};
        
?>