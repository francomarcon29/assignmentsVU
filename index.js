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

// {
//     "id": 22926,
//     "brand": "Apple",
//     "model": "iPhone X",
//     "os": "iOS",
//     "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_X_vector.svg/440px-IPhone_X_vector.svg.png",
//     "screensize": 5
// }

$(function() {
    const tableBody = $('.models').find('tbody');

    $.ajax({
        url: "https://wt.ops.labs.vu.nl/api22/d1556c44", 
        method: "GET",
        
     })
     .done(function(data) {
         data.forEach(model => {
             tableBody.append(`<tr class="bodyRows"><td>${model.brand}</td><td>${model.model}</td><td>${model.os}</td><td>${model.screensize}</td><td><img alt="${model.brand} ${model.model}" src="${model.image}" class="phone-img"></td></tr>`)
         });
     });
});

// Prevent following form link
$('#model-form').submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: 'https://wt.ops.labs.vu.nl/api22/d1556c44',
        type: 'post',
        data: $('#model-form').serialize(),
        success: function(data) {
            const json = $.parseJSON(data);
            console.dir(json);
        }
    });
});

/*

var mylist = $('#myUL');
var listitems = mylist.children('li').get();
listitems.sort(function(a, b) {
   return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
})
$.each(listitems, function(idx, itm) { mylist.append(itm); });




*/


