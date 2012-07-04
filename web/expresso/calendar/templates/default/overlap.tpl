<!-- BEGIN overlap -->
<center><br />
<table id="calendar_overlap_table">
	<tr>
		<td>
			{overlap_text}
		</td>
	</tr>
	<tr>
		<td>
			<ul>{overlap_list}</ul>
		</td>
	</tr>
	<tr>
		<td>
			<table id="calendar_overlap_table2" cellspacing="5">
				<tr>
					<td>
						{cancel_button}
					</td>
					<td>
						{resubmit_button}
					</td>
					<td>
						{reedit_button}
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
</center>
{suggestion}
<style>
	.even { background-color: #f4f8fb}
	.odd { background-color: #fff}
	.fields {
		list-style-type: none;
		list-style-image: none;
		margin: 0;
		padding: 0;
	}
	
	.fields li{
		text-align:center;
		display: block;
		width:100%;
		margin: 0;
		padding: 0;
	}

	.fields li div{
		text-align:left;
		display: inline-block;
		float:center;
		width:220px;
	}	
	
	label {
		margin: 0 3px 0 3px;
		width: 100px;
		display: inline-block;
	}
</style>
<!-- END overlap -->
