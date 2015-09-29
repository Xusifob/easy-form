<div class="wrap gf_browser_chrome">
    <h2>Documentation</h2>
    <section class="panel-wordpress">

        <div>
            <ul id="myTabs" class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active"><a href="#kinds-of-fields" data-toggle="tab">Types de champs</a></li>
                <li><a href="#kinds-of-forms" data-toggle="tab">Types de formulaires</a></li>
            </ul>
            <div class="tab-content">
                <?php include __DIR__ . '/doc/kinds-of-fields.php'; ?>
                <?php include __DIR__ . '/doc/kinds-of-forms.php'; ?>
            </div>
        </div>


        <!--
                <h2>Hooks & actions</h2>
                <p>Il est possible d'effectuer des actions lors de la validation des formulaires, pour celà, il suffit d'utiliser les hooks.
                Pour chaque type de hook, il en existe 2, un "global" qui va être lié à tous les formulaires faisant la même action (tous les formulaires d'inscription par exemple
                Le second type est "lié au formulaire" pour ça, il suffit d'ajouter l'ID du formulaire </p>
                <pre class="brush: php">
                /** Permet d'effectuer une action à l'ajout d'un post  **/
                    add_action('form/insertPost','myInsertPost');
                    add_action('form/insertPost-$formId','myInsertPost');
                    function myInsertPost(){
                    // Action
                    }

                /** Permet d'effectuer une action à l'ajout ou la modification d'un post **/
                    add_action('form/insertOrModifyPost','myInsertPost');
                    function myInsertPost(){
                    // Action
                    }

                /** Permet d'effectuer une action à la modification d'un post **/
                    add_action('form/ModifyPost','myInsertPost');
                    function myInsertPost(){
                    // Action
                    }

                /** Permet d'effectuer une action à l'ajout ou la modification d'un utilisateur **/
                    add_action('form/insertOrModifyUser','myInsertPost');
                    function myInsertPost(){
                    // Action
                    }

                /** Permet d'effectuer une action à l'ajout d'un utilisateur **/
                    add_action('form/ModifyUser','insertUser');
                    function myInsertPost(){
                    // Action
                    }

                /** Permet d'effectuer une action à la modification d'un utilisateur **/
                    add_action('form/ModifyUser','myInsertPost');
                    add_action('form/ModifyUser','myInsertPost');
                    function myInsertPost(){
                    // Action
                    }
                </pre>-->



    </section>
</div>