 <?php  if (!defined('ABSPATH')) exit; // Exit if accessed directly ?>

    // Set all fields depending on modify or add
    <?php
    if(isset($formFields[0])):
        echo 'var fields = ' . json_encode($formFields[0]) . ';';
    else : ?>
    var fd = getInput({
        id: 1,
        type: 'text',
        name: ''
    });
    var fields = [fd];
    <?php endif; ?>


    var utilitiesEmpty = {
        post: {
            post_type: "post",
            post_status: "publish"
        },
        connexion: {
            remember: true
        },
        user: {
            role: "current",
            connectUser: true,
            emailUser: false
        },
        email: {
            subject: "",
            recipientEmail: "<?php echo get_option('admin_email'); ?>",
            recipientName: "<?php echo get_option('blogname'); ?>"
        },
        resetPassword: {
            subject: "Réinitialisation du mot de passe",
            senderEmail: "<?php echo get_option('admin_email'); ?>",
            senderName: "<?php echo get_option('blogname'); ?>",
            message: "",
            resetAction: "reset-password-email",
            pageId: "",
            submitValue: 'Réinitialiser'
        }
    };


    var formType = "<?php echo isset($formMetas['form-type'][0]) ? $formMetas['form-type'][0] : 'post'; ?>";
    var formSendArgs = <?php echo isset($formSendArgs[0]) ? json_encode($formSendArgs[0]) : '""'; ?>;

    getUtilities(formType, formSendArgs);

    // Set the nb of fields at 0 for the start
    var fieldIncrement = 0;

    /**
     *
     * @Since V 0.5.0
     *
     * Display all the fields on the page as long as there are some fields
     */
    function retrieveData() {
        if (fieldIncrement < fields.length) {
            displayData(fields[fieldIncrement]);
        } else
            $('#spinner-fields').hide();
    }



    // J'affiche tous les champs sur la page
    retrieveData();



