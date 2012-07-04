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
		
	$GLOBALS['phpgw_info']['flags'] = array(
		'noheader' => False,
		'nonavbar' => false,
		'currentapp' => 'expressoMail1_2',
		'enable_nextmatchs_class' => True
	);
	
	require_once('../header.inc.php');
	$update_version = $GLOBALS['phpgw_info']['apps']['expressoMail1_2']['version'];
	$_SESSION['phpgw_info']['expressomail']['user'] = $GLOBALS['phpgw_info']['user'];
	echo "<script type='text/javascript'>var template = '".$_SESSION['phpgw_info']['expressoMail1_2']['user']['preferences']['common']['template_set']."';</script>";
	echo "<script src='js/modal/modal.js'></script>";
	//jquery and Editor 
	echo ' 			
		<link rel="stylesheet" type="text/css" href="templates/default/main.css"></link>
		<link rel="stylesheet" type="text/css" href="../phpgwapi/js/dftree/dftree.css"></link>
		<link rel="stylesheet" type="text/css" href="../prototype/plugins/fullcalendar/fullcalendar.css"></link>
		<link rel="stylesheet" type="text/css" href="../prototype/plugins/fullcalendar/fullcalendar.print.css"></link>
		<link rel="stylesheet" type="text/css" href="../prototype/plugins/icalendar/jquery.icalendar.css"></link>
		
		<script type="text/javascript" src="../prototype/plugins/jquery/jquery.min.js"></script>
		<link href="../prototype/modules/filters/filters.css" rel="stylesheet" type="text/css">
		<script type="text/javascript" src="../prototype/plugins/jquery/jquery-ui.min.js"></script>
		<script src="../prototype/plugins/json2/json2.js" language="javascript"></script>
		<script src="../prototype/plugins/ejs/ejs.js" language="javascript"></script>
		<script src="../prototype/plugins/store/jquery.store.js" language="javascript"></script>
		<script src="../prototype/plugins/farbtastic/farbtastic.js" language="javascript"></script>
		<script src="../prototype/api/datalayer.js" language="javascript"></script>					
		<script src="../prototype/api/rest.js" language="javascript"></script>					
		<script type="text/javascript" src="../prototype/plugins/scrollto/jquery.scrollTo.js"></script>
		<script language="javascript">
			DataLayer.dispatchPath = "../prototype/";
			REST.dispatchPath = "../prototype/";
			REST.load("");
		</script>					
		<script src="../library/ckeditor/ckeditor.js" language="javascript" charset="utf-8"></script> 
		<script src="../library/ckeditor/adapters/jquery.js" language="javascript"></script> 
		<script src="../prototype/plugins/lazy/jquery.lazy.js" language="javascript"></script> 
		
		<link rel="Stylesheet" type="text/css" href="../prototype/plugins/jquery/jquery-ui.css" />					
		
		<link rel="stylesheet" type="text/css" href="../prototype/plugins/contextmenu/jquery.contextMenu.css"></link>
		<link rel="stylesheet" type="text/css" href="../prototype/plugins/zebradialog/css/zebra_dialog.css"></link>		
		
		<link rel="stylesheet" href="../prototype/plugins/farbtastic/farbtastic.css" type="text/css" >	
		<link rel="stylesheet" href="../prototype/plugins/fileupload/jquery.fileupload-ui.css" type="text/css" >	
		
		<script type="text/javascript" src="../prototype/plugins/zebradialog/javascript/zebra_dialog.js"></script>
		<script type="text/javascript" src="../prototype/plugins/datejs/date-pt-BR.js"></script>
		<script type="text/javascript" src="../prototype/plugins/datejs/sugarpak.js"></script>
		<script type="text/javascript" src="../prototype/plugins/datejs/parser.js"></script>
		<script type="text/javascript" src="../prototype/plugins/jq-raty/js/jquery.raty.min.js"></script>

		<script type="text/javascript" src="../prototype/plugins/watermark/jquery.watermarkinput.js"></script>
		<script type="text/javascript" src="../prototype/plugins/mask/jquery.maskedinput.js"></script>
		<script type="text/javascript" src="../prototype/plugins/alphanumeric/jquery.alphanumeric.js"></script>
		<script type="text/javascript" src="../prototype/plugins/fileupload/jquery.fileupload.js"></script>
		<script type="text/javascript" src="../prototype/plugins/fileupload/jquery.iframe-transport.js"></script>
		
		<script type="text/javascript" src="../prototype/plugins/qtip/jquery.qtip-1.0.0-rc3.min.js"></script>
		<script type="text/javascript" src="../prototype/plugins/contextmenu/jquery.contextMenu.js"></script>
		<!-- <script type="text/javascript" src="../prototype/plugins/contextmenu/jquery.ui.position.js"></script> -->
		
		<script type="text/javascript" src="../prototype/modules/calendar/js/timezone.js"></script>
        <script type="text/javascript" src="../prototype/plugins/dateFormat/dateFormat.js"></script>
		<script type="text/javascript" src="../prototype/modules/calendar/js/calendar.date.js"></script>
		<script type="text/javascript" src="../prototype/modules/calendar/js/calendar.codecs.js"></script>
		<link rel="stylesheet" type="text/css" href="../prototype/plugins/freeow/style/freeow/freeow.css" >
		<script type="text/javascript" src="../prototype/plugins/freeow/jquery.freeow.min.js"></script>
		<script type="text/javascript" src="../prototype/plugins/freeow/jquery.freeow.js"></script>


		<script src="js/rich_text_editor.js" type="text/javascript"></script>
		<script src="js/base64.js" type="text/javascript"></script>
                
                <script type="text/javascript"> 
                    User.moduleName = "expressoMail1_2";
		</script> 


                ';
	//---------------------------//

	echo "<script src='js/globals.js?".$update_version."' type='text/javascript'></script>";
	echo "<script src='js/sniff_browser.js?".$update_version."' type='text/javascript'></script>";
	echo "<script src='js/QuickCatalogSearch.js' type='text/javascript'></script>";
	//echo "<style type='text/css'>@import url(../phpgwapi/js/jscalendar/calendar-win2k-1.css);</style>";
	//echo "<script src='../phpgwapi/js/jscalendar/calendar.js?".$update_version."' type='text/javascript'></script>";
	//echo "<script src='../phpgwapi/js/jscalendar/calendar-setup.js?".$update_version."' type='text/javascript'></script>";
	//echo "<script src='../phpgwapi/js/jscalendar/lang/calendar-br.js?".$update_version."' type='text/javascript'></script>";
	echo '<script type="text/javascript" src="../phpgwapi/js/wz_dragdrop/wz_dragdrop.js?'.$update_version.'"></script>
		<script type="text/javascript" src="../phpgwapi/js/dJSWin/dJSWin.js?'.$update_version.'"></script>
		<script type="text/javascript" src="../phpgwapi/js/x_tools/xtools.js?'.$update_version.'"></script>';		

	echo '	
		<script type="text/javascript" src="../prototype/plugins/treeview/jquery.treeview.js"></script>
		<script type="text/javascript" src="../prototype/plugins/treeview/lib/jquery.cookie.js"></script>
		<script type="text/javascript" src="../prototype/plugins/block/jquery.blockUI.js"></script>
		<script type="text/javascript" src="../prototype/plugins/scrollto/jquery.scrollTo.js"></script>

		<link rel="stylesheet" href="../prototype/plugins/treeview/jquery.treeview.css" type="text/css" media="screen" />
		
		<script src="../prototype/plugins/jqgrid/js/i18n/grid.locale-pt-br.js" type="text/javascript"></script>
		<script src="../prototype/plugins/jqgrid/js/jquery.jqGrid.min.js" type="text/javascript"></script>
		<script src="../prototype/modules/mail/js/foldertree.js" type="text/javascript"></script>
		
		<link rel="stylesheet" href="../prototype/plugins/jqgrid/css/ui.jqgrid.css" type="text/css" />	
		<link rel="stylesheet" href="../prototype/plugins/jqgrid/themes/prognusone/jquery-ui-1.8.2.custom.css" type="text/css" />	

		<script src="../prototype/plugins/countdown/jquery.countdown.min.js" type="text/javascript"></script>
		<script src="../prototype/plugins/countdown/jquery.countdown-pt-BR.js" type="text/javascript"></script>		
		
		<script src="../prototype/modules/mail/js/label.js" type="text/javascript"></script>	
		<script src="../prototype/modules/mail/js/followupflag.js" type="text/javascript"></script>
		
		<link rel="stylesheet" href="../prototype/modules/mail/css/followupflag.css" type="text/css" />
		<link rel="stylesheet" href="../prototype/modules/attach_message/attach_message.css" type="text/css" />
		<!-- <link rel="stylesheet" href="../prototype/modules/mail/css/label.css" type="text/css" /> -->';	
	
	/*
	 * TODO: implementar o controle como preferência do usuário 
	 *
	 */
	$jcarousel = false;
	if ($jcarousel) {
		//jcarousel
		echo "\n".'<link rel="stylesheet" type="text/css" href="../library/jcarousel/skins/default/skin.css" />';
		echo "\n".'<script src="../library/jcarousel/lib/jquery.jcarousel.min.js" type="text/javascript"></script>';

		//fancybox
		echo "\n".'<link rel="stylesheet" type="text/css" href="../library/fancybox/jquery.fancybox-1.3.4.css" />';		
		echo "\n".'<script src="../library/fancybox/jquery.fancybox-1.3.4.pack.js" type="text/javascript"></script>';
	}

	echo "<div id='overlay' style='background-color: #AAAAAAA; opacity: .50; filter:Alpha(Opacity=50); height: 100%; width: 100%; position: absolute; top: 0; left: 0; visibility: hidden; z-index: 30000000000000000000000'></div>";

	
	//Enable/Disable VoIP Service -> Voip Server Config
	$voip_enabled = false;
	$voip_groups = array();	
	if($GLOBALS['phpgw_info']['server']['voip_groups']) {
		$emailVoip = false;
		foreach(explode(",",$GLOBALS['phpgw_info']['server']['voip_groups']) as $i => $voip_group){
			$a_voip = explode(";",$voip_group);			
			$voip_groups[] = $a_voip[1];
		}
		foreach($GLOBALS['phpgw']->accounts->membership() as $idx => $group){			
			if(array_search($group['account_name'],$voip_groups) !== FALSE){		 
				$voip_enabled = true;
				$emailVoip = $GLOBALS['phpgw_info']['server']['voip_email_redirect'];
				break;
			}
		}
	}

	//Local messages
	$_SESSION['phpgw_info']['server']['expressomail']['enable_local_messages'] = $current_config['enable_local_messages'];

	// Get Data from ldap_manager and emailadmin.
	$ldap_manager = CreateObject('contactcenter.bo_ldap_manager');
	$boemailadmin	= CreateObject('emailadmin.bo');
	$emailadmin_profile = $boemailadmin->getProfileList();
    // Loading Admin Config Module
    $c = CreateObject('phpgwapi.config','expressoMail1_2');
    $c->read_repository();
    $current_config = $c->config_data;
    
    // Loading Config Module
    $conf = CreateObject('phpgwapi.config','phpgwapi');
    $conf->read_repository();
    $config = $conf->config_data;   

    //Carrega Configuração global do expressoMail 
 	$_SESSION['phpgw_info']['expresso']['expressoMail'] =  $current_config; 
    
	$_SESSION['phpgw_info']['expressomail']['email_server'] = $boemailadmin->getProfile($emailadmin_profile[0]['profileID']);
	//$_SESSION['phpgw_info']['expressomail']['user'] = $GLOBALS['phpgw_info']['user'];
	$_SESSION['phpgw_info']['expressomail']['server'] = $GLOBALS['phpgw_info']['server'];
	$_SESSION['phpgw_info']['expressomail']['ldap_server'] = $ldap_manager ? $ldap_manager->srcs[1] : null;
	$_SESSION['phpgw_info']['expressomail']['user']['email'] = $GLOBALS['phpgw']->preferences->values['email'];
	$_SESSION['phpgw_info']['server']['temp_dir'] = $GLOBALS['phpgw_info']['server']['temp_dir'];
	
	$preferences = $GLOBALS['phpgw']->preferences->read();
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['gears_firefox_windows'] = $current_config['expressoMail_gears_firefox_windows'] ? $current_config['expressoMail_gears_firefox_windows'] : "";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['gears_firefox_linux'] = $current_config['expressoMail_gears_firefox_linux'] ? $current_config['expressoMail_gears_firefox_linux'] : "";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['gears_ie'] = $current_config['expressoMail_gears_ie'] ? $current_config['expressoMail_gears_ie'] : "";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail'] = $preferences['enable_local_messages']; 
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail'] = $preferences['expressoMail'];
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['voip_enabled'] = $voip_enabled;
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['voip_email_redirect'] = $emailVoip;
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['outoffice'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['outoffice'];
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['telephone_number'] = $GLOBALS['phpgw_info']['user']['telephonenumber'];
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['use_cache'] = $current_config['expressoMail_enable_cache'];
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['expressoMail_ldap_identifier_recipient'] = $current_config['expressoMail_ldap_identifier_recipient'];
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['use_x_origin'] = $current_config['expressoMail_use_x_origin'];
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['number_of_contacts'] = $current_config['expressoMail_Number_of_dynamic_contacts'] ? $current_config['expressoMail_Number_of_dynamic_contacts'] : "0";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['notification_domains'] = $current_config['expressoMail_notification_domains'];
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['googlegears_url'] = $current_config['expressoMail_googlegears_url'];
    $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['use_assinar_criptografar'] = $GLOBALS['phpgw_info']['server']['use_assinar_criptografar'] ?  $GLOBALS['phpgw_info']['server']['use_assinar_criptografar'] : "0";
    $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['use_signature_digital_cripto'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['use_signature_digital_cripto'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['use_signature_digital_cripto'] : "0";
    $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['use_signature_digital'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['use_signature_digital'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['use_signature_digital'] : "0";
    $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['search_result_number'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['search_result_number'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['search_result_number'] : "50";
    $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['search_characters_number'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['search_characters_number'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['search_characters_number'] : "4";
    $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['num_max_certs_to_cipher'] = $GLOBALS['phpgw_info']['server']['num_max_certs_to_cipher'] ?  $GLOBALS['phpgw_info']['server']['num_max_certs_to_cipher'] : "10";
    $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['use_signature_cripto'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['use_signature_cripto'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['use_signature_cripto'] : "0";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['keep_after_auto_archiving'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['keep_after_auto_archiving'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['keep_after_auto_archiving'] : "0";

	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['max_attachment_size'] = $current_config['expressoMail_Max_attachment_size'] ? $current_config['expressoMail_Max_attachment_size']."M" : '';
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['max_msg_size'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['max_msg_size'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['max_msg_size'] : "0";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['imap_max_folders'] = $current_config['expressoMail_imap_max_folders'];
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['max_email_per_page'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['max_email_per_page'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['max_email_per_page'] : "50";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['extended_info'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['extended_info']?$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['extended_info'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['extended_info']:'0';
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['from_to_sent'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['from_to_sent'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['from_to_sent'] : "0";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['auto_create_local'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['auto_create_local'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['auto_create_local'] : "0";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['return_recipient_deafault'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['return_recipient_deafault'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['return_recipient_deafault'] : "0";
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['quick_search_default'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['quick_search_default'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['quick_search_default'] : 1;
	// 	ACL for block edit Personal Data.
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['enable_quickadd_telephonenumber'] = $current_config['expressoMail_enable_quickadd_telephonenumber'] == 'true' ? $current_config['expressoMail_enable_quickadd_telephonenumber'] : "";
	if($_SESSION['phpgw_info']['user']['preferences']['expressoMail']['enable_quickadd_telephonenumber']){
		$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['blockpersonaldata'] = $GLOBALS['phpgw']->acl->check('blockpersonaldata',1,'preferences');		
	}

        $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['auto_close_first_tab'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['auto_close_first_tab'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['auto_close_first_tab'] : "0";
	
	$template = CreateObject('phpgwapi.Template',PHPGW_APP_TPL);
	$template->set_var("txt_loading",lang("Loading"));
	$template->set_var("txt_clear_trash",lang("message(s) deleted from your trash folder."));
    $template->set_var("new_message", lang("New Message"));
	$template->set_var("lang_inbox", lang("Inbox"));
    $template->set_var("refresh", lang("Refresh"));
    $template->set_var("tools", lang("Tools"));	
	$template->set_var("lang_Open_Search_Window", lang("Open search window") . '...');
	$template->set_var("lang_search_user", lang("Search user") . '...'); 
	$template->set_var("upload_max_filesize",ini_get('upload_max_filesize'));
	$template->set_var("msg_folder",$_GET['msgball']['folder']);
	$template->set_var("msg_number",$_GET['msgball']['msgnum'] ? $_GET['msgball']['msgnum'] : $_GET['to']);
	$template->set_var("user_email",$_SESSION['phpgw_info']['expressomail']['user']['email']);
	include_once dirname(__FILE__) . '/../header.inc.php';
	require_once dirname(__FILE__) . '/../services/class.servicelocator.php';
	$alternativeMailService = ServiceLocator::getService('ldap');
	$AlternateEmailExpresso = Array();
	$AlternateEmailExpresso = $alternativeMailService->getMailAlternateByUidNumber($_SESSION['phpgw_info']['expressomail']['user']['account_id']);
	$template->set_var("user_email_alternative", implode(",", $AlternateEmailExpresso));	
	$acc = CreateObject('phpgwapi.accounts');
	$template->set_var("user_organization", $acc->get_organization($GLOBALS['phpgw_info']['user']['account_dn']));
	$template->set_var("cyrus_delimiter",$_SESSION['phpgw_info']['expressomail']['email_server']['imapDelimiter']);	
	$template->set_var("lang_contact_details", lang("Contact Details")); 
 	$template->set_var("lang_catalog", lang("catalog")); 
 	$template->set_var("lang_search", lang("search")); 
 	$template->set_var("lang_page", lang("page")); 
 	$template->set_var("lang_quick_search_users_dialog_title", lang("Quick Search Contacts")); 
 	$template->set_var("lang_global_catalog", lang("Global Catalog")); 
 	$template->set_var("lang_personal_catalog", lang("Personal Catalog")); 
 	$template->set_var("lang_all_catalogs", lang("All Catalogs")); 
	// Fix problem with cyrus delimiter changes in preferences.
	// Dots in names: enabled/disabled.
	$save_in_folder = @preg_replace('/INBOX\//i', "INBOX".$_SESSION['phpgw_info']['expressomail']['email_server']['imapDelimiter'], $_SESSION['phpgw_info']['user']['preferences']['expressoMail']['save_in_folder']);
	$save_in_folder = @preg_replace('/INBOX./i', "INBOX".$_SESSION['phpgw_info']['expressomail']['email_server']['imapDelimiter'], $save_in_folder);
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['save_in_folder'] = $save_in_folder;
	// End Fix.

	$template->set_file(Array('expressoMail' => 'index.tpl'));
	$template->set_block('expressoMail','list');
	$template->pfp('out','list');
	$GLOBALS['phpgw']->common->phpgw_footer();
    
    $_SESSION['phpgw_info']['server']['expressomail']['expressoMail_enable_log_messages'] = $current_config['expressoMail_enable_log_messages'];
	
    // Begin Set Anti-Spam options.
    $_SESSION['phpgw_info']['server']['expressomail']['expressoMail_command_for_ham'] = $current_config['expressoMail_command_for_ham'];
    $_SESSION['phpgw_info']['server']['expressomail']['expressoMail_command_for_spam'] = $current_config['expressoMail_command_for_spam'];
    $_SESSION['phpgw_info']['server']['expressomail']['expressoMail_use_spam_filter'] = $current_config['expressoMail_use_spam_filter'];   
    echo '<script> var use_spam_filter = \''.$current_config['expressoMail_use_spam_filter'].'\'
           var sieve_forward_domains = \''.$current_config['expressoMail_sieve_forward_domains'].'\' 
		  </script>';
	// End Set Anti-Spam options.

	// Begin Set Hidden Copy options. 
	$_SESSION['phpgw_info']['server']['expressomail']['allow_hidden_copy'] = $current_config['allow_hidden_copy']; 
	echo '<script> var allow_hidden_copy = \''.$current_config['allow_hidden_copy'].'\' </script>'; 
	// End Set Hidden Copy options. 
	
    // Set Imap Folder names options
    $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultTrashFolder'] 	= $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultTrashFolder']	? $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultTrashFolder']		: lang("Trash");
    $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultDraftsFolder'] 	= $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultDraftsFolder'] ? $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultDraftsFolder'] 	: lang("Drafts");
    $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSpamFolder'] 	= $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSpamFolder']	? $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSpamFolder']		: lang("Spam");
    $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSentFolder']	= $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSentFolder'] 	? $_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSentFolder'] 		: lang("Sent");

    // gera paramero com tokens suportados ....
    $var_tokens = '';
    for($ii = 1; $ii < 11; $ii++)
    {
        if($GLOBALS['phpgw_info']['server']['test_token' . $ii . '1'])
            $var_tokens .= $GLOBALS['phpgw_info']['server']['test_token' . $ii . '1'] . ',';
    }

    if(!$var_tokens)
    {
        $var_tokens = 'ePass2000Lx;/usr/lib/libepsng_p11.so,ePass2000Win;c:/windows/system32/ngp11v211.dll';
    }

    echo '
	<script> var special_folders = new Array(4);
		special_folders[\'Trash\'] = "'.$_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultTrashFolder'].'";
		special_folders[\'Drafts\'] = "'.$_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultDraftsFolder'].'";
		special_folders[\'Spam\'] = "'.$_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSpamFolder'].'";
		special_folders[\'Sent\'] = "'.$_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSentFolder'].'";
		var trashfolder = "'.$_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultTrashFolder'].'";
		var draftsfolder = "'.$_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultDraftsFolder'].'";
		var sentfolder = "'.$_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSentFolder'].'";
		var spamfolder = "'.$_SESSION['phpgw_info']['expressomail']['email_server']['imapDefaultSpamFolder'].'";
		var token_param = "'.$var_tokens.'";
		var locale = "'.$GLOBALS['phpgw']->common->getPreferredLanguage().'";
		var defaultCalendar = "'.  (isset($config['defaultCalendar']) ?  $config['defaultCalendar']  :  "calendar" )    .'";
		$("#sideboxdragarea").hide();
		$("#menu2Container").hide();
    </script>
	<script type="text/javascript" src="../prototype/plugins/timepicker/jquery-ui-timepicker-addon.js"></script>
	<script type="text/javascript" src="../prototype/plugins/timepicker/localization/jquery-ui-timepicker-pt-BR.js"></script>
	<script type="text/javascript" src="../prototype/plugins/jquery/i18n/jquery.ui.datepicker-pt-BR.js"></script>
	<link rel="Stylesheet" type="text/css" href="../prototype/plugins/timepicker/jquery-ui-timepicker-addon.css" />
	<link rel="stylesheet" type="text/css" href="../prototype/modules/calendar/css/layout.css" />
	<!--<link rel="stylesheet" type="text/css" href="../prototype/modules/calendar/css/style.css" /> -->
	<script type="text/javascript" src="../prototype/modules/filters/filters.js"></script>
	
	';
	

    // End Set Imap Folder names options
	//User info
	echo "<script language='javascript'> var account_id = ".$GLOBALS['phpgw_info']['user']['account_id'].";var expresso_offline = false;</script>";

	$obj = createobject("expressoMail1_2.functions");

	// setting timezone preference
	$zones = $obj->getTimezones();
	$_SESSION['phpgw_info']['user']['preferences']['expressoMail']['timezone'] = $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['timezone'] ? $GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['timezone'] : sprintf("%s", array_search("America/Sao_Paulo", $zones));

	// este arquivo deve ser carregado antes que
	// os demais pois nele contem a função get_lang
	// que é utilizada em diversas partes
	echo $obj -> getFilesJs("js/common_functions.js",$update_version);
	include("inc/load_lang.php");

    // INCLUDE these JS Files:
	if ($_SESSION['phpgw_info']['user']['preferences']['expressoMail']['use_local_messages']) 
		echo "<script src='js/gears_init.js?".$update_version."'></script>"; 
 	echo '<script src="../phpgwapi/js/dftree/dftree.js?'.$update_version.'"></script>'; 
    
	$scripts = "js/abas.js," .
				"js/main.js," .
				"js/draw_api.js,";
	
	if ($GLOBALS['phpgw_info']['user']['preferences']['expressoMail']['use_shortcuts'])
	{
		//echo $obj -> getFilesJs("js/shortcut.js", $update_version); 
		$scripts .= "js/shortcut.js,";
	}
				
	if($_SESSION['phpgw_info']['user']['preferences']['expressoMail']['use_local_messages'])
		$scripts .= "js/local_messages.js,";
	$scripts .= "js/messages_controller.js," .
				"js/DropDownContacts.js," .
				"js/doiMenuData.js," .
				"js/connector.js";		
	echo $obj -> getFilesJs($scripts, $update_version);
	echo '
		<script type="text/javascript">
			init();
		</script>
		<script type="text/javascript">connector.updateVersion = "'.$update_version.'";</script>';



	// Get Preferences or redirect to preferences page.
	$GLOBALS['phpgw']->preferences->read_repository();
	//print_r($_SESSION['phpgw_info']['user']['preferences']['expressoMail']);
	unset($_SESSION['phpgw_info']['expressomail']['user']['preferences']);
	unset($_SESSION['phpgw_info']['expressomail']['user']['acl']);
	unset($_SESSION['phpgw_info']['expressomail']['user']['apps']);
	unset($_SESSION['phpgw_info']['expressomail']['server']['global_denied_users']);
	unset($_SESSION['phpgw_info']['expressomail']['server']['global_denied_groups']);
?>
<!-----Expresso Mail - Version Updated:<?=$update_version?>-------->
