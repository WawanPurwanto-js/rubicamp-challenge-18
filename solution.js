//ditantanan sebelumnya kita telah membuat database university
//buatlah sistem university didalam terminal mengguankan readline
//gunakan metode OOP(object oreinted programming) untung menyelesaikan tantangan kali ini
//keyword cli-table,readline,array,OOP,MVC



//mengaktifkan fungsi readline
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});;
//mengaktifkan fungsi ke database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('university.db');

//mengaktifkan fungsi tabel cli
const Table = require('cli-table');


//mengaktifkan fungsi pesan error pada koneki database
//let db = new sqlite3.Database('university.db', err => {
//  if (err) throw err;
// console.log('Koneksi database berhasil');

//});;

function LoginInterface() {
    console.log("======================================");
    console.log("Welcome to Universitas Pendidikan Indonesia");
    console.log("Jl.Setabudhi No.225");
    console.log("=================================");
    askUsername();
}

function askUsername() {
    rl.question('Username: ', (username) => {
        cekUsername(username, function (usernameExist) {
            if (usernameExist) {
                askPassword(username);
            } else {
                askUsername();
            }
        });
    })
}

function cekUsername(username, cb) {
    let sql = `SELECT * FROM account`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            cb(false);
        } else {
            cb(rows.filter(function (x) {
                return x.username == username;
            }).length > '0');
        }
    });
}


function askPassword(username) {
    rl.question('Password : ', (password) => {
        cekPassword(username, password, function (passwordExist) {
            if (passwordExist) {
                console.log(`welcome, ${username}.Your acces level is : ADMIN`);
                menuInterface();

            } else {
                askPassword(username);
            }
        })
    })
}

function cekPassword(username, password, cb) {
    let sql = `SELECT * FROM account`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            cb(false);
        } else {
            cb(rows.filter(function (x) {
                return x.username == username && x.password == password;
            }).length > 0);
        }
    });
}

function menuInterface() {
    console.log("============================");
    console.log("silahkan pilih opsi dibawah ini");
    console.log("[1] Mahasiswa");
    console.log("[2] Jurusan");
    console.log("[3] Dosen");
    console.log("[4] Mata Kuliah");
    console.log("[5] Kontrak");
    console.log("[6] Keluar");
    console.log("=======================");
    askMenu();
}


function askMenu() {
    rl.question('masukan salah satu no, dari opti di atas :', (pilih) => {
        cekMenu(pilih);
    });
}

function cekMenu(no) {
    switch (no) {
        case '1':
            mahasiswaInterface();
            break;
        case '2':
            JurusanInterface();

        case '3':
            dosenInterface();
            break;
        case '4':
            matakuliahInterface();

        case '5':
            kontrakInterface();
            break;
        case '6':
            LoginInterface();
            break;
        default:
            MenuInterface();
            break;

    }
}
//=========== KELOLA DATA MAHASISWA=============== 
//====================KELOLA DATA MAHASISWA========================

function mahasiswaInterface() {
    console.log("==================");
    console.log("silahkan pilih opsi dibawah ini");
    console.log("[1] Daftar Murid");
    console.log("[2] Cari Murid");
    console.log("[3] Tambah Murid");
    console.log("[4] Hapus Murid");
    console.log("[5] Kembali");
    console.log("=======================");
    askMahasiswaMenu();

}

function askMahasiswaMenu(no) {
    switch (no) {
        case '1':
            showMahasiswaList();
            break;
        case '2':
            searchMahasiswa();

        case '3':
            inputMahasiswa();
            break;
        case '4':
            askNimDelete();

        case '5':
            menuInterface();
            break;
        default:
            mahasiswaInterface();

    }
}

function showMahasiswaList() {
    let sql = 'SELECT FROM mahasiswa, jurusan WHERE mahasiswa.kode_jurusan = jurusan.kode_jurusan';
    db.all(sql, [], (err, rows) => {
        let table = new Table({
            head: ['NIM', 'Nama', 'Alamat', 'Jurusan']
        });
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            table.push([row.nim, row.nama_mahasiswa, row.alamat, row.nama_jurusan]);
        });
        console.log(table.toString());
        mahasiswaInterface();

    });
}

function searchMahasiswa() {
    console.log("===========");
    rl.question('Masukan NIM :', (nim) => {
        cekNimMahasiswa(nim);

    });

}

function cekNimMahasiswa(nim) {
    let sql = `SELECT * FROM mahasiswa, jurusan WHERE mahasiswa.kode_jurusan=jurusan.kode_jurusan AND nim =${nim}`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows.length > 0) {
            rows.forEach((row) => {
                console.log("============");
                console.log(`id:${row.nim}`);
                console.log(`id:${row.nama_mahasiswa}`);
                console.log(`id:${row.alamat}`);
                console.log(`id:${row.nama_jurusan}`);
            });
            mahasiswaInterface();
        } else {
            console.log(`mahasiswa dengan nim ${nim} tidak terdaftar`);
            searchMahasiswa();
        }
    });
}

function cekJurusan(nim, nama, jurusan) {
    let sql = `SELECT * FROM jurusan WHERE kode_jurusan= '${jurusan}'`;
    db.all(sql, [], (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            inputAlamatmahasiswa(nim, nama, jurusan);
        } else {
            let sql = 'SELECT * FROM jurusan';
            db.all(sql, [], (err, rows) => {
                console.log(`kode jurusan ${jurusan} tidak terdaftar ! \nsilahkan masukan kode yang terdaftar di bawah ini!`);
                let table = new Table({
                    head: ['kode Jurusan', 'Jurusan']
                })
                if (err) throw err;
                rows.forEach((row) => {
                    table.push([row.kode_jurusan, row.nama_jurusan]);
                });
                console.log(table.toString());
                inputJurusanMahasiswa(nim, nama);

            });
        }
    });
}

function inputNamaMahasiswa(nim) {
    rl.question('Nama :', (nama) => {
        inputJurusanMahasiswa(nim, nama);
    })
}

function inputJurusanMahasiswa(nim, nama) {
    rl.question('Jurusan : ', (jurusan) => {
        cekJurusan(nim, nama, jurusan);
    });
}

function inputAlamatmahasiswa(nim, nama, jurusan) {
    rl.question('Alamat:', (alamat) => {
        insertMahasiswa(nim, nama, jurusan, alamat);
    });
}

function insertMahasiswa(nim, nama, jurusan, alamat) {
    console.log("=====================");
    db.run(`INSERT INTO MAHASISWA(nim,nama_mahasiswa,alamat,kode_jurusan) VALUES(?,?,?,?)` [nim, nama, alamat, jurusan], function (err) {
        if (err) throw err;
        showMahasiswaList();
    });
}

function askNimDelete() {
    console.log("========");
    rl.question('Masukan Nim mahasiswa yang akan di hapus : ', (nim) => {
        deleteMahasiswa(nim);
    });
}

function deleteMahasiswa(nim) {
    db.run(`DELETE FROM mahasiswa WHERE nim = ?`, nim, function (err) {
        if (err) throw err;
        console.log(`mahasiswa dengan nim :${nim} telah di hapus`);
        console.log("=========");
        showMahasiswaList();
    });
}

//===========kelola data jurusan===============
//===========kelola data jurusan===============

function JurusanInterface() {
    console.log("===============");
    console.log("silahkan pilih opsi dibawah ini");
    console.log("[1]Daftar Jurusan");
    console.log("[2]cari jurusan");
    console.log("[3]tambah jurusan");
    console.log("[4] hapus jursuan");
    console.log("[5] kembali");
    console.log("===================");
    askJurusanMenu()

}

function askJurusanMenu() {
    rl.question("masukan salh satu no cari opsi di atas:", (pilih) => {
        cekJurusanMenu(pilih);
    });
}

function cekJurusanMenu(no) {
    switch (no) {
        case '1':
            showJurusansList();
            break;
        case '2':
            searchJurusan();
            break;
        case '3':
            inputJurusan();
            break;
        case '4':
            askJurusanDelete();
            break;
        case '5':
            menuInterface();
            break;
        default:
            JurusanInterface();
            break;
    }
}

function showJurusansList() {
    let sql = 'SELECT FROM jurusan';
    db.all(sql, [], (err, rows) => {
        let table = new Table({
            head: ['Kode Jurusan', 'Nama Jurusan']
        });
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            table.push([row.kode_jurusan, row.nama_jurusan]);
        });
        console.log(table.toString());
        JurusanInterface();
    });
}

function searchJurusan() {
    console.log("===============");
    rl.question('Masukan kode Jurusan:', (kode) => {
        cekKodeJurusan(kode);
    });

}

function cekKodeJurusan(kode) {
    let sql = `SELECT * FROM jurusan WHERE kode_jurusan='${kode}'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows.length > 0) {
            rows.forEach((row) => {
                console.log("====================");
                console.log(`Kode    : ${row.kode_jurusan}`);
                console.log(`Jurusan : ${row.nama_jurusan}`);
            });
            JurusanInterface();
        } else {
            console.log(`  Jurusan dengan nilai ${kode}   tidak terdaftar `);
            searchJurusan();
        }
    });
}

function inputJurusan() {
    console.log("=============");
    console.log("lengkapi data di bawah ini:");
    rl.question('Kode: ', (kode) => {
        inputNamaJurusan(kode);
    });


}

function inputNamaJurusan(kode) {
    rl.question('Nama:', (nama) => {
        insertJurusan(kode, nama);
    });
}

function insertJurusan(kode, nama) {
    console.log("=================");
    db.run(`INSERT INTO jurusan(kode_jurusan,nama_jurusan) VALUES (?,?)`, [kode, nama], function (err) {
        if (err) throw err;
        showJurusansList();
    })

}

function askJurusanDelete() {
    console.log("==========");
    rl.question('masukan kode jurusan yang akan di hapus :', (kode) => {
        deleteJurusan(kode);
    });
}

function deleteJurusan(kode) {
    db.run(`DELETE FROM jurusan WHERE kode_jurusan = ?`, kode, function (err) {
        if (err) throw err;
        console.log(`Jurusan dengan kode ${kode} telah di hapus`);
        console.log("==================================");
        showJurusansList();

    })

}


//===============kelola data dosen===========//
//===============kelola data dosen===========//


function dosenInterface() {
    console.log("===============");
    console.log("silahkan pilih opsi dibawah ini");
    console.log("[1]Daftar dosen");
    console.log("[2]cari dosen");
    console.log("[3]tambah dosen");
    console.log("[4] hapus dosen");
    console.log("[5] kembali");
    console.log("===================");
    askDosenMenu()

}

function askDosenMenu() {
    rl.question("Masukan salah satu no, cari opsi diatas: ", (pilih) => {
        cekDosenMenu(pilih);
    });
}

function cekDosenMenu(no) {
    switch (no) {
        case '1':
            showDosenList();
            break;
        case '2':
            searchDosen();
        case '3':
            inputDosen();
            break;
        case '4':
            askDosenDelete();
            break;
        case '5':
            menuInterface();
            break;
        default:
            dosenInterface();
            break;
    }
}

function showDosenList() {
    let sql = `SELECT * FROM dosen`;
    db.all(sql, [], (err, rows) => {
        let table = new Table({
            head: ['Kode Dosen', 'Nama Dosen']
        });
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            table.push([row.kode_dosen, row.nama_dosen]);
        });
        console.log(table.toString());
        dosenInterface();

    })
}

function searchDosen() {
    console.log("=================");
    rl.question('Masukan kode dosen: ', (kode) => {

        cekKodeDosen(kode);

    });
}


function cekKodeDosen(kode) {
    let sql = `SELECT * FROM dosen WHERE kode_dosen='${kode}'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows.length > 0) {
            rows.forEach((row) => {
                console.log("====================");
                console.log(`Kode    : ${row.kode_dosen}`);
                console.log(`Dosen : ${row.nama_dosen}`);
            });
            dosenInterface();
        } else {
            console.log(`Doseb dengan kode ${kode}   tidak terdaftar `);
            searchDosen();
        }
    });
}


function inputDosen() {
    console.log("===============");
    console.log("lengkapi data di bawah ini:");
    rl.question('kode:', (kode) => {
        inputNamaDosen(kode);
    })


}


function inputNamaDosen(kode) {
    rl.question('Nama: ', (nama) => {
        insertDosen(kode, nama);
    });
}

function insertDosen(kode, nama) {
    console.log("======================");
    db.run(`INSET INTO dosen(kode_dosen,nama_dosen) VALUES (?,?)`, [kode, nama], function (err) {
        if (err) throw err;
        showDosenList();
    });

}

function askDosenDelete() {
    console.log("===============");
    rl.question('masukan kode dosen yang akan di hapus: ', (kode) => {
        deleteDosen(kode);
    })

}

function deleteDosen(kode) {
    db.run(`DELETE FROM dosen WHERE kode_dosen = ?`, kode, function (err) {
        if (err) throw err;
        console.log(`Dosen dengan kode: ${kode} telah di hapus`);
        console.log("==================================");
        showDosenList();


    })
}

// //=====================kelola data mata kuliah==============
// ======================= kelola data kuliah===========

function matkulInterface() {
    console.log("==============================================");
    console.log("silahkan pilih opsi di bawah ini");
    console.log("[1] Daftar matkul");
    console.log("[2] Cari matkul");
    console.log("[3] Tambah matkul");
    console.log("[4] Hapus matkul");
    console.log("[5] Kembali");
    console.log("==============================================");
    askMatkulMenu();
}


function askMatkulMenu() {
    rl.question("Masukan salah satu no, cari opsi diatas: ", (pilih) => {
        cekMatkulMenu(pilih);
    });
}

function cekMatkulMenu(no) {
    switch (no) {
        case '1':
            showMatKulList();
            break;
        case '2':
            searchMatkul();
        case '3':
            inputMatKul();
            break;
        case '4':
            askMatKulDelete();
            break;
        case '5':
            menuInterface();
            break;
        default:
            matkulInterface();
            break;
    }
}

function showMatKulList() {
    let sql = `SELECT * FROM mata_kuliah`;
    db.all(sql, [], (err, rows) => {
        let table = new Table({
            head: ['Kode Mata Kuliah', 'Nama Mata Kuliah', 'SKS']
        });
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            table.push([row.kode_mk, row.nama_mk, row.sks]);
        });
        console.log(table.toString());
        matkulInterface();

    })
}

function searchMatkul() {
    console.log("=================");
    rl.question('Masukan kode mata kuliah: ', (kode) => {

        cekKodeMatkul(kode);

    });
}


function cekKodeMatkul(kode) {
    let sql = `SELECT * FROM mata_kuliah WHERE kode_mk='${kode}'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows.length > 0) {
            rows.forEach((row) => {
                console.log("====================");
                console.log(`Kode    : ${row.kode_mk}`);
                console.log(`mata kuliha : ${row.nama_mk}`);
            });
            matakulInterface();
        } else {
            console.log(`mata kuliah dengan kode ${kode}   tidak terdaftar `);
            searchMatkul();
        }
    });
}


function inputMatKul() {
    console.log("===============");
    console.log("lengkapi data di bawah ini:");
    rl.question('kode mata kuliah:', (kode) => {
        inputNamaMatKul(kode);
    })


}


function inputNamaMatKul(kode) {
    rl.question('Nama mata kuliah: ', (nama) => {
        inputsksMatkul(kode, nama);
    });
}

function inputsksMatkul(kode, nama) {
    rl.question('jumlah sks: ', (sks) => {
        insertMatkul(kode, nama, sks);
    });
}

function insertMatkul(kode, nama) {
    console.log("======================");
    db.run(`INSET INTO mata_kuliah(kode_mk,nama_mk,sks) VALUES (?,?)`, [kode, nama, sks], function (err) {
        if (err) throw err;
        showMatakuList();
    });

}

function askMatKulDelete() {
    console.log("===============");
    rl.question('masukan kode mata kuliah yang akan di hapus: ', (kode) => {
        deleteMatKul(kode);
    })

}

function deleteMatKul(kode) {
    db.run(`DELETE FROM mata_kuliah WHERE kode_mk = ?`, kode, function (err) {
        if (err) throw err;
        console.log(`mata kuliah  dengan kode: ${kode} telah di hapus`);
        console.log("==================================");
        showMatKulList();


    })
}


//============== kelola data kontrak============
//================ kelola data kontrak============

function KontrakInterface() {
    console.log("==============================================");
    console.log("silahkan pilih opsi di bawah ini");
    console.log("[1] Daftar kontrak");
    console.log("[2] Cari kontrak");
    console.log("[3] Tambah kontrak");
    console.log("[4] Hapus kontrak");
    console.log("[5] Kembali");
    console.log("==============================================");
    askKontrakMenu();
}

function askKontrakMenu() {
    rl.question("masukan salah satu no, dari opsi di atas", (pilih) => {
        cekKontrakMenu(pilih);
    })

}

function cekKontrakMenu(no) {
    switch (no) {
        case '1':
            showKontrakList();
            break;
        case '2':
            searchKontrak();
            break;
        case '3':
            inputKontrak();
            break;
        case '4':
            askKontrakDelete();
            break;
        case '5':
            menuInterface();
            break;
        default:
            kontrakInterface();
            break;



    }
}

function showKontrakList() {
    let sql = `SELECT FROM kontrak`;
    db.all(sql, [], (err, rows) => {
        let table = new Table({
            head: ['NIM', 'Kode Mata Kuliah', 'Kode Dosen', 'Nilai']
        });
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            table.push([row.nim, row.kode_mk.row.kode_dosen, row.nilai]);
        });
        console.log(table.toString());
        kontrakInterface();

    })

}

function searchKontrak() {
    console.log("================");
    rl.question('Masukin NIM:', (nim) => {
        cekNimKontrak(nim);
    });

}

function cekNimKontrak(nim) {
    let sql = `SELECT * FROM kontrak WHERE nim = ${nim}`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows.length > 0) {
            rows.forEach((row) => {
                console.log("====================");
                console.log(`NIM : ${row.nim}`);
                console.log(`kode mata kuliah :${row.kode_mk}`);
                console.log(`kode dosen :${row.kode_dosen}`);
                console.log(`nilai :${row.nilai}`);

            });
            kontrakInterface();
        } else {
            console.log(`kontrak dengan nilai ${nim} tidak terdaftar`);
            searchKontrak();

        }
    });
}

function inputKontrak() {
    console.log("===================");
    console.log("lengkapi data dibawah ini:");
    rl.question('NIM Mahasiswa: ', (nim) => {
        cekNim(nim);
    });

}

function cekNim(nim) {
    let sql = `SELECT * FROM mahasiswa WHERE nim = '${nim}`;
    db.all(sql, [], (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            inputKodeMkKontrak(nim);
        } else {
            let sql = `SELECT FROM mahasiswa`;
            db.all(sql, [], (err, rows) => {
                console.log(`Nim dengan no ${nim} tidak terdapatar! \nsilahkan masukan dengan nim yang terdaftar di bawah ini`);
                let table = new table({
                    head: ['Nim', 'Nama Mahasiswa']
                });
                if (err) throw err;
                rows.forEach((row) => {
                    table.push([row.nim, row.nama_mahasiswa]);
                });
                console.log(table.toString());
                inputKontrak();
            });
        }
    });
}

function inputKodeMkKontrak(nim) {
    rl.question('Kode Mata Kuliah: ', (kode) => {
        cekKodeMkKontrak(nim, kode);
    });
}

function cekKodeMkKontrak(nim, kodeMatkul) {
    let sql = `SELECT * FROM Mata_kuliah WHERE kode_mk = '${kodeMatkul}'`;
    db.all(sql, [], (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            inputKodeDosenKontrak(nim, kodeMatkul);
        } else {
            let sql = `SELECT * FROM mata_kuliah`;
            db.all(sql, [], (err, rows) => {
                console.log(`kode mata kuliah dengan no ${kodeMatkul} tidak terdaftar! \nsilahkan masukan dengan nim yang terdafar dibawah ini`);
                let table = new Table({
                    head: ['Kode Mata Kuliah', 'Nama Mata Kuliah']
                });
                if (err) throw err;
                rows.forEach((row) => {
                    table.push([row.kode_mk, row.nama_mk]);
                });
                console.log(table.toString());
                inputKodeMkKontrak(nim)

            });
        }
    });
}


function inputKodeDosenKontrak(nim, kodeMatkul) {
    rl.question('Kode Dosen :', (kode) => {
        cekKodeDosenKontrak(nim, kodeMatkul, kode);
    });
}

function cekKodeDosenKontrak(nim, kodeMatkul, kodeDosen) {
    let sql = `SELECT * FROM dosen WHERE kode_dosen = '${kodeDosen}'`;
    db.all(sql, [], (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            inputNilai(nim, kodeMatkul, kodeDosen);
        } else {
            let sql = `SELECT * FROM dosen`;
            db.all(sql, [], (err, rows) => {
                console.log(`kode dosen dengna no ${kodeDosen} tidak terdaftar ! \nsilahkan masukan dengan nim yang terdaftar di bawah ini`);
                let table = new Table({
                    head: ['Kode Dosen', 'Nama Dosen']
                });
                rows.forEach((row) => {
                    table.push([row.kode_dosen, row.nama_dosen])
                });
                console.log(table.toString());
                inputKodeDosenKontrak(nim, kodeMatkul);
            });
        }
    });
}


function inputNilai(nim, kodeMatkul, kodeDosen) {
    rl.question('Nilai:', (nilai) => {
        insertKontrak(nim, kodeMatkul, kodeDosen, nilai);
    });
}

function insertKontrak(nim, kodeMatkul, kodeDosen, nilai) {
    console.log("================");
    db.run(`INSERT INTO kontrak(nim,kode_mk,kode_dosen,nilai) VALUES (?,?,?,?)`,
        [nim, kodeMatkul, kodeDosen, nilai],
        function (err) {
            if (err) throw err;
            showKontrakList();
        });

}

function askKontrakDelete() {
    console.log("================");
    rl.question('masukan nim kontrak yang akan di hapus :', (nim) => {
        deleteKontrak(nim);
    });

}

function deleteKontrak(nim) {
    db.run('DELETE FROM kontrak WHERE Nim = ?', nim, function (err) {
        if (err) throw err;
        console.log(`mahasiswa dengan nim ${nim} telah dihapus`);
        console.log('============================');
        showKontrakList

    });
}

LoginInterface();