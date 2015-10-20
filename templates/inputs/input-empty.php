<?php
$inputs = [
    'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'select', 'radio', 'url', 'range', 'color', 'search', 'hidden','file','textarea','taxonomy','wp_editor','open container','close container', 'close all container',
];
?>
<div class="row form-group" id="field-fieldId">
    <hr>
    <div class="col-sm-12">
        <div class="row form-group">
            <div class="col-sm-1">
                <div class="row">
                    <div class="col-xs-6">
                        <strong class="field-number">fieldId</strong>
                    </div>
                    <div class="col-xs-6">
                        <a href="#" class="up upanddown" data-field="fieldId">↑</a>
                        <a href="#" class="down upanddown" data-field="fieldId">↓</a>
                    </div>
                </div>
            </div>
            <div class="col-sm-7">
                <label for="field[fieldId][form-name]">Nom du champ</label>
                <input type="text"  value="field-name" name="field[fieldId][form-name]" id="field[fieldId][form-name]" class="form-control" placeholder="Nom du champ" required/>
                <a href="#" class="dupliquer" data-field="fieldId">Dupliquer</a>
                <a href="#" class="move" data-field="fieldId">Copier sur un autre formulaire</a>
            </div>
            <div class="col-sm-3">
                <label for="field[fieldId][form-type]">Type de champ</label>
                <select name="field[fieldId][form-type]" class="form-control" id="field[fieldId][form-type]" data-field="fieldId">
                    <?php foreach($inputs as $val){ ?>
                        <option value="<?php echo str_replace(' ', '_',$val); ?>"><?php echo $val; ?></option>
                    <?php } ?>
                </select>
            </div>
            <div class="col-sm-1">
                <a href="#" data-field="fieldId" class="delete upanddown">×</a>
                <a href="#" data-field="fieldId" class="open upanddown">+</a>
            </div>
        </div>
        input-content
    </div>
</div>