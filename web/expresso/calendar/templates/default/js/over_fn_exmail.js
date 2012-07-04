/******************************************************************************\
|**************************   CALENDAR MODULE   *******************************|
|********** PLUGIN USING AJAX EXPRESSOMAIL COMPONENT - OVERWRITE FUNCTIONS   **|
\******************************************************************************/

/******************************************************************************\
|** Function      : emQuickSearch *********************************************|
|** Original File : <expressoMail_module>/js/common_functions.js **************|
\******************************************************************************/
window.onresize = function(){};
function emQuickSearch(el){

	var emailList = el.value;
	var field = el.id;
	var ex_participants = Element("ex_participants");
	var quickSearchKeyBegin;
	var quickSearchKeyEnd;
	
	var handler_emQuickSearch = function(data){
		window_DropDownContacts = Element('tipDiv');
		if (window_DropDownContacts.style.visibility != 'hidden'){
			window_DropDownContacts.style.visibility = 'hidden';
		}
		//if ((!data.status) && (data.error == "many results")){
		if (data != null && data.length >= data.maxResult){
			alert(get_lang('More than %1 results. Please, try to refine your search',data.maxResult));
		}
			
		if (data != null && data.length > 0){
			QuickCatalogSearch.showList(data, quickSearchKeyBegin, quickSearchKeyEnd);
		}
		else
			 alert(document.getElementById('txt_none_result').value);
		return true;
	}
	ex_participants.focus(); 				//mecessary for IE.
	var i = getPosition(ex_participants); //inputBox.selectionStart;
	var j = --i;

    while ((j >= 0) && (emailList.charAt(j) != ',')){j--};
    quickSearchKeyBegin = ++j;

    while ((i <= emailList.length) && (emailList.charAt(i) != ',')){i++};
    quickSearchKeyEnd = i;

    var search_for = trim(emailList.substring(quickSearchKeyBegin, quickSearchKeyEnd));

	if (search_for.length < 4){
		alert(document.getElementById('txt_min_search').value);
		return false;
	}
	
	cExecute ("expressoMail1_2.ldap_functions.quicksearch&search_for="+search_for+"&field="+field, handler_emQuickSearch);
}

/******************************************************************************\
|** Function      : emQuickCatalogSearch.prototype.transfer_result ************|
|** Original File : <expressoMail_module>/js/QuickCatalogSearch.js ************|
\******************************************************************************/
emQuickCatalogSearch.prototype.transfer_result = function (field, ID, begin, end){
	cm = document.getElementById('select_QuickCatalogSearch');
	option_selected = cm.options[cm.selectedIndex].value + ", ";
	emailList = Element("ex_participants").value;		
	new_emailList = emailList.substring(0, begin) + option_selected + emailList.substring((parseInt(end) + 2), emailList.length);
	document.getElementById("ex_participants").value = new_emailList;
	document.getElementById("ex_participants").focus();
	this.arrayWin['window_QuickCatalogSearch'].close();
}

/******************************************************************************\
|** Function      : emQuickCatalogSearch.prototype.close_QuickSearch_window ***|
|** Original File : <expressoMail_module>/js/QuickCatalogSearch.js ************|
\******************************************************************************/
emQuickCatalogSearch.prototype.close_QuickSearch_window = function (){
	document.getElementById("ex_participants").focus();
	this.arrayWin['window_QuickCatalogSearch'].close();
}

/******************************************************************************\
|** Function      : emQuickCatalogSearch.prototype.showWindow *****************|
|** Original File : <expressoMail_module>/js/QuickCatalogSearch.js ************|
\******************************************************************************/
emQuickCatalogSearch.prototype.showWindow = function (div)
{
	if(! div) {
		alert(get_lang('The list has no participant.'));
		return;
	}
						
	if(! this.arrayWin[div.id]) {
		div.style.width = "700px";
		div.style.height = "230px";
		var title = get_lang('The results were found in the Global Catalog')+':';
		var wHeight = div.offsetHeight + "px";
		var wWidth =  div.offsetWidth   + "px";
		div.style.width = div.offsetWidth - 5;

		win = new dJSWin({			
			id: 'QuickCatalogSearch_'+div.id,
			content_id: div.id,
			width: wWidth,
			height: wHeight,
			y:'300px',
			top: '300px',
			title_color: '#3978d6',
			bg_color: '#eee',
			title: title,						
			title_text_color: 'white',
			button_x_img: 'phpgwapi/images/winclose.gif',
			border: true });
		
		this.arrayWin[div.id] = win;
		win.draw();
	}
	else {
		win = this.arrayWin[div.id];
	}

	win.open();
	document.getElementById('select_QuickCatalogSearch').focus();
}	
/******************************************************************************\
|** Function      : emQuickCatalogSearch.prototype.showList *****************|
|** Original File : <expressoMail_module>/js/QuickCatalogSearch.js ************|
\******************************************************************************/

	emQuickCatalogSearch.prototype.showList = function(data, begin, end){
		id = '1';
		_this = this;
		var el = document.createElement("DIV");
		el.style.visibility = "hidden";
		el.style.position = "absolute";
		el.style.left = "0px";
		el.style.top = "0px";
		el.style.width = "0px";
		el.style.height = "0px";
		el.id = 'window_QuickCatalogSearch';
		document.body.appendChild(el);
		el.innerHTML = "";
		
		if (document.getElementById('select_QuickCatalogSearch') == null){

			var title_innerHTML = get_lang('Select a name') + ':';
			if (data.quickSearch_only_in_userSector)
				title_innerHTML += "<font color='BLACK' nowrap> ("+get_lang('Showing only the results found in your organization')+".)</font>"

			var title = document.createElement("SPAM");
			title.id = 'window_QuickCatalogSearch_title';
			title.innerHTML = "&nbsp;&nbsp;<b><font color='BLUE' nowrap>"+title_innerHTML+"</font></b><br>&nbsp;&nbsp;";
			el.appendChild(title);
			
			var cmb = document.createElement("SELECT");
			cmb.id = "select_QuickCatalogSearch";
			cmb.style.width = "685px";
			cmb.size = "12";
			cmb.ondblclick = function (e) { 
				QuickCatalogSearch.transfer_result(data.field, data.ID, begin, end);
			}
			cmb.onkeypress = function (e)
			{
				if (is_ie)
				{
					if ((window.event.keyCode) == 13)
					{
						QuickCatalogSearch.transfer_result(data.field, data.ID, begin, end);
					}
					else if ((window.event.keyCode) == 27)
					{
						QuickCatalogSearch.close_QuickSearch_window(data.field, data.ID);
					}
				}
				else
				{					
					if ((e.keyCode) == 13)
					{
						QuickCatalogSearch.transfer_result(data.field, data.ID, begin, end);
					}
					else if ((e.keyCode) == 27)
					{
						QuickCatalogSearch.close_QuickSearch_window(data.field, data.ID);
					}
				}
			};
			el.appendChild(cmb);

			var space = document.createElement('SPAN');
			space.innerHTML = "<BR>&nbsp;&nbsp;";
			el.appendChild(space);

			var butt = document.createElement('BUTTON');
			var buttext = document.createTextNode('OK');
			butt.id = "QuickCatalogSearch_button_ok";
			butt.appendChild(buttext);
			butt.onclick = function () {
				QuickCatalogSearch.transfer_result(data.field, data.ID, begin, end);
			};
			el.appendChild(butt);

			var space = document.createElement('SPAN');
			space.innerHTML = "&nbsp;&nbsp;";
			el.appendChild(space);

			var butt = document.createElement('BUTTON');
			butt.id = "QuickCatalogSearch_button_close";
			var buttext = document.createTextNode(get_lang('Close'));
			butt.appendChild(buttext);
			butt.onclick = function () { QuickCatalogSearch.close_QuickSearch_window(data.field, data.ID);};
			el.appendChild(butt);
		}
		else{
			var title_innerHTML = get_lang('Select a name') + ':';
			if (data.quickSearch_only_in_userSector)
				title_innerHTML += "<font color='BLACK' nowrap> ("+get_lang('Showing only the results found in your organization')+".)</font>"

			var title = Element('window_QuickCatalogSearch_title');
			title.innerHTML = "&nbsp;&nbsp;<b><font color='BLUE' nowrap>"+title_innerHTML+"</font></b><br>&nbsp;&nbsp;";
			
			var cmb = document.getElementById('select_QuickCatalogSearch');
			cmb.ondblclick = function (e) { 
				QuickCatalogSearch.transfer_result(data.field, data.ID, begin, end);
			}
			cmb.onkeypress = function (e)
			{
				if (is_ie)
				{
					if ((window.event.keyCode) == 13)
					{
						QuickCatalogSearch.transfer_result(data.field, data.ID, begin, end);
					}
					else if ((window.event.keyCode) == 27)
					{
						QuickCatalogSearch.close_QuickSearch_window(data.field, data.ID);
					}
				}
				else
				{
					if ((e.keyCode) == 13)
					{
						QuickCatalogSearch.transfer_result(data.field, data.ID, begin, end);
					}
					else if ((e.keyCode) == 27)
					{
						QuickCatalogSearch.close_QuickSearch_window(data.field, data.ID);
					}
				}
			};

			for (i=0; i<cmb.length; i++)
				cmb.options[i--] = null;
			
			var butt_ok = document.getElementById("QuickCatalogSearch_button_ok");
			var butt_close = document.getElementById("QuickCatalogSearch_button_close");
			butt_ok.onclick = function () {QuickCatalogSearch.transfer_result(data.field, data.ID, begin, end);};
			butt_close.onclick = function () {QuickCatalogSearch.close_QuickSearch_window(data.field, data.ID);};
		}

		for (i=0; i<data.length; i++){
			var Op = document.createElement("OPTION");
			Op.text = data[i].cn + ' (' + data[i].mail + ')';
			if (data[i].phone != '')
				Op.text += ' - ' + data[i].phone;
			if (data[i].ou != '')
				Op.text += ' - ' + data[i].ou; // adicionado "data[i].ou" para exibir setor (F9)
			Op.value = '"' + data[i].cn + '" ' + '<' + data[i].mail + '>';
			cmb.options.add(Op);
		}
		cmb.options[0].selected = true;
		_this.showWindow(el);
	}
/******************************************************************************\
|** Function      :  DRAG *****************************************************|
|** Original File : phpgwapi/js/wz_dragdrop/wz_dragdrop.js ********************|
\******************************************************************************/
var over_fn_DRAG = DRAG;
DRAG = function (event){

		if(is_ie)
			return false;
		else
			over_fn_DRAG(event);
}		
