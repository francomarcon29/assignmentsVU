// Alphabetic sorting, source: https://stackoverflow.com/questions/3160277/jquery-table-sort
$('th').click(function () {
    const table = $(this).parents('.models').eq(0);
    const rows = table.find('.bodyRows:gt(0)').toArray().sort(comparer($(this).index()));
    this.asc = !this.asc;

    if (!this.asc) {
        rows.reverse();
    }

    for (let i = 0; i < rows.length; i++) {
        table.append(rows[i]);
    }
});

function comparer(index) {
    return function (a, b) {
        const valA = getCellValue(a, index), valB = getCellValue(b, index);

        return valA.toString().localeCompare(valB);
    }
}

function getCellValue(row, index) {
    return $(row).children('td').eq(index).text();
}

// Fetch model table data on page load
function getModels() {
    const tableBody = $('.models').find('tbody');

    $.ajax({
        url: 'https://wt.ops.labs.vu.nl/api22/d1556c44',
        method: 'GET',
    }).done(function (data) {
        data.forEach(model => {
            tableBody.append(`
                <tr class='bodyRows'>
                    <td>${model.brand}</td>
                    <td>${model.model}</td>
                    <td>${model.os}</td>
                    <td>${model.screensize}</td>
                    <td><img alt='${model.brand} ${model.model}' src='${model.image}' class='phone-img'></td>
                </tr>
             `);
        });
    });
}

$(getModels);

// Submit new model, get it and prevent following form link
$('#model-form').submit(function (e) {
    const tableBody = $('.models').find('tbody');
    e.preventDefault();
    $.ajax({
        url: 'https://wt.ops.labs.vu.nl/api22/d1556c44',
        method: 'POST',
        data: $('#model-form').serialize(),
    }).done(function (data) {
        $.ajax({
            url: data.URI,
            method: 'GET',
        }).done(function (data) {
            tableBody.append(`
                <tr class='bodyRows'>
                    <td>${data.brand}</td>
                    <td>${data.model}</td>
                    <td>${data.os}</td>
                    <td>${data.screensize}</td>
                    <td><img alt='${data.brand} ${data.model}' src='${data.image}' class='phone-img'></td>
                </tr>
            `);
        }).done(function () {
            $('.inputForm').val('');
        });
    });
});

$('#db-reset').submit(function (e) {
    const tableBody = $('.models').find('tbody');
    e.preventDefault();
    $.ajax({
        url: 'https://wt.ops.labs.vu.nl/api22/d1556c44/reset',
        method: 'GET',
    }).done(function () {
        tableBody.empty();

        getModels();
    });
});