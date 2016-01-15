<?php
$inputs = [
    'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'select', 'radio', 'url', 'range', 'color', 'search', 'hidden','file','textarea','taxonomy','wp_editor','open container','close container', 'close all container',
];
?>
<div class="options-fieldId" style="display: none;">
    <div class="row">
        <div class="col-sm-12">
            <label>Options</label>
        </div>
    </div>
    <div class="row form-group">
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-id]" class="form-control" value="field-id" placeholder="Id du champ"/>
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-class]" class="form-control" value="field-class" placeholder="Class du champ"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label]" class="form-control" value="field-label" placeholder="Label"/>
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label-class]" class="form-control" value="field-clas-label" placeholder="Class du label"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-required]" name="field[fieldId][form-required]" value="1" field-required-selected/> <label for="field[fieldId][form-required]" class="label-checkbox"> Required</label>
            </div>
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-label-after]" name="field[fieldId][form-label-after]" value="1"/> <label for="field[fieldId][form-label-after]" class="label-checkbox">Placer le label après le champ</label>
            </div>
        </div>
    </div>
    <label for="form-order-by">Trier les champs par</label>
    <div class="row form-group">
        <div class="col-sm-4">
            <select name="field[fieldId][form-order-by]" id="field[fieldId][form-order-by]" class="form-control">
                <option value="default">Défaut</option>
                <option value="croissant">Croissant</option>
                <option value="décroissant">Décroissant</option>
            </select>
        </div>
    </div>
    <label>Options du select</label>
    optionsFields
    <button class="button button-primary button-large left" data-action="add-option" data-field="fieldId" type="button">Ajouter une option</button>
    <hr>
</div>
