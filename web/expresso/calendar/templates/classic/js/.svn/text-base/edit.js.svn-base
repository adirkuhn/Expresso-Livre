/******************************************************************************\
|**************************   MODULO   AGENDA   *******************************|
|********** SCRIPT REFERENTE A CAIXA DE INCLUSAO DE PARTICIPANTES  ************|
\******************************************************************************/

// Variaveis Locais 
	var select_in  = document.getElementById('user_list');
	var select_out  = document.getElementById('user_list_in');	
	var users_out = select_out ? select_out.cloneNode(true) : '';
	var finderTimeout = '';
																		
// Funcoes				
	function showExParticipants(el,path){
		document.getElementById('tbl_ext_participants').style.display='';
		el.style.display='none';
	}
	
	function hideExParticipants(el,path){
		document.getElementById('a_ext_participants').style.display = '';
		document.getElementById('tbl_ext_participants').style.display ='none';
	}
							
	function optionFinderTimeout(obj){

		clearTimeout(finderTimeout);	
		var oWait = document.getElementById("wait");
		oWait.innerHTML = 'Buscando...';
		finderTimeout = setTimeout("optionFinder('"+obj.id+"')",500);
	}
	function optionFinder(id) {	
		var oWait = document.getElementById("wait");
		var oText = document.getElementById(id);
		for(var i = 0;i < select_out.options.length; i++)				
			select_out.options[i--] = null;
																							
		for(i = 0; i < users_out.length; i++){																							
			if(users_out[i].text.substring(0 ,oText.value.length).toUpperCase() == oText.value.toUpperCase()) {
				sel = select_out.options;						
				option = new Option(users_out[i].text,users_out[i].value);				
				sel[sel.length] = option;
			}
		}
		oWait.innerHTML = '&nbsp;';
	}			
									
	function rem()
	{
		for(var i = 0;i < select_in.options.length; i++)				
			if(select_in.options[i].selected)
				select_in.options[i--] = null;																	
	}
		
	function submitValues(alert_msg){
		var typeField = document.getElementById('cal[type]');
		if (typeField && typeField.value == 'hourAppointment')
			if(document.getElementsByName('categories[]')[0].value == ""){
				alert(alert_msg);
				return false;
				}
		for(i = 0; i < select_in.length; i++)
		 	select_in.options[i].selected = true;
	}
	
		
    function show_disponibility() { 
		 
    	participants = ""; 
		    combo = document.getElementById('user_list'); 
		    if(combo.length==0) { 
		    	alert('set the participants'); 
		        return; 
		    } 
		                         
		    for (i=0;i<combo.length;i++) { 
		    	participants+=combo[i].value+","; 
		    } 
		    url = 'index.php?menuaction=calendar.uicalendar.disponibility&participants='+participants+'&date='+document.getElementById('start[str]').value; 
		                 
		    //alert(url); 
		    document.getElementById('frame_disponibility').src = url; 
		    document.getElementById('disponibility').style.display=''; 
		    //window.open(url); 
	}

	
	
	
	function openListUsers(newWidth,newHeight, owner){					
		newScreenX  = screen.width - newWidth;		
		newScreenY  = 0;		
		window.open('calendar/templates/classic/listUsers.php?owner='+owner,"","width="+newWidth+",height="+newHeight+",screenX="+newScreenX+",left="+newScreenX+",screenY="+newScreenY+",top="+newScreenY+",toolbar=no,scrollbars=yes,resizable=no");
	}

 	function adicionaListaCalendar() 
 	{
		var select = window.document.getElementById('user_list_in');
		var selectOpener = window.opener.document.getElementById('user_list');
		for (i = 0 ; i < select.length ; i++) {				

			if (select.options[i].selected) {
				isSelected = false;

				for(var j = 0;j < selectOpener.options.length; j++) {																			
					if(selectOpener.options[j].value == select.options[i].value){
						isSelected = true;						
						break;	
					}
				}

				if(!isSelected){

					option = window.opener.document.createElement('option');
					option.value =select.options[i].value;
					option.text = select.options[i].text;
					selectOpener.options[selectOpener.options.length] = option;	
				}
				
			}
		}
		selectOpener.options[selectOpener.options.length-1].selected = true;
 	}
	
// Fim        
