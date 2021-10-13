//назначение первой кнопки 1 отзыва при загрузке страницы
window.onload = () => {
  let buttons = Array.from(document.querySelectorAll('.reviews__buttons-button'));
  previousButton = buttons[1];
  previousButton.classList.add('reviews__buttons-button_status_active');
  getDataLoggedIn('/current-user')
  .then((data) => {
    if(data.message) {
      return;
    }
    userButton.textContent = data.email;
    hideHeaderButtons(openButtons);
    showHeaderButtons(hiddenButtons);
    // popupFormTemplate.reset();
    closePopup(uniquePopup);
  });
  changeAddressBar("");
  // if(localStorage.getItem('token')) {
  //   const token = localStorage.getItem('token');
  
  //   getDataLoggedIn('/current-user', token)
  //   .then((res) => {
  //     if(!res) {
  //       return console.log("Пользователь не найден");
  //     }
  //     userButton.textContent = res.email;
  //     hideHeaderButtons(openButtons);
  //     showHeaderButtons(hiddenButtons);
  //   })
 
  // }
  // localStorage.removeItem('token');
  };

footerButtons.forEach((button) => {
  button.addEventListener('mousemove', (evt) => {
    showMouseEvent(button, evt);
  });
  button.addEventListener('mouseleave', hideMouseEvent);
});

//отрисовка кнопок отзывов
reviews.forEach((review, i, array) => {
  // const buttonTemplate = reviewButtonTemplate;
  const button = generateTemplate(reviewButtonTemplate, '.reviews__buttons-button');
  reviewButtonsWrapper.append(button);
  button.addEventListener('click', clickThumbnail(button, i));
  // reviewButtonsWrapper.append(buttonTemplate);
});

//перекючение отзывов по радиальным кнопкам
// reviewsThumbnails.forEach((thumbnail) => {
//   console.log(thumbnail);
//   thumbnail.addEventListener('click', clickThumbnail(thumbnail));
// })
//кнопки для прокрутки отзывов

arrowButtonLeft.addEventListener('click', translateReviewsLeft);
arrowButtonRight.addEventListener('click', translateReviewsRight);

reviewsContainer.addEventListener('touchstart', initiateTouchMovement);
reviewsContainer.addEventListener('touchmove', continueTouchMovement);
reviewsContainer.addEventListener('touchend', finishTouchMovement);

//обработчики перетагивания (drag-n-drop)
// reviewsContainer.addEventListener('mousedown', dragInitiated);
// reviewsContainer.addEventListener('mousemove', dragInProcess);
// reviewsContainer.addEventListener('mouseup', dragFinish);

//обработчики попапа
openButtons.forEach((button, i) => {
  // console.log(button);
  if(i === 0) {
   return button.addEventListener('click', () => {
     console.log('login button pressed');
    //  fetchData('/login');
    // openPopup(firstPopup)
   });
  }
  if(i === 1) {
    return button.addEventListener('click', () => {
      console.log('register button pressed');
      // openPopup(registerPopup)
      // fetchData('/register');
    });
  }

  // button.addEventListener('click', openPopup(button));
});

// secondMainButton.addEventListener('click', () => {
//   fetchData('/company');
// });

popups.forEach((popup) => {
  const closeButton = popup.querySelector('.popup__button-close');
  const overlay = popup.querySelector('.popup__overlay');
  closeButton.addEventListener('click', () => {
    closePopup(popup)
  });
  overlay.addEventListener('click', () => {
    closePopup(popup)
  });
});

//обработчики кнопок прокрутки
firstMainButton.addEventListener('click', scrollToSection(servicesSection));

//обработчки открытия главной страницы
headerMainButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  changeAddressBar(evt.target.href);
});

//обработчик открытия каталога
headerCatalogueButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  changeAddressBar(evt.target.href);
  // console.log('catalogue button pressed');
  // requestOnServer('/catalogue')
  // .then((data) => {
  //   changeAddressBar('/catalogue');
  //   console.log(data);
  // })
});

//обработчки открытия контактов
headerContactsButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  changeAddressBar(evt.target.href);
  loadHtmlPage('../contacts.html')
  .then((data) => {
    insertPopupContent(data);
    openPopup(uniquePopup);
  })
  // then((data) => {
  //   console.log(data);
  // });
  // fetchData(evt.target.href);
});

//обработчики карточек каталога
services.forEach((service) => {
  service.addEventListener('click', () => {
    // openPopup(uniquePopup);
  });
});

//обработчик выхода пользователя
userLogoutButton.addEventListener('click', () => {
  logout();
});

//обработчик открытия личного кабинета
userButton.addEventListener('click', () => {
  // openPopup(uniquePopup);
});

