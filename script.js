const bookshelf = [];
const RENDER_EVENT = 'render-buku';

function generatedId(){
    return +new Date();
}

function generateBukuObject(id, title, author,year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
}

function findBuku(bukuId){
    for (const bukuItem of bookshelf){
        if (bukuItem.id===bukuId){
            return bukuItem;
        }
    }
    return null;
}

function findIndexBuku(bukuId){
    for (const index in bookshelf){
        if (bookshelf[index].id === bukuId){
            return index;
        }
    }
    return -1;
}

function makeBuku(bukuObject){
    const {id, title, author, year, isCompleted} = bukuObject;
    const judulTeks = document.createElement('h3');
    judulTeks.innerText = title;

    const authorTeks = document.createElement('p');
    authorTeks.innerText = ('Nama Penulis : ')+author;

    const tahunTeks = document.createElement('p');
    tahunTeks.innerText = ('Tahun Terbit : ')+year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    
    textContainer.append(judulTeks, authorTeks, tahunTeks );
  
    const container = document.createElement('div');
    container.classList.add('item');
    container.append(textContainer);
    container.setAttribute('id', `buku-${id}`);

    if (isCompleted){
        const tombolUndo = document.createElement('button');
        tombolUndo.classList.add('undo');
        tombolUndo.innerText='Belum Dibaca Deh!!';
        tombolUndo.addEventListener('click', function(){
            undoBukuSelesai(id);
        });

        const tombolHapus = document.createElement('button');
        tombolHapus.classList.add('hapus');
        tombolHapus.innerText='Hapus Bacaan..';
        tombolHapus.addEventListener('click', function(){
            hapusBukuSelesai(id);
        });

        container.append(tombolUndo,tombolHapus)
    } else {
        const tombolHapus = document.createElement('button');
        tombolHapus.classList.add('hapus');
        tombolHapus.innerText='Hapus Bacaan..';
        tombolHapus.addEventListener('click', function(){
            hapusBukuSelesai(id);
        });
        const tombolBaca = document.createElement('button');
        tombolBaca.classList.add('baca');
        tombolBaca.innerText='Sudah Dibaca!!';
        tombolBaca.addEventListener('click', function(){
            bacaBuku(id);
        });
        container.append(tombolHapus,tombolBaca);
    }
    const garisContainer = document.createElement('hr');
    container.append(garisContainer);
    return container;
}

function addBuku()  {
    const judulTeks = document.getElementById('title').value;
    const authorTeks = document.getElementById('author').value;
    const tahunTeks = document.getElementById('year').value;
    const generatedID = generatedId();
    const bukuObject = generateBukuObject(generatedID, judulTeks, authorTeks, tahunTeks, false);
    bookshelf.push(bukuObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Buku "+judulTeks+" berhasil di tambahkan!!");
}

function bacaBuku(bukuId){
    const bukuTarget = findBuku(bukuId);
    if (bukuTarget == null)return;
    bukuTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Buku "+bukuTarget.title+" berhasil di tambahkan ke bagian Sudah Dibaca!!");
}

function hapusBukuSelesai(bukuId){
    const judul = findBuku(bukuId);
    const bukuTarget = findIndexBuku(bukuId);
    if (bukuTarget === -1)return;
    const hapus = confirm("Yakin ingin menghapus buku "+judul.title+" dari Bookshelf??");
    if(hapus){
        bookshelf.splice(bukuTarget,1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        alert("Buku "+judul.title+" berhasil dihapus!!");
    }
}

function undoBukuSelesai(bukuId){
    const bukuTarget = findBuku(bukuId);
    if (bukuTarget == null)return;
    bukuTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Buku "+bukuTarget.title+" berhasil di kembalikan ke Belum Dibaca!!");
}


document.addEventListener('DOMContentLoaded',function(){
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBuku();
    });
});

const cariBuku = document.getElementById('cariJudul');
cariBuku.addEventListener('keyup', function() {
const cariJudul = document.getElementById('cariJudul').value;
const filterCari = bookshelf.filter(buku => buku.title.toLowerCase().includes(cariJudul.toLowerCase()));
if (filterCari.length === 0) {
    alert('Tidak ada buku yang ditemukan!');
} else {
    document.getElementById('bookshelf').innerHTML = '';
    document.getElementById('buku-selesai').innerHTML = '';
    for (const buku of filterCari) {
        const bukuElement = makeBuku(buku);
        if(buku.isCompleted){
            document.getElementById('buku-selesai').append(bukuElement);
        }else{
            document.getElementById('bookshelf').append(bukuElement);
        }
    }
}
});
document.addEventListener(RENDER_EVENT, function () {
    const listBukuBelumSelesai = document.getElementById('bookshelf');
    const listBukuSelesai = document.getElementById('buku-selesai');
  
    listBukuBelumSelesai.innerHTML = '';
    listBukuSelesai.innerHTML = '';
  
    for (const bukuItem of bookshelf) {
      const bukuElement = makeBuku(bukuItem);
      if (bukuItem.isCompleted) {
        listBukuSelesai.append(bukuElement);
      } else {
        listBukuBelumSelesai.append(bukuElement);
      }
    }
});
  
  
function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(bookshelf);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-buku';
const STORAGE_KEY = 'BOOKSHELF_APPS';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const lemari of data) {
        bookshelf.push(lemari);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}
  
document.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
      loadDataFromStorage();
    }
});
  
