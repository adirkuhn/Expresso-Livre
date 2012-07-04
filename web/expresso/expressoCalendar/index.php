<?php
	
        $GLOBALS['phpgw_info']['flags'] = Array(   'currentapp'    =>      'expressoCalendar',
                                                   'noheader'      =>      false,
                                                   'nonavbar'      =>      false,
                                                   'noappheader'   =>      true,
                                                   'noappfooter'   =>      true,
                                                   'nofooter'      =>      true  );
						  
        require_once( dirname(__FILE__).'/../prototype/api/config.php' );
        
        require_once (dirname(__FILE__).'/../header.inc.php');
        
        $_SESSION['flags']['currentapp'] = 'expressoCalendar';

	define( 'MODULESURL' , '../prototype/modules/calendar' );
	define( 'PLUGINSURL' , '../prototype/plugins' );
        
        include ROOTPATH.'/modules/calendar/templates/index.ejs';
    
        
        
?>
