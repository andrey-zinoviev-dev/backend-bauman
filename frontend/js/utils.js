const mainContainer = document.querySelector('.main');
const mainOverallContainer = mainContainer.querySelector('.overall-container');

const footerButtons = Array.from(document.querySelectorAll('.footer__list-element'));
const scrollButton = document.querySelector('.content__button');
const footer = document.querySelector('.footer');
const footerList = footer.querySelector('.footer__list');

const footerLeftOffset = footer.offsetLeft;
const footerTopOffset = footer.offsetTop;
const footerListTopOffset = footerList.offsetTop;

const rotateDegree = 15;
const perspective = 500;
// let scrollParameter = 0;
// const footerListOffset = footer.querySelector('.footer__list').offsetLeft;
// console.log(footerListOffset);

// const arrowButtons = Array.from(document.querySelectorAll('.reviews__button'));
const arrowButtonLeft = document.querySelector('.reviews__button_type_left');
const arrowButtonRight = document.querySelector('.reviews__button_type_right');
const reviewsSection = document.querySelector('.reviews');
const reviewSectionScroll = reviewsSection.querySelector('.reviews__scroll');
const reviewsContainer = reviewsSection.querySelector('.reviews__wrapper');
const reviews = Array.from(reviewsSection.querySelectorAll('.reviews__review'));

const firstMainButton = document.querySelector('.content__button_first');
const secondMainButton = document.querySelector('.content__button_second'); 
const servicesSection = mainContainer.querySelector('.services');
const backgroundVideo = mainContainer.querySelector('.reviews__review-img');

const headerMainButton = document.querySelector('.header__services-list-element-anchor');
const headerContactsButton = document.querySelector('.header__services-list-element-anchor_contact');
const headerCatalogueButton = document.querySelector('.header__services-list-element-anchor_catalogue');
const headerCoopButton = document.querySelector('.header__services-list-element-anchor_coop');

const servicesDiv = document.querySelector('.services__wrapper');
// const services = Array.from(servicesSection.querySelectorAll('.services__service-new'));
// const companyButton = mainContainer.querySelector('.content__button_second');


// кнопки отзывов
const reviewButtonsWrapper = reviewsSection.querySelector('.reviews__buttons');
const reviewButtonTemplate = document.querySelector('#reviews-thumbnail');

// кнопки под отзывами
const reviewsThumbnailsDiv = document.querySelector('.reviews__buttons');


let firstReviewOffset = 0;
let previousReviewOffset = 0;
let currentReviewOffset = 0;
let followingReviewOffset = 0;
let reviewOrder = 0;

//touch variables
let isTouched = false;
let initialCoord = 0;
let previousTranslate = 0;
let currentTranslate = 0;

//drag variables
let initialDragCoord = 0; 
let movedDragCoord = 0;
let finalDragCoord = 0;
let dragTranslate = 0;
let isDragged = false;
let reviewScroll = 0;

//thumbnails variables
let previousButton = null;
let currentButton;

//попапы и их переменные
const overallContainer = document.querySelector('.overall-container');
const popups = Array.from(document.querySelectorAll('.popup'));

const loginPopup = document.querySelector('.popup');

const registerPopup = document.querySelector('.popup_register');

//попап услуги и его перемененые
const servicePopup = document.querySelector('.popup_service');
const servicePopupForm = servicePopup.querySelector('.popup__service-quantity-form');
const servicePopupOrderInput = servicePopup.querySelector('.popup__service-quantity-form-input');
const servicePopupOrderButtons = Array.from(servicePopup.querySelectorAll('.popup__service-quantity-form-button'));
const servicePopupOrderMinusButton = servicePopup.querySelector('.popup__service-quantity-button-minus');

const servicePopupButton = document.querySelector('.popup__order-submit');

// кнопки логина и регистрации
const openButtons = Array.from(document.querySelectorAll('.header__loggedOut-button'));

//скрытые кнопки
const loggedInButtons = Array.from(document.querySelectorAll('.header__loggedIn-button'));

//кнопка с пользователем 
const userButton = document.querySelector('.header__button-user');
const userButtonSpan = userButton.querySelector('span');

//кнопка выхода пользователя
const userLogoutButton = document.querySelector('.header__button-user-logout');

//секция корзины заказа
const userCart = document.querySelector('.cart');
const userCartList = userCart.querySelector('.cart__list');

//кнопка корзины пользователя
const userCartButton = document.querySelector('.header__services-list-element-button-user-cart');
const userCartSpan = userCartButton.querySelector('.header__services-list-element-button-span');

let userCartOrders = [];

//уникальный попап
const uniquePopup = document.querySelector('.popup_unique');
const uniquePopupContainer = uniquePopup.querySelector('.popup__container');
const uniquePopupRootDiv = uniquePopupContainer.querySelector('.popup__text-wrapper');

// const uniquePopupHeadline = uniquePopup.querySelector('.popup__headline');
// const uniquePopupLists = uniquePopup.querySelector('.popup__list');
// const uniquePopupPara = uniquePopup.querySelector('.popup__para');


//шаблоны для уникального попапа
const headlineTemplate = document.querySelector('#popup-headline');
const paraTemplate = document.querySelector('#popup-para');
const anchorTemplate = document.querySelector('#popup-anchor');
const popupButtonTemplate = document.querySelector('#popup__button-submit');


//шаблоны личнего кабинета
const personalSpaceHeadlineTemplate = document.querySelector('#perosnal-space__headline');
const personalSpaceParaTemplate = document.querySelector('#personal-space__para');
const personalSpaceListTemplate = document.querySelector('#personal-space__list');
const personalSpaceListElementTemplate = document.querySelector('#personal-space__list-element');
const personalSpaceOrdersTemplate = document.querySelector('#personal-space__orders');
const personalSpaceOrderTemplate = document.querySelector('#personal-space__order');
const personalSpaceContentTextWrapperTemplate = document.querySelector('#personal-space__content-text-wrapper');

//шаблон услуги компании
const serviceTemplate = document.querySelector('#services__service-new');

//шаблон элемента списка корзины
const cartListElementTemplate = document.querySelector('#cart__list-element');

//объект для данных для маршрутизации на стороне клиента
const htmlToRender = {
  
}

//объект для данных заказа
let orderToMake = {
  orderContent: "",
  timeOfOrder: "",
  quantity: 0,
};

//пользователь
let user;

//личный кабинет
const userSection = document.querySelector('.dashboard');
const userSegments = Array.from(userSection.querySelectorAll('.dashboard__segment-wrapper'));
const userProfileSegment = userSection.querySelector('.dashboard__list-element-user-profile');
const dashboardButtonSegments = Array.from(userSection.querySelectorAll('.dashboard__button'));
const activeOrdersSpan = userSection.querySelector('.dashboard__button-span_active');
const pendingOrdersSpan = userSection.querySelector('.dashboard__button-span_pending');
const finishedOrdersSpan = userSection.querySelector('.dashboard__button-span_finished');
const canceledOrdersSpan = userSection.querySelector('.dashboard__button-span_canceled');

//переменные личного кабинета
let dashboardSegments = [];
let coloredDivSegments = [];
let profilePartsToRender = [];
let profileOrdersToRender = [];
let userOrders = {};

//попап добавления заказа
// const orderPopupForm = document.querySelector('.popup__service-quantity-form');

reviews.forEach((child, i, array) => {
  if(i < 0) {
    return;
  }
  if(i > array.length - 1) {
    return;
  }
  if(i === 0) {
    // console.log(array[i + 2]);
    return firstReviewOffset = array[i + 2].offsetLeft - array[i + 1].offsetLeft;
  }
  // console.log(array[i], array[i].offsetLeft - array[i - 1].offsetLeft);
  previousReviewOffset = array[i - 1].offsetLeft;
  followingReviewOffset = array[i].offsetLeft;
  currentReviewOffset = followingReviewOffset - previousReviewOffset;
});

function showMouseEvent(logo, evt) {
  // if(evt.target.classList.contains('footer__list-element-logo')) {
  //   return;
  // }
  const logoHeight = logo.clientHeight;
  const logoWidth = logo.clientWidth;
  
  const logoXCoordinate = evt.pageX - footerLeftOffset - logo.offsetLeft - logoWidth/2;
  const logoYCoordinate = evt.pageY - footerTopOffset - footerListTopOffset - logo.offsetTop - logoHeight/2;
  
  const rotateX = rotateDegree*logoYCoordinate/(logoHeight/2);
  const rotateY = rotateDegree*logoXCoordinate/(logoWidth/2);
  // console.log(logoXCoordinate, logoYCoordinate);
  // console.log(evt.target.offsetLeft);
  // console.log(evt.pageX - footerLeftOffset - evt.target.offsetLeft - logoWidth/2, evt.pageY - footerTopOffset - evt.target.offsetTop - logoHeight/2);
  activateTiltEffect(rotateX, rotateY, logo);
};

function hideMouseEvent(evt) {
  deactivateTiltEffect(evt.target);
};

function activateTiltEffect(rotateX, rotateY, element) {
  // console.log(xCoordinate, yCoordinate);
  element.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.2)`;
}

function deactivateTiltEffect(element) {
  element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;
  element.style.transition = 'transform 0.25s ease-in-out';
  setTimeout(() => {
    element.style.transition = 'none';
  }, 250);
}

function translateReviewsLeft() {
  previousButton = reviewsThumbnailsDiv.children[reviewOrder + 1];
  reviewOrder -= 1;
  
  if(reviewOrder < - 1) {
    reviewOrder = reviews.length - 2;
  }
  switchThumbnail(reviewOrder);
  return reviewsContainer.style.transform = `translateX(${-currentReviewOffset * reviewOrder}px)`;
}

function translateReviewsRight() {
  previousButton = reviewsThumbnailsDiv.children[reviewOrder + 1];
  reviewOrder += 1;
  
  if(reviewOrder >= reviews.length - 1) {
    reviewOrder = -1;
    // return reviewsContainer.style.transform = `translateX(${currentReviewOffset})`
  }
  switchThumbnail(reviewOrder);
  return reviewsContainer.style.transform = `translateX(${-currentReviewOffset * reviewOrder}px)`;
}

//touch functions
function initiateTouchMovement(evt) {
  // console.log('move is started');
  isTouched = true;
  initialCoord = evt.touches[0].clientX;
}

function continueTouchMovement(evt) {
  if(isTouched) {
    currentTranslate = evt.touches[0].clientX - initialCoord + previousTranslate;
    reviewsContainer.style.transform = `translateX(${currentTranslate}px)`;
    if(reviewOrder <= -1) {
      // isTouched = false;
      if(currentTranslate > previousTranslate) {
        isTouched = false;
      }
    }
    if(reviewOrder >= reviews.length - 2) {
      // isTouched = false
      if(currentTranslate < previousTranslate) {
        isTouched = false;
      }
    }
  }
}

function finishTouchMovement() {
  isTouched = false;
  const movedBy = currentTranslate - previousTranslate;
  if(movedBy < - 100) {
    reviewOrder += 1;

  }
  if(movedBy > 100) {
    reviewOrder -= 1;
    
  }
  currentTranslate = reviewOrder * -currentReviewOffset;
  previousTranslate = currentTranslate;
  reviewsContainer.style.transform = `translateX(${currentTranslate}px)`;
};

//фукнции для перетягивания контейнера с отзывами (drag-n-drop)
function dragInitiated(evt) {
  reviewsContainer.style.cursor = 'grabbing';
  initialCoord = evt.clientX;
  isDragged = true;
  reviewScroll = reviewSectionScroll.scrollLeft;
  // return reviewsContainer.addEventListener('mousemove', dragInProcess);
}

function dragInProcess(evt) {
  if(!isDragged) {
    return;
  }
  movedDragCoord = evt.clientX;
  dragTranslate = movedDragCoord - initialCoord;
  reviewSectionScroll.scrollLeft = -dragTranslate + reviewScroll;
  // return moveResult;
}

function dragFinish() {
  isDragged = false;
  reviewsContainer.style.cursor = 'grab';
  // return reviewsContainer.style.transform = `translateX(${dragTranslate}px)`;
  // reviewsContainer.removeEventListener('mousemove', dragInProcess);
  // return finalDragCoord = movedDragCoord - initialCoord + dragTranslate;
}

// function dragContainer(pixels) {
//   return reviewsContainer.style.transform = `translateX(${pixels}px)`;
// }

function generateTemplate(element, selector) {
  const template = element.content.cloneNode(true).querySelector(selector);
  // console.log(template);
  return template;
}

function switchThumbnail(i) {
  const button = reviewsThumbnailsDiv.children[i + 1];
  button.classList.add('reviews__buttons-button_status_active');
  previousButton.classList.remove('reviews__buttons-button_status_active');
  previousButton = button;
  // console.log(evt.target);
}

function clickThumbnail(button, i) {
  return () => {
    
    currentButton = button;
    currentButton.classList.add('reviews__buttons-button_status_active');

    previousButton.classList.remove('reviews__buttons-button_status_active');
    previousButton = button;

    reviewOrder = i - 1;
    return reviewsContainer.style.transform = `translateX(${-currentReviewOffset * reviewOrder}px)`;
  }
}

function openPopup (popup) {
  // console.log(button);
    popup.classList.add('popup_opened');
    overallContainer.classList.add('overall-container_blurred');
    // console.log(button);
}

function closePopup (popupSection) {
    popupSection.classList.remove('popup_opened');
    overallContainer.classList.remove('overall-container_blurred');
}

//прокручивание по нажатию на кнопку
function scrollToSection(section) {
  window.scrollTo({top: section.offsetTop, behavior: "smooth"});
}

//валидация формы
function checkInputsOnInvalidity(inputs) {
  return inputs.some((input) => {
    return !input.validity.valid;
  })
}

function changeFormButtonStatus(inputs, button) {
  if(checkInputsOnInvalidity(inputs)) {
    button.disabled = true;
  } else {
    button.disabled = false;
  }
}

//запросы на сервер
function requestOnServer(route) {
  return fetch(route)
  .then((res) => {
    return res.json();
  })
};

function postOnServer(route, data) {
  // console.log(data);
  return fetch(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((res) => {
    return res.json();
  })
}

//функция запроса данных пользователя
function getDataLoggedIn(route) {
  return fetch(route)
  .then((res) => {
    return res.json();
  })
};

//функция изменения полей элемента базы данных
function changeElementData(route, data) {
  return fetch(route, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((res) => {
    return res.json();
  })
};

//фукнция скрытия эелементов после логина-регистрации
function hideHeaderButtons(buttons) {
  buttons.forEach((button) => {
    button.classList.add('header__services-list-element-button_hidden');
  })
}

//функция показа элементов до логина-регистрации
function showHeaderButtons(buttons) {
  buttons.forEach((button) => {
    button.classList.remove('header__services-list-element-button_hidden');
  })
}

//функция выхода пользователя из системы
function logout() {
  requestOnServer('/logout-user')
  .then((data) => {
    console.log(data);
  })

  // hideHeaderButtons(hiddenButtons);
  // showHeaderButtons(openButtons);
}

//функция изменения адресной строки
function changeAddressBar(route) {
  return window.history.pushState({}, route, route);
}

// function fetchData(route) {
//   // openPopup(uniquePopup);
//   requestOnServer(route)
//   .then((data) => {
  
//     Array.from(uniquePopupContainer.children).forEach((child) => {
//       if(Array.from(child.classList).includes('popup__button-close')) {
//         return;
//       }
//       // console.log(Array.from(child.classList));
//       uniquePopupContainer.removeChild(child);
//     });

//     const objectInners = Object.entries(data);

//     for (const [key, value] of objectInners) {
//       if(key === 'headline') {
//         const popupHeadlineTemplate = generateTemplate(headlineTemplate, '.popup__headline');
//         popupHeadlineTemplate.textContent = value;
//         uniquePopupContainer.append(popupHeadlineTemplate);
//       }
//       if(key === 'content') {
//         const popupParaTemplate = generateTemplate(paraTemplate, '.popup__para');
//         popupParaTemplate.textContent = value;
//         uniquePopupContainer.append(popupParaTemplate);
//       }
//       if(key === "form" && value === "register") {
//         const dataToPost = {};

//         let validationMessage;

//         const popupFormTemplate = generateTemplate(formRegisterTemplate, '.popup__form');
        
//         const serverErrorSpan = popupFormTemplate.querySelector(('.popup__form-span-server'));

//         const formInputs = Array.from(popupFormTemplate.querySelectorAll('.popup__form-input'));

//         const formButton = popupFormTemplate.querySelector('.popup__form-button');

//         formInputs.forEach((input, index, array) => {
//           changeFormButtonStatus(array, formButton)
//           input.addEventListener('input', (evt) => {
            
//             const inputSpan = evt.target.nextElementSibling;
//             changeFormButtonStatus(array, formButton);
//             if(!evt.target.validity.valid) {
//               if(evt.target.validity.tooShort) {
//                 validationMessage = 'Введено менее 3 символов';
//               }
//               if(evt.target.validity.typeMismatch) {
//                 if(evt.target.name === "email") {
//                   validationMessage = 'Введите почту';
//                 };
//                 if(evt.target.name === "password") {
//                   validationMessage = 'Введите пароль необходимого типа';
//                 }
//               }
//               inputSpan.textContent = validationMessage;
//             } else {
//               inputSpan.textContent = '';
//             }
            
//             dataToPost[evt.target.name] = evt.target.value;
//           });
//         });

//         formButton.addEventListener('click', (evt) => {
//           evt.preventDefault();
//           postOnServer('/register', dataToPost)
//           .then((data) => {
//             if(data.message) {
//               return serverErrorSpan.textContent = data.message;
//             }
//             // localStorage.setItem('token', data.payload);
//             return console.log(data);
//             // hideHeaderButtons(openButtons);
//             // showHeaderButtons(hiddenButtons);
//             // popupFormTemplate.reset();
//             // closePopup(uniquePopup);
//           })
//           .then(() => {
//             // const token = localStorage.getItem('token');
//             // if(!token) {
//             //   return console.log('no');
//             // }
//             getDataLoggedIn('/current-user')
//             .then((res) => {
//               hideHeaderButtons(openButtons);
//               showHeaderButtons(hiddenButtons);
//               popupFormTemplate.reset();
//               userButton.textContent = res.email;
//               closePopup(uniquePopup);
//             });
//           })
//         });
//         uniquePopupContainer.append(popupFormTemplate);
//       }
//       if(key === 'form' && value === 'login') {
//         const dataToPost = {};

//         let validationMessage;

//         const popupFormTemplate = generateTemplate(formTemplate, '.popup__form');
        
//         const serverErrorSpan = popupFormTemplate.querySelector(('.popup__form-span-server'));
        
//         const formInputs = Array.from(popupFormTemplate.querySelectorAll('.popup__form-input'));

//         const formButton = popupFormTemplate.querySelector('.popup__form-button');

//         formInputs.forEach((input, index, array) => {
          
//           changeFormButtonStatus(array, formButton);
//           input.addEventListener('input', (evt) => {

//             serverErrorSpan.textContent = "";

//             const inputSpan = evt.target.nextElementSibling;
//             changeFormButtonStatus(array, formButton);
//             if(!evt.target.validity.valid) {
              
//               if(evt.target.validity.tooShort) {
//                 validationMessage = "Введена слишком короткая запись";
//               }
//               if(evt.target.validity.typeMismatch) {
//                 if(evt.target.name === "email") {
//                   validationMessage = 'Введите почту';
//                 }
//                 if(evt.target.name === "password") {
//                   validationMessage = 'Введите пароль необходимого типа';
//                 }
//                 // validationMessage = "Необходим пароль, соттветствующий правилам";
//               }
//               inputSpan.textContent = validationMessage;;
//             } else {
//               inputSpan.textContent = '';
//             }
            
//             dataToPost[evt.target.name] = evt.target.value;
//           });
//         });
        
//         formButton.addEventListener('click', (evt) => {
//           evt.preventDefault();
//           postOnServer('/login', dataToPost)
//           .then((data) => {
//             if(data.message) {
//               return serverErrorSpan.textContent = data.message;
//             } else {
//               // localStorage.setItem("token", data.payload)
//               return data;
//             }
//           })
//           .then(() => {
//             // if(!localStorage.getItem("token")) {
//             //   return console.log('no');
//             // }
//             // const token = localStorage.getItem("token");
//             getDataLoggedIn('/current-user')
//             .then((data) => {
//               userButton.textContent = data.email;
//               hideHeaderButtons(openButtons);
//               showHeaderButtons(hiddenButtons);
//               popupFormTemplate.reset();
//               closePopup(uniquePopup);
//             })
//           });
//         });

//         uniquePopupContainer.append(popupFormTemplate);
//       }
//       if(typeof(value) === 'object' && value.length >= 1 && key !== "form") {
//         const popupListTemplate = generateTemplate(listTemplte, '.popup__list');
//         // if(key === "links") {
//         //   value.forEach((element) => {
//         //     const popupButtonTemplate = generateTemplate(anchorTemplate, '.popup__anchor');
//         //     popupButtonTemplate.textContent = element;
//         //     uniquePopupContainer.append(popupButtonTemplate);
//         //   })
//         // }
//         value.forEach((element) => {
//           //здесь сделать генерацию ссылок
//           const popupListElementTemplate = generateTemplate(listELementTemplate, '.popup__list-element');
//           popupListElementTemplate.textContent = element;
//           if(key === 'links') {
//             // console.log(value);
//             popupListElementTemplate.textContent = '';
//             const linkTemplate = generateTemplate(anchorTemplate, '.popup__anchor');
//             linkTemplate.textContent = element;
//             popupListElementTemplate.append(linkTemplate);
//           }
          
//           popupListTemplate.append(popupListElementTemplate);
//         });
//         // popupListElementTemplate.textContent = value;
//         // popupListTemplate.append(popupListElementTemplate);

//         uniquePopupContainer.append(popupListTemplate);
//       }

//     }
//     openPopup(uniquePopup);
//   });

// }

function loadHtmlPage(page) {
  // console.log(uniquePopup);
  return fetch(page)
  .then((res) => {
    return res.text();
  })
}

function insertPopupContent(data) {
  Array.from(uniquePopupContainer.children).forEach((child) => {
    if(Array.from(child.classList).includes('popup__button-close')) {
      return;
    }
    if(Array.from(child.classList).includes('popup__text-wrapper')) {
      return;
    }
    uniquePopupContainer.removeChild(child);
  });

  uniquePopupRootDiv.innerHTML = data;
  // uniquePopupContainer.append(data);
}

function sendDataToServerTest(route, data) {
  console.log(route, data);
}