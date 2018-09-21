'use strict';

var PIN_WIDTH = 62;
var MAP_WIDTH = 1200;
var OBJECTS_COUNT = 8;

var avatars = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var types = {
  'flat': 'Квартира',
  'palace': 'Дворец',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var checkIns = [
  '12:00',
  '13:00',
  '14:00'
];

var checkOuts = [
  '12:00',
  '13:00',
  '14:00'
];

var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var gallery = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

/* Возвращает случайное число из диапазона */
var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/* Перемешивает элементы массива */
var shuffleArray = function (array) {
  var newArray = [];
  var leftItems = array.slice();
  while (leftItems.length > 0) {
    var index = getRandomInRange(0, leftItems.length - 1);
    var item = leftItems[index];

    newArray.push(item);
    leftItems.splice(index, 1);
  }

  return newArray;
};

/* Возвращает новый массив случайной длины */
var pickRandomItems = function (array) {
  var newArray = [];
  var leftItems = array.slice();
  while (leftItems.length > 0) {
    var index = getRandomInRange(0, leftItems.length - 1);
    /* 0 — не хочу брать этот элемент в массив, 1 — хочу */
    if (getRandomInRange(0, 1) === 1) {
      var item = leftItems[index];
      newArray.push(item);
    }
    leftItems.splice(index, 1);
  }

  return newArray;
};

/* Создаю пустой массив для будущих объектов жилья */
var accommodationsList = [];

/* Генерирую объекты жилья с тестовыми данными и вставляю в массив */
for (var i = 0; i < OBJECTS_COUNT; i++) {
  var randomPositionX = getRandomInRange(PIN_WIDTH / 2, MAP_WIDTH - PIN_WIDTH / 2);
  var randomPositionY = getRandomInRange(130, 630);
  var newAccommodation = {
    author: {
      avatar: avatars[i]
    },
    offer: {
      title: titles[i],
      address: randomPositionX + ', ' + randomPositionY,
      price: getRandomInRange(1000, 1000000),
      type: types,
      rooms: getRandomInRange(1, 5),
      guests: getRandomInRange(0, 3),
      checkIn: checkIns[getRandomInRange(0, checkIns.length - 1)],
      checkOut: checkOuts[getRandomInRange(0, checkOuts.length - 1)],
      features: features,
      description: '',
      photos: gallery
    },
    location: {
      x: randomPositionX,
      y: randomPositionY
    }
  };

  accommodationsList.push(newAccommodation);
}

/* === Метки на карте === */

/* Сохраняю в переменную шаблон с меткой */
var similarPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var pinsFragment = document.createDocumentFragment();

/* Генерирую метки */
var renderPin = function (pinData, pinTemplate) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + pinData.location.x + 'px; top: ' + pinData.location.y + 'px;';
  pinElement.querySelector('img').src = pinData.author.avatar;
  pinElement.querySelector('img').alt = pinData.offer.title;

  return pinElement;
};

/* Сохраняю сгенерированные метки во временную память */
for (var j = 0; j < accommodationsList.length; j++) {
  pinsFragment.appendChild(renderPin(accommodationsList[j], similarPinTemplate));
}

/* Переключаю карту из неактивного состояния в активное */
var welcomeMessage = document.querySelector('.map');
welcomeMessage.classList.remove('map--faded');

/* Вставляю сгенерированные метки в разметку */
var pins = document.querySelector('.map__pins');
pins.appendChild(pinsFragment);

/* === Карточки === */

/* Сохраняю в переменную шаблон с карточкой */
var similarCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

var cardsFragment = document.createDocumentFragment();

/* Генерирую карточки */
var renderCardFromTemplate = function (cardData, cardTemplate) {
  var cardElement = cardTemplate.cloneNode(true);
  /* Заголовок */
  var accommodationTitle = cardElement.querySelector('.popup__title')
  accommodationTitle.textContent = cardData.offer.title;
  /* Адрес */
  var accommodationAddress = cardElement.querySelector('.popup__text--address');
  accommodationAddress.textContent = cardData.offer.address;
  /* Стоимость */
  var accommodationPrice = cardElement.querySelector('.popup__text--price');
  accommodationPrice.textContent = cardData.offer.price + '₽/ночь';
  /* Количество комант и гостей */
  var accommodationCapacity = cardElement.querySelector('.popup__text--capacity');
  accommodationCapacity.textContent = cardData.offer.rooms + ' комнаты для ' + cardData.offer.guests + ' гостей';
  /* Время заезда и выезда */
  var accommodationTime = cardElement.querySelector('.popup__text--time');
  accommodationTime.textContent = 'Заезд после ' + cardData.offer.checkIn + ', выезд до ' + cardData.offer.checkOut;
  /* Описание */
  var accommodationDescription = cardElement.querySelector('.popup__description');
  accommodationDescription.textContent = cardData.offer.description;
  /* Аватарка */
  var userAvatar = cardElement.querySelector('.popup__avatar');
  userAvatar.src = cardData.author.avatar;
  /* Тип жилья */
  var valuesOfTypes = Object.values(types);
  for (var v = 0; v < valuesOfTypes.length; v++) {
    if (cardElement.querySelector('.popup__title').textContent.toUpperCase().indexOf(valuesOfTypes[v].toUpperCase()) !== -1) {
      cardElement.querySelector('.popup__type').textContent = valuesOfTypes[v];
      break;
    }
  }
  /* Фичи */
  var selectedFeatures = pickRandomItems(cardData.offer.features);
  var allFeatures = cardElement.querySelector('.popup__features');
  for (var f = 0; f < allFeatures.children.length; f++) {
    var featureElement = allFeatures.children[f];
    var className = featureElement.className;
    var isExist = false;
    for (var s = 0; s < selectedFeatures.length; s++) {
      if (className.indexOf(selectedFeatures[s]) !== -1) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      featureElement.style.display = 'none';
    }
  }
  /* Галерея */
  var photoPack = shuffleArray(cardData.offer.photos); // Перемешиваю галерею фотографий
  cardElement.querySelector('.popup__photos').innerHTML = ''; // Очищаю контейнер с галереей от потомков (но так делать нехорошо)
  for (var p = 0; p < cardData.offer.photos.length; p++) {
    var img = document.createElement('img');
    img.classList.add('popup__photo');
    img.width = 45;
    img.height = 40;
    img.src = photoPack[p];
    cardElement.querySelector('.popup__photos').appendChild(img);
  }

  return cardElement;
};

/* Сохраняю сгенерированные карточки во временную память */
// for (var c = 0; c < accommodationsList.length; c++) {
//   cardsFragment.appendChild(renderCardFromTemplate(accommodationsList[c], similarCardTemplate));
// }

cardsFragment.appendChild(renderCardFromTemplate(accommodationsList[0], similarCardTemplate));

/* Вставляю сгенерированные карточки в разметку */
var mapFiltersContainer = document.querySelector('.map__filters-container');
document.querySelector('.map').insertBefore(cardsFragment, mapFiltersContainer);
