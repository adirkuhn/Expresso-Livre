/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.A
 * By Binny V A
 * License : BSD
 */
shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}
		
		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;
			
			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}
	
			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown
	
			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,
	
				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,
	
				'pagedown':34,
				'page_down':34,
				'pd':34,
	
				'left':37,
				'up':38,
				'right':39,
				'down':40,
	
				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}
	
			var modifiers = { 
				shift: {wanted:false, pressed:false},
				ctrl : {wanted:false, pressed:false},
				alt  : {wanted:false, pressed:false},
				meta : {wanted:false, pressed:false}	//Meta is Mac specific
			};
                        
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
                        
			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
					
				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}

			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);
	
				if(!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					if ( Element('border_id_0') && Element('border_id_0').className != 'menu-sel' ){
						return false;
					}
					e.cancelBubble = true;
					e.returnValue = false;
	
					
					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
					if ( Element('border_id_0') && Element('border_id_0').className != 'menu-sel' ){
						return false;
					}
						
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
				
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
}

/* ExpressMail Functions */

var shift_up_count = 0;
var shift_down_count = 0;
var selMessageShortcut = "";

shortcut.add("N",function(e)
{
	// avoids problem related at ticket #1011
	e.preventDefault();
	var search_in_focus = false;
	var search_win = document.getElementById( 'QuickCatalogSearch_window_QuickCatalogSearch' );
	if ( search_win && search_win.style.visibility != 'hidden' )
		search_in_focus = true;

	if ( ! search_in_focus )
		new_message("new","null");
},{'disable_in_input':true});

shortcut.add("Esc",function(){
	var window_closed = false;
        var search_win = document.getElementById( 'window_QuickCatalogSearch' );
        
        for(var window in arrayJSWin)
        {
                if (arrayJSWin[window].visible)
                {
                    window_closed = true;
                    if(search_win.style.visibility == 'hidden'){
                        arrayJSWin[window].close();
                    }
                }
        }
        if((search_win) && (search_win.style.visibility == 'visible')){
            search_win.style.visibility = 'hidden';
            win.close();
       }        

	if (!window_closed)
		delete_border(get_msg_id(), 'false');
},{'disable_in_input':false});

shortcut.add("I",function(){print_all();},{'disable_in_input':true});
shortcut.add("E",function(e){ if(e.preventDefault) e.preventDefault(); else event.returnValue = false; exec_msg_action('forward');},{'disable_in_input':true});
shortcut.add("R",function(e){ if(e.preventDefault) e.preventDefault(); else event.returnValue = false; exec_msg_action('reply');},{'disable_in_input':true});
shortcut.add("T",function(e){ if(e.preventDefault) e.preventDefault(); else event.returnValue = false; var msg_id = get_msg_id(); if(msg_id) new_message("reply_to_all_with_history",msg_id);},{'disable_in_input':true});
shortcut.add("O",function(e){ if(e.preventDefault) e.preventDefault(); else event.returnValue = false; show_head_option();},{'disable_in_input':true});
shortcut.add("M",function(e){ if(e.preventDefault) e.preventDefault(); else event.returnValue = false; show_address_full();},{'disable_in_input':true});

shortcut.add("Delete",function(){
	
	
	var selected_shortcut_msgs = '';
	var tbody_box = Element('tbody_box');
	all_messages = Element('tbody_box').childNodes;
	
	for ( var i=0; i < all_messages.length; i++ )
	{
		if ( exist_className(all_messages[i], 'selected_shortcut_msg') )
		{
			selected_shortcut_msgs += all_messages[i].id + ',';
			
			if( all_messages[i].nextSibling )
				selMessageShortcut = all_messages[i].nextSibling.id + "-" + "down";
			else if(all_messages[i].previousSibling)
				selMessageShortcut = all_messages[i].previousSibling.id + "-" + "up";
		}
	}
	
	selected_shortcut_msgs = selected_shortcut_msgs.substring(0,(selected_shortcut_msgs.length-1));
	
	if ( Element('border_id_0').className === 'menu-sel' )
	{
		proxy_mensagens.delete_msgs(current_folder, selected_shortcut_msgs, 'null');
	}
	else
	{
		exec_msg_action('delete');
		select_msg(selMessageShortcut.substring(0, selMessageShortcut.indexOf("-")),
				   selMessageShortcut.substring(selMessageShortcut.indexOf("-")), true );
		
		proxy_mensagens.delete_msgs(current_folder, selected_shortcut_msgs, 'null');
	}
	
}
,{'disable_in_input':true});

shortcut.add("Ctrl+Up",function(){exec_msg_action('previous');/*select_msg('null', 'up');*/},{'disable_in_input':true});
shortcut.add("Ctrl+Down",function(){exec_msg_action('next');/*select_msg('null', 'down');*/},{'disable_in_input':true});

if (is_ie || is_webkit)
{
//**********************
shortcut.add('up', function(e)
        {
                var search_in_focus = false;
                var search_win = document.getElementById( 'window_QuickCatalogSearch' );
                if ( search_win && search_win.style.visibility == 'visible' )
                        search_in_focus = true;

                if ( !search_in_focus && currentTab == 0 )
                    select_msg('null', 'up');
                else
                    shortcut.remove('up');
				e.stopPropagation();
				e.preventDefault();
        },{'disable_in_input':false});


        shortcut.add('down', function(e)
        {
                var search_in_focus = false;
                var search_win = document.getElementById( 'window_QuickCatalogSearch' );
                if ( search_win && search_win.style.visibility == 'visible' )
                        search_in_focus = true;

                if ( !search_in_focus && currentTab == 0 )
                    select_msg('null', 'down');
                else
                    shortcut.remove('down');
				e.stopPropagation();
				e.preventDefault();
        },{'disable_in_input':false});

//****************

	shortcut.add("Shift+down",function(){
		if ( Element('border_id_0').className==='menu-sel' )
		{
			if (shift_up_count > 0)
				unselect_top_msg();
			else
				select_bottom_msg();
		}
	},{'disable_in_input':true, 'propagate':false});
	
	shortcut.add("Shift+up",function(){
		if ( Element('border_id_0').className==='menu-sel' )
		{
			if (shift_down_count > 0)
				unselect_bottom_msg();
			else
				select_top_msg();
		}
	},{'disable_in_input':true, 'propagate':false});
}
else
{
	shortcut.add("Up",function(){
		if (currentTab == 0)
		  select_msg('null', 'up');
	},{'disable_in_input':false});
	
	shortcut.add("Down",function(){
		if (currentTab == 0)
		  select_msg('null', 'down');
		
	},{'disable_in_input':false});
	
	shortcut.add("Shift+down",function(){
		if ( Element('border_id_0').className==='menu-sel' )
		{
			if (shift_up_count > 0)
				unselect_top_msg();
			else
				select_bottom_msg();
		}
	},{'type':'keypress','disable_in_input':true, 'propagate':false});
	
	shortcut.add("Shift+up",function(){
		if ( Element('border_id_0').className==='menu-sel' )
		{
			if (shift_down_count > 0)
				unselect_bottom_msg();
			else
				select_top_msg();
		}
	},{'type':'keypress', 'disable_in_input':true, 'propagate':false});
}

shortcut.add("return",function(){
	if ( Element('border_id_0').className==='menu-sel' )
	{
		all_messages = Element('tbody_box').childNodes;
		for (var i=0; i < all_messages.length; i++)
		{
			if ( exist_className(all_messages[i], 'selected_shortcut_msg') )
			{
				Element("td_from_" + all_messages[i].id).onclick();
				return;
			}
		}
	}
},{'disable_in_input':true});

shortcut.add("f9",function(){
	Element("em_refresh_button").onclick();
	return;
},{'disable_in_input':true});

function exec_msg_action(action)
{
	var msg_id = get_msg_id();
	if (msg_id)
	{
		var msg_id = 'msg_opt_' + action + '_' + msg_id;
		try {Element(msg_id).onclick();}
		catch(e){/*alert(e);*/}
	}
	return;
}

function show_head_option()
{
	var msg_id = get_msg_id();
    if (msg_id) {
		var msg_id = 'option_hide_more_' + msg_id;
		try {Element(msg_id).onclick();}
    		catch(e){/*alert(e);*/}
    }
	return;
}

function show_address_full()
{
	var toaddress = Element('div_toaddress_' + get_msg_id());	
	var ccaddress = Element('div_ccaddress_' + get_msg_id());
	
	if(toaddress &&  '' == toaddress.style.display) {
		show_div_address_full(get_msg_id(),'to');
	}
	else {
		if(toaddress)
			toaddress.style.display = '';
		var toaddress_full = Element('div_toaddress_full_' + get_msg_id());
		if(toaddress_full)
			toaddress_full.style.display = 'none';
	}		
	if(ccaddress &&  '' == ccaddress.style.display) {
		show_div_address_full(get_msg_id(),'cc');
	}
	else {
		if(ccaddress)
			ccaddress.style.display = '';
		var ccaddress_full = Element('div_ccaddress_full_' + get_msg_id());
		if(ccaddress_full)
			ccaddress_full.style.display = 'none';
	}
	return;
}

function get_msg_id()
{
	children = Element('border_tr').childNodes;
	
	for (var i=0; i<children.length; i++)
	{
		if ( (children[i].nodeName==='TD') && (children[i].className==='menu-sel') && children[i].id != 'border_id_0')
		{
			var border_selected = children[i];
			var msg_id = border_selected.id.replace("border_id_","");
			return msg_id;
		}
	}
	return false;
}

function select_msg(msg_number, keyboard_action, force_msg_selection)
{
    /*
	  ** Se caso for limpado toda a caixa de email,
	  ** é adicionado um novo atalho de seleção.
	  ** main.js on function refrash and line 629.
	*/
	
	if(keyboard_action == "reload_msg"){
	   if( $("#tbody_box .selected_shortcut_msg").length == 0 )
	   	$("#tbody_box tr:first").addClass("selected_shortcut_msg");	
	}
	
	shift_up_count = 0;
	shift_down_count = 0;

	if (msg_number != 'null')
	{
		if(Element(msg_number)){
			unselect_all_msgs();
			add_className(Element(msg_number), 'selected_shortcut_msg');
		}
	}
	else
	{
		var scrollMain = Element('divScrollMain_0');
		var selection_size = parseInt(preferences.line_height) + 10; 

		if( keyboard_action == 'down')
		{
			for (var i=all_messages.length-1; i >=0; i--)
			{
				if ( exist_className(all_messages[i], 'selected_shortcut_msg') )
				{
					add_className(all_messages[i+1], 'selected_shortcut_msg')
					var mailPos = i;
					break;
				}
			}
			
			for (; i>=0; i--)
			{
				if( all_messages[i].nextSibling )
					remove_className(all_messages[i], 'selected_shortcut_msg');
			}
			if ((mailPos) && (parseInt(scrollMain.style.height.substr(0,scrollMain.style.height.length-2)) + scrollMain.scrollTop) < (all_messages[mailPos].offsetTop + selection_size))
				scrollMain.scrollTop += selection_size;

		}
		else if( keyboard_action == 'up')
		{
			for (var i=0; i < all_messages.length; i++)
			{
				if ( exist_className(all_messages[i], 'selected_shortcut_msg') )
				{
					if( all_messages[i].previousSibling )
					{
						add_className(all_messages[i-1], 'selected_shortcut_msg')
						var mailPos = i;
						break;
					}
				}
			}
			
			for (; i< all_messages.length; i++)
			{
				remove_className(all_messages[i], 'selected_shortcut_msg')
			}
		if (typeof(all_messages[mailPos]) != 'undefined' && all_messages[mailPos].offsetTop <= scrollMain.scrollTop)
			scrollMain.scrollTop -= selection_size+10;
		}

		return true;
	}
}

function select_bottom_msg()
{
	all_messages = Element('tbody_box').childNodes;
	
	if ( exist_className(all_messages[all_messages.length-1], 'selected_shortcut_msg') )
		return;
	
	for (var i=all_messages.length-1; i >=0; i--)
	{
		if ( (exist_className(all_messages[i], 'selected_shortcut_msg')) && (i+1 <= all_messages.length-1) )
		{
			shift_down_count++;
			add_className(all_messages[i+1], 'selected_shortcut_msg');
			break;
		}
	}
}

function select_top_msg()
{
	all_messages = Element('tbody_box').childNodes;
		
	if ( exist_className(all_messages[0], 'selected_shortcut_msg') )
		return;
	
	for (var i=0; i <=all_messages.length-1; i++)
	{
		if ( exist_className(all_messages[i], 'selected_shortcut_msg') )
		{
			shift_up_count++;
			add_className(all_messages[i-1], 'selected_shortcut_msg');
			break;
		}
	}
}

function unselect_bottom_msg()
{
	all_messages = Element('tbody_box').childNodes;
	for (var i=all_messages.length-1; i >=0; i--)
	{
		if ( exist_className(all_messages[i], 'selected_shortcut_msg') )
		{
			shift_down_count--;
			remove_className(all_messages[i], 'selected_shortcut_msg');
			break;
		}
	}
}

function unselect_top_msg()
{
	all_messages = Element('tbody_box').childNodes;
	for (var i=0; i <=all_messages.length-1; i++)
	{
		if ( exist_className(all_messages[i], 'selected_shortcut_msg') )
		{
			shift_up_count--;
			remove_className(all_messages[i], 'selected_shortcut_msg');
			break;
		}
	}
}

function unselect_all_msgs()
{
	all_messages = Element('tbody_box').childNodes;
	for (var i=0; i <=all_messages.length-1; i++)
	{
		remove_className(all_messages[i], 'selected_shortcut_msg');
	}
}
