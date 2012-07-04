function formatBytes(bytes) {
    if (bytes >= 1000000000) {
	return (bytes / 1000000000).toFixed(2) + ' GB';
    }
    if (bytes >= 1000000) {
	return (bytes / 1000000).toFixed(2) + ' MB';
    }
    if (bytes >= 1000) {
	return (bytes / 1000).toFixed(2) + ' KB';
    }
    return bytes + ' B';
};

function validDateEvent(){
	
	var errors = {
		'emptyInitData': 'Por favor, informe uma data inicial',
		'emptyEndData': 'Por favor, informe uma data final',
		'emptyInitHour': 'Por favor, informe uma hora inicial',
		'emptyEndHour': 'Por favor, informe uma hora final',
		
		'invalidInitData' : 'Data inicial inválida',
		'invalidEndData' : 'Data final inválida',
		
		'equalData' : 'Hora inicial igual a final',
		'theirData' : 'Data final menor que a inicial',		
		'theirHour' : 'Hora final menor que a inicial',
		
		'emptyOcurrence' : 'Por favor, informe o número de ocorrências',
		'invalidOcurrence' : 'Por favor, informe um valor válido para a quantidade de ocorrências',
		
		'emptyInterval' : 'Por favor, informe o intervalo',
		'invalidInterval' : 'Por favor informe um valor válido para o intervalo'
	};

    var start_date = $(".new-event-win.active .start-date").val();
    var end_date   = $(".new-event-win.active .end-date").val();
    var start_time = $(".new-event-win.active .start-time").val();
    var end_time   = $(".new-event-win.active .end-time").val();
    var isAllDay   = $('.new-event-win.active input[name="allDay"]').is(':checked');
    var customDate = $(".endRepeat").val() == "customDate";
    var occurrences = $(".endRepeat").val() == "occurrences";
    var eventInterval = $('.eventInterval').val();
    
    if(start_date == "")
		return errors['emptyInitData'];
    else if(end_date == "")
		return errors['emptyEndData'];
    else if(!isAllDay && start_time == "")
		return errors['emptyInitHour'];
    else if(!isAllDay && end_time == "")
		return errors['emptyEndHour'];
	
    var formatString = User.preferences.dateFormat + " " + User.preferences.hourFormat;
		
    var startDate = Date.parseExact( start_date + " " + $.trim(start_time) , formatString );
    var endDate = Date.parseExact( end_date + " " + $.trim(end_time) , formatString );

    if(startDate == null || startDate.getTime() < 0 )
		return errors['invalidInitData'];
    if(endDate == null || endDate.getTime() < 0)
		return errors['invalidEndData'];
	
	if(isAllDay){
		startDate.clearTime();
		endDate.clearTime();
		if(endDate.compareTo(startDate) == -1)
			return errors['theirData'];
	}else{
		var condition = endDate.compareTo(startDate);
		if(condition != 1){
			if(condition < 0){
				startDate.clearTime();
				endDate.clearTime();
				condition = endDate.compareTo(startDate);				
				return (errors[ condition == 0 ? 'theirHour' : 'theirData'] );
			}
			else
				return errors['equalData'];
		}
	}
    
    if (customDate)    
		if ( !($('.new-event-win.active .customDateEnd').val().length) )
		   return errors['emptyEndData'];

    if (occurrences){
		if ( !($('.occurrencesEnd').val().length) ) 
		   return errors['emptyOcurrence'];
		else if (parseInt($('.occurrencesEnd').val(),10) <= 0 || parseInt($('.occurrencesEnd').val(),10).toString() == "NaN")
		   return errors['invalidOcurrence'];
	}

    if (!($('.new-event-win.active p.input-group.finish_event.repeat-in').hasClass('hidden'))){
        if (!eventInterval.length)
            return errors['emptyInterval'];
        else if (parseInt(eventInterval,10) < 1 || parseInt(eventInterval,10).toString() == "NaN")
            return errors['invalidInterval'];
    }    
    return false;
}

/*
function listEvents(){
	var list = $('.fc-header-right').find('.fc-button.fc-button-agendaDay').clone();
	$('.fc-header-right').find('.fc-button-year').toggleClass('fc-corner-right');
	list.addClass('fc-corner-right');
	list.addClass('fc-button-listagem');
	list.removeClass('fc-button-agendaDay');
	list.removeClass('fc-corner-left');
	list.find('.fc-button-content').html('Listagem');
	$('.fc-header-right').append(list);
}
*/

/*
 * TODO - repeat foi adicionado pois melhorias devem ser feitas no rollback do
 *DataLayer, repeat somente é usado quando se trata da criação de um evento
 *pela edição de uma ocorrência.
 */

function eventDetails( objEvent, decoded, path, isMail, repeat)
{
    attendees = {};
	
    if(path == undefined)
	path = "";
		
    if( !decoded )
	objEvent = DataLayer.decode( "schedulable:calendar", objEvent );

    if(!isMail)
	objEvent = DataLayer.encode( "schedulable:preview", objEvent );
	
    if(typeof(objEvent.id) == 'undefined'){
	objEvent.alarms = Calendar.signatureOf[User.preferences.defaultCalendar || Calendar.calendarIds[0]].defaultAlarms || false;
	objEvent.useAlarmDefault = 1;
    }
	
    /**
	 * canDiscardEventDialog deve ser true se não houver alterações no evento
	 */
    canDiscardEventDialog = true;
    /**
	 * zebraDiscardEventDialog é uma flag indicando que uma janela de confirmação (Zebra_Dialog)
	 * já está aberta na tela, uma vez que não é possivel acessar o evento ESC utilizado para fechá-la
	 */
    zebraDiscardEventDialog = false;
	
    /**
		ACLs do participant
	*/
    acl_names = {
	'w': 'acl-white',
	'i': 'acl-invite-guests',
	'p': 'acl-participation-required'
    };

    var dependsDelegate = function(reference, inverse){
	if(inverse){
	    if(reference.find('input[name="attendee[]"]').val() == blkAddAtendee.find('li.organizer input[name="attendee_organizer"]').val())
		blkAddAtendee.find('li.organizer input[name="attendee_organizer"]').val(blkAddAtendee.find('.me input[name="attendee[]"]').val());
	}else{
	    if(blkAddAtendee.find('.me input[name="attendee[]"]').val() == blkAddAtendee.find('li.organizer input[name="attendee_organizer"]').val())
		blkAddAtendee.find('li.organizer input[name="attendee_organizer"]').val(reference.find('input[name="attendee[]"]').val());
	}
	
    };
    
    var removeOthers = function(){
	var other = blkAddAtendee.find('.delegate.attendee-permissions-change-button');
	if(other.lenght){
	    dependsDelegate(other.parents('li'), true);
	}
	blkAddAtendee.find('.delegate').removeClass('attendee-permissions-change-button');
	blkAddAtendee.find('.ui-icon-transferthick-e-w').removeClass('attendee-permissions-change');
	
    };

    var callbackAttendee = function(){
	//Cria qtip de permissões pelo click do checkbox
	var checked = false;
	blkAddAtendee.find("li.not-attendee").addClass('hidden');
	
	blkAddAtendee.find("li .button").filter(".close.new").button({
	    icons: {
		primary: "ui-icon-close"
	    },
	    text: false
	}).click(function () {
	    DataLayer.remove('participant', $(this).parents('li').find('[type=checkbox]').val());
	    if($(this).parent().find('.button.delegate').hasClass('attendee-permissions-change-button')){
		removeOthers();
		blkAddAtendee.find('.request-update').addClass('hidden');
		blkAddAtendee.find('.status option').toggleClass('hidden');
				
		blkAddAtendee.find('option[value=1]').attr('selected','selected').trigger('change');
	    }
			
	    $(this).parents('li').remove();
			
	    if(blkAddAtendee.find(".attendee-list li").length == 1)
		blkAddAtendee.find("li.not-attendee").removeClass('hidden');
	})
	.addClass('tiny disable ui-button-disabled ui-state-disabled')
	.removeClass('new').end()
	
	.filter(".delegate.new").button({
	    icons: {
		primary: "ui-icon-transferthick-e-w"
	    },
	    text: false
	}).click(function () {
	    var me = $(this).parents('li');
	    if($(this).hasClass('attendee-permissions-change-button')){
		$(this).removeClass('attendee-permissions-change-button')   
		    .find('.ui-icon-transferthick-e-w').removeClass('attendee-permissions-change').end();               
		
		me.find('input[name="delegatedFrom[]"]').val('');
		dependsDelegate(me, true);
				
		blkAddAtendee.find('.request-update').addClass('hidden');
		blkAddAtendee.find('.status option').toggleClass('hidden');

		blkAddAtendee.find('option[value=1]').attr('selected','selected').trigger('change');
				
	    }else{
		removeOthers();
			
		$(this).addClass('attendee-permissions-change-button')   
		.find('.ui-icon-transferthick-e-w').addClass('attendee-permissions-change').end();               
		
		me.find('input[name="delegatedFrom[]"]').val(blkAddAtendee.find('.me input[name="attendee[]"]').val());
		
		dependsDelegate(me, false);
			
		blkAddAtendee.find('.request-update').removeClass('hidden');
		if(blkAddAtendee.find('.status option.hidden').length == 1)
		    blkAddAtendee.find('.status option').toggleClass('hidden');
			
		blkAddAtendee.find('option[value=5]').attr('selected','selected').trigger('change');
	    }
	})
	.addClass('tiny disable ui-button-disabled ui-state-disabled')
	.removeClass('new').end()
		
	.filter(".edit.new").button({
	    icons: {
		primary: "ui-icon-key"
	    },
	    text: false
	}).click(function() {
			
	    if(!!!checked)
		$(this).parents('li').find('[type=checkbox]').attr('checked', (!$(this).parent().find('[type=checkbox]').is(':checked'))).end();
			
	    var aclsParticipant =  $(this).parents('li').find('input[name="attendeeAcl[]"]').val();
	    checked = false;
			
	    if( $('.qtip.qtip-blue.qtip-active').val() !== ''){
		blkAddAtendee.find('dd.attendee-list').qtip({
		    show: {
		    ready: true, 
	    solo: true, 
	    when: {
		    event: 'click'
		    }
		},
		hide: false,
		content: {
		text: $('<div></div>').html( DataLayer.render( 'templates/attendee_permissions.ejs', {} ) ), 
		title: {
		text:'Permissões', 
		button: '<a class="button close" href="#">close</a>'
		}
		},
		style: {
		name: 'blue', 
	    tip: {
		corner: 'leftMiddle'
		}, 
	    border: {
		width: 4, 
	    radius: 8
		}, 
	    width: {
		min: 230, 
	    max:230
		}
	    },
	    position: {
	    corner: {
	    target: 'rightMiddle',
	    tooltip: 'leftMiddle'
	    },
	    adjust: {
	    x:0, 
	    y:0
	    }
	    }
	    })
	.qtip("api").onShow = function(arg0) {
	    $('.qtip-active .button.close').button({
		icons: {
		    primary: "ui-icon-close"
		},
		text: false
	    })
	    .click(function(){
		blkAddAtendee.find('dd.attendee-list').qtip('destroy');
	    });
					
	    $('.qtip-active .button.save').button().click(function(){
						
		var acl = '';
		$('.qtip-active').find('[type=checkbox]:checked').each(function(i, obj) {
		    acl+= obj.value;
		});

		blkAddAtendee.find('dd.attendee-list [type=checkbox]:checked').siblings('input[name="attendeeAcl[]"]').each(function(i, obj) { 
		    obj.value = 'r'+acl;
		}).parents('li').find('.button.edit').addClass('attendee-permissions-change-button')   
		.find('.ui-icon-key').addClass('attendee-permissions-change');               
						
		blkAddAtendee.find('dd.attendee-list [type=checkbox]').attr('checked', false);
						
		blkAddAtendee.find('dd.attendee-list').qtip('destroy');
					
	    });
	    $('.qtip-active .button.cancel').button().click(function(){
		blkAddAtendee.find('dd.attendee-list [type=checkbox]').attr('checked', false);
		blkAddAtendee.find('dd.attendee-list').qtip('destroy');
	    });
					
	    if(aclsParticipant)
		for(var i = 1; i < aclsParticipant.length; i++){
		    $('.qtip-active').find('input[name="'+acl_names[aclsParticipant.charAt(i)]+'"]').attr('checked', true);
		}
					
					
	    $('.button').button();
					
	};
	}else{
	    if(!$('.new-event-win dd.attendee-list').find('[type=checkbox]:checked').length){
		blkAddAtendee.find('dd.attendee-list').qtip('destroy');
	    }else{
		$('.qtip-active .button.save .ui-button-text').html('Aplicar a todos')
	    }
			
	};			
    })
.addClass('tiny disable ui-button-disabled ui-state-disabled')
.removeClass('new').end()
		
.filter(".open-delegate.new").click(function(){
    if($(this).hasClass('ui-icon-triangle-1-e')){
	$(this).removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
	$(this).parents('li').find('.list-delegates').removeClass('hidden');
    }else{
	$(this).removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
	$(this).parents('li').find('.list-delegates').addClass('hidden');
    }
		
}).removeClass('new');
	
	
blkAddAtendee.find("li input[type=checkbox].new").click(function(){
    if(!$('.new-event-win dd.attendee-list').find('[type=checkbox]:checked').length){
	blkAddAtendee.find('dd.attendee-list').qtip('destroy');
    }else{
	checked = true;
	$(this).parents('li').find('.button.edit').click();
    }
}).removeClass('new');
	
UI.dialogs.addEvent.find('.attendees-list li').hover(
    function () {
	$(this).addClass("hover-attendee");
	$(this).find('.button').removeClass('disable ui-button-disabled ui-state-disabled').end()
	.find('.attendee-options').addClass('hover-attendee');
    },
    function () {
	$(this).removeClass("hover-attendee");
	$(this).find('.button').addClass('disable ui-button-disabled ui-state-disabled').end()
	.find('.attendee-options').removeClass('hover-attendee');;
    }
    );
	
		
}

var html = DataLayer.render( path+'templates/event_add.ejs', {
    event:objEvent
});	
		
if (!UI.dialogs.addEvent) {
    UI.dialogs.addEvent = jQuery('#sandbox').append('<div title="Criar Evento" class="new-event-win active"> <div>').find('.new-event-win.active').html(html).dialog({
	resizable: false, 
	modal:true, 
	autoOpen: false,
	width:700, 
	position: 'center', 
	close: function(event, ui) {
		/**
		 * Remove tooltip possivelmente existente
		 */
		if ($('.qtip.qtip-blue.qtip-active').length)
			$('.qtip.qtip-blue.qtip-active').qtip('destroy');						
		attendees  = {};
	},
	beforeClose: function(event, ui) {

	    if (!canDiscardEventDialog && !zebraDiscardEventDialog) {
		zebraDiscardEventDialog = true;
		window.setTimeout(function() {
		    $.Zebra_Dialog('Suas alterações no evento não foram salvas. Deseja descartar as alterações?', {
			'type':     'question',
			'overlay_opacity': '0.5',
			'buttons':  ['Descartar alterações', 'Continuar editando'],
			'onClose':  function(clicked) {
			    if(clicked == 'Descartar alterações') {
				canDiscardEventDialog = true;
				/**
				*Remoção dos anexos do eventos caso seja cancelado a edição
				*/
				DataLayer.rollback();

				var ids = false;
				$.each($('.attachment-list input'), function (i, input) {
				    DataLayer.put('attachment', {id: ''+input.value});
				    DataLayer.remove('attachment', ''+input.value);
					ids = true;
				});
				if(ids)
					DataLayer.commit();
			
				
                                                                                
				UI.dialogs.addEvent.dialog('close');
			    }else{
				zebraDiscardEventDialog = false;
			    }
									
			    /**
			    * Uma vez aberta uma janela de confirmação (Zebra_Dialog), ao fechá-la
			    * com ESC, para que o evento ESC não seja propagado para fechamento da
			    * janela de edição de eventos, deve ser setada uma flag indicando que
			    * já existe uma janela de confirmação aberta.
			    */
			    if (!clicked) {
				window.setTimeout(function() {
				    zebraDiscardEventDialog = false;
				}, 200);
			    }
			}
		    });
							
		}, 300);

	    }
	    //DataLayer.rollback();
	    return canDiscardEventDialog;
	},
	dragStart: function(event, ui) {
		if ($('.qtip.qtip-blue.qtip-active').length)
			$('.qtip.qtip-blue.qtip-active').qtip('destroy');
	}
    });
			
} else {
    UI.dialogs.addEvent.html(html);
}
		
var tabs = UI.dialogs.addEvent.children('.content').tabs({
	select: function(event, ui) { 
		if ($('.qtip.qtip-blue.qtip-active').length)
			$('.qtip.qtip-blue.qtip-active').qtip('destroy');
	}	
	});
var calendar = DataLayer.get('calendar', objEvent.calendar);
				
if (calendar.timezone != objEvent.timezone){
    UI.dialogs.addEvent.find('.calendar-addevent-details-txt-timezone').find('option[value="'+objEvent.timezone+'"]').attr('selected','selected').trigger('change');
    UI.dialogs.addEvent.find('.calendar_addevent_details_lnk_timezone').addClass('hidden');
    $('.calendar-addevent-details-txt-timezone').removeClass('hidden');
			
}

DataLayer.render( path+'templates/event_repeat.ejs', {
    event:objEvent
}, function( repeatHtml ){

    UI.dialogs.addEvent.find('#calendar_addevent_details3').html(repeatHtml);
    $(".date").datepicker({
		dateFormat: User.preferences.dateFormat.replace(/M/g, 'm').replace(/yyyy/g, 'yy')
		});
		  
    if(objEvent.repeat) 
    {
	if( objEvent.repeat['id'] )
	{
	    $("[name='repeatId']:last").val( objEvent.repeat['id'] );
	}

	if( objEvent.repeat['frequency'] !== 'none' )
	{
	    if( objEvent.repeat['startTime'] && objEvent.repeat['startTime'] !== "0" )
	    {
		$("[name='startOptions'] [value='customDate']:last").attr( 'selected', 'selected' );
		$("[name='start']:last").val(new Date( parseInt(objEvent.repeat['startTime']) ).toString( User.preferences.dateFormat ) );
	    }
	    else
	    {
		$("[name='start']:last").val($("[name='startDate']:last").val());     
		$("[name='start']:last").readOnly=true;
		$("[name='start']:last").datepicker("disable");
	    }
			      
	    $(".finish_event").removeClass("hidden");

	    if(objEvent.repeat['endTime'] && objEvent.repeat['endTime'] !== "0" ) 
	    {
		//$("[name='occurrences']").addClass("hidden");
		$(".customDateEnd").removeClass("hidden");
		$(".endRepeat option[value='customDate']").attr('selected', 'selected')						
		$(".customDateEnd").val( new Date( parseInt(objEvent.repeat['endTime']) )/*.setTimezoneOffset( Timezone.timezone( objEvent.timezone ) )*/.toString( User.preferences.dateFormat ) );  
	    }
	    else if (objEvent.repeat['count'] && objEvent.repeat['count'] !== "0" ) {
		$(".endRepeat option[value='occurrences']").attr('selected', 'selected');						
		$(".occurrencesEnd").removeClass("hidden");
		$(".occurrencesEnd").val(objEvent.repeat['count']);						
	    }
			      
	    switch ( objEvent.repeat['frequency'] )
	    {
		case "daily":
		    $(".event-repeat-container:last").find(".repeat-in").find(".interval").html("Dia(s)")
		    .end().find(".eventInterval").val( objEvent.repeat['interval'] || "1" );
		    $(".frequency option[value='daily']").attr('selected', 'selected');
		    break;
		case "weekly":
		    $(".event-repeat-container:last").find(".repeat-in").find(".interval").html("Semana(s)")
		    .end().find(".eventInterval").val( objEvent.repeat['interval'] || "1" );
		    $(".frequency option[value='weekly']").attr('selected', 'selected');
					    
		    $(".event-repeat-weekly").removeClass("hidden");
					    
		    var day = [];
					    
		    if( objEvent.repeat.byday )
			day = objEvent.repeat.byday.split(',');
					    
		    for(i=0; i<day.length; i++) 
			$(".event-repeat-weekly [value='" + day[i] + "']").attr("checked","checked");
					    
		    break;
		case "monthly":
		    $(".event-repeat-container:last").find(".repeat-in").find(".interval").html("Mes(s)")
		    .end().find(".eventInterval").val( objEvent.repeat['interval'] || "1" );
		    $(".frequency option[value='monthly']").attr('selected', 'selected')
		    $(".event-repeat-monthly:last").removeClass("hidden").find("input[type=radio][name=repeatmonthyType]").click(function(){
			if($("input[type=radio][name=repeatmonthyType]:checked").val() == "1")
			    $(".event-repeat-weekly:last").removeClass("hidden");
			else
			    $(".event-repeat-weekly:last").addClass("hidden");
		    });
		    if($("input[type=radio][name=repeatmonthyType]:checked").val() == "1")
			$(".event-repeat-weekly:last").removeClass("hidden");
		    else
			$(".event-repeat-weekly:last").addClass("hidden");
		    break;
		case "yearly":
		    $(".event-repeat-container:last").find(".repeat-in").find(".interval").html("Ano(s)")
		    .end().find(".eventInterval").val( objEvent.repeat['interval'] || "1" );
		    $(".frequency option[value='yearly']").attr('selected', 'selected')
		    break;	
	    }
	}
    }
    else {
	$(".endRepeat option[value='never']").attr('selected', 'selected');
    }


    $(".event-repeat-container:last").find(".repeat-in").find("[name=startOptions]").change(function(){                                       

	if($(this).find("option:selected").val() == "Today"){
	    $("[name='start']:last").val($("[name='startDate']:last").val());
	    $("[name='start']:last").readOnly=true;
	    $("[name='start']:last").datepicker("disable");
	}
	else{
	    $("[name='start']:last").readOnly=false;
	    $("[name='start']:last").datepicker("enable");
	}
    });
    $(".event-repeat-container:last").find(".repeat-in").find("[name=endOptions]").change(function(){                                       
	if($(this).find("option:selected").val() == "never"){
	    $("[name='occurrences']").addClass("hidden");
	    $("[name='end']:last").addClass("hidden");
	}
	else if($(this).find("option:selected").val() == "customDate"){
	    $("[name='occurrences']").addClass("hidden");
	    $("[name='end']:last").removeClass("hidden");    
	}
	else{
	    $("[name='end']:last").addClass("hidden");
	    $("[name='occurrences']").removeClass("hidden");                                        
	}
    });
                        
    $("[name='frequency']:last").change(function () {
	$(".frequency-option").addClass("hidden");
	if($(this).val() == "none"){
	    $(".repeat-in").addClass("hidden");
	    return;
	}else{
	    $(".repeat-in").removeClass("hidden");
	    $("[name='start']:last").val($("[name='startDate']:last").val());
	}
                 
				 
	switch($(this).val()){
	    case "daily":
		$(".event-repeat-container:last").find(".repeat-in").find(".interval").html("Dia(s)");
		break;
	    case "weekly":
		$(".event-repeat-container:last").find(".repeat-in").find(".interval").html("Semana(s)");
		$(".event-repeat-weekly:last").removeClass("hidden");
		break;
	    case "monthly":
		$(".event-repeat-container:last").find(".repeat-in").find(".interval").html("Mes(s)");
		$(".event-repeat-monthly:last").removeClass("hidden").find("input[type=radio][name=repeatmonthyType]").click(function(){
		    if($("input[type=radio][name=repeatmonthyType]:checked").val() == "1")
			$(".event-repeat-weekly:last").removeClass("hidden");
		    else
			$(".event-repeat-weekly:last").addClass("hidden");
		});
		if($("input[type=radio][name=repeatmonthyType]:checked").val() == "1")
		    $(".event-repeat-weekly:last").removeClass("hidden");
		else
		    $(".event-repeat-weekly:last").addClass("hidden");
		break;
	    default:
		$(".event-repeat-container:last").find(".repeat-in").find(".interval").html("Ano(s)");
		break;
	}
				
    });
});

UI.dialogs.addEvent.find('.calendar_addevent_details_lnk_timezone').click(function(e){
    $(this).addClass('hidden');
    $('.calendar-addevent-details-txt-timezone').removeClass('hidden');
    e.preventDefault();
});
		
UI.dialogs.addEvent.find('.button.remove').button({
    text:false, 
    icons:{
	primary:'ui-icon-close'
    }
}).click(function(el){
    var id;
    if( id = $(this).parent().find('input[name="alarmId[]"]').val())
	DataLayer.remove('alarm', id);
    $(this).parent().remove().find('li').is(':empty');
});

var myCalendar = function(){
	for(var i in Calendar.signatures)
	    if(Calendar.signatures[i].isOwner == "1")
		return Calendar.signatures[i].calendar.id;
}

/*Seleciona a agenda padrão para visualização/edição de um evento*/
if(objEvent.id)
    UI.dialogs.addEvent.find('option[value="'+objEvent.calendar+'"]').attr('selected','selected').trigger('change');

/*Adicionar alarms padrões, quando alterado a agenda do usuário*/		
UI.dialogs.addEvent.find('select[name="calendar"]').change(function(){
    if((typeof($('input[name = "idEvent"]').val()) == 'undefined') || (!!!$('input[name = "idEvent"]').val())) {
	$('input[name = "isDefaultAlarm[]"]').parent().remove();
	UI.dialogs.addEvent.find('input[name="defaultAlarm"]').parent().removeClass('hidden');
	var calendarSelected = Calendar.signatureOf[$(this).val()];
	calendarSelected.useAlarmDefault = 1;
	if(calendarSelected.defaultAlarms != ""){
	    var li_attach = DataLayer.render(path+'templates/alarms_add_itemlist.ejs', {
		alarm:calendarSelected
	    });
	    jQuery('.event-alarms-list').append(li_attach).find('.button.remove').button({
		text:false, 
		icons:{
		    primary:'ui-icon-close'
		}
	    }).click(function(el) {
	    $(this).parent().remove().find('li').is(':empty');
	});

    }else{
	UI.dialogs.addEvent.find('input[name="defaultAlarm"]').parent().addClass('hidden');
    }
}

    var participant =  UI.dialogs.addEvent.find('dd.me input[name="attendee[]"]').val();
    var calendar = $(this).val();
    
    if( !parseInt(Calendar.signatureOf[calendar].isOwner) ){
	var signature = Calendar.signatureOf[calendar];
	var organizer = DataLayer.get('calendarSignature', {
	    filter: ['AND', ['=','calendar',signature.calendar.id], ['=','isOwner','1']], 
	    criteria: {
		deepness: 2
	    }
	});
			    
    if($.isArray(organizer))
	organizer = organizer[0];
    DataLayer.put('participant', {
	id: participant, 
	user: organizer.user.id, 
	mail: organizer.user.mail
	});
			    
    UI.dialogs.addEvent.find('dt.me').html(organizer.user.name);
    UI.dialogs.addEvent.find('li.organizer input[name="attendee_organizer"]').val(participant);
    UI.dialogs.addEvent.find('li.organizer label').filter('.name').html(organizer.user.name).end()
    .filter('.mail').html(organizer.user.mail).attr('title',organizer.user.mail);

}else{
    UI.dialogs.addEvent.find('dt.me').html(User.me.name);
    DataLayer.put('participant', {
	id: participant, 
	user: User.me.id, 
	mail: User.me.mail
	});
    UI.dialogs.addEvent.find('li.organizer input[name="attendee_organizer"]').val(participant);
    UI.dialogs.addEvent.find('li.organizer label').filter('.name').html(User.me.name).end()
    .filter('.mail').html(User.me.mail).attr('title',User.me.mail);
}

});

/*Checkbox adicionar alarms padrões*/
UI.dialogs.addEvent.find('input[name="defaultAlarm"]').click(function(){
    if($(this).attr("checked")){
	$('input[name="isDefaultAlarm[]"]').parent().remove();
	var calendarSelected = Calendar.signatureOf[$('select[name="calendar"]').val()];
	calendarSelected.useAlarmDefault = 1;
	if(calendarSelected.defaultAlarms != ""){
	    var li_attach = DataLayer.render(path+'templates/alarms_add_itemlist.ejs', {
		alarm:calendarSelected
	    });
	    jQuery('.event-alarms-list').append(li_attach).find('.button.remove').button({
		text:false, 
		icons:{
		    primary:'ui-icon-close'
		}
	    }).click(function(el) {
	    var id;
	    if( id = $(this).parent().find('input[name="alarmId[]"]').val())
		DataLayer.remove('alarm', id);
	    $(this).parent().remove().find('li').is(':empty') 
	});
    }
} else {
    $('input[name="isDefaultAlarm[]"]').parent().remove();
}
});
/* Checkbox allday */
UI.dialogs.addEvent.find('input[name="allDay"]').click(function(){
    $(this).attr("checked") ? 
    UI.dialogs.addEvent.find('.start-time, .end-time').addClass('hidden') :
    UI.dialogs.addEvent.find('.start-time, .end-time').removeClass('hidden'); 
    updateMap(true);
});

UI.dialogs.addEvent.find('.button').button();
UI.dialogs.addEvent.find('.button.add').button({
    icons: {
	secondary: "ui-icon-plus"
    }
});

// ==== validation events ====
UI.dialogs.addEvent.find(".input-group .h1").Watermark("Evento sem título");
if(User.preferences.hourFormat.length == 5) {
    UI.dialogs.addEvent.find(".end-time, .start-time").mask("99:99", {
	completed: function(){
	    updateMap();
	}
    });
} else {
    $.mask.definitions['{']='[ap]';
    $.mask.definitions['}']='[m]';
    UI.dialogs.addEvent.find(".end-time, .start-time").mask("99:99 {}", {
	completed:function(){
	    $(this).val(date.Calendar.defaultToAmPm($(this).val()));
	    $(this).timepicker("refresh");
	    $(this).val($(this).val().replace(/[\.]/gi, ""));
	    updateMap();
	}
    });
}
UI.dialogs.addEvent.find(".number").numeric();
User.preferences.dateFormat.indexOf('-') > 0 ? 
UI.dialogs.addEvent.find(".date").mask("99-99-9999", {
    completed:function(){
	updateMap();
    }
}) : 
UI.dialogs.addEvent.find(".date").mask("99/99/9999", {
    completed:function(){
	updateMap();
    }
});

UI.dialogs.addEvent.find(".menu-addevent")
.children(".delete").click(function(){
    $.Zebra_Dialog('Tem certeza que deseja excluir o evento?', {
	'type':     'question',
	'overlay_opacity': '0.5',
	'buttons':  ['Sim', 'Não'],
	'onClose':  function(clicked) {
	    if(clicked == 'Sim'){
		canDiscardEventDialog = true;
		/* Remove por filtro */
		DataLayer.removeFilter('schedulable', {filter: ['AND', ['=', 'id', objEvent.id], ['=', 'calendar', objEvent.calendar], ['=','user',(objEvent.me.user ? objEvent.me.user.id : objEvent.me.id)]]});
		Calendar.rerenderView(true);
		/********************/
		UI.dialogs.addEvent.dialog("close");
	    }
	}
    });
}).end()
	    
.children(".cancel").click(function(){
    UI.dialogs.addEvent.dialog("close");
}).end()
	    
.children(".save").click(function(){
    /* Validação */
    var msg = false;			
    if(msg = validDateEvent()){
	$(".new-event-win.active").find('.messages-validation').removeClass('hidden').find('.message label').html(msg); 
	return false;
    }
			
    canDiscardEventDialog = true;
			
    var exit = function(event){
	if(event)
	    DataLayer.remove('schedulable', event, false); 

	UI.dialogs.addEvent.children().find('form.form-addevent').submit();
	UI.dialogs.addEvent.dialog("close");
    }
                        
    if(repeat){
	DataLayer.remove('repeat', false);
	DataLayer.put('repeat', repeat);
	DataLayer.commit('repeat', false, exit(repeat.schedulable));
    }else
	exit();
}).end()
		
.children(".export").click(function(){
    UI.dialogs.addEvent.children().find(".form-export").submit();
});

var dates = UI.dialogs.addEvent.find('input.date').datepicker({
    dateFormat: User.preferences.dateFormat.replace(/M/g, 'm').replace(/yyyy/g, 'yy'),
    onSelect : function( selectedDate ){
	updateMap();
    }
});
//if(path == ""){
UI.dialogs.addEvent.find('input.time').timepicker({ 
    closeText: 'Ok',
    hourGrid: 4,
    minuteGrid: 10,
    ampm : ((User.preferences.hourFormat.length > 5) ? true: false),
    timeFormat: "hh:mm tt",
    onSelect: function (selectedDateTime){
	if(!(User.preferences.hourFormat.length == 5))
	    $(this).val(selectedDateTime.replace(/[\.]/gi, ""));								
	updateMap();
    },
    onClose : function (selectedDateTime){
	if(!(User.preferences.hourFormat.length == 5))
	    $(this).val(selectedDateTime.replace(/[\.]/gi, ""));
    }
});
//}

UI.dialogs.addEvent.find('.button-add-alarms').click(function(){
    var li_attach = DataLayer.render(path+'templates/alarms_add_itemlist.ejs', {});

    jQuery('.event-alarms-list').append(li_attach).find('.button.remove').button({
	text:false, 
	icons:{
	    primary:'ui-icon-close'
	}
    }).click(function(el) {
    $(this).parent().remove().find('li').is(':empty')
});
// valicacao de campos numericos
$('.number').numeric();
});
	    
		 
UI.dialogs.addEvent.find('.button.suggestion-hours').button({
    icons: {
	primary: "ui-icon-clock"
    },
    text: 'Sugerir horário'
}).click(function () {
    $(this).siblings('input').removeAttr('disabled')
    .end().parents().find('input[name="allDay"]').removeAttr('disabled');		
});


if(!repeat)
    if(objEvent.me.id == User.me.id){
	objEvent.me.id = DataLayer.put('participant', {
	    user: objEvent.me.id, 
	    mail: objEvent.me.mail
	    });
	objEvent.organizer.id = objEvent.me.id;
    }

var attendeeHtml = DataLayer.render( path+'templates/attendee_add.ejs', {
    event:objEvent
});		
	
// load template of attendees
var blkAddAtendee = UI.dialogs.addEvent.find('#calendar_addevent_details6').append(attendeeHtml);
if(objEvent.attendee.length)
    callbackAttendee();
/**
				Opções de delegação do participante/organizer
			*/		
blkAddAtendee.find(".button.participant-delegate").button({
    icons: {
	primary: "ui-icon-transferthick-e-w"
    },
    text: false
}).click(function () {
    if($(this).hasClass('attendee-permissions-change-button')){
	if(!$(this).hasClass('disable')){
	    $(this).removeClass('attendee-permissions-change-button')   
	    .find('.ui-icon-transferthick-e-w').removeClass('attendee-permissions-change').end();               
	    blkAddAtendee.find('.block-add-attendee.search').addClass('hidden');
	    blkAddAtendee.find('.block-add-attendee.search dt').html('Adicionar outros contatos');
	}
    }else{									
	$(this).addClass('attendee-permissions-change-button')   
	.find('.ui-icon-transferthick-e-w').addClass('attendee-permissions-change').end();               
	blkAddAtendee.find('.block-add-attendee.search dt').html('Delegar participação para');
	blkAddAtendee.find('.block-add-attendee.search').removeClass('hidden');
	blkAddAtendee.find('.block-add-attendee.search input.search').focus();
    }
})
.addClass('tiny');		
			
//show or hidden permissions attendees
//blkAddAtendee.find('.block-attendee-list #attendees-users li').click(show_permissions_attendees); 

UI.dialogs.addEvent.find(".attendee-list-add .add-attendee-input input").Watermark("digite um email para convidar");
/* Trata a edição de um novo participante adicionado
			* 
			*/
var hasNewAttendee = false;
			
blkAddAtendee.find('.attendee-list-add .add-attendee-input span').click(function(data){
    blkAddAtendee.find('.attendee-list-add .add-attendee-input input').keydown();
});
			
blkAddAtendee.find('.attendee-list-add .add-attendee-input input').keydown(function(event) {
				
    if (event.keyCode == '13' && $(this).val() != '' || (event.keyCode == undefined && $(this).val() != '')) {
	Encoder.EncodeType = "entity";
	$(this).val(Encoder.htmlEncode($(this).val()));
					
	newAttendeeEmail = false;
	newAttendeeName  = false;
	skipAddNewLine   = false;

	var info = $(this).val();

	/**
					 * email válido?
					 */
	info.match(/^[\w!#$%&'*+\/=?^`{|}~-]+(\.[\w!#$%&'*+\/=?^`{|}~-]+)*@(([\w-]+\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])$/) ? 
	newAttendeeEmail = info : newAttendeeName = info;

	/**
					 * 1) busca no banco para saber se o usuário já existe
					 *		1.1) se existe, atualiza as info na lista de participantes e nao abre o tooltip
					 *		1.2) se não existe
					 *			a) salva como novo usuario externo no banco (apenas com email)
					 *			b) exibe tooltip pedindo o nome
					 *			c) se o usuário preenche tooltip e salva, atualiza com o nome o usuário recém criado
					 *			d) se o usuário cancela o tooltip, fica o usuário salvo apenas com email e sem nome
					 */

	var user = DataLayer.get('user', ["=", "mail", $(this).val()]);
	if(!!user && user[0].id)
	    attendees[user[0].id] = {
		name: user[0].name
		};
					
	/**
					 * guarda o último tooltip aberto referente à lista de participantes 
					 */
	lastEditAttendeeToolTip = [];

	/**
					 * Valida email e salva um participante externo 
					 */
	var saveContact = function() {
	    Encoder.EncodeType = "entity";

	    var currentTip = $('.qtip-active');
	    newAttendeeName  = currentTip.find('input[name="name"]').val();
	    newAttendeeEmail = currentTip.find('input[name="mail"]').val();

	    if (!(!!newAttendeeEmail.match(/^[\w!#$%&'*+\/=?^`{|}~-]+(\.[\w!#$%&'*+\/=?^`{|}~-]+)*@(([\w-]+\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])$/))) {
		currentTip.find('.messages').removeClass('hidden').find('.message label').html('Email inválido.');
		return false;
	    }

	    DataLayer.put('user', {
		id:userId, 
		name:newAttendeeName, 
		mail:newAttendeeEmail, 
		isExternal:isExternal
	    });

	    lastEditAttendeeToolTip.find('label')
	    .filter('.name').html(Encoder.htmlEncode(newAttendeeName)).attr('title', Encoder.htmlEncode(newAttendeeName)).end()
	    .filter('.mail').html(Encoder.htmlEncode(newAttendeeEmail)).attr('title', Encoder.htmlEncode(newAttendeeEmail));

	    blkAddAtendee.find('.attendee-list-add .add-attendee-input input').val('');
	    return true;
	}
						
	/**
					 * Formata e adequa um tootip abert para edição de um participante na lista
					 */
	var onShowToolTip = function(arg0) {
	    $('.qtip-active .button.close').button({
		icons: {
		    primary: "ui-icon-close"
		},
		text: false
	    });
	    $('.qtip-active .button').button()
	    .filter('.save').click(function(event, ui) {
		if(saveContact())
		    lastEditAttendeeToolTip.qtip("destroy");
		else
		    return false;
	    }).end()
	    .filter('.cancel').click(function(event, ui) {
		lastEditAttendeeToolTip.qtip("destroy");
	    })

	    /** 
						 * Trata o ENTER no campo da tooltip, equivalente a salvar 
						 * o novo convidado.
						 */
	    $('.qtip-active input').keydown(function(event) {
		if (event.keyCode == '13') {						
		    if (saveContact())						
			lastEditAttendeeToolTip.qtip("destroy");
			
		    lastEditAttendeeToolTip.qtip("destroy");
		    event.preventDefault();
		}
	    })
	    .filter('[name="name"]').Watermark("informe o nome do contato").end()
	    .filter('[name="mail"]').Watermark("informe o email do contato");
	}
					
	/**
					 * Se o email digitado já foi adicionado na lista,
					 * o usuário deve ser avisado e um botão de edição deve ser exibido
					 */
	if(blkAddAtendee.find('label.mail[title="' + newAttendeeEmail + '"]').length) {
	    hasNewAttendee  = false;
	    newAttendeeName = blkAddAtendee.find('label.mail[title="' + newAttendeeEmail + '"]').parents('li').find('label.name').attr('title');

	    blkAddAtendee.find('.email-validation').removeClass('hidden')
	    .find('.message label').html("O usuário acima já foi adicionado! <a class=\"small button\">Editar</a>")
	    .find(".button").button().click(function () { 
		/**
							 * Se o usuário optar por editar o participante anteriormente adicionado,
							 * uma tooltip deve ser aberta para este participante, viabilizando a edição
							 */
		blkAddAtendee.find("ul.attendee-list").scrollTo('label.mail[title="' + newAttendeeEmail + '"]');
		/**
							 * Remove tooltip possivelmente existente
							 */
		if (lastEditAttendeeToolTip.length && lastEditAttendeeToolTip.data('qtip'))
		    lastEditAttendeeToolTip.qtip('destroy');
					
		lastEditAttendeeToolTip = blkAddAtendee.find('label.mail[title="' + newAttendeeEmail + '"]').parents('li');
		lastEditAttendeeToolTip.qtip({
		    show: {
			ready: true, 
			solo: true, 
			when: {
			    event: 'click'
			}
		    },
		hide: false,
		content: {
		    text: $('<div></div>').html( DataLayer.render( path+'templates/attendee_quick_edit.ejs', {
			attendee:{
			    name:newAttendeeName, 
			    mail:newAttendeeEmail
			}
		    } ) ), 
		title: {
		    text:'Detalhes do participante', 
		    button: '<a class="button close" href="#">close</a>'
		}
		},
		style: {
		    name: 'blue', 
		    tip: {
			corner: 'leftMiddle'
		    }, 
		    border: {
			width: 4, 
			radius: 8
		    }, 
		    width: {
			min: 230, 
			max:230
		    }
		},
	    position: {
		corner: {
		    target: 'rightMiddle',
		    tooltip: 'leftMiddle'
		},
		adjust: {
		    x:0, 
		    y:0
		}
	    }
	    });
	lastEditAttendeeToolTip.qtip("api").onShow = onShowToolTip;
    });
skipAddNewLine = true;
} else {
    hasNewAttendee  = true;
    blkAddAtendee.find('.email-validation').addClass('hidden');
}
					
					
var isExternal = (!!user && !(!!user.isExternal)) ? 0 : 1;

/**
					 * Remove tooltip possivelmente existente
					 */
if (lastEditAttendeeToolTip.length && lastEditAttendeeToolTip.data('qtip'))
    lastEditAttendeeToolTip.qtip('destroy');

userId = '';
var newAttendeeId = '';

if (user){
    if (!skipAddNewLine) {
	user[0].id =  DataLayer.put('participant', {
	    user: user[0].id, 
	    isExternal: isExternal, 
	    acl: 'r'
	});
	user[0].acl = objEvent.acl;
	user[0].isDirty = !!!objEvent.id;

	blkAddAtendee.find('dd.attendee-list ul.attendee-list').append(
	    DataLayer.render(path+'templates/participants_add_itemlist.ejs', user)
	    )
	.scrollTo('max');
	callbackAttendee();
    }
						
    $(this).val('');

} else if (!skipAddNewLine) {		
    /**
						 * a) salva como novo usuario externo no banco (apenas com email) e...
						 * adiciona novo contato externo à lista de convidados
						 */

    userId = DataLayer.put('user', {
	name: newAttendeeName, 
	mail: newAttendeeEmail, 
	isExternal: isExternal
    });
    newAttendeeId = DataLayer.put('participant', {
	user: userId, 
	isExternal: isExternal
    });

						 
    blkAddAtendee.find('dd.attendee-list ul.attendee-list').append(
	DataLayer.render(path+'templates/participants_add_itemlist.ejs', [{
	    id:newAttendeeId, 
	    name: newAttendeeName, 
	    mail: newAttendeeEmail, 
	    isExternal: 1, 
	    acl: objEvent.acl,
	    isDirty: !!!objEvent.id
	    }])
	).scrollTo('max');
    callbackAttendee();

    /** 
						 * Adiciona tootip para atualização dos dados do contato externo
						 * recém adicionado.
						 */
    lastEditAttendeeToolTip = blkAddAtendee.find('dd.attendee-list li:last');
    lastEditAttendeeToolTip.qtip({
	show: {
	    ready: true, 
	    solo: true, 
	    when: {
		event: 'click'
	    }
	},
    hide: false,
    content: {
	text: $('<div></div>').html( DataLayer.render( path+'templates/attendee_quick_edit.ejs', {
	    attendee:{
		name:newAttendeeName, 
		mail:newAttendeeEmail
	    }
	} ) ), 
    title: {
	text:'Detalhes do participante', 
	button: '<a class="button close" href="#">close</a>'
    }
    },
    style: {
	name: 'blue', 
	tip: {
	    corner: 'leftMiddle'
	}, 
	border: {
	    width: 4, 
	    radius: 8
	}, 
	width: {
	    min: 230, 
	    max:230
	}
    },
position: {
    corner: {
	target: 'rightMiddle',
	tooltip: 'leftMiddle'
    },
    adjust: {
	x:0, 
	y:0
    }
}
});
			
lastEditAttendeeToolTip.qtip("api").onShow = onShowToolTip;

$(this).val('');

						
}
event.preventDefault();
}
				
});

/** 
			* Trata a busca de usuários para adição de participantes
			*/
blkAddAtendee.find('.add-attendee-search .ui-icon-search').click(function(event) {
    blkAddAtendee.find('.add-attendee-search input').keydown();
});
			
			
blkAddAtendee.find('.add-attendee-search input').keydown(function(event) {

    if(event.keyCode == '13' || typeof(event.keyCode) == 'undefined') {			
	var result = DataLayer.get('user', ["*", "name", $(this).val()], true);

	/**
        * TODO: trocar por template
        */
	blkAddAtendee.find('ul.search-result-list').empty().css('overflow', 'hidden');
	if (!result) {
	    blkAddAtendee.find('ul.search-result-list').append('<li><label class="empty">Nenhum resultado encontrado.</label></li>');
	}

	for(i=0; i<result.length; i++)
	    result[i].enabled = (blkAddAtendee.find('dd.attendee-list ul.attendee-list label.mail[title="' +  result[i].mail + '"]').length) ? false : true;
											
	blkAddAtendee.find('ul.search-result-list').append(DataLayer.render( path+'templates/participants_search_itemlist.ejs', result));

	blkAddAtendee.find('ul.search-result-list li').click(function(event, ui){
	    if ($(event.target).is('input')) {
		old_item = $(event.target).parents('li');
		newAttendeeId = DataLayer.put('participant', {
		    user: old_item.find('.id').html(), 
		    isExternal: old_item.find('.isExternal').html()
		});
							
		attendees[old_item.find('.id').html()] = old_item.find('.name').html();
							
		blkAddAtendee.find('dd.attendee-list ul.attendee-list')
		.append(DataLayer.render(path+'templates/participants_add_itemlist.ejs', [{
		    id: newAttendeeId, 
		    name: old_item.find('.name').html(), 
		    mail: old_item.find('.mail').html(), 
		    isExternal: old_item.find('.isExternal').html(), 
		    acl: objEvent.acl,
		    isDirty: !!!objEvent.id
		    }]))
		.scrollTo('max');
		/**
							* Delegação de participação de um participante com permissão apenas de leitura
							*
							*/
		if(!objEvent.acl.organization && !objEvent.acl.write && !objEvent.acl.inviteGuests && objEvent.acl.read ){
								
		    blkAddAtendee.find('.block-add-attendee.search').addClass('hidden');
		    blkAddAtendee.find('.block-add-attendee.search dt').html('Adicionar outros contatos');
								
		    blkAddAtendee.find('.status option').toggleClass('hidden');
		    blkAddAtendee.find('option[value=5]').attr('selected','selected').trigger('change');
		    blkAddAtendee.find('.request-update').removeClass('hidden');

		    blkAddAtendee.find('dd.attendee-list ul.attendee-list li .button.close').parents('li').find('input[name="delegatedFrom[]"]').val(blkAddAtendee.find('.me input[name="attendee[]"]').val());
								
		    blkAddAtendee.find('.me .participant-delegate').addClass('disable ui-button-disabled ui-state-disabled');
		    blkAddAtendee.find(".button.close").button({
			icons: {
			    primary: "ui-icon-close"
			},
			text: false
		    }).click(function () {
									
			$(this).parents('li').find('input[name="delegatedFrom[]"]').val('');
			blkAddAtendee.find('.request-update').addClass('hidden');
			blkAddAtendee.find('.status option').toggleClass('hidden');
			blkAddAtendee.find('option[value=1]').attr('selected','selected').trigger('change');			
			blkAddAtendee.find('.me .participant-delegate').removeClass('disable ui-button-disabled ui-state-disabled attendee-permissions-change-button')
			.find('.ui-icon-person').removeClass('attendee-permissions-change').end();               	
									
			DataLayer.remove('participant', $(this).parents('li').find('[type=checkbox]').val());
			$(this).parents('li').remove();
		    })
		    .addClass('tiny');
		}else{
		    callbackAttendee();
		    old_item.remove();
		}
	    }
	});

	event.preventDefault();
    }
});
//$('.block-add-attendee .search-result-list').selectable();

UI.dialogs.addEvent.find('.row.fileupload-buttonbar .button').filter('.delete').button({
    icons: {
	primary: "ui-icon-close"
    },
    text: 'Excluir'
}).click(function () {
    $.Zebra_Dialog('Tem certeza que deseja excluir todos anexos?', {
	'type':     'question',
	'overlay_opacity': '0.5',
	'buttons':  ['Sim', 'Não'],
	'onClose':  function(clicked) {
	    if(clicked == 'Sim'){
		
                var ids = [];
                $.each($('.attachment-list input'), function (i, input) {
                     DataLayer.remove('schedulableToAttachment', {
                        filter: ['=', 'id', ''+input.value]
                        });
                });
                $('.attachment-list input').remove();
                $('.row.fileupload-buttonbar .attachments-list p').remove();
            }
        }});
}).end()
.filter('.close').button({
    icons: {
	primary: "ui-icon-close"
    },
    text: false
}).click(function () {
    DataLayer.remove('schedulableToAttachment', $(this).parents('p').find('input[name="fileId[]"]').val());
    $(this).parents('p').remove();
}).end()
.filter('.downlaod-archive').button({
    icons: {
	primary: "ui-icon-arrowthickstop-1-s"
    },
    text: false
});
var maxSizeFile = 2000000;
$('#fileupload').fileupload({
    sequentialUploads: true,
    add: function (e, data) {
	if(data.files[0].size < maxSizeFile)
	    data.submit();
    },
    change: function (e, data) {
	$.each(data.files, function (index, file) {
	    var attach = {};
	    attach.fileName = file.name;
	    var ext = file.name.split('.');
	    if(file.name.length > 10)
		attach.fileName = ext.length == 1 ? file.name.substr(0, 10) :  file.name.substr(0, 6) + '.' + ext[ext.length -1];
	    attach.fileSize = formatBytes(file.size);
	    if(file.size > maxSizeFile)
		attach.error = 'Tamanho de arquivo nao permitido!!'
				
	    $('.attachments-list').append(DataLayer.render(path+'templates/attachment_add_itemlist.ejs', {
		file : attach
	    }));
				
	    if(file.size < maxSizeFile){
		$('.fileinput-button.new').append(data.fileInput[0]).removeClass('new');
		$('.attachments-list').find('[type=file]').addClass('hidden');
					
	    }else
		$('.fileinput-button.new').removeClass('new');
				
				
	    $('.attachments-list').find('.button.close').button({
		icons: {
		    primary: "ui-icon-close"
		},
		text: false
	    }).click(function(){
		var idAttach = $(this).parent().find('input[name="fileId[]"]').val();
		$('.attachment-list').find('input[value="'+idAttach+'"]')
		$(this).parent().remove();
	    });	
				
	})
	},
    done: function(e, data){
	var currentUpload = $('.progress.after-upload:first').removeClass('after-upload').addClass('on-complete').hide();

	if(!!data.result && data.result != "[]"){
	    var newAttach = (attch = jQuery.parseJSON(data.result)) ? attch : jQuery.parseJSON(data.result[0].activeElement.childNodes[0].data);
	    $('.attachment-list').append('<input tyepe="hidden" name="attachment[]" value="'+newAttach['attachment'][0][0].id+'"/>');
	    currentUpload.removeClass('on-complete').parents('p')
	    .append('<input type="hidden" name="fileId[]" value="'+newAttach['attachment'][0][0].id+'"/>')
	    .find('.status-upload').addClass('ui-icon ui-icon-check');
	}else
	    currentUpload.removeClass('on-complete').parents('p').find('.status-upload').addClass('ui-icon ui-icon-cancel');
    }
});
$('.attachments-list .button').button();

if(!!window.FormData)			
$('#fileupload').bind('fileuploadstart', function () {
    var widget = $(this),
    progressElement = $('#fileupload-progress').fadeIn(),
    interval = 500,
    total = 0,
    loaded = 0,
    loadedBefore = 0,
    progressTimer,
    progressHandler = function (e, data) {
	loaded = data.loaded;
	total = data.total;
    },
    stopHandler = function () {
	widget
	.unbind('fileuploadprogressall', progressHandler)
	.unbind('fileuploadstop', stopHandler);
	window.clearInterval(progressTimer);
	progressElement.fadeOut(function () {
	    progressElement.html('');
	});
    },
    formatTime = function (seconds) {
	var date = new Date(seconds * 1000);
	return ('0' + date.getUTCHours()).slice(-2) + ':' +
	('0' + date.getUTCMinutes()).slice(-2) + ':' +
	('0' + date.getUTCSeconds()).slice(-2);
    },
    /* formatBytes = function (bytes) {
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            if (bytes >= 1000) {
                return (bytes / 1000).toFixed(2) + ' KB';
            }
            return bytes + ' B';
        },*/
    formatPercentage = function (floatValue) {
	return (floatValue * 100).toFixed(2) + ' %';
    },
    updateProgressElement = function (loaded, total, bps) {
	progressElement.html(
	    formatBytes(bps) + 'ps | ' +
	    formatTime((total - loaded) / bps) + ' | ' +
	    formatPercentage(loaded / total) + ' | ' +
	    formatBytes(loaded) + ' / ' + formatBytes(total)
	    );
    },
    intervalHandler = function () {
	var diff = loaded - loadedBefore;
	if (!diff) {
	    return;
	}
	loadedBefore = loaded;
	updateProgressElement(
	    loaded,
	    total,
	    diff * (1000 / interval)
	    );
    };
    widget
    .bind('fileuploadprogressall', progressHandler)
    .bind('fileuploadstop', stopHandler);
    progressTimer = window.setInterval(intervalHandler, interval);
});
	
if(objEvent.isShared){
		
    var acls = Calendar.signatureOf[objEvent.calendar].permission.acl;
		
    if(!acls.write){
	UI.dialogs.addEvent.find(':input').attr('disabled', 'disabled');
	UI.dialogs.addEvent.find('.button').hide();
    }
		
    if(acls.remove)
	UI.dialogs.addEvent.find('.button.remove').show();
    
    UI.dialogs.addEvent.find('.button.cancel').show();	
}

disponibily(objEvent, path, attendees);

/*Seleciona a agenda padrão para criação de um evento*/
if(!objEvent.id){
    var selectedCalendar = (objEvent.calendar != undefined) ? objEvent.calendar : (User.preferences.defaultCalendar ? User.preferences.defaultCalendar : myCalendar());
    UI.dialogs.addEvent.find('option[value="'+selectedCalendar+'"]').attr('selected','selected').trigger('change');
}
UI.dialogs.addEvent.find(':input').change(function(event){
    if (event.keyCode != '27' && event.keyCode != '13')
	canDiscardEventDialog = false;
}).keydown(function(event){
    if (event.keyCode != '27' && event.keyCode != '13')
	canDiscardEventDialog = false;
});	

UI.dialogs.addEvent.dialog('open');
//$('[href="#calendar_addevent_details7"]').trigger('click');
//$('[href="#calendar_addevent_details2"]').trigger('click');
}



function add_tab_preferences() 
{
    if(!(document.getElementById('preference_tab')))
    {
	var tab_title = "Preferencias";
	$tabs.tabs( "add", "#preference_tab", tab_title );
		
	/*
		DataLayer.render( 'templates/timezone_list.ejs', {}, function( timezones_options ){
			tabPrefCalendar.find('select[name="timezone"]').html(timezones_options).find('option[value="'+User.preferences.timezone+'"]').attr('selected','selected').trigger('change');
		});
		*/
	DataLayer.render( 'templates/preferences_calendar.ejs', {
	    preferences:User.preferences, 
	    calendars: Calendar.calendars
	    }, function( template ){
	    var tabPrefCalendar = jQuery('#preference_tab').html( template ).find('.preferences-win');
		
	    tabPrefCalendar.find('option[value="'+User.preferences.defaultCalendar+'"]').attr('selected','selected').trigger('change');
		
	    DataLayer.render( 'templates/timezone_list.ejs', {}, function( timezones_options ){
		tabPrefCalendar.find('select[name="timezone"]').html(timezones_options).find('option[value="'+User.preferences.timezone+'"]').attr('selected','selected').trigger('change');
	    });
		
	    tabPrefCalendar.find('.button').button()
	    .filter('.save').click(function(evt){
		tabPrefCalendar.find('form').submit();
		$('#calendar').fullCalendar('render');
		$('.block-vertical-toolbox .mini-calendar').datepicker( "refresh" );
		$tabs.tabs( "remove", "#preference_tab");
	    }).end().filter('.cancel').click(function(evt){
		$tabs.tabs( "remove", "#preference_tab");
	    });
			
	    tabPrefCalendar.find('.number').numeric();
			
	    tabPrefCalendar.find('input.time').timepicker({ 
		closeText: 'Ok',
		hourGrid: 4,
		minuteGrid: 10,
		ampm : (parseInt($("select[name=hourFormat] option:selected").val().length) > 5 ? true : false), //((User.preferences.hourFormat.length > 5) ? true: false),
		timeFormat: "hh:mm tt",
		onSelect: function (selectedDateTime){
		    if(!(User.preferences.hourFormat.length == 5)) {
			$(this).val(selectedDateTime.replace(/[\.]/gi, ""));
		    }
		},
		onClose : function (selectedDateTime){
		    if(!(User.preferences.hourFormat.length == 5)) {
			$(this).val(selectedDateTime.replace(/[\.]/gi, ""));
		    }
		}
	    });
			
	    $.mask.definitions['{']='[ap]';
	    $.mask.definitions['}']='[m]';
	    tabPrefCalendar.find("input.time").mask( ((User.preferences.hourFormat.length > 5) ? "99:99 {}" : "99:99"), {
		completed:function(){
		    $(this).val(dateCalendar.defaultToAmPm($(this).val()));
		    $(this).timepicker("refresh");
		    $(this).val($(this).val().replace(/[\.]/gi, ""));					
		}
	    });
			                                   
	    tabPrefCalendar.find("select[name=hourFormat]").change( function() { // evento ao selecionar formato de hora
         	
		tabPrefCalendar.find("input.time").timepicker("destroy");

		tabPrefCalendar.find('input.time').timepicker({ 
		    closeText: 'Ok',
		    hourGrid: 4,
		    minuteGrid: 10,
		    ampm : (parseInt($("select[name=hourFormat] option:selected").val().length) > 5 ? true : false),
		    timeFormat: "hh:mm tt",
		    onSelect: function (selectedDateTime){
			if(!(User.preferences.hourFormat.length == 5)) {
			    $(this).val(selectedDateTime.replace(/[\.]/gi, ""));
			}							
		    },
		    onClose : function (selectedDateTime){
			if(!(User.preferences.hourFormat.length == 5)) {
			    $(this).val(selectedDateTime.replace(/[\.]/gi, ""));
			}
		    }
		});
                             	
		var defaultStartHour = tabPrefCalendar.find("input[name=defaultStartHour]").val().trim();
		var defaultEndHour = tabPrefCalendar.find("input[name=defaultEndHour]").val().trim();
              	
		tabPrefCalendar.find("input.time").mask( (($("select[name=hourFormat] option:selected").val().trim().length > 5) ? "99:99 {}" : "99:99") );
                
		if (parseInt($("select[name=hourFormat] option:selected").val().length) > 5) { // am/pm
		    tabPrefCalendar.find("input[name=defaultStartHour]").val(dateCalendar.defaultToAmPm(defaultStartHour));
		    tabPrefCalendar.find("input[name=defaultEndHour]").val(dateCalendar.defaultToAmPm(defaultEndHour))
					
		} else { //24h
		    tabPrefCalendar.find("input[name=defaultStartHour]").val(dateCalendar.AmPmTo24(defaultStartHour));
		    tabPrefCalendar.find("input[name=defaultEndHour]").val(dateCalendar.AmPmTo24(defaultEndHour));
		}
	    });			
                        
                        
			
	});		
    } else {
	$tabs.tabs("select", "#preference_tab");
		
	return true;
    }
}


function add_tab_configure_calendar(calendar) 
{
    var calendars = [];
    var signatures = [];
    var previewActiveCalendarConf = 0;
	var calendarAlarms = [];
	
    for (var i=0; i<Calendar.signatures.length; i++) {
	calendars[i]  = Calendar.signatures[i].calendar;
	signatures[i] = Calendar.signatures[i];
	signatures[i].numberDefaultAlarm = signatures[i].defaultAlarms != '' ?  signatures[i].defaultAlarms.length: 0;
	if (calendar && calendars[i].id == calendar)
	    previewActiveCalendarConf = i;
    }
		
    if(!(document.getElementById('configure_tab')))
    {
	$('.positionHelper').css('display', 'none');
	var tab_title = "Configurações de agendas";
	$tabs.tabs( "add", "#configure_tab", tab_title );
		
	var dataColorPicker = {
	    colorsSuggestions: colors_suggestions()
	};
		
		
		
	var populateAccordionOnActive = function(event, ui) {
	    var nowActive = (typeof(event) == 'number') ? event : $(event.target).accordion( "option", "active" );
	    dataColorPicker.colorsDefined = {
		border: '#'+signatures[nowActive].borderColor, 
		font:'#'+signatures[nowActive].fontColor, 
		background:'#'+signatures[nowActive].backgroundColor
	    };
	    if (!jQuery('.accordion-user-calendars .ui-accordion-content').eq(nowActive).has('form')) {
		return true;
	    }

	    DataLayer.render( 'templates/configure_calendars_itemlist.ejs', {
		user:User, 
		calendar:calendars[nowActive], 
		signature:signatures[nowActive]
		}, function( form_template ){
		var form_content = jQuery('.accordion-user-calendars .ui-accordion-content').eq(nowActive).html( form_template ).find('form');
		form_content.find('.preferences-alarms-list .button').button({
		    text:false, 
		    icons:{
			primary:'ui-icon-close'
		    }
		});
	    form_content.find('.button').button();
	    jQuery('.preferences-alarms-list').find('.button.remove').click(function(el){
			calendarAlarms[calendarAlarms.length] = $(this).parent('li').find('input[name="alarmId[]"]').val();
			$(this).parent().remove();
		});
	
		DataLayer.render( 'templates/timezone_list.ejs', {}, function( timezones_options ){
		    var valueTimeZone = calendars[nowActive].timezone;
		    form_content.find('select[name="timezone"]').html(timezones_options).find('option[value="'+valueTimeZone+'"]').attr('selected','selected').trigger('change');
		});

		form_content.find('.button-add-alarms').click(function(){
		    DataLayer.render( 'templates/alarms_add_itemlist.ejs', {}, function( template ){						
			jQuery('.preferences-alarms-list').append(template)
			.find('li:last label:eq(0)').remove().end()
			.find('.number').numeric().end()
			.find('.button.remove').button({
			    text:false, 
			    icons:{
				primary:'ui-icon-close'
			    }
			}).click(function(el) {
			$(this).parent().remove();
		    });    
		    });
		});


	    /**
				 * Set color picker
				 */
	    DataLayer.render( 'templates/calendar_colorpicker.ejs', dataColorPicker, function( template ){
		form_content.find('.calendar-colorpicker').html( template );

		var f = $.farbtastic(form_content.find('.colorpicker'), colorpickerPreviewChange);
		var selected;
		var colorpicker = form_content.find('.calendar-colorpicker');
					
		var colorpickerPreviewChange = function(color) {
		    var pickedup = form_content.find('.colorwell-selected').val(color).css('background-color', color);

		    var colorpicker = form_content.find('.calendar-colorpicker');

		    if (pickedup.is('input[name="backgroundColor"]')) {
			colorpicker.find('.fc-event-skin').css('background-color',color);
		    } else if (pickedup.is('input[name="fontColor"]')) {
			colorpicker.find('.fc-event-skin').css('color',color);
		    } else if (pickedup.is('input[name="borderColor"]')) {
			colorpicker.find('.fc-event-skin').css('border-color',color);
		    }
		} 
					
		form_content.find('.colorwell').each(function () {
		    f.linkTo(this);

		    if ($(this).is('input[name="backgroundColor"]')) {
			colorpicker.find('.fc-event-skin').css('background-color', $(this).val());
		    } else if ($(this).is('input[name="fontColor"]')) {
			colorpicker.find('.fc-event-skin').css('color', $(this).val());
		    } else if ($(this).is('input[name="borderColor"]')) {
			colorpicker.find('.fc-event-skin').css('border-color', $(this).val());
		    }
		})
		.focus(function() {
		    if (selected) {
			$(selected).removeClass('colorwell-selected');
		    }

		    $(selected = this).addClass('colorwell-selected');
		    f.linkTo(this, colorpickerPreviewChange);
		    f.linkTo(colorpickerPreviewChange);

		});

		form_content.find('select.color-suggestions').change(function() {
		    var colors;

		    if(colors = dataColorPicker.colorsSuggestions[$(this).val()]) {	
			colorpicker
			.find('input[name="fontColor"]').val(colors.font).focus().end()	
			.find('input[name="backgroundColor"]').val(colors.background).focus().end()
			.find('input[name="borderColor"]').val(colors.border).focus().end()

			.find('.fc-event-skin').css({
			    'background-color':dataColorPicker.colorsSuggestions[$(this).val()].background,
			    'border-color':dataColorPicker.colorsSuggestions[$(this).val()].border,
			    'color':dataColorPicker.colorsSuggestions[$(this).val()].font 
			});
		    }
		});

		/**
					 * Trata a mudança dos valores dos campos de cores.
					 * Se mudar um conjunto de cores sugerido,
					 * este vira um conjunto de cores personalizado.
					 */
		form_content.find('.colorwell').change(function (element, ui) {
		    if (true) {
			form_content.find('select.color-suggestions')
			.find('option:selected').removeAttr('selected').end()
			.find('option[value="custom"]').attr('selected', 'selected').trigger('change');
		    }
		});
	    });	//END set colorpicker

	    form_content.find('.phone').mask("+99 (99) 9999-9999");
	    form_content.find('.number').numeric();

	}); //END DataLayer.render( 'templates/configure_calendars_itemlist.ejs' ...

// === validations preferences ==== 

			
} //END populateAccordionOnActive(event, ui)
		

DataLayer.render( 'templates/configure_calendars.ejs', {
    user:User, 
    calendars:calendars, 
    signatures:signatures
}, function( template ){
    var template_content = jQuery('#configure_tab').html( template ).find('.configure-calendars-win');
    template_content.find('.button').button().filter('.save').click(function(evt){
	if(calendarAlarms.length)
		DataLayer.removeFilter('calendarSignatureAlarm', {filter: ['IN','id', calendarAlarms]});	
	template_content.find('form').submit();
	$tabs.tabs( "remove", "#configure_tab");
	DataLayer.commit( false, false, function( received ){
	    delete Calendar.currentViewKey;
	    Calendar.load();
	    refresh_calendars();
	});
	if(calendarAlarms.length)
		Calendar.load();
    }).end().filter('.cancel').click(function(evt){
	$tabs.tabs( "remove", "#configure_tab");
    });

    /**
			 * Muda a estrutura do template para a aplicação do plugin accordion
			 */
    template_content.find('.header-menu-container').after('<div class="accordion-user-calendars"></div>').end().find('.accordion-user-calendars')
    .append(template_content.children('fieldset'));
			
    template_content.find('.accordion-user-calendars').children('fieldset').each(function(index) {
	$(this).before($('<h3></h3>').html($(this).children('legend')));
    });
			
    template_content.find('.accordion-user-calendars').accordion({ 
	autoHeight: false, 
	collapsible: true, 
	clearStyle: true,
	active: previewActiveCalendarConf, 
	changestart: populateAccordionOnActive 
    });
    populateAccordionOnActive(previewActiveCalendarConf);
});

} else {

    $tabs.tabs("select", "#configure_tab");
    $('.accordion-user-calendars').accordion( "activate" , previewActiveCalendarConf );
		
    return true;
}

}

function getSelectedCalendars( reverse ){
    var selecteds = {};
    var cont = 0; 
    jQuery(function() {
	jQuery(".my-calendars .calendar-view").each(function(i, obj) { 
	    var check_box = obj;
	    if( reverse ? !check_box.checked : check_box.checked ) {
		selecteds[cont] = obj.value;
		cont++;
	    };
	});               
    });
    if (!cont)
	return false;
	
    selecteds.length = cont;
    return $.makeArray( selecteds );
}

/**
 * TODO - transformar em preferência do módulo e criar telas de adição e exclusão de conjunto de cores
 */
function colors_suggestions(){
    return [
    {
	name:'Padrão', 
	border:'#3366cc', 
	font:'#ffffff', 
	background:'#3366cc'
    },

    {
	name:'Coala', 
	border:'#123456', 
	font:'#ffffff', 
	background:'#385c80'
    },

    {
	name:'Tomate', 
	border:'#d5130b', 
	font:'#111111', 
	background:'#e36d76'
    },

    {
	name:'Limão', 
	border:'#32ed21', 
	font:'#1f3f1c', 
	background:'#b2f1ac'
    },

    {
	name:'Alto contraste', 
	border:'#000000', 
	font:'#ffffff', 
	background:'#222222'
    }
    ]		
}

function remove_event(eventId, idCalendar){
    $.Zebra_Dialog('Tem certeza que deseja excluir o evento?', {
	'type':     'question',
	'overlay_opacity': '0.5',
	'buttons':  ['Sim', 'Não'],
	'onClose':  function(clicked) {
	    if(clicked == 'Sim'){

		var schedulable = DataLayer.get('schedulable', ''+eventId);
		schedulable.calendar = ''+idCalendar;
		var schudableDecode = DataLayer.encode( "schedulable:preview", schedulable);
		var me = schudableDecode.me.user ? schudableDecode.me.user.id : schudableDecode.me.id;

		DataLayer.removeFilter('schedulable', {filter: ['AND', ['=','id',eventId], ['=','calendar',idCalendar], ['=','user', me]]})
		Calendar.rerenderView(true);
	    }
	}
    });	
}

function mount_exception(eventID, idException){
    
    var schedulable = DataLayer.get('schedulable', ''+eventID);
    var edit = {
	repeat: (DataLayer.get('repeat', schedulable.repeat))
	};                                   

    edit.repeat.startTime = new Date(parseInt(edit.repeat.startTime)).toString('yyyy-MM-dd HH:mm:00');
    edit.repeat.endTime = parseInt(edit.repeat.count) > 0 ? '0' : new Date(parseInt(edit.repeat.endTime)).toString('yyyy-MM-dd HH:mm:00');
    
    edit.repeat.exceptions = (schedulable.occurrences[idException]);         
    
    return edit.repeat;

}

function remove_ocurrence(eventId, idRecurrence){
    $.Zebra_Dialog('Tem certeza que deseja excluir esta ocorrência?', {
	'type':     'question',
	'overlay_opacity': '0.5',
	'buttons':  ['Sim', 'Não'],
	'onClose':  function(clicked) {
	    if(clicked == 'Sim'){
		var repeat = mount_exception(eventId, idRecurrence);
		DataLayer.remove('repeat', false);
		DataLayer.put('repeat', repeat);
		DataLayer.commit(false, false, function(data){
		    Calendar.rerenderView(true);
		});
	    }
	}
    });	
}


function remove_calendar(){
    /* Pode ser assim $('.cal-list-options-btn.ui-state-active').attr('class').replace(/[a-zA-Z-]+/g, ''); */
    $.Zebra_Dialog('Todos os eventos desta agenda serão removidos. Deseja prosseguir com a operação?', {
	'type':     'question',
	'overlay_opacity': '0.5',
	'buttons':  ['Sim', 'Não'],
	'onClose':  function(clicked) {
	    if(clicked == 'Sim'){
		var idCalendar =  $('.cal-list-options-btn.ui-state-active').attr('class').match(/[0-9]+/g);
				
		DataLayer.remove('calendarSignature', Calendar.signatureOf[idCalendar[0]].id );
				
		if(idCalendar == User.preferences.defaultCalendar)
		    DataLayer.remove( 'modulePreference', User.preferenceIds['defaultCalendar']);
			
		DataLayer.commit( false, false, function( received ){
		    delete Calendar.currentViewKey;
		    Calendar.load();
		    refresh_calendars();
		});
	    }
	    $('.positionHelper').css('display', 'none');
	
	}
    });	
}

function refresh_calendars(){

    var colorsSuggestions = colors_suggestions();
    var buttons_colors = "";
    for(var i = 0; i < colorsSuggestions.length; i++){
	buttons_colors += "<a class=\"cal-colors-options-btn ui-icon ui-button-icon-primary signed-cal-colors-options-btn-"+i+"\"  style=\"background-color:"+colorsSuggestions[i]['background']+"; border-color:"+colorsSuggestions[i]['border']+"; color:"+colorsSuggestions[i]['font']+"\">&bull;</a>";
    }

    //DataLayer.render( 'templates/calendar_list.ejs', 'calendar:list', ["IN", "id", Calendar.calendarIds], function( html ){
    DataLayer.render( 'templates/calendar_list.ejs', Calendar, function( html ){
	
	var meu_container = $(".calendars-list").html( html );
	
	var doMenu = function(){
		$('ul.list-calendars .cal-list-options-btn').each(function(){ 
			$(this).menu({   
			content: $(this).next().html(), 
			width: '120', 
			positionOpts: { 
				posX: 'left',  
				posY: 'bottom', 
				offsetX: 0, 
				offsetY: 0, 
				directionH: 'right', 
				directionV: 'down',  
				detectH: true, // do horizontal collision detection   
				detectV: true, // do vertical collision detection 
				linkToFront: false 
			}, 
			flyOut: true, 
			showSpeed: 100, 
			crumbDefaultText: '>' 
			}); 
		});
	}
	doMenu();
	$('#divAppbox').on('scroll',function(){
		if ($('.cal-list-options-btn.fg-menu-open.ui-state-active')){			
			var offset = $('.cal-list-options-btn.fg-menu-open.ui-state-active').offset();
			if (offset)
				$('.positionHelper').css('top',offset.top);
		}
	});
	$('ul.list-calendars .cal-list-options-btn').on('click',function(){doMenu();});         
	
	meu_container.find(".button.new-calendar").button({
	    icons: {
		primary: "ui-icon-plus"
	    },
	    text: false
	}).click(function () {
		
	    if( $('.qtip.qtip-blue.qtip-active').val() !== ''){
		$(this).qtip({
		    show: {
		    ready: true, 
	    solo: true, 
	    when: {
		    event: 'click'
		    }
		},
		hide: false,
		content: {
		text: $('<div></div>').html( DataLayer.render( 'templates/calendar_quick_add.ejs', {} ) ), 
		title: {
		text:'Nova Agenda', 
		button: '<a class="button close" href="#">close</a>'
		}
		},
		style: {
		name: 'blue', 
	    tip: {
		corner: 'leftMiddle'
		}, 
	    border: {
		width: 4, 
	    radius: 8
		}, 
	    width: {
		min: 230, 
	    max:230
		}
	    },
	    position: {
	    corner: {
	    target: 'rightMiddle',
	    tooltip: 'leftMiddle'
	    },
	    adjust: {
	    x:0, 
	    y:-12
	    }
	    }
	    })
	.qtip("api").onShow = function(arg0) {
	    $('.qtip-active .button.close').button({
		icons: {
		    primary: "ui-icon-close"
		},
		text: false
	    })
	    .click(function(){
		meu_container.find(".button.new-calendar").qtip('destroy');
	    });
	    //TODO emplementar tratamento de duplicação de valores no location
	    $('.qtip-active .button.save').button().click(function(){
		for(var i = 0; i < Calendar.calendars.length; i++){
		    if(Calendar.calendars[i].location == ( User.me.uid + '/' + $('.qtip-active input').val())){	
			$.Zebra_Dialog('O nome desta agenda já está sendo utilizada em uma Url de outra agenda. Por favor, informe outro nome para agenda.',{
			    'overlay_opacity': '0.5',
			    'type': 'warning'
			});
			meu_container.find(".button.new").qtip('destroy');
			return;
		    }
		}
				
		var selected;
		var color = $('.cal-colors-options-btn').each(function(index){
		    if ($(this).is('.color-selected'))
			selected = index;
		});
		DataLayer.put( "calendarSignature", {
		    user: User.me.id,
		    calendar: {
			name: Encoder.htmlEncode($('.qtip-active input').val()),
			timezone: User.preferences.timezone				
		    },
		    isOwner: 1,
		    fontColor: colorsSuggestions[selected]['font'].substring(1) ,
		    backgroundColor: colorsSuggestions[selected]['background'].substring(1) ,
		    borderColor: colorsSuggestions[selected]['border'].substring(1)
		});
		DataLayer.commit( false, false, function( received ){
		    delete Calendar.currentViewKey;
		    Calendar.load();
		    refresh_calendars();
		});
		meu_container.find(".button.new").qtip('destroy');
	    });
			
	    $('.qtip-active .button.cancel').button().click(function(){
		meu_container.find(".button.new").qtip('destroy');
	    });
			
	    $(".qtip-active input").Watermark("Nome da agenda");
			
	    $('.qtip-active').keydown(function(event) {
		if (event.keyCode == '27') {
		    meu_container.find(".button.new").qtip('destroy');
		}
	    });
			
	    $('.colors-options').prepend(buttons_colors);
	    $('.colors-options .signed-cal-colors-options-btn-0').addClass('color-selected');
					
	    var buttons = $('.cal-colors-options-btn').button();
			
	    buttons.click(function(){
		buttons.removeClass('color-selected');
		$(this).addClass('color-selected');
	    });
	}				
	}
    });
	
    $("img.cal-list-img").click(function(evt) {
	$(".cal-list-options_1").toggleClass( "hidden" );
    });

    $(".my-calendars a.title-my-calendars").click(function() {
	$(".my-calendars ul.my-list-calendars").toggleClass("hidden")
	$('.my-calendars .status-list').toggleClass("ui-icon-triangle-1-s");
	$('.my-calendars .status-list').toggleClass("ui-icon-triangle-1-e");
    });
		
    $(".signed-calendars a.title-signed-calendars").click(function() {
	$(".signed-calendars ul.signed-list-calendars").toggleClass( "hidden");
    });

    $("ul li.list-calendars-item").click(function(evt) {
	
	});   

    $("ul li.list-calendars-item .ui-corner-all").click(function(evt) {
	//alert('teste');
	});   
        
    meu_container.find(".button.new-calendar-shared").button({
	icons: {
	    primary: "ui-icon-plus"
	},
	text: false
    }).click(function (event) {
	show_modal_search_shared();
    });
		
		
    //TODO Implementar ocultar agendas.
    meu_container.find('.title-signed-calendars').click(function(evt){
	var status = $(this).parent().find('.status-list-shared');
			
	if(status.hasClass('ui-icon-triangle-1-s'))
	    status.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
	else
	    status.removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
    });
		
    $('.calendar-view').click(function(evt){
	if($tabs.tabs('option' ,'selected') == 1){
	    pageselectCallback('', 0);
	}
			
	if(Calendar.currentView){
	    var checkBox = $(this);
	    if(!!Calendar.currentView[ checkBox.val() ]){
		Calendar.currentView[ checkBox.val() ].hidden = !checkBox.is(':checked');
		$('#calendar').fullCalendar( 'refetchEvents' );
	    }
	}
    });
});
}

function add_events_list(keyword)
{
    var tab_title = "";	
    if (keyword){
	if(keyword.length < 10)
	    tab_title = keyword; 
	else
	    tab_title = keyword.substr(0,10) + '..."'; 
    }else{
	tab_title = "Lista de eventos";
    }
    keyword = ( keyword || '' ).replace( /\s+/g, "_" );
	
    if(!(document.getElementById('tab_events_list_' + (Base64.encode(keyword)).replace(/[^\w\s]/gi, "") )))	
    {
	Encoder.EncodeType = "entity";
	$tabs.tabs( "add", "#tab_events_list_" + (Base64.encode(keyword)).replace(/[^\w\s]/gi, ""), Encoder.htmlEncode(tab_title) );
    }
    else /* Tab already opened */
    {
	$tabs.tabs("option", "selected", 2);
    }
	
    pageselectCallback(keyword, 0); // load page 1 and insert data on event_list.ejs
	
    $('.preferences-win.active .button.save, .preferences-win.active .button.cancel, .preferences-win.active .button.import, .preferences-win.active .button.export').button();
}

function paginatorSearch(currentView){
    $(currentView+' .header-paginator .fc-header-left .fc-button').hover(
	function(){
	    $(this).addClass('fc-state-hover');
	},
	function(){
	    $(this).removeClass('fc-state-hover');
	}).mousedown(function(){
	$(this).addClass('fc-state-down');
    }).mouseup(function(){
	$(this).removeClass('fc-state-down');
	$('.events-list.events-list-win.active').removeClass('active');
	var paginator = $(this).attr('class');
	if(paginator.indexOf('next') > 0){
	    if(parseInt($(currentView+' [name = results]').val()) > 25)
		pageselectCallback($(currentView+' [name = keyword]').val(), ((parseInt($(currentView+' [name = page_index]').val())) +1));
	}else{
	    if(parseInt($(currentView+' [name = page_index]').val()) > 0)
		pageselectCallback($(currentView+' [name = keyword]').val(), ((parseInt($(currentView+' [name = page_index]').val())) -1));
	}
    });
}

function mountTitleList(page_index ,view){
    switch (view){
	case 'agendaDay':
	case 'basicDay':
	    var date = new Date().add({
		days: page_index
	    });
	    return (dateCalendar.dayNames[date.getDay()])+", "+(date.toString('dd MMM yyyy'));
	case 'agendaWeek':
	    var dateStart = new Date().moveToDayOfWeek(dateCalendar.dayOfWeek[User.preferences.weekStart]);
	    dateStart.add({
		days: (7 * page_index)
		});
	    var dateEnd = new Date().moveToDayOfWeek(dateCalendar.dayOfWeek[User.preferences.weekStart]);
	    dateEnd.add({
		days: (page_index * 7)+7
		});
	    if(dateStart.toString('MM') != dateEnd.toString('MM'))
		return dateStart.toString('dd')+' de '+dateCalendar.monthNamesShort[dateStart.getMonth()]+' a '+dateEnd.toString('dd')+' de '+dateCalendar.monthNames[dateEnd.getMonth()]+' - '+dateEnd.toString('yyyy');
	    return +dateStart.toString("dd")+" a "+dateEnd.toString("dd")+" de "+dateCalendar.monthNames[dateEnd.getMonth()]+" - "+dateEnd.toString('yyyy');
	case 'month':
	    var date = new Date().add({
		months: page_index
	    }) 
	    return dateCalendar.monthNames[date.getMonth()]+" "+date.toString("yyyy");
	case 'year':
	    var date = new Date().add({
		years: page_index
	    });
	    return date.toString("yyyy");
    }
}

function paginatorList(currentView, view){
    $(currentView+' .events-list.events-list-win.active .list-events-paginator .fc-header-title').html('<h2>'+mountTitleList( parseInt($('[name = page_index]').val()),view)+'</h2>');
    $(currentView+' .events-list.events-list-win.active .header-paginator .fc-header-right .fc-button').removeClass('fc-state-active')
    if(view == 'basicDay')
	$(currentView+' .events-list.events-list-win.active .header-paginator .fc-header-right .fc-button-agendaDay').addClass('fc-state-active');
    else
	$(currentView+' .events-list.events-list-win.active .header-paginator .fc-header-right .fc-button-'+view).addClass('fc-state-active');
    $(currentView+' .events-list.events-list-win.active .header-paginator .fc-header-right').addClass('list-right');
		
    $(currentView+' .header-paginator .fc-header-right .fc-button').hover(
	function(){
	    $(this).addClass('fc-state-hover');
	},
	function(){
	    $(this).removeClass('fc-state-hover');
	}).mousedown(function(){
	$(currentView+' .events-list.events-list-win.active .header-paginator .fc-header-right .fc-button').removeClass('fc-state-active')
	$(this).addClass('fc-state-active');
    }).mouseup(function(){
	var goView = $(this).attr('class');
	if(goView.indexOf('agendaDay') > 0)
	    pageselectCallback($(currentView+' [name = keyword]').val(), 0, '', 'agendaDay');
	else if(goView.indexOf('month') > 0)
	    pageselectCallback($(currentView+' [name = keyword]').val(), 0, '', 'month');
	else if(goView.indexOf('year') > 0)
	    pageselectCallback($(currentView+' [name = keyword]').val(), 0, '', 'year');
	else if(goView.indexOf('agendaWeek') > 0)
	    pageselectCallback($(currentView+' [name = keyword]').val(), 0, '', 'agendaWeek');

    });

    $(currentView+' .header-paginator .fc-header-left .fc-button').hover(
	function(){
	    $(this).addClass('fc-state-hover');
	},
	function(){
	    $(this).removeClass('fc-state-hover');
	}).mousedown(function(){
	$(this).addClass('fc-state-down');
    }).mouseup(function(){
	$(this).removeClass('fc-state-down');
	var paginator = $(this).attr('class');
	if(paginator.indexOf('next') > 0)
	    pageselectCallback($(currentView+' [name = keyword]').val(), ((parseInt($('[name = page_index]').val())) +1), '', view);
	else
	    pageselectCallback($(currentView+' [name = keyword]').val(), ((parseInt($('[name = page_index]').val())) -1), '', view);
    });	
}

function paginatorListEvent(currentView, typeView, view){
    if(!!$(currentView).find('.fc-calendar').length)
	return;
    $(currentView+' .events-list.events-list-win.active').prepend($('.fc-header:first').clone());
    //Remove contudo nao utilizado
    $(currentView+' .events-list.events-list-win.active .fc-header .fc-button-today').remove();
    $(currentView+' .events-list.events-list-win.active .fc-header .fc-button-basicWeek').remove();
    $(currentView+' .events-list.events-list-win.active .fc-header .fc-button-basicDay').remove();			
		
    //Adiciona e remove as classes para esta visualizacao
    $(currentView+' .events-list.events-list-win.active .fc-header .fc-header-center').addClass('list-events-paginator');
    $(currentView+' .events-list.events-list-win.active .fc-header .list-events-paginator').removeClass('fc-header-center');		
		
    //Adicionar class no header padronizar com a tela principal
    $(currentView+' .events-list.events-list-win.active .fc-header').addClass('header-paginator');
    $(currentView+' .events-list.events-list-win.active .header-paginator').removeClass('fc-header');
				
    if(typeView == 'search'){
	$(currentView+' .events-list.events-list-win.active .header-paginator .fc-header-right').remove()
	$(currentView+' .events-list.events-list-win.active .list-events-paginator .fc-header-title').html('<h2>Resultados para: '+$(currentView+' [name = keyword]').val()+'</h2>');
	if((parseInt($(currentView+' [name = page_index]').val()) == 0) && (parseInt($(currentView+' [name = results]').val()) <= 25))
	    return;
	paginatorSearch(currentView);
    }else
	paginatorList(currentView, view);
}

function mountCriteriaList(view, page_index, calerdars_selecteds){
    var rangeStart , rangeEnd;
    switch (view){
	case 'basicDay':
	case 'agendaDay':
	    rangeStart = new Date().add({
		days: page_index
	    }).getTime();
	    rangeEnd = rangeStart;
	    break;
	case 'agendaWeek':
	    var dateStart = new Date().moveToDayOfWeek(dateCalendar.dayOfWeek[User.preferences.weekStart]); 
	    var dateEnd = new Date().moveToDayOfWeek(dateCalendar.dayOfWeek[User.preferences.weekStart]); 
	    rangeStart = dateStart.add({
		days: (7 * page_index)
		}).getTime();
	    rangeEnd = dateEnd.add({
		days: (7 * page_index)+7
		}).getTime();
	    break;
	case 'month':
	    var date = Date.today().add({
		months: page_index
	    }) 
	    rangeStart = date.moveToFirstDayOfMonth().getTime();
	    rangeEnd = date.moveToLastDayOfMonth().getTime();
	    break;
	case 'year':
	    var dateStart = new Date().add({
		years: page_index
	    });	
	    var dateEnd = new Date().add({
		years: page_index
	    });
	    if(dateStart.getMonth() != 0)
		dateStart.moveToMonth(0, -1)
	    if(dateEnd.getMonth() != 11)
		dateEnd.moveToMonth(11)	
	    rangeStart =    dateStart.moveToFirstDayOfMonth().getTime();
	    rangeEnd = dateEnd.moveToLastDayOfMonth().getTime();
	    break;  
    }
			
    var timezone = {};
    for(var i in Calendar.signatureOf)
	timezone[i] = Calendar.signatureOf[i].calendar.timezone;		
	
    return {
	 filter: ['AND', 
		    ['OR', 
			['AND', 
			    ['>=', 'rangeEnd', rangeStart], 
			    ['<=', 'rangeEnd', rangeEnd] , 
			],
			['AND', 
			    ['>=', 'rangeStart', rangeStart], 
			    ['<=', 'rangeStart', rangeEnd] , 
			],
			['AND', 
			    ['<=', 'rangeStart', rangeStart], 
			    ['>=', 'rangeEnd', rangeEnd] , 
			]
		    ],
		    ['IN', 'calendar',  calerdars_selecteds]
		], 
	criteria: {
	    deepness: 2, 
	    order: 'startTime', 
	    timezones: timezone
	}
    }; 

}

function pageselectCallback(keyword, page_index, jq, view){
	
    var selecteds = getSelectedCalendars();
    if(!selecteds && (keyword != '' && keyword != null)){	
	jQuery('#tab_events_list_' + ((Base64.encode(keyword)).replace(/[^\w\s]/gi, "")|| '')).html(
	    '<div title="Lista de eventos" class="events-list events-list-win active empty">' +
	    '<label>Por favor selecione ao menos uma agenda.</label>' +
	    '</div>'
	    );
    }else{
	var criteria = null;
	if(keyword == '' || keyword == null)
	    criteria = mountCriteriaList(!!view ? view : User.preferences.defaultCalView, page_index, selecteds)
	else
	    criteria =  {
		filter: ['AND', ['OR', ["i*", "summary", keyword], ["i*", "description", keyword]], ['IN', 'calendar',  selecteds]], 
		criteria: {
		    searchEvent: true,
		    order: 'startTime', 
		    offset: (25 * page_index), 
		    limit: (((25 * page_index) + 25) + 1), 
		    deepness: 2
		}
	    };
    var results = DataLayer.get('schedulable:detail', criteria);
    keyword = ( keyword || '' ).replace( /\s+/g, "_" );	
}
// não há resultados	

var currentView = '#tab_events_list_' + ((Base64.encode(keyword)).replace(/[^\w\s]/gi, "") || '');

if ((((typeof(results) == 'undefined') || (!results.events_list )) && selecteds) &&(keyword != '' && keyword != null)) {
    $(currentView).html(
		'<div title="Lista de eventos" class="events-list events-list-win active empty">' +
		'<label>Não foi encontrado nenhum evento correspondente à sua pesquisa.</label>' +
		'</div>'
	);
// há resultados e Agendas Selecionadas
} else{ 
    if(typeof(results) != 'undefined'){
		results['page_index'] = page_index;
		results['keyword'] = keyword;
				
		DataLayer.render( 'templates/event_list.ejs', results, function( html ){
			
			$(currentView).html( html );
			$('.events-list-win .menu-container .button').button();
															
			$(".event-details-item").parent().click(function(){

			$(this).siblings("div.details-event-list").toggleClass("hidden")
			.find('.button.delete').click(function(){
				var eventId = $(this).siblings('[name="eventid"]').val();
				var calendarId = $(this).siblings('[name="calendarid"]').val();

				remove_event(eventId, calendarId);
			})
			.end().find('.button.edit').click(function(){				
				eventDetails( DataLayer.get( "schedulable", $(this).siblings('[name="eventid"]').val() ), true );					
			});

			});
			paginatorListEvent(currentView, (keyword == '' || keyword == null) ? 'list' : 'search',  !!view ? view : User.preferences.defaultCalView);
		});
    }else{
		$(currentView).html(
			'<div title="Lista de eventos" class="events-list events-list-win active empty">' +
			'<input type="hidden" name="page_index" value="'+page_index+'"></inpunt>'+
			'<input type="hidden" name="keyword" value="'+keyword+'"></inpunt>'+
			'<label class="empty-result">Não foram encontrados eventos neste intervalo.</label>' +
			'</div>'
			);
		paginatorListEvent(currentView, 'list', !!view ? view : User.preferences.defaultCalView);
    }
}
	if(currentView != '#tab_events_list_')
	    $tabs.tabs("select", currentView);
}

function show_modal_import_export(tab, calendarId) {
    DataLayer.render( 'templates/import_export.ejs', {
	calendars: Calendar.calendars, 
	owner: User.me.id
	}, function( html ){

	if (!UI.dialogs.importCalendar) {
	    UI.dialogs.importCalendar = jQuery('#div-import-export-calendar')
	    .append('<div title="Importar e Exportar Eventos" class="import-export import-export-win active"> <div>')
	    .find('.import-export-win.active').html(html).dialog({
		resizable: false, 
		modal:true, 
		width:500, 
		position: 'center'
	    });
			
	} else {
	    UI.dialogs.importCalendar.html(html);
	}
		
	var tabsImportExport = UI.dialogs.importCalendar.find(".tabs-import-export").tabs({
	    selected: tab
	});
        
	UI.dialogs.importCalendar.find('.button').button();

	tabsImportExport.find('option[value="'+calendarId+'"]').attr('selected','selected').trigger('change');
		
	var form = false;
	$('.import-event-form').fileupload({
	    sequentialUploads: true,
	    add: function (e, data) {
		form = data
		var name = form.files[0].name;
		$('.import-event-form').find('input[type="file"]').hide();
		$('.import-event-form').find('span.file-add').removeClass('hidden');
		$('.import-event-form').find('span.file-add').append('<span>'+ name +'</span><a class="button remove-attachment tiny"></a>');
		$('.import-event-form').find('.button.remove-attachment').button({
		    icons: {
			primary: "ui-icon-close"
		    },
		    text: false
		}).click(function (event){
		    $('.import-event-form').find('input[type="file"]').show();
		    $('.import-event-form').find('span.file-add').addClass('hidden').html('');
		    form = false;
		});
				
				
	    },
	    done: function(e, data){
		var msg = '';
		var type = '';

		if(!!data.result && data.result == "[][[]]"){
		    msg = 'Não foram encontrados novos eventos na importação!';
		    type = 'information';
		}else if(!!data.result && data.result == '[][false]'){
		    msg = 'Erro ao realizar a importação, por favor verifique o arquivo .ics';
		    type = 'warning';
		}else{
		    msg = 'Importação realizada com sucesso!';
		    type = 'confirmation';
		    Calendar.rerenderView(true);
		}

		$.Zebra_Dialog(msg, {
		    'type':     type,
		    'overlay_opacity': '0.5',
		    'buttons':  ['Fechar']
		});
	    }
	});

	UI.dialogs.importCalendar.find(".menu-import-event")        
	.children(".import").click(function(data){
	    $('.import-event-form fieldset.import-calendar', UI.dialogs.importCalendar).append(
		'<input type="hidden" name="params[calendar_timezone]" value="'+  
		Calendar.signatureOf[$('.import-event-form option:selected').val()].calendar.timezone
		+'"/>')
	    if(form)
		form.submit();			
	    UI.dialogs.importCalendar.dialog("close");
	/**
			 * TODO - implementar ação de importação
			 */
	});
            
	UI.dialogs.importCalendar.find(".menu-export-event")        
	.children(".export").click(function(){
	      
	    $('.export-event-form', UI.dialogs.importCalendar).submit();
	    UI.dialogs.importCalendar.dialog("close");
	/**
			 * TODO - implementar ação de exportação
			 */
	});
       
	UI.dialogs.importCalendar.find(".menu-container")
	.children(".cancel").click(function(){
	    UI.dialogs.importCalendar.dialog("close");
	});    
		
	UI.dialogs.importCalendar.dialog("open");
    });
}

function copyAndMoveTo(calendar, event, idRecurrence, type, evt){
    /*
     * Types
     * 0 = Move
     * 1 = Copy Event end Repet
     * 2 = Copy Ocurrence
     * 3 = Copy to edit ocurrence
     * 
     **/
    if(!type)
	type = $('.calendar-copy-move input[name="typeEvent"]').val();

    var schedulable = DataLayer.get('schedulable', event+'');
        
    calendar = !!calendar ? calendar : schedulable.calendar;
        
    if(typeof(schedulable) == "array")
	schedulable = schedulable[0];
	
    //Move eventos entre agendas
    if(parseInt(type) == 0){
		
	schedulable.lastCalendar = schedulable.calendar;
        schedulable.calendar = calendar;	
	DataLayer.put('schedulable', schedulable);
	
	DataLayer.commit();
    //copia eventos entre agendas
    }else{
	
	var newSchedulable = schedulable;
	
	delete newSchedulable.id;
	delete newSchedulable.uid;
	delete newSchedulable.sequence;
	delete newSchedulable.dtstamp;
		
	delete schedulable.DayLigth;
	delete schedulable.rangeStart
	delete schedulable.rangeEnd;
	delete schedulable.lastUpdate;
                
	delete schedulable.calendar;
                
	if(schedulable.repeat && type == "1" ){
	    var repeat = DataLayer.get('repeat', schedulable.repeat);
	    delete repeat.schedulable;
	    delete repeat.id;
	    repeat.startTime = new Date(parseInt(repeat.startTime)).toString('yyyy-MM-dd HH:mm:00');
	    repeat.endTime = new Date(parseInt(repeat.endTime)).toString('yyyy-MM-dd HH:mm:00');
                    
	    var exceptions = DataLayer.get('repeatOccurrence', {
		filter: ['AND', ['=','repeat', schedulable.repeat], ['=','exception','1']]
		}, true);
	    if(exceptions){
		repeat.exceptions = '';
		for(var i in exceptions )
		    repeat.exceptions += exceptions[i].occurrence + ((exceptions.length -1) == parseInt(i) ? '' : ',');
                            
	    }
                    
                    
	    schedulable.repeat = repeat;
	}else{
	    if(!!idRecurrence){
		newSchedulable.endTime = parseInt(schedulable.occurrences[idRecurrence]) + (parseInt(newSchedulable.endTime) - parseInt(newSchedulable.startTime));
		newSchedulable.startTime = schedulable.occurrences[idRecurrence];
	    }
	    delete schedulable.repeat;
	}
	delete schedulable.occurrences;
                
	schedulable.calendar = DataLayer.copy(calendar);	
		
	var participants = DataLayer.copy(schedulable.participants);
	delete schedulable.participants;
		
	schedulable.participants =  $.map( participants, function( attendee, i ){
			
	    var participant = DataLayer.get('participant', attendee, false);
			
	    if(typeof(participant) == 'array')
		participant = participant[0];
	
	    delete participant.delegatedFrom;
	    delete participant.id;
	    delete participant.schedulable;
                        
	    participant.id = DataLayer.put('participant', participant);
			
	    return participant ;
	});
	//Edit ocurrence
	if(parseInt(type) == 3){
	    newSchedulable.endTime = !!evt.end  ? evt.end.getTime() :  ((evt.start).getTime() + 86400000);
	    newSchedulable.startTime = evt.start.getTime(); 
                    
	    return newSchedulable;
	}
	newSchedulable.endTime = new Date(parseInt(newSchedulable.endTime) - (newSchedulable.allDay ? 86400000 : 0)).toString('yyyy-MM-dd hh:mm:00');
	newSchedulable.startTime = new Date(parseInt(newSchedulable.startTime)).toString('yyyy-MM-dd hh:mm:00'); 
	
	DataLayer.put('schedulable', newSchedulable);

    }
}

function messageHelper(msg, isShow){
    if(isShow)
	new $.Zebra_Dialog('<span style="width: 50px; height: 50px;">'+
			    '<img src="'+DataLayer.dispatchPath+'/modules/calendar/img/loading.gif"></img>'+
			'</span><label class="messagesHelpers"> '+ msg +' </label>' , {
			'buttons':  false,
			'modal': true,
			'overlay_opacity': '0.5',
			'keyboard': false,
			'overlay_close': false,
			'type': false,
			'custom_class': 'messagesHelpersExpressoCalendar'
			}
		    );
    else{
	$('.messagesHelpersExpressoCalendar').remove();
	$('.ZebraDialogOverlay').remove();
    }
}
