<div class="ef-content">
    <div class="spinner-container" id="spinner-fields">
        <div class="spinner"></div>
    </div>
    <div id="fld">
    </div>
    <div class="row">
        <div class="col-xs-9">
            <div class="col-xs-12">
                <p id="possible-fields-label" ><strong><?php _e('Possible fields available for this type of form : ','easy-form'); ?></strong></p>
                <p id="possible-fields"></p>
            </div>
        </div>
        <div class="col-xs-2">
            <button class="button button-primary button-large right button-add" data-action="add" type="button">
                <?php _e('Add a field', 'easy-form'); ?>
            </button>
        </div>
    </div>
</div>
<script type="text/template" id="possible-field">
    <button type="button" class="button button-secondary" data-action="add-possible-field" ></button>
</script>