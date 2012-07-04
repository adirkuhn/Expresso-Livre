
<!-- BEGIN view_event -->
<!-- <script src="./calendar/templates/default/js/suggestion.js" type="text/javascript" language="JavaScript1.2"></script> -->
<center>
<table id="calendar_view_event" border="0" width="90%">
	{row}
	<tr>
		<td>
			<table id="calendar_viewevent_button_left" cellspacing="5">
				<tr>
					{button_left}
				</tr>
			</table>
		</td>
	   <td align="center">
			<table id="calendar_viewevent_button_center" cellspacing="5">
				<tr>
					{button_center}
				</tr>
			</table>
		</td>
		<td align="right">
			<table id="calendar_viewevent_button_right" cellspacing="5">
				<tr>
					{button_right}
					{button_right_suggestion}
			</table>
		</td>
	</tr>
</table>

{suggestion}

</center>
<!-- END view_event -->

<!-- BEGIN list -->
	<tr bgcolor="{tr_color}">
		<td valign="top" width="30%">&nbsp;<b>{field}:</b></td>
		<td colspan="2" valign="top" width="70%">{data}</td>
	</tr>
<!-- END list -->

<!-- BEGIN hr -->
	<tr>
		<td colspan="3" bgcolor="{th_bg}" align="center">
			<b>{hr_text}</b>
		</td>
	</tr>
<!-- END hr -->
