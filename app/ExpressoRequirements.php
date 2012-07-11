<?php
require_once dirname(__FILE__).'/SymfonyRequirements.php';

class ExpressoRequirements extends SymfonyRequirements
{
    public function __construct()
    {
        /**
        * Requerimentos do Symfony
        */
        parent::__construct();

        /**
        * Requerimentos para o Expresso Livre
        */

        //LDAP
        $this->addRequirement(
            function_exists('ldap_connec'),
            'ldap_connect() precisa estar disponivel',
            'Instale e habilite o extensão <strong>LDAP</strong>.'
        );

        //IMAP
        $this->addRequirement(
            function_exists('imap_open'),
            'imap_open() precisa estar disponivel',
            'Instale e habilite o extensão <strong>IMAP</strong>.'
        );
    }
}