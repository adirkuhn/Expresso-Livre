// $.storage = new $.store();
 
isOffline = /[A-z0-9-_\/\.]*:offline\?(.*)/;
breakParams = /[&=]/;
dots = /\./gi;
dashes = /\//gi;
flags = [ 'Attachment', 'Forwarded' ,'Recent', 'Unseen',  'Answered',  'Draft',  'Deleted', 'Flagged', 'Followupflag', 'Label' ];

$.ajaxPrefilter(function( options, originalOptions, jqXHR ){

      var offlineAction = isOffline.exec( options.url );

      if( offlineAction )
      {
	  offlineAction = offlineAction[1] || "";
	
	  jqXHR.abort();

	  var params = {};
	  
	  if( offlineAction )
	      offlineAction +=  options.data ? "&" +  options.data : "";

	  offlineAction = offlineAction.split( breakParams );

	  for( var i = 0; i < offlineAction.length; )
	      params[ offlineAction[i++] ] = offlineAction[i++];

	  rest = params["q"].split("/");

	  if( !(rest.length % 2) )
	      var id = rest.pop();

	  var concept = rest.pop();

	  for( var i = 0; i < rest.length; )
	    params[ rest[i++] ] = rest[ i++ ];

	  switch( concept )
	  {
	    case "message":
	    {
		if( id ){
		    var mail = expresso_local_messages.get_local_mail( id );
		    mail.eml = expresso_local_messages.get_src( mail.url_export_file );

		    ( options.success || options.complete )( mail );
		    return;
		}

		var msgs = expresso_local_messages.get_local_range_msgs( params["folder"].replace(dots, "/").replace("local_messages/", ""),
									  params["rows"] * ( params["page"] - 1 ) + 1,
									  params["rows"], "SORTARRIVAL", (params["sord"] == "desc"),
									  "ALL", 1, 1 );

		for( var i = 0; i < msgs.length; i++ )
		{
		      msgs[i].size = msgs[i].Size;
		      msgs[i].timestamp = msgs[i].udate * 1000;
		      msgs[i].flags = [];

		      for( var ii = 0; ii < flags.length; ii++ )
			  if( f = $.trim( msgs[i][ flags[ii] ] ) )
			      msgs[i].flags[ msgs[i].flags.length ] =  f;

		      msgs[i].flags = msgs[i].flags.join(',');
		}

		( options.success || options.complete )( {"rows": msgs, 
							   "records": msgs.length,
							   "page": params["page"], 
							   "total": Math.ceil( msgs.num_msgs / params["rows"] )} );
	    }
	  }
      }
});

var BASE_PATH = '../prototype/';
//BASE_PATH = '../';
//encontra os pais de todas as pastas e cria uma nova estrutura adicionando os filhos a um array no atributo 'children' do respectivo pai
unorphanize = function(root, element) {
	var ok = false;
	for (var i=0; i<root.length; i++) {
		if (root[i].id == element.parentFolder) {
			element.children = new Array(); 
			root[i].children.push(element);
			return true;
		} else if (ok = unorphanize(root[i].children, element)) {
			break;
		}
	}

	return ok;
}

/* --- helpers --- */
bytes2Size = function(bytes) {
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return 'n/a';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	var size = (i<2) ? Math.round((bytes / Math.pow(1024, i))) : Math.round((bytes / Math.pow(1024, i)) * 100)/100;
	return  size + ' ' + sizes[i];
}

flags2Class = function(cellvalue, options, rowObject) {
	var classes = '';	
	cellvalue = cellvalue.split(',');
	cell = {
			Unseen: parseInt(cellvalue[0])  ? 'Unseen' : 'Seen', 
			Answered: parseInt(cellvalue[1]) ? 'Answered' : (parseInt(cellvalue[2]) ? 'Forwarded' : ''), 
			Flagged: parseInt(cellvalue[3]) ? 'Flagged' : '',
			Recent: parseInt(cellvalue[4])  ? 'Recent' : '', 			
			Draft: parseInt(cellvalue[5]) ? 'Draft' : ''		
		};
	for(var flag in cell){
		classes += '<span class="flags '+ (cell[flag]).toLowerCase() + '"' + (cell[flag] != "" ? 'title="'+ get_lang(cell[flag])+'"' : '')+'> </span>';	
	}
	if(rowObject.labels){	
		var titles = [];
		var count = 0;
		 for(i in rowObject.labels){
			titles[count] = " "+rowObject.labels[i].name;
			count++;
		}
		titles = titles.join();
		classes += '<span class="flags labeled" title="'+titles+'"> </span>';
	}else{
		classes += '<span class="flags"> </span>';
	}
	
	if(rowObject.followupflagged){		
		if(rowObject.followupflagged.followupflag.id < 7){
			var nameFollowupflag = get_lang(rowObject.followupflagged.followupflag.name);
		}else{
			var nameFollowupflag = rowObject.followupflagged.followupflag.name;
		}
		if(rowObject.followupflagged.isDone == 1){
			classes += '<span class="flags followupflagged" title="'+nameFollowupflag+'" style="background:'+rowObject.followupflagged.backgroundColor+';"><img style=" margin-left:-3px;" src="../prototype/modules/mail/img/flagChecked.png"></span>';
		}else{			
			classes += '<span class="flags followupflagged" title="'+nameFollowupflag+'" style="background:'+rowObject.followupflagged.backgroundColor+';"><img src="../prototype/modules/mail/img/flagEditor.png"></span>';
		}
		
	}

	return classes;
}

function numberMonths (months){
	switch(months){
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'June':
			return 6;
		case 'July':
			return 7;
		case 'Aug':
			return 8;
		case 'Sept':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		case 'Dec':
			return 12;
	}	
}

NormaliseFrom = function(cellvalue, options, rowObject) {
	rowObject['flags'] = rowObject['flags'].split(",");
	if(rowObject['flags'][rowObject['flags'].length-1] ==  1){
		return get_lang(special_folders["Drafts"]);
	}
	return cellvalue;	
}

NormaliseSubject = function(cellvalue, options, rowObject) {
	return html_entities(cellvalue);
}

date2Time = function (timestamp) {
	date = new Date();
	dat = new Date(timestamp);
	if ((date.getTime() - timestamp) < (24*60*60*1000)) {
		return '<span class="timable" title="'+dat.getTime()+'"></span>';
	} else {
		date = new Date(timestamp);
		if(is_ie){
			var b = date.toString().split(' ');
			var c = b[2] + "/" + numberMonths(b[1]) + "/" + b[5];
			return '<span class="datable">' + c + '</span>';
		}else{
			var b = date.toISOString().split("T")[0].split("-");
			var c = b[2] + "/" + b[1] + "/" + b[0];
			return '<span class="datable">' + c + '</span>';
		}
	}
}

changeTabIndex = function (elements) {
//	jQuery('#foldertree').attr('tabIndex', '1').focus();
}


selectedMessagesCount = function() {
	var byte_size = 0, total_messages = 0;
	for (var folder in selectedMessages) {
		for (var message in selectedMessages[folder]) {
			if (selectedMessages[folder][message]) {
				byte_size += parseInt(onceOpenedMessages[folder][message].size);
				total_messages++;
			}
		}
	}
	$("#selected_messages_number").html(total_messages).next().html(bytes2Size(byte_size));
	return total_messages;
}

var msgAttacherGrid = $("#message_attacher_grid"), msgsTotal = $("#selected_messages_number");
var lastLoadedMessages = [];
var onceOpenedMessages = [];
var selectedMessages   = {};
var selectedFolder     = {};

function adaptOffline( data )
{
    if( preferences.use_local_messages == 1 || expresso_offline)
    {
	var folders = expresso_local_messages.list_local_folders();
	
	var stripParents = /^(.*)\/([^\/]*)/;

	$.each( folders, function( i, folder ){
		
		  if(typeof(folder) == 'undefined')  return;
		  
	      var id = 'local_messages/' + folder[0];

	      var parts = stripParents.exec( id );
	  
	      data[data.length] = {'id' : id,
				    'commonName' : parts[2],
				    'parentFolder' : parts[1]};
	});
    }
	
    return( data );
	
}

$mailpreview_tabs_label_length = 15;

/* --- jQuery handlers --- */

jQuery('#buttons-container .button').button();

jQuery.ajax({
	url: BASE_PATH + "REST.php?q=folder",
	dataType: 'json',

	success: function( data ){

		data = adaptOffline( data );

		var tree1 = new Array();
		var tree2 = new Array();
		var tree3 = new Array();
		for (var i=0; i<data.length; i++) {

			if (/^INBOX/.test(data[i].id)) {
				if (!unorphanize(tree1, data[i])) {
					data[i].children = new Array();
					tree1.push(data[i]);
				}
			}
			else if (/^user/.test(data[i].id)) {
				if (!unorphanize(tree2, data[i])) {
					data[i].children = new Array();
					tree2.push(data[i]);
				}
			}
			else if (/^local_messages/.test(data[i].id)) {
				if (!unorphanize(tree3, data[i])) {
					data[i].children = new Array();
					tree3.push(data[i]);
				}
			}
			
		}

		var firstFolder = jQuery("#foldertree-container")
		.removeClass('empty-container')
		.html(DataLayer.render(BASE_PATH + 'api/templates/foldertree.ejs', {folders: [tree1, tree2, tree3]}))
		.find("#foldertree").treeview()
		.click(function(event){
			//request new selected folder messages
			var target = $(event.target);

			if( target.is('.collapsable-hitarea, .expandable-hitarea, .lastCollapsable, .lastExpandable, .treeview') )
			    return;

			if( !target.attr('id') )
			    target = target.parent();

            if (target.attr('id') == "foldertree") return;
			
			var targetId = target.attr('id');
			var child = target.find('.folder');
              
			$('.filetree span.folder.selected').removeClass('selected');
			if(!target.is('#foldertree > .expandable, #foldertree > .collapsable'))
				$(target).children('.folder').addClass('selected');
			
			selectedFolder = {
			    id: targetId, 
			    name: child.attr('title'),
			    'class': child.attr('class')
			};

			var grid = $("#message_attacher_grid"), offlineCase = "";
			
			if( !targetId.indexOf( 'local_messages/' ) )
			    offlineCase = ":offline";
			

			grid.jqGrid('setGridParam',{url:BASE_PATH + 'REST.php'+offlineCase+'?q=folder/'+targetId.replace(dashes, '.')+'/message'})
			    .trigger("reloadGrid")
			    .jqGrid('setCaption', '<span class="'+child.attr('class')+'">'+child.attr('title')+'</span>');
		})
		.find('span:first-child');
		$('span.folder.inbox').addClass('selected');
		selectedFolder = {
			id: firstFolder.parent().attr('id'), 
			name: firstFolder.attr('title'),
			'class': firstFolder.attr('class')
		};

		//jqgrid
		jQuery("#mailgrid-container")
		.removeClass('empty-container')
		.html(DataLayer.render(BASE_PATH + 'api/templates/messagegrid.ejs', {}))
		.find("#message_attacher_grid")
		.jqGrid({
			url:BASE_PATH + 'REST.php?q=folder/INBOX/message',
			datatype: "json",
			mtype: 'GET',
			colNames:['#',' ', 'De', 'Assunto', 'Data', 'Tamanho'],
			colModel:[
				{name:'msg_number',index:'msg_number', width:45, hidden:true, sortable:false},
				{name:'flags',index:'msg_number',edittype: 'image', width:100, sortable:false, formatter:flags2Class, title :false},
				{name:'from.name',index:'msg_number', width:70, sortable:false, formatter:NormaliseFrom},
				{name:'subject',index:'subject', width:245, sortable:false,formatter:NormaliseSubject},
				{name:'timestamp',index:'timestamp', width:65, align:"center", sortable:false, formatter:date2Time},
				{name:'size',index:'size', width:55, align:"right", sortable:false, formatter:bytes2Size}
			],
			jsonReader : {
				  root:"rows",
				  page: "page",
				  total: "total",
				  records: "records",
				  repeatitems: false,
				  id: "0"
			},
			rowNum:10,
			rowList:[10,25,50],
			pager: '#message_attacher_grid_pager',
			sortname: 'id',
			viewrecords: true,
			sortorder: "desc",
			multiselect: true,
			autowidth: true,
			loadComplete: function(data) {
				lastLoadedMessages = data.rows;
				
				// aplica o contador
				jQuery('.timable').each(function (i) {
					jQuery(this).countdown({
						since: new Date(parseInt(this.title)), 
						significant: 1,
						layout: 'h&aacute; {d<}{dn} {dl} {d>}{h<}{hn} {hl} {h>}{m<}{mn} {ml} {m>}{s<}{sn} {sl}{s>}', 
						description: ' atr&aacute;s'
					});					
				});
				
				// reconstrói a seleção das mensagens mesmo depois da mudança de pasta
				if (selectedMessages[selectedFolder.id]) {
					for (var message in selectedMessages[selectedFolder.id]){
						for (var j=0; j<data.rows.length; j++){	
							if (selectedMessages[selectedFolder.id][message] && message == data.rows[j].msg_number) {
								jQuery("#message_attacher_grid").setSelection(jQuery("#message_attacher_grid").getDataIDs()[j], false);
							}
						}
					}
				}
				$('#cb_message_attacher_grid').css('display', 'none');
				
			},
			onSelectRow: function (id, selected) {
				var message = false;
				for (var i=0; i<lastLoadedMessages.length; i++){
					if (lastLoadedMessages[i].msg_number == id) {
						message = lastLoadedMessages[i];
						break;
					}
				}
				
				var tabPanelTemplateId = 'mailpreview_tab_' + selectedFolder.id.replace(/[.\/]/g, '_') + '_' + message.msg_number;
				var tabPanelTemplateId = tabPanelTemplateId.replace(/[\s\/]/g, '-'); 
				
				if (selected) {	
					if (onceOpenedMessages[selectedFolder.id] && onceOpenedMessages[selectedFolder.id][message.msg_number]) {
						if (!selectedMessages[selectedFolder.id])
							selectedMessages[selectedFolder.id] = {};
							
						selectedMessages[selectedFolder.id][message.msg_number] = true;
						$('#mailpreview-container').unblock();						

						var tabPanelTemplateLabel = html_entities(onceOpenedMessages[selectedFolder.id][message.msg_number].subject);
						if (tabPanelTemplateLabel.length > $mailpreview_tabs_label_length + 3)
							tabPanelTemplateLabel = tabPanelTemplateLabel.substring(0, $mailpreview_tabs_label_length) + '...';
						
						if (!$('#' + tabPanelTemplateId).length) {								
							$mailpreview_tabs.tabs("add", '#' + tabPanelTemplateId, tabPanelTemplateLabel)
							.find('.message.empty-container').hide().end()
							.find('#' + tabPanelTemplateId).html(onceOpenedMessages[selectedFolder.id][message.msg_number].body);
						} else {
							$mailpreview_tabs.tabs('select', '#' + tabPanelTemplateId)
							.find('#' + tabPanelTemplateId + ', [href="#' + tabPanelTemplateId + '"]').removeClass('preview-message-unselected');
						}
						
					} else {
						jQuery('#mailpreview_container').block({  
							message: '<div id="loading-content"><div class="image"></div></div>',  
							css: {  
								backgroundImage: 'url('+BASE_PATH+'modules/attach_message/images/loading.gif)',  
								backgroundRepeat: 'no-repeat', 
								backgroundPosition: 'center', 
								backgroundColor: 'transparent', 
								width: '32px', 
								height: '32px', 
								border:'none'  
							}, 
							overlayCSS: {  
								backgroundColor: '#CCC',  
								opacity:         0.5 
							}  
						}); 

						var offlineCase = "";
						
						if( !selectedFolder.id.indexOf( 'local_messages/' ) )
						    offlineCase = ":offline";
					  
						if (!selectedMessages[selectedFolder.id])
							selectedMessages[selectedFolder.id] = {};
						selectedMessages[selectedFolder.id][message.msg_number] = true;
						$.ajax({
							accepts: 'text/html',
							url: BASE_PATH + 'REST.php'+offlineCase+'?q=folder/'+selectedFolder.id.replace(dashes, '.')+'/message/'+id,
							dataType: 'json',
							success: function( mail_preview ){		
								//selectedMessagesCount();
								if (!onceOpenedMessages[selectedFolder.id])
									onceOpenedMessages[selectedFolder.id] = {};
								onceOpenedMessages[selectedFolder.id][message.msg_number] = jQuery.extend(true, message, mail_preview);

								$('#mailpreview_container').unblock();

								var tabPanelTemplateLabel = html_entities(onceOpenedMessages[selectedFolder.id][message.msg_number].subject);
								if (tabPanelTemplateLabel.length > $mailpreview_tabs_label_length + 3)
									tabPanelTemplateLabel = tabPanelTemplateLabel.substring(0, $mailpreview_tabs_label_length) + '...';
							selectedMessagesCount();
								
								if (!$('#' + tabPanelTemplateId).length) {								
									$mailpreview_tabs.tabs("add", '#' + tabPanelTemplateId, tabPanelTemplateLabel)
									.find('.message.empty-container').hide().end()
									.find('#' + tabPanelTemplateId).html(onceOpenedMessages[selectedFolder.id][message.msg_number].body)
									.prepend(
										'<div class="mailpreview-message-info">' + 
											get_lang('Subject') + ': ' +
											html_entities(onceOpenedMessages[selectedFolder.id][message.msg_number].subject) + 
										'</div>'
									)
									.find('[class^="ExpressoCssWrapper"]').addClass("mailpreview-message-body");
								} else {
									$mailpreview_tabs.tabs('select', '#' + tabPanelTemplateId)
									.find('#' + tabPanelTemplateId + ', [href="#' + tabPanelTemplateId + '"]').removeClass('preview-message-unselected');
								}
							}
						});
					}
				} else {
					/**
					 * if you wants to remove tab on unselect message,
					 * but still needs to uselect message on remove tab.
					 * 
					 */
					/*
					if ($('#' + tabPanelTemplateId).length) {
						$mailpreview_tabs.tabs('remove', '#' + tabPanelTemplateId);
					}
					 */
					selectedMessages[selectedFolder.id][message.msg_number] = false;
					$mailpreview_tabs.find('#' + tabPanelTemplateId + ', [href="#' + tabPanelTemplateId + '"]').addClass('preview-message-unselected');
				}
				
				if (onceOpenedMessages[selectedFolder.id] && onceOpenedMessages[selectedFolder.id][message.msg_number])
					selectedMessagesCount();
			},
			caption: '<span class="'+selectedFolder['class']+'">'+selectedFolder.name+'</span>'
		});
		//.jqGrid('navGrid','#message_attacher_grid_pager',{edit:false,add:false,del:false});
		var title = [get_lang("First page"), get_lang("Prev page"), get_lang("Next page"), get_lang("Last page")];
		$("#first_message_attacher_grid_pager").attr("title",title[0]);
		$("#prev_message_attacher_grid_pager").attr("title",title[1]);
		$("#next_message_attacher_grid_pager").attr("title",title[2]);
		$("#last_message_attacher_grid_pager").attr("title",title[3]);
	}
});


var $mailpreview_tabs = $( "#mailpreview_container").tabs({
	tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'> Fechar </span></li>",
	panelTemplate: '<div class="message mailpreview-message"></div>',
	add: function( event, ui ) {
		$mailpreview_tabs.tabs('select', '#' + ui.panel.id);
	
		if ($('#mailpreview_tabs_default_empty').length && $mailpreview_tabs.tabs("length") > 1) {	
			$mailpreview_tabs.tabs('remove', '#mailpreview_tabs_default_empty');
		}
	},
	remove: function(event, ui) {
		if (!$mailpreview_tabs.tabs("length") && !$('#mailpreview_tabs_default_empty').length) {
			/**
			 * TODO: internacionalizar a string 'Nenhuma aba'
			 */
			$mailpreview_tabs.tabs('add', '#mailpreview_tabs_default_empty', 'Nenhuma aba')
			.find('#mailpreview_tabs_default_empty').removeClass('mailpreview-message').addClass('empty-container')
			.html('<span class="message">' + get_lang('select a message to preview') + '</span>').end()
			.find('.ui-tabs-nav li:first .ui-icon-close').remove();
		}
	}
});

$( "#mailpreview_container span.ui-icon-close" ).unbind("click");
$( "#mailpreview_container span.ui-icon-close" ).live( "click", function(e) {
	var index = $("li", $mailpreview_tabs).index($(this).parent());
	$mailpreview_tabs.tabs("remove", index);
	e.stopImmediatePropagation();
});

if (!$mailpreview_tabs.tabs("length") && !$('#mailpreview_tabs_default_empty').length) {
			/**
			 * TODO: internacionalizar a string 'Nenhuma aba'
			 */
			$mailpreview_tabs.tabs('add', '#mailpreview_tabs_default_empty', 'Nenhuma aba')
			.find('#mailpreview_tabs_default_empty').removeClass('mailpreview-message').addClass('empty-container')
			.html('<span class="message">' + get_lang('select a message to preview') + '</span>').end()
			.find('.ui-tabs-nav li:first .ui-icon-close').remove();
}
