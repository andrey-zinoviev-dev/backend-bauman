// const { showCurrentUser } = require("../../controllers/getControllers");

//назначение первой кнопки 1 отзыва при загрузке страницы
window.onload = () => {
  console.log(window.location.pathname);
  let buttons = Array.from(document.querySelectorAll('.reviews__buttons-button'));
  previousButton = buttons[1];
  previousButton.classList.add('reviews__buttons-button_status_active');
  getDataLoggedIn('/current-user')
  .then((data) => {
    if(data.message) {
      return;
    }

    userButtonSpan.textContent = data.name.charAt(0);
    userProfileSegment.textContent = data.name;
    hideHeaderButtons(openButtons);
    showHeaderButtons(loggedInButtons);
    closePopup(uniquePopup);
  });

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
    //  fetchData('/login');
    openPopup(loginPopup)
   });
  }
  if(i === 1) {
    return button.addEventListener('click', () => {
      // console.log('register button pressed');
      openPopup(registerPopup);
      // fetchData('/register');
    });
  }

  // button.addEventListener('click', openPopup(button));
});

// secondMainButton.addEventListener('click', () => {
//   fetchData('/company');
// });

popups.forEach((popup, i, array) => {
  let dataToPost = {};
  const popupForm = popup.querySelector('.popup__form');
  if(popupForm !== null) {
    const popupFormInputs = Array.from(popupForm.querySelectorAll('.popup__form-input'));
    const popupFormButton = popupForm.querySelector('.popup__form-button');

    popupFormInputs.forEach((input) => {
      input.addEventListener('input', (evt) => {
        dataToPost[evt.target.name] = evt.target.value;
      })
    });

    popupFormButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      Array.from(evt.target.classList).includes('popup__form-button_login') ? 
      postOnServer('/login', dataToPost)
      .then(() => {
        getDataLoggedIn('/current-user')
        .then((data) => {

          userButtonSpan.textContent = data.name.charAt(0);
          userProfileSegment.textContent = data.name;
          showHeaderButtons(loggedInButtons);

          //подумать, как скрывать и раскрывать кнопки элегантнее
          hideHeaderButtons(openButtons);

          closePopup(popup);
        })
      })
       
      : 

      postOnServer('/register', dataToPost)
      .then(() => {
        getDataLoggedIn('/current-user')
        .then((data) => {
          // userButton.textContent = data.email;
          userButtonSpan.textContent = data.name.charAt(0);
          userProfileSegment.textContent = data.name;
          showHeaderButtons(loggedInButtons);

          hideHeaderButtons(openButtons);
          
          closePopup(popup);
        })
      })
    })
  }
  // const submitButton = popup.querySelector('.popup__form-button');
  const closeButton = popup.querySelector('.popup__button-close');
  const overlay = popup.querySelector('.popup__overlay');
  
  // popupFormInputs.forEach((input) => {
  //   input.addEventListener('input', (evt) => {
  //     console.log(evt.target.value);
  //   });
  // })

  closeButton.addEventListener('click', () => {
    closePopup(popup)
  });
  overlay.addEventListener('click', () => {
    closePopup(popup)
  });
  
  // if(i === 0 && submitButton !== null) { 
  //   submitButton.addEventListener('click', () => {
  //     // console.log('post on server login info');
  //   });
  // }
  // if(i === 1 && submitButton !== null) {
  //   submitButton.addEventListener('click', () => {
  //     // console.log('post on server register info');
  //   })
  // }
});

//обработчики кнопок прокрутки
firstMainButton.addEventListener('click',() => {
  scrollToSection(servicesSection)
});

//обработчки открытия главной страницы
headerMainButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  // changeAddressBar(evt.target.href);
});

//обработчик прокрутки до каталога
headerCatalogueButton.addEventListener('click', () => {
  scrollToSection(servicesSection)
});

//обработчки прокрутки до сотрудничества
headerCoopButton.addEventListener('click', (evt) => {
  // evt.preventDefault();
  scrollToSection(footer);
})

//обработчки прокрутки до контактов
headerContactsButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  scrollToSection(footer);
});

//обработчики карточек каталога
services.forEach((service) => {
  service.addEventListener('click', () => {
    // openPopup(uniquePopup);
  });
});

// //обработчик отправки данных для входа пользователя
// loginPopupSubmitButton.addEventListener('click', () => {

// })

//обработчик выхода пользователя
userLogoutButton.addEventListener('click', () => {
  logout();
});

//обработчик открытия личного кабинета
userButton.addEventListener('click', () => {
  userProfileSection.classList.toggle('dashboard_opened');
  // openPopup(uniquePopup);
  
  // changeAddressBar(`/user/${userButton.textContent}`);

  //это супер важно- это загрузка новой части страницы для маршрутизации, понадобится позже
  // loadHtmlPage('../userpage.html')
  // .then((data) => {
  //   mainOverallContainer.classList.add('main_padding');
  //   mainOverallContainer.innerHTML = data;
  // })
  // mainContainer.innerHTML = '';
});

