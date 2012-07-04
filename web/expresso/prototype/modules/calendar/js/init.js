$(document).ready(function() {
	//Remove o icone de configuraçõe padrão antigo do expresso
	$('#sideboxdragarea').addClass('hidden');

	refresh_calendars();
	$tabs = $('#tabs').tabs({
	    add: function( event, ui ) {
			Calendar.lastView = $tabs.tabs('option' ,'selected');
			$('#tabs .events-list-win.active').removeClass('active');
			$tabs.tabs('select', '#' + ui.panel.id);
		},
		remove: function( event, ui ) {
			$tabs.tabs('select', Calendar.lastView);
		},
		show: function( event, ui ){
			delete Calendar.currentViewKey;
			$('#calendar').fullCalendar('refetchEvents');
		}
	})
	.tabs('option', 'tabTemplate', "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close'>Remove Tab</span></li>" );

	/**
	  * Make a button to close the tab
	  */
	$tabs.find( "span.ui-icon-close" ).live( "click", function() {
		var index = $( "li", $tabs ).index( $( this ).parent() );
		if($tabs.tabs('option' ,'selected') == index){
			if($tabs.tabs("length") == 2 && Calendar.lastView != 1)
				$tabs.tabs( "select", 0);
			$tabs.tabs( "select", Calendar.lastView);
		}
		if($tabs.tabs('option' ,'selected') == 0 || $tabs.tabs('option' ,'selected') == 1)
			Calendar.lastView = $tabs.tabs('option' ,'selected');
		if(index != -1)
		  $tabs.tabs( "remove", index );	
			
		
		});	
	$('.button.config-menu').button({
	    icons: {
		primary: "ui-icon-gear",
		secondary: "ui-icon-triangle-1-s"
	    },
	    text: false
	});
      $('.button.add').button({
	      icons: {
		      secondary: "ui-icon-plus"
	      }
      })

		var miniCalendar = $('.block-vertical-toolbox .mini-calendar').datepicker({
			dateFormat: 'yy-m-d',
			//dateFormat: 'DD, d MM, yy',
			//inline: true,
			firstDay: dateCalendar.dayOfWeek[User.preferences.weekStart],
			onSelect: function(dateText, inst)
			{	
				$tabs.tabs("select", "#calendar");
				var toDate = $('.block-vertical-toolbox .mini-calendar').datepicker("getDate").toString('yyyy-MM-dd').split('-');
				$('#calendar').fullCalendar('gotoDate', toDate[0], parseInt(toDate[1]-1), toDate[2] );
				$('#calendar').fullCalendar( 'changeView', 'agendaDay' );
			}			
		})
		.find('.ui-icon-circle-triangle-e').removeClass('ui-icon-circle-triangle-e').addClass('ui-icon-triangle-1-e').end()
		.find('.ui-icon-circle-triangle-w').removeClass('ui-icon-circle-triangle-w').addClass('ui-icon-triangle-1-w');
		
		//Onclick do mês
		$('.ui-datepicker-title .ui-datepicker-month').live('click',function(){
			$tabs.tabs("select", "#calendar");
			$('#calendar').fullCalendar('gotoDate',$(this).siblings('span').html(), Date.getMonthNumberFromName($(this).html() == 'Março' ? 'Mar' : $(this).html()),'01');
 			$('#calendar').fullCalendar( 'changeView', 'month');
		});
		//Onclick do ano
		$('.ui-datepicker-title .ui-datepicker-year').live('click',function(){
			$tabs.tabs("select", "#calendar");
			$('#calendar').fullCalendar('gotoDate',$(this).html(), '0', '01');
			$('.fc-button-year').click();
		});
		
	//Onclick em um dia do calendário anual
	$( ".fc-day-number" ).live( "click", function() {
			
		var date = $(this).parents('[class*="fc-day-"]').attr('class').match(/fc-day-(\d{4})-(\d{2})-(\d{2})/);

		if (date) date.shift();
		else return false;

		$('#calendar').fullCalendar('gotoDate',date[0],date[1]-1,date[2]);
		$('#calendar').fullCalendar( 'changeView', 'agendaDay' );
	});	

	$('.main-search input.search').keydown(function(event){
		if(event.keyCode == 13) {
			Encoder.EncodeType = "entity";
			//$(this).val($(this).val());
					
			add_events_list($(this).val());
			$(this).val('');
		}
	});
	
	//efetua pesquisas pelo click na lupa de pesquisa
	$('.main-search span.ui-icon-search').click(function(event){
			add_events_list($(this).parent().find('input.search').val());
			$(this).parent().find('input.search').val();
	});
	
	$('.block-horizontal-toolbox .main-config-menu').menu({
		content: $('.main-config-menu-content').html(),
		positionOpts: {
			posX: 'left', 
			posY: 'bottom',
			offsetX: -140,
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
	      
		$('#trash').droppable({
			drop: function(event, ui){
				// 		calendar.fullCalendar( 'removeEvents', ui.draggable.attr('event-id') );
				DataLayer.remove( "event", ui.draggable.attr('event-id') );
				$(this).switchClass('empty','full');
			},
			tolerance: "touch"
		});

      /* initialize the calendar
      -----------------------------------------------------------------*/
		$(".button.add.add-event").click(function(event){
			var startEvent = new Date();
			var configData = (startEvent.toString('mm') < 30)  ? {minutes: (30 - parseInt(startEvent.toString('mm')))} : {hours: 1, minutes: '-'+startEvent.toString('mm')};
			startEvent.add(configData); 

			eventDetails({ 
				startTime: startEvent.getTime(),
				endTime: dateCalendar.decodeRange(startEvent, (!!User.preferences.defaultCalendar ? (	!!Calendar.signatureOf[User.preferences.defaultCalendar].calendar.defaultDuration ?  
						(Calendar.signatureOf[User.preferences.defaultCalendar].calendar.defaultDuration) : (User.preferences.defaultDuration)) : (User.preferences.defaultDuration)))
			}, true );
		});

	var calendar = $('#calendar').fullCalendar(DataLayer.merge({ 

		defaultView: User.preferences.defaultCalView,
		timeFormat: User.preferences.hourFormat,
		axisFormat: User.preferences.hourFormat,
		eventSources: Calendar.sources,

		header: {
			left: 'prev,next today,basicWeek,basicDay',
			center: 'title',
			right: 'agendaDay,agendaWeek,month,year'
		},
		firstHour: dateCalendar.getShortestTime(User.preferences.defaultStartHour ? User.preferences.defaultStartHour : '6'),
		firstDay: dateCalendar.dayOfWeek[User.preferences.weekStart],
		editable: true,
		selectable: true,
		selectHelper: true,
		droppable: true, // this allows things to be dropped onto the calendar !!!
		timeFormat: {
			agenda: 'HH:mm{ - HH:mm}',
			'': 'HH:mm{ - HH:mm} }'
		},
		titleFormat: {
			month: 'MMMM yyyy',                             
			week: "dd[ yyyy] { 'a'[ MMM] dd 'de' MMMM '-' yyyy}", 
			day: 'dddd,  dd MMM , yyyy'
		},
		columnFormat:{
			month: 'ddd',    
			week: 'ddd dd/MM', 
			day: 'dddd dd/MM'  
		},
		
		allDayText: 'Dia todo',
		buttonText: {
			today: 'hoje',
			month: 'mês',
			week: 'semana',
			day: 'dia',
			year: 'ano'
		},
		/*
		eventRender: function( event, element, view ){
			$(element).attr( 'event-id', event.id );
		},
		*/
		select: function( start, end, allDay, event, view ){
			if (view.name == "month") {
				if (User.preferences.defaultStartHour) {
				  _start = User.preferences.defaultStartHour;
				  
				  if (_start.length > 4) 
			        _start = _start.trim().substring(0,5); // remove o am/pm
			      
			      _start = _start.split(":");
			      start.setHours(_start[0]);
			      start.setMinutes(_start[1]);
			    }
				  
				if (User.preferences.defaultEndHour) {
				  _end = User.preferences.defaultEndHour;
				  if (_end.length > 4)
			        _end = _end.trim().substring(0,5); // remove o am/pm
			      			      
			      _end = _end.split(":");			   
			      end.setHours(_end[0]);			    
			      end.setMinutes(_end[1]);
				}		    
			} // END if (view.name == "month")
			
			eventDetails( { 'start': start,
					'end': end,
					'allDay': allDay } );
		},

		eventDrop: function( evt, event, view  ){
			evt.id = evt.id.split('-')[0];
                        if(!evt.disableDragging){
                            
                             if(evt.isRepeat){
                                 var schedulable = copyAndMoveTo(false , evt.id , false, "3", evt);
                                 
                                 var repeat = mount_exception(evt.id, evt.occurrence);
                                 DataLayer.remove('repeat', false);
                                 DataLayer.put('repeat', repeat);
                                 DataLayer.commit('repeat', false, function(data){
                                    
                                    DataLayer.remove('schedulable', repeat.schedulable, false); 
                                    DataLayer.put('schedulable', schedulable);
                                     
                                 });

                             }else{                                 
                                DataLayer.put( "schedulable:calendar", evt );

				event.editable = false;
				event.className = "blocked-event";
				calendar.fullCalendar( 'updateEvent', evt );
                             }
                             
			}else
                            Calendar.rerenderView(true);
		},

		eventResize: function( evt, event, view ){
                        evt.id = evt.id.split('-')[0];
			if(!evt.disableDragging){
                             if(evt.isRepeat){
                                 var schedulable = copyAndMoveTo(false , evt.id , false, "3", evt);
                                 
                                 //Normaliza a data para o backend
                                 schedulable.startTime = new Date(parseInt(schedulable.startTime)).toString('yyyy-MM-dd hh:mm:00');
                                 schedulable.endTime = new Date(parseInt(schedulable.endTime)).toString('yyyy-MM-dd hh:mm:00');
                                 
                                 var repeat = mount_exception(evt.id, evt.occurrence);
                                 
                                 DataLayer.remove('repeat', false);
                                 DataLayer.put('repeat', repeat);
                                 DataLayer.commit('repeat', false, function(data){
                                     
                                    DataLayer.remove('schedulable', repeat.schedulable, false); 
                                    DataLayer.put('schedulable', schedulable);
                                     
                                 });
                             }else{                                 
                                DataLayer.put( "schedulable:calendar", evt );   
                                evt.editable = false;
                                evt.className = "blocked-event";
                                calendar.fullCalendar( 'updateEvent', evt );
                             }
                        
			}else
				Calendar.rerenderView(true);
		},

		eventClick: function( evt, event, view ){
			evt.id = evt.id.split('-')[0];
                        if(evt.selectable){
                            if(evt.isRepeat){
                                $.Zebra_Dialog(evt.title + ' é um evento com repetição.', {
                                        'type':     'question',
                                        'overlay_opacity': '0.5',
                                        'buttons':  ['Editar todas ocorrências', 'Editar essa ocorrência'],
                                        'onClose':  function(clicked) {
                                                if(clicked == 'Editar todas ocorrências') {
                                                    eventDetails( DataLayer.get( "schedulable", evt.id), true);
                                                }else{
                                                    /*
                                                    * TODO - repeat foi adicionado pois melhorias devem ser feitas no rollback do
                                                    *DataLayer, repeat somente é usado quando se trata da criação de um evento
                                                    *pela edição de uma ocorrência.
                                                    */      
                                                    var repeat = mount_exception(evt.id, evt.occurrence);
                                                                                                  
                                                    $('.calendar-copy-move input[name="typeEvent"]').val("3");
                                                    
                                                    eventDetails(copyAndMoveTo(false , evt.id , false, "3", evt), true, '', false, repeat);
                                                }       
                                        }
                                });
                                
                            }else{
				var schedulable = DataLayer.get( "schedulable", evt.id);
				schedulable.calendar = evt.calendar;
				eventDetails( schedulable, true);
				
			    }
                                
                        }
		},
		
		eventAfterRender: function(event, element, view){
			contentMenu();
		}
	}, dateCalendar));
 
	contentMenu();
	 
	 $('body').click(function(){
		$('#context-menu-event').html('');
	 });
	 
	if($(window).height() < $('body').height()){
		var hei = $('body').height() - $(window).height();
		hei = $('#divAppbox').height() - hei;
		$('#divAppbox').css('max-height', hei);
		$('#divAppbox').css('min-height', hei);
		$('body').css('overflow-y','hidden');
		delete hei;
	 }
	  
	 $(window).resize(function(){
		$('#divAppbox').css('max-height', $(window).height() - 104);
		$('#divAppbox').css('min-height', $(window).height() - 104);
		$('#divAppbox').css('overflow-x', 'auto');
		$('#divAppbox').css('overflow-y', 'scroll');
	});	  
	//Todo chamada do metodo que adiciona ao full calendar o botao de listagem de eventos  
	//listEvents();
});
