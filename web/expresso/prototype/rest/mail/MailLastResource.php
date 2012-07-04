<?php
 
use prototype\api\Config as Config;

class MailLastResource extends Resource {
 
    /**
    * Busca as últimas 20 menssagens não lidas do usuário
    *
    * @license    http://www.gnu.org/copyleft/gpl.html GPL
    * @author     Consórcio Expresso Livre - 4Linux (www.4linux.com.br) e Prognus Software Livre (www.prognus.com.br)
    * @sponsor    Caixa Econômica Federal
    * @author     Cristiano Corrêa Schmidt
    * @return     Lista das ultimas 10 menssagens do usuário não lidas
    * @access     public
    **/
    function get($request) 
    {
	$this->secured();
	
        $response = new Response($request);
        $response->code = Response::OK;
        $response->addHeader('Content-type', 'aplication/json');
		
	$cyrus = Config::service('Cyrus', 'config');
	$options = ($cyrus['tlsEncryption']) ? '/tls/novalidate-cert' : '/notls/novalidate-cert'; 
	$mbox = imap_open( '{'.$cyrus['host'].":".$cyrus['port'].$options.'}INBOX' , Config::me('uid') , Config::me('password') );
	
	$msgIds = imap_sort( $mbox , SORTDATE , 1 , null , "UNSEEN" , 'UTF-8');
	$msgIds = array_splice($msgIds , 0 , 20);
	
	$return = array();
	
	foreach ($msgIds as $key => &$value) 
	{    
	      $header = imap_headerinfo( $mbox, $value );
	      $return[$key]['subject'] = ( isset($header->subject) && trim($header->subject) !== '' ) ?  self::decodeMimeString($header->subject) : 'No Subject';
	      $return[$key]['date'] =  $header->udate;
	      $return[$key]['from'] =  (isset( $header->from[0] )) ? self::formatMailObject( $header->from[0] ) : array( 'name' => '' , 'mail' => '');
	}

	$response->body = json_encode($return);
	
	imap_close($mbox);
	return $response;
    }

    
    
    /**
    *  Decodifica os tokens encontrados na função decodeMimeString
    * 
    * @license    http://www.gnu.org/copyleft/gpl.html GPL
    * @author     Consórcio Expresso Livre - 4Linux (www.4linux.com.br) e Prognus Software Livre (www.prognus.com.br)
    * @sponsor    Caixa Económica Federal
    * @author     Cristiano Corrêa Schmidt
    * @return     bool
    * @access     public
    */
    static private function decodeMimeStringCallback( $mathes )
    {
       $str = (strtolower($mathes[2]) == 'q') ?  quoted_printable_decode(str_replace('_','=20',$mathes[3])) : base64_decode( $mathes[3]) ;
       return ( strtoupper($mathes[1]) == 'ISO-8859-1' ) ? mb_convert_encoding(  $str , 'UTF-8' , 'ISO-8859-1') : $str;
    }

    /**
    *  Decodifica uma string no formato mime RFC2047
    *
    * @license    http://www.gnu.org/copyleft/gpl.html GPL
    * @author     Consórcio Expresso Livre - 4Linux (www.4linux.com.br) e Prognus Software Livre (www.prognus.com.br)
    * @sponsor    Caixa Económica Federal
    * @author     Cristiano Corrêa Schmidt
    * @return     bool
    * @access     public
    */
    static private function decodeMimeString( $string )
    {
      $string =  preg_replace('/\?\=(\s)*\=\?/', '?==?', $string);
      return preg_replace_callback( '/\=\?([^\?]*)\?([qb])\?([^\?]*)\?=/i' ,array( 'self' , 'decodeMimeStringCallback'), $string);
    }
    
     /**
    *  Formata um mailObject para um array com name e email
    *
    * @license    http://www.gnu.org/copyleft/gpl.html GPL
    * @author     Consórcio Expresso Livre - 4Linux (www.4linux.com.br) e Prognus Software Livre (www.prognus.com.br)
    * @sponsor    Caixa Económica Federal
    * @author     Cristiano Corrêa Schmidt
    * @return     bool
    * @access     public
    */
    static private function formatMailObject( $obj )
    {
	$return = array();
	$return['mail'] = self::decodeMimeString($obj->mailbox) . (( isset( $obj->host) && $obj->host != ('unspecified-domain') &&  $obj->host !=  '.SYNTAX-ERROR.')? '@'. $obj->host : '');
	$return['name'] = ( isset( $obj->personal ) && trim($obj->personal) !== '' ) ? self::decodeMimeString($obj->personal) :  $return['mail'];
	return $return;
    }
}
