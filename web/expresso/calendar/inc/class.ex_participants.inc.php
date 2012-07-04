<?php
    
class exParticipants
{
    protected $participants = array();
    var $lang;

    function exParticipants($lang = false)
    {
       $this->lang = $lang;
       if(!$this->lang['ACCEPTED']) $this->lang['ACCEPTED'] = 'Accepted';
       if(!$this->lang['DECLINED']) $this->lang['DECLINED'] = 'Declined';
       if(!$this->lang['TENTATIVE']) $this->lang['TENTATIVE'] = 'Tentative';
       if(!$this->lang['DELEGATED']) $this->lang['DELEGATED'] = 'Delegated';
       if(!$this->lang['NO ANSWER']) $this->lang['NO ANSWER'] = 'No answer';
    }

    function setParticipantsByString($pParticipants)
    {
        $arP = explode(',',trim($pParticipants));
        
        foreach($arP as $value)
        {
                $part = $this->parseParticipantString($value);
                
                if(empty($part)) continue;
                
                $this->participants[] = $part;

        }
    }

    private function parseParticipantString($pParticipant)
    {
       $pParticipant = htmlspecialchars_decode($pParticipant);

       $return = array();
       
       if(preg_match("(\"[^\"]*\"[ ]*<[^>]*@[^>]*>)", $pParticipant))
       {
          $cn = null;
          $mail = null;
          preg_match ("(\"([^\"]*)\")", $pParticipant, $cn);
          preg_match ('(<([^>]*@[^>]*)>)', $pParticipant, $mail);

          if($mail[1])
          $return['mail'] =  $mail[1];

          if($cn[1])
            $return['cn'] =  $cn[1];

          return $return;
       }

       if(preg_match("(<[^>]*@[^>]*>)", $pParticipant))
       {
          $mail = null;
          preg_match ('(<([^>]*@[^>]*)>)', $pParticipant, $mail);
          if($mail[1])
            $return['mail'] =  $mail[1];
          
          return $return;
       }

       if(preg_match("([^ ]*@[^ ]*)", $pParticipant))
       {
          $mail = null;
          preg_match ('([^ ]*@[^ ]*)', $pParticipant, $mail);
          if($mail[0])
            $return['mail'] =  $mail[0];
          
          return $return;
       }
       
    }

    function setParticipantsBySerializable($pParticipants)
    {
        
       if(!unserialize(base64_decode($pParticipants))) //Compatibilidade com eventos antigos;
           $this->setParticipantsByString($pParticipants);
       else
         $this->participants = unserialize(base64_decode($pParticipants));
    }

    function getParticipantsView()
    {
        $return = '';

        $count = 0;
        foreach($this->participants as $k => $v)
        {
            $exp = '';
            
            if($count > 0)
                $exp .= '<br />';
            
            if($v['cn'])
                $exp .= $v['cn'].' - ';

            $exp .= $v['mail'].' ';

            if($v['situation'])
                $exp .= '('.$this->lang[$v['situation']].') ';
            else
                $exp .= '('.$this->lang['NO ANSWER'].')';

            $count++;
            $return .= $exp;
        }

        return $return;
    }

    function getParticipantsMailsString()
    {
        if(!$this->haveParticipants())
            return '';
        
        $return = '';
        
        foreach($this->participants as $value)
            $return .= $value['mail'].', ';

        return (substr($return,0,-2));
    }
    
    function getParticipantsSerializable()
    {
        return base64_encode(serialize($this->participants));
    }
    
    function getParticipantsArray()
    {
        return $this->participants;
    }
    
    function getParticipantsMailsArray()
    {
        $return = array();
        
        foreach ($this->participants as $value)
                $return[] = $value['mail'];
             
        return $return;
    }
    
    
    function insertParticipant($pMail, $pSituation = false, $pCN = false)
    {
        $this->participants[]['mail'] = $pMail;
        
        if($pSituation)
             $this->participants[]['situation'] = $pSituation;
          
        if($pCN)
             $this->participants[]['cn'] = $pCN;
    }
    
    function removeParticipant($pMail)
    {
        $mail = $this->parseParticipantString($pMail);
        if(!empty($mail['mail']))
            foreach($this->participants as $key => $value)
                if($value['mail'] === $mail['mail'])
                    unset($this->participants[$key]);
    }

    function updateAttribBySerializable($pParticipants)
    {
        $participans = unserialize(base64_decode($pParticipants));

        foreach ($participans as $participant)
        {
            foreach($this->participants as $key => $value)
            {
                if($value['mail'] == $participant['mail'])
                {
                    $this->participants[$key]['cn'] = $participant['cn'];
                    $this->participants[$key]['situation'] = $participant['situation'];
                }
            }
        }

    }

    function updateParticipant($mail,$situation,$cn = false)
    {
        foreach($this->participants as $key => $value)
        {
            if(trim($value['mail']) == trim($mail))           
            {
                $this->participants[$key]['situation'] = $situation;
                $this->participants[$key]['cn'] = $cn;
            }
        }
    }
    
    function haveParticipants()
    {
        if(count($this->participants) > 0)
            return true;
        else
            return false;
    }



}   
?>
