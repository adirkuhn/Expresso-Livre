Refresh = {
    //Tempo em que após a ultima sincronização será verificado atualizações
    timeRefresh : 180,
    clookRefresh: false,

    init: function(){

	delete DataLayer.tasks[this.clookRefresh];
	
	//Realiza agendamentos de atualização de view somente se o módulo aberto for expressoCalendar
	if(User.moduleName == "expressoCalendar"){
	    this.clookRefresh = (parseInt(($.now()) / 1000) + this.timeRefresh);

	    DataLayer.task( this.clookRefresh , function(){
		Calendar.rerenderView(true);
	    });
	}
    }
}

Calendar = {
  
    load: function(){
	this.lastView = 0;
	var filter = ['=', 'user', User.me.id];
	if(!!User.me.gidNumber){
	    if(!$.isArray(User.me.gidNumber))
		User.me.gidNumber = [User.me.gidNumber];

	    filter = ['OR', filter, ['IN', 'user', User.me.gidNumber]];
	}

	//var descart = DataLayer.get("calendarSignature", {filter: filter, criteria: {deepness: 2}});
	this.signatures  = DataLayer.get("calendarSignature", {
	    filter: filter, 
	    criteria: {
		deepness: 2
	    }
	});
	  
    var prevSources = this.sources;
    
    this.sources = DataLayer.encode( "calendarSignature:calendar", this.signatures );

     if( prevSources )
    {
	var newSources = this.sources.slice();

	for( var i = 0; i < newSources.length; i++ )
	    $('#calendar').fullCalendar( 'addEventSource', newSources[i] );

	for( var i = 0; i < prevSources.length; i++ )
	    $('#calendar').fullCalendar( 'removeEventSource', prevSources[i] );
    }

    this.calendarIds = [], this.signatureOf = {}, this.calendars = [], this.calendarOf= {};

    for( var i = 0; i < this.signatures.length; i++ ){
	if(this.signatures[i].isOwner == "0")
	    this.signatures[i].permission =  DataLayer.encode('calendarToPermission:detail', this.signatures[i].permission);
	this.signatureOf[ this.calendarIds[i] = ( this.calendars[ this.calendars.length ] = this.calendarOf[ this.signatures[i].id ] = this.signatures[i].calendar ).id ] = this.signatures[i];
    }

    delete Calendar.currentViewKey;
    Refresh.init();
    },

    rerenderView: function(force){
        //TODO - Remover if quando centralizar o objeto User que contem as informações do usuário logado em um local acessível a todos módulos
        if(User.moduleName == "expressoCalendar"){
            if((typeof($tabs) != "undefined") && $tabs.tabs('option' ,'selected') == 0){
                if(force){
                    delete Calendar.currentViewKey;
                    $('#calendar').fullCalendar( 'refetchEvents' );

                    //Recarrega os alarmes de eventos    
                    Alarms.load();

                    Refresh.init();
                }

                var calendarNotSelected = getSelectedCalendars( true );
                for(var i = 0; i < calendarNotSelected.length; i++)
                        if(!!Calendar.currentView[ calendarNotSelected[i] ])
                        Calendar.currentView[ calendarNotSelected[i] ].hidden = true;

                $('#calendar').fullCalendar( 'refetchEvents' );	

                contentMenu();
            }else if((typeof($tabs) != "undefined") && $tabs.tabs('option' ,'selected') != 0)
                pageselectCallback($('.events-list-win.active [name=keyword]').val(), 0);
        }
    }
}

Alarms = {
    load: function(){
	var eventsDay = DataLayer.get('alarm:schedulable',['=', 'date', Date.today().getTime()]);
	if(eventsDay)
	for(var i = 0; i < eventsDay.length; i++){
	    this.addAlarm( eventsDay[i] );
	}
    },
	
    addAlarm: function( eventDay ){            
	if(!DataLayer.tasks[parseInt(eventDay.sendTime)]){
	    DataLayer.task( parseInt(eventDay.sendTime) , function( timestamp ){
		var path = User.moduleName == 'expressoCalendar' ? '' : '../prototype/modules/calendar/';
		DataLayer.render(path+'templates/alarm.ejs',{
		    event: eventDay
		}, function( html ){                                
		    $.Zebra_Dialog(html , {
			'type':     'question',
			'overlay_opacity': '0.5',
			'buttons':  ['Fechar'],
			'onClose':  function(clicked) {}
		    });
		});
	    });
	}
    }
}

Calendar.load();
Alarms.load();
