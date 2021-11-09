// const { showCurrentUser } = require("../../controllers/getControllers");

// const { showUserOrders } = require("../../controllers/getControllers");

//назначение первой кнопки 1 отзыва при загрузке страницы
window.onload = () => {
  if(window.location.pathname.includes('user')) {
    console.log('profile page is selected');
  }

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

    //создание объекта с информацией о пользователе
    user = data;

    //добавление элементов для профиля в личном кабинете
    // for (let key in user) {
    //   //элементы меню профиля
    //   if(key === "email" || key === "name") {
    //     profilePartsToRender.push(user[key]);
    //   }

    //   //элементы меню заказов
    //   // if(key.includes('Orders')) {
    //   //   userOrders[key] = user[key];
    //   // }
    // };
    
    hideHeaderButtons(openButtons);
    showHeaderButtons(loggedInButtons);
    closePopup(uniquePopup);
  });

  //запрос данных о заказ вошедшего пользователя
  getDataLoggedIn('/show-orders')
  .then((data) => {
    if(data.message) {
      return;
    }
    //временное обнуление объекта
    userOrders = {};

    data.result.forEach((order, i ,array) => {

      userOrders[order.status] = array.filter((element) => {
        return element.status === order.status;
      });

    });
    //добавлять заказы в бд пользователя через сервер, а не в клиенте
    for (let key in userOrders) {
      user.totalOrders += userOrders[key].length;
    }
    // return data.result.forEach((element) => {
      
    //   // if(element.status === "canceled") {
    //   //   userOrders[element.status] = [].push(element);
    //   // }
    //   // if(element.status === "active") {
    //   //   userOrders[element.status] = [].push(element);
    //   // }
    // })
    // return userOrders = data.result;
  })

  
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

          user = data;
          //создание элементов профиля пользователя для рендера в личном кабинете в поле профиль
          // for (let key in user) {
          //   if(key === 'email' || key === 'name') {
          //     profilePartsToRender.push(user[key]);
          //   }
          // }

          //загрузка данных о заказах пользователя
          getDataLoggedIn('/show-orders')
          .then((data) => {
            if(data.message) {
              return;
            }
            
            data.result.forEach((element, i, array) => {
              userOrders[element.status] = array.filter((order) => {
                return order.status === element.status; 
              });
            });

          });
          closePopup(popup);
        });
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
          
          //озапись данных объекта пользователя
          user = data;

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
  service.querySelector('.services__service-new-button').addEventListener('click', () => {
    servicePopup.querySelector('.popup__headline').textContent = service.querySelector('.services__service-new-headline').textContent;
    servicePopup.querySelector('.popup__button-submit').addEventListener('click', () => {
      postOnServer('/add-service', {
        title: service.querySelector('.services__service-new-headline').textContent,
        time: `${new Date()}`,
      })
      .then((data) => {

      })
    })
    openPopup(servicePopup);
    
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
  userSection.classList.toggle('dashboard_opened');
});

//обработчики сегментов личного кабинета

userSegments.forEach((segment, index, array) => {
  dashboardSegments.push(segment.querySelector('.dashboard__list_colored-bg'));
  
  const colorDivDense = segment.querySelector('.dashboard__list-element-circle_color-dense');
  const colorDivSemi = segment.querySelector('.dashboard__list-element-circle_color-semi');

  if(colorDivDense && colorDivSemi) {
    coloredDivSegments.push(colorDivDense);
    coloredDivSegments.push(colorDivSemi);
  }

  segment.addEventListener('click', () => {

    dashboardSegments.forEach((dashboardSegment) => {
      dashboardSegment.classList.remove('dashboard__list_active');
    });

    dashboardButtonSegments.forEach((dashBoardButtonSegment) => {
      dashBoardButtonSegment.classList.remove('dashboard__button_active');
    });

    //
    coloredDivSegments.forEach((coloredDiv) => {
      if(Array.from(coloredDiv.classList).includes('dashboard__list-element-circle_color-dense')) {
        coloredDiv.classList.remove('dashboard__list-element-circle_color-dense_active');
      } else {
        coloredDiv.classList.remove('dashboard__list-element-circle_color-semi_active');
      }
    });
    
    const segmentButtons = Array.from(segment.querySelectorAll('.dashboard__button'));
    segmentButtons.forEach((segmentButton) => {
      segmentButton.classList.add('dashboard__button_active');
    });  

    const coloredDivDense = segment.querySelector('.dashboard__list-element-circle_color-dense');

    const coloredDivSemi = segment.querySelector('.dashboard__list-element-circle_color-semi');

    if(coloredDivDense && coloredDivSemi) {
      coloredDivDense.classList.add('dashboard__list-element-circle_color-dense_active');
      coloredDivSemi.classList.add('dashboard__list-element-circle_color-semi_active');
    }

    segment.querySelector('.dashboard__list_colored-bg').classList.add('dashboard__list_active');

    //загрузка страницы личного кабинета
    loadHtmlPage('./userpage.html')
    .then((page) => {
      // let previousButton;
      changeAddressBar(`/user-space`);

      mainContainer.classList.add('main_padding');
      
      mainContainer.innerHTML = page;

      const personalSpaceContentDiv = mainContainer.querySelector('.personal-space__content');

      const privateSpaceButtons = Array.from(document.querySelectorAll('.personal-space__list-element-button'));

      let firstButton;

      privateSpaceButtons.forEach((button, i, array) => {
        button.addEventListener('click', () => {

          firstButton.classList.remove('personal-space__list-element-button_active');
          button.classList.add('personal-space__list-element-button_active');
          firstButton = button;

          personalSpaceContentDiv.innerHTML = "";

          if(i === 0) {
            //создание пунктов раздела Профиль в личном кабинете
            // profilePartsToRender.forEach((part) => {

            //   const paraTemplateGenerated = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
            //   paraTemplateGenerated.textContent = part;
            //   personalSpaceContentDiv.append(paraTemplateGenerated);
      
            // });
            const headlineTemplateGenerated = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
            headlineTemplateGenerated.textContent = `Здравствуйте, ${user.name}!`;
            personalSpaceContentDiv.append(headlineTemplateGenerated);
          }
          if(i === 1) {
            //создание пунктов раздела Заказы в личном кабинете
            const paraTemplate = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
            paraTemplate.textContent = "Ваши заказы";
            personalSpaceContentDiv.append(paraTemplate);
            
            for (let key in userOrders) {
              const personalHeadlineTemplate = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
              const listTemplate = generateTemplate(personalSpaceListTemplate, '.personal-space__list');
             
              if(key.includes('active')) {
                userOrders[key].forEach((element) => {
                  const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                  listElementTemplate.textContent = element.orderContent;
                  listTemplate.append(listElementTemplate);
                });

                personalHeadlineTemplate.textContent = 'Активные заказы';
                listTemplate.classList.add('personal-space__list_active-orders');
              }
              if(key.includes('pending')) {
                userOrders[key].forEach((element) => {
                  const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                  listElementTemplate.textContent = element.orderContent;
                  listTemplate.append(listElementTemplate);
                });

                personalHeadlineTemplate.textContent = 'Заказы в ожидании';
                listTemplate.classList.add('personal-space__list_pending-orders');
              }
              if(key.includes('finished')) {
                userOrders[key].forEach((element) => {
                  const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                  listElementTemplate.textContent = element.orderContent;
                  listTemplate.append(listElementTemplate);
                });

                personalHeadlineTemplate.textContent = 'Завершенные заказы';
                listTemplate.classList.add('personal-space__list_finished-orders');
              }
              if(key.includes('canceled')) {
                userOrders[key].forEach((element) => {
                  const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                  listElementTemplate.textContent = element.orderContent;
                  listTemplate.append(listElementTemplate);
                });

                personalHeadlineTemplate.textContent = 'Отмененные заказы';
                listTemplate.classList.add('personal-space__list_canceled-orders');
              }
              personalSpaceContentDiv.append(personalHeadlineTemplate);
              personalSpaceContentDiv.append(listTemplate);
            }
            // for(let key in userOrders) {
            //   const listTemplate = generateTemplate(personalSpaceListTemplate, '.personal-space__list');
            //   const listELementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          
            //   if(key.includes('active')) {
            //     listTemplate.classList.add('personal-space__list_active-orders');
            //     listELementTemplate.textContent = userOrders[key];
            //     listTemplate.append(listELementTemplate);
            //   }

            //   if(key.includes('pending')) {
            //     listTemplate.classList.add('personal-space__list_pending-orders');
            //     listELementTemplate.textContent = userOrders[key];
            //     listTemplate.append(listELementTemplate);
            //   }

            //   if(key.includes('finished')) {
            //     listTemplate.classList.add('personal-space__list_finished-orders');
            //     listELementTemplate.textContent = userOrders[key];
            //     listTemplate.append(listELementTemplate);
            //   }

            //   if(key.includes('canceled')) {
            //     listTemplate.classList.add('personal-space__list_canceled-orders');
            //     listELementTemplate.textContent = userOrders[key];
            //     listTemplate.append(listELementTemplate);
            //   }

            //   personalSpaceContentDiv.append(listTemplate);
            // };
          }
          if(i === 2) {
            console.log('показать историю')
          }
        });
      });

      if(index === 0) {

        firstButton = mainContainer.querySelector('.personal-space__list-element-button_profile');
        firstButton.classList.add('personal-space__list-element-button_active');
        
        const headlineTemplateGenerated = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
        const paraTemplateGenerated = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');

        // headlineTemplateGenerated.textContent = `Здравствуйте, ${user.name}!`;
        personalSpaceContentDiv.append(headlineTemplateGenerated);
        
        //теперь добавлять данные на страницу профиля в личном кабинете
        console.log(user);
        // let counter = 0;

        // for (let key in userOrders) {
        //   counter += userOrders[key].length;
        //   console.log(counter);
        // };
        // paraTemplateGenerated.textContent = 
        // profilePartsToRender.forEach((part) => {

        //   const paraTemplateGenerated = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
        //   paraTemplateGenerated.textContent = part;
        //   return personalSpaceContentDiv.append(paraTemplateGenerated);
  
        // });

        // headline.textContent = user.name;
        // return mainContainer.querySelector('.personal-space__list-element-button_profile').classList.add('personal-space__list-element-button_active');
      }
      if(index === 1) {

        firstButton = mainContainer.querySelector('.personal-space__list-element-button_orders');
        firstButton.classList.add('personal-space__list-element-button_active');

        const paraTemplate = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
        paraTemplate.textContent = "Ваши заказы";
        personalSpaceContentDiv.append(paraTemplate);
        
        for (let key in userOrders) {

          const personalHeadlineTemplate = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
          const listTemplate = generateTemplate(personalSpaceListTemplate, '.personal-space__list');

          if(key.includes('active')) {
           
            userOrders[key].forEach((element) => {
              const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
              listElementTemplate.textContent = element.orderContent;
              listTemplate.append(listElementTemplate);
            });

            personalHeadlineTemplate.textContent = 'Активные заказы';
            listTemplate.classList.add('personal-space__list_active-orders');
            // listTemplate.textContent =
          }
          if(key.includes('pending')) {
            userOrders[key].forEach((element) => {
              const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
              listElementTemplate.textContent = element.orderContent;
              listTemplate.append(listElementTemplate);
            });
            personalHeadlineTemplate.textContent = 'Заказы в ожидании';
            listTemplate.classList.add('personal-space__list_pending-orders');
          }
          if(key.includes('finished')) {
            userOrders[key].forEach((element) => {
              const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
              listElementTemplate.textContent = element.orderContent;
              listTemplate.append(listElementTemplate);
            });
            personalHeadlineTemplate.textContent = 'Завершенные заказы';
            listTemplate.classList.add('personal-space__list_finished-orders');
          }
          if(key.includes('canceled')) {
            userOrders[key].forEach((element) => {
              const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
              listElementTemplate.textContent = element.orderContent;
              listTemplate.append(listElementTemplate);
            });
            personalHeadlineTemplate.textContent = 'Отмененные заказы';
            listTemplate.classList.add('personal-space__list_canceled-orders');
          }
          personalSpaceContentDiv.append(personalHeadlineTemplate);
          personalSpaceContentDiv.append(listTemplate);
        }

        // const activeOrders = userOrders.filter((element) => {
        //   return element.status === 'active';
        // });

        // const pendingOrders = userOrders.filter((element) => {
        //   return element.status === 'pending';
        // });

        // const finishedOrders = userOrders.filter((element) => {
        //   return element.status === 'finished';
        // });
        
        // const canceledOrders = userOrders.filter((element) => {
        //   return element.status === 'canceled';
        // });

        
        // for (let key in userOrders) {
        //   const listTemplate = generateTemplate(personalSpaceListTemplate, '.personal-space__list');
        //   const listELementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');

        //   if(key.includes('active')) {
        //     listTemplate.classList.add('personal-space__list_active-orders');
        //     listELementTemplate.textContent = userOrders[key];
        //     listTemplate.append(listELementTemplate);
        //   }
        //   if(key.includes('pending')) {
        //     listTemplate.classList.add('personal-space__list_pending-orders');
        //     listELementTemplate.textContent = userOrders[key];
        //     listTemplate.append(listELementTemplate);
        //   }
        //   if(key.includes('finished')) {
        //     listTemplate.classList.add('personal-space__list_finished-orders');
        //     listELementTemplate.textContent = userOrders[key];
        //     listTemplate.append(listELementTemplate);
        //   }
        //   if(key.includes('canceled')) {
        //     listTemplate.classList.add('personal-space__list_canceled-orders');
        //     listELementTemplate.textContent = userOrders[key];
        //     listTemplate.append(listELementTemplate);
        //   }
        //   personalSpaceContentDiv.append(listTemplate);
        // }

        // return mainContainer.querySelector('.personal-space__list-element-button_orders').classList.add('personal-space__list-element-button_active');
      }
      if(index === 2) {

        firstButton = mainContainer.querySelector('.personal-space__list-element-button_history');
        firstButton.classList.add('personal-space__list-element-button_active');
        // return mainContainer.querySelector('.personal-space__list-element-button_history').classList.add('personal-space__list-element-button_active');
      }
    })
  });
  // console.log(coloredDivSegments);
});

//обработчик нажатия на сегмент профиля личного кабинета
userProfileSegment.addEventListener('click', () => {
  // console.log(window.location.origin);
  // loadHtmlPage('/userpage.html')
  // .then((page) => {
  //   mainContainer.classList.add('main_padding');
  //   mainContainer.innerHTML = page;
  //   mainContainer.querySelector('.personal-space__para').textContent = userProfileSegment.textContent;

  //   const profilePageButtons = Array.from(document.querySelectorAll('.personal-space__list-element-button'));
  //   let firstButton;
  //   profilePageButtons.forEach((button, i, array) => {
  //     firstButton = array[0];

  //     button.addEventListener('click', (evt) => {
  //       //переключение подчеркивания кнопок при нажатии
  //       firstButton.classList.remove('personal-space__list-element-button_active');
  //       evt.target.classList.add('personal-space__list-element-button_active');
  //       firstButton = evt.target;

  //       //загрузка нужного контента в зависимости от кнопки, которую нажали
  //       if(i === 0) {
  //         return console.log('button 1');
  //       }
  //       if(i === 1) {
  //         return console.log('button 2');
  //       }
  //       if(i === 2) {
  //         return console.log('button 3');
  //       }
  //     });

  //   });
  //   changeAddressBar(`${userProfileSegment.textContent}`);
  // })
  
  // window.history.pushState({},"", `user/${userProfileSegment.textContent}`);
});

//обработчик нажатия на кнопки навигации в личном кабинете
// console.log(privateSpaceButtons);
// privateSpaceButtons.forEach((button) => {
//   button.addEventListener('click', () => {
//     console.log('yes');
//   })
// })