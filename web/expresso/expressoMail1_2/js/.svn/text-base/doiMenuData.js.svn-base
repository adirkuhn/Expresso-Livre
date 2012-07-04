function labeledMessages(isLabel){
			if (isLabel) {
				var label = {
					id: isLabel
				}	
				var lableleds = new Array();
				var msg_folder = current_folder;
				var messages = new Array();
				if(currentTab == 0){
					var id = get_selected_messages().split(',');
					for (i = 0; i < id.length; i++){
						messages.push({
							msg_number: id[i],
							msg_folder: msg_folder
						});
					}
				}else{
					// var id = get_selected_messages_search().split(',');
					// var id_border = currentTab.replace(/[a-zA-Z_]+/, "");
					// for (i = 0; i < id.length; i++){
						// var tr = Element(id[i]+'_s'+id_border);
						// msg_folder = tr.getAttribute('name'); 
						// messages.push({
							// "msg_number": id[i],
							// "msg_folder": msg_folder,
						// });
					// }	
					
					var roles = get_selected_messages_search_role().split(',');
					for (i = 0; i < roles.length; i++){
						var tr = $('[role="'+roles[i]+'"]');
						msg_folder = $(tr).attr('name'); 
						var id = $(tr).attr('id'); 
						messages.push({
							"msg_number": id.replace(/_[a-zA-Z0-9]+/,""),
							"msg_folder": msg_folder
						});
					}
				}

				for (var i=0; i < messages.length; i++) {
					var hasLabel = DataLayer.get('labeled', {
						filter: [
							'AND',
							['=', 'labelId', label.id], 
							['=', 'folderName', messages[i].msg_folder], 
							['=', 'messageNumber', messages[i].msg_number]
					]});
					if (!hasLabel || hasLabel == "") {
						lableleds.push(
							DataLayer.put('labeled', {
								labelId:label.id, 
								folderName:messages[i].msg_folder, 
								messageNumber:messages[i].msg_number
							})
						);
						
					}
				}
				DataLayer.commit(false, false, function(data){
					for (var i=0; i < messages.length; i++) {
						updateLabelsColumn({msg_number:messages[i].msg_number, boxname:messages[i].msg_folder, labels:false});
					}		
				});
				

			}
}

function openListUsers(border_id) {
	connector.loadScript("QuickCatalogSearch");
	if (typeof(QuickCatalogSearch) == 'undefined'){
					setTimeout('openListUsers('+border_id+')',500);
					return false;
				}
	QuickCatalogSearch.showCatalogList(border_id);
}


/**
 * Cria a lista de marcadores para o submenu "Marcadores"
 */
function getLabels(){
	var labels = DataLayer.get('label',{criteria:{order: 'name'}});
	var menuLabelItems = {};
		menuLabelItems["new"] = {
			"name" : get_lang('New Label'),
			callback:function() {configureLabels({applyToSelectedMessages:true});}
		};
	for(var i=0; i<labels.length; i++) {
		menuLabelItems["label"+labels[i].id] = {
			"name" : labels[i].name
		}
	}
	return menuLabelItems;
}

/**
 *	Carrega o menu de opção de uma mensagem
 */
function loadMenu(){
	var labelItems = getLabels();
	$.contextMenu({
		selector: ".table_box tbody tr",
		callback: function(key, options) {
			//TODO - default actions
			
			/** 
			 * Apply labels to selected messages
			 */
			var isLabel = key.match(/label(.*)/);
			if (isLabel && isLabel.length > 1) {
				labeledMessages(isLabel[1]);
			}

		},
		items: {
			"flagSeen":      {"name": get_lang("Mark as") + " " + get_lang('seen'), "icon": "seen", callback: function(key, opt){ proxy_mensagens.proxy_set_messages_flag('seen','get_selected_messages'); }},
			"flagUnseen":    {"name": get_lang("Mark as") + " " + get_lang('unseen'), "icon": "unseen", callback: function(key, opt){ proxy_mensagens.proxy_set_messages_flag('unseen','get_selected_messages'); }},
			"flagFlagged":   {"name": get_lang("Mark as") + " " + get_lang('important'), "icon": "important", callback: function(key, opt){ proxy_mensagens.proxy_set_messages_flag('flagged','get_selected_messages'); }},
			"flagUnflagged": {"name": get_lang("Mark as") + " " + get_lang('normal'), callback: function(key, opt){ proxy_mensagens.proxy_set_messages_flag('unflagged','get_selected_messages'); }},
			
			"sep1": "---------",
			"label": { "name": get_lang("Labels"), "items": labelItems},
			"follouwpflag":{"name": get_lang("Follow up"), callback: function(key, opt){ configureFollowupflag(); } },
			
			"sep2": "---------",
			"move": {"name": get_lang("Move to")+"...", "icon": "move", callback: function(key, opt){ wfolders.makeWindow('', 'move_to'); }},
			"remove": {"name": get_lang("Delete"),      "icon": "delete", callback: function(key, opt){ proxy_mensagens.delete_msgs('null','selected','null'); }},
			"export": {"name": get_lang("Export"),      "icon": "export", callback: function(key, opt){ proxy_mensagens.export_all_messages(); }}
		}
	});
}
/*FIM*/
loadMenu();

if (!expresso_offline) {
	var menuToolsItems = {
		"i01": {"name": get_lang("Preferences"), "icon": "preferences-mail", callback: preferences_mail },
		"i02": {"name": get_lang("Search"), "icon": "search-mail", callback: function(key, opt){ search_emails(""); }},
		"103": {"name": get_lang("Edit filters"), "icon": "filter", callback: filterbox2 },
		"i04": {"name": get_lang("Edit folders"), "icon": "edit-folder", callback: folderbox },
		"i05": {"name": get_lang("Share mailbox"), "icon": "share-mailbox", callback: sharebox },
		"i06": {"name": get_lang("Labels"), "icon": "tag", callback: configureLabels }, 
		"i08": {"name": get_lang("Empty trash"), "icon": "empty-trash", callback: function(key, opt){ empty_trash_imap(); }}
	};
		
	if(preferences.use_local_messages==1) {
		if(expresso_local_messages.is_offline_installed()) {
			menuToolsItems["i09"] = {"name": get_lang("Send from queue"), "icon": "queue", callback: force_check_queue };
		}
	}
} else {
	var menuToolsItems = {
		"i01": {"name": get_lang("Search"), "icon": "search-mail", callback: function(key, opt){ search_emails(""); }},
		"i02": {"name": get_lang("Edit folders"), "icon": "edit-folder", callback: folderbox }
	}
}
$.contextMenu({
	selector: "#link_tools",
	trigger: 'hover',
	className: 'context-menu-tools',
	position: function($menu, x, y){
		$menu.$menu.position({ my: "center top", at: "center bottom", of: this, offset:"0 0"});
	},
	determinePosition: function($menu, x, y){
		$menu.css('display', 'block').position({ my: "center top", at: "center bottom", of: this}).css('display', 'none');
	},
	delay:500,
	autoHide:true,
	events: {
		show: function(opt) {
			var $trigger = $(opt.selector).css({'background-color': '#ffffff', 'border': '1px solid #CCCCCC'});
			$('.context-menu-tools.context-menu-list.context-menu-root').css({'width': $trigger.css('width') });
			$('.context-menu-tools.context-menu-list').css({'background': '#ffffff'})
			.find(".context-menu-item").css({'background-color': '#ffffff'}).hover(
				function(){
					$(this).css({'background-color': '#CCCCCC'});
				}, 
				function(){
					$(this).css({'background-color': '#ffffff'});
				}
			);
			return true;
		},
		hide: function(opt) {
			$(opt.selector).css({'background-color': '', 'border': 'none'});
			return true;
		}
	},
	callback: function(key, options) {
		//TODO - default actions

	},
	items: menuToolsItems
});
var reComplexEmail = /<([^<]*)>[\s]*$/;
$.contextMenu({
	selector: ".box",
	autoHide:true,
	items: {
		"add" : {name: get_lang("Quick Add"), icon : "quick-add",callback: function(key, opt){ var fname = $(opt.$trigger).find("input").val().split('"')[1];ccQuickAddOne.showList(','+fname+', ,'+$.trim($(opt.$trigger).find("input").val()).match(reComplexEmail)[1]); }},
		"remove" : {name:get_lang("Remove recipient"), icon:"delete-box",callback: function(key, opt){ $(opt.$trigger).remove(); }},
		"sep1": "---------",
		"quick_search" : {name:get_lang("Quick search of messages"), icon: "quick-search-contact",callback: function(key, opt){ search_emails($.trim($(opt.$trigger).find("input").val()).match(reComplexEmail)[1]); }},
		"full_search" : {name:get_lang("Search messages of ..."), icon: "quick-search-contact",callback: function(key, opt){ search_emails("", $.trim($(opt.$trigger).find("input").val()).match(reComplexEmail)[1]);}}		
	}
});

function updateLabelsColumn(messageInfo) {
	var msg_number = messageInfo.msg_number;
	//uid é o numero da mensagem quando os dados são carregados na busca rapida.
	if(messageInfo.uid != '' && messageInfo.uid != 'undefined' && messageInfo.uid != null){
		msg_number = messageInfo.uid;
	}
	var msg_folder = current_folder;
	if(messageInfo.boxname != '' && messageInfo.boxname != 'undefined' && messageInfo.boxname != null){
		msg_folder = messageInfo.boxname;
	}
	
	 if(current_folder == msg_folder || !current_folder){
		 $('#td_message_labels_' + msg_number +', tr[role="'+msg_number+'_'+msg_folder+'"] #td_message_labels_search_' + msg_number)
		 .html('<img src="../prototype/modules/mail/img/tag.png">');
	}else{
		$('tr[role="'+msg_number+'_'+msg_folder+'"] #td_message_labels_search_' + msg_number)
		.html('<img src="../prototype/modules/mail/img/tag.png">');
	}
	
	var menuItems = {};
	if (messageInfo.labels) {
		if($.isArray(messageInfo.labels)){
			var labels = messageInfo.labels;
			messageInfo.labels = {};
			for(var i in labels)
				messageInfo.labels[labels[i].id] = {backgroundColor: labels[i]['backgroundColor'],
					borderColor: labels[i]['borderColor'],
					fontColor: labels[i]['fontColor'], id: labels[i]['id'], name: labels[i]['name'], 
					uid: labels[i]['uid'] }
		}	
		menuItems = messageInfo.labels;
	} else {
		var labeleds = DataLayer.get('labeled', {
			criteria: {deepness: '2'},
			filter: [
				'AND',
				['=', 'folderName', msg_folder], 
				['=', 'messageNumber', msg_number]
			]
			
		});
		if (labeleds) {
			for (var i=0; i < labeleds.length; i++)
				menuItems[labeleds[i].label.id] = labeleds[i].label;
		} else {
			$('#td_message_labels_' + msg_number +', tr[role="'+msg_number+'_'+msg_folder+'"] #td_message_labels_search_' + msg_number)
			.html('');
			//$.contextMenu( 'destroy', '#td_message_labels_' + msg_number +', #td_message_labels_search_' + msg_number+':first');
			$.contextMenu( 'destroy', '#td_message_labels_' + msg_number +', tr[role="'+msg_number+'_'+msg_folder+'"] #td_message_labels_search_' + msg_number);
			return false;
		}
	}
	var menuItensLabel = {};
	for(index in menuItems){
		menuItensLabel[index] = {type: "label", customName: menuItems[index].name, id: msg_folder+"/"+msg_number+"#"+index};		
	}
	$.contextMenu.types.label = function(item, opt, root) {
        $('<span>'+item.customName+'</span><span class="removeLabeled" title="'+get_lang("Remove Label")+'">x</span>')
            .appendTo(this);
		$(this).find('span.removeLabeled').click(function(){
			//TODO Mudar quando API abstrair atualizações no cache
			DataLayer.remove('labeled', false);
			DataLayer.get('labeled');
			DataLayer.remove('labeled', item.id);
			DataLayer.commit(false, false, function(){
				updateLabelsColumn({msg_number:msg_number, boxname:msg_folder, labels:false});
			});
		});
	};
	if(current_folder == msg_folder || !current_folder){
		$.contextMenu( 'destroy', '#td_message_labels_' + msg_number +', tr[role="'+msg_number+'_'+msg_folder+'"] #td_message_labels_search_' + msg_number);
		$.contextMenu({
			selector: '#td_message_labels_' + msg_number +', tr[role="'+msg_number+'_'+msg_folder+'"] #td_message_labels_search_' + msg_number,
			trigger: 'hover',
			delay:100,
			autoHide:true,
			callback: function(key, options) {
				//TODO - default actions
			},
			items: menuItensLabel
		});
	}else{
		$.contextMenu( 'destroy', 'tr[role="'+msg_number+'_'+msg_folder+'"] #td_message_labels_search_' + msg_number);

		$.contextMenu({
			selector: 'tr[role="'+msg_number+'_'+msg_folder+'"] #td_message_labels_search_' + msg_number,
			trigger: 'hover',
			delay:100,
			autoHide:true,
			callback: function(key, options) {
				//TODO - default actions
			},
			items: menuItensLabel 
		});	
	}
}

function loadExtraLDAPBox(data, element){
	menuItensLabel = {};
	menuItensLabel["Name"] = {name: "<b>"+data[0].value+"</b>", disabled: true};		
	menuItensLabel["Email"] = {name: data[1].value, disabled: true};	
	if(data[2].value){
		menuItensLabel["TelefoneLabel"] = {name: "<b>"+get_lang("Telephone")+"</b>", disabled: true};
		menuItensLabel["TelefoneValue"] = {name: data[2].value, disabled: true};
	}
	if(data[3]){
		if(data[3].value == "TRUE"){
			menuItensLabel["outOffice"] = {name: "<b>"+get_lang("Out of office")+"</b>", disabled: true};
			menuItensLabel["outOfficeValue"] = {name: data[4].value.substring(0, 20), disabled: true};
		}
	}
	$.contextMenu({
		selector: "#content_id_"+currentTab+" "+element+" .box-info",
		trigger: 'hover',
		delay:100,
		autoHide:true,
		items: menuItensLabel
	});	
}

function loadGroupBox(data, element){
	menuItensLabel = {};
	menuItensLabel["ContactGroupLabelAll"] = {name:"<b>"+get_lang("Group contacts")+"</b>", disabled: true};
	menuItensLabel["sep1"] = "---------";
	if(data.itens){
		var aux = 0;
		for(var item in data.itens){
			if(parseInt(item) <= 4){
				menuItensLabel["ContactGroupLabel"+item] = {name: "<b>"+data.itens[item].data[0].value+"</b>", disabled: true};
				menuItensLabel["ContactGroupValue"+item] = {name: data.itens[item].data[2].value, disabled: true};
			}else{
				aux++;
				if(aux == 1)
					menuItensLabel["MoreContactGroupValue"] = {name : get_lang("And more %1 contact", aux), disabled: true };
				else
					menuItensLabel["MoreContactGroupValue"] = {name : get_lang("And more %1 contact", aux)+"s", disabled: true };
			}
		}
	}
	$.contextMenu({
		selector: "#content_id_"+currentTab+" "+element+" .box-info",
		trigger: 'hover',
		delay:100,
		autoHide:true,
		items: menuItensLabel
	});	
}





