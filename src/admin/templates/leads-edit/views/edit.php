<?php

global $post;

$lead = new EF_Lead($post->ID);
$form = new WP_Form($post->post_parent);

$form->get_field('_nonce');
$form->get_field('_time');
$form->get_field('submit');
$form->get_field('_antispam');
$form->get_field('_uniqid');

?>
<div class="ef-content">
    <table class="ef-table">
        <tr class="ef-table--separator">
            <td class="ef-table-content">
                <?php foreach($form->get_fields() as $input) { ?>
                    <?php ob_start(); ?>
                    <div class="ef-input">
                        <div>
                            <strong>
                                <label><?php echo $input->getName(); ?></label>
                            </strong>
                        </div>
                        <?php $label = ob_get_clean(); ?>
                        <?php if(!($after = $input->getSetting('label-after'))) { ?>
                            <?php echo $label; ?>
                        <?php } ?>
                        <?php $input->addAttribute('class',"form-control");
                        $name = $input->getName();
                        $input->addAttribute('value',$lead->getValue($name));
                        $input->addAttribute('name',"lead_data[$name]"); ?>
                        <?php echo $input->getInput(); ?>
                        <?php if($after) { ?>
                            <?php echo $label; ?>
                        <?php } ?>
                    </div>
                <?php } ?>

            </td>
        </tr>

        </tr>

    </table>
</div>
