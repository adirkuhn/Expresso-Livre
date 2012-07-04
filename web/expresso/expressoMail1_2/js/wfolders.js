	function cWFolders()
	{
		this.arrayWin = new Array();
		this.el;
		this.alert = false;
	}

	cWFolders.prototype.load = function( border_id, type )
	{
		var folder 		= {};
		var textButton	= "";
		var titleWindow	= "";
		
		switch( type )
		{
			case 'save' :
				textButton = get_lang('Save');
				break;
					
			case 'send_and_file' :
				textButton = titleWindow = get_lang('Send and file');
				break;
					
			case 'move_to' :
				textButton = titleWindow = get_lang('Move');	
				break;
			
			case 'change_folder' :
				textButton = titleWindow = get_lang('Change folder');
				break;
				
			default :
				textButton = titleWindow = get_lang(type);
		}
		
		var winSaveFile = $("#sendFileMessages");
			winSaveFile.html( DataLayer.render( BASE_PATH + "modules/mail/templates/sendFileMessages.ejs", {}));
			winSaveFile.dialog(
					{
						height		: 250,
						width		: 300,
						resizable	: false,
						title		: titleWindow,
						modal		: true,
						buttons		: [
										 {
										 	text	: get_lang("Close"), 
										 	click	: function()
										 	{
												winSaveFile.dialog("destroy");
										 	}
										 },
										 {
										 	text	: textButton, 
										 	click	: function()
										 	{
												if (type == 'save')
												{
													save_as_msg(border_id, folder.id, folder.caption,true);
												}
												else if (type == 'send_and_file')
												{
													send_message( border_id, folder.id, folder.caption);
													wfolders.alert = true;
												}
												else if (type == 'move_to')
												{
													var msg_number =  ( border_id ? border_id.replace('_r','') : 'selected');
													
													if (border_id.match('search'))
														move_search_msgs(border_id, folder.id, folder.caption);	
													else{
														proxy_mensagens.proxy_move_messages('null',msg_number, border_id, folder.id, folder.caption);
														wfolders.alert = true;
													}
												}
												else if (type == 'change_folder')
												{
													change_folder(folder.id, folder.caption);
													wfolders.alert = true;
												}

										 		winSaveFile.dialog("destroy");
										 	}
										 }
									]	 	
					});	
			
		winSaveFile.next().css("background-color", "#E0EEEE");
			
		var foldersTree = jQuery("#foldertree-container-sendFileMessage")
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
		});
	}
	
	cWFolders.prototype.makeWindow = function(border_id, type)
	{
		this.load( border_id, type, false);
	}
	
/* Build the Object */
	var wfolders;
	wfolders = new cWFolders();
