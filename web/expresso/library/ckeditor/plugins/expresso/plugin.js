

CKEDITOR.plugins.add('expresso',
{
    
    init: function (editor) {
        var pluginName = 'expresso';
        editor.ui.addButton('expAddImage',
            {
                label: 'Adicionar Imagem',
                command: 'imgDialog',
                icon: CKEDITOR.plugins.getPath('expresso') + 'img/Image.gif'
            });
                        
        editor.ui.addRichCombo('expSignature', 
        {
                    label: 'Assinaturas',
                    voiceLabel : "Assinaturas",
                    title: 'Assinaturas',
                    className : 'cke_format',
                    panel :
                    {
                           css : [ CKEDITOR.config.contentsCss, CKEDITOR.getUrl( editor.skinPath + 'editor.css' ) ],
                           voiceLabel : 'xala'
                    },

                    init : function()
                    {
                         var options = RichTextEditor.getSignaturesOptions();
                         for( var key in options )
                             this.add(  options[key],key,key);    
                                              
                    },
                   
                    onClick : function( value )
                    {         
                       editor.focus();
                       editor.fire( 'saveSnapshot' );
                       editor.insertHtml(unescape(value));
                       editor.fire( 'saveSnapshot' );
                    }

        });
        
        
        editor.addCommand( 'imgDialog',new CKEDITOR.dialogCommand( 'imgDialog' ) );

		if ( editor.contextMenu )
		{
			editor.addMenuGroup( 'mygroup', 10 );
			editor.addMenuItem( 'My Dialog',
			{
				label : 'Open dialog',
				command : 'imgDialog',
				group : 'mygroup'
			});
			editor.contextMenu.addListener( function( element )
			{
 				return {'My Dialog' : CKEDITOR.TRISTATE_OFF};
			});
		}
                
		CKEDITOR.dialog.add( 'imgDialog', function( api )
		{
            var ID = currentTab;
			// CKEDITOR.dialog.definition
			var dialogDefinition =
			{
				
                title : 'Inserir Imagem',
				minWidth : 400,
				minHeight : 70,
				contents : [
					{
						id : 'tab1',
						label : 'Label',
						title : 'Title',
						expand : true,
						padding : 0,
						elements :
						[
							{
								type : 'html',
								html :  '<form id="fileupload_img'+ID+'" class="fileupload" action="mailAttachment:img" method="POST">    <input type="file" name="files[]"  onclick="bindFileUpload(this);" style="margin-left:10px"></form>' 
							}
						]
					}
				],
				buttons : [ CKEDITOR.dialog.cancelButton]
				
			};
                        	
			return dialogDefinition;
		} );
	
         

    }
});
function bindFileUpload(e) {
	var ID = currentTab;
	var fileUploadIMG = $(e).parents('form');
	var fileUploadMSG = $('#fileupload_msg'+ID);
	var maxAttachmentSize = (preferences.max_attachment_size !== "" && preferences.max_attachment_size != 0) ? (parseInt(preferences.max_attachment_size.replace('M', '')) * 1048576 ) : false;
	fileUploadIMG.fileupload({
		type: 'post',
		dataType : 'json',
		url: "../prototype/post.php",
		forceIframeTransport: true,
		formData: function(form) {
			return [
				{
					name : "mailAttachment[0][source]",
					value : "files0"
				},
				{
					name : "mailAttachment[0][disposition]",
					value : $('#attDisposition'+ID).val()
				},
				{
					name: "MAX_FILE_SIZE",
					value : maxAttachmentSize
				}
			];
		},
		add: function (e, data) {
     
			if(!maxAttachmentSize || data.files[0].size < maxAttachmentSize || is_ie) {
				setTimeout(function() {
                                        $('#attDisposition'+ID).val('embedded');
					data.submit();
				}, 5000);
			}

			$.each(data.files, function (index, file) {	
				var attach = {};
				attach.fullFileName = file.name;
				attach.fileName = file.name;
				if(file.name.length > 10)
					attach.fileName = file.name.substr(0, 18) + "..." + file.name.substr(file.name.length-9, file.name.length);
				attach.fileSize = formatBytes(file.size);
				if(maxAttachmentSize && file.size > maxAttachmentSize)
					attach.error = 'Tamanho de arquivo nao permitido!!'
								
				var upload = $(DataLayer.render("../prototype/modules/mail/templates/attachment_add_itemlist.ejs", {file : attach}));	

				upload.find('.button.close').button({
					icons: {
						primary: "ui-icon-close"
					},
					text: false
				}).click(function(){
					var idAttach = $(this).parent().find('input[name="fileId[]"]').val();
			
                    var content_body = RichTextEditor.getData('body_'+ID);
                    var imagens = content_body.match(/<img[^>]*>/g);
       
                    if(imagens != null)
                        for (var x = 0; x < imagens.length; x++)
                            if(imagens[x].indexOf('src="../prototype/getArchive.php?mailAttachment='+idAttach+'"') !== -1)
                                content_body = content_body.replace(imagens[x],'');
         
                    RichTextEditor.setData('body_'+ID,content_body);   
                                       	
                    $('.attachments-list').find('input[value="'+idAttach+'"]').remove();
                    delAttachment(ID, idAttach);
					$(this).parent().remove();
				});
                                
            fileUploadMSG.find('.attachments-list').append(upload);

			if(!maxAttachmentSize || file.size < maxAttachmentSize){
				if(data.fileInput){
					fileUploadMSG.find('.fileinput-button.new').append(data.fileInput[0]).removeClass('new');
					fileUploadMSG.find('.attachments-list').find('[type=file]').addClass('hidden');	
				}
			}else
				fileUploadMSG.find(' .fileinput-button.new').removeClass('new');
				                                
                CKEDITOR.instances['body_'+ID].insertHtml('<img src=""/>');

			});
                
            CKEDITOR.dialog.getCurrent().hide();	
                        
		},
		done: function(e, data){
			if(!!data.result && data.result != "[]"){
				var newAttach = data.result;
				if(!newAttach.mailAttachment.error){
					if(newAttach.rollback !== false)
					{
						fileUploadMSG.find('.in-progress:first').parents('p').append('<input type="hidden" name="fileId[]" value="'+newAttach['mailAttachment'][0][0].id+'"/>').find('.status-upload').addClass('ui-icon ui-icon-check');
						addAttachment(ID,newAttach['mailAttachment'][0][0].id);
						var content_body  = RichTextEditor.getData('body_'+ID);
						var rex = new RegExp('<img src="" [^\/>]*\/>', 'i'); 
						var newImg = '<img src="../prototype/getArchive.php?mailAttachment='+newAttach['mailAttachment'][0][0].id+'" />'; 
						content_body = content_body.replace(rex,newImg); 
						RichTextEditor.setData('body_'+ID,content_body); 
					}
					else
						fileUploadMSG.find('.in-progress:first').parents('p').find('.status-upload').append('Erro ao fazer upload!').addClass('message-attach-error');   
				}else{
					fileUploadMSG.find('.in-progress:first').parents('p').find('.status-upload').append(newAttach.mailAttachment.error).addClass('message-attach-error');   
				}
			}else 
			{
            	fileUploadMSG.find('.in-progress:first').parents('p').find('.status-upload').append('Erro ao fazer upload!').addClass('message-attach-error');   
			}
			fileUploadMSG.find('.in-progress:first').remove();
                    
		}
	});
}
