<?php

namespace WebClient\WebClientBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {

        $urlExpressoAntigo = $this->get('router')->generate('WebClientBundle_homepage') . 'expresso/';
        if ( $this->container->get('kernel')->getEnvironment() === 'dev' ) {
            $urlExpressoAntigo = $this->get('router')->generate('WebClientBundle_homepage') . '../expresso/';
        }

        $logadoExpressoAntigo = false;
        if ( isset($_SESSION['phpgw_info']) ) {
            $logadoExpressoAntigo = true;
        }

        return $this->render('WebClientBundle:Default:index.html.twig', array(
            'logadoExpressoAntigo' => $logadoExpressoAntigo,
            'urlExpressoAntigo' => $urlExpressoAntigo
            )
        );
    }

    public function logAction()
    {
        return $this->render('WebClientBundle:Default:login.html.twig');
    }
}
