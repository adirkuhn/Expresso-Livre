<?php
		/*************************************************************************** 
		* Expresso Livre                                                           * 
		* http://www.expressolivre.org                                             * 
		* --------------------------------------------                             * 
		*  This program is free software; you can redistribute it and/or modify it * 
		*  under the terms of the GNU General Public License as published by the   * 
		*  Free Software Foundation; either version 2 of the License, or (at your  * 
		*  option) any later version.                                              * 
		\**************************************************************************/ 
function load_lang() {
	if(!$_SESSION['phpgw_info']['calendar']['langAlarm']) 
	{
		$array_keys = array();
		$fn = '../setup/phpgw_alarm_'.$GLOBALS['phpgw_info']['user']['preferences']['common']['lang'].'.lang';			
		echo $fn;
		if (file_exists($fn)){
			$fp = fopen($fn,'r');
			while ($data = fgets($fp,16000))	{
				list($message_id,$app_name,$null,$content) = explode("\t",substr($data,0,-1));			
				$_SESSION['phpgw_info']['calendar']['langAlarm'][$message_id] =  $content;
			}
			fclose($fp);
		}
	}
}
?>