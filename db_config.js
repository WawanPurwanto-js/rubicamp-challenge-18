// const sqlite3 = require('sqlite3').verbose();

// // //const dbFile = __dirname + "./university.db"/

// // //let db = new sqlite3.database(dbFile, sqlite3.OPEN_READWRITE, (err) => {

// //     if (err) throw err;
// //     console.log("koneksi ke database berhasil");

// // })  
// const db = new sqlite3.Database('./university.db', (err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('Connected to university database.');
// });




//let db = new sqlite3.Databae(dbFile, sqlite3.OPEN_READWRITE, (err) => {
//  if (err) throw err;
//console.log("KOneksi ke database berhasil");


//});;

const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "./university.db";

let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    console.log("Koneksi ke database berhasil!");
});

module.exports = db;