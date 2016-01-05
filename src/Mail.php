<?php


class Mail
{
    /**
     * @var string
     */
    private $recipientEmail;
    /**
     * @var string
     */
    private $recipientName;
    /**
     * @var string
     */
    private $subject;
    /**
     * @var string
     */
    private $message;
    /**
     * @var string
     */
    private $senderEmail;
    /**
     * @var string
     */
    private $senderName ;

    /**
     * @var string
     */
    private $returnLigne;

    /**
     * @var string
     */
    private $boundary;

    /**
     * @Since V 0.4
     *
     * The message send is in HTML
     *
     * @var bool
     */
    private $html;

    /**
     * @param array $args
     */
    public function __construct($args = [])
    {

        if(isset($args['senderEmail']) && !empty($args['senderEmail']))
            $this->setSenderEmail($args['senderEmail']);

        if(isset($args['recipientEmail']) && !empty($args['recipientEmail']))
            $this->setRecipientEmail($args['recipientEmail']);

        $this->senderName = isset($args['senderName']) ? $args['senderName'] : get_option('blogname');
        $this->recipientName = isset($args['recipientName']) ? $args['recipientName'] : '';
        $this->subject = isset($args['subject']) ? $args['subject '] : '';
        $this->message = isset($args['message']) ? $args['message'] : '';

        $this->boundary = "-----=".md5(rand());
        return $this;
    }


    /**
     * @return string
     */
    public function getrecipientEmail()
    {
        return $this->recipientEmail;
    }


    /**
     * @param string $recipientEmail
     * @return $this
     * @throws Exception
     */
    public function setRecipientEmail($recipientEmail)
    {

        if(is_string($recipientEmail) && filter_var($recipientEmail,FILTER_VALIDATE_EMAIL)) {
            $this->recipientEmail = $recipientEmail;
            $this->setReturnLigne();
        }else{
            throw new Exception ('E-mail destinataire doit être un e-mail valide');
        }
        return $this;
    }

    /**
     * @return string
     */
    public function getRecipientName()
    {
        return $this->recipientName;
    }

    /**
     * @param string $recipientName
     * @return $this
     */
    public function setRecipientName($recipientName)
    {
        $this->recipientName = $recipientName;
        return $this;
    }

    /**
     * @return string
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
     * @param string $subject
     * @return $this
     */
    public function setSubject($subject)
    {
        $this->subject = $subject;
        return $this;
    }

    /**
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     *
     * @since V 0.1
     *
     * @Modify V 0.4
     *
     * @param string $message
     * @param bool $html
     * @return $this
     */
    public function setMessage($message,$html = false)
    {

        $this->html = $html;

        $this->message = $message;
        return $this;
    }

    /**
     * @return string
     */
    public function getSenderEmail()
    {
        return $this->senderEmail;
    }

    /**
     * @param string $senderEmail
     * @return $this
     * @throws Exception
     */
    public function setSenderEmail($senderEmail)
    {
        if(is_string($senderEmail) && filter_var($senderEmail, FILTER_VALIDATE_EMAIL)) {
            $this->senderEmail = $senderEmail;
        }else{
            throw new Exception ('E-mail destinataire doit être un e-mail valide');
        }
        return $this;
    }

    /**
     * @return string
     */
    public function getSenderName()
    {
        return $this->senderName;
    }

    /**
     * @param string $senderName
     * @return $this
     */
    public function setSenderName($senderName)
    {
        $this->senderName = $senderName;

        return $this;
    }

    /**
     * @return string
     */
    public function getReturnLigne()
    {
        return $this->returnLigne;
    }

    /**
     * @return $this
     * @internal param string $returnLigne
     */
    private function setReturnLigne()
    {
        // On filtre les serveurs qui rencontrent des bogues.
        if (!preg_match("#^[a-z0-9._-]+@(hotmail|live|msn).[a-z]{2,4}$#", $this->recipientEmail))
        {
            $this->returnLigne = "\r\n";
        }
        else
        {
            $this->returnLigne = "\n";
        }
        return $this;
    }


    private function createHeader()
    {
        // Création du header de l'e-mail.
        $header = "From: \"" .  $this->senderName . "\"<" . $this->senderEmail . ">".$this->returnLigne;
        $header.= "Reply-to: \"" . $this->recipientName . "\" <" . $this->recipientEmail . ">".$this->returnLigne;
        $header.= "MIME-Version: 1.0".$this->returnLigne;
        $header.= "Content-Type: multipart/alternative;".$this->returnLigne." boundary=\"$this->boundary\"".$this->returnLigne;

        return $header;
    }

    /**
     * Create the message
     *
     * @Since V 0.1
     *
     * @Modified : V 0.4
     * @return string
     */
    private function createMessage()
    {

        /** @Since V 0.4 */
        if(!$this->html) {

            // Création du message texte.
            $message_txt = preg_replace('#<br />|<br>|</br>|<br >|< br/>#', $this->returnLigne, nl2br($this->message));    // Je modifie les passages à la ligne

            // Création du message au format HTML
            $message_html = "<html><head><meta charset=\"utf-8\"/></head><body style=\"background-color: white;\"><div>" . nl2br(stripslashes($this->message)) . "</div></body></html>";

        }else{
            $message_html = $this->message;
            $message_txt = strip_tags(preg_replace('#<br />|<br>|</br>|<br >|< br/>#', $this->returnLigne, nl2br($this->message)));
        }



        // Création du message.
        $message = $this->returnLigne."--".$this->boundary.$this->returnLigne;

        // Ajout du message au format texte.
        $message.= "Content-Type: text/plain; charset=\"utf-8\"".$this->returnLigne;
        $message.= "Content-Transfer-Encoding: 8bit".$this->returnLigne;
        $message.= $this->returnLigne.$message_txt.$this->returnLigne;
        $message.= $this->returnLigne."--".$this->boundary.$this->returnLigne;

        // Ajout du message au format HTML
        $message.= "Content-Type: text/html; charset=\"utf-8\"".$this->returnLigne;
        $message.= "Content-Transfer-Encoding: 8bit".$this->returnLigne;
        $message.= $this->returnLigne.$message_html.$this->returnLigne;

        $message.= $this->returnLigne."--".$this->boundary."--".$this->returnLigne;
        $message.= $this->returnLigne."--".$this->boundary."--".$this->returnLigne;

        return $message;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->message;
    }

    /**
     * Send the mail
     *
     * @Since V 0.1
     *
     * @Modified : V 0.4
     *
     * @return bool
     * @throws Exception
     *
     */
    public function send()
    {
        if(
            isset($this->recipientEmail) && !empty($this->recipientEmail) &&
            isset($this->recipientName) && !empty($this->recipientName) &&
            isset($this->senderName) && !empty($this->senderName) &&
            isset($this->subject) && !empty($this->subject) &&
            isset($this->message) && !empty($this->message) &&
            isset($this->senderEmail) && !empty($this->senderEmail)
        ){
            $this->setReturnLigne();
            $header = $this->createHeader();
            $message = $this->createMessage();

            // Get the error
            ob_start();
            $result = mail($this->recipientEmail,$this->subject,$message,$header);
            $error = ob_get_clean();

            return empty($error) && $result;
        }else{
            throw new Exception('Tous les champs doivent être remplis');
        }
    }
}