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
		
		if ((!data.status) && (data.error == "many results")){
			alert(get_lang('More than %1 results. Please, try to refine your search.',200));
			return false;
		}
			
		if (data.length > 0){
			QuickCatalogSearch.showList(data, quickSearchKeyBegin, quickSearchKeyEnd);
		}
		else
			alert(get_lang('None result was found.'));
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
		alert(get_lang('Your search argument must be longer than 4 characters.'));
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
	if(is_ie)
		Element("i_blank").style.display = "none";
	document.getElementById("ex_participants").focus();
	this.arrayWin['window_QuickCatalogSearch'].close();
}

/******************************************************************************\
|** Function      : emQuickCatalogSearch.prototype.close_QuickSearch_window ***|
|** Original File : <expressoMail_module>/js/QuickCatalogSearch.js ************|
\******************************************************************************/
emQuickCatalogSearch.prototype.close_QuickSearch_window = function (field, ID){
	if(is_ie)
		Element("i_blank").style.display = "none";
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

	if(is_ie) {	
		var _IFrame = Element("i_blank");
		if(_IFrame){
    		_IFrame.style.display  = '' ;		
		}
		else {
			_IFrame = document.body.appendChild(document.createElement('iframe'));
			_IFrame.src = 'about:blank' ;
		    _IFrame.frameBorder		= '0';
		    _IFrame.scrolling		= 'no' ;
		    _IFrame.style.left		= findPosX(div)  + document.body.scrollLeft -5;
			_IFrame.style.top		= findPosY(div)  + document.body.scrollTop  -20;
		    _IFrame.width			= 610;
   		    _IFrame.style.border	= 0;
			_IFrame.height			= 285;
			_IFrame.border			= 0;
			_IFrame.id				= "i_blank";
		    _IFrame.style.position	= 'absolute';
	   	    _IFrame.style.zIndex	= '5';
    		_IFrame.style.display  = '' ;
		}
	}

	win.open();
	document.getElementById('select_QuickCatalogSearch').focus();
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