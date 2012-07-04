	function cShareMailbox()
	{
		this.xtools 		= new xtools('../expressoMail1_2/templates/');
	}

	cShareMailbox.prototype.get_available_users = function(context)
	{
		var handler_get_available_users = function(data)
		{
			select_available_users = document.getElementById('em_select_available_users');
		
			//Limpa o select
			for(var i=0; i<select_available_users.options.length; i++)
			{
				select_available_users.options[i] = null;
				i--;
			}

			if ((data) && (data.length > 0))
			{
				// Necessario, pois o IE6 tem um bug que retira o primeiro options se o innerHTML estiver vazio.
				select_available_users.innerHTML = '#' + data;
				select_available_users.outerHTML = select_available_users.outerHTML;
			
				select_available_users.disabled = false;
				select_available_users_clone = document.getElementById('em_select_available_users').cloneNode(true);
				document.getElementById('em_input_searchUser').value = '';
			}
		}
		cExecute ("$this.ldap_functions.get_available_users2&context="+context, handler_get_available_users);
	}

	cShareMailbox.prototype.getaclfromuser = function(user)
	{
		var handler_getaclfromuser = function(data)
		{
			Element('em_input_readAcl').checked		= false;
			Element('em_input_deleteAcl').checked	= false;
			Element('em_input_writeAcl').checked	= false;
			Element('em_input_sendAcl').checked		= false;
			
            Element('em_input_deleteAcl').disabled	= true;
            Element('em_input_writeAcl').disabled	= true;
			
			if (data[user].indexOf('lrs',0) >= 0)
			{
				Element('em_input_sendAcl').disabled = false;
				Element('em_input_deleteAcl').disabled = false;
                Element('em_input_writeAcl').disabled = false ;
				Element('em_input_readAcl').checked = true;
			}
			else
			{
				Element('em_input_sendAcl').disabled = true;
			}
			
			if (data[user].indexOf('d',0) >= 0)
			{
				Element('em_input_deleteAcl').checked = true;
				Element('em_input_deleteAcl').disabled = false;
			}
			
			if (data[user].indexOf('w',0) >= 0)
			{
				Element('em_input_writeAcl').checked = true;
                Element('em_input_writeAcl').disabled = false
			}
			
			if (data[user] != "false" && data[user].indexOf('p',0) >= 0)
			{
				Element('em_input_sendAcl').disabled = false;
				Element('em_input_sendAcl').checked = true;
			}			

		}
		
		cExecute ("$this.imap_functions.getaclfromuser&user="+user, handler_getaclfromuser);
	}
	
	cShareMailbox.prototype.setaclfromuser = function()
	{
		var acl		= '';
		var select 	= Element('em_select_sharefolders_users');

		if( select.selectedIndex == "-1" )
		{
			alert(get_lang("Select a user!"));
			return false;
		}
		
		var user = select.options[select.selectedIndex].value;
		
		if ( Element('em_input_readAcl').checked ) 
		{
			Element('em_input_sendAcl').disabled	= false;
			Element('em_input_deleteAcl').disabled	= false;
            Element('em_input_writeAcl').disabled	= false;
			acl = 'lrs';
		}
		else
		{
			Element('em_input_sendAcl').disabled	= true;
			Element('em_input_sendAcl').checked		= false;
			Element('em_input_deleteAcl').disabled	= true;
            Element('em_input_deleteAcl').checked	= false;
            Element('em_input_writeAcl').disabled	= true;
            Element('em_input_writeAcl').checked	= false;
                        
		}
				
		if (Element('em_input_deleteAcl').checked)
			acl += 'ida';

		if (Element('em_input_writeAcl').checked) {
			acl += 'wc';			
		}		
		if (Element('em_input_sendAcl').checked){
			acl += 'pa';			
		}
		
		var handler_setaclfromuser = function(data) {
			if (!data)
				alert(data);	
			return true;
		}
		cExecute ("$this.imap_functions.setaclfromuser&user="+user+"&acl="+acl, handler_setaclfromuser);
	}
	
	cShareMailbox.prototype.makeWindow =  function(optionsData)
	{
		var div  = null;
		var args = null;
		
		args =
		{
			'button_1' : ">>",
			'button_2' : "<<",
			'Note_This_sharing_will_take_action_on_all_of_your_folders_and_messages' : get_lang('Note: This sharing will take action on all of your folders and messages.'),
			'Organization' : get_lang('Organization'),
			'Search_user'  : get_lang('Search user'),
			'Users'		   : get_lang('Users'), 			
			'Your_mailbox_is_shared_with' : get_lang('Your mailbox is shared with'),
			'Access_right'			: get_lang('Access right'),
			'Read'					: get_lang('Read'),
			'Exclusion'				: get_lang('Exclusion'),
			'Write'					: get_lang('Write'),
			'Send'					: get_lang('Send'),
			'Save'					: get_lang('Save'),
			'hlp_msg_read_acl'		: get_lang('hlp_msg_read_acl'),
			'hlp_msg_delmov_acl'	: get_lang('hlp_msg_delmov_acl'),
			'hlp_msg_addcreate_acl'	: get_lang('hlp_msg_addcreate_acl'),
			'hlp_msg_sendlike_acl'	: get_lang('hlp_msg_sendlike_acl'),
			'hlp_msg_savelike_acl'	: get_lang('hlp_msg_savelike_acl')
		};
		
		div					= document.createElement("div");
		div.innerHTML		= this.xtools.parse(this.xtools.xml('sharedFolders'), 'sharedFolders.xsl', args );
		div.setAttribute( "style","overflow:hidden");
		div.setAttribute("id","sharemailbox");
		
		$(div).dialog(
		{
				resizable	: false,
				title		: get_lang("Mailbox Sharing"),
				position	: 'center',
				width		: 750,
				height		: 400,
				modal		: true,
				buttons		: [
								{
									text: get_lang("Close"),
									click: function()
									{
										$(this).dialog("destroy");
										div.removeChild(div.firstChild);	
									},
									style: "margin-top: -2.1em" 
								},
								{
									text: get_lang("Save"),
									click: function()
									{
										// Needed select all options from select
										var users_setacl = new Array();
										var select_users = Element('em_select_sharefolders_users');

										for(var i = 0; i < select_users.options.length; i++)
										{
											users_setacl[i] = select_users.options[i].value;
										}
										var attributes = connector.serialize(users_setacl);
										
										var handler_save = function(data)
										{
											if (data)
											{
												var sharedFoldersUsers = document.getElementById('em_select_sharefolders_users');
												
												for( var i = 0;i < sharedFoldersUsers.options.length; i++ )
												{
													if( sharedFoldersUsers.options[i].selected )
													{
														var value	= sharedFoldersUsers.options[i].value;
														var text	= sharedFoldersUsers.options[i].text;
														sharedFoldersUsers.options[i].parentNode.removeChild(sharedFoldersUsers.options[i]);
														sharedFoldersUsers.options[sharedFoldersUsers.options.length] = new Option( text, value, false, false);
													}
												}
												
												Element('em_input_readAcl').checked		= false;
												Element('em_input_deleteAcl').checked	= false;
												Element('em_input_writeAcl').checked	= false;
												Element('em_input_sendAcl').checked		= false;
												
									            Element('em_input_deleteAcl').disabled	= true;
									            Element('em_input_writeAcl').disabled 	= true;
												Element('em_input_sendAcl').disabled	= true;

												//$("#sharemailbox").empty();
												//$("#sharemailbox").dialog("destroy");
												$("#sharemailbox").parents().find(".ui-icon-closethick").trigger("click");
												
												write_msg(get_lang('Shared options saved with success'));

											}
										}

										cExecute ("$this.imap_functions.setacl", handler_save, 'users='+attributes);
										
									},
									style: "margin-top: -2.1em" 
								}
				],
				beforeClose	: function()
				{ 
					$(this).dialog("destroy");
					div.removeChild(div.firstChild);
				}
		});


		setTimeout(function()
		{
			var handler_organizations = function(data)
			{
				var user_organization = Element('user_organization').value;
				
				for(i = 0; i < data.length; i++)
				{
					Element('em_combo_org').options[i] = new Option(data[i].ou,data[i].dn);
					
					if(data[i].ou.indexOf("dc=") != -1 || user_organization.toUpperCase() == data[i].ou.toUpperCase())
					{
						Element('em_combo_org').options[i].selected = true;
						sharemailbox.get_available_users(data[i].dn);
					}
				}
			}
			
			cExecute ("$this.ldap_functions.get_organizations2&referral=false", handler_organizations);
			
		},100);
		
		Element('em_input_sendAcl').disabled	= true;
		Element('em_input_deleteAcl').disabled	= true;
		Element('em_input_writeAcl').disabled	= true;

		var selectSharedFolders = Element('em_select_sharefolders_users');
		
		for( var i in optionsData )
		{
			selectSharedFolders.options[selectSharedFolders.options.length] = new Option(optionsData[i].cn, optionsData[i].uid, false, false);
		}
	}
	
	var finderTimeout = '';
	
	cShareMailbox.prototype.optionFinderTimeout = function(obj, event)
	{
		if( event.keyCode === 13 )
		{	
			limit = 0;
			sharemailbox.optionFinder(obj.id);
		}	
		return;
	}
	
	cShareMailbox.prototype.optionFinder = function(id)
	{
			
		var sentence = Element(id).value;
		
		var url = '$this.ldap_functions.get_available_users2&context=' + Element('em_combo_org').value + ( sentence ? '&sentence=' + sentence: '' );

		return userFinder( sentence, 'em_select_available_users', url, 'em_span_searching');
	}
	
	cShareMailbox.prototype.add_user = function()
	{
		var select_available_users = document.getElementById('em_select_available_users');
		var select_users = document.getElementById('em_select_sharefolders_users');

		var count_available_users = select_available_users.length;
		var count_users = select_users.options.length;
		var new_options = '';
	
		for (i = 0 ; i < count_available_users ; i++)
		{
			if (select_available_users.options[i].selected)
			{
				if(document.all)
				{
					if ( (select_users.innerHTML.indexOf('value='+select_available_users.options[i].value)) == '-1' )
					{
						new_options +=  '<option value='
									+ select_available_users.options[i].value
									+ '>'
									+ select_available_users.options[i].text
									+ '</option>';
					}
				}
				else
				{
					if ( (select_users.innerHTML.indexOf('value="'+select_available_users.options[i].value+'"')) == '-1' )
					{
						new_options +=  '<option value='
									+ select_available_users.options[i].value
									+ '>'
									+ select_available_users.options[i].text
									+ '</option>';
					}
				}
			}
		}

		if ( new_options != '' )
		{
			select_users.innerHTML = '#' + new_options + select_users.innerHTML;
			select_users.outerHTML = select_users.outerHTML;
		}
	}

	cShareMailbox.prototype.remove_user = function()
	{
		select_users = document.getElementById('em_select_sharefolders_users');
	
	    var acl = '';
		var select 	= Element('em_select_sharefolders_users');
		var user = select.options[select.selectedIndex].value;
		
		var handler_setaclfromuser = function(data) {
			if (!data)
				alert(data);	
			return true;
		}
		
		cExecute ("$this.imap_functions.setaclfromuser&user="+user+"&acl="+acl, handler_setaclfromuser);
	  
	
		for( var i = 0 ; i < select_users.options.length; i++ )
		{
			if( select_users.options[i].selected )
			{
				select_users.options[i--] = null;
			}
		}
		
		Element('em_input_readAcl').checked = false;
		Element('em_input_deleteAcl').checked = false;
		Element('em_input_writeAcl').checked = false;
		Element('em_input_sendAcl').checked = false;
	
	}
		
/* Build the Object */
var sharemailbox = new cShareMailbox();
