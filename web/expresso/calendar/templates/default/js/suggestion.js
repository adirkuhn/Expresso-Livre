/**
 * Gerenciamento das sugestões de mudança de horário de compromissos feitas pelos usuários.
 * Prognus Software Livre - http://www.prognus.com.br
 */

var data_inicio_original; 
var data_final_original;  
var hora_inicio_original;
var minuto_inicio_original;
var hora_final_original;    
var minuto_final_original;
 
 window.onload = function(){
  if(location.href.indexOf("type=1") != -1)
	show_suggestion();
}

function validate_hour_field(data,begin)
{	
	begin==0? id='hora_inicio' : id='hora_final';
	if(isNaN(data.value))
	{
		alert("A hora deve ser um número");
		document.getElementById(id).value = "";
		return;
	}
	if(data.value < 0 || data.value >= 24)
	{
		alert("A hora deve estar entre 0 e 23");
		document.getElementById(id).value = "0";
		return;
	}
}

function validate_minute_field(data,begin)
{
	begin==0? id='minuto_inicio' : id='minuto_final';
	if(isNaN(data.value))
	{
		alert("O minuto deve ser um número");
		document.getElementById(id).value = "";
		data.focus();
		return;
	}
	if(data.value < 0 || data.value > 59)
	{
		alert("Os minutos devem estar entre 0 e 59"); 
		document.getElementById(id).value = "";
		data.focus();
		return;
	}
}

function validate_date_field(data, begin)
{
	begin==0? id='data_inicio' : id='data_final';
	if(isNaN(data.value) && data.value.indexOf('/')==-1)
	{
		alert("Por favor, complete a data somente com números");
		document.getElementById(id).value = "";
		return;
	}
	var expReg =  /^((((0?[1-9]|1\d|2[0-8])\/(0?[1-9]|1[0-2]))|((29|30)\/(0?[13456789]|1[0-2]))|(31\/(0?[13578]|1[02])))\/((19|20)?\d\d))$|((29\/0?2\/)((19|20)?(0[48]|[2468][048]|[13579][26])|(20)?00))$/;
    if ((data.value.match(expReg)) && data.value!='') 
	{
		var dts = new Date();  
        var dia_atual = dts.getDate();
        var mes_atual = dts.getMonth()+1;
        var ano_atual = dts.getFullYear();   

        var dia = data.value.substring(0,2);
        var mes = data.value.substring(3,5);
        var ano = data.value.substring(6,10);
		
		if((ano_atual>ano) || ((ano_atual==ano) && (mes_atual>mes)) || ((ano_atual==ano) && (mes_atual==mes) && (dia_atual>dia)))
		{
			alert("Formato inválido de data.\nCompromisso mais antigo que a data atual.");
			data.value = "";
			data.focus();
		}
    } 
	else 
	{
		if(data.value != '')
		{
			alert("Formato inválido de data.");
			data.value = "";
			data.focus();
		}
    } 
}


function insere_barras(begin)
{
	begin==0? id='data_inicio' : id='data_final';
	obj = document.getElementById(id);
	value = obj.value;
	l = value.toString().length;
	switch(l){
		case 2:
			obj.value = value + "/";
		break;
		case 5:
			obj.value = value + "/";
		break;
	}
}


function trata_botao_submit()
{
	inicio = document.getElementById('data_inicio').value.split("/");
	fim    = document.getElementById('data_final').value.split("/");
	
	if((document.getElementById('data_inicio').value == data_inicio_original) && (document.getElementById('data_final').value == data_final_original) && (document.getElementById('hora_inicio').value == hora_inicio_original) && (document.getElementById('minuto_inicio').value == minuto_inicio_original) && (document.getElementById('hora_final').value == hora_final_original) && (document.getElementById('minuto_final').value == minuto_final_original))
	{
		alert("A sugestão deve ser diferente do compromisso original.");
		return false;
	}
	
	if((inicio[2] > fim[2]) || ((inicio[1] > fim[1]) && (inicio[2]<=fim[2])) || (((inicio[0] > fim[0]) && ((inicio[1]<=fim[1]) && (inicio[2]<=fim[2])))))
	{
		alert("Data de início maior que data de fim.");
		return false;
	}

	if((parseInt(document.getElementById('hora_inicio').value) > parseInt(document.getElementById('hora_final').value)) || ((parseInt(document.getElementById('minuto_inicio').value) > parseInt(document.getElementById('minuto_final').value)) && (parseInt(document.getElementById('hora_inicio').value) <= parseInt(document.getElementById('minuto_final').value))))
	{
		alert("Hora de início maior que hora de término.");
		return false;
	}
	
	if((document.getElementById('data_inicio').value =="") || (document.getElementById('data_final').value =="") || (document.getElementById('hora_inicio').value =="") || (document.getElementById('minuto_inicio').value =="") || (document.getElementById('hora_final').value =="") || (document.getElementById('minuto_final').value =="")) 
	{	
		alert("Por favor, preencha todos os campos para enviar a solicitação.");
		return false;
	}
	else
	{
		alert("Novo horário sugerido com sucesso.\nUm email foi enviado para o criador do evento com sua sugestão."); 
		window.close();
	}
}


function show_suggestion()
{
	divElement = document.getElementById('suggestion');
	divElement.style.visibility = 'visible';
	divElement.style.display = 'block';
	
	data_inicio_original    = document.getElementById('data_inicio').value;
	data_final_original     = document.getElementById('data_final').value;
	hora_inicio_original    = document.getElementById('hora_inicio').value;
	minuto_inicio_original  = document.getElementById('minuto_inicio').value;
	hora_final_original     = document.getElementById('hora_final').value;
	minuto_final_original   = document.getElementById('minuto_final').value;

	return( false );
}


function fecha_sugestao()
{
	divSugestao = document.getElementById('suggestion');
	divSugestao.style.visibility = "hidden";
	divSugestao.style.display    = "none";
}
