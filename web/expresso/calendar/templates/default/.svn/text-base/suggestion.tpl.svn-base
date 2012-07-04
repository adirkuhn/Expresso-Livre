<div id="suggestion" style="visibility: hidden; display: none;">
<!-- BEGIN list -->
	<link rel="stylesheet" type="text/css" href="phpgwapi/templates/default/css/base.css" />
	<link rel="stylesheet" type="text/css" href="phpgwapi/templates/default/css/azul.css" />
	<link rel="stylesheet" type="text/css" href="phpgwapi/templates/default/css/modal.css" />
	<style>
	.inputDate {
		width: 60px;
	}
	
	.inputTime {
		width: 20px;
	}
	
	#line3 div{
		margin-top:10px;
		margin-bottom:10px;
		text-align:center;
		width: 60px;
	}	
	
	#divAppBox  {
		padding: 1px;
	}
	
	</style>
	<title> {lang_suggest_new_hour} - Expresso </title>
	<script src="{url}/calendar/templates/default/js/suggestion.js" type="text/javascript"></script>
	<link rel="stylesheet" type="text/css" media="all" href="{url}/phpgwapi/js/jscalendar/calendar-win2k-cold-1.css" title="" />
	<script type="text/javascript" src="{url}/phpgwapi/js/jscalendar/calendar.js"></script>
	<script type="text/javascript" src="{url}/phpgwapi/inc/jscalendar-setup.php"></script>
	<form action="{action_form}&cal_id={cal_id};{to};{title};{description};{uid};{location};{ex_participants};{user}" method="post" autocomplete="off">
		<div class="popup modal" style="margin-left:410px; margin-right: 410px; padding: 20px">
			<h1 id="divAppboxHeader" class="title">{notify_message}</h1>
			<div id="divAppbox" class="body">
				<ul class="fields">
					<li id="line1" class="even">
						<div class="fieldCell"><label>{lang_start_date}</label>
							<input type="text" class="inputDate" id="data_inicio" name="data_inicio" value="{start_date}" onBlur="javascript:validate_date_field(this,0);" onkeyup="javascript:insere_barras(0);">
								<link rel="stylesheet" type="text/css" media="all" href="{url}/phpgwapi/js/jscalendar/calendar-win2k-cold-1.css" title="" />
								<script type="text/javascript" src="{url}/phpgwapi/js/jscalendar/calendar.js"></script>
								<script type="text/javascript" src="{url}/phpgwapi/inc/jscalendar-setup.php"></script>
							<script type="text/javascript">
								document.writeln('<img id="data_inicio-trigger" src="{url}/phpgwapi/templates/default/images/datepopup.gif" title="Selecionar data" style="cursor:pointer; cursor:hand;"/>');
								Calendar.setup(
								{
									inputField : "data_inicio",
									button : "data_inicio-trigger"
								}
								); 
							</script>
							
						</div>
						<div class="fieldCell"><label>{lang_start_hour}</label>
							<input type="text" class="inputTime" id="hora_inicio" name="hora_inicio" value="{start_hour}" onBlur="javascript:validate_hour_field(this,0);">
							:
							<input type="text" class="inputTime" id="minuto_inicio" name="minuto_inicio" value="{start_minute}" onBlur="javascript:validate_minute_field(minuto_inicio,0);">	
						</div>
					</li>
					<li id="line2" class="odd">
						<div class="fieldCell"><label>{lang_end_date}</label>
							<input type="text" class="inputDate" id="data_final" name="data_final" value="{end_date}" onBlur="javascript:validate_date_field(this,1);" onkeyup="javascript:insere_barras(1);">
						
							<script type="text/javascript">
								document.writeln('<img id="data_final-trigger" src="{url}/phpgwapi/templates/default/images/datepopup.gif" title="Selecionar data" style="cursor:pointer; cursor:hand;"/>');
								Calendar.setup(
								{
									inputField : "data_final",
									button : "data_final-trigger"
								}
								); 
							</script>
							
						</div>
						<div class="fieldCell"><label>{lang_end_hour}</label>
						<input type="text" class="inputTime "id="hora_final" name="hora_final" value="{end_hour}" onBlur="javascript:validate_hour_field(this,1);">
						:
						<input type="text" class="inputTime "id="minuto_final" name="minuto_final" value="{end_minute}" onBlur="javascript:validate_minute_field(minuto_final,1);">
						</div>
					</li>
					<li id="line3" class="even">
						<div class="fieldCell"><input type="button" value="Cancelar" onclick="javascript:fecha_sugestao();"></div>
						<div class="fieldCell"><input type="submit" value="Sugerir" onClick='return trata_botao_submit();'></div>
					</li>
				</ul>
			</div>
		</div>
	</form>
    <!-- END list -->
</div>