/******************************************************************************\
|**************************   CALENDAR MODULE   *******************************|
|********** INCLUDE PARTICIPANTS - PLUGIN USING AJAX EXPRESSOMAIL COMPONENT  **|
\******************************************************************************/
var contacts = '';
var expresso_offline = '';
var array_lang = new Array();
var finderTimeout = '';
// onUnload edit message
if(!document.all)
{
	var beforeunload = window.onbeforeunload;
	window.onbeforeunload = function()
	{
		if ( typeof beforeunload == 'function' )
			beforeunload();
	};
}
	
// Verifica versão do Firefox
var agt = navigator.userAgent.toLowerCase();
var is_firefox_0 = agt.indexOf('firefox/1.0') != -1 && agt.indexOf('firefox/0.') ? true : false;

var handler_get_available_users = function(fill)
{	
	var groupHandler = function( toGroup )
	{
	    switch( toGroup[ 'phpgwaccounttype' ] )
	    {
		case 'u':return 'users';
		break;
		case 'g':return 'groups';
		break;
                case 's':return 'shared_accounts';
                break
	    }

	    return( false );
	}

	return fillGroupableSelect( fill, 'user_list_in', groupHandler, default_field );
}	

function get_available_users(module,context,type, autoSearch){
// 	Element('cal_input_searchUser').value = '';
// 	if(autoSearch != 'True'){
// 		return true;
// 	}
// 	var context = document.getElementById('combo_org').value;	
// 	cExecute (module+'.ldap_functions.get_available_users&context='+context+'&type='+type, handler_get_available_users);
}

function optionFinderTimeout(obj, numMin, type, autoSearch, event){

	if( event.keyCode === 13 )
	{
	    //limit = 0;

	    optionFinderLdap( obj.id, numMin, type );

	    return( false );
	}

	return( true );
}
// Pesquisa Javascript
function optionFinderLocal(id){

	var sentence = Element( id ).value;

	finder( sentence, 'user_list_in' );
}

// Pesquisa LDAP
function optionFinderLdap(id,numMin, type){

	var sentence = Element( id ).value;

	var url = 'expressoMail1_2.ldap_functions.search_users&context=' + document.getElementById('combo_org').value + '&type='+(type == '' ? 'list' : 'search')+'&filter=' + sentence;
	
	var parser = function( data ){

	    var result = {};

	    for( accountType in data )
	    {
		var target = data[ accountType ];

		accountType = accountType.charAt(0);

		for( value in target )
		{
		    result[value] = {};
		    result[value][default_field] = target[value];
		    result[value]['phpgwaccounttype'] = accountType;
		}

	    }

	    return( result );
	};

	return userFinder( sentence, handler_get_available_users, url, parser, 'cal_span_searching' );
}

function add_user()
{
	var select_available_users = document.getElementById('user_list_in');
	var select_users = document.getElementById('user_list');
	var count_available_users = select_available_users.length;
	var count_users = select_users.options.length;
	var new_options = '';
	
	for (i = 0 ; i < count_available_users ; i++) {
		if (select_available_users.options[i].selected)	{
			if(document.all) {
				if ( (select_users.innerHTML.indexOf('value='+select_available_users.options[i].value)) == '-1' ) {
					new_options +=  '<option value='
								+ select_available_users.options[i].value
								+ '>'
								+ select_available_users.options[i].text
								+ '</option>';
				}
			}
			else if ( (select_users.innerHTML.indexOf('value="'+select_available_users.options[i].value+'"')) == '-1' ) {
					new_options +=  '<option value='
								+ select_available_users.options[i].value
								+ '>'
								+ select_available_users.options[i].text
								+ '</option>';
			}
		}
	}

	if (new_options != '') {

		if(is_firefox_0)
			fixBugInnerSelect(select_users,'###' + new_options + select_users.innerHTML);
		else
			select_users.innerHTML = '###' + new_options + select_users.innerHTML;

		select_users.outerHTML = select_users.outerHTML;
	}
}

function remove_user(){
	select_users = document.getElementById('user_list');
	
	for(var i = 0;i < select_users.options.length; i++)
		if(select_users.options[i].selected)
			select_users.options[i--] = null;
}

function submitValues(button){
    loadScript("expressoMail1_2/js/common_functions.js");
	button.disabled = true; //Desabilita Botão para evitar varios clicks

	var typeField = document.getElementById('cal[type]');
	if (typeField && typeField.value == 'hourAppointment') {
		if(document.getElementsByName('categories[]')[0].value == ""){
			alert(alert_msg);
			button.disabled = false;
			return false;
		}
	}

	var select_in = document.getElementById('user_list');
	for(i = 0; i < select_in.length; i++)
	 	select_in.options[i].selected = true;

	var rptDay = document.getElementsByName( 'cal[rpt_day][]' );
        var isChecked = false;

        for(var i = 0 ; i < rptDay.length; i++)
            if(rptDay[i].checked == true)
                isChecked = true;  
        
	if( !isChecked && !document.getElementsByName( "cal[rpt_use_end]" )[0].checked && !(document.getElementsByName( "cal[recur_type]" )[0].value === "0")){
	    alert("Agendamentos recorrentes precisam de data final da repetição");
	    button.disabled = false;
	    return false;
	}
   
	if( !isChecked && document.getElementsByName( "cal[recur_type]" )[0].value === "2" ){
	    //TODO: por essa mensagem no lang
	    alert("Voce nao especificou um dia na sua repeticao semanal");
	    button.disabled = false;
	    return false;
	}
	if(document.getElementsByName( "cal[rpt_use_end]" )[0].checked){
		if(!validate_date_order(document.getElementById('start[str]').value, document.getElementById('recur_enddate[str]').value)){
			alert("A data final não pode ser menor que a data inicial.");
			button.disabled = false;
			return false;
		}
	}
	//Valida data inicio nao nula
	if(document.getElementById('start[str]').value == ''){
		alert("Necessario preencher a data de início.");
		document.getElementById('start[str]').focus();
		button.disabled = false;
		return false;
	}
	//Valida data inicio
	if(document.getElementById('start[str]').value != ''){
		if(!validate_date(document.getElementById('start[str]').value)){
			document.getElementById('start[str]').value = '';
			document.getElementById('start[str]').focus();
			alert("A data de início não é válida.");
			button.disabled = false;
			return false;
		}
	}
	//Valida data termino
	if(document.getElementById('end[str]').value != ''){
		if(!validate_date(document.getElementById('end[str]').value)){
			document.getElementById('end[str]').value = '';
			document.getElementById('end[str]').focus();
			alert("A data de término não é válida.");
			button.disabled = false;
			return false;
		}
	}

	//Valida hora inicio somente numeros	
	if(isNaN(parseInt(document.getElementById('start_hour').value))){
		document.getElementById('start_hour').value = '';
		document.getElementById('start_hour').focus();
		alert("A hora de início deve ser números.");
		button.disabled = false;
		return false;
	}
	//Valida hora inicio somente numeros	
	if(isNaN(parseInt(document.getElementById('start_minute').value))){
		document.getElementById('start_minute').value = '';
		document.getElementById('start_minute').focus();
		alert("A hora de início deve ser números.");
		button.disabled = false;
		return false;
	}
	//Valida hora termino somente numeros	
	if(isNaN(parseInt(document.getElementById('end_hour').value))){
		document.getElementById('end_hour').value = '';
		document.getElementById('end_hour').focus();
		alert("A hora do término deve ser números.");
		button.disabled = false;
		return false;
	}
	//Valida hora termino somente numeros	
	if(isNaN(parseInt(document.getElementById('end_minute').value))){
		document.getElementById('end_minute').value = '';
		document.getElementById('end_minute').focus();
		alert("A hora do término deve ser números.");
		button.disabled = false;
		return false;
	}
	 
	//Valida hora inicial maior que final 
	if( (document.getElementById('start_hour').value != '') && (document.getElementById('end_hour').value != '') ){
		if( (document.getElementById('start_hour').value) > (document.getElementById('end_hour').value) ){
			//JA ESTA ERRADO
			document.getElementById('start_hour').value = '';
			document.getElementById('end_hour').value = '';
			document.getElementById('start_minute').value = '';
			document.getElementById('end_minute').value = '';
			document.getElementById('start_hour').focus();
			alert("A hora final não pode ser menor que a hora inicial.");
			button.disabled = false;
			return false;
		}else if ( (document.getElementById('start_hour').value) == (document.getElementById('end_hour').value) ){
			if ( (document.getElementById('start_minute').value) > (document.getElementById('end_minute').value) ){
				//DEU ERRO
				document.getElementById('start_hour').value = '';
				document.getElementById('end_hour').value = '';
				document.getElementById('start_minute').value = '';
				document.getElementById('end_minute').value = '';
				document.getElementById('start_hour').focus();
				alert("A hora final não pode ser menor que a hora inicial.");
				button.disabled = false;
				return false;
			}
		}
	}

	
        document.getElementById('formEvent').submit();
}	

function Element(id){
	return document.getElementById(id);
}

function loadScript(scriptPath){

	if(!connector)
		throw new Error("Error : Connector is not loaded.");
		
  	if (document.getElementById('uploadscript_'+scriptPath)) {
  		return;
   	}

  	if( connector.oxmlhttp === null )
	    connector.createXMLHTTP();

	connector.oxmlhttp.open("GET", scriptPath, false);
	connector.oxmlhttp.setRequestHeader('Content-Type','text/plain');
	connector.oxmlhttp.send(null);
	if(connector.oxmlhttp.status != 0 && connector.oxmlhttp.status != 200 || 	connector.oxmlhttp.status == 0 && connector.oxmlhttp.responseText.length == 0)
		throw new Error("Error " + connector.oxmlhttp.status + "("+connector.oxmlhttp.statusText+") when loading script file '"+scriptPath+"'");
	
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("SCRIPT");
	script.id = 'uploadscript_'+scriptPath;
	script.type = 'text/javascript';		
	script.text = connector.oxmlhttp.responseText;
	head.appendChild(script);
	return;	
}

function showExParticipants(el,path){
	Element('tbl_ext_participants').style.display='';
	el.style.display='none';
	loadScript(path+"/js/common_functions.js");
	get_lang = function( key ){
		var translator = Element( "txt_" + key.replace(/ /g, "_") );
		if (translator == null)
			return "Failed translating string.";
		var value = translator.value;
		if(arguments.length > 1) {
			for(j = 1; typeof(arguments[j]) != 'undefined'; j++)
				value = value.replace("%"+j,arguments[j]);
		}
		return value;
	}; 
	loadScript(path+"/js/DropDownContacts.js");
	loadScript(path+"/js/QuickCatalogSearch.js");
	loadScript("calendar/templates/default/js/over_fn_exmail.js");
	if(!contacts)
		cExecute (path+'.db_functions.get_dropdown_contacts', save_contacts);
}

function hideExParticipants(el,path){
	Element('a_ext_participants').style.display = '';
	Element('tbl_ext_participants').style.display ='none';
}

function save_contacts(data){
	contacts = data;	
	var input_to = Element("ex_participants");
	input_to.style.width = "100%";
	input_to.setAttribute("wrap","soft");	
	input_to.onfocus = function(){clearTimeout(parseInt(setTimeOutLayer));search_contacts('onfocus', this.id);};
	input_to.onblur = function(){setTimeOutLayer=setTimeout('search_contacts("lostfocus","'+this.id+'")',100);};
	if (!is_ie)
	{
		input_to.rows = 2;
		input_to.onkeypress = function (e)
		{
			if ((e.keyCode) == 120) //F9
			{
				emQuickSearch(input_to);
			}
			else 
			{ 
				if (((e.keyCode == 13) || ((e.keyCode == 38)||(e.keyCode == 40))) && (document.getElementById('tipDiv').style.visibility!='hidden'))
				{
					e.preventDefault();
					search_contacts(e.keyCode,this.id);
				}
			}
		}
		input_to.onkeyup = function (e)
		{
			if ((e.keyCode != 13) && (e.keyCode != 38) && (e.keyCode != 40))
			{
				search_contacts(e.keyCode,this.id);
			}
		}
	}
	else
	{
		input_to.rows = 3;
		input_to.onkeyup = function (e)
		{
			if ((window.event.keyCode) == 120) //F9
			{
				emQuickSearch(input_to);
			}
			else 
			{ 
				search_contacts(window.event.keyCode,this.id);
			}	
		}
	}
}

function fixBugInnerSelect(objeto,innerHTML){
/******
* select_innerHTML - altera o innerHTML de um select independente se é FF ou IE
* Corrige o problema de não ser possível usar o innerHTML no IE corretamente
* Veja o problema em: http://support.microsoft.com/default.aspx?scid=kb;en-us;276228
* Use a vontade mas coloque meu nome nos créditos. Dúvidas, me mande um email.
* Versão: 1.0 - 06/04/2006
* Autor: Micox - Náiron José C. Guimarães - micoxjcg@yahoo.com.br
* Parametros:
* objeto(tipo object): o select a ser alterado
* innerHTML(tipo string): o novo valor do innerHTML
*******/
    objeto.innerHTML = ""
    var selTemp = document.createElement("micoxselect")
    var opt;
    selTemp.id="micoxselect1"
    document.body.appendChild(selTemp)
    selTemp = document.getElementById("micoxselect1")
    selTemp.style.display="none"
    if(innerHTML.toLowerCase().indexOf("<option")<0){//se não é option eu converto
        innerHTML = "<option>" + innerHTML + "</option>"
    }
    innerHTML = innerHTML.replace(/<option/g,"<span").replace(/<\/option/g,"</span")
    selTemp.innerHTML = innerHTML
    for(var i=0;i<selTemp.childNodes.length;i++){
        if(selTemp.childNodes[i].tagName){
            opt = document.createElement("OPTION")
            for(var j=0;j<selTemp.childNodes[i].attributes.length;j++){
                opt.setAttributeNode(selTemp.childNodes[i].attributes[j].cloneNode(true))
            }
            opt.value = selTemp.childNodes[i].getAttribute("value")
            opt.text = selTemp.childNodes[i].innerHTML
            if(document.all){ //IEca
                objeto.add(opt)
            }else{
                objeto.appendChild(opt)
            }                    
        }    
    }
    document.body.removeChild(selTemp)
    selTemp = null
}

function changeViewMode(eltype){
	var chValue = eltype;
	switch (chValue){
		case 'hourAppointment':
			var names=new Array('title','priority','location','alarmhours','alarmminutes','recur_type','rpt_use_end','recur_interval','rpt_label');
			for (var i=0; i < names.length; i++)
			{
				var Field = document.getElementsByName('cal['+names[i]+']');
				if (Field[0])
					Field[0].parentNode.parentNode.style.display = "none";
			}

			Field = document.getElementsByName('participants[]');
			Field[0].parentNode.parentNode.style.display = "none";
			Field[1].parentNode.parentNode.style.display = "none";
			Field = document.getElementById('txt_loading');
			Field.parentNode.parentNode.style.display = "none";
			Field = document.getElementsByName('cal[rpt_day][]');
			Field[0].parentNode.parentNode.style.display = "none";
			break;
		case 'privateHiddenFields':
			var names=new Array('title','priority','location','alarmhours','alarmminutes','recur_type','rpt_use_end','recur_interval','rpt_label');
			for (var i=0; i < names.length; i++)
			{
				var Field = document.getElementsByName('cal['+names[i]+']');
				if (Field[0])
					Field[0].parentNode.parentNode.style.display = "";
			}
			Field = document.getElementsByName('participants[]');
			Field[0].parentNode.parentNode.style.display = "none";
			Field[1].parentNode.parentNode.style.display = "none";
			Field = document.getElementById('txt_loading');
			Field.parentNode.parentNode.style.display = "none";
			Field = document.getElementsByName('cal[rpt_day][]');
			Field[0].parentNode.parentNode.style.display = "";
			break;
		default:
			var names=new Array('title','priority','location','alarmhours','alarmminutes','recur_type','rpt_use_end','recur_interval','rpt_label');
			for (var i=0; i < names.length; i++)
			{
				var Field = document.getElementsByName('cal['+names[i]+']');
				if (Field[0])
					Field[0].parentNode.parentNode.style.display = "";
			}
			Field = document.getElementsByName('participants[]');
			Field[0].parentNode.parentNode.style.display = "";
			Field[1].parentNode.parentNode.style.display = "";
			Field = document.getElementById('txt_loading');
			Field.parentNode.parentNode.style.display = "";
			Field = document.getElementsByName('cal[rpt_day][]');
			Field[0].parentNode.parentNode.style.display = "";
			break;
	}

}
function updateTitleField(select){
	var typeField = document.getElementsByName('cal[type]');
	if (typeField[0].value != 'hourAppointment')
		return;
	var titleField = document.getElementsByName('cal[title]');
	var optionsArray = select.childNodes;
	titleField[0].value = '';
	for(option in optionsArray)
		if (optionsArray[option].selected)
			titleField[0].value += optionsArray[option].text + ' ';
}

var __onLoad = window.onload;
window.onload = function(){ 
	__onLoad();
	var cal_type = document.getElementById('cal[type]').value;
	changeViewMode(cal_type);
	if(cal_type == 'hourAppointment'){
		clearTimeout(timeout_get_available_users);
	}
};
