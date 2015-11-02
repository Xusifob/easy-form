<?php
$relPath = plugins_url() . '/easy-form/';

$output = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">';
$output .= '  <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">';
//$output .= '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>';
$output .= '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>';
$output .= '<link rel="stylesheet" href="' . $relPath . 'library/css/style.css">';
$output .= '<link rel="stylesheet" href="' . $relPath . 'library/css/shCore.css">';
$output .= '<link rel="stylesheet" href="' . $relPath . 'library/css/shThemeDefault.css">';
/*$output .= '<script src="' . get_bloginfo('wpurl') . '/wp-content/plugins/tour-booking/js/bootstrap-datepicker.min.js"></script>';
$output .= '<script src="' . get_bloginfo('wpurl') . '/wp-content/plugins/tour-booking/js/bootstrap-datepicker.fr.min.js"></script>';

$output .= '<link rel="stylesheet" href="' . get_bloginfo('wpurl') . '/wp-content/plugins/tour-booking/styles/bootstrap-datepicker3.standalone.min.css">'; */
$output .= '<script src="' . $relPath . 'library/js/shCore.js"></script>';
$output .= '<script src="' . $relPath . 'library/js/shBrushJScript.js"></script>';
$output .= '<script src="' . $relPath . 'library/js/shBrushPhp.js"></script>';
$output .= '<script src="' . $relPath . 'library/js/functions.js"></script>';
$output .= '  <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>';

$output .= '<!-- Finally, to actually run the highlighter, you need to include this JS on your page -->
<script type="text/javascript">
     SyntaxHighlighter.all()
</script>';
echo $output;