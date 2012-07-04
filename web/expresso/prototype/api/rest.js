REST = {
    
    resquests: {},
    
    taksResquests: {},
    
    isProcessRefreshToken: false,

    /**
    * This method is used to read resources from the server.
    * 
    * @param uri Uri of the resource that gonna be readed.
    * @param callback A function that is called when the resource is loaded successfully. When the parameter is ignored the request is made synchrounsly.
    * @param accept The attribute accept that is used to ask the target format to the server
    * @return The target resource when the callback is ommitted ( made it synchronous )
    */

    get: function( uri, data, callback, accept ){
	return this.send( (this.dispatchPath + '../rest' + uri), [ 'get', accept || 'json' ], data, callback, !!!callback);
      
    },

    /**
    * This method is used to create resources from the server.
    * 
    * @param uri Uri of the resource that gonna be readed.
    * @param callback A function that is called when the resource is created on the server successfully. When the parameter is ignored the request is made synchrounsly.
    * @param accept The attribute accept that is used to ask the target format to the server.
    * @return The result response of the create from the server when the callback is ommitted ( made it synchronous )
    */
    
    post: function( uri, data, callback, accept ){
	return this.send( (this.dispatchPath + '../rest' + uri), [ 'post', accept || 'json' ], data, callback, !!!callback);      
    },

    /**
    * This method is used to update resources from the server.
    * 
    * @param uri Uri of the resource that gonna be readed.
    * @param callback A function that is called when the resource is update on the server successfully. When the parameter is ignored the request is made synchrounsly.
    * @param accept The attribute accept that is used to ask the target format to the server
    * @return The result response of the update from the server when the callback is ommitted ( made it synchronous )
    */

    put: function( uri, data, callback, accept ){
	return this.send( (this.dispatchPath + '../rest' + uri), [ 'put', accept || 'json' ], data, callback, !!!callback);
      
    },

    /**
    * This method is used to delete resources from the server.
    * 
    * @param uri Uri of the resource that gonna be readed.
    * @param callback A function that is called when the resource is deleted successfully in the server. When the parameter is ignored the request is made synchrounsly.
    * @param accept The attribute accept that is used to ask the target format to the server
    * @return The result response of the delete from the server when the callback is ommitted ( made it synchronous )
    */

    "delete": function( uri, callback, accept ){
	return this.send( (this.dispatchPath + '../rest' + uri), [ 'delete', accept || 'json' ], false, callback, !!!callback);
    },
    
    send: function( url, type, data, callback, sync, extraOptions ){
	this.id = url;

	if(REST.isProcessRefreshToken && !!callback){

	    REST.taksResquests[REST.taksResquests.length] = {
		url: url, 
		type: type, 
		data: data, 
		callback: callback, 
		sync: sync, 
		extraOptions: extraOptions
	    };

	}else if(REST.isProcessRefreshToken)
	    setTimeout(REST.send(url, type, data, callback, sync, extraOptions), 100);

	REST.resquests[url] = {
	    url: url, 
	    type: type, 
	    data: data, 
	    callback: callback, 
	    sync: sync, 
	    extraOptions: extraOptions
	};    
      
	var result = false;      
	var envelope = {

	    async: ( typeof sync !== "undefined" ? !sync : !!callback ),
	    url: url,
	    success: function( dt, textStatus, jqXHR ){

		if(REST.isInvalidToken(dt)){
		    REST.load('', true);
		    
		    if(!REST.me)
			return {error: 'Empty session', title: 'Error in refresh token', description: 'Error in refresh token.'};
		    
		    var ref = REST.resquests[this.url];
		    result =  REST.send(ref.url, ref.type, ref.data, ref.callback, ref.sync, ref.extraOptions)
		}
		delete REST.resquests[this.url];
		
		if(result == false){

		    if( callback )
		    {
			result = callback( dt, textStatus, jqXHR );
		    }
		    else
			result = dt;
		    }

	    },
	    error: function( dt, textStatus, jqXHR ){
		
		var response = {error: 'error', status: dt.status, description: dt.responseText, statusText: dt.responseText};

		if( callback )
		{
		    result = callback( response, textStatus, jqXHR );
		}
		else
		    result = response;

	    },

	    type: $.isArray( type ) ? type[0] : type,
	    data: data

	};

	if( $.isArray( type ) && type[1] )
	    envelope['dataType'] = type[1];

	if(REST.me)
	    envelope = $.extend( envelope, {
		beforeSend: function (xhr){
		    xhr.setRequestHeader('Authorization', "OAUTH Bearer " + REST.me.token)
		}
	    });

	if( extraOptions )
	    envelope = $.extend( envelope, extraOptions );

	$.ajax( envelope );
      
	return( result );
    },
    
    isInvalidToken: function(data){
	return ((data) && (data.error && data.error == 'invalid_grant') && (data.error_description == 'The access token provided has expired.')) ? true : false
    },
    
    dispatch: function( dispatcher, data, callback, isPost, dataType ){
	return this.send( this.dispatchPath + dispatcher + ".php", 
	    [ ( isPost ? 'post' : 'get' ), dataType || 'json' ],
	    data, callback );
    },

    dispatchPath: '../prototype',

    load: function(url, isRefresh){
	this.me = this.dispatch( (url || '') + "me", (isRefresh ? {
	    refreshToken: true
	} : {}), false, true)	
    }
    
}