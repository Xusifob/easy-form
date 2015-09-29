<div role="tabpanel" class="tab-pane fade " id="kinds-of-forms">
    <h2>Ajouter un post</h2>

    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Type de champ</th>
            <th>Nom du champ</th>
            <th>Obligatoire</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>text</td>
            <td>title</td>
            <td>Obligatoire</td>
            <td>Le titre du post</td>
        </tr>
        <tr>
            <td>text | wp_editor | textaera</td>
            <td>content</td>
            <td>Optionnel</td>
            <td>Le contenu du post</td>
        </tr>
        </tbody>
    </table>
    <p>Liste de tous les champs possibles par type de formulaires. (Depuis la V 0.4, les champs ne sont pas obligatoires à la modification)</p>

    <h2>Ajouter un utilisateur</h2>
    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Type de champ</th>
            <th>Nom du champ</th>
            <th>Obligatoire</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>email</td>
            <td>email</td>
            <td>Obligatoire</td>
            <td>Le mail de l'utilisateur</td>
        </tr>
        <tr>
            <td>password</td>
            <td>password</td>
            <td>Obligatoire</td>
            <td>Le mot de passe de l'utilisateur</td>
        </tr>
        <tr>
            <td>repeatpassword</td>
            <td>repeat-password </td>
            <td>Obligatoire</td>
            <td>Le mot de passe de l'utilisateur (confirmer le mot de passe)</td>
        </tr>
        <tr>
            <td>text</td>
            <td>login</td>
            <td>Optionnel</td>
            <td>L'identifiant de l'utilisateur (si vide, l'identifiant sera le mail)</td>
        </tr>
        <tr>
            <td>text</td>
            <td>first_name</td>
            <td>Optionnel</td>
            <td>Prénom de l'utilisateur</td>
        </tr>
        <tr>
            <td>text</td>
            <td>last_name</td>
            <td>Optionnel </td>
            <td>Nom de l'utilisateur</td>
        </tr>
        <tr>
            <td>text</td>
            <td>last_name</td>
            <td>Optionnel</td>
            <td>Nom de l'utilisateur</td>
        </tr>
        <tr>
            <td>text|@url</td>
            <td>url</td>
            <td>Optionnel </td>
            <td>Site web de l'utilisateur</td>
        </tr>
        <tr>
            <td>text|wp_editor|textaera</td>
            <td>content</td>
            <td>Optionnel </td>
            <td>Description de l'utilisateur</td>
        </tr>
        </tbody>
    </table
    <p>Tous les autres champs seront entrées comme metas</p>


    <h2>Envoyer un e-mail (contact)</h2>

    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Type de champ</th>
            <th>Nom du champ</th>
            <th>Obligatoire</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>text</td>
            <td>senderName</td>
            <td>Obligatoire</td>
            <td>Le nom de l'expéditeur</td>
        </tr>
        <tr>
            <td>text|email</td>
            <td>email</td>
            <td>Obligatoire</td>
            <td>L'email de l'expéditeur</td>
        </tr>
        <tr>
            <td>text|wp_editor|textaera</td>
            <td>message</td>
            <td>Obligatoire</td>
            <td>Le Message du mail</td>
        </tr>
        <tr>
            <td>text</td>
            <td>subject</td>
            <td>Optionnel</td>
            <td>Le sujet du mail</td>
        </tr>
        </tbody>
    </table>
    <p>Tous les autres champs seront envoyés à la suite du message</p>


    <h2>Connexion</h2>

    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Type de champ</th>
            <th>Nom du champ</th>
            <th>Obligatoire</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>text</td>
            <td>login</td>
            <td>Obligatoire</td>
            <td>L'identifiant de connexion</td>
        </tr>
        <tr>
            <td>password</td>
            <td>password</td>
            <td>Obligatoire</td>
            <td>Le mot de passe</td>
        </tr>
        <tr>
            <td>checkbox</td>
            <td>remember</td>
            <td>Optionnel</td>
            <td>Se souvenir de moi</td>
        </tr>
        </tbody>
    </table>

    <p>Aucun autre champ ne sera pris en compte</p>



    <h2>Reset Password</h2>

    <table class="table table-striped table-bordered">
        <thead>
        <tr>
            <th>Type de champ</th>
            <th>Nom du champ</th>
            <th>Obligatoire</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>text</td>
            <td>login</td>
            <td>Obligatoire</td>
            <td>Login de l'utilisateur pour retrouver le mot de passe</td>
        </tr>
        </tbody>
    </table>

    <p>Aucun autre champ ne sera pris en compte</p>
</div>