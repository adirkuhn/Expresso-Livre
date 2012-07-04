/*
	Todo Otimizar caulculo de timezone
	Objeto Date.toString() retorna a data com inserção do offset
	Objeto Date.getTime() retorna a data sem inserção do offset
*/

var objTime = DataLayer.dispatch( "timezones" );

Timezone = {
	currentOffset : new Date().getUTCOffset(),
	daylightSaving: isNaN(parseInt( objTime.isDaylightSaving )) ? 0 : parseInt( objTime.isDaylightSaving ),

	timezones: objTime.timezones,	  
	timezone: function( tzId ){

		return this.timezones[ tzId || User.preferences.timezone ];

	},
	
	getDateCalendar: function(date, tzId, isDay){
		var timezone = this.timezone( tzId );

		if(!timezone)
			return date;

	 	date = this.normalizeDate(date, false, true);

		return date.add({hours: parseInt(timezone.charAt(0) + timezone.charAt(2))  +  parseInt(isDay) });
	},
	
	getDateEvent: function(date, tzId, idCalendar, isDay, type){
		var timezone = this.timezone( tzId );
		var timezoneCurrent = this.timezone(DataLayer.get('calendar', idCalendar).timezone);

		if(timezone == timezoneCurrent)
			return date;
		
		var to = parseInt(timezone.charAt(0) + timezone.charAt(2)) + parseInt(isDay.event[type]);
		var current = parseInt(timezoneCurrent.charAt(0) + timezoneCurrent.charAt(2)) + parseInt(isDay.calendar[type]);
		
		if(timezone.charAt(0) == timezoneCurrent.charAt(0))
			hours =   (  to + (current * - 1)) ;
		else
			hours =  to + (( current ) * (timezone.charAt(0) ==  '+'  ? -1 : 1)) ;
		
		return date.add({hours: hours});
	},
	
	normalizeDate: function(date, current, inverse){
		var offsetDate = !!current ? this.currentOffset : date.getUTCOffset();
		return date.add({hours: (parseInt(offsetDate.charAt(0) + offsetDate.charAt(2)) * (!!inverse ? -1 : 1) )});
	},
	
	getDateMapDisponibility: function(date){
		return this.normalizeDate(date, false, true);
	}
}