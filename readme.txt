=== Easy WP Form ===
Contributors: xusifob,baltazare
Donate link: http://bastienmalahieude.fr/
Tags: Forms, plugin, inscription, connexion, contact, css, style, easy
Requires at least: 4.0
Tested up to: 3.4
Stable tag: 4.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This plugin will help you easily to create, manage and display inscription, connexion or contact forms.
Here is a short description of the plugin.  This should be no more than 150 characters.  No markup here.

== Description ==

This plugin will help you to create front-end forms for Wordpress.

It contains different kinds of avaialble forms

* Inscription : You'll be available to sign up users on your website easily, you can ask for an e-mail confirmation ...
* Connexion : It will help you to sign in your users
* Contact : Create a contact form to send e-mails to whoever you want
* Reset/Retrieve Password : Forgot your password ? No problem, there is a form for that ! it can retrieve the password or create a new one depending on what you choose
* Create a new post or post type. If you want your users to be able to create post types from front end

Inspired by Symfony 2's form builder, this plugin is made by a developer for developers, it will allow you to get, display and style all your form fields easily.

If you have suggestion to improve it, feel free to contact me : contact@bastienmalahieude.fr

The Github Repository is available at this address : https://github.com/xusifob/easy-form

For improvement, you can pull request it

== Installation ==


1. Upload the plugin files to the `/wp-content/plugins/easy-form` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Settings->Plugin Name screen to configure the plugin
4. That's it, you can create your own forms


== Frequently Asked Questions ==

= Nobody has already asked any question =

Fell free to ask me a lot :)


== Screenshots ==

1. View of the form panel configuration
2. View of one sing up form created with the plugin

== Changelog ==

Incomming :
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

= 0.5.5 =
  * Remove functions.js
  * Add form stats
  * Put the form duplicate modal only on the index.php page
  * Update some CSS
  * Update preview page

= 0.5.4 =
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

= 0.5.3 =
 * Add attachments to e-mail
 * Update htmlspecialcar on add.php
 * Remove bug on antispam
 * Remove add_action init on checkform (bug after WP Update ? )
 * Correct bug on redirection
 * Remove some bugs due to sanitization
 * Add English Language support for errors & Back-office

 = 0.5.2 =
 * Update sanitization
 * Add scripts & css with wp_enqueue_scripts & wp_enqueue_styles
 * Remove jQuery (use WordPress' own jQuery)

= 0.5.1 =
 * Add support for displaying a form with it's slug
 * Correct bug on select

= 0.5 =
 * Refactoring full add.php code
 * Refactor whole add.php code for better maintaining
 * Add Password Reset with form
 * Add Inscription with mail
 * Add Templates for mails
 * Add Template for errors
 * Add Antispam Detection

= 0.4 =
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


= 0.3 =

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

= 0.2 =

 * Add Drag & Drop Function
 * Add Inputs errors
 * Add Duplicate Forms
 * Add Security Check using Nounce
 * Graphisms
 * Connexion error bug display
 * Password forgot form