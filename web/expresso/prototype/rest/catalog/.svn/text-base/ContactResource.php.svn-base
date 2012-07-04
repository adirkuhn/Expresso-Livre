<?php

if( !defined( 'ROOTPATH' ) )
    define( 'ROOTPATH', dirname(__FILE__).'/..' );

require_once(ROOTPATH.'/rest/hypermedia/hypermedia.php');

use prototype\api\Config as Config;

class ContactResource extends Resource {

    /**
     * Retorna uma lista de usuários
     *
     * @license    http://www.gnu.org/copyleft/gpl.html GPL
     * @author     Consórcio Expresso Livre - 4Linux (www.4linux.com.br) e Prognus Software Livre (www.prognus.com.br)
     * @sponsor    Caixa Econômica Federal
     * @author     José Vicente Tezza Jr. 
     * @return     Retorna uma lista de usuários do LDAP
     * @access     public
     * */
    function get($request, $id) {

	$response = new Response($request);
	$response->addHeader('Content-type', 'aplication/json');
	$response->code = Response::OK;

	$h = new Hypermedia();
	$c = new Collection($request->resources, 'ContactResource');

	try {
	    $this->secured();

            $contact = Controller::find( array( 'concept' => 'contact' ), false, array( 'filter' => array( 'AND', array('=', 'user',  Config::me("uidNumber") ), array('=', 'id', $id) )  ) );

	    //Se nao foi encontrado contatos na consulta
	    if($contact===false){
		$error = new Error();
		$error->setCode(Response::NOTFOUND);
		$error->setTitle('Contact not found');
		$error->setDescription('Contact not found.');

		$c->setError($error);
		$h->setCollection($c);

		$response->code = Response::NOTFOUND;
		$response->body = $h->getHypermedia($request->accept[10][0]);
		return $response;
	    }
			
		$t = new Template();
		$d = new Data();

		$d->setName('name');
		$d->setValue(null);
		$d->setPrompt('Nome do Contato');
		$d->setDataType('string');
		$d->setMaxLength(100);
		$d->setMinLength(null);
		$d->setRequired(true);

		$t->addData($d);

		$d = new Data();
		$d->setName('email');
		$d->setValue(null);
		$d->setPrompt('Email do Contato');
		$d->setDataType('string');
		$d->setMaxLength(100);
		$d->setMinLength(null);
		$d->setRequired(true);

		$t->addData($d);

		$d = new Data();
		$d->setName('telefone');
		$d->setValue(null);
		$d->setPrompt('Telefone do Contato');
		$d->setDataType('string');
		$d->setMaxLength(100);
		$d->setMinLength(null);
		$d->setRequired(true);

		$t->addData($d);

		$c->setTemplate($t);
		
		$d = new Data();
		$d->setName('name');
		$d->setValue($contact[0]['name']);
		$d->setPrompt('Nome do Contato');
		$d->setDataType('string');
		$d->setMaxLength('100');
		$d->setMinLength(null);
		$d->setRequired(true);

		$c->addData($d);
		
		$d = new Data();
		$d->setName('email');
		$d->setValue($contact[0]['email']);
		$d->setPrompt('Email do Contato');
		$d->setDataType('string');
		$d->setMaxLength('100');
		$d->setMinLength(null);
		$d->setRequired(true);

		$c->addData($d);
		
		$d = new Data();
		$d->setName('telephone');
		$d->setValue($contact[0]['telephone']);
		$d->setPrompt('Telefone do Contato');
		$d->setDataType('string');
		$d->setMaxLength('100');
		$d->setMinLength(null);
		$d->setRequired(true);

		$c->addData($d);
		
		$l = new Link();
		$l->setHref('');
		$l->setRel('delete');
		$l->setAlt('Remover');
		$l->setPrompt('Remover');
		$l->setRender('link');
		
		$c->addLink($l);
		
		$l = new Link();
		$l->setHref('');
		$l->setRel('put');
		$l->setAlt('Atualizar');
		$l->setPrompt('Atualizar');
		$l->setRender('link');
		
		$c->addLink($l);
		
		$l = new Link();
		$l->setHref('/contact/'.$value['id']);
		$l->setRel('get');
		$l->setAlt('Buscar');
		$l->setPrompt('Buscar');
		$l->setRender('link');

		$c->addLink($l);
			
		$h->setCollection($c);

	}catch (Exception $ex){
		$error = new Error();
		$error->setCode(Response::INTERNALSERVERERROR);
		$error->setTitle('Internal Server Error');
		$error->setDescription($ex);

		$c->setError($error);
		$h->setCollection($c);

		$response->code = Response::INTERNALSERVERERROR;
		$response->body = $h->getHypermedia($request->accept[10][0]);
		return $response;
	}

	$response->body = $h->getHypermedia($request->accept[10][0]);
	return $response;
  }
}
?>
