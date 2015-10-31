<div role="tabpanel" class="tab-pane fade " id="hooks">
    <h2>Les Hooks</h2>

    <p>Les Hooks (ou ancres) permettent d'effectuer des actions à un certain moment de l'execution d'un script. Il en existe plusieurs sur ces formulaires qui permet d'agir lors de leur fonctionnement (pour traiter des données bien spécifiques ou effectuer une action après l'envoi du formulaire par exemple...)</p>

    <h3>Fonctionnement des hooks</h3>

    <p>Les fonctions prennent parfois des arguments, parfois non. tout ceci sera expliqué dans la documentation. Les arguments sont des données que l'on peut récupérer et traiter dans la fonction. Il est inutile qu'elle ne retournent quoi que ce soit, il ne sera pas utilisé.</p>

    <pre class="brush: php">
        &lt;?php
        add_action('myhook','myfunction');

        /**
         * @param $args tous les arguments de la fonction
         */
        function myfunction($args){
        // Action que l'on souhaite effectuer
        }
        ?>
    </pre>

    <p>Tous les hooks doivent être placés avant l'appel aux formulaires, sinon ils ne seront pas appelés</p>

    <pre class="brush: php">
        &lt;?php
        add_action('myhook','myfunction');

        function myfunction($postId){
            // Action que l'on souhaite effectuer
        }

        $form = new WP_Form(56);

        echo $form;
        ?>
    </pre>


    <h3>Ajouter un post</h3>
    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Nom du hook</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>form/BeforeInsertOrModifyPost</td>
            <td>$postId (id du post à modifier)</td>
            <td>Agis <strong>avant</strong> l'insertion ou la modification d'un post, quelque soit le formulaire utilisé</td>
        </tr>
        <tr>
            <td>form/BeforeInsertOrModifyPost-{{formId}}</td>
            <td>$postId (id du post à modifier)</td>
            <td>Agis <strong>avant</strong> l'insertion ou la modification d'un post. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        <tr>
            <td>form/BeforeModifyPost</td>
            <td>$postId (id du post à modifier)</td>
            <td>Agis uniquement <strong>avant</strong> la modification d'un post, quelque soit le formulaire utilisé</td>
        </tr>
        <tr>
            <td>form/BeforeInsertOrModifyPost-{{formId}}</td>
            <td>$postId (id du post à modifier)</td>
            <td>Agis uniquement <strong>avant</strong> la modification d'un post. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        <tr>
            <td>form/InsertOrModifyPost</td>
            <td>$postId (id du post à modifier)</td>
            <td>Agis <strong>après</strong> l'insertion ou la modification d'un post, quelque soit le formulaire utilisé</td>
        </tr>
        <tr>
            <td>form/InsertOrModifyPost-{{formId}}</td>
            <td>$postId (id du post à modifier)</td>
            <td>Agis <strong>après</strong> l'insertion ou la modification d'un post. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        <tr>
            <td>form/ModifyPost</td>
            <td>$postId (id du post à modifier)</td>
            <td>Agis uniquement <strong>après</strong> la modification d'un post, quelque soit le formulaire utilisé</td>
        </tr>
        <tr>
            <td>form/InsertOrModifyPost-{{formId}}</td>
            <td>$postId (id du post à modifier)</td>
            <td>Agis uniquement <strong>après</strong> la modification d'un post. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        </tbody>
    </table>

    <h3>Ajouter un post</h3>
    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Nom du hook</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>form/BeforeInsertOrModifyUser</td>
            <td>$userId (id de l'utilisateur à modifier)</td>
            <td>Agis <strong>avant</strong> l'insertion ou la modification d'un utilisateur, quelque soit le formulaire utilisé</td>
        </tr>
        <tr>
            <td>form/BeforeInsertOrModifyUser-{{formId}}</td>
            <td>$userId (id de l'utilisateur à modifier)</td>
            <td>Agis <strong>avant</strong> l'insertion ou la modification d'un utilisateur. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        <tr>
            <td>form/BeforeModifyUser</td>
            <td>$userId (id de l'utilisateur à modifier)</td>
            <td>Agis uniquement <strong>avant</strong> la modification d'un utilisateur, quelque soit le formulaire utilisé</td>
        </tr>
        <tr>
            <td>form/BeforeInsertOrModifyUser-{{formId}}</td>
            <td>$userId (id de l'utilisateur à modifier)</td>
            <td>Agis uniquement <strong>avant</strong> la modification d'un utilisateur. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        <tr>
            <td>form/InsertOrModifyUser</td>
            <td>$userId (id de l'utilisateur à modifier)</td>
            <td>Agis <strong>après</strong> l'insertion ou la modification d'un utilisateur, quelque soit le formulaire utilisé</td>
        </tr>
        <tr>
            <td>form/InsertOrModifyUser-{{formId}}</td>
            <td>$userId (id de l'utilisateur à modifier)</td>
            <td>Agis <strong>après</strong> l'insertion ou la modification d'un utilisateur. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        <tr>
            <td>form/ModifyUser</td>
            <td>$userId (id de l'utilisateur à modifier)</td>
            <td>Agis uniquement <strong>après</strong> la modification d'un utilisateur, quelque soit le formulaire utilisé</td>
        </tr>
        <tr>
            <td>form/InsertOrModifyUser-{{formId}}</td>
            <td>$userId (id de l'utilisateur à modifier)</td>
            <td>Agis uniquement <strong>après</strong> la modification d'un utilisateur. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        </tbody>
    </table>



    <h3>Envoi de mail </h3>
    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Nom du hook</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>form/BeforeSendMail</td>
            <td>aucun</td>
            <td>Agis <strong>avant</strong> d'envoyer un e-mail de contact quelque soit le formulaire utilisé.</td>
        </tr>
        <tr>
            <td>form/BeforeSendMail-{{formId}}</td>
            <td>aucun</td>
            <td>Agis <strong>avant</strong> d'envoyer un e-mail de contact. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
            <td></td>
        </tr>
        <tr>
            <td>form/SendMail</td>
            <td>aucun</td>
            <td>Agis <strong>après</strong> avoir envoyé un e-mail de contact quelque soit le formulaire utilisé.</td>
        </tr>
        <tr>
            <td>form/SendMail-{{formId}}</td>
            <td>aucun</td>
            <td>Agis <strong>après</strong> avoir envoyé un e-mail de contact. Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
        </tr>
        </tbody>
    </table>

    <h3>Connexion</h3>
    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Nom du hook</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>form/BeforeConnectUser</td>
            <td>$creds (tableau comportant user_login, user_password et remember)</td>
            <td>Agis <strong>avant</strong> de connecter un utilisateur quelque soit le formulaire utilisé.</td>
        </tr>
        <tr>
            <td>form/BeforeConnectUser-{{formId}}</td>
            <td>$creds (tableau comportant user_login, user_password et remember)</td>
            <td>Agis <strong>avant</strong> de connecter un utilisateur Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
            <td></td>
        </tr>
        <tr>
            <td>form/ConnectUser</td>
            <td>$userId (l'id de l'utilisateur connecté)</td>
            <td>Agis <strong>après</strong> avoir connecté un utilisateur quelque soit le formulaire utilisé.</td>
            <td></td>
        </tr>
        <tr>
            <td>form/ConnectUser-{{formId}}</td>
            <td>$userId</td>
            <td>Agis <strong>après</strong> avoir connecté un utilisateur Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
            <td></td>
        </tr>
        </tbody>
    </table>

    <h3>Connexion</h3>
    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Nom du hook</th>
            <th>Arguments</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>form/BeforeResetPassword</td>
            <td>aucun</td>
            <td>Agis <strong>avant</strong> de réinitialiser un mot de passe quelque soit le formulaire utilisé.</td>
        </tr>
        <tr>
            <td>form/BeforeResetPassword-{{formId}}</td>
            <td>aucun</td>
            <td>Agis <strong>avant</strong> de réinitialiser un mot de passe Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
            <td></td>
        </tr>
        <tr>
            <td>form/ResetPassword</td>
            <td>aucun</td>
            <td>Agis <strong>après</strong> avoir réinitialiseé un mot de passe quelque soit le formulaire utilisé.</td>
            <td></td>
        </tr>
        <tr>
            <td>form/ResetPassword-{{formId}}</td>
            <td>aucun</td>
            <td>Agis <strong>après</strong> avoir réinitialiseé un mot de passe Remplacer {{formId}} par l'id d'un formulaire permet de cibler celui là spécifiquement.</td>
            <td></td>
        </tr>
        </tbody>
    </table>
</div>