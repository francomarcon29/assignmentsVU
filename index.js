$('th').click(function(){
    var table = $(this).parents('.models').eq(0)
    var rows = table.find('.bodyRows:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index){ return $(row).children('td').eq(index).text() }
/*

var mylist = $('#myUL');
var listitems = mylist.children('li').get();
listitems.sort(function(a, b) {
   return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
})
$.each(listitems, function(idx, itm) { mylist.append(itm); });




*/


