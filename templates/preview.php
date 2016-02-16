<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly ?>
<!--
@Updated : V 0.5.3
@Updated : V 0.5.5
-->
<div class="wrap gf_browser_chrome">
    <div class="tab-head panel-wordpress">
        <div class="head">
            <h2><?php _e('Choisissez le formulaire à prévisualiser', 'easy-form'); ?></h2>
        </div>
        <form action="#">
            <div class="row">
                <div class="col-sm-3">
                    <label for="form-id"><?php _e("Choix du formulaire", 'easy-form'); ?></label>
                    <select name="id" id="form-id">
                        <option
                            value="<?php echo $_GET['id']; ?>"><?php _e("Séléctionnez votre formulaire", 'easy-form'); ?></option>
                        <?php /** @var WP_Post $oneForm * */
                        foreach ($my_query->get_posts() as $oneForm) { ?>
                            <option <?php echo $oneForm->ID == $_GET['id'] ? 'selected' : ''; ?>
                                value="<?php echo $oneForm->ID; ?>"><?php echo $oneForm->post_title; ?></option>
                        <?php } ?>
                    </select>
                </div>
            </div>
            <div class="row mg-top-25">
                <div class="col-sm-3">
                    <input type="submit" class="button button-primary button-large"
                           value="<?php _e("Prévisualiser", 'easy-form'); ?>">
                </div>
            </div>
            <input type="hidden" name="page" value="<?php echo $_GET['page']; ?>">
        </form>
    </div>
    <?php if (isset($form)) { ?>
        <section class="panel-wordpress">
            <div class="head">
                <h2><?php _e('Initialisation du formulaire', 'easy-form'); ?></h2>
            </div>
            <p><?php _e('Pour installer le formulaire Wordpress, sur le template de votre page, créer un nouveau formulaire', 'easy-form'); ?></p>

            <pre class="brush: php">
                &lt;?php
                <?php _e('// $id doit être l\'ID de votre formulaire', 'easy-form'); ?>

                $formId = <?php echo $_GET['id']; ?>;
                $form = new WP_Form($formId);
                ?&gt;
            </pre>

            <p><?php _e('Vous pouvez aussi utiliser le slug du formulaire, l\'avantage est que vous pouvez plus facilement exporter et réimporter ces derniers', 'easy-form'); ?></p>
            <pre class="brush: php">
                <?php $theform = get_post($_GET['id']);
                ?>&lt;?php
                <?php _e('// $formSlug doit être le slug de votre formulaire', 'easy-form'); ?>

                $formSlug = "<?php echo $theform->post_name; ?>";
                $form = new WP_Form($formSlug);
                ?&gt;
            </pre>
            <p><?php _e('Si votre formulaire est une modification (utilisateur ou post) ajouter en 2e argument de la fonction l\'id du post/de l\'utilisateur à modifier', 'easy-form'); ?></p>
            <pre class="brush: php">
                &lt;?php
                <?php _e('// $id doit être l\'ID de votre formulaire', 'easy-form'); ?>

                $formId = <?php echo $_GET['id']; ?>;
                $userId = get_current_user_id();
                <?php _e('// ici $userId vaut l\'id de l\'utilisateur en cours', 'easy-form'); ?>

                $form = new WP_Form($formId,$userId);
                ?&gt;
            </pre>

            <p><?php _e('Le formulaire doit être initialisé avant tout texte, avant même le get_header();.', 'easy-form'); ?></p>
        </section>
        <section class="panel-wordpress">
            <div class="head">
                <h2><?php _e('Affichage du formulaire', 'easy-form'); ?></h2>
            </div>

            <h4><?php _e('Afficher tout le formulaire d\'un coup', 'easy-form'); ?></h4>

            <p><?php _e('Pour afficher le formulaire, il suffit de faire un \'echo\'', 'easy-form'); ?></p>
            <pre class="brush: php">
                &lt;?php
                <?php _e('// Affichage du formulaire', 'easy-form'); ?>

                echo $form;
                ?&gt;
            </pre>

            <h4><?php _e('Afficher les champs uns par uns', 'easy-form'); ?></h4>

            <p><?php _e('Pour afficher les champs là ou on le veut ', 'easy-form'); ?></p>

            <pre class="brush: php">
<?php echo "\n"; ?>&lt;?php
                <?php echo "\n";
                _e('// Ouverture du formulaire', 'easy-form'); ?>
                <?php echo "\n"; ?>$form->open_the_form();
                <?php if (is_array($formFields)) foreach ($formFields as $field) {
                    if ($field['type'] == 'radio'):
                        if (!isset($radios[$field['name']]))
                            $radios[$field['name']] = 0;
                        echo "\n"; ?><?php _e('// Affiche le champ ', 'easy-form'); ?><?php echo $field['name'];
                        echo "\n"; ?>$form->the_form_field('<?php echo $field['name'] ?>_<?php echo $radios[$field['name']]; ?>');
                        <?php
                        $radios[$field['name']]++;
                    else: ?>
                        <?php echo "\n";
                        _e('// Affiche le champ', 'easy-form'); ?><?php echo $field['name'];
                        echo "\n"; ?>$form->the_form_field('<?php echo $field['name'] ?>');
                    <?php endif; ?>
                <?php } ?>
                <?php
                ?>
                <?php echo "\n";
                _e('// Affiche le bouton submit', 'easy-form'); ?>
                <?php echo "\n"; ?>$form->the_form_field('submit');
                <?php echo "\n";
                _e('// ferme le formulaire', 'easy-form'); ?>
                <?php echo "\n"; ?>$form->close_the_form();
?&gt;
            </pre>
        </section>
        <section class="panel-wordpress">
            <div class="head">
                <h2><?php _e('Gestion des erreurs', 'easy-form'); ?></h2>
            </div>
            <p><?php _e('Pour afficher les erreurs des formulaires :', 'easy-form'); ?></p>
            <pre class="brush: php">
                &lt;?php
                <?php _e('// Affichage des erreurs du formulaire', 'easy-form'); ?>

                if($form->hasError()):
                    $form->theError();
                endif;

            </pre>

            <div class="head">
                <h2><?php _e('Gestion de l\'envoi des formulaires', 'easy-form'); ?></h2>
            </div>

            <p><?php _e('Pour prévenir l\'utilisateur lorsqu\'un formulaire a bien été envoyé avec success (il n\' a pas eu d\'erreurs :', 'easy-form'); ?></p>

            <pre class="brush: php">
                 &lt;?php
                 if($form->hasBeenSend())
                     echo '<?php _e('le formulaire a bien été envoyé', 'easy-form'); ?>';
                  ?&gt;
            </pre>

            <?php if ($form->isResetForm()): ?>
                <div class="head">
                    <h2><?php _e('Page de réinitialisation de mot de passe', 'easy-form'); ?></h2>
                </div>
                <pre class="brush: php">
 &lt;?php
/*
Template Name: <?php _e('Réinitialiser le mot de passe', 'easy-form'); ?>
                    */

$form = new WP_Form(<?php echo $_GET['id']; ?>);

                    <?php _e('// Check si c\'est bien une action de reset', 'easy-form'); ?>
                    $isPage = $form->checkResetPage();


get_header(); ?>

 &lt;?php if($form->hasError())
    $form->theError();
?>
 &lt;?php if($form->hasBeenSend())
    echo '<?php _e('Votre mot de passe a bien été réinitialisé', 'easy-form'); ?>';
?>

 &lt;?php echo $form; ?>


 &lt;?php get_footer(); ?>
            </pre>

            <?php endif; ?>


            <a href="<?php echo menu_page_url('add-form', false) . '&modify=' . $_GET['id']; ?>"
               class="button button-primary button-large"><?php _e('Modifier', 'easy-form'); ?></a>
        </section>
        <section class="panel-wordpress preview-form">
            <div class="head">
                <h2><?php _e('Prévisualisation du formulaire', 'easy-form'); ?></h2>
            </div>
            <p><?php _e('Ceci est la prévisualisation de votre formulaire, elle ne prends pas en compte votre propre style, il est possible que votre formulaire final ne ressemble pas à ça.', 'easy-form'); ?></p>
            <?php echo $form; ?>
        </section>
    <?php } ?>
</div>

<script type="text/javascript">
    SyntaxHighlighter.all();
</script>