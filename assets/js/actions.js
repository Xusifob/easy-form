// Au changement du form type
$('body').on('change','select[name$="form-type]"]',function(){
    // Kind of field
    var type = $(this).val();
    var id = $(this).attr('data-field');
    var name = $('body input[name="field['+ id +'][form-name]"]').val();

    var input = getInput({
        type : type,
        id : id,
        name : name
    });
    // Replace the datas
    getData(input).done(function(data){
        $('#field-' + id).replaceWith(data);

        handleHiddenFields(id,type);

        // Open the field
        $('a[data-field="'+ id +'"].open').click();
    });

});

// Ajout d'un champ
$('button[data-action="add"]').on('click',function(){
    $('.minify').each(function(){
        $(this).click();
    });

    var input = getInput({
        type : 'text',
        id : (fieldIncrement+1),
        name : ''
    });

    displayData(input,true);

    nbfield++;
});


$('body')
    .on('click','.delete',function(){
        var id = parseInt($(this).attr('data-field'));
        $("#field-" + id).remove();
        for (var j=id+1;j<=nbfield;j++)
            updateIds($('#field-' + j),j,j-1);
        nbfield--;

        return false;


    }).on('click','.minify',function(){

        var id = $(this).attr('data-field');

        $('.options-'+ id ).hide(200);
        $(this)
            .removeClass('minify')
            .addClass('open')
            .html('+');
        return false;


    }).on('click','.open',function(){
        var id = parseInt($(this).attr('data-field'));
        $('.options-'+ id ).show(200);
        $(this)
            .removeClass('open')
            .addClass('minify')
            .html('-')
        ;
        return false;

    })
    .on('click','.up',function(){
        var id = parseInt($(this).attr('data-field'));
        if(id != 1)
            switchIds(id,id-1);

        return false;
    })
    .on('click','.down',function(){
        var id = parseInt($(this).attr('data-field'));
        if(id != nbfield)
            switchIds(id,id+1);

        return false;
    })
    .on('click','.dupliquer',function(){
        var id = parseInt($(this).attr('data-field'));

        var thefield = $('#field-' + id);

        var clonedField = thefield.clone();
        $('div[id="field-' + nbfield + '"]').after(clonedField);

        updateIds(clonedField,id,(nbfield+1));

        var val = $('select[name="field['+ id +'][form-type]"]').val();

        $('select[name="field['+ (nbfield+1) +'][form-type]"]').val(val);
        clonedField.draggable(DraggableArgs);
        nbfield++;
        return false;
    })
    .on('click','button[data-action="add-option"]',function(){

        var id = parseInt($(this).attr('data-field'));

        var nbOptions = $('.option-select').length +1;

        $(this).before(
            '<div class="row option-select" id="option-select'+ id +'-'+ nbOptions +'">' +
            '<div class="col-sm-4">' +
            '<div class="form-group">' +
            '<input type="text" id="field['+ id +'][form-select-option-name]['+ nbOptions +']" name="field['+ id +'][form-select-option]['+ nbOptions +'][name]" placeholder="Nom de l\'option" class="form-control" required/>' +
            '</div>' +
            '</div>' +
            '<div class="col-sm-4">' +
            '<div class="form-group">' +
            '<input type="text" id="field['+ id +'][form-select-option-name]['+ nbOptions +']" name="field['+ id +'][form-select-option]['+ nbOptions +'][value]" placeholder="Valeur de l\'option" class="form-control" required/>' +
            '</div>' +
            '</div>' +
            '<div class="col-sm-3">' +
            '<input type="radio" id="field['+ id +'][form-select-option-selected]['+ nbOptions +']" name="field['+ id +'][form-select-option-selected]" value="'+ nbOptions +'"  class="form-control" required/>' +
            '<label for="field['+ id +'][form-select-option-selected]['+ nbOptions +']" class="label-checkbox">Ce champ est séléctionné</label>' +
            '</div>' +
            '<div class="col-sm-1">' +
            '<a href="#" data-field="'+ id +'" data-option="'+ nbOptions +'" class="upanddown removeoption">×</a>' +
            '</div>' +
            '</div>'
        );
    })
    .on('click','.removeoption',function(){
        var id = parseInt($(this).attr('data-field'));
        var option = parseInt($(this).attr('data-option'));

        $('#option-select'+ id +'-'+ option).empty();


        return false;
    })
    .on('keyup','input[name$="form-container-class]"]',function(){
        var id = parseInt($(this).attr('data-field'));
        var input = $('input[name="field['+ id +'][form-name]"');
        input.val($(this).val());
    })
    .on('change','select[name$="[form-taxonomy]"]',function(){
        var id = parseInt($(this).attr('data-field'));

        var val = $(this).val();

        $('input[name="field['+ id +'][form-name]"]').val('taxonomy_'+ val);
    });