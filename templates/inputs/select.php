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
                <a href="#" class="move" data-field="<?php echo $i-1; ?>">Copier sur un autre formulaire</a>
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
        <div class="options-fieldId">

        </div>
    </div>
</div>

<div class="row">
    <div class="col-sm-12">
        <label>Options</label>
    </div>
</div>
<div class="row form-group">
    <div class="col-sm-4">
        <div class="form-group">
            <input type="text" name="field[fieldId][form-id]" class="form-control" placeholder="Id du champ"/>
        </div>
        <div class="form-group">
            <input type="text" name="field[fieldId][form-class]" class="form-control" placeholder="Class du champ"/>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="form-group">
            <input type="text" name="field[fieldId][form-label]" class="form-control" placeholder="Label"/>
        </div>
        <div class="form-group">
            <input type="text" name="field[fieldId][form-label-class]" class="form-control" placeholder="Class du label"/>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="form-group">
            <input type="checkbox" id="field[fieldId][form-required]" name="field[fieldId][form-required]" value="1" checked/> <label for="field[fieldId][form-required]" class="label-checkbox"> Required</label>
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
<div class="row option-select" id="option-selectfieldId-1">
    <div class="col-sm-4">
        <div class="form-group">
            <input type="text" id="field[fieldId][form-select-option-name][1]" name="field[fieldId][form-select-option][1][name]" placeholder="Nom de l\'option" class="form-control" required/>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="form-group">
            <input type="text" id="field[fieldId][form-select-option-name][1]" name="field[fieldId][form-select-option][1][value]" placeholder="Valeur de l\'option" class="form-control" required/>
        </div>
    </div>
    <div class="col-sm-3">
        <input type="radio" id="field[fieldId][form-select-option-selected][1]" name="field[fieldId][form-select-option-selected]" value="1"  class="form-control" required/>
        <label for="field[fieldId][form-select-option-selected][1]" class="label-checkbox">Ce champ est séléctionné</label>
    </div>
    <div class="col-sm-1">
        <a href="#" data-field="fieldId" data-option="1" class="upanddown removeoption">×</a>
    </div>
</div>
<button class="button button-primary button-large left" data-action="add-option" data-field="1" type="button">Ajouter une option</button>
<hr>
