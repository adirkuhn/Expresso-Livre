MsgsCallbackFollowupflag = {

    '#FollowupflagMessageIdError': function(){
	alert('Não foi possível sinalizar esta mensagem. \nDetalhes do erro: mensagem não contém o atributo message-id.');
    },
    '#FollowupflagLimitError': function(){
	alert('Não foi possível sinalizar esta mensagem. \nDetalhes do erro: limite de flags atingido para esta pasta.');
    },
    '#FollowupflagParamsError': function(){
	alert('Não foi possível sinalizar esta mensagem. \nDetalhes do erro: mensagem não contém todos os atributos necessários.');
    }
    
}

function updateCacheFollowupflag(msgNumber, msgFolder, op){
	if(op){
		if(typeof msgNumber == 'object'){
			var extend = DataLayer.get('followupflagged', {
				filter: ['AND', ['IN', 'messageNumber', msgNumber], ['IN', 'folderName', msgFolder]],
				criteria: {deepness: 1}
			}, true);
		} else{
			var extend = DataLayer.get('followupflagged', {
				filter: ['AND', ['=', 'messageNumber', msgNumber], ['=', 'folderName', msgFolder]],
				criteria: {deepness: 1}
			}, true);
		}

		
		if(extend != "" || extend != 'undefined' || extend != []){
			for(var i = 0; i < extend.length; i++){
				if(!(onceOpenedHeadersMessages[extend[i].folderName])){
					onceOpenedHeadersMessages[extend[i].folderName] = {};
				}
				if(!(onceOpenedHeadersMessages[extend[i].folderName][extend[i].messageNumber])){
					onceOpenedHeadersMessages[extend[i].folderName][extend[i].messageNumber] = [];	
				}
				onceOpenedHeadersMessages[extend[i].folderName][extend[i].messageNumber]['followupflagged'] = {};
				DataLayer.merge(onceOpenedHeadersMessages[extend[i].folderName][extend[i].messageNumber]['followupflagged'], extend[i]);
				
				/*
				if(onceOpenedHeadersMessages[extend[i].folderName]){
					if(onceOpenedHeadersMessages[extend[i].folderName][extend[i].messageNumber]){
						onceOpenedHeadersMessages[extend[i].folderName][extend[i].messageNumber]['followupflagged'] = {};
						DataLayer.merge(onceOpenedHeadersMessages[extend[i].folderName][extend[i].messageNumber]['followupflagged'], extend[i]);
					}
				}*/

			}
		}
	}else{
		onceOpenedHeadersMessages[msgFolder][msgNumber]['followupflagged'] = undefined;	
	}
}

function init_followup(data){

	winElement = data.window;
	selectedMessageIds = data.selectedMessages;
	folder = current_folder;

	/**
	 * Implementação do widget de input-combobox
	 */
 
	(function( $ ) {
		$.widget( "ui.combobox", {
			_create: function() {
				var self = this,
					select = this.element.hide(),
					selected = select.children( ":selected" ),
					value = selected.val() ? selected.text() : "";
				var input = this.input = $( "<input>" )
					.insertAfter( select )
					.val( value )
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: function( request, response ) {
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
							response( select.children( "option" ).map(function() {
								var text = $( this ).text();
								if ( this.value && ( !request.term || matcher.test(text) ) )
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
							}) );
						},
						select: function( event, ui ) {
							ui.item.option.selected = true;
							self._trigger( "selected", event, {
								item: ui.item.option
							});
						},
						change: function( event, ui ) {
							if ( !ui.item ) {
								var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
									valid = false;
								select.children( "option" ).each(function() {
									if ( $( this ).text().match( matcher ) ) {
										this.selected = valid = true;
										return false;
									}
								});
								/*
								if ( !valid ) {
									// remove invalid value, as it didn't match anything
									$( this ).val( "" );
									select.val( "" );
									input.data( "autocomplete" ).term = "";
									return false;
								}
								*/
								if ( !valid ) {
									if(select.has('option[value="custom"]').length > 0) {
										select.find('option:last').val('custom').html($(this).val()).attr('selected', 'selected');
									} else {
										select.append(select.find('option:last').clone().val('custom').html($(this).val()));
										select.find('option[value="custom"]').attr('selected', 'selected');
									}
								}
							}
						}
					})
					.addClass( "ui-widget ui-widget-content ui-corner-left" );

				input.data( "autocomplete" )._renderItem = function( ul, item ) {
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( "<a>" + item.label + "</a>" )
						.appendTo( ul );
				};

				this.button = $( "<button type='button'>&nbsp;</button>" )
					.attr( "tabIndex", -1 )
					.attr( "title", "Show All Items" )
					.insertAfter( input )
					.button({
						icons: {
							primary: "ui-icon-triangle-1-s"
						},
						text: false
					})
					.removeClass( "ui-corner-all" )
					.addClass( "ui-corner-right ui-button-icon" )
					.click(function() {
						// close if already visible
						if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
							input.autocomplete( "close" );
							return;
						}

						// work around a bug (likely same cause as #5265)
						$( this ).blur();

						// pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "" );
						input.focus();
					});
			},

			destroy: function() {
				this.input.remove();
				this.button.remove();
				this.element.show();
				$.Widget.prototype.destroy.call( this );
			}
		});
	})( jQuery );
	/**
	 * #END: Implementação do widget de input-combobox
	 */

	winElement.find('.button').button()
	.filter('.menu-configure-followupflag .cancel').click(function(){
		winElement.dialog("close");
	}).end()
	
	.filter('.menu-configure-followupflag .save').click(function(){	
	var saveFollowupflagged = function(){
		var idFollowupflagged = winElement.find('[name="followupflagId"]').val();
			idFollowupflagged = idFollowupflagged.split(',');
			for(x=0; x<idFollowupflagged.length; x++){
				(idFollowupflagged[x] == "false") ? idFollowupflagged[x] = false : idFollowupflagged;
			}
		for(i=0; i<selectedMessageIds.length; i++){
				var isDone = winElement.find('[name="done"]').is(':checked') ? 1 : 0;
				var alarmDate = false;
				var doneDate  = false;
				var folder_name;
				var folders = [];
				var messages = [];
				var roles = get_selected_messages_search_role().split(',');
				for (var i=0; i < selectedMessageIds.length; i++ ){
					if (currentTab == 0) {
						folder_name = current_folder;
						var messageNumber = selectedMessageIds[i];
					}else{
						var tr = $('[role="'+roles[i]+'"]');
						folder_name = $(tr).attr('name'); 
						var id = $(tr).attr('id'); 
						var messageNumber = id.replace(/_[a-zA-Z0-9]+/,"");
					}
					folders.push(folder_name);
					
						var followupflagged = DataLayer.merge({
							uid : User.me.id,
							followupflagId : followupflagId, 
							folderName : folder_name, 
							messageNumber : messageNumber,
							isDone: isDone,
							backgroundColor : backgroundColor
						}, !!idFollowupflagged[i] ? {id: idFollowupflagged[i]} : {});
					
					if (alarmDate = winElement.find('[name="alarmDate"]').datepicker("getDate")) {
						if (alarmTime = winElement.find('[name="alarmTime"]').datepicker("getDate")) {
							alarmDate.set({hour:alarmTime.getHours(), minute:alarmTime.getMinutes()});
						}
						followupflagged.alarmDeadline = alarmDate.toString('yyyy-MM-dd HH:mm:ss');
					}

					if (doneDate = winElement.find('[name="doneDate"]').datepicker("getDate")) {
						if (doneTime = winElement.find('[name="doneTime"]').datepicker("getDate")) {
							doneDate.set({hour:doneTime.getHours(), minute:doneTime.getMinutes()});
						}
						followupflagged.doneDeadline = doneDate.toString('yyyy-MM-dd HH:mm:ss');
					}
					
					/**
					 * Aplica o ícone correspondente na lista de mensagens do expressoMail
					 */
					if(current_folder == folder_name){
						var flagged = $('#td_message_followup_' + messageNumber + ', tr[role="'+messageNumber+'_'+folder_name+'"] #td_message_followup_search_' + messageNumber).find(".flag-edited");
					} else{
						var flagged = $('tr[role="'+messageNumber+'_'+folder_name+'"] #td_message_followup_search_' + messageNumber).find(".flag-edited");
					}
					if(isDone){
						flagged.find("img").attr("src", "../prototype/modules/mail/img/flagChecked.png").css("margin-left","-3px");
					}else{
						flagged.find("img").attr("src", "../prototype/modules/mail/img/flagEditor.png").css("margin-left","0");			
					}
					
					var followupflagName = winElement.find('[name="name"] option:selected').text();
					if(current_folder == folder_name){
						$('#td_message_followup_' + messageNumber + ', ' + 
						'tr[role="'+messageNumber+'_'+folder_name+'"] #td_message_followup_search_' + messageNumber).attr('title', followupflagName).find(".flag-edited").css("background", backgroundColor); 
					}else{
						$('tr[role="'+messageNumber+'_'+folder_name+'"] #td_message_followup_search_' + messageNumber).attr('title', followupflagName).find(".flag-edited").css("background", backgroundColor); 
					}  
					/**
					 * Salva ou, caso já exista, atualiza
					 */
					DataLayer.put('followupflagged', followupflagged);
				}
				
				DataLayer.commit(false, false, function(data){
					winElement.find('.menu-configure-followupflag .delete').button("option", "disabled", false);
					updateCacheFollowupflag(selectedMessageIds, folders, true);
					winElement.dialog("close");
					alarmFollowupflagged('followupflagAlarms');
				});
				winElement.find('.menu-configure-followupflag .save').button("option", "disabled", true);
				
		
		}
    }
		var backgroundColor = winElement.find('[name="backgroundColor"]').val();
		var followupflagId  = winElement.find('[name="name"] option:selected').val();
		if (followupflagId == 'custom') {
			DataLayer.put('followupflag', {name:winElement.find('[name="name"] option:selected').text(), uid:User.me.id});
			DataLayer.commit(false, false, function(data){
				$.each(data, function(index, value) {
					if(typeof value == 'object'){
						followupflagId = value.id;
					}
				});
				winElement.find('[name="name"] option[value="custom"]').val(followupflagId);
				saveFollowupflagged();
			});
		}else{
			saveFollowupflagged();
		}	

	}).end()
	
	.filter('.menu-configure-followupflag .delete').click(function(){
		if (selectedMessageIds.length == 0) $(this).button("option", "disabled", true);
		/** TODO Mudar quando melhorias forem implementadas na API de atualização do cache */
		DataLayer.remove('followupflagged', false);
		DataLayer.get('followupflagged');
		var roles = get_selected_messages_search_role().split(',');
		for (var i=0; i < selectedMessageIds.length; i++ ){
				if (currentTab == 0) {
					folder_name = current_folder;
					var messageNumber = selectedMessageIds[i];
				}else{
					var tr = $('[role="'+roles[i]+'"]');
					folder_name = $(tr).attr('name'); 
					var id = $(tr).attr('id'); 
					var messageNumber = id.replace(/_[a-zA-Z0-9]+/,"");
				}				
				
			if(onceOpenedHeadersMessages[folder_name][messageNumber]['followupflagged']){
				if(onceOpenedHeadersMessages[folder_name][messageNumber]['followupflagged'].id){
					var flag_id = onceOpenedHeadersMessages[folder_name][messageNumber]['followupflagged'].id;
					DataLayer.remove('followupflagged', flag_id );
					/**
					 * TODO - corrigir o formato do ID no DataLayer, para que seja utilizado o ID composto
					 * ao invés do ID do PostgreSQL atualmente em uso.
					 */
					 
					/**
					 * # hack necessário enquanto o DataLayer não reconhece o ID composto. Trocar o 
					 * código abaixo pela chamada trivial de DataLayer.remove('followupflagged', idCompost)
					 */
					// var data = {};
					// data[ 'followupflagged://' + folder_name + '/' + messageNumber + '#' + flag_id ] = false;
					// DataLayer.dispatch('Sync', data, false, true);
					
					if(current_folder == folder_name){
						$('#td_message_followup_' + messageNumber + ', ' + 
						  'tr[role="'+messageNumber+'_'+folder_name+'"] #td_message_followup_search_' + messageNumber).attr('title', '').find(".flag-edited").css("background", '#CCC');
						$('#td_message_followup_' + messageNumber + ', ' + 
							'tr[role="'+messageNumber+'_'+folder_name+'"] #td_message_followup_search_' + messageNumber).find(".flag-edited")
							.find("img").attr("src", "../prototype/modules/mail/img/flagEditor.png").css("margin-left","0");
					}else{
						$('tr[role="'+messageNumber+'_'+folder_name+'"] #td_message_followup_search_' + messageNumber).attr('title', '').find(".flag-edited").css("background", '#CCC');
						$('tr[role="'+messageNumber+'_'+folder_name+'"] #td_message_followup_search_' + messageNumber).find(".flag-edited")
							.find("img").attr("src", "../prototype/modules/mail/img/flagEditor.png").css("margin-left","0");
					}
					updateCacheFollowupflag(messageNumber, folder_name, false);
				}
			}
		}
		DataLayer.commit(false, false, function(){
			winElement.dialog("close");
			alarmFollowupflagged('followupflagAlarms');
		});
		
	});
	
	/**
	 * Se houver mudança, habilita o botão "Save"
	 */
	winElement.find(':input').change(function(event){
		if (event.keyCode != '27' && event.keyCode != '13')
			winElement.find('.menu-configure-followupflag .save').button("option", "disabled", false);
	}).keydown(function(event){
		if (event.keyCode != '27' && event.keyCode != '13')
			winElement.find('.menu-configure-followupflag .save').button("option", "disabled", false);
	});
	
	winElement.find('.date').datepicker();
	winElement.find('.time').timepicker({});
	winElement.find('[name="name"]').combobox()
	//pega o botão criado
	.next().next().click(function (event, ui){ 	
		$(".ui-autocomplete.ui-menu li").css("position","relative");
		$(".ui-autocomplete.ui-menu li a:gt(5)").append("<span class='ui-icon ui-icon-only ui-icon-close delete_followupflag'></span>").find("span").click(function(event){
			var id = $('.followupflag-configure').find('option')[$(this).parents('li').index()].value;
			var nameFollowupflag = $('.followupflag-configure').find('option')[$(this).parents('li').index()].text;
			var removeLi = $(this).parents("li");		
			
			$.Zebra_Dialog(get_lang('All messages flagged with the flag type ') + '<strong>'+ nameFollowupflag + '</strong>' + get_lang(' will be removed. This action cannot be undone. Want to continue?'), {
				'type':     'question',
				'custom_class': (is_ie ? 'configure-zebra-dialog' : ''),
				'title':    'Atenção',
				'buttons': ['Sim','Não'],		
				'overlay_opacity': '0.5',
				'onClose':  function(caption) {
					if(caption == 'Sim'){
						var listFollowupflag = DataLayer.get('followupflagged', ['=', 'followupflagId', id]);
						for (var i=0; i < listFollowupflag.length; i++)
							DataLayer.remove('followupflagged', listFollowupflag[i].id);

						DataLayer.remove('followupflag',false);					
						DataLayer.get('followupflag');

						DataLayer.remove('followupflag', ''+id);						
						DataLayer.commit(false, false, function(data){
							$('[title="'+nameFollowupflag+'"]').attr('title', '').find('div').css({backgroundColor:'#CCC'});
							$(removeLi).remove();
							$('option[value="'+ id +'"]').remove();
							$('.ui-autocomplete.ui-menu li:first');	
							$('.followupflag-configure').find('option:first').attr("selected","selected");							
							$('.ui-autocomplete-input').val($('.followupflag-configure').find('option:selected').text());
							
							for(var i=0; i<listFollowupflag.length; i++){
								if(listFollowupflag[i].id == winElement.find('[name="followupflagId"]').val()){
									winElement.find('[name="followupflagId"]').val("");
								}
							}						
						});			
						event.stopImmediatePropagation();
					}
				}
			});	
			if(is_ie)
				$(".ZebraDialogOverlay").css("z-index","1006");	
		});

	});
	winElement.find('.ui-corner-right.ui-button-icon').attr('title', get_lang('Show All Items'));

	winElement.find('[name="alarmDate"],[name="alarmTime"]').attr("disabled","disabled");
	
	winElement.find('[name="alarm"]').click(function(){
		if($(this).is(":checked")){
			winElement.find('[name="alarmDate"],[name="alarmTime"]').removeAttr("disabled");			
		}else{
			winElement.find('[name="alarmDate"],[name="alarmTime"]').attr("disabled","disabled");
		}
	});
	if(winElement.find('[name="alarm"]').is(":checked")){
		winElement.find('[name="alarmDate"],[name="alarmTime"]').removeAttr("disabled");
	}
	winElement.find('[name="done"]').click(function(){
		if($(this).is(":checked")){
			winElement.find(".input-done input").attr("disabled","disabled");
		}else{
			winElement.find(".input-done input").removeAttr("disabled");
		}
	});


	winElement.find(".followupflag-color-fields").hide();
	winElement.find(".followupflag-color.sample-list .sample-item").click(function(){
		winElement.find('.menu-configure-followupflag .save').button("enable");
		winElement.find(".followupflag-color.sample-list .sample-item").removeClass("selected");
		$(this).addClass("selected");
		var color = $(this).attr('alt');
		winElement.find('[name="backgroundColor"]').css('background-color', color).val(color)
	});
	
	winElement.find(".followupflag-color.sample-list .sample-item.selected").trigger('click');
				
	winElement.find('[name="setColor"]').change(function(){	
		if(winElement.find('[name="setColor"]').val() == "default"){
			winElement.find(".followupflag-color.sample-list").show("fast");
			winElement.find(".followupflag-color-fields").hide();
			winElement.find(".followupflag-color.sample-list .sample-item.selected").trigger('click');
		} else if(winElement.find('[name="setColor"]').val() == "custom"){	
			winElement.find(".followupflag-color-fields").show("fast");
			winElement.find(".followupflag-color.sample-list").hide();
			winElement.find(".colorwell").focus();
		}		
	});
	
	if(winElement.find('[name="setColor"] option:selected').val() == "custom"){
		winElement.find('[name="setColor"]').trigger("change");
	}

	var colorpickerPreviewChange = function(color) {
		winElement.find('.menu-configure-followupflag .save').button("enable");
		winElement.find('.colorwell-selected').val(color).css('background-color', color);
		winElement.find('.flag-color-preview').css('background',color);
	} 

	var f = $.farbtastic(winElement.find('.colorpicker'), colorpickerPreviewChange);
	var selected;					
	winElement.find('.colorwell').each(function () {
		f.linkTo(this);
	}).focus(function() {
		if (selected) {
			$(selected).removeClass('colorwell-selected');
		}
		$(selected = this).addClass('colorwell-selected');
		f.linkTo(this, colorpickerPreviewChange);
		f.linkTo(colorpickerPreviewChange);
		
	});
	if(winElement.find('[name="setColor"] option:selected').val() == "custom"){
		winElement.find(".colorwell").focus();
	}

}


/**
 * constrói as três possíveis janelas de alerta, utilizando o mesmo template
 * para o parametro alert_type, espera-se vazio, followupflagAlarms ou filtersAlarms
 * vazio: quando serão carregadas todas as modais de alarmes
 * followupflagAlarms: quando serão carregadas as modais referentes à sinalizações
 * filtersAlarms: quando será carregada a modal de filtros (nesse caso o parametro filter_list deve conter a lista de mensagens a ser exibida na modal)
 */
function alarmFollowupflagged(alert_type, filter_list){
	switch(alert_type){
		// carregar modais de sinalizadores
		case 'followupflagAlarms':
			$('.doneDeadline').remove();
			$('.alarmDeadline').remove();
			var toIterate = [
				{
					attrDeadline: 'doneDeadline', 
					caption: {singular:'You have one undone message today:', 
					plural:"You have %1 undone messages today:"
					},
					title: get_lang('Done'),
					enable: ($.cookie("fadeCompleted") != (new Date).toString("dd/MM/yyyy"))
				},
				{
					attrDeadline: 'alarmDeadline',
					caption: {
						singular:'You have a follow up due for today:', 
						plural:'You have %1 follow ups due for today:'
					},
					title: get_lang('Follow ups'),
					enable: ($.cookie("fadeAlarm") != (new Date).toString("dd/MM/yyyy"))
				}
			];
			break;
		// carregar modal de filtros
		case 'filtersAlarms':
			$('.filtersDeadline').remove();
			var toIterate = [
				{
					attrDeadline: 'filtersDeadline',
					caption: {
						singular:'You have an archived message:', 
						plural:'You have %1 messages archived:'
					},
					title: get_lang('Filter by sender'),
					enable: ($.cookie("fadeFilterAlarm") != (new Date).toString("dd/MM/yyyy"))
				}
			];
			break;
		// carregar todas as modais
		default:
			$('.gray').remove();
			var toIterate = [
				{
					attrDeadline: 'filtersDeadline',
					caption: {
						singular:'You have an archived message:', 
						plural:'You have %1 messages archived:'
					},
					title: get_lang('Filter by sender'),
					enable: ($.cookie("fadeFilterAlarm") != (new Date).toString("dd/MM/yyyy"))
				},
				{
					attrDeadline: 'doneDeadline', 
					caption: {singular:'You have one undone message today:', 
					plural:"You have %1 undone messages today:"
					},
					title: get_lang('Done'),
					enable: ($.cookie("fadeCompleted") != (new Date).toString("dd/MM/yyyy"))
				},				
				{
					attrDeadline: 'alarmDeadline',
					caption: {
						singular:'You have a follow up due for today:', 
						plural:'You have %1 follow ups due for today:'
					},
					title: get_lang('Follow ups'),
					enable: ($.cookie("fadeAlarm") != (new Date).toString("dd/MM/yyyy"))
				}
			];
			break;
	}
	var i = 0;
	// recupera e monta os dados para serem exibidos nas modais de alarmes
	while (it = toIterate.pop()){
		if (!it.enable) continue;
		
		var alarmInRange = {};
		// caso for alarme de sinalizadores
		if(it.attrDeadline == 'doneDeadline' || it.attrDeadline == 'alarmDeadline'){
			alarmInRange = DataLayer.get('followupflagged', {filter: ['AND', ['>', it.attrDeadline, (new Date()).set({hour:0, minute:0, second:0}).toString('yyyy-MM-dd 00:00:00')], ['<', it.attrDeadline, (new Date()).set({hour:0, minute:0, second:0}).addHours(24).toString('yyyy-MM-dd 00:00:00')]], criteria: {deepness: 1}});
			if(alarmInRange.length > 0){
				for(var i=0; i<alarmInRange.length; i++){
					if(alarmInRange[i].isDone == 1){
						 alarmInRange.splice(i,1);
						 i--;
					}
				}
			}
			
			if(alarmInRange.length > 0){
				var messages_alarm = [];
				for(var i=0; i<alarmInRange.length; i++){
					var date = Date.parseExact(alarmInRange[i][it.attrDeadline], 'yyyy-MM-dd HH:mm:ss');
					if(date)
						alarmInRange[i][it.attrDeadline] = date.toString('HH:mm');
					
					if(alarmInRange[i]['followupflag']['id'] < 7){
						var nameFollowupflag = get_lang(alarmInRange[i]['followupflag']['name']);
					}else{
						var nameFollowupflag = alarmInRange[i]['followupflag']['name'];
					}
					var li_alarm = alarmInRange[i][it.attrDeadline] + ' - ' + nameFollowupflag + ' - ' + truncate(alarmInRange[i]['message']['headers']['subject'], 15);
					messages_alarm.push({
						"msg_number" : alarmInRange[i]['messageNumber'],
						"msg_folder" : alarmInRange[i]['folderName'],
						"a"			 : li_alarm
					}); 				
				}
			}
		} 
		// caso for alarme de filtros
		else if(filter_list){
			alarmInRange = filter_list;
			if(alarmInRange.length > 0){
				var messages_alarm = [];
				for(var i=0; i<alarmInRange.length; i++){
					var d = new Date(alarmInRange[i]['udate']*1000);
					var dia = d.getDate();
					if(dia < 10){
						dia = "0" + dia;
					}
					var mes = (d.getMonth()) + 1;
					if(mes < 10){
						mes = "0" + mes;
					}
					var ano = d.getFullYear();
					var dtFormatada = dia + '/' + mes + '/' + ano;
					alarmInRange[i]['udate'] = dtFormatada;
						
					var li_alarm = alarmInRange[i]['udate'] + ' ' + alarmInRange[i]['smalldate'] + ' - ' + alarmInRange[i]['from'] + ' - ' + truncate(alarmInRange[i]['subject'], 15);
					messages_alarm.push({
						"msg_number" : alarmInRange[i]['msg_number'],
						"msg_folder" : alarmInRange[i]['msg_folder'],
						"a"			 : li_alarm
					}); 				
				}
			}
		}
				
		if(alarmInRange.length > 0){
			// monta o subtitulo da modal
			var caption = (alarmInRange.length == 1) ?
				get_lang(it.caption.singular):
				get_lang(it.caption.plural, alarmInRange.length);
			// monta o array de dados a ser passado para o template	
			var data = {
				alarmInRange : messages_alarm, 
				caption: caption, 
				type: it.attrDeadline,
				captions: it.caption
			};
			// tipo de modal a ser exibida
			var type_alarm = it.attrDeadline;
			//função chamada ao clicar no botão Ok da modal
			var ok_function = function(event, type, type_cookie){
				if($(event.target).parents('.'+type).find('[name="stopAlert"]').is(':checked')){
					$.cookie(type_cookie, (new Date).toString("dd/MM/yyyy"), { 
						expires: 1 
					});
				}
			}
			// carrega o template dos alarmes e cria a modal utilizando o plugin freeow
			var dialogText = DataLayer.render("../prototype/modules/mail/templates/followupflag_alarm_list.ejs", data);
			var titulo = '<div class="header-alarm"><span class="img_title"></span><span class="title-alarm"><strong>'+it.title+'</strong></span><span name="header-icon" class="maximize-alarm"></span></div>';
			$("#freeow").freeow(titulo, dialogText, {
				classes: ["gray", type_alarm],
				autoHide: false, 
				startStyle: null,
				onClick: function(event){
					var type = '';
					var type_cookie = '';
					if($(this).hasClass('alarmDeadline')){
						type = 'alarmDeadline';
						type_cookie = 'fadeAlarm';
					}else if($(this).hasClass('doneDeadline')){
						type = 'doneDeadline';
						type_cookie = 'fadeCompleted';
					}else if($(this).hasClass('filtersDeadline')){
						type = 'filtersDeadline';
						type_cookie = 'fadeFilterAlarm';
					}
					if($(event.target).hasClass('stop-alert-alarm')){
						return;
					}
					if($(event.target).hasClass('minimize-alarm')){
						$('.'+type).find('.content-alarm').hide();
						$(event.target).removeClass('minimize-alarm').addClass('maximize-alarm');
						return;
					}
					if($(event.target).hasClass('maximize-alarm')){
						$('.'+type).find('.content-alarm').show();
						$(event.target).removeClass('maximize-alarm').addClass('minimize-alarm');
						return;
					}
					if($(event.target).hasClass('confirm-alarm')){
						ok_function(event, type, type_cookie);
						$('.'+type).remove();
						return;
					}
					return false;
				}
			});
			// elementos do freeow desnecessários
			$('.gray .background .content p').remove();
			$('.gray .icon').remove();
			$('.gray .close').remove();
			
			// botão ok da modal com jquery button
			$('.content-alarm button').button();
		}		
	}
	
	// controle de qual janela de alarme estará maximizada
	$('.gray').find('.content-alarm').hide();
	$('.gray').find('.header-alarm [name="header-icon"]').removeClass('minimize-alarm').addClass('maximize-alarm');
	
	if($('.gray').length > 0){
		if($('.gray').hasClass('filtersDeadline')){
			$('.filtersDeadline').find('.content-alarm').show();
			$('.filtersDeadline .header-alarm [name="header-icon"]').removeClass('maximize-alarm').addClass('minimize-alarm');
		}else if($('.gray').hasClass('alarmDeadline')){
			$('.alarmDeadline').find('.content-alarm').show();
			$('.alarmDeadline .header-alarm [name="header-icon"]').removeClass('maximize-alarm').addClass('minimize-alarm');	
		}else if($('.gray').hasClass('doneDeadline')){
			$('.doneDeadline').find('.content-alarm').show();
			$('.doneDeadline .header-alarm [name="header-icon"]').removeClass('maximize-alarm').addClass('minimize-alarm');	
		}
	}
	
}
		
$('#main_table').ready(function(){
	handlerMessageFilter = function (data) {
		alarmFollowupflagged(null, data);
	}
	/* Busca  nas pastas indexadas para ver se há novas mensagens com a flag $FilteredMessage */
	cExecute ("$this.imap_functions.getFlaggedAlertMessages&folders="+fromRules, handlerMessageFilter);
});

