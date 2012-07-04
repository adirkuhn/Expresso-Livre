<?php

 /**************************************************************************\
  * Expresso Livre - Voip - administration                                   *
  *															                 *
  * --------------------------------------------                             *
  *  This program is free software; you can redistribute it and/or modify it *
  *  under the terms of the GNU General Public License as published by the   *
  *  Free Software Foundation; either version 2 of the License, or (at your  *
  *  option) any later version.                                              *
  \**************************************************************************/

class uicalendar
{
	var $public_functions = array(
		'edit_conf' => True
	);

	final function __construct(){}
	
	final function edit_conf()
	{
		if($GLOBALS['phpgw']->acl->check('applications_access',1,'admin'))
		{
			$GLOBALS['phpgw']->redirect_link('/index.php');
		}		

		$GLOBALS['phpgw_info']['flags']['app_header'] = lang('Admin') .' - ' . lang('Configuration Calendars');

		if(!@is_object($GLOBALS['phpgw']->js))
		{
			$GLOBALS['phpgw']->js = CreateObject('phpgwapi.javascript');
		}

		$webserver_url = $GLOBALS['phpgw_info']['server']['webserver_url'];
		$webserver_url = ( !empty($webserver_url) ) ? $webserver_url : '/';

		if(strrpos($webserver_url,'/') === false || strrpos($webserver_url,'/') != (strlen($webserver_url)-1))
			$webserver_url .= '/';

		$js = array('connector','xtools','functions');
	
		foreach( $js as $tmp )
			$GLOBALS['phpgw']->js->validate_file('calendar',$tmp,'admin');
		
		$GLOBALS['phpgw']->common->phpgw_header();
		echo parse_navbar();
		echo '<script type="text/javascript">var path_adm="'.$webserver_url .'"</script>';
		
	    $c = CreateObject('phpgwapi.config','phpgwapi');
		$c->read_repository();
		$current_config = $c->config_data;    
 	
		if(isset($current_config['defaultCalendar'])){
			$selected =  $current_config['defaultCalendar'] == 'calendar' ?  'calendar' :  'expressoCalendar';
			$option = $selected == 'calendar' ?  'expressoCalendar' :  'calendar';
		}else{
			$selected = 'calendar';
			$option = 'expressoCalendar';
		}	
	
		$t = CreateObject('phpgwapi.Template', $GLOBALS['phpgw']->common->get_tpl_dir('admin'));
		$t->set_unknowns('keep');
		$t->set_file(array('calendar' => 'calendar.tpl'));
		$t->set_block('calendar','calendar_page','calendar_page');
		$t->set_var(array(
                        'action_url' => $GLOBALS['phpgw']->link('/index.php','menuaction=admin.uiconfig.index&appname=admin'),
                        'lang_Calendar_default_for_current_installation' => lang('Calendar default for current installation'),
                        'lang_Calendar_settings' => 'Configuração do Calendar',	
                        'lang_save' => lang('Save'),
                        'lang_cancel' => lang('Cancel'),
                        'selected' => $selected,
                        'option' => $option
                ));
		$t->pparse('out','calendar');
	}
	
	function display_row($label, $value)
	{
		$GLOBALS['phpgw']->template->set_var('tr_color',$this->nextmatchs->alternate_row_color());
		$GLOBALS['phpgw']->template->set_var('label',$label);
		$GLOBALS['phpgw']->template->set_var('value',$value);
		$GLOBALS['phpgw']->template->parse('rows','row',True);
	}
}
?>
