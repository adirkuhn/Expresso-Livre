/**************************************************************************\
 Início 
\**************************************************************************/

	function Tree_Box(){
		
		this.name_folder = "";
		this.name_func   = "";
		connector.loadScript("TreeS");
	}
	Tree_Box.prototype.update_folder = function(expand_local_root){
				
		var handler_update_folders = function(data)
		{
			folders = data;
			
			ttree.make_tree();
			
			draw_new_tree_folder();
			
			ttree.setFolder(ttreeBox.name_folder);
			
			if(tree_folders.getNodeById(ttree.getFolder()))
				tree_folders.getNodeById(ttree.getFolder())._select();

			if(expand_local_root)
				tree_folders.getNodeById('local_root').changeState();
		}
		if(!expresso_offline)
			cExecute ("$this.imap_functions.get_folders_list&folder="+current_folder, handler_update_folders);		
		else
			handler_update_folders('');
	}

	Tree_Box.prototype.verify_children = function(param){
		var aux;
		var aux1;
		var cont = parseInt(0);
		for(var i=0 ; i < folders.length; i++){
			aux = folders[i].folder_id.split(cyrus_delimiter);
			aux.pop();
			for(var j=0; j < aux.length; j++){
				if(j == 0)
					aux1 = aux[j];
				else
					aux1 += cyrus_delimiter + aux[j];
			}
			if( aux1 == param){
				cont++;
			}
		}
		if( cont == 0){
			ttreeBox.del_past(param);
		}else{
                       alert(get_lang("Delete your sub-folders first"));
		}
		cont = parseInt(0);
	}
	
	Tree_Box.prototype.verify = function(exp)
 	{
		// IE does not understand accents in regex! that \xNN are the hex codes for the accented characters! 
        var reTipo = /^[\w\xda\xc1\xc9\xcd\xd3\xdd\xe1\xe9\xed\xfa\xfd\xf3\xc0\xc8\xcc\xd2\xe0\xe8\xec\xf2\xf9\xd9\xc3\xd1\xd5\xe3\xf1\xf5\xc2\xca\xce\xd4\xe2\xea\xee\xf4\xdb\xfb\xc7\xe7\xc4\xd6\xe4\xf6\xfc\xcb\xcf\xeb\xef\xff \-_+=]*$/i; 
        
        var _return = (exp.search(reTipo) == -1) ? false : true;
        
        return _return;
 	}

 	// Função para verificar o nome da caixa;
 	Tree_Box.prototype.verify_names = function(name_folder)
 	{
	    var arr_nm_folder = new Array("INBOX",trashfolder,draftsfolder,sentfolder,spamfolder);
 		for(var i=0 ; i < arr_nm_folder.length; i++)
 		{
 			if(name_folder == arr_nm_folder[i])
 			{
				ttree.setFolder("");
				return true;
 			}
 		}
		return false;
 	}
	
	// Valida os nomes das pastas
	Tree_Box.prototype.validate = function(func)
	{
		var aux = ttree.getFolder().split(cyrus_delimiter);
		var aux2;
		
		if(ttree.getFolder() == "")
		{
			ttree.setFolder("root");
		}
		
		if( ttree.getFolder() != "" )
		{

			if(aux.length > 1)
			{
				aux2 = aux[1];
			}
			else
			{
				aux2 = aux[0];
			}
			if( func == "rename" && this.verify_names(aux2) )
			{
			       alert(get_lang("It's not possible rename the folder: ") + lang_folder(aux2) + '.');
			       return false;
			}
			else
			{
				if( func == "newpast" )
				{
					var newFolder = prompt( get_lang('Enter the name of the new folder:') , "");
					
					if( newFolder )
					{
						if ( newFolder.indexOf("local_") != -1  || newFolder.toUpperCase() == "INBOX" ) {
							alert(get_lang("cannot create folder. try other folder name"));
							return false; //Não posso criar pastas contendo a string local_					
						}
						
						if( newFolder.match(/[\/\\\!\@\#\$\%\&\*\+\(\)]/gi) )
						{
						    alert(get_lang("cannot create folder. try other folder name"));
						    return false;
						}
						
						if (newFolder.length > 100){
							alert((get_lang("cannot create folder with more than 100 characters")));
							return false;
						}
						
						if( trim(newFolder) != "" && trim(newFolder) != null )
						{
							ttreeBox.new_past(newFolder);
						}
					}
				}
				
				if( func == "rename" )
				{
					if( ttree.getFolder() == "root"){
	                	alert(get_lang("It's not possible rename this folder!"));
						return false;
					}
					if( ttree.getFolder() == get_current_folder()){
                        alert(get_lang("It's not possible rename this folder, because it is being used in the moment!"));
						return false;
					}
                    var renameFolder = prompt(get_lang("Enter a name for the box"), "");
                    
                    if( renameFolder )
                    {	
						if ( renameFolder.indexOf("local_") != -1 || renameFolder.toUpperCase() == "INBOX") {
							alert(get_lang("cannot create folder. try other folder name"));
							return false; //Não posso criar pastas contendo a string local_					
						}
	
						if(renameFolder.match(/[\/\\\!\@\#\$\%\&\*\+\(\)]/gi)){
						    alert(get_lang("It's not possible rename this folder. try other folder name"));
						    return false;
						}
	
						if( trim(renameFolder) != "" || trim(renameFolder) != null)
						{
							ttreeBox.rename(renameFolder);
						}
                    }
				}
			}
		}
		else
		{
            alert(get_lang("Select a folder!"));
			return false;
		}
	}

// Para criar a nova pasta;
	Tree_Box.prototype.new_past = function(newp)
	{

		var aux   = ttree.getFolder().split(cyrus_delimiter);
		var delimExp = new RegExp('\\'+cyrus_delimiter,"g"); 
	        newp = newp.replace(delimExp,'_'); 
		var newp2 = "";
		if( aux[0] == "root"){
			if(!this.verify(newp)){
				alert(get_lang("Type without spaces, dots or special characters!"));
				newp = "";
				return false;
			}else{
				newp2 = newp;
				newp = "INBOX" + cyrus_delimiter + newp;
			}
		}else{
			if(!this.verify(newp)){
				alert(get_lang("Type without spaces, dots or special characters!"));
				newp = "";
				return false;
			}else{
				newp2 = newp;
				var folderName = ttree.getFolder() || "INBOX";
				newp = folderName + cyrus_delimiter + newp;
			}
		}

		if( newp != "" )
		{
			var handler_return = function(data)
			{		
				if(data != "Ok")
				{
					alert( get_lang(data) );
				}
				else
				{
					ttreeBox.name_folder = "root"; //or use var newpast
					this.name_func = "newpast";
					connector.purgeCache();
					ttreeBox.update_folder();
				}
			}
			
			var args = "$this.imap_functions.create_mailbox";
			var params = "newp="+newp;
			cExecute(args,handler_return,params);
		}	
	}
	
	// Funcao para renomear a pasta;
	Tree_Box.prototype.rename = function(rename){
		var old_box  = ttree.getFolder();
		var aux = old_box.split(cyrus_delimiter);
		var rename_new = "";
		
		if(old_box == "root"){
            alert(get_lang("Select a folder!"));
			return false;
		}
		if(aux.length == 1){
            alert(get_lang("It's not possible rename the folder: ") + aux[0] + '.');
			rename = "";
			return false;
		}else{
			if(this.verify_names(aux[1])){
                alert(get_lang("It's not possible rename the folder: ") + aux[1] + '.');
				rename = "";
				return false;
			}else{
				if(!this.verify(rename)){
                    alert(get_lang("Type without spaces, dots or special characters!"));
					rename = "";
					return false;
				}else{
					aux.pop();
					aux.push(rename);
					for(var i=0; i< aux.length; i++){
						if( i == 0)
							rename_new = aux[i];
						else
							rename_new += cyrus_delimiter + aux[i];
					}
				}	
			}
		}
		if(rename != ""){
			var handler_return = function(data)
			{
				connector.purgeCache();
				ttreeBox.name_folder = "root";
				ttreeBox.update_folder();
			}
			var args = "$this.imap_functions.ren_mailbox";
			var params = "rename="+rename_new+"&current="+old_box;
			cExecute(args,handler_return,params);
		}
	}
	//
	Tree_Box.prototype.export_all_msg = function(){
			
		if(ttree.getFolder() == "root"){return false;}
		var nm_bx = ttree.getFolder().split(cyrus_delimiter);
		var name_f = nm_bx[nm_bx.length -1];
		var hand_export = function(data){
			if(!data){
				write_msg(get_lang('Error compressing messages (ZIP). Contact the administrator.'))
			}else if(data["empty_folder"]){
				write_msg(get_lang("The selected folder is empty."));
				alert(get_lang("The selected folder is empty."));
			}else
			  download_attachments(null, null, data, null,null, name_f +'.zip');
		}
		cExecute("$this.exporteml.export_all",hand_export,"folder="+ttree.getFolder());	
		write_msg(get_lang('You must wait while the messages will be exported...'));			
	}
	
	// Função para deletar a pasta;
	Tree_Box.prototype.del = function(){
		var folder_name = ttree.getFolder();
		var aux = ttree.getFolder().split(cyrus_delimiter);

		if( aux[0] == "root" || ttree.getFolder() == "" ){
			alert(get_lang("Select a folder!"));
			return false;
		}
		
		if(aux.length == 1){
            alert(get_lang("It's not possible delete the folder: ") + get_lang("Inbox") + '.');
			return false;
		}else{
			if(this.verify_names(aux[1]) && typeof(aux[2]) == 'undefined'){
	            alert(get_lang("It's not possible delete the folder: ") + get_lang(special_folders[aux[1]]) + '.');	 
      			return false;
			}else{
				this.verify_children(folder_name);
			}
		}	
	}
	
	Tree_Box.prototype.del_past = function(param){
		var aux = param.split(cyrus_delimiter);
		var aux1 = aux.pop();

		if( ttree.getFolder() == get_current_folder()) {
            alert(get_lang("It's not possible delete this folder, because it is being used in the moment!"));
			return false;
		}
        if(confirm(get_lang("Do you wish to exclude the folder ") + aux1+ "?")){
			var handler_return = function(data)
			{		
				if(data != "Ok")
				{
					alert(data);
				}else{
					connector.purgeCache();
					ttreeBox.name_folder = "root";
					ttreeBox.update_folder();
					write_msg(get_lang("The folder %1 was successfully removed", aux1));
				}
			}
			var args = "$this.imap_functions.delete_mailbox";
			var params = "del_past="+param;
			cExecute(args,handler_return,params);
		}
	
	}
/* - Build Object -*/
 	var ttreeBox;
	ttreeBox = new Tree_Box();
