/**
 *
 * Permet de remplacer toutes les occurences d'une chaine dans une chaine par une autre chaine
 *
 * @param data
 * @param find
 * @param replace
 * @returns {*}
 */
function replace(data,find,replace){
    var re = new RegExp(find, 'g');
    return data.replace(re,replace);
}