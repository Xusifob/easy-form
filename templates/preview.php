<div class="wrap gf_browser_chrome">
    <?php if(isset($form)): ?>
        <h2>Instalation du formulaire</h2>
        <section class="panel-wordpress">
            <h2>Initialisation du formulaire</h2>
            <p>Pour installer le formulaire Wordpress, sur le template de votre page, créer un nouveau formulaire</p>

            <pre class="brush: php">
                &lt;?php
                // $id doit être l'ID de votre formulaire
                $formId = <?php echo $_GET['id']; ?>;
                $form = new WP_Form($formId);
                ?&gt;
            </pre>

            <p>Vous pouvez aussi utiliser le slug du formulaire, l'avantage est que vous pouvez plus facilement exporter et réimporter ces derniers</p>
            <pre class="brush: php">
                <?php $theform = get_post($_GET['id']); ?>
                &lt;?php
                // $id doit être l'ID de votre formulaire
                $formSlug = "<?php echo $theform->post_name; ?>";
                $form = new WP_Form($formSlug);
                ?&gt;
            </pre>
            <p>Si votre formulaire est une modification (utilisateur ou post) ajouter en 2e argument de la fonction l'id du post/de l'utilisateur à modifier</p>
            <pre class="brush: php">
                &lt;?php
                // $id doit être l'ID de votre formulaire
                $formId = <?php echo $_GET['id']; ?>;
                // $userId = get_current_user_id();
                // ici $userId vaut
                $form = new WP_Form($formId,$userId);
                ?&gt;
            </pre>

            <p>Le formulaire doit être initialisé avant tout texte, avant même le get_header();.</p>

            <h2>Affichage du formulaire</h2>

            <h4>Afficher tout le formulaire d'un coup</h4>

            <p>Pour afficher le formulaire, il suffit de faire un 'echo'</p>
            <pre class="brush: php">
                &lt;?php
                // Affichage du formulaire
                echo $form;
                ?&gt;
            </pre>

            <h4>Afficher les champs uns par uns</h4>

            <p>Pour afficher les champs là ou on le veut </p>

            <pre class="brush: php">
&lt;?php
// Ouverture du formulaire
$form->open_the_form();
                <?php global $formFields; if(is_array($formFields)) foreach($formFields as $field){ ?>
                    <?php echo "\n"; ?>
                    <?php if($field['type'] == 'radio'):
                        if(!isset($radios[$field['name']]))
                            $radios[$field['name']] = 0; ?>
                        <?php echo "\n"; ?>// Affiche le champ <?php echo $field['name'] . "\n" ?>
                        <?php echo "\n"; ?>$form->the_form_field('<?php echo $field['name'] ?>_<?php echo $radios[$field['name']]; ?>');
                        <?php
                        $radios[$field['name']]++;
                    else: ?>
                        <?php echo "\n"; ?>// Affiche le champ <?php echo $field['name'] . "\n" ?>
                        <?php echo "\n"; ?>$form->the_form_field('<?php echo $field['name'] ?>');
                    <?php endif; ?>
                <?php } ?>
                <?php
                ?>

                // Affiche le bouton submit
$form->the_form_field('submit');

// ferme le formulaire
$form->close_the_form();
?&gt;
            </pre>


            <h2>Gestion des erreurs</h2>
            <p>Pour afficher les erreurs des formulaires :</p>
            <pre class="brush: php">
                &lt;?php
                // Affichage du formulaire
                if($form->hasError()):
                    $form->theError();
                endif;

            </pre>

            <h2>Gestion de l'envoi des formulaires</h2>

            <p>Pour prévenir l'utilisateur lorsqu'un formulaire a bien été envoyé :</p>

            <pre class="brush: php">
                 &lt;?php
                 if($form->hasBeenSend())
                     echo 'le formulaire a bien été envoyé';
                  ?&gt;
            </pre>

            <?php if($form->isResetForm()): ?>
                <h2>Page de réinitialisation de mot de passe</h2>
                <pre class="brush: php">
 &lt;?php
/*
Template Name: Réinitialiser le mot de passe
*/

$form = new WP_Form(<?php echo $_GET['id']; ?>);

// Check si c'est bien une action de reset
$isPage = $form->checkResetPage();


get_header(); ?>

 &lt;?php if($form->hasError())
    $form->theError();
?>
 &lt;?php if($form->hasBeenSend())
    echo 'Votre mot de passe a bien été réinitialisé';
?>

 &lt;?php echo $form; ?>


 &lt;?php get_footer(); ?>
            </pre>

            <?php endif; ?>


            <a href="<?php echo menu_page_url('add-form',false) . '&modify='. $_GET['id']; ?>" class="button button-primary button-large">Modifier</a>
        </section>
        <h2>Prévisualisation du formulaire</h2>
        <section class="panel-wordpress">
            <?php echo $form; ?>
        </section>
    <?php else : ?>
        <h2>Choisissez le formulaire à prévisualiser</h2>
        <section class="panel-wordpress">
            <form action="#">
                <?php while($my_query->have_posts()): $my_query->the_post(); ?>
                    <div class="form-group">
                        <input type="radio" name="id" id="<?php the_ID(); ?>"  value="<?php the_ID(); ?>">
                        <label for="<?php the_ID(); ?>" class="label-checkbox">Formulaire n°<?php the_ID() ?> <?php the_title(); ?></label>
                    </div>
                <?php endwhile; ?>
                <?php foreach($_GET as $key => $val){ ?>
                    <input type="hidden" name="<?php echo $key; ?>" value="<?php echo $val; ?>">
                <?php } ?>
                <div class="form-group">
                    <input type="submit" class="button button-primary button-large" value="Prévisualiser"/>
                </div>
            </form>
        </section>
    <?php endif; ?>
</div>