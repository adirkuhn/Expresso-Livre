// Tempo do auto refresh (em milisegundos)
var time_refresh = 300000;
// tempo do auto save (em milisegundos)
// 20000 = 20 segundos
var autosave_time = 40000;
var results_search_messages = ""; 
var cabecalho = '<h4>ExpressoLivre - ExpressoMail</h4>'; 
// Variavel para controle de atualização das mensagens listadas na modal de alerta de filtro por remetente
var checkAlarmsFilter = false;

var dynamicPersonalContacts = new Array();
var dynamicContacts = new Array();
var topContact = 0;
DataLayer.get("folder", true);

//Os IE's < 9 não possui suporte a trim() introduzida no JavaScript 1.8.1
if(!String.prototype.trim){  
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g,'');
	} 
}
	

	
function mount_url_folder(folders){
	return folders.join(cyrus_delimiter);
} 

function updateDynamicContact(){
	dynamicContacts = new Array();
	var dynamicData = REST.get("/dynamiccontacts").collection.itens;
	if(dynamicData){
		$.each(dynamicData, function(index, value){
			if(index ==0){
				topContact = parseInt(value.data[2].value);
			}
			var dynamic = {
				name : value.data[0].value,
				mail : value.data[1].value,
				value: value.data[0].value + " - " + value.data[1].value,
				type: "",
				id: parseInt(value.data[3].value),
				qtd : parseInt(value.data[2].value)
			};
			dynamicContacts.push(dynamic);
		});
	}
}


function updateDynamicPersonalContacts(){
	dynamicPersonalContacts = new Array();
	var contactsData = REST.get("/contacts").collection.itens;
	if(contactsData){
		$.each(contactsData, function(index, value){
			var contact = {
				id : parseInt(value.data[0].value),
				name : value.data[1].value,
				email : value.data[2].value,
				value: value.data[1].value + " - " + value.data[2].value,
				type: "P"
			};
			dynamicPersonalContacts.push(contact);
		});
	}
}

function init(){
	if (!is_ie)
		Element('tableDivAppbox').width = '100%';

	var save_preferences = function(data){


		preferences = data;
                
		
 	                if(preferences.show_name_print_messages == "1") { 
							var getUserName = document.getElementById("user_info"); 
 	                        var userName = getUserName.innerHTML; 
 	                        var position = userName.indexOf("-"); 
 	                        var userName = userName.substring(3, position); 
 	                        cabecalho = '<h4>' + userName; 
 	                }
		
		
		current_folder="INBOX";
		
		if( (window.google && google.gears) && !google.gears.factory.getPermission())
		    preferences.use_local_messages=0;
                
		if ((preferences.use_local_messages==1) && (!window.google || !google.gears)) {
		    temp = confirm(get_lang("To use local messages you have to install google gears. Would you like to be redirected to gears installation page?"));
		    if (temp) {
			    location.href = "http://gears.google.com/?action=install&message="+
			    "Para utilizar o recurso de mensagens locais, instale o google gears&return=" + document.location.href;
		    }
		    else {
			    preferences.use_local_messages=0;
		    }
		}
		if (preferences.use_local_messages==1) { //O I.E 7 estava se atrapalhando caso esses loads fossem feitos após as chamadas ajax. Antes não apresentou problemas...
			connector.loadScript('mail_sync');
			if (is_ie)
				connector.loadScript('TreeShow');
			setTimeout('auto_archiving()', 30000);
			
		}
		//Substituido por padrão Jquery
		cExecute ("$this.imap_functions.get_range_msgs2&folder=INBOX&msg_range_begin=1&msg_range_end="+preferences.max_email_per_page+"&sort_box_type=SORTARRIVAL&search_box_type=ALL&sort_box_reverse=1", handler_draw_box);
		//cExecute ("$this.db_functions.get_dropdown_contacts", save_contacts); //Save contacts needs preferences.
		if(preferences.hide_folders == "1")
			Element('divAppboxHeader').innerHTML =  title_app_menu;

		if (preferences.delete_trash_messages_after_n_days != 0)
			cExecute ("$this.imap_functions.automatic_trash_cleanness&before_date="+preferences.delete_trash_messages_after_n_days+"&cyrus_delimiter="+cyrus_delimiter, handler_automatic_trash_cleanness);
		
		//if(preferences.outoffice == "1")
		//	

		//Troca da forma de construção de menu para o plugin jquery.contextMenu
		//ConstructMenuTools();
		
		if ( (preferences.use_local_messages==1) && (expresso_local_messages.is_offline_installed()) )  //Precisa ser feito após a renderização da caixa de emails
			check_mail_in_queue();
		
		// Insere a applet de criptografia
		if (preferences.use_signature_digital_cripto == '1'){
			loadApplet();
		}
		// Fim da inserção da applet	
		DataLayer.get("folder", true);
		cExecute("$this.imap_functions.get_folders_list&onload=true", update_menu);	
		
		if($.cookie('collapse_folders') == "true"){
			if(!is_ie)
				$("#folderscol").addClass( "hidden");
			else
				$("#folderscol").hide();
			$(".collapse_folders").addClass("ui-icon ui-icon-triangle-1-e").children().attr('title', "Expandir");
			refresh();
			resizeWindow();
		}	
		else{
			$(".collapse_folders").addClass("ui-icon ui-icon-triangle-1-w").children().attr('title', "Ocultar");
			refresh();
			resizeWindow();
		}
		
		$(".collapse_folders_td").attr('title', "Ocultar/Expandir").click(function(){
			if($("#folderscol").css("display") != "none"){
				if(!is_ie)
					$("#folderscol").addClass( "hidden");
				else
					$("#folderscol").hide();
					
				$(".collapse_folders").removeClass("ui-icon-triangle-1-w");
				$(".collapse_folders").addClass("ui-icon-triangle-1-e");
				$(".collapse_folders").parent().attr('title', "Expandir");
				$.cookie('collapse_folders', "true");
				refresh();
				resizeWindow();
			}else{
				if(!is_ie)
					$("#folderscol").removeClass( "hidden");
				else
					$("#folderscol").show();
				$(".collapse_folders").removeClass("ui-icon-triangle-1-e");
				$(".collapse_folders").addClass("ui-icon-triangle-1-w");
				$(".collapse_folders").parent().attr('title', "Ocultar");
				$.cookie('collapse_folders', "false");
				refresh();
				resizeWindow();
			}
			resizeWindow();
			
		}).hover(
			function(){
				$(this).addClass("collapse_folders_td_over");
			},
			function(){
				$(this).removeClass("collapse_folders_td_over");
			}
		);
		
		if(parseInt(preferences.use_dynamic_contacts)){
			var load_dynamics = function(){
				updateDynamicContact();
				updateDynamicPersonalContacts();
			};
			load_dynamics();
		}
	}
	var handler_automatic_trash_cleanness = function(data){
		if (data != false){
			write_msg(data.length +' '+ Element('txt_clear_trash').value);
		}
	}

	// Versão
	Element('divAppboxHeader').innerHTML = title_app;

	// Get cyrus delimiter
	cyrus_delimiter = Element('cyrus_delimiter').value;

	cExecute ("$this.functions.get_preferences", save_preferences);
    cExecute ("phpgwapi.browser.isMobile", function( data ){
		mobile_device = ( ( data.constructor == Boolean ) ? data : ( data === 'true' ) );
	});

	DataLayer.get("folder", true);
	cExecute("$this.imap_functions.get_folders_list&onload=true", update_menu);	
	
	setTimeout('auto_refresh()', time_refresh);
	
	$("#divAppbox").css("padding-left", "0px");
}

function init_offline(){
        current_folder = 'local_Inbox';
	if (account_id != null) {
		if (!is_ie)
			Element('tableDivAppbox').width = '100%';
		else
			connector.createXMLHTTP();
		Element('divStatusBar').innerHTML = '<table height="16px" border=0 width=100% cellspacing=0 cellpadding=2>' +
		'<tr>' +
		'<td style="padding-left:17px" width=33% id="content_quota" align=left></td>' +
		'<td width=33% height=16px align=center nowrap><font face=Verdana, Arial, Helvetica, sans-serif color=#000066 size=2>' +
		'<b>ExpressoMail Offline</b><font size=1><b> - Versão 1.0</b></font></td>' +
		'<td width=33% id="div_menu_c3" align=right></td>' +
		'</tr></table>';

		//Troca da forma de construção de menu para o plugin jquery.contextMenu
		//ConstructMenuTools();

		draw_tree_folders();

		proxy_mensagens.messages_list('local_Inbox', 1, preferences.max_email_per_page, 'SORTARRIVAL', null, 1,1,1, function handler(data){
			draw_box(data, 'local_Inbox');
		})

		// Get cyrus delimiter
	cyrus_delimiter = Element('cyrus_delimiter').value;

	//cExecute ("$this.db_functions.get_dropdown_contacts_to_cache", function(data) {contacts = data;});
	//cExecute ("$this.functions.get_preferences", save_preferences);
	}
}
/**
 * Carrega a applet java no objeto search_div
 * @author Mário César Kolling <mario.kolling@serpro.gov.br>
 */

function loadApplet(){

	var search_div = Element('search_div');
	var applet = null;
	if (navigator.userAgent.match('MSIE')){
		applet = document.createElement('<object style="display:yes;width:0;height:0;vertical-align:bottom;" id="cert_applet" ' +
			'classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93"></object>');

		var parameters = {
			type:'application/x-java-applet;version=1.5',
			code:'ExpressoSmimeApplet',
			codebase:'/security/',
			mayscript:'true',
			token: token_param,
			locale: locale,
			archive:'ExpressoCertMail.jar,' +
				'ExpressoCert.jar,' +
				'bcmail-jdk15-142.jar,' +
				'mail.jar,' +
				'activation.jar,' +
				'bcprov-jdk15-142.jar,' +
				'commons-codec-1.3.jar,' +
				'commons-httpclient-3.1.jar,' +
				'commons-logging-1.1.1.jar'
			//debug:'true'
		}

		if (parameters != 'undefined' && parameters != null){
			for (var parameter in parameters) {
				var param = document.createElement("PARAM");
				param.setAttribute("name",parameter);
				param.setAttribute("value",parameters[parameter]);
				applet.appendChild(param);
			}
		}
	}
	else
	{
		applet = document.createElement('embed');
		applet.innerHTML = '<embed style="display:yes;width:0;height:0;vertical-align:bottom;" id="cert_applet" code="ExpressoSmimeApplet.class" ' +
			'codebase="/security/" locale="'+locale+'"'+
			'archive="ExpressoCertMail.jar,ExpressoCert.jar,bcmail-jdk15-142.jar,mail.jar,activation.jar,bcprov-jdk15-142.jar,commons-codec-1.3.jar,commons-httpclient-3.1.jar,commons-logging-1.1.1.jar" ' +
			'token="' + token_param + '" ' +
			'type="application/x-java-applet;version=1.5" mayscript > ' +
			//'type="application/x-java-applet;version=1.5" debug="true" mayscript > ' +
			'<noembed> ' +
			'No Java Support. ' +
			'</noembed> ' +
			'</embed> ';
	}
	
	if( applet != null )
	{
		applet.style.top	= "-100px";
		applet.style.left	= "-100px";
		window.document.body.insertBefore( applet, document.body.lastChild );
	}
	
}

function disable_field(field,condition) {
	var comando = "if ("+condition+") { document.getElementById('"+field.id+"').disabled=true;} else { document.getElementById('"+field.id+"').disabled=false; }";
	eval(comando);
}
/*
	função que remove todos os anexos...
*/
function remove_all_attachments(folder,msg_num) {

	var call_back = function(data) {
		if(!data.status) {
			alert(data.msg);
		}
		else {
			msg_to_delete = Element(msg_num);
			change_tr_properties(msg_to_delete, data.msg_no);
			msg_to_delete.childNodes[1].innerHTML = "";
			write_msg(get_lang("Attachments removed"));
			folderName = Base64.encode(folder);
			folderName = folderName.replace(/=/gi, '');
			delete_border(msg_num+'_r_'+folderName,'false'); //close email tab
		}
	};
	if (confirm(get_lang("delete all attachments confirmation")))
		cExecute ("$this.imap_functions.remove_attachments&folder="
				+folder+"&msg_num="+msg_num, call_back);
}
function watch_changes_in_msg(border_id)
{
	if (document.getElementById('border_id_'+border_id))
	{
		function keypress_handler ()
		{
			away=false;
			var save_link = content.find(".save");
			save_link.onclick = function onclick(event) {openTab.toPreserve[border_id] = true;save_msg(border_id);} ;
			save_link.button({disabled: false});
			$(".header-button").button();
		};
		var content = $("#content_id_"+border_id);
		
		var subject_obj = content.find(".subject");
		if ( subject_obj.addEventListener )
				subject_obj.addEventListener('keypress', keypress_handler, false);
		else if ( subject_obj.attachEvent )
			subject_obj.attachEvent('onkeypress', keypress_handler);

		var to_obj = content.find('[name="input_to"]');
		if ( to_obj.addEventListener )
				to_obj.addEventListener('keypress', keypress_handler, false);
		else if ( to_obj.attachEvent )
			to_obj.attachEvent('onkeypress', keypress_handler);
			
		var cc_obj = content.find('[name="input_cc"]');
		if ( cc_obj.addEventListener )
				cc_obj.addEventListener('keypress', keypress_handler, false);
		else if ( cc_obj.attachEvent )
			cc_obj.attachEvent('onkeypress', keypress_handler);
		
		if(content.find('[name="input_cco"]').length){
			var cco_obj = content.find('[name="input_cco"]');
			if ( cco_obj.addEventListener )
				cco_obj.addEventListener('keypress', keypress_handler, false);
			else if ( cco_obj.attachEvent )
				cco_obj.attachEvent('onkeypress', keypress_handler);
		}
		//var important_obj = $("important_message_options_"+border_id).bind('click',keypress_handler);
			//important_obj.addEventListener('click', keypress_handler, false);
			
        var txtarea_obj = Element('body_'+border_id);
        if (txtarea_obj){
          if ((preferences.plain_text_editor == 1)||(Element('body_')+border_id).checked){
		    if ( txtarea_obj.addEventListener )
			   txtarea_obj.addEventListener('keypress', keypress_handler, false);
		    else if ( txtarea_obj.attachEvent )
			   txtarea_obj.attachEvent('onkeypress', keypress_handler);
          }
        }
	}
}

function show_msg_img(msg_number,folder){
	var call_back = function(data){
	   data.showImg = true;
	   if (!Element(data.msg_number)){
		   trElement = document.createElement('DIV');
		   trElement.id = data.msg_number;
		   Element("tbody_box").appendChild(trElement);
	   }
	   show_msg(data);
	}

	proxy_mensagens.msg_img(msg_number,folder,call_back);

}

function show_msg(msg_info){
	if(!verify_session(msg_info))
		return;
	if (typeof(msg_info) != 'object')
		alert(get_lang("Error in show_msg param is not object"));

	if (msg_info.status_get_msg_info == 'false')
	{
		write_msg(get_lang("Problems reading your message")+ ".");
		return;
	}

	var handler_sendNotification = function(data){
		if (data)
			write_msg(get_lang("A read confirmation was sent."));
		else
			write_msg(get_lang("Error in SMTP sending read confirmation."));
	}

	if(msg_info.source)
	{
		// Abrindo um e-mail criptografado
		// Verifica se existe o objeto applet
		if (!Element('cert_applet')){
			// se não existir, mostra mensagem de erro.
			write_msg(get_lang('The preference "%1" isn\'t enabled.', get_lang('Enable digitally sign/cipher the message?')));
		} else {
			// se existir prepara os dados para serem enviados e chama a
			// operação na applet

		   // if ((msg_info.DispositionNotificationTo) && ((msg_info.Unseen == 'U') || (msg_info.Recent == 'N'))){
			/*	var confNotification = confirm(get_lang("The sender waits your notification of reading. Do you want to confirm this?"), "");
				if (confNotification)*/
			//		cExecute ("$this.imap_functions.send_notification&notificationto="+msg_info.DispositionNotificationTo+"&subject="+url_encode(msg_info.subject), handler_sendNotification);
		   // }

			Element('cert_applet').doButtonClickAction('decript',
														msg_info.msg_number,
														msg_info.source,
														msg_info.msg_folder); // Passa os dados para a applet
		}
		return;

	}


	if (msg_info.status_get_msg_info == 'false')
	{
		write_msg(get_lang("Problems reading your message")+ ".");
		return;
	}

	if (msg_info.status == 'false'){
		eval(msg_info.command_to_exec);
	}
	else{
		var ID = msg_info.original_ID ? msg_info.original_ID : msg_info.msg_number;
		        
		var folderName = msg_info.msg_folder;
		folderName = Base64.encode(folderName);
		folderName = folderName.replace(/=/gi, '');
		var id_msg_read = ID+"_r_"+folderName;
        
        //Evita a tentativa de criação de uma aba cujo ID já existe
        if (Element("border_id_"+id_msg_read) && currentTab > 0) 
		    id_msg_read += "n";
    
		if (preferences.use_shortcuts == '1') 
	          select_msg(ID, 'null'); 
			  
		// Call function to draw message
		// If needed, delete old border
                var isPartMsg = false;
                for(var ii = 0; ii < partMsgs.length; ii++)
                     if(partMsgs[ii] == ID) isPartMsg = true;    
					 
					if(msg_info.alarm == false){
						if ((openTab.type[currentTab] == 2 || openTab.type[currentTab] == 3) && isPartMsg === false)
								delete_border(currentTab,'false');
					}
					
		if(Element("border_id_" + id_msg_read)) {
			alternate_border(id_msg_read);
			resizeWindow(); 
		}
		else {
			var border_id = create_border(msg_info.subject, id_msg_read);
			if(border_id)
			{
				openTab.type[border_id] = 2;
				openTab.imapBox[border_id] = msg_info.msg_folder;
				draw_message(msg_info,border_id);
				var unseen_sort = document.getElementById('span_flag_UNSEEN').getAttribute('onclick');
				unseen_sort = unseen_sort.toString();
				if ( !(unseen_sort.indexOf("'UNSEEN' == 'UNSEEN'") < 0) )
				{
					var sort_type = sort_box_type;
					sort_box_type = null;
					sort_box('UNSEEN', sort_type);
				}
			}
			else
				return;
		}

		var domains = "";
		if ((msg_info.DispositionNotificationTo) && (!msg_is_read(ID) || (msg_info.Recent == 'N')))
		{
			if (preferences.notification_domains != undefined && preferences.notification_domains != "")
			{
				domains = preferences.notification_domains.split(',');
			}
			else
			{
				var confNotification = true;
			 }
			for (var i = 0; i < domains.length; i++)
				if (Base64.decode(msg_info.DispositionNotificationTo).match("@"+domains[i]))
				{
					var confNotification = true;
					break;
				}
				if (confNotification == undefined)
					var confNotification = confirm(get_lang("The sender:\n%1\nwaits your notification of reading. Do you want to confirm this?",Base64.decode(msg_info.DispositionNotificationTo)), "");

			if (confNotification)
				cExecute ("$this.imap_functions.send_notification&notificationto="+msg_info.DispositionNotificationTo+"&date="+msg_info.udate+"&subject="+url_encode(msg_info.subject), handler_sendNotification);
		}
		//Change msg class to read.
		if (!msg_is_read(ID))
		{
			set_msg_as_read(ID, true);
			if (msg_info.cacheHit || (!proxy_mensagens.is_local_folder(get_current_folder()) && msg_info.original_ID))
			{
				set_message_flag(ID, "seen"); // avoid caducous (lazy) data
			}
		}
	}
	setTimeout('resizeWindow()',300);
}

function auto_refresh(){
	refresh(preferences.alert_new_msg);
	setTimeout('auto_refresh()', time_refresh);
}

function auto_archiving() {
	expresso_mail_sync.start_sync();
	setTimeout('auto_archiving()',600000);
}

function refresh(alert_new_msg){
	getFromAlertRules();
	var handler_refresh = function(data){
		if(checkAlarmsFilter){
			handlerMessageFilter = function (data) {
				alarmFollowupflagged('filtersAlarms', data);
			}
			/* Busca  nas pastas indexadas para ver se há novas mensagens com a flag $FilteredMessage */
			cExecute ("$this.imap_functions.getFlaggedAlertMessages&folders="+fromRules, handlerMessageFilter);
		}
		checkAlarmsFilter = true;
		if(data['msg_range_end'])
			if(data['msg_range_end'] > 0)
				current_page = data['msg_range_end']/preferences.max_email_per_page;
		if(!verify_session(data))
			return;
		var total_messages_element = Element('tot_m');
			
		var box = Element("tbody_box");
		if (box.childNodes.length == 0)
			showEmptyBoxMsg(box);

		if (data.length > 0){
			for(var i=0;i< data.length;i++){
				if (!onceOpenedHeadersMessages[current_folder])
					onceOpenedHeadersMessages[current_folder] = {};
				onceOpenedHeadersMessages[current_folder][data[i].msg_number] = data[i];
			}
			Element("table_message_header_box_"+numBox).emptyBody = false;
			table_element = Element("table_box");
			var msg_info = document.getElementById('msg_info');
			if (msg_info != null)
			{
				var msg_tr = msg_info.parentNode.parentNode;
				msg_tr.removeChild(msg_info.parentNode);
				if (!Element("colgroup_main_"+numBox)) {
					var colgr_element = buildColGroup();
					colgr_element.setAttribute("id","colgroup_main_"+numBox);
					table_element.appendChild(colgr_element);
				}
			}

			var box = Element("tbody_box");
			//table_element.insertBefore(box, Element("colgroup_main_"+numBox)); // keeps colgroup as the last child
			//table_element.appendChild(Element("colgroup_main_"+numBox));
			
			$(table_element).append(Element("colgroup_main_"+numBox));

			if (data.msgs_to_delete.length > 0){
				for (var i=0; i<data.msgs_to_delete.length; i++){
					if ( (data.msgs_to_delete[i] != undefined) && (data.msgs_to_delete[i] != "")){
						removeAll(data.msgs_to_delete[i]);
					}
				}
			}
			if (data[0].msg_folder != current_folder) // Bad request
				return false;
			for (var i=0; i<data.length; i++){
				var existent = document.getElementById(data[i].msg_number);
				if (!existent)
				{
					var new_msg = this.make_tr_message(data[i], current_folder, data.offsetToGMT);
					$(new_msg).draggable({
						start : function(){
							if($(".shared-folders").length){
								$(".shared-folders").parent().find('.folder:not(".shared-folders")').droppable({
									over : function(a, b){						
										//SETA BORDA EM VOLTA DA PASTA
										over = $(this);
										$(this).addClass("folder-over");
										if(($(this)[0] != $(this).parent().find(".head_folder")[0]))
											if($(this).prev()[0])
												if($(this).parent().find(".expandable-hitarea")[0] == $(this).prev()[0]){
													setTimeout(function(){
														if(over.hasClass("folder-over"))
															over.prev().trigger("click");
													}, 500);
													
												}
									},
									out : function(){
										//RETIRA BORDA EM VOLTA DA PASTA
										$(this).removeClass("folder-over");
									},
									//accept: ".draggin_mail",
									drop : function(event, ui){
										$(this).css("border", "");
										if($(this).parent().attr('id') == undefined){
											var folder_to = 'INBOX';
											var to_folder_title = get_lang("Inbox");
										}else{
											var folder_to = $(this).parent().attr('id');
											var to_folder_title = $(this).attr('title');
										}		
										var folder_to_move = ui.draggable.parent().attr('id');
										var border_id = ui.draggable.find("input[type=hidden]").attr("name");
										// Mensagens : SE O DROP VIER DA LISTA DE MENSAGENS :
										if(folder_to_move == "tbody_box"){
											move_msgs2(get_current_folder(), 'selected', 0, folder_to, to_folder_title,true);
											return refresh();
										}
									}
								});
							}
						},
						stop :function(){
							$(".shared-folders").parent().find(".folder").droppable("destroy");
						},
						helper: function(event){
								if($(this).find("input:checkbox").attr("checked") != "checked"){
									$(this).find("input:checkbox").trigger('click');
									$(this).addClass("selected_msg");
								}
								if($("#table_box").find("tr input:checked").length > 1)
									return $("<tr><td>"+DataLayer.render('../prototype/modules/mail/templates/draggin_box.ejs', {texto : (($("#table_box").find("tr input:checked")).length+" mensagens selecionadas"), type: "messages"})+"</td></tr>");
								if(	$(this).find(".td_msg_subject").text().length > 18 )
									return $("<tr><td>"+DataLayer.render('../prototype/modules/mail/templates/draggin_box.ejs', {texto : $(this).find(".td_msg_subject").text().substring(0,18) + "...", type: "messages"})+"</td></tr>");
								else
									return $("<tr><td>"+DataLayer.render('../prototype/modules/mail/templates/draggin_box.ejs', {texto : $(this).find(".td_msg_subject").text(), type: "messages"})+"</td></tr>");
						},
						iframeFix: true,
						delay: 150,
						cursorAt: {top: 5, left: 56},
						refreshPositions: true,
						containment: "#divAppbox"
					}).bind("contextmenu", function(){
						if($(this).find("input:checkbox").attr("checked") != "checked"){
							$(this).find("input:checkbox").trigger('click');
							$(this).addClass("selected_msg");
						}
					});
					//_dragArea.makeDragged(new_msg, data[i].msg_number, data[i].subject, true);
					
					if( data[i].next_msg_number != undefined && data[i].next_msg_number != null ){
						try {
							box.insertBefore(new_msg, box.childNodes[data[i].msg_key_position]);					
						}
						catch (e){
							box.insertBefore(new_msg, box.firstChild);
						}
					}
					else if (data[i].Recent == 'N'){
						box.insertBefore(new_msg,box.firstChild);
					}
					else {
						box.appendChild(new_msg);
					}
				}
			}
			if(parseInt(preferences.use_shortcuts))
				select_msg("null","reload_msg","null");

			if(parseInt(alert_new_msg) && data.new_msgs > 0)
				alert(data['new_msgs'] > 1 ? get_lang("You have %1 new messages", data['new_msgs']) + "!" : get_lang("You have 1 new message") +"!");
			build_quota(data['quota']);
		}
		if(data.new_msgs){
			total_messages_element.innerHTML = parseInt( total_messages_element.innerHTML ) + data.new_msgs;
		}else if(data.tot_msgs){
			total_messages_element.innerHTML = data.tot_msgs;
		}
		// Update Box BgColor
		var box = Element("tbody_box");
		if(box.childNodes.length > 1){
			updateBoxBgColor(box.childNodes);
		}
		connector.purgeCache();
		update_menu();
		resizeMailList();

	}
	
	msg_range_end = (current_page*preferences.max_email_per_page);
	msg_range_begin = (msg_range_end-(preferences.max_email_per_page)+1);


	//Get element tBody.
	main = Element("tbody_box");
	if(!main)
		return;

	// Get all TR (messages) in tBody.
	main_list = main.childNodes;
	var tmp = '';
	var string_msgs_in_main = '';

	var len = main_list.length;
	for (var j=0; j < len; j++)
		tmp += main_list[j].id + ',';

	string_msgs_in_main = tmp.substring(0,(tmp.length-1));
	if(!expresso_offline)
		$.ajax({
			  url: 'controller.php?' + $.param( {action: '$this.imap_functions.refresh',
							      folder: current_folder,
							      msgs_existent: string_msgs_in_main,
							      msg_range_begin: msg_range_begin,
							      msg_range_end: msg_range_end,
							      sort_box_type: sort_box_type,
							      search_box_type: search_box_type,
							      sort_box_reverse: sort_box_reverse } ),
			  success: function( data ){
			      data = connector.unserialize( data );
			      
			      if( data )
				  handler_refresh( data );
			  },
			  beforeSend: function( jqXHR, settings ){
				connector.showProgressBar();
			  },
			  complete: function( jqXHR, settings ){
			  	connector.hideProgressBar();
			  }

		});
}

function delete_msgs(folder, msgs_number, border_ID, show_success_msg,archive){	
			if( preferences.use_local_messages == 1 && expresso_local_messages.isArchiving( msgs_number, folder ) ){
			  alert( "Impossivel deletar mensagens que estão ainda estão sendo arquivadas." );
			  return;
			}
				
 		        var userTrashFolder = ''; 
 		       
 		        if (arguments.length < 4) show_success_msg = true; 
 		        if (folder == 'null') folder = current_folder; 
 		 
 		        if(folder.substr(0,4) == 'user') 
 		        { 
					var arrayFolder = folder.split(cyrus_delimiter); 
					userTrashFolder = 'user'+cyrus_delimiter+arrayFolder[1]+cyrus_delimiter+special_folders['Trash'];  
					/** TODO Mudar quando melhorias forem implementadas na API de atualização do cache */
					DataLayer.remove('folder', false);
					DataLayer.get('folder');
					
					var has_folder = DataLayer.get('folder', userTrashFolder);
					if(!has_folder){
						create_new_folder(special_folders['Trash'], 'user'+cyrus_delimiter+arrayFolder[1]);
					}
					
 		        } 
				else userTrashFolder = mount_url_folder(["INBOX",special_folders["Trash"]]); 
 	 
 		        if(openTab.type[currentTab] == 1) 
					return move_search_msgs('content_id_'+currentTab,userTrashFolder,special_folders['Trash']); 
					
				if(currentTab.toString().indexOf("_r") != -1) 
					msgs_number = currentTab.toString().substr(0,currentTab.toString().indexOf("_r")); 
 		         
 		        if (!archive && (parseInt(preferences.save_deleted_msg)) && (folder != userTrashFolder)){ 
 		                move_msgs2(folder, msgs_number, border_ID, userTrashFolder,special_folders['Trash'],show_success_msg ); 
				return;
	}

	var handler_delete_msgs = function(data){

		Element('chk_box_select_all_messages').checked = false;
		if (currentTab)
			mail_msg = Element("tbody_box_"+currentTab);
		else
			mail_msg = Element("tbody_box");

		if ( preferences.use_shortcuts == '1') {
				//Last msg is selected
				if (mail_msg && exist_className(mail_msg.childNodes[mail_msg.childNodes.length-1], 'selected_shortcut_msg') ) {
					select_msg('null', 'up', true);
				}
				else {
					if (!select_msg('null', 'down', true)) {
						select_msg('null', 'up', true);
					}
				}
			}

		if (show_success_msg) {
			if (data.msgs_number.length == 1)
				write_msg(get_lang("The message was deleted."));
			else
				write_msg(get_lang("The messages were deleted."));
		}
		if (openTab.type[currentTab] > 1){
			var msg_to_delete = Element(msgs_number);
			if (parseInt(preferences.delete_and_show_previous_message) && msg_to_delete) {
				if (msg_to_delete.previousSibling){
 					var previous_msg = msg_to_delete.previousSibling.id;
					 $.ajax({
						  url: 'controller.php?' + $.param( {action: '$this.imap_functions.get_info_msg',
										      msg_number: previous_msg, 
										      msg_folder: current_folder,
										      decoded: true } ),
						  success: function( data ){
						      data = connector.unserialize( data );
						      
						      if( data )
							  show_msg( data );
						  },
						  beforeSend: function( jqXHR, settings ){
						  	connector.showProgressBar();
						  },
						  complete: function( jqXHR, settings ){
						  	connector.hideProgressBar();
						  }

					});
 				} 
				else
					delete_border(currentTab,'false');
			}
			else
				delete_border(currentTab,'false');
		}
		for (var i=0; i<data.msgs_number.length; i++){
				var msg_to_delete = Element(data.msgs_number[i]);
				if (msg_to_delete){
						removeAll(msg_to_delete.id);
				}
		}
		Element('tot_m').innerHTML = parseInt(Element('tot_m').innerHTML) - data.msgs_number.length;
		refresh();
	}

	if (msgs_number == 'selected')
		msgs_number = get_selected_messages();
	if (msgs_number.length > 0 || parseInt(msgs_number) > 0)
		cExecute ("$this.imap_functions.delete_msgs&folder="+folder+"&msgs_number="+msgs_number+"&border_ID="+border_ID+"&sort_box_type="+sort_box_type+"&search_box_type="+search_box_type+"&sort_box_reverse="+sort_box_reverse, handler_delete_msgs);
	else
		write_msg(get_lang('No selected message.'));
}

  
function move_search_msgs(border_id, new_folder, new_folder_name, action){

	var msg_to_delete = "";
	var msg_to_move = "";
	var selected_messages = '';
	var temp_msg;
	var remove_currente_folder = "";
	var id_border = currentTab.replace(/[a-zA-Z_]+/, "");
	
	var delete_msg = false;
	
	if(new_folder_name == special_folders['Trash']){
		delete_msg = true;
		}
	selected_messages = get_selected_messages_search();
	
	if( preferences.use_local_messages == 1 && expresso_local_messages.isArchiving( selected_messages, folder ) ){
	  alert( "Impossivel mover mensagens que estão ainda estão sendo arquivadas." );
	  return;
	}
	var handler_move_search_msgs = function(data){
		if(!data || !data.msgs_number)
			return;
		else if(data.deleted) {
			if(data.no_move && data.move)
				alert(get_lang("Unable to remove the message (s) of shared folders which you do not have permission."));
			else if (data.msgs_number.length == 1)
				write_msg(get_lang("The message was deleted."));
			else
				write_msg(get_lang("The messages were deleted."));
		}else if(data.status == false && data.move ){
					alert(get_lang("Unable to remove the message (s) of shared folders which you do not have permission."));
		}else if(data.status == false){
					alert(get_lang("You don't have permission for this operation in this shared folder!"));
					return false;
		}else{
			if (data.msgs_number.length == 1)
				write_msg(get_lang("The message was moved to folder ") + lang_folder(data.new_folder_name));
			else
				write_msg(get_lang("The messages were moved to folder ") + lang_folder(data.new_folder_name));
		}

		if(data.no_move){
			var no_remove = data.no_move.split(',');
			var continua = true;
			
		selected_messages = selected_messages.split(",");
		for (i = 0; i < selected_messages.length; i++){
				for(j = 0; j < no_remove.length; j++)
					if(selected_messages[i] == no_remove[j])
						continua = false;
				if(continua)	
					removeAll(selected_messages[i]+'_s'+id_border);
				continua = true;
		}
		}else{
			selected_messages = selected_messages.split(",");
			for (i = 0; i < selected_messages.length; i++){
				removeAll(selected_messages[i]+'_s'+id_border);
		
			}
		}
		
		// Update Box BgColor
		var box = Element("tbody_box_"+getNumBoxFromTabId(currentTab)).childNodes;
		if(box.length > 1){
			updateBoxBgColor(box);
		}
		connector.purgeCache();

		
		if(remove_currente_folder != ""){
			var mail_msg = Element('tbody_box').childNodes;
			remove_currente_folder = remove_currente_folder.substring(0,(remove_currente_folder.length-1));
			remove_currente_folder = remove_currente_folder.split(",");
			for(i = 0; i < remove_currente_folder.length; i++)
				removeAll(remove_currente_folder[i]);

			// Update Box BgColor
			var box = Element("tbody_box");
			if(box.childNodes.length > 0){
				updateBoxBgColor(box.childNodes);
			}
			if(folder == get_current_folder()){
				Element('tot_m').innerHTML = parseInt(Element('tot_m').innerHTML) - remove_currente_folder.length;
			}
		}
		
		draw_tree_folders();
		EsearchE.refresh();
	}

	if (selected_messages){
		
		var selected_param = "";
		if (selected_messages.indexOf(',') != -1)
		{
			selected_msg_array = selected_messages.split(",");
			for (i = 0; i < selected_msg_array.length; i++){
				var tr = Element(selected_msg_array[i]+'_s'+id_border);
				if(tr.getAttribute('name') == current_folder)
					remove_currente_folder += tr.id.replace(/_[a-zA-Z0-9]+/,"")+',';
				
				if ((action == 'delete' && tr.getAttribute('name') == mount_url_folder(["INBOX",special_folders["Trash"]])) || !(parseInt(preferences.save_deleted_msg)))
				{
					msg_to_delete +=   ','+special_folders['Trash']+';'+tr.id.replace(/_[a-zA-Z0-9]+/,"");
				}
				else if (!(tr.getAttribute('name') == new_folder && action != 'delete'))
				{
					msg_to_move = (tr.getAttribute('name') == null?get_current_folder():tr.getAttribute('name'));
					selected_param += ','+msg_to_move+';'+tr.id.replace(/_[a-zA-Z0-9]+/,"");
				}else{
					write_msg(get_lang('At least one message have the same origin'));
					return false;
				}
			}
		}
		else
		{
			var tr=Element(selected_messages+'_s'+id_border);
			if(tr.getAttribute('name') == current_folder)
					remove_currente_folder += tr.id.replace(/_[a-zA-Z0-9]+/,"")+',';
			if((action == 'delete' && tr.getAttribute('name') == mount_url_folder(["INBOX",special_folders["Trash"]])) || !(parseInt(preferences.save_deleted_msg))){
				msg_to_delete = special_folders['Trash']+';'+tr.id.replace(/_[a-zA-Z0-9]+/,"");
			}else if (!(tr.getAttribute('name') == new_folder && action != 'delete')){
				trfolder = (tr.getAttribute('name') == null?get_current_folder():tr.getAttribute('name'));
				selected_param=trfolder+';'+tr.id.replace(/_[a-zA-Z0-9]+/,"");
			}else{
				write_msg(get_lang('The origin folder and the destination folder are the same.'));
				return false;
			}
		}
		var params = "";
		if(msg_to_delete != "" && msg_to_move != ""){
			params += "&selected_messages_move="+url_encode(selected_param);
			params += "&new_folder_move="+url_encode(new_folder);
			params += "&new_folder_name_move="+url_encode(new_folder_name);
		
			new_folder = mount_url_folder(["INBOX",special_folders["Trash"]]);
			new_folder_name = special_folders['Trash'];
			params += "&selected_messages_delete="+url_encode(msg_to_delete);
			params += "&new_folder_delete="+url_encode(new_folder);
			cExecute ("$this.imap_functions.move_delete_search_messages", handler_move_search_msgs, params);
		}else if(msg_to_delete != ""){
			new_folder = mount_url_folder(["INBOX",special_folders["Trash"]]);
			new_folder_name = special_folders['Trash'];
			params += "&delete=true";
			params += "&selected_messages="+url_encode(msg_to_delete);
			params += "&new_folder="+url_encode(new_folder);
			cExecute ("$this.imap_functions.move_search_messages", handler_move_search_msgs, params);
		}else{
			params = "&selected_messages="+url_encode(selected_param);
			params += "&delete=false";
			params += "&new_folder="+url_encode(new_folder);
			params += "&new_folder_name="+url_encode(new_folder_name);
		cExecute ("$this.imap_functions.move_search_messages", handler_move_search_msgs, params);
	}
	}
	else
		write_msg(get_lang('No selected message.'));
}

function move_msgs2(folder, msgs_number, border_ID, new_folder, new_folder_name,show_success_msg, not_opem_previus){
	not_opem_previus = typeof(not_opem_previus) != 'undefined' ? not_opem_previus : false;
	var folder_error = new_folder_name;
        if( preferences.use_local_messages == 1 && expresso_local_messages.isArchiving( msgs_number, folder ) ){
	    alert( "Impossivel mover mensagens que estão ainda estão sendo arquivadas." );
	    return;
	}

	if (! folder || folder == 'null')
		folder = Element("input_folder_"+msgs_number+"_r") ? Element("input_folder_"+msgs_number+"_r").value : (openTab.imapBox[currentTab] ? openTab.imapBox[currentTab]:get_current_folder());
	if(openTab.type[currentTab] == 1)
		return move_search_msgs('content_id_'+currentTab,new_folder,new_folder_name);

	var handler_move_msgs = function(data){
		if(typeof(data) == 'string')
			if (data.match(/^(.*)TRYCREATE(.*)$/)){
				connector.loadScript('TreeS');
				var move_to_folder = data.match(/^(.*)Spam(.*)$/) ? "Spam" : special_folders['Trash'];
				alert(get_lang('There is not %1 folder, Expresso is creating it for you... Please, repeat your request later.', folder_error));
				connector.loadScript('TreeShow');
				ttree.FOLDER = 'root';
				ttreeBox.new_past(move_to_folder);
				return false;
			}else{
				alert(get_lang('Error moving message.')+":\n"+data);
				return false;
			}
		//Este bloco verifica as permissoes ACL sobre pastas compartilhadas
		if(data.status == false){
			alert(get_lang("You don't have permission for this operation in this shared folder!"));
			return false;
		}
		mail_msg = ( Element("divScrollMain_"+numBox) ) ? Element("divScrollMain_"+numBox).firstChild.firstChild : Element("divScrollMain_0").firstChild.firstChild;
		if (data.msgs_number.length == 1){
			write_msg(get_lang("The message was moved to folder ") + lang_folder(data.new_folder_name));
		}
		else{
			write_msg(get_lang("The messages were moved to folder ") + lang_folder(data.new_folder_name));
		}

		if (openTab.type[currentTab] > 1){
			msg_to_delete = Element(msgs_number);
			if (parseInt(preferences.delete_and_show_previous_message) && msg_to_delete)
			{
				if (msg_to_delete.previousSibling){
					var previous_msg = msg_to_delete.previousSibling.id;
					//cExecute("$this.imap_functions.get_info_msg&msg_number="+previous_msg+"&msg_folder=" + current_folder, show_msg);
					if(!not_opem_previus){
						$.ajax({
							  url: 'controller.php?' + $.param( {action: '$this.imap_functions.get_info_msg',
											      msg_number: previous_msg, 
											      msg_folder: folder,
											      decoded: true } ),
							  success: function( data ){
							      data = connector.unserialize( data );
							      
							      if( data )
								  show_msg( data );
							  },
				 			  beforeSend: function( jqXHR, settings ){
							  	connector.showProgressBar();
							  },
							  complete: function( jqXHR, settings ){
							  	connector.hideProgressBar();
							  }
						});
					}
				}
				//se houver pagina anterior a paginação deve ser refeita
				else if (current_page > 1){
					$('#msg_opt_previous_'+msg_to_delete.getAttribute('id') + '_r').trigger('click');
				}
				else
					delete_border(currentTab,'false');
			}
			else{
				delete_border(currentTab,'false');
			}
			if(msg_to_delete)
				mail_msg.removeChild(msg_to_delete);

			// Update Box BgColor
			var box = Element("tbody_box");
			if(box.childNodes.length > 0){
				updateBoxBgColor(box.childNodes);
			}
			if(folder == get_current_folder()){
				Element('tot_m').innerHTML = parseInt(Element('tot_m').innerHTML) - 1;
			}
			return;
		}

		Element('chk_box_select_all_messages').checked = false;
		if (! mail_msg)
				mail_msg = Element("tbody_box");
		data.msgs_number = data.msgs_number.split(",");

		var msg_to_delete;
		if( typeof(msgs_number) == 'string' )
			all_search_msg = msgs_number.split(',');
		else if( typeof(msgs_number) == 'number')
			all_search_msg = msgs_number;

		for (var i=0; i <= all_search_msg.length; i++)
		{
			msg_to_delete = Element(folder+';'+all_search_msg[i]);
			if (msg_to_delete)
				msg_to_delete.parentNode.removeChild(msg_to_delete);
		}

		if ( preferences.use_shortcuts == '1') {
			var all_messages = Element('tbody_box').childNodes;
			// verificar se a msg selecionada com o checkbox é a mesma selecionada com o shortcut
			var msg_list_shortcut = get_selected_messages_shortcut().split(',');
			if(data.msgs_number.length > 0 && msg_list_shortcut.length > 0 && data.msgs_number.toString() == msg_list_shortcut.toString()){
				//Last msg is selected
				if ( exist_className(all_messages[all_messages.length-1], 'selected_shortcut_msg') ) {
					select_msg('null', 'up', true);
				}
				else {
					if (!select_msg('null', 'down', true)) {
						select_msg('null', 'up', true);
					}
				}
			}
		}
		for (var i=0; i<data.msgs_number.length; i++)
		{
			msg_to_delete = Element(data.msgs_number[i]);
			if (msg_to_delete)
				mail_msg.removeChild(msg_to_delete);	
		}

		if (data.msgs_number.length == 1)
			write_msg(get_lang("The message was moved to folder ") + lang_folder(data.new_folder_name));
		else
			write_msg(get_lang("The messages were moved to folder ") + lang_folder(data.new_folder_name));
		if (data.border_ID.indexOf('r') != -1){
			if (parseInt(preferences.delete_and_show_previous_message) && folder == get_current_folder()){
				delete_border(data.border_ID,'false');
				show_msg(data.previous_msg);
				}
			else
				delete_border(data.border_ID,'false');
		}
		if(folder == get_current_folder()){
			var n_total_msg = parseInt(Element('tot_m').innerHTML) - data.msgs_number.length;
			draw_paging(n_total_msg);
			Element('tot_m').innerHTML = n_total_msg;
		}
		refresh();
	}

	if (folder == new_folder){
		write_msg(get_lang('The origin folder and the destination folder are the same.'));
		return;
	}

	try{
		if (proxy_mensagens.is_local_folder(Element('input_folder_'+currentTab).getAttribute('value'))) {
			alert(get_lang("You cant manipulate local messages on search"));
			return;
		}
	} catch (e) {} 

	if (msgs_number == 'selected'){
		msgs_number = get_selected_messages();
		}

	if(openTab.type[currentTab] == 1){
		return move_search_msgs('content_id_'+currentTab,new_folder,new_folder_name);
		}

	// se a aba estiver aberta e selecionada, apenas a msg da aba é movida
	if(currentTab.toString().indexOf("_r") != -1 && currentTab == border_ID)
        {
                //se a aba for aberta atraves de uma pesquisa
                if(currentTab.toString().indexOf('_s') != -1)
                   msgs_number = currentTab.toString().substr(0,currentTab.toString().indexOf('_s'));
                else
                    msgs_number = currentTab.toString().substr(0,currentTab.toString().indexOf('_r'));
	}
	refresh();
	if (parseInt(msgs_number) > 0 || msgs_number.length > 0){
		// remove a flag $FilteredMessage da mensagem, depois move
		var handler_removeFlag = function(){
			$.ajax({
				url: 'controller.php?' + $.param( {action: '$this.imap_functions.move_messages',
								    folder: folder,
								    msgs_number: msgs_number,
								    border_ID: border_ID,
								    sort_box_type: sort_box_type,
								    search_box_type: search_box_type,
								    sort_box_reverse: sort_box_reverse,
								    reuse_border: border_ID,
								    new_folder: new_folder,
								    new_folder_name: new_folder_name,
								    get_previous_msg: ( !not_opem_previus ? preferences.delete_and_show_previous_message : false ),
								    decoded: true } ),

				success: function( data ){
				    data = connector.unserialize( data );
				    
				    if( data )
					handler_move_msgs( data );
				},
				beforeSend: function( jqXHR, settings ){
				  	connector.showProgressBar();
			    },
			    complete: function( jqXHR, settings ){
				  	connector.hideProgressBar();
			  }

		    });
		}
		var hasFolder = false;
		$.each(fromRules, function(index, value) {
			if(value == folder){
				hasFolder = true;
				cExecute ("$this.imap_functions.removeFlagMessagesFilter&folder="+folder+"&msg_number="+msgs_number, handler_removeFlag); 
				return false;
			}
		});
		if(!hasFolder){
			handler_removeFlag();
		}
		
	}else
		write_msg(get_lang('No selected message.'));
}

function move_msgs(folder, msgs_number, border_ID, new_folder, new_folder_name, not_opem_previus) {
	move_msgs2(folder, msgs_number, border_ID, new_folder, new_folder_name,true, not_opem_previus);
}

//Caso deseja-se que não se abra a mensagem anterior independente da 
//preferencia do usuario
function move_msgs_not_previus(folder, msgs_number, border_ID, new_folder, new_folder_name) {
	move_msgs2(folder, msgs_number, border_ID, new_folder, new_folder_name,true, true);
}

function normalizeMsgNumber( msgNumber ){
  
      if (msgNumber || msgNumber == 'selected')
	  msgNumber = get_selected_messages();


      // se a aba estiver aberta e selecionada, apenas a msg da aba é movida
      if(currentTab.toString().indexOf("_r") != -1)
      {
	    //se a aba for aberta atraves de uma pesquisa
	    if(currentTab.toString().indexOf('_s') != -1)
		msgNumber = currentTab.toString().substr(0,currentTab.toString().indexOf('_s'));
	    else
		msgNumber = currentTab.toString().substr(0,currentTab.toString().indexOf('_r'));
      }
      
      if (parseInt(msgNumber) <= 0 || msgNumber.length <= 0){
	    write_msg(get_lang('No selected message.'));
	    return( false );
      }
      
      return( msgNumber );

}

function archive_search_msgs(folder_dest) {
	
	var id_msgs = "";
	id_msgs = get_selected_messages_search();
	var msg_to_arquive = "";
	var messages = "";
	var id_border = currentTab.replace(/[a-zA-Z_]+/, "");

	if ( parseInt(id_msgs) <= 0 || id_msgs.length <= 0 )
	    return write_msg(get_lang('No selected message.'));
	
	if(folder_dest=='local_root' || folder_dest==null) //Caso seja o primeiro arquivamento...
	    folder_dest = 'local_Inbox';

	id_msgs = expresso_local_messages.checkArchived( id_msgs, folder_dest );

	if( !id_msgs ){
	    write_msg( "Todas as mensagens já foram arquivadas anteriormente." );
	    return;
	}
  
	document.getElementById("overlay").style.visibility = "visible";

	var handler_arquivar_mensagens = function(data) {
	  
	    var msgs_info = [];
	  
	    for( var i = 0; i < data.length; i++ )
		msgs_info[i] = connector.unserialize( data[i] );

	    //vejo se já tinha mensagens locais
	    var h = expresso_local_messages.has_local_mails();
	    
	    expresso_local_messages.insert_mails( msgs_info, folder_dest, function( s, f ){complete_archiving( s, f, h )} );

	    document.getElementById("overlay").style.visibility = "hidden";
	}

	id_msgs =  id_msgs.split(',');
	for (i = 0; i < id_msgs.length; i++){
		var tr = Element(id_msgs[i]+'_s'+id_border);
		msg_to_arquive = (tr.getAttribute('name') == null?get_current_folder():tr.getAttribute('name'));
		messages += ','+msg_to_arquive+';'+tr.id.replace(/_[a-zA-Z0-9]+/,"");
	}
	
	$.ajax({
		  url: 'controller.php?' + $.param( {action: '$this.imap_functions.get_info_msg',
						      msg_number: messages, 
						      msg_folder: folder_dest,
						      decoded: true } ),
		  success: function( data ){
		      data = connector.unserialize( data );
		      
		      if( data )
			  handler_arquivar_mensagens( data );
		  },
		  beforeSend: function( jqXHR, settings ){
		  	connector.showProgressBar();
		  },
		  complete: function( jqXHR, settings ){
		  	connector.hideProgressBar();
		  }

	});
}


function archive_msgs(folder,folder_dest,id_msgs) {
	if(proxy_mensagens.is_local_folder(folder)) {
		write_msg(get_lang("You cant archive local mails"));
		return;
	}

	if(currentTab.toString().indexOf("_r") != -1)
        id_msgs = currentTab.toString().substr(0,currentTab.toString().indexOf("_r"));
		
    if(currentTab.toString().indexOf("_s") != -1)
		id_msgs = currentTab.toString().substr(0,currentTab.toString().indexOf("_s"));

	if(!id_msgs){
		if (currentTab != 0 && currentTab.indexOf("search_")  >= 0){
			archive_search_msgs(folder_dest);
			return;
		}else
			id_msgs = get_selected_messages();
	}	

	if ( parseInt(id_msgs) <= 0 || id_msgs.length <= 0 )
	    return write_msg(get_lang('No selected message.'));
	
	if(folder_dest=='local_root' || folder_dest==null) //Caso seja o primeiro arquivamento...
		folder_dest = 'local_Inbox';

	id_msgs = expresso_local_messages.checkArchived( id_msgs, folder_dest );

	 if( !id_msgs ){
	      write_msg( "Todas as mensagens já foram arquivadas anteriormente." );
	      return;
	  }
  
	document.getElementById("overlay").style.visibility = "visible";

	var handler_arquivar_mensagens = function(data) {
	  
	    var msgs_info = [];
	  
	    for( var i = 0; i < data.length; i++ )
		msgs_info[i] = connector.unserialize( data[i] );

	    //vejo se já tinha mensagens locais
	    var h = expresso_local_messages.has_local_mails();
	    
	    expresso_local_messages.insert_mails( msgs_info, folder_dest, function( s, f ){complete_archiving( s, f, h )} );

	    document.getElementById("overlay").style.visibility = "hidden";
	}

	$.ajax({
		  url: 'controller.php?' + $.param( {action: '$this.imap_functions.get_info_msg',
						      msg_number: id_msgs, 
						      msg_folder: folder,
						      decoded: true } ),
		  success: function( data ){
		      data = connector.unserialize( data );
		      
		      if( data )
			  handler_arquivar_mensagens( data );
		  },
		  beforeSend: function( jqXHR, settings ){
		  	connector.showProgressBar();
		  },
		  complete: function( jqXHR, settings ){
		  	connector.hideProgressBar();
		  }

	});
}

function complete_archiving( success, fails, has_local_messages_before )
{
    var msgs_to_remove = {};
    var target = mount_url_folder(["INBOX",special_folders["Trash"],'tmpMoveToLocal']);
    
    success = expresso_local_messages.select_mail( [ 'original_id', 'original_folder' ], success );

    for (var i = 0; i < success.length; i++) {
	
	var msg_info = success[i];

// 	if ( msg_info.dest_folder == target )
// 	{
// 		msg_info.msg_folder += (Date.parse(new Date));
// 	}

	//////////////// deselecionando ////////////////
	Element('chk_box_select_all_messages').checked = false;

	if ( Element("check_box_message_" + msg_info.original_id) ) 
	{
		Element("check_box_message_" + msg_info.original_id).checked = false;
	}
	if ( Element(msg_info.original_id) )
	{
		remove_className(Element(msg_info.original_id), 'selected_msg');
	}

// 	if ( tree_folders._selected.id.indexOf( 'local_' ) == 0 || msg_info.dest_folder.indexOf( target ) == 0 )
// 	{
// 		openTab.imapBox[0] = '';
// 		tree_folders.getNodeById( 'local_Inbox' )._select( );
// 		change_folder('local_Inbox','Inbox');
// 	}
	/////////////////////////////////////////////////

	//As mensagens arquivadas devem ser removidas, caso o usuario tenha isso configurado.
	msgs_to_remove[ msg_info.original_folder ] = msgs_to_remove[ msg_info.original_folder ] || [];
	msgs_to_remove[ msg_info.original_folder ].push( msg_info.original_id );
    }

    if (preferences.keep_archived_messages == 0) {
	    //Remove as mensagens
	    for( var folder in msgs_to_remove ){
		if(folder != 'undefined')
			delete_msgs(folder, msgs_to_remove[folder],'null',false,true);
	    }
    }

    if( !has_local_messages_before && expresso_local_messages.has_local_mails() )
	    ttreeBox.update_folder();
    else
	    update_menu();
}

function action_msg_selected_from_search(aba, evento){
	if(evento == "delete")
		move_search_msgs(aba,'INBOX/Trash', 'Trash', 'delete');
}

function get_all_messages_search(){
	var aba = document.getElementById('content_id_'+currentTab);
	var messages = "";
	jQuery(function() {
 	    jQuery("#"+aba.id+" tr").each(function(i, main_list) { 
				messages += main_list.id.replace(/_[a-zA-Z0-9]+/,"") + ',' ;
 	    });              
 	     
	});
	if(messages.indexOf(',') == 0)
		messages = messages.substring(1,(messages.length));
	return messages.substring(0,(messages.length-1));
}

function get_selected_messages_search(){
	var aba = document.getElementById('content_id_'+currentTab);
	var selected_messages = "";
 	    jQuery("#"+aba.id+" tr").each(function(i, main_list) { 
		var check_box = main_list.firstChild.firstChild;
			if(check_box && check_box.checked) {
				selected_messages += main_list.id.replace(/_[a-zA-Z0-9]+/,"") + ',' ;
			};
 	    });              
 	     
	if (selected_messages != ""){
		if(selected_messages.indexOf(',') == 0)
			selected_messages = selected_messages.substring(1,(selected_messages.length));
		selected_messages = selected_messages.substring(0,(selected_messages.length-1));
		return selected_messages;
	}else{
		return false;
	}
}

function get_selected_messages_search_role(){
	var aba = document.getElementById('content_id_'+currentTab);
	var selected_messages = "";
 	jQuery("#"+aba.id+" tr").each(function(i, main_list) { 
	var check_box = main_list.firstChild.firstChild;
		if(check_box && check_box.checked && check_box.id != 'chk_box_select_all_messages_search') {
			selected_messages += main_list.role + ',' ;
		};
	});              

	if (selected_messages != ""){
		if(selected_messages.indexOf(',') == 0)
			selected_messages = selected_messages.substring(1,(selected_messages.length));
		selected_messages = selected_messages.substring(0,(selected_messages.length-1));
		return selected_messages;
	}else{
		return false;
	}
}

function get_selected_messages_shortcut(){
	var main;
	try{
		main = document.getElementById("divScrollMain_"+numBox).firstChild.firstChild;
	}catch(e){
	};

	if (! main)
		main = Element("tbody_box_"+numBox);

	if (! main)
		main = Element("tbody_box");

	// Get all TR (messages) in tBody.
	var main_list = main.childNodes;
	var selected_messages_by_shortcuts = '';
	var j = 0;
	for (j; j<(main_list.length); j++)
	{

		if ( exist_className(Element(main_list[j].id), 'selected_shortcut_msg') )
		{
			selected_messages_by_shortcuts += main_list[j].id + ',';
		}

	}
	selected_messages_by_shortcuts = selected_messages_by_shortcuts.substring(0,(selected_messages_by_shortcuts.length-1));

	return selected_messages_by_shortcuts;

}

function get_selected_messages(){
	var main;
	try{
		main = document.getElementById("divScrollMain_"+numBox).firstChild.firstChild;
	}catch(e){
	};

	if (! main)
		main = Element("tbody_box_"+numBox);

	if (! main)
		main = Element("tbody_box");

	// Get all TR (messages) in tBody.
	var main_list = main.childNodes;

	var _tab_prefix = getTabPrefix();
	var selected_messages = '';
	var selected_messages_by_shortcuts = '';
	var j = 0;
	for (j; j<(main_list.length); j++)
	{

		if ( (!isNaN(parseInt(numBox))) && (numBox == 0)) { 
                        check_box = Element("check_box_message_" + main_list[j].id); 
                } else { 
                        id_mensagem = main_list[j].id.split('_'); 
						check_box = Element("search_" + numBox + "_check_box_message_" + id_mensagem[0]); 
                }        
 		                 
 		if ( (check_box) && (check_box.checked) ) 
			selected_messages += main_list[j].id + ',';

		if (preferences.use_shortcuts == '1')
		{
			if ( exist_className(Element(main_list[j].id), 'selected_shortcut_msg') )
			{
				selected_messages_by_shortcuts += main_list[j].id + ',';
			}
		}
	}
	selected_messages = selected_messages.substring(0,(selected_messages.length-1));

 		         
 		        /* Verifica se está na tela de pesquisa. */ 
 		        if(selected_messages.indexOf("_") != -1) 
 		        { 
 		                results_search_messages = selected_messages; 
 		                /* Retira a informação da aba */ 
 		                selected_messages = selected_messages.substring(0,selected_messages.indexOf("_"));
	}
	

	if (preferences.use_shortcuts == '1')
	{
		selected_messages_by_shortcuts = selected_messages_by_shortcuts.substring(0,(selected_messages_by_shortcuts.length-1));

		var array_selected_messages_by_shortcuts = selected_messages_by_shortcuts.split(",");
		var array_selected_messages = selected_messages.split(",");

		if ((array_selected_messages.length == 0) && (array_selected_messages_by_shortcuts.length > 0))
		{
			return selected_messages_by_shortcuts;
		}
	}

	if (selected_messages == '')
		return false;
	else
		return selected_messages;
}

function replaceAll(string, token, newtoken) {
	while (string.indexOf(token) != -1) {
 		string = string.replace(token, newtoken);
	}
	return string;
}

function new_message_to(email) {
	var new_border_ID = new_message('new','null');
	document.getElementById("to_" + new_border_ID).value=email;
}

function new_message(type, border_ID){
		if(RichTextEditor.editorReady === false) return false; 
 		             
 	    RichTextEditor.editorReady = false; 

		
		if (Element('show_img_link_'+border_ID))
		{
			show_msg_img(border_ID.match(/^\d*/)[0], Element('input_folder_'+border_ID).value);
		}
        var new_border_ID = draw_new_message(parseInt(border_ID.replace('_r','')));
      	
        if(typeof(openTab.type[new_border_ID]) != "undefined") {
		if(tabTypes[type] == openTab.type[new_border_ID]) {
                    if (type != 'edit')
                    {
						delete_border(currentTab);
						new_border_ID = draw_new_message(parseInt(border_ID));
                    }			
		} else {
			var a_types = {6 : get_lang("Forward"),7 : get_lang("Reply"), 
					8 : get_lang("Reply to all with history"),
					9 : get_lang("Reply without history"),
					10: get_lang("Reply to all without history")};
			if(new_border_ID != 0)
			if(!confirm(get_lang("Your message to %1 has not been saved or sent. "+
						"To %2 will be necessary open it again. Discard your message?",
						a_types[openTab.type[new_border_ID]].toUpperCase(), 
						a_types[tabTypes[type]].toUpperCase()))){
				return new_border_ID;
			} else {
				delete_border(currentTab);
				new_border_ID = draw_new_message(parseInt(border_ID));
			}
		}
	}
	if (new_border_ID == 'maximo'){
		RichTextEditor.editorReady = true;
		return false;
	}
	if (new_border_ID == false)
	{
		RichTextEditor.editorReady = true; 
 	    setTimeout('new_message(\''+type+'\',\''+border_ID+'\');',500);
		return false;
	}
	openTab.type[new_border_ID] = tabTypes[type];

	// Salva a pasta da mensagem respondida ou encaminhada:
	var folder_message = Element("input_folder_"+border_ID);
	if(folder_message) {
		var input_current_folder = document.createElement('input');
		input_current_folder.id = "new_input_folder_"+border_ID;
		input_current_folder.name = "input_folder";
		input_current_folder.type = "hidden";
		input_current_folder.value = folder_message.value;
		Element("content_id_" + new_border_ID).appendChild(input_current_folder);
	}//Fim.
	var title = '';
	data = [];

	
	if (Element("from_" + border_ID)){
		if (document.getElementById("reply_to_" + border_ID)){
				data.to = document.getElementById("reply_to_values_" + border_ID).value;
				data.to = data.to.replace(/&lt;/gi,"<");
				data.to = data.to.replace(/&gt;/gi,">");
		}
		else {
			if (document.getElementById("sender_values_"+border_ID))
			{
				data.to = document.getElementById("sender_values_"+border_ID).value;
				data.to = data.to.replace(/&lt;/gi,"<");
				data.to = data.to.replace(/&gt;/gi,">");
			}
			else if(document.getElementById("from_values_"+border_ID)) {
				data.to = document.getElementById("from_values_"+border_ID).value;
				data.to = data.to.replace(/&lt;/gi,"<");
				data.to = data.to.replace(/&gt;/gi,">");
			}
		}
		if (document.getElementById("to_values_" + border_ID)){
			data.to_all = document.getElementById("to_values_" + border_ID).value;
			data.to_all_alternative = document.getElementById("user_email_alternative").value;
			data.to_all = data.to_all.replace(/\n/gi," ");
			data.to_all = data.to_all.replace(/&lt;/gi,"<");
			data.to_all = data.to_all.replace(/&gt;/gi,">");
			var _array_to_all = data.to_all.split(",");
			var _array_to_alternative = data.to_all_alternative.split(",");
		}
	}
	if (document.getElementById("cc_" + border_ID)){
		data.cc = document.getElementById("cc_values_" + border_ID).value;
		data.cc = data.cc.replace(/&lt;/gi,"<");
		data.cc = data.cc.replace(/&gt;/gi,">");
		var _array_cc = data.cc.split(",");
	}
	if (document.getElementById("cco_" + border_ID)){
		data.cco = document.getElementById("cco_values_" + border_ID).value;
		data.cco = data.cco.replace(/&lt;/gi,"<");
		data.cco = data.cco.replace(/&gt;/gi,">");
	}
	if ($("#subject_" + border_ID))
		data.subject = $("#subject_" + border_ID).text();
	if(data.subject == get_lang("(no subject)   "))
		data.subject = '';
	if (document.getElementById("body_" + border_ID))
		data.body = document.getElementById("body_" + border_ID).innerHTML;
	if (Element('date_' + border_ID)){
		data.date = Element('date_' + border_ID).innerHTML;
	}
	if (Element('date_day_' + border_ID)){
		data.date_day = Element('date_day_' + border_ID).value;
	}
	if (Element('date_hour_' + border_ID)){
		data.date_hour = Element('date_hour_' + border_ID).value;
	}
        
	var signature = RichTextEditor.getSignatureDefault();
        
	if(type!="new" && type!="edit" && document.getElementById("is_local_"+border_ID) != null)
		data.is_local_message = (document.getElementById("is_local_"+border_ID).value=="1")?true:false;
		
	if(typeof($.fn.elastic) == "undefined"){
		$.lazy({
			src: '../prototype/plugins/jquery-elastic/jquery.elastic.source.js',
			name: 'elastic'
		});
	}
	var content = $("#content_id_"+new_border_ID);

	
switch(type){
		case "reply_without_history":
			RichTextEditor.replyController = true; //Seta o editor como modo reply
			content.find('[name="input_to"]').val(data.to);			
			
			draw_reply_boxes_by_field("to", data.to, content);
			
			title = "Re: " + html_entities(data.subject);
			content.find(".subject").val("Re: " + data.subject);			
			useOriginalAttachments(new_border_ID,border_ID);
			content.find('[name="msg_reply_from"]').val($("#msg_number_" + border_ID).val());			

			// Insert the signature automaticaly at message body if use_signature preference is set
			if (preferences.use_signature == "1"){  
				RichTextEditor.setInitData(new_border_ID,'<div><br type="_moz"></div>' + signature ,true) ;      
			} 
			break;
		case "reply_with_history":

			RichTextEditor.replyController = true; //Seta o editor como modo reply 
			title = "Re: " + html_entities(data.subject);
			content.find(".subject").val("Re: " + data.subject);
			content.find('[name="input_to"]').val(data.to);
			
			draw_reply_boxes_by_field("to", data.to, content);
			
			content.find('[name="msg_reply_from"]').val($("#msg_number_" + border_ID).val());	

			block_quoted_body = make_body_reply(data.body, data.to, data.date_day, data.date_hour);
			
			useOriginalAttachments(new_border_ID,border_ID);
			
			// Insert the signature automaticaly at message body if use_signature preference is set
			if (preferences.use_signature == "1"){  
				RichTextEditor.setInitData(new_border_ID, '<div><br type="_moz"></div>' + signature + '<div><br type="_moz"></div>' + block_quoted_body,true); 				
			}else{
				RichTextEditor.setInitData(new_border_ID,'<div><br type="_moz"></div>'+ block_quoted_body,true);
			}
			break;
		case "reply_to_all_without_history":
			RichTextEditor.replyController = true; //Seta o editor como modo reply
			// delete user email from to_all array.
			data.to_all = new Array();
			data.to_all = removeUserEmail(_array_to_all);
			data.to_all = removeAlternative(data.to_all,_array_to_alternative);
			content.find('[name="msg_reply_from"]').val($("#msg_number_" + border_ID).val());	

			data.to_all = data.to_all.join(",");

			title = "Re: " + html_entities(data.subject);
			content.find(".subject").val("Re: " + data.subject);
			
			if (data.to.indexOf(Element("user_email").value) > 0 ){
				draw_reply_boxes_by_field("to", data.to_all, content);
				content.find('[name="input_to"]').val(data.to_all);
			}else{
				draw_reply_boxes_by_field("to", data.to + ',' + data.to_all, content);
				content.find('[name="input_to"]').val(data.to + ',' + data.to_all);
			}
			
			if (data.cc){
				data.cc = new Array();
				data.cc = removeUserEmail(_array_cc);
				data.cc = removeAlternative(data.cc,_array_to_alternative);
					if (data.cc != get_lang("undisclosed-recipient"))
						data.cc = data.cc.join(",");
					else
						data.cc = "";	
				if(data.cc != ""){
					content.find('[name="input_cc"]').val(data.cc);
					input_binds(content.find('[name="input_cc"]').parent(), new_border_ID);
					content.find(".cc-tr").show();//cc-button
					//document.getElementById("a_cc_link" + new_border_ID).value = data.cc;
					content.find(".cc-button").toggleClass("expressomail-button-icon-ative");
					content.find(".cc-button").find("span").html("Remover CC");
					draw_reply_boxes_by_field("cc", data.cc, content);
				}
			}
                        
			useOriginalAttachments(new_border_ID,border_ID);  
			if (preferences.use_signature == "1"){  
				RichTextEditor.setInitData(new_border_ID,'<div><br type="_moz"></div>' + signature,true);
			}
				
			break;
		case "reply_to_all_with_history":
			RichTextEditor.replyController = true; //Seta o editor como modo reply 
			//delete user email from to_all array.
			data.to_all = new Array();
			data.to_all = removeUserEmail(_array_to_all);
			data.to_all = removeAlternative(data.to_all,_array_to_alternative);
			content.find('[name="msg_reply_from"]').val($("#msg_number_" + border_ID).val());
		
			if (data.to_all != get_lang("undisclosed-recipient"))
				data.to_all = data.to_all.join(",");
			else
				data.to_all = "";
			
			title = "Re: " + html_entities(data.subject);
			
			if (data.to.indexOf(Element("user_email").value) > 0 ){
				draw_reply_boxes_by_field("to", data.to_all, content);
				content.find('[name="input_to"]').val(data.to_all);
			}else{
				draw_reply_boxes_by_field("to", data.to + ',' + data.to_all, content);
				content.find('[name="input_to"]').val(data.to + ',' + data.to_all);			
			}
			
			if (data.cc){
				data.cc = new Array();
				data.cc = removeUserEmail(_array_cc);
				data.cc = removeAlternative(data.cc,_array_to_alternative);
					if (data.cc != get_lang("undisclosed-recipient"))
						data.cc = data.cc.join(",");
					else
						data.cc = "";			
				if(data.cc != ""){
					content.find('[name="input_cc"]').val(data.cc);
					input_binds(content.find('[name="input_cc"]').parent(), new_border_ID);
					content.find(".cc-tr").show();
					content.find(".cc-button").toggleClass("expressomail-button-icon-ative");
					content.find(".cc-button").find("span").html("Remover CC");
					
					draw_reply_boxes_by_field("cc", data.cc, content);
				}
			}
			content.find(".subject").val("Re: " + data.subject);
			
			block_quoted_body = make_body_reply(data.body, data.to, data.date_day, data.date_hour);
			
			useOriginalAttachments(new_border_ID,border_ID);
			
			if (preferences.use_signature == "1"){  
				RichTextEditor.setInitData(new_border_ID,'<div><br type="_moz"></div><div><br type="_moz"></div>' + signature + '<div><br type="_moz"></div>'+ block_quoted_body,true); 
			}else{                
				RichTextEditor.setInitData(new_border_ID,block_quoted_body,true); 
			}
				
			break;
		case "forward":
			title = "Fw: " + html_entities(data.subject);
			content.find(".subject").val("Fw: " + data.subject);
			var divFiles = Element("divFiles_"+new_border_ID);
			var campo_arquivo;
			content.find('[name="msg_forward_from"]').val($("#msg_number_" + border_ID).val());
                  
			if (Element("attachments_" + border_ID))
                            addOriginalAttachments(new_border_ID,border_ID);
			
			// Insert the signature automaticaly at message body if use_signature preference is set
			if (preferences.use_signature == "1"){ 
				$("#body_"+new_border_ID).val('<div><br type="_moz"></div><div><br type="_moz"></div>' + signature + '<div><br type="_moz"></div>'+ make_forward_body(data.body, data.to, data.date, data.subject, data.to_all, data.cc));
 		        RichTextEditor.setInitData(new_border_ID,'<div><br type="_moz"></div>' + signature + '<div><br type="_moz"></div>'+ make_forward_body(data.body, data.to, data.date, data.subject, data.to_all, data.cc)); 
				content.find(".to").focus();
			}
			else{   
				RichTextEditor.setInitData(new_border_ID,make_forward_body(data.body, data.to, data.date, data.subject, data.to_all, data.cc));   
				$("#body_"+new_border_ID).val('<div><br type="_moz"></div><div><br type="_moz"></div>'+make_forward_body(data.body, data.to, data.date, data.subject, data.to_all, data.cc));
				content.find(".to").focus();
			}

			break;
		case "new":
			title = get_lang("New Message");
			if(Element('msg_number').value) {
				var _to = Element('msg_number').value;
				var reEmail = /^[A-Za-z\d_-]+(\.[A-Za-z\d_-]+)*@(([A-Za-z\d][A-Za-z\d-]{0,61}[A-Za-z\d]\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])$/;
				if(!reEmail.test(_to)){
					var array_contacts = contacts.split(',');
					for(i = 0; i < array_contacts.length;i++) {
						if(array_contacts[i].lastIndexOf(_to) != "-1"){
							var _group = array_contacts[i].split(";");
							_to = '"'+_group[0]+'" <'+_group[1]+'>';
							break;
						}
					}
				}
				content.find('[name="input_to"]').val(_to +',');
				draw_email_box(_to, content.find(".to").filter("input"));
				Element('msg_number').value = '';
			}
			
			// Insert the signature automaticaly at message body if use_signature preference is set
			 if (preferences.use_signature == "1"){ 
				$("#body_"+new_border_ID).val('<div><br type="_moz"></div><div><br type="_moz"></div>' + signature);
				RichTextEditor.setInitData(new_border_ID, '<div><br type="_moz"></div>' + signature);
				content.find(".to").focus();
			 }
			 else
			   content.find('[name="input_to"]').focus(); 
			break;
		case "edit":
			openTab.imapBox[new_border_ID] = folder_message.value;
			document.getElementById('font_border_id_'+new_border_ID).innerHTML = data.subject;
			title = "Edição: "+ html_entities(data.subject);
			
			data.to = Element("to_values_" + border_ID).value;
			if( data.to != get_lang("without destination") ) {
				data.to = data.to.replace(/&lt;/gi,"<");
				data.to = data.to.replace(/&gt;/gi,">");
			} else {
				data.to = "";
			}

			draw_reply_boxes_by_field("to", data.to, content);
			
			content.find('[name="input_to"]').val(data.to);
			if (data.cc){
				data.cc = data.cc.replace(/&lt;/gi,"<");
				data.cc = data.cc.replace(/&gt;/gi,">");
				content.find('[name="input_cc"]').val(data.cc);
				input_binds(content.find('[name="input_cc"]').parent(), new_border_ID);
				content.find(".cc-tr").show();
				content.find(".cc-button").toggleClass("expressomail-button-icon-ative");
				content.find(".cc-button").find("span").html(get_lang('Remove CC'));
				draw_reply_boxes_by_field("cc", data.cc, content);
			}
			if (data.cco){
				if(content.find('[name="input_cco"]').length){
					content.find('[name="input_cco"]').val(data.cco);
					content.find(".cco-tr").show();
					content.find(".cco-button").toggleClass("expressomail-button-icon-ative");
					content.find(".cco-button").find("span").html(get_lang('Remove CCo'));
					input_binds(content.find('[name="input_cco"]').parent(), new_border_ID);
					draw_reply_boxes_by_field("cco", data.cco, content);
				}
			}
			content.find(".subject").val(data.subject);
			
			if( $("#disposition_notification_" + border_ID).length ){
				content.find('[name="input_return_receipt"]').attr("checked", true);
				content.find(".return-recept").toggleClass("expressomail-button-icon-ative");
				//Element("return_receipt_" + new_border_ID).checked = true;
			}

			var element_important_message = Element("important_message_" + new_border_ID);
			if(element_important_message) {
					
				if($("#disposition_important_" + border_ID).length){
					content.find('[name="input_important_message"]').attr("checked", true);
					content.find(".important").toggleClass("expressomail-button-icon-ative");	
				}
			}

			if (Element("attachments_" + border_ID))
				addOriginalAttachments(new_border_ID,border_ID);
			RichTextEditor.setInitData(new_border_ID, data.body, 'edit');
			
			uidsSave[new_border_ID].push(new_border_ID);
			close_delete(border_ID);
			
			break;
		default:
	}
	
	content.find('[name="input_to"]').trigger("update");	
	var txtarea = $('#body_'+new_border_ID);
	var height = document.body.scrollHeight - 330;
	txtarea.css("overflowY","auto");
	txtarea.css("height",height);
	$("#border_id_" + new_border_ID).attr("title", title);
	set_border_caption("border_id_" + new_border_ID, title);
	resizeWindow();
	return new_border_ID; //Preciso retornar o ID da nova mensagem.
}

//DESENHA OS RETANGULOS PARA OS E-MAIL NA OPÇÃO REPLY
function draw_reply_boxes_by_field(field, value, context){
	array = value.split(",");
	$.each(array, function(index, value){
		draw_email_box(value, context.find("."+field).filter("input"));
	});
}

//Remove o email do usuario ao responder a todos
function removeUserEmail(emailList){
      var userEmail = Element("user_email").value;
      var array_emails = Array();
      var j = 0;
      for (var i=0;i<emailList.length;i++){
			if (emailList[i].indexOf(userEmail) < 0){
			   array_emails[j++] = emailList[i];
			}
	  }  
 return array_emails;
}

//Remove os emails alternativos ao responder a todos
function removeAlternative(value_to_all, _array_to_alternative){
	for(i = 0; i < _array_to_alternative.length; i++) {
		for(k = 0; k < value_to_all.length; k++){
			if(value_to_all[k].match(/<([^<]*)>[\s]*$/)){
				if(value_to_all[k].match(/<([^<]*)>[\s]*$/)[1].toLowerCase() == _array_to_alternative[i].toLowerCase()){
					value_to_all.splice( k , 1);
					k--;
				}
			}else if(value_to_all[k].replace(/^\s+|\s+$/g,"").toLowerCase() == _array_to_alternative[i].toLowerCase()){
					value_to_all.splice( k , 1);
					k--;
			}
		}
	}
	return value_to_all;
}

function useOriginalAttachments(new_border_ID,old_id_border)
{   
	if (Element("attachments_" + old_id_border))
        {
                var fileUploadMSG = $('#fileupload_msg'+new_border_ID);         
                var attachments = document.getElementById("attachments_" + old_id_border).getElementsByTagName("a");	
                var imagens = block_quoted_body.match(/<img[^>]*>/g);
		var arrayAttachments = [];
		var arrayAttachmentsA = [];
		
		//-------------------
		    for (var i = 0; i < attachments.length; i++){
                            if((attachments[i].tagName=="SPAN") || (attachments[i].tagName=="IMG") || ((attachments[i].href.indexOf("javascript:download_local_attachment")==-1)&&(attachments[i].href.indexOf("javascript:download_attachments")==-1)))
                                    continue;

                                var arrayAtt = attachments[i].href.replace("javascript:download_attachments(", "").replace(")", "").split(',');                                 
                                var att = new Object();
                                var regex = new RegExp( "'", "g" );
                                att.folder = arrayAtt[0].replace(regex,"");
                                att.uid = arrayAtt[1].replace(regex,"");
                                att.part = arrayAtt[3].replace(regex,"");
                                att.type = 'imapPart';
				var idATT = JSON.stringify(att);
				
				if(block_quoted_body.indexOf('src="./inc/get_archive.php?msgFolder='+att.folder+'&amp;msgNumber='+att.uid+'&amp;indexPart='+att.part+'"') !== -1)
				{
				    addAttachment( new_border_ID , idATT);  

				    var attach = {};
				    attach.fileName =  attachments[i].text.substring(0, attachments[i].text.lastIndexOf('('));

				    if(attach.fileName.length > 45)
					attach.fileName = attach.fileName.substr(0, 32) + " ... " + attach.fileName.substr(attach.fileName.length-9, attach.fileName.length);

				    attach.fileSize =  attachments[i].text.substring(( attachments[i].text.lastIndexOf('(')+1), attachments[i].text.lastIndexOf(')'));

				    var upload = $(DataLayer.render("../prototype/modules/mail/templates/attachment_add_itemlist.ejs", {file : attach}));
				    upload.find('.status-upload').remove();
				    upload.find('.in-progress').remove(); 
				    upload.append('<input type="hidden" name="fileId[]" value=\''+idATT+'\'/>');
				    upload.find('.button.close').button({
					    icons: {
						    primary: "ui-icon-close"
					    },
					    text: false

				    }).click(function(){
					    var idAttach = $(this).parent().find('input[name="fileId[]"]').val();
					    var content_body = RichTextEditor.getData('body_'+new_border_ID);
					    var imagens = content_body.match(/<img[^>]*>/g);
					    var att = JSON.parse(idAttach);
					    if(imagens != null)
					    {   
						for (var x = 0; x < imagens.length; x++)
						    if(imagens[x].indexOf('src="./inc/get_archive.php?msgFolder='+att.folder+'&amp;msgNumber='+att.uid+'&amp;indexPart='+att.part) !== -1)
							content_body = content_body.replace(imagens[x],'');

						RichTextEditor.setData('body_'+new_border_ID,content_body);    
					    }       

					    fileUploadMSG.find('.attachments-list').find('input[value="'+idAttach+'"]');
					    delAttachment(new_border_ID,idAttach); 
					    $(this).parent().remove();
				    });

				    fileUploadMSG.find('.attachments-list').append(upload);
				}
				else
				{   
				    arrayAttachments.push(idATT);
				    arrayAttachmentsA.push(attachments[i]);
				}
                    }
		//-------------------
		
		if(arrayAttachments.length > 0)
		{
		
		    var orignialAtt = fileUploadMSG.find('.button-files-upload').append(' <button tabindex="-1" class="message-add-original-att button small">Anexar arquivos originais</button>').find(".message-add-original-att").button();
		    orignialAtt.click(function(event ){

			for (var i = 0; i < arrayAttachments.length; i++){

				    var att = JSON.parse(arrayAttachments[i]);
				    addAttachment( new_border_ID , arrayAttachments[i]);  

				    var attach = {};
				    attach.fileName =  arrayAttachmentsA[i].text.substring(0, arrayAttachmentsA[i].text.lastIndexOf('('));

				    if(attach.fileName.length > 45)
					attach.fileName = attach.fileName.substr(0, 32) + " ... " + attach.fileName.substr(attach.fileName.length-9, attach.fileName.length);

				    attach.fileSize =  arrayAttachmentsA[i].text.substring(( arrayAttachmentsA[i].text.lastIndexOf('(')+1), arrayAttachmentsA[i].text.lastIndexOf(')'));

				    var upload = $(DataLayer.render("../prototype/modules/mail/templates/attachment_add_itemlist.ejs", {file : attach}));
				    upload.find('.status-upload').remove();
				    upload.find('.in-progress').remove(); 
				    upload.append('<input type="hidden" name="fileId[]" value=\''+arrayAttachments[i]+'\'/>');
				    upload.find('.button.close').button({
					    icons: {
						    primary: "ui-icon-close"
					    },
					    text: false

				    }).click(function(){
					    var idAttach = $(this).parent().parent().find('input[name="fileId[]"]').val();
					    var content_body = RichTextEditor.getData('body_'+new_border_ID);
					    var imagens = content_body.match(/<img[^>]*>/g);
					    var att = JSON.parse(idAttach);
					    if(imagens != null)
					    {   
						for (var x = 0; x < imagens.length; x++)
						    if(imagens[x].indexOf('src="./inc/get_archive.php?msgFolder='+att.folder+'&amp;msgNumber='+att.uid+'&amp;indexPart='+att.part) !== -1)
							content_body = content_body.replace(imagens[x],'');

						RichTextEditor.setData('body_'+new_border_ID,content_body);    
					    }       

					    fileUploadMSG.find('.attachments-list').find('input[value="'+idAttach+'"]');
					    delAttachment(new_border_ID,idAttach); 
					    $(this).parent().remove();
				    });

				    fileUploadMSG.find('.attachments-list').append(upload);

			}

		    $(this).remove();
		    });
		}

         }
                
}

function addOriginalAttachments(new_border_ID,old_id_border)
{   
    var fileUploadMSG = $('#fileupload_msg'+new_border_ID);
    var attachments = $("#attachments_" + old_id_border).find("a");			
    for (var i = 0; i < attachments.length; i++){
            if((attachments[i].tagName=="SPAN") || (attachments[i].tagName=="IMG") || ((attachments[i].href.indexOf("javascript:download_local_attachment")==-1)&&(attachments[i].href.indexOf("javascript:download_attachments")==-1)))
                    continue;

                var arrayAtt = attachments[i].href.replace("javascript:download_attachments(", "").replace(")", "").split(',');                                 
                var att = new Object();
                var regex = new RegExp( "'", "g" );
                att.folder = arrayAtt[0].replace(regex,"");
                att.uid = arrayAtt[1].replace(regex,"");
                att.part = arrayAtt[3].replace(regex,"");
                att.type = 'imapPart';
                var idATT = JSON.stringify(att);
                addAttachment( new_border_ID , idATT);  

                var attach = {};
                attach.fileName =  attachments[i].text.substring(0, attachments[i].text.lastIndexOf('('));

                if(attach.fileName.length > 45)
                    attach.fileName = attach.fileName.substr(0, 32) + " ... " + attach.fileName.substr(attach.fileName.length-9, attach.fileName.length);

                attach.fileSize =  attachments[i].text.substring(( attachments[i].text.lastIndexOf('(')+1), attachments[i].text.lastIndexOf(')'));

                var upload = $(DataLayer.render("../prototype/modules/mail/templates/attachment_add_itemlist.ejs", {file : attach}));
                upload.find('.status-upload').remove();
                upload.find('.in-progress').remove(); 
                upload.find('.button.close').button({
                        icons: {
                                primary: "ui-icon-close"
                        },
                        text: false
                }).click(function(){
                        var idAttach = $(this).parent().find('input[name="fileId[]"]').val();
                        var content_body = RichTextEditor.getData('body_'+new_border_ID);
                        var imagens = content_body.match(/<img[^>]*>/g);
                        var att = JSON.parse(idAttach);
                        if(imagens != null)
                        {   
                            for (var x = 0; x < imagens.length; x++)
                                if(imagens[x].indexOf('src="./inc/get_archive.php?msgFolder='+att.folder+'&amp;msgNumber='+att.uid+'&amp;indexPart='+att.part) !== -1)
                                    content_body = content_body.replace(imagens[x],'');

                             RichTextEditor.setData('body_'+new_border_ID,content_body);    
                        }       

                        fileUploadMSG.find(' .attachments-list').find('input[value="'+idAttach+'"]');
                        delAttachment(new_border_ID,idAttach); 
                        $(this).parent().remove();
                });	


                upload.find("p").append('<input type="hidden" name="fileId[]" value=\''+idATT+'\'/>');
                fileUploadMSG.find('.attachments-list').append(upload);

    }	                
}

function send_message_return(data, ID){
	
	if (typeof(data) == 'object' && data.load){
		cExecute("$this.imap_functions.get_folders_list&onload=true", update_menu);
	}
	watch_changes_in_msg(ID);

	var content = $("#content_id_"+ID);
	var sign = false;
	var crypt = false;
	var reComplexEmail = /<([^<]*)>[\s]*$/;
	if ((preferences.use_assinar_criptografar != '0') && (preferences.use_signature_digital_cripto != '0')){
		var checkSign = document.getElementById('return_digital_'+ID)
		if (checkSign.checked){
			sign = true;
		}

		var checkCript = document.getElementById('return_cripto_'+ID);
		if (checkCript.checked){
			crypt = true;
		}
	}

	if (typeof(data) == 'object' && !data.success)
	{
		connector = new  cConnector();

		if (sign || crypt){
			var operation = '';
			if (sign){
				operation = 'sign';
			}
			else { // crypt
				//TODO: Colocar mensagem de erro, e finalizar o método.
				operation = 'nop';
			}
		}

		if (data.body){
			Element('cert_applet').doButtonClickAction(operation, ID, data.body);
		}
		else {
			alert(data.error);
		}

		return;
	}
	if(data && data.success == true ){
		// if send ok, set a flag as answered or forwarded
		var msg_number_replied = content.find('[name="msg_reply_from"]');
		var msg_number_forwarded = content.find('[name="msg_forward_from"]');

		if (msg_number_replied.val()){
			proxy_mensagens.proxy_set_message_flag(msg_number_replied.val(), 'answered');
		}
		else if (msg_number_forwarded.val()){
			proxy_mensagens.proxy_set_message_flag(msg_number_forwarded.val(), 'forwarded');
		}
		if(expresso_offline){
			write_msg(get_lang('Your message was sent to queue'));
			delete_border(ID,'true');
			return;
		}else{
			if (wfolders.alert) {
				write_msg(get_lang('Your message was sent and save.'));
				wfolders.alert = false;
			}
			else {
				write_msg(get_lang('Your message was sent.'));
			}
		}
		
		$
		//REFAZER ISTO COM UMA CHAMADA ASSINCRONA PARA REGISTRAR E ATUALIZAR A LISTA DOS NOVOS CONTATOS DINAMICOS
		// If new dynamic contacts were added, update the autocomplete ....
		/*if(data.new_contacts){
			var ar_contacts = data.new_contacts.split(',;');
			for(var j in ar_contacts){
				// If the dynamic contact don't exist, update the autocomplete....
				if((contacts+",").indexOf(";"+ar_contacts[j]+",") == -1)
					contacts += ",;" + ar_contacts[j];
			}
		}
		var dynamicPersonalContacts = new Array();
		var dynamicPersonalGroups = new Array();
		var dynamicContacts = new Array();
		var dynamicContactList = new Array();

		*/
		delete_border(ID,'true');
		var arrayTo = content.find(".to-tr").find(".box").clone();
		save_dynamic_contacts(arrayTo);
		var arrayCC = content.find(".cc-tr").find(".box").clone();
		save_dynamic_contacts(arrayCC);
		var arrayCCo = content.find(".cco-tr").find(".box").clone();
		save_dynamic_contacts(arrayCCo);
		cache = new Array();
 	}
	else{
		if(data == 'Post-Content-Length')
			write_msg(get_lang('The size of this message has exceeded  the limit (%1B).',Element('upload_max_filesize').value));
		else if(data){
			var error_mail = $.trim(data.split(":")[data.split(":").length-1]);
			var array = content.find(".to-tr").find(".box");
			//$(value).find("input").val()
			$.each(array, function(index, value){
				if(error_mail == $(value).find("input").val().match(reComplexEmail)[1])
					$(value).addClass("invalid-email-box");
			});
			if ( content.find('[name="input_cco"]').length){
				if(content.find(".cco-tr").css("display") != "none"){
					var array = content.find(".cco-tr").find(".box");
					$.each(array, function(index, value){
						if(error_mail == $(value).find("input").val().match(reComplexEmail)[1])
							$(value).addClass("invalid-email-box");
					});
				}
			}
			if(content.find(".cc-tr").css("display") != "none")
			{
				var array = content.find(".cc-tr").find(".box");
				$.each(array, function(index, value){
					if(error_mail == $(value).find("input").val().match(reComplexEmail)[1])
						$(value).addClass("invalid-email-box");
				});				
			} 
			write_msg(data);
		}else
			write_msg(get_lang("Connection failed with %1 Server. Try later.", "Web"));
		
		var save_link = $("#content_id_"+ID).find(".save")[0];
		save_link.onclick = function onclick(event) {openTab.toPreserve[ID] = true;save_msg(ID);} ;
		$("#save_message_options_"+ID).button({disabled: false});
		//save_link.className = 'message_options';
	}
	if(!expresso_offline)
		connector.hideProgressBar();
}

/*Função que grava o destinatário nos contatos dinâmicos*/
function save_dynamic_contacts(array){
	if(parseInt(preferences.use_dynamic_contacts)){
		
		$.each(array, function(i, value){
			var stop = false;
			$.each(dynamicPersonalContacts, function(x, valuex){
				if(valuex.email == $(value).find("input").val().match(reComplexEmail)[1]){
					stop = true;
					return false;
				}
			});
			if(!stop){
				var exist = 0;
				$.each(dynamicContacts, function(x, valuex){
					if(valuex.mail == $(value).find("input").val().match(reComplexEmail)[1]){
						exist = valuex.id;
						return false;
					}
				});
				if(exist){
					REST.put("/dynamiccontact/"+exist, {name: $(value).find("input").val().split('"')[1], mail:$(value).find("input").val().match(reComplexEmail)[1]});
				}else{
					REST.post("/dynamiccontacts", {name: $(value).find("input").val().split('"')[1], mail:$(value).find("input").val().match(reComplexEmail)[1]});
				}
			}
		});
		updateDynamicContact();
	}
}

/**
 * Método chamado pela applet para retornar o resultado da assinatura/decifragem do e-mail.
 * para posterior envio ao servidor.
 * @author Mário César Kolling <mario.kolling@serpro.gov.br>, Bruno Vieira da Costa <bruno.vieira-costa@serpro.gov.br>
 * @param smime O e-mail decifrado/assinado
 * @param ID O ID do e-mail, para saber em que aba esse e-mail será mostrado.
 * @param operation A operação que foi realizada pela applet (assinatura ou decifragem)
 */
function appletReturn(smime, ID, operation, folder){

	if (!smime){ // Erro aconteceu ao assinar ou decifrar e-mail
		connector = new  cConnector();
		connector.hideProgressBar();
		return;
	}

	if(operation=='decript')
	{
		var handler = function(data){

			if(data.msg_day == '')
			{
				header=expresso_local_messages.get_msg_date(data.original_ID, proxy_mensagens.is_local_folder(get_current_folder()));

				data.fulldate=header.fulldate;
				data.smalldate=header.smalldate;
				data.msg_day = header.msg_day;
				data.msg_hour = header.msg_hour;

                      }
			this.show_msg(data);
		}
		para="&source="+smime+"&ID="+ID+"&folder="+folder;
		cExecute ("$this.imap_functions.show_decript&", handler, para);
	}else
	{
		ID_tmp = ID;
		// Lê a variável e chama a nova função cExecuteForm
		// Processa e envia para o servidor web
		// Faz o request do connector novamente. Talvez implementar no connector
		// para manter coerência.

		var handler_send_smime = function(data){
			send_message_return(data, this.ID_tmp); // this is a hack to escape quotation form connector bug
		};

		var textArea = document.createElement("TEXTAREA");
		textArea.style.display='none';
		textArea.id = 'smime';
		textArea.name = "smime";
		textArea.value += smime;

		// Lê a variável e chama a nova função cExecuteForm
		// Processa e envia para o servidor web
		// Faz o request do connector novamente. Talvez implementar no connector
		// para manter coerência.
		if (is_ie){
			var i = 0;
			while (document.forms(i).name != "form_message_"+ID){i++}
			form = document.forms(i);
		}
		else
			form = document.forms["form_message_"+ID];

		form.appendChild(textArea);

		cExecuteForm ("$this.imap_functions.send_mail", form, handler_send_smime, ID);
	}
}

function send_message(ID, folder, folder_name){
     if(!zebraDiscardEventDialog && $('#fileupload_msg'+ID).find('.in-progress').length )
     {
         zebraDiscardEventDialog = true;
         window.setTimeout(function() {
         $.Zebra_Dialog('Existem anexos sendo enviados para o servidor. Caso envie sua mensagem agora estes arquivos serão perdidos.', {
                    'type':     'question',
                    'overlay_opacity': '0.5',
                    'buttons':  ['Descartar anexos e enviar', 'Continuar editando e esperar anexos'],
                    'width' : 500,
                    'onClose':  function(clicked) {
                            if(clicked == 'Descartar anexos e enviar' ) 
                              send_valided_message(ID, folder, folder_name);

                            window.setTimeout(function() {
                                    zebraDiscardEventDialog = false;
                            }, 500);
                    }
             })
          }, 300); 

     }
     else
       send_valided_message(ID, folder, folder_name);     
}

function send_valided_message(ID, folder, folder_name)
{ 
	if (preferences.auto_save_draft == 1)
	   autoSaveControl.status[ID] = true;
	var content = $("#content_id_"+ID);
	var save_link = $("#content_id_"+ID).find(".save");
	var onClick = save_link.onclick;
	save_link.onclick = '';
	save_link.button({disabled: true});

	ID_tmp = ID;

	var handler_send_message = function(data){
		send_message_return(data, this.ID_tmp); // this is a hack to escape quotation form connector bug
	};

        var mail_as_plain = document.getElementById( 'textplain_rt_checkbox_' + ID );
	mail_as_plain = ( mail_as_plain ) ? mail_as_plain.checked : false;

       var content_body  = RichTextEditor.getData('body_'+ID);        
	var textArea = document.createElement("TEXTAREA");
	textArea.style.display='none';
	textArea.name = "body";
	textArea.value = content_body;
   
	var input_folder = document.createElement("INPUT");
	input_folder.style.display='none';
	input_folder.name = "folder";
	input_folder.value = folder;      
	
	var input_type = document.createElement("INPUT"); 
	input_type.style.display='none'; 
	input_type.name = "type"; 
	input_type.value = RichTextEditor.plain[ID] ? 'plain' : 'html'; 
	
        var uids = document.createElement("INPUT");
	uids.style.display='none';
	uids.name = "uids_save";
	uids.value = uidsSave[ID].toString();
        
        var save_folder = document.createElement("INPUT");
	save_folder.style.display='none';
	save_folder.name = "save_folder";
	save_folder.value = (openTab.imapBox[ID] && openTab.type[ID] < 6) ? openTab.imapBox[ID]: "INBOX" + cyrus_delimiter + draftsfolder;
        
        var msg_attachments = document.createElement("INPUT");
	msg_attachments.style.display='none';
	msg_attachments.name = "attachments";
	msg_attachments.value = listAttachment(ID);

	if (is_ie){
		var i = 0;
		while (document.forms(i).name != "form_message_"+ID){i++}
		form = document.forms(i);
	}
	else
		form = document.forms["form_message_"+ID];

		// Evita que e-mails assinados sejam enviados quando o usuário tenta enviar um e-mail
		// não assinado (desmarcou a opção) após tentar enviar um e-mail assinado que não passou
		// no teste de validação.
		var checkSign = document.getElementById('return_digital_'+ID);
		if (checkSign && !checkSign.checked){
			var smime = Element('smime');
			if (smime)
			{
				var parent = smime.parentNode;
				parent.removeChild(smime);
			}
		 }

	form.appendChild(textArea);
	form.appendChild(input_folder);
    form.appendChild(input_type);
	// Implementação do In_Reply_To e References
	var msgId = document.createElement("INPUT");
	msgId.style.display = 'none';
	msgId.name = 'messageNum';
	msgId.value = currentTab;

	form.appendChild(msgId);
    form.appendChild(save_folder);
    form.appendChild(uids);
	form.appendChild(msg_attachments);

        var mail_type = document.createElement('input');
	mail_type.setAttribute('type', 'hidden');
	mail_type.name = 'type';
	mail_type.value = ( mail_as_plain ) ? 'plain' : 'html';
        form.parentNode.appendChild(mail_type);

	var _subject = trim(content.find(".subject").val());
	if((_subject.length == 0) && !confirm(get_lang("Send this message without a subject?"))) {
		save_link.click(onClick);
		content.find(".subject").focus();
		return;
	}
	//stringEmail = content.find('[name="input_to"]').val();
	var stringEmail = "";
	var array = content.find(".to-tr").find(".box");
	$.each(array, function(index, value){
		stringEmail += $(value).find("input").val() + ",";
	});
	content.find('[name="input_to"]').val(stringEmail);
	if ( content.find('[name="input_cco"]').length){
		if(content.find(".cco-tr").css("display") != "none"){
			var array = content.find(".cco-tr").find(".box");
			$.each(array, function(index, value){
				stringEmail += $(value).find("input").val() + ",";
			});
			content.find('[name="input_cco"]').val(stringEmail);
		}
	}
			
	if(content.find(".cc-tr").css("display") != "none")
	{
		var array = content.find(".cc-tr").find(".box");
		$.each(array, function(index, value){
			stringEmail += $(value).find("input").val() + ",";
		});
		content.find('[name="input_cc"]').val(stringEmail);
	}
		
	if (expresso_offline) {
		
		var invalidEmail = searchEmail(stringEmail);
		if(content.find('[name="input_to"]').val()=="" && content.find('[name="input_cco"]').val()=="" && content.find('[name="input_cc"]').val()=="") {
			write_msg(get_lang("message without receiver"));
			return;
		}else if(invalidEmail[0] == true){
			write_msg("Os endereços de destinatário a seguir estão incorretos: "+invalidEmail[1]);
			return;
		}

		sucess = expresso_local_messages.send_to_queue(form);
		var data_return = new Array();
		data_return.success = sucess;
		handler_send_message(data_return,ID);
	}
	else{
		if(stringEmail != ""){
			cExecuteForm("$this.imap_functions.send_mail", form, handler_send_message, ID);
		}else{
			write_msg(get_lang("message without receiver"));
			return;
		}
	}

}


function is_valid_email(campo){	
	var invalidEmail = searchEmail(campo);
	var semicolon = campo.split(";");
	
	if((campo.replace(/^\s+|\s+$/g,"")) != ""){
			if(invalidEmail[0] == true){
				write_msg("Erro de SMTP: Os endereços de destinatário a seguir falharam: "+ invalidEmail[1]);
				return false;
			}else{
				if(semicolon.length > 1){
					var stringError = "Erro de SMTP: Os endereços devem ser separados apenas por vígula: ";
					for(var i= 0; i < semicolon.length; i++){
						stringError = stringError + semicolon[i];
						if(i+1 < semicolon.length)
							stringError = stringError + " ; ";
					}
					write_msg(stringError);
					return false;
				}else {
					return true;
				}
			}
	}
	else{
		write_msg(get_lang("Message without receiver"));
		return false;
	}		
}
function change_tr_properties(tr_element, newUid, newSubject){
	message_id=tr_element.id;
	var td_from = document.getElementById('td_from_'+message_id);
	if (typeof(newSubject) != 'undefined')
		td_from.nextSibling.innerHTML = newSubject;
	tr_element.id = newUid;

	var openNewMessage = function () {
		$.ajax({
			  url: 'controller.php?' + $.param( {action: '$this.imap_functions.get_info_msg',
							      msg_number: newUid, 
							      msg_folder: current_folder,
							      decoded: true } ),
			  success: function( data ){
			      data = connector.unserialize( data );
			      
			      if( data )
				  show_msg( data );
			  },
			  beforeSend: function( jqXHR, settings ){
			  	connector.showProgressBar();
			  },
			  complete: function( jqXHR, settings ){
			  	connector.hideProgressBar();
			  }

		});
	};
	for (var i=2; i < 10; i++){
		if (typeof(tr_element.childNodes[i].id) != "undefined")
			tr_element.childNodes[i].id = tr_element.childNodes[i].id.replace(message_id,newUid);
		tr_element.childNodes[i].onclick = openNewMessage;
	}
}


function autoSave( ID )
{
    if(autoSaveControl.status[ID] === false)
        save_msg(ID);         
}

function save_msg(border_id){
    
    //seta o status do auto_save = true
   if (preferences.auto_save_draft == 1)
       autoSaveControl.status[border_id] = true;
   ///////////////////////////////////////////
    var content = $("#content_id_"+border_id);
	
   	var stringEmail = "";
	var array = content.find(".to-tr").find(".box");
	$.each(array, function(index, value){
		stringEmail += $(value).find("input").val() + ",";
	});
	content.find('[name="input_to"]').val(stringEmail);
	stringEmail = "";
	if ( content.find('[name="input_cco"]').length){
		if(content.find(".cco-tr").css("display") != "none"){
			var array = content.find(".cco-tr").find(".box");
			$.each(array, function(index, value){
				stringEmail += $(value).find("input").val() + ",";
			});
			content.find('[name="input_cco"]').val(stringEmail);
		}
	}
	
	stringEmail = "";	
	if(content.find(".cc-tr").css("display") != "none")
	{
		var array = content.find(".cc-tr").find(".box");
		$.each(array, function(index, value){
			stringEmail += $(value).find("input").val() + ",";
		});
		content.find('[name="input_cc"]').val(stringEmail);
	}
	
   var idJavascript = saveBorderError[border_id];
   
   if(saveBorderError[border_id] !== false)
   	DataLayer.put('message',DataLayer.merge(DataLayer.form("#form_message_"+border_id), {id: idJavascript }));
   else
       idJavascript = DataLayer.put('message',DataLayer.form("#form_message_"+border_id));  

   uidsSave[border_id] = [];
   DataLayer.commit(false,false,function(data){
       if(data != null && data['message://'+idJavascript] !== undefined && data['message://'+idJavascript].id !== undefined )
       {
       	uidsSave[border_id].push(data['message://'+idJavascript].id);
       	saveBorderError[border_id] = false;
       	write_msg('Mensagem salva com sucesso!');
       }
       else
       {
       	saveBorderError[border_id] = idJavascript;
       	write_msg('Erro ao salvar sua mensagem! Nova tentativa em alguns segundos.');      
       }
   });

}

function set_messages_flag_search_local(flag){
	var msgs_flag = this.get_selected_messages_search();
	if(local_messages.prototype.set_messages_flag(msgs_flag, flag, true)){
		var id_border = currentTab.replace(/[a-zA-Z_]+/, "");
		var msgs = msgs_flag.split(',');
		for(var i = 0; i < msgs.length; i++){
			Element("search_local_msg"+id_border+"_check_box_message_"+msgs[i]).checked = false;
		}
		draw_tree_folders();
		Element('chk_box_select_all_messages_search_local').checked = false;
		refresh();
		write_msg(get_lang('The messages were marked with success!'));		
	}else{
		write_msg(get_lang('Error marking messages.'));
	}
}

function set_messages_flag_search(flag){
	
	var id_border = currentTab.replace(/[a-zA-Z_]+/, "");
	var msgs_flag = this.get_selected_messages_search();
	if (!msgs_flag){
		write_msg(get_lang('No selected message.'));
		return;
	}
	var selected_param = "";
	msgs_to_flag = msgs_flag.split(",");
	search = true;
	for (i = 0; i < msgs_to_flag.length; i++){
		var tr = Element(msgs_to_flag[i]+'_s'+id_border);
		var msg_to_flag = (tr.getAttribute('name') == null?get_current_folder():tr.getAttribute('name'));
		selected_param += ','+msg_to_flag+';'+tr.id.replace(/_[a-zA-Z0-9]+/,"");
	}
	
	var handler_set_messages_flag = function(data){
		var errors = false;
		var notErrors = false;
		for (var i = 0; i < data.length; i++){
			var notArray = true;
			if(data[i].msgs_to_set != ''){
				var msgs = [];
				if(data[i].msgs_to_set.indexOf(',') > 0){
					msgs = data[i].msgs_to_set.split(',')
					notArray = false;
				}else
					msgs[0] = data[i].msgs_to_set;
					
				for (var j = 0; j < msgs.length; j++){
					switch(data[i].flag){
						case "unseen":
							set_msg_as_unread(msgs[j]+'_s'+id_border, true);
							Element("search_"+id_border+"_check_box_message_"+msgs[j]).checked = false;
							break;
						case "seen":
							set_msg_as_read(msgs[j]+'_s'+id_border, true);
							Element("search_"+id_border+"_check_box_message_"+msgs[j]).checked = false;
							break;
						case "flagged":
							set_msg_as_flagged(msgs[j]+'_s'+id_border, true);
							document.getElementById("search_"+id_border+"_check_box_message_"+msgs[j]).checked = false;
							break;
						case "unflagged":
							set_msg_as_unflagged(msgs[j]+'_s'+id_border, true);
							Element("search_"+id_border+"_check_box_message_"+msgs[j]).checked = false;
							break;
					}
					notErrors = true;
				}
			}else{
				errors = true;
			}
		}
		
		draw_tree_folders();
		Element('chk_box_select_all_messages_search').checked = false;
		refresh();
		
		if(errors && notErrors)
			write_msg(get_lang('Some messages were not marked with success!'));
		else if(notErrors)
			write_msg(get_lang('The messages were marked with success!'));
		else
			write_msg(get_lang('Error marking messages.'));
	}
	cExecute ("$this.imap_functions.set_messages_flag_from_search&msg_to_flag="+selected_param+"&flag="+flag, handler_set_messages_flag);
}

// Get checked messages
function set_messages_flag(flag, msgs_to_set){	
	if(currentTab != 0 && currentTab.indexOf("search_local")  >= 0){
		return set_messages_flag_search_local(flag);
	}
	if (currentTab != 0 && currentTab.indexOf("search_")  >= 0){
		return set_messages_flag_search(flag);
	}
	
	var handler_set_messages_flag = function (data){
		if(!verify_session(data))
			return;
		var msgs_to_set = data.msgs_to_set.split(",");

		if(!data.status) {
			write_msg(data.msg);
			Element('chk_box_select_all_messages').checked = false;
			for (var i = 0; i < msgs_to_set.length; i++) {
				Element("check_box_message_" + msgs_to_set[i]).checked = false;
				remove_className(Element(msgs_to_set[i]), 'selected_msg');
			}
			if(!data.msgs_unflageds)
				return;
				
			else
				if(data.msgs_not_to_set != "")
					write_msg(get_lang("Error processing some messages."));
					
				msgs_to_set = data.msgs_unflageds.split(",");
		}

		for (var i=0; i<msgs_to_set.length; i++){
			if (preferences.use_cache == 'True')
			{
				if (current_folder == '')
					current_folder = 'INBOX';
				var setFlag = function(msgObj) {
					switch(data.flag){
						case "unseen":
							msgObj.Unseen = "U";
							break;
						case "seen":
							msgObj.Unseen = "";
							break;
						case "flagged":
							msgObj.Flagged = "F";
							break;
						case "unflagged":
							msgObj.Flagged = "";
							break;
					}
				}
			}
			if(Element("check_box_message_" + msgs_to_set[i])){
				switch(data.flag){
					case "unseen":
						    set_msg_as_unread(msgs_to_set[i]);
						if(results_search_messages != "") 
							set_msg_as_unread(results_search_messages, true);
						Element("check_box_message_" + msgs_to_set[i]).checked = false;
						break;
					case "seen":
						set_msg_as_read(msgs_to_set[i], false);
						if(results_search_messages != "") 
							set_msg_as_read(results_search_messages, false, true);
						Element("check_box_message_" + msgs_to_set[i]).checked = false;
						
						// remove a flag $FilteredMessage da mensagem ao ser marcada como lida	
						$.each(fromRules, function(index, value) {
							if(value == folder){
								cExecute ("$this.imap_functions.removeFlagMessagesFilter&folder="+folder+"&msg_number="+msgs_to_set, function(){}); 
								return false;
							}
						});	
						
						break;
					case "flagged":
						    set_msg_as_flagged(msgs_to_set[i]);
						if(results_search_messages != "") 
							set_msg_as_flagged(results_search_messages, true);
						document.getElementById("check_box_message_" + msgs_to_set[i]).checked = false;
						break;
					case "unflagged":
						    set_msg_as_unflagged(msgs_to_set[i]);
						if(results_search_messages != "") 
 	                        set_msg_as_unflagged(results_search_messages, true);
						Element("check_box_message_" + msgs_to_set[i]).checked = false;
						break;
				}
			}
		}
		Element('chk_box_select_all_messages').checked = false;
	}

	var folder = get_current_folder();
	if (msgs_to_set == 'get_selected_messages')
		var msgs_to_set = this.get_selected_messages();
	else
		folder = Element("input_folder_"+msgs_to_set+"_r").value;
	
	if (msgs_to_set)
		$.ajax({
			  url: 'controller.php?' + $.param( {action: '$this.imap_functions.set_messages_flag',
							      folder: folder,
							      msgs_to_set: msgs_to_set,
							      flag: flag, 
							      decoded: true } ),
			  success: function( data ){
			      data = connector.unserialize( data );
			      
			      if( data )
				  handler_set_messages_flag( data );
			  },
			  beforeSend: function( jqXHR, settings ){
			  	connector.showProgressBar();
			  },
			  complete: function( jqXHR, settings ){
			  	connector.hideProgressBar();
			  }

		});
	else
		write_msg(get_lang('No selected message.'));
}

// By message number
function set_message_flag(msg_number, flag, func_after_flag_change){
	var msg_number_folder = Element("new_input_folder_"+msg_number+"_r"); //Mensagens respondidas/encaminhadas
	if(!msg_number_folder)
		var msg_number_folder = Element("input_folder_"+msg_number+"_r"); //Mensagens abertas
	
	var handler_set_messages_flag = function (data){
		if(!verify_session(data))
			return;
		if(!data.status) {
			write_msg(get_lang("this message cant be marked as normal"));
			return;
		}
		else if(func_after_flag_change) {
			func_after_flag_change(true);
		}
		if (data.status && Element("td_message_answered_"+msg_number)) {
			
			switch(flag){
				case "unseen":
					set_msg_as_unread(msg_number);
					break;
				case "seen":
					set_msg_as_read(msg_number);
					break;
				case "flagged":
					set_msg_as_flagged(msg_number);
					break;
				case "unflagged":
					set_msg_as_unflagged(msg_number);
					break;
				case "answered":
					Element("td_message_answered_"+msg_number).innerHTML = '<img src=templates/'+template+'/images/answered.gif title=Respondida>';
					break;
				case "forwarded":
					Element("td_message_answered_"+msg_number).innerHTML = '<img src=templates/'+template+'/images/forwarded.gif title=Encaminhada>';
					break;
			}				
		} else {
			refresh();
		}
	}
	$.ajax({
		  url: 'controller.php?' + $.param( {action: '$this.imap_functions.set_messages_flag',
						      folder: ( msg_number_folder ?  msg_number_folder.value : get_current_folder() ),
						      msgs_to_set: msg_number,
						      flag: flag,
						      decoded: true } ),
		  success: function( data ){
		      data = connector.unserialize( data );
		      
		      if( data )
			  handler_set_messages_flag( data );
		  },
		  beforeSend: function( jqXHR, settings ){
			  	connector.showProgressBar();
		  },
		  complete: function( jqXHR, settings ){
			  	connector.hideProgressBar();
		   }

	});
}

function print_search_msg(){		
	var folder = "<h2>&nbsp;Resultado da Pesquisa&nbsp;<font color=\"#505050\" face=\"Verdana\" size=\"1\"></h2>";
	msgs_number = get_selected_messages_search();
	var tbody = Element('divScrollMain_'+numBox).firstChild.firstChild.innerHTML;
	var id_border = currentTab.replace(/[a-zA-Z_]+/, "");
	
	if(msgs_number){
		msgs_number = msgs_number.split(",");
		var tbody = "";
		for(var i = 0; i < msgs_number.length; i++){
			tbody += "<tr id=\""+msgs_number[i]+"_s"+id_border+"\" class=\"tr_msg_unread tr_msg_read2\">"+ Element(msgs_number[i]+'_s'+id_border).innerHTML+"</tr>";
		}
	}else{
		msgs_number = get_all_messages_search();
		msgs_number = msgs_number.split(",");
		var tbody = "";
		for(var i = 0; i < msgs_number.length; i++){
			tbody += "<tr id=\""+msgs_number[i]+"_s"+id_border+"\" class=\"tr_msg_unread tr_msg_read2\">"+ Element(msgs_number[i]+'_s'+id_border).innerHTML+"</tr>";
		}
	}

	
	var print_width = screen.width - 200; 
	var x = ((screen.width - print_width) / 2); 
	var y = ((screen.height - 400) / 2) - 35; 
	var window_print = window.open('','ExpressoMail','width='+print_width+',height=400,resizable=yes,scrollbars=yes,left='+x+',top='+y); 
	seekDot = (is_ie ? /width=24/gi : /width="24"/gi); 

	var thead = "<tr class=\"message_header\">    <td width=\"3%\"></td><td width=\"2%\"></td><td width=\"1%\"></td><td width=\"1%\"></td><td width=\"1%\"></td><td width=\"1%\"></td><td width=\"2%\"></td><td id=\"message_header_FOLDER_0\" class=\"th_resizable\" align=\"left\" width=\"20%\">Pasta</td><td id=\"message_header_SORTFROM_0\" class=\"th_resizable\" align=\"left\" width=\"20%\">De</td><td id=\"message_header_SORTSUBJECT_0\" class=\"th_resizable\" align=\"left\" width=\"*\">Assunto</td><td id=\"message_header_SORTARRIVAL_0\" class=\"th_resizable\" align=\"center\" width=\"11%\"><b>Data</b><img src=\"templates/default/images/arrow_descendant.gif\"></td><td id=\"message_header_SORTSIZE_0\" class=\"th_resizable\" align=\"left\" width=\"11%\">Tamanho</td></tr>";
	tbody = tbody.replace(seekDot, "style='display:none'"); 
	seekDot = (is_ie ? /width=16/gi : /width="16"/gi); 

	tbody = tbody.replace(seekDot, "style='display:none'"); 
	seekDot = (is_ie ? /width=12/gi : /width="12"/gi); 

	tbody = tbody.replace(seekDot, "style='display:none'"); 
	while (1){ 
		try{ 
			window_print.document.open(); 
	 	    var html = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html>' 
	 	    + '<head><link rel="stylesheet" type="text/css" href="templates/'+template+'/print.css"></head>' 
	 	    + cabecalho + '</h4><hr>' 
	 	    + '<h2>'+folder+'</h2><hr/><blockquote><font size="2">' 
	 	    + '<table width="100%" cellpadding="0" cellspacing="0">' 
	 	    + '<thead>' + thead + '</thead><tbody>' + tbody + '</tbody>' 
	 	    + '</table></font></blockquote></body></html>'; 
	 	    window_print.document.write(html); 
	 	    window_print.document.close(); 
	 	    break; 
		} 
		catch(e){ 
			//alert(e.message); 
		} 
	} 
	window_print.document.close(); 
	window_print.print(); 
}

function print_all(){
	if (openTab.type[currentTab] == 2)
		return print_msg(current_folder,currentTab.substr(0,currentTab.indexOf("_r")),currentTab);

	if (currentTab != 0 && currentTab.indexOf("search_")  >= 0){
		return print_search_msg();
	}
		
	var folder= Element('border_id_0').innerHTML;
	//var thead = Element('divScrollHead_'+numBox).firstChild.firstChild.innerHTML; 
	
	msgs_number = get_selected_messages();
	if(msgs_number == false){
	var tbody = Element('divScrollMain_'+numBox).firstChild.firstChild.innerHTML;
	}else{
		msgs_number = msgs_number.split(",");
		var tbody = "";
		for(var i = 0; i < msgs_number.length; i++){
			tbody += "<tr id="+msgs_number[i]+" class=\"tr_msg_unread tr_msg_read2\">"+ Element(msgs_number[i]).innerHTML+"</tr>";
		}	
	}
	var print_width = screen.width - 200;
	var x = ((screen.width - print_width) / 2);
	var y = ((screen.height - 400) / 2) - 35;
	var window_print = window.open('','ExpressoMail','width='+print_width+',height=400,resizable=yes,scrollbars=yes,left='+x+',top='+y);
	seekDot = (is_ie ? /width=24/gi : /width="24"/gi);
	//thead = thead.replace(seekDot, "style='display:none'"); 
	var thead = "<tr class=\"message_header\"> <td width=\"3%\"></td><td width=\"2%\"></td><td width=\"1%\"></td><td width=\"1%\"></td><td width=\"1%\"></td><td width=\"1%\"></td><td width=\"2%\"></td><td width=\"2%\"></td><td width=\"2%\"></td><td id=\"message_header_SORTFROM_0\" class=\"th_resizable\" align=\"left\" width=\"20%\">De</td><td id=\"message_header_SORTSUBJECT_0\" class=\"th_resizable\" align=\"left\" width=\"*\">Assunto</td><td id=\"message_header_SORTARRIVAL_0\" class=\"th_resizable\" align=\"center\" width=\"11%\"><b>Data</b><img src=\"templates/default/images/arrow_descendant.gif\"></td><td id=\"message_header_SORTSIZE_0\" class=\"th_resizable\" align=\"left\" width=\"11%\">Tamanho</td></tr>";
	tbody = tbody.replace(seekDot, "style='display:none'");
	seekDot = (is_ie ? /width=16/gi : /width="16"/gi);
	//thead = thead.replace(seekDot, "style='display:none'"); 
	tbody = tbody.replace(seekDot, "style='display:none'");
	seekDot = (is_ie ? /width=12/gi : /width="12"/gi);
	//thead = thead.replace(seekDot, "style='display:none'"); 
	tbody = tbody.replace(seekDot, "style='display:none'");
	while (1){
		try{
			window_print.document.open();
			var html = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html>'
			+ '<head><link rel="stylesheet" type="text/css" href="templates/'+template+'/print.css"></head>'
	 	    + cabecalho + '</h4><hr>' 
			+ '<h2>'+folder+'</h2><hr/><blockquote><font size="2">'
			+ '<table width="100%" cellpadding="0" cellspacing="0">'
			+ '<thead>' + thead + '</thead><tbody>' + tbody + '</tbody>'
			+ '</table></font></blockquote></body></html>';
			window_print.document.write(html);
			window_print.document.close();
			break;
		}
		catch(e){
			//alert(e.message);
		}
	}
	window_print.document.close();
	window_print.print();
}


function print_msg(msg_folder, msg_number, border_ID){
	var div_toaddress_full = Element("div_toaddress_full_"+border_ID);
	var div_ccaddress_full = Element("div_ccaddress_full_"+border_ID);
	var div_ccoaddress_full = Element("div_ccoaddress_full_"+border_ID);
	var printListTO = (div_toaddress_full && div_toaddress_full.style.display != 'none') || toaddress_array[border_ID].length == 1 ? true : false;	
	var printListCC = (div_ccaddress_full && div_ccaddress_full.style.display != 'none') || !div_ccaddress_full ? true : false;
	var printListCCO = (div_ccoaddress_full && div_ccoaddress_full.style.display != 'none') || !div_ccoaddress_full ? true : false;	
	var sender		= Element('sender_values_'+border_ID) ? Element('sender_values_'+border_ID).value : null;
	var from		= Element('from_values_'+border_ID) ? Element('from_values_'+border_ID).value : null;
	var to			= Element('to_values_'+border_ID) ? Element('to_values_'+border_ID).value :null;
	var cco			= Element('cco_values_'+border_ID) ? Element('cco_values_'+border_ID).value : null;
	var cc 			= Element('cc_values_'+border_ID) ? Element('cc_values_'+border_ID).value : null;		
	var date		=  Element('date_'+border_ID);	
	var subject		= Element('subject_'+border_ID);
	var attachments	= Element('attachments_'+border_ID);
	var body		= Element('body_'+border_ID);

	
	var att = '';
	
	var countAtt = 0; 
 		         
 	if(attachments !== null) 
 	{ 
		countAtt = attachments.getElementsByTagName('a').length; 
		if(countAtt === 1)  
			att =  attachments.getElementsByTagName('a')[0].innerHTML; 
		else if(countAtt > 1) 
			for (var i = 1; i <attachments.getElementsByTagName('a').length; i++) 
				att += " | " + attachments.getElementsByTagName('a')[i].innerHTML; 
 	} 
 	        
	var body = Element('body_'+border_ID); 
	
	var print_width = screen.width - 200;
	var x = ((screen.width - print_width) / 2);
	var y = ((screen.height - 400) / 2) - 35;
	var window_print = window.open('','ExpressoMail','width='+print_width+',height=400,resizable=yes,scrollbars=yes,left='+x+',top='+y);
	if(window_print == null) {
		alert(get_lang("The Anti Pop-Up is enabled. Allow this site (%1) for print.",document.location.hostname));
		return;
	}

	//needed to get the names of the attachments... only.
	if(attachments != null)
	{
		var a = attachments.childNodes;
		var attachs = "";
		var show_attachs = "";
                var ii = a.length >2?2:1;
		for(i=ii;i<a.length;i++)
		{
			if(a[i].tagName && a[i].tagName == "A")
			{
				attachs += a[i].innerHTML;
			}
		}
		show_attachs = "<tr><td width=7%><font size='2'>" + get_lang('Attachments: ')+ " </font></td><td><font size='2'>"+attachs+"</font></td></tr>";
	} else{
		show_attachs = "";
	}       
	var current_path = window.location.href.substr(0,window.location.href.lastIndexOf("/"));
	var head = '<head><title></title><link href="'+current_path+'/templates/default/main.css" type="text/css" rel="stylesheet"></head>';
	window_print.document.write(head);

	while (1){
		try{
			var html ='<body style="overflow:auto">';
			html += cabecalho + '</h4><hr>';
			html += '<table><tbody>';
			if(sender)
				html += "<tr><td width=7% noWrap><font size='2'>" + get_lang('Sent by') + ": </font></td><td><font size='2'>"+sender+"</font></td></tr>";
			if(from)
				html += "<tr><td width=7%><font size='2'>" + get_lang('From') + ": </font></td><td><font size='2'>"+from+"</font></td></tr>";
			if(to) {
				if(!printListTO)
					to = 'Os destinatários não estão sendo exibidos para esta impressão';
				html += "<tr><td width=7%><font size='2'>" + get_lang('To') + ": </font></td><td><font size='2'>"+to+"</font></td></tr>";
			}
			if (cc) {
				if(!printListCC)
					cc = 'Os destinatários não estão sendo exibidos para esta impressão';
				html += "<tr><td width=7%><font size='2'>" + get_lang('Cc') + ": </font></td><td><font size='2'>"+cc+"</font></td></tr>";
			}
			if (cco) {
				if(!printListCCO)
					cco = 'Os destinatários não estão sendo exibidos para esta impressão';
				html += "<tr><td width=7%><font size='2'>" + get_lang('Cco') + ": </font></td><td><font size='2'>"+cco+"</font></td></tr>";
			}
			if(date)
				html += "<tr><td width=7%><font size='2'>" + get_lang('Date') + ": </font></td><td><font size='2'>"+date.innerHTML+"</font></td></tr>";
			
			html += "<tr><td width=7%><font size='2'>" + get_lang('Subject')+ ": </font></td><td><font size='2'>"+subject.innerHTML+"</font></td></tr>";
			//html += show_attachs; //to show the names of the attachments
			if (countAtt > 0) { 
 	            html += "<tr><td width=7%><font size='2'>" + get_lang('Attachments: ') + "</font></td><td><font size='2'>"+att+"</font></td></tr>";       
 	        }
			html += "</tbody></table><hr>";
			window_print.document.write(html + body.innerHTML);

				var tab_tags = window_print.document.getElementsByTagName("IMG");
                        var link = location.href.replace(/\/expressoMail1_2\/(.*)/, "");
				for(var i = 0; i < tab_tags.length;i++){
                                var _img = tab_tags[i].cloneNode(true);
                                if(tab_tags[i].src.toUpperCase().indexOf('INC/GET_ARCHIVE.PHP?MSGFOLDER=') > -1)
                                    _img.src = link + '/expressoMail1_2/'+tab_tags[i].src.substr(tab_tags[i].src.toUpperCase().indexOf('INC/GET_ARCHIVE.PHP?MSGFOLDER='));

					tab_tags[i].parentNode.replaceChild(_img,tab_tags[i]);
				}
                        
			break;
		}
		catch(e){
			//alert(e.message);
		}
	}
	window_print.document.close();
	window_print.print();
}

function empty_trash_imap(){
	var handler_empty_trash = function(data){
		Element('chk_box_select_all_messages').checked = false;
		if(!verify_session(data))
			return;
		//tree_folders.getNodeById(mount_url_folder(["INBOX",special_folders["Trash"]])).alter({caption: get_lang("Trash")});
		//tree_folders.getNodeById(mount_url_folder(["INBOX",special_folders["Trash"]]))._refresh();
		update_quota(get_current_folder());
		draw_new_tree_folder();
		draw_tree_labels();
		if (data){
			write_msg(get_lang('Your Trash folder was empty.'));
			if (get_current_folder() == mount_url_folder(["INBOX",special_folders["Trash"]])){
				draw_paging(0);
				remove_rows(document.getElementById("table_box"));				
				Element('tot_m').innerHTML = 0;
				Element('new_m').innerHTML = 0;
			}
		}
		else
			write_msg(get_lang('ERROR emptying your Trash folder.'));
	}
	
	$.Zebra_Dialog(get_lang('Do you really want to empty your trash folder?'), {
		'type':     'question',
		'title':    get_lang('Empty Trash'),
		'buttons':  [get_lang("Yes"), get_lang("No")],
		'overlay_opacity' : 0.5,
		'onClose':  function(caption) {
			if(caption == get_lang("Yes")){
				cExecute ("$this.imap_functions.empty_folder&clean_folder="+"imapDefaultTrashFolder", handler_empty_trash);
			}
		}
	});
}

function empty_spam_imap(){
	var handler_empty_spam = function(data){
		Element('chk_box_select_all_messages').checked = false;
		if(!verify_session(data))
			return;
		if (get_current_folder() == mount_url_folder(["INBOX",special_folders["Spam"]])){
			draw_paging(0);
			remove_rows(document.getElementById("table_box"));
		}
		//tree_folders.getNodeById(mount_url_folder(["INBOX",special_folders["Spam"]])).alter({caption: get_lang("Spam")});
		//tree_folders.getNodeById(mount_url_folder(["INBOX",special_folders["Spam"]]))._refresh();
		draw_new_tree_folder();
		draw_tree_labels();
		update_quota(get_current_folder());
		if (data)
			write_msg(get_lang('Your Spam folder was empty.'));
		else
			write_msg(get_lang('ERROR emptying your Spam folder.'));
	}
	
	$.Zebra_Dialog(get_lang('Do you really want to empty your spam folder?'), {
		'type':     'question',
		'title':    get_lang('Empty Spam'),
		'buttons':  [get_lang("Yes"), get_lang("No")],
		'overlay_opacity' : 0.5,
		'onClose':  function(caption) {
			if(caption == get_lang("Yes")){
				cExecute ("$this.imap_functions.empty_folder&clean_folder="+"imapDefaultSpamFolder", handler_empty_spam);
			}
		}
	});
}


function export_all_selected_msgs(){
	if (openTab.type[currentTab] > 1){	    
		source_msg(currentTab,openTab.imapBox[currentTab]);
		return;
	}
	var search = false;		

	if(currentTab != 0 && currentTab.indexOf("search_")  >= 0){
		var id_border = currentTab.replace(/[a-zA-Z_]+/, "");
		var msgs_to_export = this.get_selected_messages_search();
		if (!msgs_to_export){
			write_msg(get_lang('No selected message.'));
			return;
		}
		var selected_param = "";
		msgs_to_export = msgs_to_export.split(",");
		search = true;
		for (i = 0; i < msgs_to_export.length; i++){
			var tr = Element(msgs_to_export[i]+'_s'+id_border);
			msg_to_move = (tr.getAttribute('name') == null?get_current_folder():tr.getAttribute('name'));
			selected_param += ','+msg_to_move+';'+tr.id.replace(/_[a-zA-Z0-9]+/,"");
		}
	}else{
		var msgs_to_export = this.get_selected_messages();
	}
	var handler_export_all_selected_msgs = function(data){

		if(!data){
			write_msg(get_lang('Error compressing messages (ZIP). Contact the administrator.'));
		}
		else{
			var filename = 'mensagens.zip'; 
			if (data.match(/\.eml$/gi)) { 
	                        filename = 'fonte_da_mensagem.eml'; 
			} 
			download_attachments(null, null, data, null,null,filename);
		}
	}

	if(search){
		cExecute ("$this.exporteml.makeAll", handler_export_all_selected_msgs, "folder=false&msgs_to_export="+selected_param);
	}else if (msgs_to_export) {
		cExecute ("$this.exporteml.makeAll", handler_export_all_selected_msgs, "folder="+get_current_folder()+"&msgs_to_export="+msgs_to_export);
		write_msg(get_lang('You must wait while the messages will be exported...'));
	}
	else
		write_msg(get_lang('No selected message.'));
}

function select_all_search_messages(select, aba){

	if(select){
		jQuery("#"+aba+" tr").each(function(i, o) {
		
			o.firstChild.firstChild.checked = true;
			add_className(o, 'selected_msg');
		});		
	}else{
		jQuery("#"+aba+" tr").each(function(i, o) {
		
			o.firstChild.firstChild.checked = false;
			remove_className(o, 'selected_msg');
		});
	}
}

function verify_session(data){

	if(data && data.imap_error) {
		if(data.imap_error == "nosession")
			write_msg(get_lang("your session could not be verified."));
		else
			write_msg(data.imap_error);
		// Hold sesion for edit message.
		//if(!hold_session)
		//	location.href="../login.php?cd=10&phpgw_forward=%2FexpressoMail1_2%2Findex.php";
		return false;
	}
	else
		return true;
}

// Save image file.
function save_image(e,thumb,file_type){
	file_type = file_type.replace("/",".");
	thumb.oncontextmenu = function(e) {
		return false;
	}
	var _button = is_ie ? window.event.button : e.which;
	var	_target = is_ie ? event.srcElement : e.target;

	if(_button == 2 || _button == 3) {
		var _params = _target.id.split(";;");
		download_attachments(_params[0],_params[1],_params[2],_params[3],_params[4],file_type);
	}
}
function save_image2(info){ 
	var obj = jQuery.parseJSON(unescape(info)); 
	download_attachments(obj.folder, obj.message, obj.thumbIndex, obj.pid, obj.encoding, obj.type.replace("/",".")); 
} 

function nospam(msgs_number, border_ID, folder){
	if (folder == 'null')
		folder = get_current_folder();
	var new_folder = '';
	if(folder.substr(0,4) == 'user'){
		arrayFolder = folder.split(cyrus_delimiter);
		new_folder = 'user'+cyrus_delimiter+arrayFolder[1];
	}
	else{
		new_folder = 'INBOX';
	}
	var new_folder_name = get_lang('INBOX');
	var handler_move_msgs = function(data){
		if (msgs_number == 'selected')
			set_messages_flag("unseen", "get_selected_messages");
		else
			proxy_mensagens.proxy_set_message_flag(msgs_number, "unseen");
   		proxy_mensagens.proxy_move_messages(folder, msgs_number, border_ID, new_folder, new_folder_name);

		if (openTab.type[currentTab] > 1)
			delete_border(currentTab,'false');
	}

	if(currentTab.toString().indexOf("_r") != -1)
		msgs_number = currentTab.toString().substr(0,currentTab.toString().indexOf("_r"));
	else if(msgs_number == 'selected')
		msgs_number = get_selected_messages();

	if (parseInt(msgs_number) > 0 || msgs_number.length > 0)
		cExecute ("$this.imap_functions.spam&folder="+folder+"&spam=false"+"&msgs_number="+msgs_number+"&border_ID="+border_ID+"&sort_box_type="+sort_box_type+"&sort_box_reverse="+sort_box_reverse+"&reuse_border="+border_ID+"&new_folder="+new_folder+"&new_folder_name="+new_folder_name+"&get_previous_msg="+0+"&cyrus_delimiter="+cyrus_delimiter, handler_move_msgs);
	else
		write_msg(get_lang('No selected message.'));
}

function spam(folder, msgs_number, border_ID){
	if (folder == 'null')
		folder = get_current_folder();
	var new_folder = '';
	if(folder.substr(0,4) == 'user')
	{       
		arrayFolder = folder.split(cyrus_delimiter);
		new_folder = 'user'+cyrus_delimiter+arrayFolder[1]+cyrus_delimiter+special_folders['Spam'];
	}
	else
	{
		new_folder = mount_url_folder(["INBOX",special_folders["Spam"]]);
	}
	var new_folder_name = 'Spam';
	var not_opem_previus = true;
	var handler_move_msgs = function(data){
		proxy_mensagens.proxy_move_messages(folder, msgs_number, border_ID, new_folder, new_folder_name, not_opem_previus);
		if (openTab.type[currentTab] > 1){
			if(preferences.delete_and_show_previous_message == 1)
			delete_border(currentTab,'false');
	}
	}

	if(currentTab.toString().indexOf("_r") != -1)
		msgs_number = currentTab.toString().substr(0,currentTab.toString().indexOf("_r"));
	else if(currentTab != 0 && currentTab.indexOf("search_")  >= 0){
		var content_search = document.getElementById('content_id_'+currentTab);mount_url_folder(["INBOX",special_folders['Trash']]), 'Trash',
		move_search_msgs('content_id_'+currentTab,  mount_url_folder(["INBOX",special_folders["Spam"]]), special_folders['Spam']);
		refresh();
		return;
	}else if(msgs_number == 'selected')
		msgs_number = get_selected_messages();

	if(parseInt(msgs_number) > 0 || msgs_number.length > 0)
		cExecute ("$this.imap_functions.spam&folder="+folder+"&spam=true"+"&msgs_number="+msgs_number+"&border_ID="+border_ID+"&sort_box_type="+sort_box_type+"&sort_box_reverse="+sort_box_reverse+"&reuse_border="+border_ID+"&new_folder="+new_folder+"&new_folder_name="+new_folder_name+"&get_previous_msg="+0+"&cyrus_delimiter="+cyrus_delimiter, handler_move_msgs);
	else
		write_msg(get_lang('No selected message.'));
}

function import_window()
{
	var folder = {};
	var importEmails = $("#importEmails");
		importEmails.html( DataLayer.render( BASE_PATH + "modules/mail/templates/importEmails.ejs", {}));
		importEmails.dialog(
		{
			height		: 280,
			width		: 500,
			resizable	: false,
			title		: get_lang('zip mails to import'),
			modal		: true,
			buttons		: [
							 {
							 	text	: get_lang("Close"), 
							 	click	: function()
							 	{
							 		importEmails.dialog("destroy");
							 	}
							 },
							 {
							 	text	: get_lang("Import"), 
							 	click	: function()
							 	{
							 		var input_file	 = importEmails.find("input[type=file]");
							 		var input_hidden = importEmails.find("input[name=folder]"); 
							 		
							 		if( input_file.attr("value") == "" )
							 		{
							 			$.Zebra_Dialog(get_lang("You must choose a file") + " !",{
							 				'type'				: 'warning',
							 				'overlay_opacity'	: '0.5',
							 				'onClose'			:  function(){
							 					$("#importMessageAccordion").accordion('activate',0);	
							 				}
							 			});
							 		}
							 		else
							 		{
								 		if( input_hidden.attr("value") == "" )
											$.Zebra_Dialog( get_lang("You must choose a folder") + " !" , {
												'type'				: 'warning',
												'overlay_opacity'	: '0.5',
								 				'onClose'			:  function(){
								 					$("#importMessageAccordion").accordion('activate',1);	
								 				}
											});
								 		else
								 		{
								 			var handler_return = function(data)
								 			{
								 				write_msg(get_lang('The import was executed successfully.'));
								 				
								 				return_import_msgs( data, folder );
								 			}
								 			
								 			var formSend =  document.getElementById("importFileMessages");
								 			
								 			importEmails.dialog("destroy");
								 			
								 			write_msg(get_lang('You must wait while the messages will be imported...'));
											
								 			cExecuteForm('$this.imap_functions.import_msgs', formSend , handler_return );
								 		}
							 		}
							 	}
							 }
						]
		});

	importEmails.css("overflow","hidden");
		
	importEmails.find("input[type=file]").change(function()
	{ 
		var deniedExtension = true;
		var fileExtension 	= ["eml","zip"];
		var fileName 		= importEmails.find("input[type=file]").attr('value');
			fileName 		= fileName.split(".");
		
		if( fileName[1] )
		{
			for( var i in fileExtension )
			{
				if( fileExtension[i].toUpperCase() === fileName[1].toUpperCase() )
				{
					deniedExtension = false;
					break;
				}
			}
		}

		if( deniedExtension )
		{
			$.Zebra_Dialog( get_lang('File extension forbidden or invalid file') , {
				'type'				: 'warning',
				'overlay_opacity'	: '0.5'
			});
		}

		$("#lblFileName").html( ( !deniedExtension ) ? importEmails.find("input[type=file]").attr('value') : "" );
		
	});	
		
	$("#importMessageAccordion").accordion();	

	var foldersTree = jQuery("#foldertree-container-importMessage")
	.removeClass('empty-container')
	.html(DataLayer.render(BASE_PATH + 'api/templates/foldertree.ejs', {folders: [cp_tree1, cp_tree2, [] ]}))
	.find("#foldertree").treeview()
	.click(function(event)
	{
		//request new selected folder messages
		var target = $(event.target);

		if( target.is('.collapsable-hitarea, .expandable-hitarea, .lastCollapsable, .lastExpandable, .treeview') )
		    return;

		if( !target.attr('id') )
		    target = target.parent();

        if (target.attr('id') == "foldertree") return;
		
		folder.id 		= target.attr('id');
		folder.child 	= target.find('.folder');
		folder.caption	= target.find('span').attr('title');			
		
		$('.filetree span.folder.selected').removeClass('selected');
		if(!target.is('#foldertree > .expandable, #foldertree > .collapsable'))
			$(target).children('.folder').addClass('selected');
		
		selectedFolder = {
		    id: folder.id, 
		    name: folder.child.attr('title'),
		    'class': folder.child.attr('class')
		};
		
		importEmails.find("input[name=folder]").attr("value", folder.id);
	});
	
	$("#lblFileName").prev().css("margin-left", "10px");
	$("#lblFileName").prev().css("font-weight", "bold");
}

function return_import_msgs(data, folder)
{
	if(data && data.error){
		write_msg(data.error);
	}
	else
	{
		if(data == 'Post-Content-Length')
			write_msg(get_lang('The size of this message has exceeded  the limit (%1B).', preferences.max_attachment_size ? preferences.max_attachment_size : Element('upload_max_filesize').value));
		else
		{	/*
			* @author Rommel Cysne (rommel.cysne@serpro.gov.br)
			* @date 2009/05/15
			* Foi colocado um teste para verificar se a pasta selecionada, passada como parametro,
			* eh uma pasta local (qualquer uma)
			*/
			var er = /^local_/;
			if ( er.test(folder.id) )
			{
				alert( "Mensagens não podem ser importadas em pastas locais" );
				//archive_msgs('INBOX/Lixeira/tmpMoveToLocal',wfolders_tree._selected.id,data);
				//cExecute('$this.imap_functions.delete_mailbox',function(){},'del_past=INBOX/Lixeira/tmpMoveToLocal');
			}
			else
			{
				if( openTab.imapBox[0] == folder.id )
				{
					openTab.imapBox[0] = '';
					change_folder(folder.id, folder.caption);
				}
				
				refresh();
			}
		}
	}

}

function import_implements_calendar(){

	if(typeof(Encoder) == "undefined"){
		/*
		* Deve-se centralizar as informações do usuário logado afim de não incluir
		* arquivos de modulos distintos para este fim.
		*/
		
		//$.ajax({ url: "../expressoCalendar/index.php", async: false});
		//$.ajax({url: "../prototype/modules/calendar/js/calendar.date.js", async: false, beforeSend: function( xhr ) { xhr.overrideMimeType('text/javascript; charset=ISO-8859-1')}});
		$.ajax({url: "../prototype/modules/calendar/js/load.js", async: false, beforeSend: function( xhr ) {xhr.overrideMimeType('text/javascript; charset=ISO-8859-1')}});
		$.ajax({url: "../prototype/modules/calendar/js/map.disponibility.js", async: false, beforeSend: function( xhr ) {xhr.overrideMimeType('text/javascript; charset=ISO-8859-1')}});
		$.ajax({url: "../prototype/modules/calendar/js/helpers.js", async: false, beforeSend: function( xhr ) {xhr.overrideMimeType('text/javascript; charset=ISO-8859-1')}});
		//$.ajax({ url: "../prototype/modules/calendar/js/timezone.js", async: false});
		//$.ajax({ url: "../prototype/modules/calendar/js/calendar.codecs.js", async: false});
		$.ajax({url: "../prototype/plugins/encoder/encoder.js", async: false, beforeSend: function( xhr ) {xhr.overrideMimeType('text/javascript; charset=ISO-8859-1')}});
		//$.ajax({url: "../prototype/plugins/dateFormat/dateFormat.js", async: false, beforeSend: function( xhr ) { xhr.overrideMimeType('text/javascript; charset=ISO-8859-1')}});

		$.ajax({url: "../prototype/plugins/fullcalendar/fullcalendar.js", async: false , beforeSend: function( xhr ) {xhr.overrideMimeType('text/javascript; charset=ISO-8859-1')}});
		
		
		DataLayer.dispatchPath = "../prototype/";	
	}
}


function select_import_folder(){
	//Begin: Verify if the file extension is allowed.
	var imgExtensions = new Array("eml","zip");
	var inputFile = document.form_import.file_1;
	if(!inputFile.value){
		alert(get_lang('File extension forbidden or invalid file') + '.');
		return false;
	}
	var fileExtension = inputFile.value.split(".");
	fileExtension = fileExtension[(fileExtension.length-1)];
	var deniedExtension = true;
	for(var i=0; i<imgExtensions.length; i++) {
		if(imgExtensions[i].toUpperCase() == fileExtension.toUpperCase()) {
			deniedExtension = false;
			break;
		}
	}
	if(deniedExtension) {
		alert(get_lang('File extension forbidden or invalid file') + '.');
		return false;
	}
	arrayJSWin['import_window'].close();
		connector.loadScript('wfolders');

	if ( typeof(wfolders) == "undefined" )
		setTimeout( 'select_import_folder()', 500 );
	else
		wfolders.makeWindow('null','import');
}
function import_calendar(data){
    var import_url = '$this.db_functions.import_vcard&msg_folder='+data;
    var logUser;
    var up;
    var owner;
    
    //Verifica o contexto de importação
    var decodeOwner = function(){
	
	owner = User.me.id;
	var imapBox = openTab.imapBox[currentTab].split(cyrus_delimiter);
	if(imapBox.length > 1){
	    var user = DataLayer.get('user', {filter: ['=','uid',imapBox[1]]});		    
	    owner = $.isArray(user) ? user[0].id : user.id;
	}
	
	return owner;
    }
    
    function handler_import_calendar(data){
            if(data === true){
                    write_msg(get_lang("The event was imported successfully."));
            }
            else if( data['url'] )
            {
                var form = document.createElement( "form" );

                form.setAttribute( "action", DEFAULT_URL + data['url'] + '&isPost=true' );
                form.setAttribute( "method", "POST" );

                document.body.appendChild( form );

                form.submit();
            }
            else
                write_msg(get_lang(data));
    }	
	if(defaultCalendar == "expressoCalendar" && $("#expressoCalendarid")[0]){
		import_implements_calendar();
		$( "#import-dialog" ).dialog({
			autoOpen: false,
			height: 220,
			modal: true,
			resizable : false,
			close: function(event) {
				event.stopPropagation();
			},
			closeOnEscape: true
		});
		
		$.ajax({
			url: "controller.php?action="+import_url+'&from_ajax=true&id_user='+User.me.id+'&readable=true&cirus_delimiter='+cyrus_delimiter+'&analize=true&uidAccount='+decodeOwner(),
			async: false,
			success: function(data){
					data = connector.unserialize(data);


					var createDialog = function(typeImport, propaget){
					    
						if(typeof(typeImport) == "object"){
						    var calendarPermission = typeImport.calendar;
						    typeImport = typeImport.action;
						}
						
						switch(parseInt(typeImport)){
						case 1:
						case 7:
						case 10:
						    $("#select-agenda").html('');

						    var options = '';

						    if(typeImport == 10){
							for(var i = 0; i < calendarPermission.length; i++)
							    options += '<option value="'+calendarPermission[i]+'">'+Calendar.signatureOf[calendarPermission[i]].calendar.name+'</option>'
						    }else{
							for(var id in Calendar.signatures)
							   options += parseInt(Calendar.signatures[id].isOwner) ? '<option value="'+Calendar.signatures[id].calendar.id+'">'+Calendar.signatures[id].calendar.name+'</option>' : '';							
						    }
						    
						    $("#select-agenda").append(options);
						    $("#select-agenda").css("display", "block");
						    
						    $("#import-dialog" ).dialog({
							buttons: {
							    Cancel: function() {
								$( this ).dialog( "close" );
							    },
							    "Importar" : function(){
								    $.ajax({
									url: "controller.php?action="+import_url+'&from_ajax=true&selected='+$("#select-agenda option:selected").val()+'&status='+$("#select-status option:selected").val()+'&uidAccount='+decodeOwner(),
									success: function(msg){
									    var alt = ( (msg = connector.unserialize(msg)) == "ok") ? "Importado com sucesso para " : "Ocorreu um erro ao importar o evento para a agenda ";
									    alert( alt + $("#select-agenda option:selected").text() );
									}
								    });
								    $( this ).dialog( "close" );
							    }
							}
							});

							if(typeImport == 7){
							    $("#import-dialog").find('#select-status option[value=1]').attr('selected','selected').trigger('change');
							    $("#import-dialog").find('#select-status').attr('disabled','disabled');
							}
						    break;
						case 3:
							$.ajax({
								url: "controller.php?action="+import_url+'&from_ajax=true&selected=true',
								success: function(msg){
									alert( ( ( connector.unserialize(msg)) == "ok") ? "Seu evento foi removido " : "Ocorreu um erro ao remover o evento" );
								}
							});
							return;
							break;	
						case 5:
							$.ajax({
								url: "controller.php?action="+import_url+'&from_ajax=true&selected=true',
								success: function(msg){
									alert( ( ( connector.unserialize(msg)) == "ok") ? "Seu evento foi Atualizado com sucesso" : "Ocorreu um erro ao atualizar evento" );
								}
							});
							return;
							break;	
						case 6:
							var acceptedSuggestion = confirm("Deseja atualizar o evento de acordo com a sugestão ?");
							$.ajax({
								url: "controller.php?action="+import_url+'&from_ajax=true&id_user='+User.me.id+'&selected=true&cirus_delimiter='+cyrus_delimiter+'&acceptedSuggestion='+acceptedSuggestion+"&from="+document.getElementById('from_values_'+currentTab).value,
								success: function(msg){
									if(acceptedSuggestion)
										alert( ( ( connector.unserialize(msg)) == "ok") ? "Evento atualizado com sucesso " : "Ocorreu um erro ao atualizar o evento" );
								}
							});
							return;
							break;
						case 9:
							alert('Seu evento não possui alterações!');
							return;
							break;
						case 11:
							alert('Este evento já fora importando por algum dos particpantes e já se encontra disponível em sua agenda compartilhada!');
							return;
							break;
						default:
							up = true;
							$("#select-agenda").css("display", "none");
							$("#import-dialog" ).children("p:first-child").css("display", "none");
							$("#import-dialog" ).dialog({
								height: 160,
								title: 'Atualizar Evento',
								buttons: {
									Cancel: function() {
										$( this ).dialog( "close" );
									},
								   "Atualizar": function() {
										
										$.ajax({
											 url: "controller.php?action="+import_url+'&from_ajax=true&selected='+ (parseInt(typeImport) == 2 || parseInt(typeImport) == 4 ? 'true' : $("#select-agenda option:selected").val()) +'&status='+$("#select-status option:selected").val(),
											 success: function(msg){
													alert( ( (msg = connector.unserialize(msg)) == "ok") ? "Atualizado com sucesso para " : "Ocorreu um erro ao atualizar o evento" );
											}
										});
										$( this ).dialog( "close" );
									}
								}
							});
							$(".ui-dialog-buttonpane").find(".ui-button:last").children().html("Atualizar");
						}
						$( "#import-dialog" ).dialog( "open" );	
																
					};
					createDialog(data, true);
                                
                },
                beforeSend: function( jqXHR, settings ){
				  	connector.showProgressBar();
				},
				complete: function( jqXHR, settings ){
				  	connector.hideProgressBar();
				}
            });
			
		}
		else
		{
		    if(confirm(get_lang("Do you confirm this import to your Calendar?"))){
			cExecute( import_url + "&from_ajax=true", handler_import_calendar);
		    }
		}
}
function open_msg_part(data){
	var handler_open_msg_part = function (data)
        {
            if(data.append == 1)
            {
                proxy_mensagens.get_msg(data.msg_number,data.msg_folder,false,show_msg);
                partMsgs.push(data.msg_number);
	}
            else
               write_msg(data.append);
	}
        cExecute('$this.imap_functions.ope_msg_part&msg_folder='+data+'&save_folder=INBOX'+cyrus_delimiter+special_folders['Trash'] , handler_open_msg_part);	
}
function hack_sent_queue(data,rowid_message) {

	if (data.success != true) {
		queue_send_errors = true;
		expresso_local_messages.set_problem_on_sent(rowid_message,data);
	}
	else {
		expresso_local_messages.set_as_sent(rowid_message);
		if(document.getElementById('_action')) { //Não posso manter esse elemento, pois o connector irá criar outro com o mesmo id para a próxima mensagem.
			el =document.getElementById('_action');
			father = el.parentNode;
			father.removeChild(el);
		}
		send_mail_from_queue(false);
	}
}

function send_mail_from_queue(first_pass) {
	if(first_pass)
		modal('send_queue');
	var num_msgs = expresso_local_messages.get_num_msgs_to_send();
	if (num_msgs <= 0) {
		close_lightbox();
		return;
	}
	document.getElementById('text_send_queue').innerHTML = get_lang('Number of messages to send:')+' '+num_msgs;
	var handler_send_queue_message = function(data,rowid_message) {
		hack_sent_queue(data,this.ID_tmp);
	}
	var msg_to_send = expresso_local_messages.get_form_msg_to_send();
	if(!is_ie)
		ID_tmp = msg_to_send.rowid.value;
	else {//I.E kills me of shame...
		for (var i=0;i<msg_to_send.length;i++) {
			if(msg_to_send.elements[i].name=='rowid') {
				ID_tmp = msg_to_send.elements[i].value;
				break;
			}
		}
	}
	expresso_local_messages.set_as_sent(ID_tmp);
	cExecuteForm("$this.imap_functions.send_mail", msg_to_send, handler_send_queue_message,"queue_"+ID_tmp);
	send_mail_from_queue(false);
}

function check_mail_in_queue() {
	var num_msgs = expresso_local_messages.get_num_msgs_to_send();
	if(num_msgs>0) {
		control = confirm(get_lang('You have messages to send. Want you to send them now?'));
		if(control) {
			send_mail_from_queue(true);
		}
		return true;
	}
	else {
		return false;
	}
}

function force_check_queue() {
	if(!check_mail_in_queue()) {
		write_msg(get_lang("No messages to send"));
	}
}

function create_new_folder(name_folder, base_path){
	$.ajax({
		url : "controller.php?action=$this.imap_functions.create_mailbox",
		type : "POST",
		async : false,
		data : "newp="+name_folder+"&base_path="+base_path,
		success : function(data){
			data = connector.unserialize(data);
			if(data == "Mailbox already exists"){
				write_msg(get_lang("Mailbox already exists"));
			}
			cExecute("$this.imap_functions.get_folders_list&onload=true", update_menu);
		},
		beforeSend: function( jqXHR, settings ){
		  	connector.showProgressBar();
		},
		  complete: function( jqXHR, settings ){
		  	connector.hideProgressBar();
		}
	});
}

function searchEmail(emailString){
		var arrayInvalidEmails = new  Array();
		arrayInvalidEmails[1] = '';
		var email;
		var arrayEmailsFull = new Array();
		arrayEmailsFull = emailString.split(',');
		var er_Email =  new RegExp("<(.*?)>"); 
                // TODO Use validateEmail of common functions !
		var er_ValidaEmail = new RegExp("^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,3})$");

		for (i=0; i < arrayEmailsFull.length; i++){
			email = er_Email.exec(arrayEmailsFull[i]);
			tempEmail = email == null  ? arrayEmailsFull[i]:email[1];
			tempEmail = tempEmail.replace(/^\s+|\s+$/g,"");
			
			if (tempEmail != '') {
				singleEmail = er_ValidaEmail.exec(tempEmail);
				if (singleEmail == null) {
					arrayInvalidEmails[0] = true;
					arrayInvalidEmails[1] += (email == null ? arrayEmailsFull[i] : email[1]) + "";
				}
			}
		}

		return arrayInvalidEmails;
}

		/* Função que chama a tela para o usuário reportar um erro no email. */ 
 		function reports_window(currentTab){ 
 		        ID_msg = currentTab.substr(0,currentTab.indexOf("_")); 
 		        report_wind.make_report_window(ID_msg); 
		} 


DataLayer.codec( "message", "detail", {
  
	decoder:function( form ){
            var border_id = form.abaID;  
            //Defininindo pasta a ser salva mensagem
			var user_selected = $('#content_id_'+border_id).find('.from-select option:selected').text();
			var str_begin_name = user_selected.indexOf('<') + 1;
			var str_end_name = user_selected.indexOf('@');
			var user_selected_name = user_selected.substring(str_begin_name, str_end_name);
			
			if(user_selected.length > 0)
				var user_selected_email = user_selected.match(/<([^<]*)>[\s]*$/)[1];	
			else 
				var user_selected_email = User.me.mail;
			
			if(user_selected_email == User.me.mail){
				var prefix = 'INBOX';
			}else{
				var prefix = 'user' + cyrus_delimiter+user_selected_name;
				
				/** TODO Mudar quando melhorias forem implementadas na API de atualização do cache */
				DataLayer.remove('folder', false);
				DataLayer.get('folder');
				
				var has_folder = DataLayer.get('folder', prefix + cyrus_delimiter + draftsfolder);
				if(!has_folder){
					create_new_folder(draftsfolder, prefix);
				}
			}
			
            var folder_id = (openTab.imapBox[border_id] && openTab.type[border_id] < 6) ? openTab.imapBox[border_id]: prefix + cyrus_delimiter + draftsfolder;
            form.folder = folder_id;
            form.body = RichTextEditor.getData("body_"+border_id);
			form.type =  RichTextEditor.plain[border_id] ? 'plain' : 'html';	    
            form.attachments = listAttachment(border_id);
            form.uidsSave = uidsSave[border_id].toString();
            return( form );
      
	},

	encoder:function( pref ){
              
		return( pref );
	}

});

DataLayer.codec( "mailAttachment", "detail", {
  
	decoder: function(evtObj){
	
		if( notArray = $.type(evtObj) !== "array" )
			evtObj = [ evtObj ];

		var res = $.map(evtObj, function( form){
			return [$.map(form.files , function( files){
					return {source: files , disposition : form['attDisposition'+form.abaID]};
				})];
		});
	return notArray ? res[0] : res;
	},
      
	encoder: function(){}

      
});

function formatBytes(bytes) {
	if (bytes >= 1000000000) {
		return (bytes / 1000000000).toFixed(2) + ' GB';
	}
	if (bytes >= 1000000) {
		return (bytes / 1000000).toFixed(2) + ' MB';
	}
	if (bytes >= 1000) {
		return (bytes / 1000).toFixed(2) + ' KB';
	}
	return bytes + ' B';
};

function truncate(text, size){
	var result = text;
	if(text.length > size){
		result = text.substring(0,size) + '...';
	}
	return result;
}

DataLayer.links('message');
DataLayer.poll('message',30);


