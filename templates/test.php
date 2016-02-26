<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly ?>
<div class="wrap">
    <?php include __DIR__ . '/../tests/header.php'; ?>

    <section class="panel-wordpress preview-form">
        <div class="head">
            <h2><?php _e('Tests unitaires', 'easy-form'); ?></h2>
        </div>
        <p><?php _e('Entrez vos identifiants de connexion pour lancer le test', 'easy-form'); ?></p>
        <form action="#" method="post">
            <input type="text" placeholder="<?php _e('Identifiant administrateur', 'easy-form'); ?>"
                   name="username"
                   value="<?php echo isset($_POST['username']) ? $_POST['username'] : ''; ?>">
            <input type="password" placeholder="<?php _e('Mot de passe administrateur', 'easy-form'); ?>"
                   name="password"
                   value="<?php echo isset($_POST['password']) ? $_POST['password'] : ''; ?>">
            <input type="email"
                   placeholder="<?php _e('Votre e-mail pour voir si vous les reçevez bien', 'easy-form'); ?>"
                   name="email"
                   value="<?php echo isset($_POST['email']) ? $_POST['email'] : ''; ?>">
            <input class="btn btn-large" type="submit" value="<?php _e('Lancer le test', 'easy-form'); ?>">
        </form>
    </section>
    <?php if (isset($_POST['username']) && isset($_POST['password'])) { ?>
        <section class="panel-wordpress">
            <div class="head">
                <h2><?php _e('Tests PHP', 'easy-form'); ?></h2>
            </div>

            <table class="table table-stripped" id="table-php">
                <div class="spinner-container" id="spinner-php">
                    <div class="spinner"></div>
                </div>
                <thead>
                <tr>
                    <th><?php _e('Nom du test', 'easy-form'); ?></th>
                    <th><?php _e('Paramètres', 'easy-form'); ?></th>
                    <th><?php _e('Résultat', 'easy-form'); ?></th>
                    <th><?php _e('Temps', 'easy-form'); ?></th>
                    <th><?php _e('Stack Trace', 'easy-form'); ?></th>
                </tr>
                </thead>
                <tbody id="tests-php">
                <?php
                $tests = [
                    [
                        'test' => 'login',
                        'params' => [$_POST['username'], $_POST['password']]
                    ],
                    /********** ADD POST FORMS *****
                     * [
                     * 'test' => 'import_form',
                     * 'params' => ['add-post.json', 'Test Add Post']
                     * ], [
                     * 'test' => 'test_add_form',
                     * 'params' => ['add-post.json']
                     * ], [
                     * 'test' => 'test_update_post_form',
                     * 'params' => []
                     * ], [
                     * 'test' => 'delete_last_form',
                     * 'params' => ['Add Post']
                     * ], [
                     * 'test' => 'delete_last_post',
                     * 'params' => []
                     * ],
                     * /**************** ADD USER FORMS **********
                     * [
                     * 'test' => 'import_form',
                     * 'params' => ['add-user.json', 'Test Add User']
                     * ], [
                     * 'test' => 'test_add_user_form',
                     * 'params' => []
                     * ], [
                     * 'test' => 'test_update_user_form',
                     * 'params' => []
                     * ], [
                     * 'test' => 'delete_last_form',
                     * 'params' => ['Add User']
                     * ], [
                     * 'test' => 'import_form',
                     * 'params' => ['connexion.json', 'Connexion']
                     * ], [
                     * 'test' => 'test_connect_user',
                     * 'params' => ['add-post.json']
                     * ], [
                     * 'test' => 'delete_last_user',
                     * 'params' => []
                     * ], [
                     * 'test' => 'delete_last_form',
                     * 'params' => ['Connexion']
                     * ], */


                ];
                ?>
                </tbody>
            </table>
        </section>
        <section class="panel-wordpress">
            <div class="head">
                <h2><?php _e('Tests Javascript', 'easy-form'); ?></h2>
            </div>

            <table class="table table-stripped" id="table-js">
                <div class="spinner-container" id="spinner-js">
                    <div class="spinner"></div>
                </div>
                <thead>
                <tr>
                    <th><?php _e('Nom du test', 'easy-form'); ?></th>
                    <th><?php _e('Paramètres', 'easy-form'); ?></th>
                    <th><?php _e('Résultat', 'easy-form'); ?></th>
                    <th><?php _e('Temps', 'easy-form'); ?></th>
                    <th><?php _e('Stack Trace', 'easy-form'); ?></th>
                </tr>
                </thead>
                <tbody id="tests-js">
                </tbody>
            </table>

            <?php include __DIR__ . '/add.php'; ?>

        </section>
        <script type="text/javascript">
            // All test to do in php
            var tests_php = <?php echo json_encode($tests); ?>;


            // Number of fails
            var fail = {
                js: 0,
                php: 0,
            };


            // Number of success
            var success = {
                js: 0,
                php: 0,
            };


            // Ajax url
            var ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';


            /**
             *
             * Handle the test result to display them in the page
             *
             * @Since V 0.5.6
             *
             * @param data array  the results
             * @param kind string the kind of test (php or js)
             */
            function handleResult(data, kind) {
                var result = data.result ? "<span style='color:green;'><?php _e('Succès', 'easy-form'); ?></span>" : "<span style='color:red;'><?php _e('Echec', 'easy-form'); ?></span>";
                var template;


                if (data.result) {
                    success[kind]++;
                }else
                    fail[kind]++;

                template = '<tr>';
                template += '<td>' + data.function + '</td>';
                template += '<td>' + JSON.stringify(data.params) + '</td>';
                template += '<td>' + result + '</td>';
                template += '<td>' + data.time + '</td>';
                template += '<td>' + data.reason + '</td>';
                template += '</tr>';

                jQuery('#tests-' + kind).append(template);
            }

            /**
             *
             * @since V 0.5.6
             *
             * Launch the next php test
             *
             * @param i int number of the text to do
             */
            function nextTestPhp(i) {
                if (tests_php[i] != undefined) {
                    jQuery.get(ajaxUrl, {action: 'do_test', test: tests_php[i].test, params: tests_php[i].params})
                        .done(function (rawData) {

                            var data = JSON.parse(rawData);

                            handleResult(data, 'php');


                            i++;
                            nextTestPhp(i);
                        });
                } else {
                    jQuery('#spinner-php').hide();

                    var table = jQuery('#table-php');

                    table.after("<span style='color:green;'>" + success.php + " <?php _e('Succès', 'easy-form'); ?></span><br>");
                    if (fail.php != 0)
                        table.after("<span style='color:red;'>" + fail.php + " <?php _e('Echec', 'easy-form'); ?></span>");
                    table.after("<span>" + (success.php + fail.php) + " <?php _e('Total', 'easy-form'); ?></span><br>");
                }
            }

            // Launch the tests in PHP
            nextTestPhp(0);



        </script>
    <?php } ?>
</div>


