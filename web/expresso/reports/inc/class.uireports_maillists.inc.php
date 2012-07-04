<?php
	/*************************************************************************************\
	* Expresso Relat�rio                										         *
	* by Elvio Rufino da Silva (elviosilva@yahoo.com.br, elviosilva@cepromat.mt.gov.br)  *
	* -----------------------------------------------------------------------------------*
	*  This program is free software; you can redistribute it and/or modify it			 *
	*  under the terms of the GNU General Public License as published by the			 *
	*  Free Software Foundation; either version 2 of the License, or (at your			 *
	*  option) any later version.														 *
	*************************************************************************************/

	class uireports_maillists
	{
		var $public_functions = array
		(
			'report_maillists_group_print_pdf'		=> True,
			'report_maillists_group'				=> True,
			'report_maillists_group_print'			=> True,
			'get_maillists_info'					=> True,
			'css'									=> True
		);

		var $nextmatchs;
		var $user;
		var $functions;
		var $current_config;
		var $ldap_functions;
		var $db_functions;

		function uireports_maillists()
		{
			$this->user			= CreateObject('reports.user');
			$this->nextmatchs	= CreateObject('phpgwapi.nextmatchs');
			$this->functions	= CreateObject('reports.functions');
			$this->ldap_functions = CreateObject('reports.ldap_functions');
			$this->db_functions = CreateObject('reports.db_functions');
			$this->fpdf = CreateObject('reports.uireports_fpdf'); // Class para PDF
									
			$c = CreateObject('phpgwapi.config','reports'); // cria o objeto relatorio no $c
			$c->read_repository(); // na classe config do phpgwapi le os dados da tabela phpgw_config where relatorio, como passagem acima
			$this->current_config = $c->config_data; // carrega os dados em do array no current_config

			if(!@is_object($GLOBALS['phpgw']->js))
			{
				$GLOBALS['phpgw']->js = CreateObject('phpgwapi.javascript');
			}
			$GLOBALS['phpgw']->js->validate_file('jscode','cc','reports');
		}
		
		function report_maillists_group_print_pdf()
		{
			$account_lid = $GLOBALS['phpgw']->accounts->data['account_lid'];
			$acl = $this->functions->read_acl($account_lid);
			$raw_context = $acl['raw_context'];
			$contexts = $acl['contexts'];
			foreach ($acl['contexts_display'] as $index=>$tmp_context)
			{
				$context_display .= $tmp_context;
			}


			if (!$this->functions->check_acl($account_lid,'list_maillists'))
			{
				$GLOBALS['phpgw']->redirect($GLOBALS['phpgw']->link('/reports/inc/access_denied.php'));
			}

			$grouplist = trim($_POST[setor]);
			$grouplist = trim(preg_replace('/-/','',$grouplist));

			$setordn = trim($_POST[setordn]);
			$subtitulo1 = trim($_POST[subtitulo]);

			define('FPDF_FONTPATH','font/');
			$data_atual = date("d/m/Y"); 
			$titulo_system = $GLOBALS['phpgw_info']['apps']['reports']['title'];			

			$pdf=new uireports_fpdf();
			$pdf->Open();
			$pdf->AddPage();
			$pdf->SetTitle('Relat�rio Gerado pelo Expresso Reports');

			//Set font and colors
			$pdf->SetFont('Arial','B',14);
			$pdf->SetFillColor(0,0,0);
			$pdf->SetTextColor(0,0,200);
			$pdf->SetDrawColor(0,0,0);
			$pdf->SetLineWidth(.2);

			//Table header
			$SubTitulo = lang('reports title8');
			$SubTituloR = lang('report organization');
			$SubTitulo1 = $subtitulo1;
			$GLOBALS['phpgw_info']['apps']['reports']['subtitle'] = $SubTituloR;
			$pdf->Cell(0,8,$SubTitulo,0,1,'C',0);


			//Set font and colors
			$pdf->SetFont('Arial','B',8);
			$pdf->SetFillColor(0,0,0);
			$pdf->SetTextColor(0,0,200);
			$pdf->SetDrawColor(0,0,0);
			$pdf->SetLineWidth(.3);

			$pdf->MultiCell(0,3,$SubTitulo1,0,'C',0);
						
			$pdf->Cell(0,2,' ',0,1,'C',0);
			$pdf->Cell(0,5,'Data..: '.$data_atual,0,0,'L',0);
			$pdf->Cell(0,5,$titulo_system,0,1,'R',0);
												
			$account_info = $this->functions->get_list_maillists_sector($setordn,$contexts,0);
						
			if (count($account_info))
			{ 
				//Restore font and colors
				$pdf->SetFont('Arial','',8);
				$pdf->SetFillColor(224,235,255);
				$pdf->SetTextColor(0);

				$pdf->Cell(40,5,lang('loginid'),1,0,'L',1);
				$pdf->Cell(75,5,lang('name'),1,0,'L',1);
				$pdf->Cell(75,5,lang('report email'),1,1,'L',1);
				
				while (list($null,$account) = each($account_info))
				{
					$row_loginid = $account['uid'];
					$row_cn = $account['name'];
					$row_mail = (!$account['email']?'<font color=red>Sem E-mail</font>':$account['email']);
					$pdf->Cell(40,5,$row_loginid,0,0,'L',0);
					$pdf->Cell(75,5,$row_cn,0,0,'L',0);
					$pdf->Cell(75,5,$row_mail,0,1,'L',0);
				}
			}

			$pdf->Output();

			return; 
		}

		function report_maillists_group()
		{
			$account_lid = $GLOBALS['phpgw']->accounts->data['account_lid'];
			$manager_acl = $this->functions->read_acl($account_lid);
			$raw_context = $acl['raw_context'];
			$contexts = $manager_acl['contexts'];
			$conta_context = count($manager_acl['contexts_display']);
			foreach ($manager_acl['contexts_display'] as $index=>$tmp_context)
			{
				$index = $index +1;

				if ($conta_context == $index)
				{
					$context_display .= $tmp_context;
				}
				else
				{
					$context_display .= $tmp_context.'&nbsp;|&nbsp;';
				}
			}
			
			// Verifica se tem acesso a este modulo
			if (!$this->functions->check_acl($account_lid,'list_sectors'))
			{
				$GLOBALS['phpgw']->redirect($GLOBALS['phpgw']->link('/reports/inc/access_denied.php'));
			}

			unset($GLOBALS['phpgw_info']['flags']['noheader']);
			unset($GLOBALS['phpgw_info']['flags']['nonavbar']);
			
			$GLOBALS['phpgw_info']['flags']['app_header'] = $GLOBALS['phpgw_info']['apps']['reports']['title'].' - '.lang('report maillists');
			$GLOBALS['phpgw']->common->phpgw_header();

			$p = CreateObject('phpgwapi.Template',PHPGW_APP_TPL);
			$p->set_file(array('groups'   => 'report_maillists_group.tpl'));
			$p->set_block('groups','list','list');
			$p->set_block('groups','row','row');
			$p->set_block('groups','row_empty','row_empty');

			// Seta as variaveis padroes.
			$var = Array(
				'th_bg'					=> $GLOBALS['phpgw_info']['theme']['th_bg'],
				'back_url'				=> $GLOBALS['phpgw']->link('/reports/index.php'),
				'context_display'		=> $context_display
			);
			$p->set_var($var);
			$p->set_var($this->functions->make_dinamic_lang($p, 'list'));
			

			$GLOBALS['organizacaodn'] = $_POST['organizacaodn'];

			$contextsdn = $GLOBALS['organizacaodn'];

			// Save query
			$varorganizacao = explode(",",$contextsdn);
			$varorganizacao_nome = trim(strtoupper(preg_replace('/ou=/','',$varorganizacao[0])));
			$varorganizacao_nome = trim(strtoupper(preg_replace('/DC=/','',$varorganizacao_nome)));
			$user_logon = $GLOBALS['phpgw_info']['user'][account_lid];

			// carrega os grupos no listbox
			/************* DESCOMENTE ESTE PARTE DO CODIGO PARA LISTAR TODOS OS GRUPOS, SEM LISTAR POR USUSARIO LOGADO *********** 
			$sectors_info = $this->functions->get_groups_list($contexts,"*");
			$sectors_info_dn = $this->functions->get_groups_list_dn($contexts,"*");
			/* ************************************* FIM *********************************************************************** */

			$sectors_info = $this->functions->get_list_context_logon($user_logon,$contexts,0);
			$sectors_info_dn = $this->functions->get_list_groups_dn($user_logon,$contexts,0);

			if (!count($sectors_info))
			{
				$p->set_var('notselect',lang('No matches found'));
			}
			else
			{
				foreach($sectors_info as $context=>$sector)
				{
					
					$sectordn = $sectors_info_dn[$context];

					$tr_color = $this->nextmatchs->alternate_row_color($tr_color);
					
					if ($context == 0 && $contextsdn <> "")
					{
						if (trim(strtoupper($varorganizacao_nome)) ==  trim(strtoupper($sector)))
						{
							$sector_options .= "<option selected value='" .$contextsdn. "'>" .$varorganizacao_nome. "</option>";
						}
						else
						{
							$sector_options .= "<option selected value='" .$contextsdn. "'>" .$varorganizacao_nome. "</option>";
							$sector_options .= "<option value='" . $sectordn . "'>". $sector . "</option>";
						}

					}
					else
					{
						if ( trim(strtoupper($varorganizacao_nome)) !=  trim(strtoupper($sector)))
						{
							$sectorok = trim(strtoupper(preg_replace('/dc=/','',$sector)));
							$sectorok = trim(strtoupper(preg_replace('/dc=/','',$sectorok)));
							$sector_options .= "<option value='" . $sectordn . "'>". $sectorok . "</option>";
						}
					}

					$varselect = Array(
						'tr_color'    	=> $tr_color,
						'organizacaodn'	=> $contextsdn,
						'group_name'  	=> $sector_options
					);					
				}

				$p->set_var($varselect);
			}

			// ************** inicio carregar a sub-lista das organiza��es ****************
			//Admin make a search
			if ($GLOBALS['organizacaodn'] != '')
			{
				// Conta a quantidade de Listas do grupo raiz
				$account_maillists = $this->functions->get_list_maillists_sector($contextsdn,$contexts,0);
				$total_maillists = "(".count($account_maillists).")";

				$p->set_var('organizacao', $varorganizacao_nome);
				$p->set_var('all_maillists', lang('all'));
				$p->set_var('total_maillists', $total_maillists);

				$setorg = $contextsdn;

				$groups_info = $this->functions->get_sectors_list($contexts,$setorg);

				if (!count($groups_info))
				{
					$p->set_var('message',lang('No sector found'));
					$p->parse('rows','row_empty',True);				
				}
				else
				{
					$ii = 0;
					foreach($groups_info as $context=>$groups)
					{
						$explode_groups = explode("#",$groups);
						$ii = $ii + 1;
						$tr_color = $this->nextmatchs->alternate_row_color($tr_color);
						$varsuborg = Array(
							'tr_color'					=> $tr_color,
							'formname'					=> "form".$ii,
							'formsubmit'				=> "document.form".$ii.".submit()",
							'sector_name'				=> $explode_groups[0],
							'sector_namedn'				=> $explode_groups[1],
							'sector_namedn_completo'	=> $explode_groups[2],			
						);					

						$p->set_var($varsuborg);					
						$p->parse('rows','row',True);
					}
				}
			}

			$p->pfp('out','list');
		}

		function report_maillists_group_print()
		{
			$grouplist = trim($_POST[setor]);
			$grouplist = trim(preg_replace('/-/','',$grouplist));
			$organizacao = trim($_POST[organizacao]);
			$setordn = trim($_POST[setordn]);
			$organizacaodn = trim($_POST[organizacaodn]);
			$sectornamedncompleto = trim($_POST[sectornamedncompleto]);
			$Psectornamedncompleto = trim($_POST[Psectornamedncompleto]);

			if ($sectornamedncompleto=="" && $Psectornamedncompleto=="")
			{			
				$sectornamedncompleto = $organizacao;
			}
			else if ($sectornamedncompleto=="" && $Psectornamedncompleto <> "")
			{
				$sectornamedncompleto = $Psectornamedncompleto;
			}
			else
			{
				$sectornamedncompleto = $organizacao." | ".$sectornamedncompleto;
			}

			$data_atual = date("d/m/Y"); 
			$titulo_system = $GLOBALS['phpgw_info']['apps']['reports']['title'];
			
			$account_lid = $GLOBALS['phpgw']->accounts->data['account_lid'];
			$acl = $this->functions->read_acl($account_lid);
			$raw_context = $acl['raw_context'];
			$contexts = $acl['contexts'];
			foreach ($acl['contexts_display'] as $index=>$tmp_context)
			{
				$context_display .= $tmp_context;
			}
			// Verifica se o administrador tem acesso.
			if (!$this->functions->check_acl($account_lid,'list_maillists'))
			{
				$GLOBALS['phpgw']->redirect($GLOBALS['phpgw']->link('/reports/inc/access_denied.php'));
			}

			unset($GLOBALS['phpgw_info']['flags']['noheader']);
			unset($GLOBALS['phpgw_info']['flags']['nonavbar']);
			$GLOBALS['phpgw_info']['flags']['app_header'] =  $GLOBALS['phpgw_info']['apps']['reports']['title'].' - '.lang('report maillists');
			$GLOBALS['phpgw']->common->phpgw_header();

			$p = CreateObject('phpgwapi.Template',PHPGW_APP_TPL);
			$p->set_file(Array('accounts' => 'report_maillists_group_print.tpl'));
			$p->set_block('accounts','body');
			$p->set_block('accounts','rowpag');
			$p->set_block('accounts','row');
			$p->set_block('accounts','row_empty');
			
			$var = Array(
				'bg_color'					=> $GLOBALS['phpgw_info']['theme']['bg_color'],
				'th_bg'						=> $GLOBALS['phpgw_info']['theme']['th_bg'],
				'subtitulo'					=> lang('reports title8'),
				'subtitulo1'				=> $sectornamedncompleto,
				'context'					=> $raw_context,
				'titulo'					=> $titulo_system,
				'data_atual'				=> $data_atual,				
				'context_display'			=> $context_display,
				'organizacaodn'				=> $organizacaodn,
				'organizacao'				=> $organizacao,
				'sector_name'				=> $grouplist,
				'sector_namedn'				=> $setordn,
				'imapDelimiter'				=> $_SESSION['phpgw_info']['expresso']['email_server']['imapDelimiter']
			);

			$p->set_var($var);
			$p->set_var($this->functions->make_dinamic_lang($p, 'body'));

			// ************ PAGINA��O *******************************

			// verifica se exixte listas no LDAP
			$account_info = $this->functions->get_list_maillists_sector($setordn,$contexts,0);				
			
			if (!count($account_info))
			{
				$p->set_var('message',lang('No maillists found'));
				$p->parse('rows','row_empty',True);
			}
			else if (count($account_info))
			{ 
				//url do paginador 
				$url = $GLOBALS['phpgw_info']['server']['webserver_url'].'/index.php?menuaction=reports.uireports_maillists.report_maillists_print';

				// **** Grupo de paginas ****
				$gpag = $_POST[gpage];

				$grupopage = 20;
				
				if (!$gpag){
					$gpag  = 1;
				}

				// recebe o numero da pagina
				$npag = $_POST[page];

				// verifica se o get com o numero da pagina � nulo
				if (!$npag)
				{
					$npag = 1;
				}

				// conta total dos registros
				$numreg = count($account_info);
				
				// numero de registro por pagina��o
				$numpage = 53;
				
				$tp = ceil($numreg/$numpage);
				$inicio = $page - 1;
				$inicio = $inicio * $numpage;
	
				// valor maximo de pagina��o
				$totalnpag =  (int)($tp/$grupopage);
				$restonpag = $tp % $grupopage;

				if ($restonpag > 0)
				{
					$maxtotalnpag = $totalnpag + 1;
				}
				else
				{
					$maxtotalnpag = $totalnpag;
				}
				// inicio fim para imprimir a pagina��o
				if( $tp > $grupopage)
				{
					// inicio do for da pagina��o
					if ($gpag <= ($totalnpag))
					{
						$fimgpg = $gpag * $grupopage;
						$iniciogpg = (($fimgpg - $grupopage)+1);
					}
					else
					{
						$iniciogpg = (($gpag - 1) * $grupopage);
						$fimgpg = $iniciogpg + $restonpag;
					}
				}
				else
				{
					// inicio do for da pagina��o
					$iniciogpg = 1;
					$fimgpg =  $tp;
				}

				// Imprime valores de contagen de registro e pagina
				$p->set_var('cont_maillists',$numreg);
				$p->set_var('cont_page',$tp);
				$p->set_var('page_now',$npag);

				// ********** busca no LDAP as informa��o paginada e imprime ****************
				$paginas = $this->functions->paginate_maillists($setordn,$contexts,'cn','asc',$npag,$numpage);
				
				$tmpp = array();
				
				while (list($null,$accountp) = each($paginas))
				{
					$tmpp[$accountp['uid'][0]]['account_id']	 = $accountp['uidNumber'][0]; 
					$tmpp[$accountp['uid'][0]]['account_lid'] = $accountp['uid'][0];
					$tmpp[$accountp['uid'][0]]['account_cn']	 = $accountp['cn'][0];
					$tmpp[$accountp['uid'][0]]['account_mail']= $accountp['mail'][0];
					$sortp[] = $accountp['uid'][0];
					if (count($sortp))
					{
						natcasesort($sortp);
						foreach ($sortp as $user_uidp)
						$returnp[$user_uidp] = $tmpp[$user_uidp];
					}
				}

				while (list($null,$accountr) = each($returnp))
				{
					$this->nextmatchs->template_alternate_row_color($p);

					$varr = array(
						'row_loginid'	=> $accountr['account_lid'],
						'row_cn'		=> $accountr['account_cn'],
						'row_mail'		=> (!$accountr['account_mail']?'<font color=red>Sem E-mail</font>':$accountr['account_mail'])
					);
					
					$p->set_var($varr);
	
					$p->parse('rows','row',True);
				}
				// ********************** Fim ****************************

				// grupo de pagina anteriores
				if ($gpag > 1)
				{
					$gpaga = $gpag - 1;
					$varp = Array(
						'paginat'	=> 	"<form name='anterior' method='POST' action='$url'>
						<input type='hidden' name='setor' value='$grouplist'>
						<input type='hidden' name='organizacao' value='$organizacao'>
						<input type='hidden' name='setordn' value='$setordn'>
						<input type='hidden' name='organizacaodn' value='$organizacaodn'>
						<input type='hidden' name='page' value='$npag'>
						<input type='hidden' name='gpage' value='$gpaga'>
						<input type='hidden' name='Psectornamedncompleto' value='$sectornamedncompleto'>
						<div style='float:left;' onClick='document.anterior.submit()'><a href='#'>".lang('Previous Pages')."<<&nbsp;&nbsp;&nbsp;</a></div></form>"
					);
					$p->set_var($varp);						
	
						$p->parse('pages','rowpag',True);
				}
				// **** FIM *******

				// imprime a pagina��o
				if ($fimgpg > 1)
				{
					for($x = $iniciogpg; $x <= $fimgpg; $x++)
					{
						$varp = Array(
							'paginat'	=>  "<form name='form".$x."' method='POST' action='$url'>
							<input type='hidden' name='setor' value='$grouplist'>
							<input type='hidden' name='organizacao' value='$organizacao'>
							<input type='hidden' name='setordn' value='$setordn'>
							<input type='hidden' name='organizacaodn' value='$organizacaodn'>
							<input type='hidden' name='page' value='$x'>
							<input type='hidden' name='gpage' value='$gpag'>
							<input type='hidden' name='Psectornamedncompleto' value='$sectornamedncompleto'>
							<div style='float:left;' onClick='document.form".$x.".submit()'><a href='#'>$x&nbsp;</a></div></form>"
						);

						$p->set_var($varp);						
	
						$p->parse('pages','rowpag',True);
					}
				}
		
				// proximo grupo de pagina
				if ($gpag < $maxtotalnpag && $maxtotalnpag > 0) 
				{
					$gpagp = $gpag + 1;
					$varp = Array(
						'paginat'	=>  "<form name='proximo' method='POST' action='$url'>
						<input type='hidden' name='setor' value='$grouplist'>
						<input type='hidden' name='organizacao' value='$organizacao'>
						<input type='hidden' name='setordn' value='$setordn'>
						<input type='hidden' name='organizacaodn' value='$organizacaodn'>
						<input type='hidden' name='page' value='$npag'>
						<input type='hidden' name='gpage' value='$gpagp'>
						<input type='hidden' name='Psectornamedncompleto' value='$sectornamedncompleto'>
						<div style='float:left;' onClick='document.proximo.submit()'><a href='#'>&nbsp;&nbsp;&nbsp;>>".lang('Next Page')."</a></div></form>"
					);
					$p->set_var($varp);						

					$p->parse('pages','rowpag',True);
				}

			// ************************* FIM PAGINA��O ***********************							
			}

			$p->pfp('out','body');
		}

		function css()
		{
			$appCSS = 
			'th.activetab
			{
				color:#000000;
				background-color:#D3DCE3;
				border-top-width : 1px;
				border-top-style : solid;
				border-top-color : Black;
				border-left-width : 1px;
				border-left-style : solid;
				border-left-color : Black;
				border-right-width : 1px;
				border-right-style : solid;
				border-right-color : Black;
				font-size: 12px;
				font-family: Tahoma, Arial, Helvetica, sans-serif;
			}
			
			th.inactivetab
			{
				color:#000000;
				background-color:#E8F0F0;
				border-bottom-width : 1px;
				border-bottom-style : solid;
				border-bottom-color : Black;
				font-size: 12px;
				font-family: Tahoma, Arial, Helvetica, sans-serif;				
			}
			
			.td_left {border-left:1px solid Gray; border-top:1px solid Gray; border-bottom:1px solid Gray;}
			.td_right {border-right:1px solid Gray; border-top:1px solid Gray; border-bottom:1px solid Gray;}
			
			div.activetab{ display:inline; }
			div.inactivetab{ display:none; }';
			
			return $appCSS;
		}

	}
?>
