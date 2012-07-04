var init_tree = 0;
var selected;
var over;
var cp_tree1;
var cp_tree2;
function unorphanize(root, element) {
	var ok = false;
	var f = 0;
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

function count_unseen_children(folder){
	if(folder.children.length){
		for(var i=0; i< folder.children.length; i++){
			if(folder.children[i].children.length)
				folder.children[i]['children_unseen'] = (folder.children[i]['children_unseen'] ? folder.children[i]['children_unseen'] : 0) + count_unseen_children(folder.children[i]);
			
			folder['children_unseen'] = (folder['children_unseen'] ? folder['children_unseen'] : 0)+ (folder.children[i]['children_unseen'] ? folder.children[i]['children_unseen'] : 0) + parseInt(folder.children[i].messageCount.unseen);			
		}
		return folder['children_unseen'];
	}else{
		return parseInt(folder.messageCount.unseen);
	}
}

function valid_tabs(children_of_this_folder, folder_to_move){
	var borders_open = $("#border_tr").children();

	var error = false;
	for(var i = 1; i <= borders_open.length -2; i ++){
		//VERIFICA A CADA FILHO DA PASTA SE ESTA eventNSAGEM E DESTA PASTA
		$.each(children_of_this_folder, function(index, value){
			if($(children_of_this_folder[index]).attr('id') == openTab.imapBox[$(borders_open[i]).find("input[type=hidden]").attr("name")]){
				error = true;
				write_msg(get_lang("One or more messages from any sub-folder are open"));
				return error;
				
			}
		});
		if(error){
			return error;
		}
		//VERIFICA SE EXISTE NA PASTA A SER MOVIDA
		if(openTab.imapBox[$(borders_open[i]).find("input[type=hidden]").attr("name")] == folder_to_move){
			error = true;
			write_msg(get_lang("One or more messages from this folder are open"));
			return error;
		}
	}
}

function draw_new_tree_folder(callback){
	
	var folders = DataLayer.get("folder", true);
	
	if(!selected){
		selected = "INBOX";
	}
	/*
	if( folders )
	{
	    folders = $.map( folders, function( folder ){
		  return {
		    id: folder.folder_id,
		    commonName: folder.folder_name,
		    parentFolder: folder.folder_parent === "root" ? "" : folder.folder_parent,
		    messageCount: { total : '', unseen : '0' }
		  };
	    });
	}
	else
	    folders = DataLayer.get("folder", true);
	*/
	var tree1 = new Array();
	var tree2 = new Array();
	var tree3 = new Array();
	for (var i=0; i<folders.length; i++) {
		if (/^INBOX/.test(folders[i].id)) {
			if (!unorphanize(tree1, folders[i])) {
				folders[i].children = new Array();
				tree1.push(folders[i]);
			}
		}
		else if (/^user/.test(folders[i].id)) {
			if (!unorphanize(tree2, folders[i])) {
				folders[i].children = new Array();
				tree2.push(folders[i]);
			}
		}
		else if (/^local_messages/.test(folders[i].id)) {
			if (!unorphanize(tree3, folders[i])) {
				folders[i].children = new Array();
				tree3.push(folders[i]);
			}
		}
	}
	
	for(var i =0; i<tree1.length; i++){
		count_unseen_children(tree1[i]);
	}
	for(var i =0; i<tree2.length; i++){
		count_unseen_children(tree2[i]);
	}
	for(var i =0; i<tree3.length; i++){
		count_unseen_children(tree3[i]);
	}
	cp_tree1 = tree1;
	cp_tree2 = tree2;
	$("#content_folders").removeClass("menu-degrade").parent().removeClass("image-menu");
	var html = DataLayer.render('../prototype/modules/mail/templates/detailedfoldertree.ejs', {folders: [tree1, tree2, tree3]});
	var folders_html = $("#content_folders").html(html).find(".mainfoldertree").treeview({
			persist: "cookie",
			animated: "fast"
	}).find(".folder").unbind("click").click(function(event){
		
		// MUDANÇA DE PASTAS!
		var target = $(this);	
		
		if($(".folders-loading").length)
			return;
		
		if($(event.target).parent().is(".float-menu"))
			return;
			
		if( target.is('.collapsable-hitarea, .expandable-hitarea, .lastCollapsable-hitarea, .lastExpandable-hitarea, .treeview ,.folder_unseen,.ui-icon, .float-menu, .new_folder, .folders-loading, .head_folder, .shared-folders') )
			return;
		
		if( target.parent().find(".new_folder").length)
			return;
			
		if( !target.attr('id') )
			target = target.parent();
		if (target[0] == $(".mainfoldertree")[0]) return;
		var uiId = target.attr('id');
		var child = target.find('.folder');
		  
		if(!target.is('.mainfoldertree > .expandable-hitarea, .mainfoldertree > .collapsable-hitarea')){
			$('.filetree span.folder.selected').removeClass('selected');
			$(target).children('.folder').addClass('selected');
		}
		$(this).addClass("folders-loading");
		selected = target.attr('id');
		change_folder(target.attr('id'), child.attr('title'));	

		$.ajax({
			  url : "controller.php?"+ $.param( { action: "$this.imap_functions.get_folders_list", folder: target.attr('id') } ),
			  success : function(data){
				  data = connector.unserialize(data);

				  if(data)
				    build_quota(data);
			  }
		});

	}).filter('.followup-messages').click(function(event, ui){
		search_emails("UNDELETED KEYWORD \"$Followupflagged\"");
	}).end().end();
	
	folders_html.find('[id="'+selected+'"]').children().addClass("selected").end().end().find("li:first").find(".folder").not(".head_folder,.inbox,.drafts,.sent,.spam,.trash").draggable({
		// DRAG DE PASTAS
		start : function(){
			$(this).css("color", "gray");
		},
		stop : function(){
			$(this).css("color", "");
		},
		revert: "invalid",
		helper: function(event){
			if($.trim(($(this).text().split("["))[0]).length > 18)
				return $(DataLayer.render('../prototype/modules/mail/templates/draggin_box.ejs', {texto : (($(this).text().split("["))[0]).substring(0,18) + "...", type: "folder"}));
			return $(DataLayer.render('../prototype/modules/mail/templates/draggin_box.ejs', {texto : (($(this).text().split("["))[0]), type: "folder"}));
		},
		delay: 150,
		refreshPositions: true,
		zIndex : 2700,
		//scroll: true, 
		//scrollSensitivity: 100,
		//scrollSpeed: 100,
		containment: "#divAppbox" 
	}).end().droppable({
		//DROP DE PASTAS
		over : function(a, b){
			//INICIO : SE A PASTA CONTER FILHAS EXPANDE 
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
			//FIM : SE A PASTA CONTER FILHAS EXPANDE
			
			//SETA BORDA EM VOLTA DA PASTA
		},
		out : function(){
			//RETIRA BORDA EM VOLTA DA PASTA
			$(this).removeClass("folder-over");
		},
		drop : function(event, ui){
			$(this).removeClass("folder-over");
			if($(this).parent().attr('id') == undefined){
				var folder_to = 'INBOX';
				var to_folder_title = get_lang("Inbox");
			}else{
				var folder_to = $(this).parent().attr('id');
				var to_folder_title = $(this).attr('title');
			}		
			var folder_to_move = ui.draggable.parent().attr('id');
			var border_id = ui.draggable.find("input[type=hidden]").attr("name");
			// eventnsagens : SE O DROP VIER DA LISTA DE eventNSAGENS :
			if(folder_to_move == "tbody_box"){
				move_msgs2(get_current_folder(), 'selected', 0, folder_to, to_folder_title,true);
				return refresh();
			}
			//SE FOR DE UMA PESQUISA RAPIDA
			else if(ui.draggable.parents('[id^="content_id_"]')[0]){
				move_search_msgs("content_id_"+border_id, folder_to, to_folder_title);
				return refresh();
			}
			// eventnsagens : SE O DROP VIER DE UMA ABA ABERTA
			else if(folder_to_move == "border_tr"){
				var id_msg = border_id.split("_")[0];
				folder = $("#input_folder_"+border_id+"_r")[0] ? $("#input_folder_"+border_id+"_r").val() : (openTab.imapBox[border_id] ? openTab.imapBox[border_id]:get_current_folder());
				alternate_border(border_id);
				move_msgs2(folder, id_msg, border_id, folder_to, to_folder_title,true);
				return refresh();
			}
			// SE O DROP VIER DA LISTA DE PASTAS
			else{
				var folder_to_exist = folder_to_move.split(cyrus_delimiter);	
				folder_to_exist = folder_to+cyrus_delimiter+folder_to_exist[folder_to_exist.length-1];
				
				//VERIFICA SE EXISTE UMA eventNSAGENS ABERTA NESTA PASTA E NAS SUAS FILHAS

				if(valid_tabs(ui.draggable.parent().find("li"), folder_to_move)){
					return;
				}
				//FIM : VERIFICA SE EXISTE UMA eventNSAGENS ABERTA NESTA PASTA E NAS SUAS FILHAS;
				
				// VALIDA SE O USUARIO ESTA TENTANDO MOVER A PASTA PARA O eventSMO LOCAL
				if(folder_to_exist == folder_to_move){
					return write_msg(get_lang("Thie folder is already in this place"));
				}
				
				// VALIDA SE O USUARIO ESTA TENTANDO MOVER A PASTA ABERTA NO momentO
				if(folder_to_move == get_current_folder()){
					return write_msg(get_lang("It's not possible move this folder, because it is being used in the moment!"));
				}
				
				// VALIDA SE O USUARIO ESTA TENTANDO MOVER UMA PASTA FILHA DA PASTA ABERTA NO momentO
				if(ui.draggable.parent().find(".selected")[0]){
					return write_msg(get_lang("It's not possible move this folder, because its subfolder is being used in the moment!"));
				}
				
				// VALIDA SE O USUARIO ESTA TENTANDO MOVER UMA PASTA PAI PARA DENTRO DE UMA FILHA
				if(ui.draggable.parent().find('[id="'+folder_to+'"]')[0]){
					return write_msg(get_lang("It's not possible to move this folder to its subfolders!"));
				}					
				
				if($('[id="'+folder_to_exist+'"]').length){
					return write_msg(get_lang("Can not move this folder to this location, because the target has already a folder with this name"));
				}
				
				$(this).addClass("folders-loading");
				
				$.ajax({
					url : "controller.php?"+ $.param( { action: "$this.imap_functions.move_folder", folder_to_move: folder_to_move, folder_to: folder_to } ),
					success : function(data){
						data = connector.unserialize(data);
						if(data){
							cExecute("$this.imap_functions.get_folders_list&onload=true", update_menu);
							write_msg(get_lang("The folder was successfully moved"));
						}
						else{
							write_msg(get_lang("ERROR moving your folder."));
						}
					}
				});
			}
		}
	}).hover(
		function(){
			//CASO A LI NÃO TENHA UM eventNU FLUTUANTE AINDA, O eventNU É ADICIONADO!
			if(!$(this).children(":last").hasClass("float-menu") && !$(this).children(":last").hasClass("new_folder")){
				var folder_ = $(this);
				var folder_name;
				if(folder_.parent().attr('id')){
					folder_name = folder_.parent().attr('id').split(cyrus_delimiter);
					folder_name = folder_name[folder_name.length -1];
				}else
					folder_name = "Root";
				html = DataLayer.render("../prototype/modules/mail/templates/float_folder_menu.ejs", {name_folder : folder_name});					
					//FUNÇÃO DO eventNU FLUTUANTE EDITAR < BEGIN
				var esc = false;
				$(folder_).append(html).find(".float-menu-edit").click(function(){
					var folder_id = $(this).parents(".closed:first").attr('id');
					var name = $.trim($(this).parents(".closed:first").find("span:first").text().split("[")[0]);
					if($(this).parents(".closed:first").find("span:first").hasClass("selected"))
						return write_msg(get_lang("It's not possible rename this folder, because it is being used in the moment!"));
					if($(this).parents(".closed:first").find(".selected").length)
						return write_msg(get_lang("It's not possible rename this folder, because its subfolder is being used in the moment!")); 
					if(valid_tabs($(this).parents("li:first").find("li"), folder_id))
						return;
					$(this).parents(".closed:first").find("span:first").empty().append("<input class='new_folder folder' type='text' maxlength='100'></input>");
					$(".new_folder").focus().keydown(function(event){
						event.stopPropagation();
						if(event.keyCode == 13){
							if($(this).val() != ""){
								if($(this).val().match(/[\/\`\~\^\<\>\|\\\"\!\@\#\$\%\&\*\+\(\)\[\]\{\}\?;:]/gi)){
									return write_msg(get_lang("cannot create folder. try other folder name"));
								}
								var new_name = folder_id.replace(/[a-zA-Z0-9á-úÁ-Ú^\s_-]+$/, $(this).val());
								if($('[id="'+new_name+'"]').length){
									$(".folders-loading").removeClass("folders-loading");
									write_msg(get_lang("Mailbox already exists"));
									return draw_new_tree_folder();
								}
								$(".new_folder").parent().addClass("folders-loading");
								$.ajax({
									url : "controller.php?action=$this.imap_functions.ren_mailbox",
									type : "POST",
									data : "current="+folder_id+"&rename="+new_name,
									success : function(){
										write_msg(get_lang("The folder was successfully rename"));
										cExecute("$this.imap_functions.get_folders_list&onload=true", update_menu);
									}
								});
							}
						}else if( event.keyCode == 27){
							draw_new_tree_folder();
						}
					}).focusout(function(){
						draw_new_tree_folder();
					}).val(name);
				})
				//FUNÇÃO DO eventNU FLUTUANTE EDITAR < END
				//FUNÇÃO DO eventNU FLUTUANTE EXCLUIR < BEGIN
				.end().find(".float-menu-remove").click(function(){
					
					var folder_id = $(this).parents(".closed:first").attr('id');
					var folder_name = "<strong>"+$.trim($(this).parents(".closed:first").find(".folder").text().split("[")[0])+"</strong>";
					
					if(valid_tabs($(this).parents("li:first").find("li"), folder_id))
						return;
					$(this).parents(".closed:first").find(".folder").addClass("folders-loading"); 
					
					if($(this).parents(".closed:first").find("ul").length){
						$(this).parents(".closed:first").find(".folder").removeClass("folders-loading");
						return write_msg(get_lang("Delete/move subfolders first"));
					}
					if($(this).parents(".closed:first").find(".selected").length){
						$(this).parents(".closed:first").find(".folder").removeClass("folders-loading");
						return write_msg(get_lang("It's not possible delete this folder, because it is being used in the moment!")); 
					}
					var folder_span = $(this);
					var confirm_text = get_lang("Do you wish to exclude the folder ");
					$.Zebra_Dialog(confirm_text+folder_name, {
						'type':     'question',
						'overlay_opacity': '0.5',
						'buttons':  [get_lang('Yes'), get_lang('No')],
						'onClose':  function(caption) {
							if(caption == get_lang('Yes')){
								$.ajax({
									url : "controller.php?action=$this.imap_functions.delete_mailbox",
									type: "POST",
									data : "del_past="+folder_id,
									success : function(data){
										data = connector.unserialize(data);
										if(data == "Mailbox does not exist"){
											$(".folders-loading").removeClass("folders-loading");
											return write_msg(get_lang("Mailbox does not exist"));
										}
										write_msg(get_lang("The folder %1 was successfully removed", folder_name));
										cExecute("$this.imap_functions.get_folders_list&onload=true", update_menu);
									}
								});
							}else{
								folder_span.parents(".closed:first").find(".folder").removeClass("folders-loading");
								return;
							}
						}
					});
					/* if(!confirm(confirm_text + folder_name)){
						$(this).parents(".closed:first").find(".folder").removeClass("folders-loading");
						return;
					} */
				})
				//FUNÇÃO DO eventNU FLUTUANTE EXCLUIR < END
				//FUNÇÃO DO eventNU FLUTUANTE NOVA PASTA < BEGIN
				.end().find(".float-menu-new").click(function(){
					$(this).parents(".float-menu").hide();
					var selected_li = $(this).parents(".closed:first");
					if(selected_li.find("ul:first").length){
						var new_folder = $("<li><input class='new_folder folder' type='text' maxlength='100'></input></li>").appendTo(selected_li.find("ul:first"));								
						if(selected_li.find(".expandable-hitarea").length){
							selected_li.find(".expandable-hitarea").trigger('click');
						}
						selected_li.find("ul:first").treeview({
							add: new_folder
						});
					}else if(selected_li.length){
						var new_folder = $("<ul><li><input class='new_folder folder' type='text' maxlength='100'></input></li></ul>").appendTo(selected_li);								
						selected_li.treeview({
							add: new_folder
						});
					}else{
						selected_li = $(this).parents(".head_folder").parent();
						if($(this).parents(".head_folder").parent().find(".expandable-hitarea").length){
							$(this).parents(".head_folder").parent().find(".expandable-hitarea").trigger('click');
						}
						var new_folder = $("<ul><li><input class='new_folder folder' type='text' maxlength='100'></input></li></ul>").appendTo(selected_li);								
						selected_li.treeview({
							add: new_folder
						});
					}
					
					selected_li.find(".new_folder").Watermark("Nova Pasta").focus().keydown(function(event){
						event.stopPropagation();
						if(event.keyCode == 13){
							if($(this).val().match(/[\`\~\^\<\>\|\\\"\!\@\#\$\%\&\*\+\(\)\[\]\{\}\?;:]/gi)){
								return write_msg(get_lang("cannot create folder. try other folder name"));
							}
							if($('[id="'+ (selected_li.attr('id')? selected_li.attr('id') : "INBOX") + cyrus_delimiter + $(this).val()+'"]').length){
								$(".folders-loading").removeClass("folders-loading");
								write_msg(get_lang("Mailbox already exists"));
								return draw_new_tree_folder();
							}
							$(".new_folder").parent().addClass("folders-loading");
							create_new_folder(($(this).val() != "" ? $(this).val() : get_lang("New Folder")), (selected_li.attr('id')? selected_li.attr('id') : "INBOX"));
						}else if( event.keyCode == 27){
							draw_new_tree_folder();
						}
					}).focusout(function(){
						draw_new_tree_folder();
					});
				});
				//FUNÇÃO DO eventNU FLUTUANTE NOVA PASTA < END
			}
			if(!$(".new_folder").length){
				$(this).find(".float-menu:first").css("display", "");
			}
		},
		function(){
			$(this).find(".float-menu:first").hide();
		}
	);
	$("#new_m").html($('.selected').find(".folder_unseen").html() ? $('.selected').find(".folder_unseen").html() : "0").css("color", "red");
}
