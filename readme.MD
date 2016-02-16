## Presentation

This plugin is made for WP theme developers, to create & style easily all theirs forms


## Installation

 ````
 cd wp-content/plugins/
 git clone https://github.com/xusifob/easy-form && git checkout dev
 ````

 Go in your Plugin's page in your back office and enable it


## Changelogs

### Version 0.6.0 (Still in developement) :
 * Crypt Password for new users when authentification by email is needed (In Progress)
 * Update the SQL queries to prepare them (In Progress)
 * Add an e-mail verification on sign un (Impossible to have 2 users with the same e-mail)
 * Add the possibility to sign in with id or e-mail
 * Add Facebook/Google login & Sign-in
 * Create a uniq id based on some fields ( sign up )
 * Add a full french/english documentation)
 * Add Unit Tests
 * Add textaera & file options (max width ...)
 * Add hooks with slug
 * Possibility to add a value in php in code (Id, post name...)


### Version 0.5.5 :
  * Remove functions.js
  * Add an impression cout & conversion count + stats
  * Put the form duplicate modal only on the index.php page
  * Update some CSS


### Version 0.5.4 :
 * Add Notification update
 * Add more english
 * Start work with trash & bulk actions
 * Add possibility to retrieve fields one by one
 * Update bug on wp_editor
 * Update error on wp_update_post
 * Update ajax calls on add.php
 * Update all scripts and put them in a wp_enqueue_scripts
 * Update preview page after a few bug with traduction
 * Add Abspath on each file
 * Remove jQuery-ui, use WordPress core jQuery-ui
 * Correct some bugs on form Id, form Redirection & errors.
 * Update plugin website
 * Add spinner when loading data
 * Add more documentation in JS
 * Update the ajax request not to load templates if they have already been loaded.
 * Add English translation in all fields rows
  * Add english translation in all fields (front office)


### Version 0.5.3 :
 * Add attachments to e-mail
 * Update htmlspecialcar on add.php
 * Remove bug on antispam
 * Remove add_action init on checkform (bug after WP Update ? )
 * Correct bug on redirection
 * Remove some bugs due to sanitization
 * Add English Language support for errors & Back-office

### Version 0.5.2 :
 * Update sanitization
 * Add scripts & css with wp_enqueue_scripts & wp_enqueue_styles
 * Remove jQuery (use WordPress' own jQuery)
 * Update more sanitization
 * Remove Mail() class (use phpmailer for all e-mails)

### Version 0.5.1 :
 * Add support for displaying a form with it's slug
 * Correct bug on select

### Version 0.5 :
 * Refactoring full add.php code
 * Refactor whole add.php code for better maintaining
 * Add Password Reset with form
 * Add Inscription with mail
 * Add Templates for mails
 * Add Template for errors
 * Add Antispam Detection

### Version 0.4 :
 * Update doc for radio button
 * Update file field
 * Add allowed extensions for file field
 * Add ACF field for gallery
 * Correct bug of duplicate
 * Modify on update file if there is no file
 * Correct bug on export
 * Add "order by" on select
 * Add support for multiples form in the same page
 * Add UniqId in WP_FORM
 * Add hooks (no doc)
 * Add taxonomy field select or hidden
 * Add Connexion User on inscription
 * Add var in url
 * fix bug on upload image
 * add max size file upload
 * Add Htmlspecialchar in fields (back)
 * Add htmlspecialchar in value (front)
 * Add ReadOnly Handle
 * Correct id form bug
 * Add do_action beforeConnexion


### Version 0.3 :

 * Update Error 'ID' on table
 * Update "Envoyer" value on modify form
 * Update "Action" value on modify form
 * Add Admin Scripts & Style only on the right pages
 * Add displayable fields
 * Correct bug on Select field
 * Correct bug on send values"
 * Correct bug on inscription
 * Correct permalink bug when form is initialised in function.php
 * Add support of file field in an user update
 * Correct Problem on radio
 * Add Taxonomy support
 * Add Class & id to form
 * Update bug on post type
 * Orthographe
 * Add @since annotations in documentation
 * Add Doc for the_form_field

### Version 0.2 :

 * Add Drag & Drop Function
 * Add Inputs errors
 * Add Duplicate Forms
 * Add Security Check using Nounce
 * Graphisms
 * Connexion error bug display
 * Password forgot form