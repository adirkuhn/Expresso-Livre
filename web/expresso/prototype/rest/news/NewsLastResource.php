<?php

class NewsLastResource extends Resource{
    
    /**
    * Busca os últimos 10 boletins em que o usuário tem acesso
    *
    * @license    http://www.gnu.org/copyleft/gpl.html GPL
    * @author     Consórcio Expresso Livre - 4Linux (www.4linux.com.br) e Prognus Software Livre (www.prognus.com.br)
    * @sponsor    Caixa Econômica Federal
    * @author     Adriano Coutinho da Silva
    * @return     Lista dos ultimos 10 boletins do usuário
    * @access     public
    **/
    function GET($request){
	$this->secured();

	$news = Controller::service('PostgreSQL')->execResultSql( 'SELECT news_subject  as "subject" , 
	    news_content as "content" ,
	    news_date as "startTime", 
	    news_end as "endTime", 
	    news_id as "id" 
	    FROM phpgw_news WHERE news_cat IN (1) AND news_begin <= '.time().' AND 
	    news_end >= '.time().' ORDER BY news_date DESC limit 10');

	if(isset($news) && count($news) > 0)
	    foreach($news as $key => &$value)
		$value['subject'] = utf8_encode($value['subject']);

	$response = new Response($request);
	$response->code = Response::OK;
	$response->addHeader('Content-type', 'aplication/json');

	$response->body = json_encode(( is_array($news) && $news) ? $news : array());
	return $response;
    }
}

?>
