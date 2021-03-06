/*-------------==============================================--START SCREEN----=================================================---------------*/
'use strict'
//Загружаю звук
var introAudio = new Audio('introtheme.mp3');
var gameAudio = new Audio("maintheme.mp3");
var crashAudio = new Audio('snowmastercrash2.mp3');
var slowDownAudio = new Audio('slowdown.mp3');
var jumpAudio = new Audio('jumpaudio.mp3');

crashAudio.volume = 0.5;
slowDownAudio.volume = 0.6;

//картинки для стартовой страницы
var startImage = 'startscreengif.gif';
var startImage2 = 'GIFSTARTPLAY1.gif';

//загружаю изображения
var rightMasterImg = new Image();
rightMasterImg.src = 'masterrightfull.png';

var leftMasterImg = new Image();
leftMasterImg.src = 'masterleftfull.png';

var normalMasterImg = new Image();
normalMasterImg.src = 'newmasterfull22.gif';

var jumpMasterImg = new Image();
jumpMasterImg.src = 'masterjumpfull.png';

var slowDownCoin = new Image();
slowDownCoin.src = 'slowdowncoin2.png';

var gameOverImage = 'gameoverpic.png';

var trackImage = new Image();
trackImage.src = "snowtrack1.png";

var trap1 = new Image();
trap1.src = "woodlog.png";

var trap2 = new Image();
trap2.src = 'mount2.png';

var trap3 = new Image();
trap3.src = 'hole.png';

var traps = [trap1, trap2, trap3];

var startScreen; //для дива заставки
var gamelogo; // для логотипа
var nameSpan; //для nickname
var userForm; //контейнер для формы
var nameField; //для имени
var namesubmit; //для кнопки PLAY
var recordsButton; //для кнопки рекорды
var recDiv; //контейнер таблицы
var recT; //див таблицы
var closeBut; //кнопка закрыть
var tableSet; //для таблицы
var scale; //размер монет, ловушек
var masterScale; //размер мастера
var yourMasterName; //имя мастера
var gameOverDivNew; //контейнер гейм овер
var resized = false; //флаг ресайза

var timer0 = null;
var timer1 = null; //таймеры
var timer2 = null;
var timer3 = null;
var timer4 = null;
var timer5 = null;
var timer6 = null;
var timer7 = null;
var timer8 = null;
var timer9 = null;

var scoreCount = 0; //очки
var tableIsOn = 0; //флаг для таблицы
var twTranslate = 60; // на сколько выeзжает таблица
var speed = 5; //скорость мастера
var welcomeSoundOn = false; //включено интро
var trackSpeed = 5; //скорость трека
var windSpeed = 3; //скорость ветра
var speedUpsCount = 0; //считаем спидапы
var deadBody = false; //флаг, сейчас мастер жив
var gameStarted = false; //игра началась

var SPAState = {}; //SPA

startScreen = document.createElement('div'); // для стартовой страницы
startScreen.style.cssText = 'width: 100%; height: 100%;';
startScreen.id = 'startscreen';
startScreen.position = 'relative';
startScreen.style.backgroundColor = 'white'; //СТАРТОВАЯ СТРАНИЦА
document.body.appendChild(startScreen);

var ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php"; //для AJAX
var stringName = 'ROPEIKO_BM';




//====================================================================AJAX==================================================================================
function saveRecord(dat) { //сохранение данных о результате на сервер, атрибут - хэш {name:..., score:...}
    var updatePassword;
    updatePassword = Math.random();
    $.ajax({
        url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
        data: { f: 'LOCKGET', n: stringName, p: updatePassword },
        success: lockGetReady, error: errorHandler
    }
    );

    function lockGetReady(callresult) {
        if (callresult.error != undefined) {
            alert(callresult.error);
        }
        else {
            var recordsTable = JSON.parse(callresult.result);
            recordsTable.push(dat);
            recordsTable = recordsTable.sort((a, b) => b.score - a.score).slice(0, 10); //заношу элемент в таблицу, сортирую, убираю лишний
            $.ajax({
                url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
                data: { f: 'UPDATE', n: stringName, v: JSON.stringify(recordsTable), p: updatePassword },
                success: updateReady, error: errorHandler
            });
        }
    }

    function updateReady(callresult) {
        if (callresult.error != undefined) {
            alert(callresult.error);
        }
    }

}

function makeTable() {   // загрузка данных в таблицу рекордов
    (function readTable() {
        $.ajax({
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
            data: { f: 'READ', n: stringName },
            success: tableReady, error: errorHandler
        });
    })();

    function tableReady(callresult) {
        if (callresult.error != undefined) {
            alert(callresult.error);
        } else {
            let tabRes = JSON.parse(callresult.result);
            for (var i = 0; i < tabRes.length; i++) {
                recT.innerHTML += '<br>' + tabRes[i].name + ': ' + tabRes[i].score; //перебираю закидываю в иннер таблицы
            }
        }
    }
}
function errorHandler(jqXHR, statusStr, errorStr) {
    alert(statusStr + ' ' + errorStr);
}

// ===============================================================================кроссбраузерный RAF
if (!window.requestAnimationFrame) { // кроссбраузерный RAF
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setInterval(callback, 1000 / 60);
        }
}
if (!window.cancelAnimationFrame) {
    window.requestAnimationFrame = window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (callback, element) {
            window.clearInterval(callback, 1000 / 60);
        }
}

function startPic() { //обновляю картинку при нажатии на включение звука
    if (welcomeSoundOn) {
        startImage = startImage2;
        gamelogo.update();
    }
}

window.onload = welcomeScreen(helloSound);

function helloSound() { //инициализирую звук

    if (!welcomeSoundOn) {
        function gameSoundInit() {

            gameAudio.currentTime = 0;
            introAudio.currentTime = 0;
            crashAudio.currentTime = 0;
            slowDownAudio.currentTime = 0;
            jumpAudio.currentTime = 0;
            gameAudio.play(); // запускаю звук
            gameAudio.pause(); // и сразу останавливаю
            introAudio.play();
            introAudio.pause();
            slowDownAudio.play();
            slowDownAudio.pause();
            crashAudio.play();
            crashAudio.pause();
            jumpAudio.play();
            jumpAudio.pause();
        }

        function introSound() {
            introAudio.currentTime = 0;
            introAudio.play();
            introAudio.loop = true;
        }

        welcomeSoundOn = true;
        gameSoundInit();
        introSound();
        startPic();
    }
}
function gameSound() { //звук в игре
    jumpAudio.currentTime = 0;
    gameAudio.currentTime = 0;
    introAudio.currentTime = 0;
    crashAudio.currentTime = 0;
    slowDownAudio.currentTime = 0;
    introAudio.pause();
    crashAudio.pause();
    gameAudio.play();
    gameAudio.loop = true;
    welcomeSoundOn = false;
}
function welcomeScreen(wsFunc) {



    location.hash = 'startpage';

    gamelogo = document.createElement('img'); // картинка заставки
    gamelogo.addEventListener('click', wsFunc);
    gamelogo.addEventListener('touchstart', wsFunc);
    gamelogo.src = startImage;
    gamelogo.update = () => gamelogo.src = startImage;
    gamelogo.style.cssText = 'width: 60%; margin-left: auto; margin-right: auto; display: block';
    startScreen.appendChild(gamelogo);

    nameSpan = document.createElement('span'); //надпись NICKNAME
    nameSpan.id = 'yourname';
    nameSpan.innerHTML = 'NICKNAME:';
    nameSpan.style.fontFamily = 'bahnschrift';
    nameSpan.position = 'absolute';
    startScreen.appendChild(nameSpan);

    userForm = document.createElement('div'); //контейнер для инпута и кнопок
    userForm.id = 'userform';
    userForm.style.display = 'none';
    userForm.style.cssText = '';
    userForm.position = 'relative';
    startScreen.appendChild(userForm);

    nameField = document.createElement('input'); //инпут для имени игрока
    nameField.id = 'namefield';
    if (localStorage.getItem('mastername') !== null) {
        nameField.placeholder = localStorage.getItem('mastername')
    } else { nameField.placeholder = 'mASter3000' };
    nameField.type = 'text'
    nameField.name = 'namefield'
    nameField.maxLength = 12;
    userForm.appendChild(nameField);

    namesubmit = document.createElement('div'); //кнопка PLAY
    namesubmit.id = 'namesubmit';
    namesubmit.innerHTML = 'PLAY';

    namesubmit.onclick = function () {
        nameField.value ? localStorage.setItem('mastername', nameField.value) : localStorage.setItem('mastername', nameField.placeholder);
        if (!nameField.value) {
            yourMasterName = nameField.placeholder;
        }
        else yourMasterName = nameField.value;
        document.getElementById('startscreen').style.display = 'none';
        playGame();
    }
    userForm.appendChild(namesubmit);

    recordsButton = document.createElement('div'); //кнопка RECORDS
    recordsButton.id = 'recordsbutton';
    recordsButton.innerHTML = 'RECORDS';
    userForm.appendChild(recordsButton);
    recordsButton.onclick = showTable; //показываю таблицу

    //ТАБЛИЦА РЕКОРДОВ
    recDiv = document.createElement('div'); //контейнер
    recDiv.id = 'recorddiv';
    var recDivWidth = recDiv.style.width;
    var recDivHeight = recDiv.style.height;
    recDiv.position = 'relative';
    recDiv.style.backgroundColor = 'black';
    recDiv.style.zIndex = 0;
    recDiv = startScreen.appendChild(recDiv);
    recT = document.createElement('div') //для текста таблицы
    recT.style.width = recDivWidth;
    recT.style.height = recDivHeight;
    recT.position = 'relative';
    recT.style.opacity = 0.8;
    recT.style.display = 'block';
    recT.id = 'fortable';
    recT.style.textAlign = 'center';
    recT.innerHTML = 'BEST SCORES';
    recT.style.color = 'white';
    closeBut = document.createElement('div'); //кнопка закрыть
    closeBut.id = 'closebutton';
    closeBut = recDiv.appendChild(closeBut);
    recT = recDiv.appendChild(recT);
    closeBut.style.width = '3vw';
    closeBut.style.height = '3vw';
    closeBut.style.backgroundColor = 'red';
    closeBut.innerHTML = 'X';
    closeBut.position = 'absolute';
    closeBut.style.top = 100;
    closeBut.style.left = 100;
    closeBut.onclick = hideTable; //убираю таблицу
    closeBut.style.fontSize = '2vw';
    closeBut.style.textAlign = 'center';
    closeBut.style.lineHeight = '3vw';
    closeBut.style.cursor = 'pointer';
    recDiv.style.display = 'block';
    closeBut.style.display = 'block';

    makeTable(); //заполняю таблицу

    tableSet = { //для анимации таблицы
        update: function () {
            let tableVar = document.getElementById('recorddiv');

            tableVar.style.transitionTimingFunction = 'linear';
            tableVar.style.webkitTransitionTimingFunction = 'linear';

            tableVar.style.transformOrigin = "left top";
            tableVar.style.transform = "translateZ(0) translateY(" + twTranslate + "vh)"; //выношу на отдельный слой GPU
            tableVar.style.webkitTransform = "translateZ(0) translateY(" + twTranslate + "vh)";
            tableIsOn = 1;

        }
    }
}


//ТАБЛИЦА РЕКОРДОВ
function showTable() { //показываю
    let showAndHide;
    window.setTimeout(() => { cancelAnimationFrame(showAndHide) }, 1000);
    twTranslate = 60;
    showAndHide = window.requestAnimationFrame(tick);
}

function hideTable() { //убираю
    let showAndHide;
    window.setTimeout(() => { cancelAnimationFrame(showAndHide) }, 1000);
    twTranslate = 0;
    showAndHide = window.requestAnimationFrame(tick);
}

function tick() {
    tableSet.update();
    window.requestAnimationFrame(tick);
}


//========================================MODEL====================================

function playGame() { //по нажатию PLAY

    gameStarted = true; //флаг
    var timer0 = null; //для надежности
    var timer1 = null;
    var timer2 = null;
    var timer3 = null;
    var timer4 = null;
    var timer5 = null;
    var timer6 = null;
    var timer7 = null;
    var timer8 = null;
    var timer9 = null;

    //================================КЛАССЫ
    class Track {//ОПИСАНИЕ ТРЭКА
        constructor(image, y) {
            this.x = 0;
            this.y = y;
            this.image = image;
        }
        update(track) {
            this.y += trackSpeed; //скорость фона
            if (this.y >= window.innerHeight) {
                this.y = track.y - (canvas.height - trackSpeed);
            }
        }
    }
    class Master { //ОПИСАНИЕ МАСТЕРА
        constructor(image, x, y) {
            this.x = x;
            this.y = y;
            this.dead = false;
            this.image = image;
            this.jumpStatus = false;
        }

        hit(trap) { //проверки на столкновения с объектами
            var hit = false; //флаг удара
            if (this.y < trap.y + (trap.image.height - (trap.image.height / 2.5)) * scale && //снизу препятствия, сверху препятствия и прыжок
                this.y + (this.image.height - (this.image.height / 1.3)) * masterScale > trap.y) //волшебные константы для точной настройки подбора монеток
            {                                                                                       //и попадания в ловушки
                if (this.x + (this.image.width / 2 - (this.image.width / 3)) * masterScale > trap.x &&
                    this.x < trap.x + (trap.image.width - (trap.image.width / 3)) * scale) { //лево и право
                    hit = true;
                }
            } return hit;
        }

        move(v, d) { //движение мастера
            if (v == "x") {
                d *= 1; //скорость
                this.x += d;
                if (this.x + this.image.width / 3 * masterScale > canvas.width) // делим на 3, у меня ширина изображения в 3 раза больше
                    this.x -= d; //если выходим за экран меняем скорость 
                if (this.x < 0)
                    this.x = 0;
            }
            else {
                d *= 1;
                this.y += d;
                if (this.y + this.image.height * masterScale > canvas.height)
                    this.y -= d;
                if (this.y < 0)
                    this.y = 0;
            }
        }
    }
    class Trap { //класс ловушек
        constructor(image, x, y) {
            this.x = x;
            this.y = y;
            this.width = canvas.width;
            this.dead = false; //флаг когда нужно убрать из массива
            this.image = image;
        }
        update() { //движение
            this.y += trackSpeed;
            if (this.y > canvas.height + 50)
                this.dead = true;
        }
    }

    class Coin extends Trap { //класс монеток, наследую от ловушек
        constructor(image, x, y) {
            super(image, x, y);
            this.collectable = true; //умеет собираться
        }
    }

    class Wind { // класс для ветра
        constructor() { //
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = windSpeed;
            this.color = 'white'; //изначальный цвет
            this.size = Math.random() * 4 + 2; //размер
            this.amp = Math.random() * -5 + 10; //количсетво
        }
    }
    // ОПИСАНИЯ ПЕРЕМЕННЫХ =============================================================================================
    window.addEventListener("resize", newSize, false); //регулировка размера canvas в зависимости от размера окна

    var wrapperDiv = document.createElement('div'); //конетейнер для канваса
    wrapperDiv.id = 'wrapper';
    wrapperDiv = document.body.insertBefore(wrapperDiv, document.body.children[0]);

    var canvas = document.createElement("canvas"); //сам канвас
    canvas.id = 'canvas';
    var ctx = canvas.getContext("2d");
    canvas = wrapperDiv.appendChild(canvas);
    newSize(); //сразу устанавливаем нужный размер 

    var windShapes = []; //снежок
    var objects = []; // для ловушек, монеток 

    var windShapesCount = canvas.width / 20; //количество относительно размера экрана
    var speedColor;

    scale = (canvas.width / 150) * 0.025; //размеры объектов
    masterScale = (canvas.width / 150) * 0.025; //размер игрока

    canvas.addEventListener("contextmenu", (EO) => { EO.preventDefault(); return false; });//УБИРАЮ МЕНЮ ПРАВОЙ КНОПКИ
    var speed = 5; //скорость мастера
    var trackSpeed = 5; //скорость трека

    var jumpSpeed; //для замедления при прыжке
    var pressed = false; //флаг нажатия на прыжок
    var forPressed; // чтобы запустить таймер
    var countdown = false; //флаг перезарядки прыжка
    var forCountdown; // чтобы запустить таймер

    //ДЛЯ АНИМАЦИИ МАСТЕРА ============================================================
    var angle = 15; //размер картинки 999px в ширину
    var w1 = {
        acurrent: 333,
        awidth: 333
    };
    var w2 = {
        acurrent: 666,
        awidth: 0
    };
    var w3 = {
        acurrent: 0,
        awidth: 666
    };
    var wsArr = [w1, w2, w3];
    var wsRandom; //принимает состояние из wsArr

    // ДЛЯ КОНЦА ИГРЫ ==================================================================
    gameOverDivNew = document.createElement('div'); //контейнер
    gameOverDivNew.id = 'gameoverpage';
    gameOverDivNew.style.position = 'relative';
    gameOverDivNew.style.width = '100vw';
    gameOverDivNew.style.height = '100vh';
    gameOverDivNew.style.backgroundColor = 'white';
    gameOverDivNew = document.body.appendChild(gameOverDivNew);
    gameOverDivNew.style.display = 'none';
    var gameOverImg = document.createElement('img'); //картинка
    gameOverImg.id = 'gameoverIMG';
    gameOverImg.style.position = 'absolute';
    gameOverImg.src = gameOverImage;
    gameOverImg.style.cssText = 'width: 60vw; margin-left: 20vw;  display: block';
    gameOverImg = gameOverDivNew.appendChild(gameOverImg);
    var endScore = document.createElement('span'); //результат
    endScore.id = 'endscore';
    endScore.style.position = 'absolute';
    endScore.style.display = 'inline-block';

    endScore = gameOverDivNew.appendChild(endScore);
    var replayButton = document.createElement('div'); // кнопка рестарт
    replayButton.id = 'replaybutton';
    replayButton.innerHTML = 'RESTART';
    gameOverDivNew.appendChild(replayButton);
    replayButton.onclick = restartGame; //по нажатию начинаем заново

    /*gameOverDivNew.addEventListener('keydown', keyRestartFunc);
    function keyRestartFunc(EO) {
        if (EO.keyCode === 13 && gameStarted && deadBody){
            gameOverDivNew.removeEventListener('keydown', keyRestartFunc);
            restartGame();
        }
    }*/

    //необходимые вещи
    for (var i = 0; i < windShapesCount; i++) { //генерирую ветер
        var wshape = new Wind;
        windShapes.push(wshape)
    }

    var tracks = //загружаю фоны
        [
            new Track(trackImage, 0),
            new Track(trackImage, canvas.height)
        ];

    var player = new Master(normalMasterImg, canvas.width / 2, canvas.height / 1.5); //игрок

    window.onload = startGame(); //по загрузке всего начинаем игру

    function newSize() { //для размера canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function restartGame() { //для рестарта, восстанавливаем значения
        location.hash = 'gameover';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameOverDivNew.style.display = 'none';
        wrapperDiv.style.display = 'block';
        deadBody = false;
        scoreCount = 0;
        trackSpeed = 5;
        speed = 5
        player = new Master(normalMasterImg, canvas.width / 2, canvas.height / 1.5);
        objects = [];
        countdown = false;
        pressed = false;
        startGame();

    }

    function startGame() { //для начала игры
        location.hash = 'game';
        newSize();
        gameStarted = true;
        if (timer0 || timer1 || timer2 || timer3 || timer4 || timer5) {
            window.cancelAnimationFrame(timer1); //на всякий случай 
            window.clearInterval(timer2);
            window.clearInterval(timer3);
            window.clearInterval(timer4);
            window.clearInterval(timer5);
        }
        timer1 = window.requestAnimationFrame(updateGame); //заряжаем таймеры
        timer2 = window.setInterval(controlFunc, 1000 / 60);
        timer3 = window.setInterval(speedUpFunc, 2000);
        timer4 = window.setInterval(realSpeedUp, 8000);
        timer5 = window.setInterval(function () { wsRandom = wsArr[Math.floor(Math.random() * wsArr.length)]; }, 1000 / 15);
        forCountdown = 2000; //перезарядка прыжка включая время прыжка
        forPressed = 1000; //время прыжка
        gameSound();
        timer0 = 1;

    }

    function crashSound() { //воспроизводим звук столкновения с ловушкой
        gameAudio.pause();
        crashAudio.currentTime = 0;
        crashAudio.play();
        window.navigator.vibrate([200, 100, 300]);
    }

    function Stop() { //мастер разбился

        location.hash = "gameover";
        deadBody = true;
        gameStarted = false; //флаги изменились

        window.cancelAnimationFrame(updateGame); //снимаем таймеры
        window.clearInterval(timer2);
        window.clearInterval(timer3);
        window.clearInterval(timer4);
        window.clearInterval(timer5);
        timer0 = 0;

        document.getElementById('wrapper').style.display = 'none';
        gameOverDivNew.style.display = 'block';
        endScore.innerHTML = 'MASTER ' + yourMasterName + ' SCORE' + ': ' + scoreCount;
        let thisScore = { name: yourMasterName, score: scoreCount };
        scoreCount = 0;
        trackSpeed = 5;
        saveRecord(thisScore); //сохраняем рекорд

    }

    function setColor() { //если больше 50 км в час - делаем надпись красной и т.д
        var speedKM = (Math.round((trackSpeed * 4.5) * 10) / 10);
        if (speedKM >= 50) {
            speedColor = 'red';
        }
        if (speedKM < 50 && speedKM > 35) {
            speedColor = 'orange';
        }
        if (speedKM < 35) {
            speedColor = 'black';
        }
    }

    function updateGame() { //анимирую , добавляю элементы
        tracks[0].update(tracks[1]); //двигаем фон
        tracks[1].update(tracks[0]);

        setColor();

        if (randomizerFunc(0, 10000) > 9650) //ГЕНЕРИРУЮ СТАТИЧЕСКУЮ ЛОВУШКУ
        {
            objects.push(new Trap(trapSelect(), randomizerFunc(0, canvas.width - (canvas.width / 10)), randomizerFunc(250, 400) * -1));
        }
        if (randomizerFunc(0, 10000) < 100) { // ГЕНЕРИРУЮ  МОНЕТКИ

            objects.push(new Coin(slowDownCoin, randomizerFunc(0, canvas.width - (canvas.width / 15)), randomizerFunc(250, 400) * -1))
        }

        function trapSelect() { //ПОДФУНКЦИЯ ДЛЯ ВЫБОРА ЛОВУШКИ
            var trap = traps[Math.floor(Math.random() * traps.length)];
            return trap;
        }


        //=============================================================================ПРОВЕРКИ
        var objOut = false; //флаг - объект вышел за пределы экрана

        if (trackSpeed <= 5 && player.jumpStatus === false) { //если скорость меньше начальной (кроме прыжка), делаю ее начальной
            trackSpeed = 5;
        }
        for (var i = 0; i < objects.length; i++) { //двигаю ловушки
            objects[i].update();
            if (objects[i].dead)
                objOut = true;
        }

        if (objOut) { //если вышел - подтираем
            objects.shift();
        }

        var hit = false; // cтолкновения
        for (var i = 0; i < objects.length; i++) {
            hit = player.hit(objects[i]);

            if (hit) {
                if (objects[i].collectable == true) { // если собирается(монетка)
                    objects.splice(i, 1);
                    slowDownAudio.currentTime = 0;
                    slowDownAudio.play();
                    trackSpeed -= 0.5;
                    scoreCount += 50;
                    window.navigator.vibrate(200);
                    console.log('collected');
                    let speedStr = (Math.round((trackSpeed * 4.5) * 10) / 10) + ' km/h';
                    console.log('speed: ' + speedStr);
                }
                else if (!objects[i].collectable && !player.jumpStatus) { //если ловушка то конец игры
                    crashSound();
                    Stop();
                }
            }
        }

        gameDraw();
        if (timer0 != 0 && timer0 != undefined) { //если стоит таймер
            window.requestAnimationFrame(updateGame);
        }
    }

    //-------------------------------------------------VIEW--------------------------------------------------------------------------------------------
    function gameDraw() { //функция рисования

        var scoreStr = scoreCount;
        var speedStr = (Math.round((trackSpeed * 4.5) * 10) / 10) + ' km/h'; //перевожу скорость в километры в час
        ctx.clearRect(0, 0, canvas.width, canvas.height); //чищу канвас

        for (var i = 0; i < tracks.length; i++) { //рисую бэкграунд
            drawTracks(tracks[i]);
        }

        for (var i = 0; i < objects.length; i++) {  //рисую ловушки и монетки
            drawObject(objects[i]);
        }

        drawMaster(player, wsRandom); // атрибуты - объект игрок, функция анимации по кадрам

        for (var i = 0; i < windShapes.length; i++) {
            drawWindShapes(windShapes[i]);
            if (windShapes[i].y > canvas.height) {
                windShapes.splice(i, 1)
                var wshape = new Wind;
                wshape.y = 0;
                windShapes.push(wshape);
            }
        }
        drawScores(scoreCount); //рисую очки
        drawSpeed(speedStr); // рисую скорость
    }
    function drawTracks(track) { //трек
        ctx.drawImage
            (
                track.image,
                0,
                0,
                track.image.width,
                track.image.height,
                track.x,
                track.y,
                canvas.width,
                canvas.height
            );
    }

    let windColors = ['black', 'white', 'deepskyblue'];  //снег, цвета

    function drawWindShapes(windshape) {//снег
        var windCol = windColors[Math.floor(Math.random() * windColors.length)]; //рандомно выбираю цвет
        ctx.fillStyle = windCol;
        ctx.fillRect(windshape.x + windshape.amp, windshape.y, windshape.size, windshape.size);
        windshape.y += windshape.speed * 2 * windshape.size;
        ctx.strokeStyle = windCol;

    }

    function drawMaster(master, animator) { //рисую мастера

        var w1 = {
            acurrent: 333,
            awidth: 333   //анимирую мастера acurrent - верхний левый угол картинки, awidth - ширина
        };
        var w2 = {
            acurrent: 666,
            awidth: 0
        };
        var w3 = {
            acurrent: 0,
            awidth: 666
        };
        if (!animator) {
            animator = w1; //изначальное значение 333-333
        }
        ctx.drawImage
            (
                master.image,
                animator.acurrent,
                0,
                master.image.width / 3,
                master.image.height,
                master.x,
                master.y,
                master.image.width / 3 * masterScale,
                master.image.height * masterScale
            );
    }

    function drawObject(obj) { //рисуем ловушки и монетки

        ctx.drawImage
            (
                obj.image,
                0,
                0,
                obj.image.width,
                obj.image.height,
                obj.x,
                obj.y,
                obj.image.width * scale,
                obj.image.height * scale
            );
    }

    function drawScores(score) { //рисуем очки
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.font = 'bold ' + canvas.width / 25 + 'px Impact';
        ctx.fillText(score, canvas.width / 25, canvas.height / 20);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }

    function drawSpeed(speed) { //рисуем км/ч
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = speedColor;
        ctx.font = 'bold ' + canvas.width / 25 + 'px Impact';
        ctx.fillText(speed, canvas.width - canvas.width / 5, canvas.height / 20);
    }

    //--------------------------------------------------КОНТРОЛЛЕР---------------------------------------------------------------------

    var keys = []; //массив нажатых клавиш

    document.body.addEventListener('touchstart', doubleTapHandler, { passive: false }); //обработчики 
    document.body.addEventListener('touchmove', forTouchMove, false);
    document.body.addEventListener("keydown", forKeyDown, false);
    document.body.addEventListener("keyup", forKeyUp, false);

    var tapedTwice = false; //флаг двойного нажатия

    function doubleTapHandler(EO) { //жест двойное касание это прыжок
        EO = EO || window.event;
        if (!tapedTwice) {
            tapedTwice = true;
            setTimeout(function () { tapedTwice = false; }, 300);
            return false;
        }
        EO.preventDefault();
        player.image = jumpMasterImg;
        masterJump();
    }

    function forKeyUp(EO) { //кей ап
        EO = EO || window.event;
        keys[EO.keyCode] = false;
        player.image = normalMasterImg;
    }

    function forKeyDown(EO) {
        EO = EO || window.event;
        if (EO.key == 32) { // для прыжка
            spaceKeys[EO.keyCode] = true;
            masterJump();
        }
        keys[EO.keyCode] = true;
    }

    function forTouchMove(EO) { //для работы с тачскрином
        EO = EO || window.event;
        player.x = EO.touches[0].pageX - player.image.width / 4 * masterScale;
        player.y = EO.touches[0].pageY - (player.image.height * 1.3) * masterScale; // работаем пальцем ниже мастера чтобы видеть его
    }

    function masterJump() { //функция прыжка

        masterScale = ((canvas.width / 150) * 0.025) + 0.06; // увеличиваем размер объекта
        jumpAudio.play();
        player.jumpStatus = true;
        window.navigator.vibrate(100);
        player.image = jumpMasterImg; //меняем отображение
        jumpSpeed = trackSpeed / 3 //замедляем время
        trackSpeed -= jumpSpeed;

        timer7 = window.setTimeout(function () { //через секунду меняем отображение на обычное
            masterScale = (canvas.width / 150) * 0.025;
            player.image = normalMasterImg;
            player.jumpStatus = false; //убираем статус прыжка
            pressed = false;
            trackSpeed += jumpSpeed; //восстанавливаем время
        }, forPressed);
        timer8 = window.setTimeout(function () { //перезарядка 2 сек включая время прыжка
            jumpAudio.currentTime = 0;
            countdown = false
        }, forCountdown);
    }



    function controlFunc() {

        if (keys[38] || keys[87]) { //вверх и вниз
            player.move("y", -(speed * 2));
        }

        if (keys[40] || keys[83]) {
            player.move("y", (speed * 2));
        }
        if (keys[39] || keys[68]) { //вправо с проверкой на статус прыжка
            if (!player.jumpStatus) {
                player.move("x", (speed * 2));
                player.image = rightMasterImg; //прыжка нет - отображение обычное
            }
            else if (player.jumpStatus) {
                player.move("x", (speed * 2));
                player.image = jumpMasterImg; //прыжок есть - отображение прыжка
            }
        }
        if (keys[37] || keys[65]) { //влево аналогично
            if (!player.jumpStatus) {
                player.move("x", -(speed * 2));
                player.image = leftMasterImg;
            }
            else if (player.jumpStatus) {
                player.move("x", -(speed * 2));
                player.image = jumpMasterImg;
            }
        }

        if (keys[32] && player.jumpStatus === false && !pressed && !countdown) { //прыжок
            countdown = true; //кд
            pressed = true; //был прыжок
            masterJump();
        }

        //проверки на вылет с экрана
        if (player.x + player.image.width / 3 * masterScale > canvas.width)
            player.x = canvas.width - player.image.width / 3 * masterScale;

        if (player.x < 0)
            player.x = 0;

        if (player.y < 50)
            player.y = 50;

        if (player.y + player.image.height * masterScale > canvas.height)
            player.y = canvas.height - player.image.height * masterScale;

    }

    function speedUpFunc() { //эта функция постепенно ускоряет мастера и дает очки
        scoreCount += 5;
        trackSpeed += 0.2;
        windSpeed += 0.1;
    }

    function realSpeedUp() { //эта функция каждые ... секунд значительно увеличивает скорость
        trackSpeed += 0.7;
        scoreCount += 40;
        speedUpsCount += 1;
    }

    //========================================SPA===============================================
    window.onhashchange = switchToStateFromURLHash;

    function switchToStateFromURLHash() {
        let doneDone = false;
        let ifOut;
        var URLHash = window.location.hash;
        let stateStr = URLHash.substr(1);

        if (stateStr != "") { // если закладка непустая, читаем из неё состояние и отображаем
            SPAState = { pagename: 'startpage' };
        }

        switch (stateStr) {

            case "startpage":
                // если переход в меню из запущеной игры
                if (gameStarted) {
                    ifOut = confirm("При уходе со страницы прогресс игры будет утрачен!");
                    if (ifOut) {
                        window.cancelAnimationFrame(updateGame);
                        window.clearInterval(timer2);
                        window.clearInterval(timer3);
                        window.clearInterval(timer4);
                        window.clearInterval(timer5);
                        document.getElementById('wrapper').style.display = 'none';
                        document.getElementById('startscreen').style.display = 'block';
                        document.getElementById('gameoverpage').style.display = 'none';
                        gameAudio.pause();
                        gameAudio.currentTime = 0;
                        crashAudio.pause();
                        crashAudio.currentTime = 0;
                        introAudio.play();
                        doneDone = true;
                        window.navigator.vibrate([200, 100, 300]);
                        scoreCount = 0;
                        trackSpeed = 5;
                        break;
                    }

                    else location.hash = "game";
                    break;
                }

                // если стартовая
                else {
                    document.getElementById('startscreen').style.display = 'block';
                    document.getElementById('wrapper').style.display = 'none';
                    document.getElementById('gameoverpage').style.display = 'none';

                    break;
                }
            // если игра
            case "game":
                document.getElementById('gameoverpage').style.display = 'none';
                document.getElementById('wrapper').style.display = 'block';
                document.getElementById('startscreen').style.display = 'none';
                break;

            // если конец игры
            case "gameover":
                document.getElementById('gameoverpage').style.display = 'block';
                document.getElementById('wrapper').style.display = 'none';
                document.getElementById('startscreen').style.display = 'none';
                break;
        }
        function switchToState(newState) {
            location.hash = stateStr;
        }

        function switchToStartPage() {
            switchToState({ pagename: 'startpage' });
        }

        function switchToGamePage() {
            switchToState({ pagename: 'game' });
        }

        function switchToGameOverPage() {
            switchToState({ pagename: 'gameover' });
        }
    };
    //Общая перезагрузка если игра начата
    window.onbeforeunload = befUnload;

    function befUnload(EO) {
        EO = EO || window.event
        if (gameStarted) {
            EO.returnValue = "В случае перезагрузки или ухода со страницы прогресс игры будет потерян!";
        }
    }
}

function randomizerFunc(min, max) { //рандом
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}