// var Table = require('cli-table');

// // instantiate
// var table = new Table({
//     head: ['TH 1 label', 'TH 2 label'],
//     colWidths: [100, 200]
// });

// // table is an Array, so you can `push`, `unshift`, `splice` and friends
// table.push(
//     ['First value', 'Second value'], ['First value', 'Second value']
// );

// console.log(table.toString());


// untuk membuat vertical Tables
// var Table = require('cli-table');
// var table = new Table();

// table.push({
//     'Some key': 'Some value'
// }, {
//     'Another key': 'Another value'
// });

// console.log(table.toString());


///untuk membuat cross table
var Table = require('cli-table');
var table = new Table({
    head: ["", "Top Header 1", "Top Header 2"]
});

table.push({
    'Left Header 1': ['Value Row 1 Col 1', 'Value Row 1 Col 2']
}, {
    'Left Header 2': ['Value Row 2 Col 1', 'Value Row 2 Col 2']
});

console.log(table.toString());