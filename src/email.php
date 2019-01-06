<?php


/**
 *
 * This class helps sending an email and connecting to the different providers to send the emails via them
 *
 * Class EF_Email_Helper
 */
class EF_Email_Helper
{

    static $EMAIL_DIR = 'ef_emails';


    /**
     *
     * Send an email. Filter the values to make sure it has not been called by a 3rd party
     *
     * @param $subject
     * @param $recipients
     * @param $template
     * @param array $headers
     * @param array $attachment
     * @return bool
     */
    public function sendEmail($subject,$recipients,$template,$headers = array(),$attachment = array())
    {

        $headers = array_merge($headers,array(
            'Content-Type: text/html; charset=UTF-8'
        ));


        $data = array(
            'subject' => $subject,
            "recipients" => $recipients,
            'template' => $template,
            'headers' => $headers,
            'attachment' => $attachment,
            'is_sent' => false
        );

        // Filter the data so we can send the email using something else than wp_mail
        $data = apply_filters('ef_before_mail',$data);

        dump($data);

        if(!$data['is_sent']) {
            return wp_mail($data['recipients'], $data['subject'], $data['template'], $data['headers'], $data['attachment']);
        }
        return true;

    }


    /**
     *
     * Load the email template
     *
     * @param $template_name
     * @return bool|false|string
     */
    public function loadTemplate($template_name)
    {

        if(strpos($template_name,'.html') === false) {
            $template_name .= '.html';
        }


        $file = get_stylesheet_directory() . '/' .  self::$EMAIL_DIR . '/' .  $template_name;

        if(file_exists($file) && is_readable($file)) {
            return file_get_contents($file);
        }

        $file = EF_get_path('assets/' . self::$EMAIL_DIR) . '/' . $template_name;

        if(file_exists($file) && is_readable($file)) {
            return file_get_contents($file);
        }

        return false;
    }



    /**
     *
     * Parse the template and replace all the parameters with their value
     *
     * @param $template
     * @param $data
     * @return mixed
     */
    public function parseTemplate($template,$data)
    {

        $regex = '#\{\{((?!\}\}).)*\}\}#';

        preg_match_all($regex,$template,$matches);

        if(!isset($matches[0]) || empty($matches[0])) {
            return $template;
        }

        foreach($matches[0] as $match) {
            $key = str_replace(array('{{','}}'),'',$match);

            $value = '';

            if(isset($data[$key])) {
                $value = $data[$key];
            }

            $template = str_replace($match,$value,$template);

        }


        return $template;
    }


}