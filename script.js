// функция меняет кнопки
function clickOnBtn(classActive, classPassive, btnActive, btnPassive){
    const class1 = document.querySelector(classActive);
    const class2 = document.querySelector(classPassive);
    const btn1 = document.querySelector(btnActive);
    const btn2 = document.querySelector(btnPassive);
    if (class1.classList.contains('active')){

    } else {
        class1.classList.add('active');
        class1.classList.remove('passive');

        class2.classList.add('passive');
        class2.classList.remove('active');

        btn1.classList.add('activeBtn');
        btn1.classList.remove('passiveBtn');

        btn2.classList.add('passiveBtn');
        btn2.classList.remove('activeBtn');
    }
}
const preloader = document.querySelector('.preloader');
downloadBlockFavorites = () =>{
    const favorites = document.querySelector('.favorites');//объявляем блок избранного
    document.querySelectorAll('.oneFavoriteBlock').forEach(e => e.remove());
    if (arrayOfFavourites.length === 0) {
        favorites.innerHTML = `
            <div class="empty">
                <img src="empty.png">
                <h1>Список избранного пуст</h1>
                <p>Добавляйте изображения, нажимая на звездочки</p>
            </div>
        `
    } else {
        arrayOfFavourites.forEach((item) => {
            favorites.innerHTML += createFavorite(item);
        })
    }//загружает из хранилища список избранного
}

//функция загружает юзеров с сервера и избранное из localStorage
let arrayOfFavourites = JSON.parse(localStorage.getItem('favorite')) || [];
document.addEventListener("DOMContentLoaded", async function downloadUsers() {
    const users = document.querySelector('.users');
    try {
        const resp = await fetch('https://json.medrating.org/users/',
            {method: 'GET'});
        let result = await resp.json();
        console.log(Object.values(result));
        users.innerHTML = '';
        Object.values(result).forEach(item => {
            users.innerHTML += showUsers(item);
        });
    } catch (err) {
        users.innerHTML = `
            <div class="imgError">
                <img src="error.png">
                <h1>Сервер не отвечает</h1>
                <p>Уже работам над этим</p>
            </div>`
    }
})
// рендерит юзеров
showUsers = ((item) =>{
    return `
    <input class="hide" id="user-${item.id}" type="checkbox" onclick="downloadAlbum(${item.id})">
        <label for="user-${item.id}"><h1>${item.name}</h1></label>
        <div class="albums-${item.id}">
    </div>
    <br/>
    `
})

//загружает альбомы с сервера
downloadAlbum = async (id) => {
    console.log('downloadAlbum')
    let selectorId = '.albums-' + id;
    let selectorBtn = '#user-' + id;
    const albums = document.querySelector(selectorId);
    document.querySelector(selectorBtn).removeAttribute("onclick");//удаляет наконкретном элементе отработку функции,
    // чтобы запрос не отправлялся по каждому нажатию*/
    try {
        const resp = await fetch('https://json.medrating.org/albums?userId=' + id,
            {method: 'GET'});
        let result = await resp.json();
        console.log(Object.values(result));
        Object.values(result).forEach(item => {
            albums.innerHTML += showAlbum(item);
        });
    } catch (err) {
        albums.innerHTML = `
        <div class="imgError"><img src="error.png">
        <h1>Сервер не отвечает</h1>
        <p>Уже работам над этим</p>
        </div>
        `
    }
}


//рендерит альбомы
showAlbum = ((item) => {
    console.log('showAlbum');
    return `
    <input class="hide" id="album-${item.id}" type="checkbox" onclick="downloadPhoto(${item.id})">
    <label for="album-${item.id}"><h1>${item.title}</h1></label>
    <div id="photos-${item.id}">
    
    </div>
    <br/>
    `
})

//загружает фото с сервера
downloadPhoto = async (id) => {
    console.log('downloadPhoto');
    let selectorId = '#photos-' + id;
    let selectorBtn = '#album-' + id;
    const photos = document.querySelector(selectorId);
    document.querySelector(selectorBtn).removeAttribute("onclick");//удаляет на конкретном элементе отработку функции,
    // чтобы запрос не отправлялся по каждому нажатию
    try {
        const resp = await fetch('https://json.medrating.org/photos?albumId=' + id,
            {method: 'GET'});
        let result = await resp.json();
        console.log(Object.values(result));
        const blockWithPhoto = document.createElement('div');
        blockWithPhoto.className = 'blockWithPhoto';
        Object.values(result).forEach(item => {
            blockWithPhoto.innerHTML += showPhoto(item);
        });
        photos.appendChild(blockWithPhoto);
    } catch (err) {
        photos.innerHTML = `
        <div class="imgError"><img src="error.png">
        <h1>Сервер не отвечает</h1>
        <p>Уже работам над этим</p>
        </div>
        `
    }
}

//рендерит фото
showPhoto = ((item) => {
    console.log('showPhoto');
    return `
    <div class="photoInCatalog" onclick="openModal(${item.id})" title="${item.title}" style="background: url(${item.url})">
        <img src="star_empty.png" id="photoId-${item.id}" class="star" about="${item.id}, ${item.title}, ${item.url}"
         onclick="addToFavorites(${item.id}); event.stopPropagation()">
    </div>
    <div id="modal-${item.id}" class="modal">
         <div class="modal-content">
           <span class="close" onclick="closeModal(${item.id})">&times;</span>
           <img src="${item.url}">
         </div>
    </div>
    `//в about передает необходимые поля объекта каждой картинкиб добавляем скрытое модальное окно, передаем в
    //функцию на клик id этой картинкиб добавляем title
})

//открывает модальное окно
function openModal(id){
    const selectorId = '#modal-' + id;
    console.log(selectorId);
    const modal = document.querySelector(selectorId);
    console.log(modal);
    modal.style.display = "block";
}

//закрывает модальное окно
function closeModal(id) {
    const selectorId = '#modal-' + id;
    const modal = document.querySelector(selectorId);
    modal.style.display = "none";
}

//рендерит избранное
createFavorite = (item) =>{
    console.log('createFavorite')
    return`
    <div class="oneFavoriteBlock" id="favoriteBlockId-${item.id}" about="${item.id}, ${item.title}, ${item.url}">
        <div class="photo" onclick="openModal(${item.id})" title="${item.title}" style="background: url(${item.url})">
            <img src="star_active.png" id="photoFavoriteId-${item.id}" 
             class="star" onclick="deleteFromFavorite(${item.id}); event.stopPropagation()">
        </div>
        <p>${item.title}</p>
        <div id="modal-${item.id}" class="modal">
             <div class="modal-content">
               <span class="close" onclick="closeModal(${item.id})">&times;</span>
               <img src="${item.url}">
             </div>
        </div>
    </div>
    `
}

//добавляет в избранное
addToFavorites = (id) =>{
    console.log('эddToFavorite');
    let selectorCatalog = '#photoId-' + id;
    const elem = document.querySelector(selectorCatalog);//получаем конкретный dom элемент из каталога
    let item = elem.getAttribute('About');//получаем объект фото из about
    let arrayOfStrings = item.split(', ');
    let obj ={
        'id' : arrayOfStrings[0],
        'title' : arrayOfStrings[1],
        'url' : arrayOfStrings[2],
    }//собираем объект обратно
    const favorites = document.querySelector('.favorites');//куда добавляем

    //arrayOfFavourites = JSON.parse(localStorage.getItem('favorite'));//получаем из хранилища массив с избранным
    if (arrayOfFavourites.includes(obj)){

        arrayOfFavourites = arrayOfFavourites.splice(arrayOfFavourites.indexOf(obj), 1);//удалем из массива
        localStorage.setItem('favorite', JSON.stringify(arrayOfFavourites));//добавляем массив в хранилище

        elem.removeAttribute('src');
        elem.src = "star_empty.png"//меняем картинку на пустую
        let selectorFavorite = '#favoriteBlockId-' + id;
    } else {
        arrayOfFavourites.push(obj);//добавляем объект в массив
        localStorage.setItem('favorite', JSON.stringify(arrayOfFavourites));//кладем массив в хранилище
        elem.removeAttribute('src');
        elem.src = "star_active.png";
    }
}

deleteFromFavorite = (id) =>{
    let selectorCatalog = '#photoId-' + id;
    let selectorFavorite = '#favoriteBlockId-' + id;
    const favorites = document.querySelector('.favorites');
    const elemInCatalog = document.querySelector(selectorCatalog);
    const elemInFavorite = document.querySelector(selectorFavorite);
    let item = elemInFavorite.getAttribute('About');
    let arrayOfStrings = item.split(', ');
    let obj ={
        'id' : arrayOfStrings[0],
        'title' : arrayOfStrings[1],
        'url' : arrayOfStrings[2],
    }
    arrayOfFavourites = arrayOfFavourites.splice(arrayOfFavourites.indexOf(obj), 1);//удалем из массива
    localStorage.setItem('favorite', JSON.stringify(arrayOfFavourites));//добавляем массив в хранилище

    elemInCatalog.removeAttribute('src');
    elemInCatalog.src = "star_empty.png"//меняем картинку на пустую

    favorites.removeChild(elemInFavorite);
}



