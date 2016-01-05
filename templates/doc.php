<div class="wrap gf_browser_chrome">
    <h2>Documentation</h2>
    <section class="panel-wordpress">
        <h2>Ajouter un post</h2>

        <p>Liste de tous les champs possibles par type de formulaires. (Depuis la V 0.4, les champs ne sont pas obligatoires à la modification)</p>
        <pre class="brush: php">
        /*    @fields :
        *           @Type de champ              : Nom du champ  : Obligatoire   : Description
         *
         *          @text                       : title         : (Obligatoire) : Le titre du post
         *          @text|@wp_editor|@textaera  : content       : (Optionnel)   : Le contenu du post
         *
         *          Tous les autres champs seront entrées comme metas
         */
        </pre>

        <h2>Ajouter un utilisateur</h2>

        <pre class="brush: php">
        /*    @fields :
         *          @Type de champ              : Nom du champ      : Obligatoire   : Description
         *
         *          @email                      : email             : (Obligatoire) : Le mail de l'utilisateur
         *          @password                   : password          : (Obligatoire) : Le mot de passe de l'utilisateur
         *          @repeatpassword             : repeat-password   : (Obligatoire) : Le mot de passe de l'utilisateur (confirmer le mot de passe)
         *          @text                       : login             : (Optionnel)   : L'identifiant de l'utilisateur (si vide, l'identifiant sera le mail)
         *          @text                       : first_name        : (Optionnel)   : Prénom de l'utilisateur
         *          @text                       : last_name         : (Optionnel)   : Nom de l'utilisateur
         *          @text                       : last_name         : (Optionnel)   : Nom de l'utilisateur
         *          @text|@url                  : url               : (Optionnel)   : Site web de l'utilisateur
         *          @text|@wp_editor|@textaera  : content           : (Optionnel)   : Description de l'utilisateur
         *
         *          Tous les autres champs seront entrées comme metas
         */
        </pre>

        <h2>Envoyer un e-mail (contact)</h2>

        <pre class="brush: php">
        /*    @fields :
         *          @Type de champ              : Nom du champ      : Obligatoire   : Description
         *
         *          @text                       : senderName        : (Obligatoire) : Le nom de l'expéditeur
         *          @text|@email                : email             : (Obligatoire) : L'email de l'expéditeur
         *          @text|@wp_editor|@textaera  : message           : (Obligatoire) : Le Message du mail
         *          @text                       : subject           : (Optionnel)   : Le sujet du mail
         *
         *          Tous les autres champs seront envoyés à la suite du message
         */
        </pre>

        <h2>Connexion</h2>

        <pre class="brush: php">
        /*    @fields :
         *          @Type de champ              : Nom du champ      : Obligatoire   : Description
         *
         *          @text                       : login             : (Obligatoire) : L'identifiant de connexion
         *          @password                   : password          : (Obligatoire) : Le mot de passe
         *          @checkbox                   : remember          : (Optionnel)   : Se souvenir de moi
         *
         *          Aucun autre champ ne sera pris en compte
         */
        </pre>

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