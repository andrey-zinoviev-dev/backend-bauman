// if(window.location.pathname.includes('user')) {
//   console.log('profile page is selected');
// }
//изначальная загрузка страниц
loadAllHTMLPages()
.then((res) => {
  const htmlParser = new DOMParser();
  const parsedPage = htmlParser.parseFromString(res[0], 'text/html');
  userPage = parsedPage.querySelector('.personal-space');
  privateNavButtons = Array.from(userPage.querySelectorAll('.personal-space__list-element-button'));;

  personalSpaceContentTextDiv = userPage.querySelector('.personal-space__content-text-wrapper');
  personalSpaceContentDivOrders = userPage.querySelector('.personal-space__content-orders-wrapper');

  privateNavButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
      personalSpaceContentTextDiv.innerHTML = '';
      personalSpaceContentDivOrders.innerHTML = '';
      //убрать оформление выделения активной кнопки
      privateNavPrevButton.classList.remove('personal-space__list-element-button_active');
      navPrevButton.classList.remove('personal-space__list-element-button_selected');
      if(i === 0) {
        personalSpaceContentTextDiv.append(userSpaceDefaultHeadline);
        personalSpaceContentTextDiv.append(userSpacePara);
        defaultProfilePageOrdersArray.forEach((el) => {
          personalSpaceContentDivOrders.append(el);
        });
      }
      if(i === 1) {
        defaultCategoryButtons.forEach((button) => {
          ordersSpaceNavigationList.append(button);
        });

        personalSpaceContentTextDiv.append(ordersSpaceNavigationList);
        if(defaultPendingOrdersArray.length === 0) {
          personalSpaceContentDivOrders.append(noOrderHeadline);
          personalSpaceContentDivOrders.append(orderCategoryImage);
        } else {
          defaultPendingOrdersArray.forEach((order) => {
            personalSpaceContentDivOrders.append(order);
          });
        };
      };
      //назначение новой активной кнопки
      privateNavPrevButton = button;
      //перевод нажатой кнопки в активное состояние
      privateNavPrevButton.classList.add('personal-space__list-element-button_active');

      //активная кнопка категории заказов в ожидании
      navPrevButton = defaultCategoryButtons[1].querySelector('.personal-space__list-element-button');
      navPrevButton.classList.add('personal-space__list-element-button_selected');
    });
  });
})
.catch((err) => {
  console.log(err.message);
});

window.onload = () => {
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
    userSpaceDefaultHeadline.textContent = `Здравствуйте, ${user.name}!`;
    
    hideHeaderListElements(openButtonsListElements);
    showHeaderListElements(openButtonsListElementsHidden);
    closePopup(uniquePopup);
  });

  //запрос данных о заказ вошедшего пользователя
  getDataLoggedIn('/show-orders')
  .then((data) => {
    if(data.message) {
      return;
    }
   
    data.userOrders.forEach((userOrder, i, array) => {
      const filteredArray = array.filter((element) => {
        return element.status === userOrder.status;
      });
      userOrders[userOrder.status] = filteredArray;
    });

    //вставка контента в параграф с количеством активных заказов в личном кабинете в секции профиля
    userSpacePara.textContent = `У Вас ${userOrders['active'] ? userOrders['active'].length : "пока нет"} активных заказов`;
    userSpaceRecentOrdersPara.textContent = "Ваши последние заказы";

    //сортировка и обрезка массива заказов
    for (let key in userOrders) {
      if(key === 'canceled' || key === 'finished') {
        continue;
      } else {
        //сортировка по убыванию времени заказа
        const sortedArray = userOrders[key].sort((a, b) => {
          return Date.parse(b.orderTime) - Date.parse(a.orderTime);
        });
        sortedArray.slice(0, 3).forEach((order) => {
          const timeOfOrder = new Date(order.orderTime);
          const userSpaceRecenetOrder = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
          const userSpaceRecentOrderTime = userSpaceRecenetOrder.querySelector('.personal-space__order-time')
          const userSpaceRecentOrderList = userSpaceRecenetOrder.querySelector('.personal-space__order-list');
          const userSpaceRecentOrderStatus = userSpaceRecenetOrder.querySelector('.personal-space__order-side');
          const userSpaceRecentOrderButton = userSpaceRecenetOrder.querySelector('.personal-space__order-button');
          let userSpaceRecentOrderStatusSteps = orderPopupStatusSteps.filter((element) => {
            return Array.from(element.classList).includes('popup__status-wrapper-step_pending');
          });

          userSpaceRecentOrderTime.textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
          userSpaceRecentOrderStatus.style.setProperty('--sidecolor', '#e3c022');

          if(order.status === 'active') {
            userSpaceRecentOrderStatus.style.setProperty('--sidecolor', 'yellowgreen');
            userSpaceRecentOrderStatusSteps = orderPopupStatusSteps.filter((element) => {
              return !Array.from(element.classList).includes('popup__status-wrapper-step_finished');
            })
          }

          order.orderContent.forEach((element) => {
            const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            ordersListElement.textContent = element.orderContent;
            userSpaceRecentOrderList.append(ordersListElement);
          });

          userSpaceRecentOrderButton.addEventListener('click', () => {
            orderPopupTimePara.textContent = userSpaceRecentOrderTime.textContent;
            orderPopupListOfContent.innerHTML = '';

            orderPopupStatusSteps.forEach((stepsButton) => {
              stepsButton.classList.remove('popup__status-wrapper-step_achieved');
              stepsButton.querySelector('.popup__status-wrapper-step-span').classList.remove('popup__status-wrapper-step-span_current');
            });

            order.orderContent.forEach((element) => {
              const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
              ordersListElement.textContent = element.orderContent;
              orderPopupListOfContent.append(ordersListElement);
            });

            userSpaceRecentOrderStatusSteps.forEach((stepsButton) => {
              stepsButton.classList.add('popup__status-wrapper-step_achieved');
              stepsButton.querySelector('.popup__status-wrapper-step-span').classList.add('popup__status-wrapper-step-span_current');
            });

            orderPopup.classList.add('popup_opened');
          });

          defaultProfilePageOrdersArray.push(userSpaceRecenetOrder);
        });
      };
    };
    
    //создание элементов секции всех заказов с заказами в процессе
    //отображение заказов в ожидании по умолчанию
    if(userOrders['pending']) {
      const sortedArray = userOrders['pending'].sort((a, b) => {
        return Date.parse(b.orderTime) - Date.parse(a.orderTime);
      });
  
      sortedArray.forEach((order) => {
        const orderDiv = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
        const timePara = orderDiv.querySelector('.personal-space__order-time');
        const orderContentList = orderDiv.querySelector('.personal-space__order-list');
        const userSpaceRecentOrderStatus = orderDiv.querySelector('.personal-space__order-side');
        const userSpaceOrderButton = orderDiv.querySelector('.personal-space__order-button');
  
        const orderTime = new Date(order.orderTime);
        //тестовый массив кнопок-шагов статуса заказа только в Ожидании!!!
        const statusStepsButtons = orderPopupStatusSteps.filter((element) => {
            return Array.from(element.classList).includes('popup__status-wrapper-step_pending');
        });
  
        timePara.textContent = `${orderTime.getDate()} / ${orderTime.getMonth() + 1} / ${orderTime.getFullYear()}`;
  
        userSpaceRecentOrderStatus.style.setProperty('--sidecolor', '#e3c022');
  
        order.orderContent.forEach((element) => {
          const orderContentListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          orderContentListElement.textContent = element.orderContent;
          orderContentList.append(orderContentListElement);
        });
  
        userSpaceOrderButton.addEventListener('click', () => {
          orderPopupListOfContent.innerHTML = '';
          //сброс классов кнопок-шагов статуса заказа
          orderPopupStatusSteps.forEach((stepsButton) => {
            stepsButton.classList.remove('popup__status-wrapper-step_achieved');
            stepsButton.querySelector('.popup__status-wrapper-step-span').classList.remove('popup__status-wrapper-step-span_current');
          });
  
          orderPopupCustomer.textContent = user.name;
  
          orderPopupTimePara.textContent = `Дата заказа: ${timePara.textContent}`;
  
          order.orderContent.forEach((element) => {
            const orderPopuplistElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            orderPopuplistElement.textContent = `${element.orderContent} ${element.quantity}`;
            orderPopupListOfContent.append(orderPopuplistElement);
          });
  
          statusStepsButtons.forEach((stepsButton) => {
            stepsButton.classList.add('popup__status-wrapper-step_achieved');
            stepsButton.querySelector('.popup__status-wrapper-step-span').classList.add('popup__status-wrapper-step-span_current');
            // stepButton.classList.add('popup__status-wrapper-step-span_current');
          });
  
          orderPopup.classList.add('popup_opened');
        });
      
        defaultPendingOrdersArray.push(orderDiv);
      });
    };
  });

  //запрос данных об услугах компании
  requestOnServer('/load-catalogue')
  .then((data) => {
    data.forEach((service) => {
      // console.log(service);
      const serviceTemplateGenerated = generateTemplate(serviceTemplate, '.services__service-new');
      const serviceTemplateGeneratedHeadline =  serviceTemplateGenerated.querySelector('.services__service-new-headline');
      const serviceTemplateGeneratedImage = serviceTemplateGenerated.querySelector('.services__service-new-vector');
      const serviceTemplateGeneratedButton = serviceTemplateGenerated.querySelector('.services__service-new-button');

      //наполнение элементов шаблона услги контентом и обработчиками
      serviceTemplateGeneratedHeadline.textContent = service.title;
      //Разделение строки картинки услгуи на массив без пробелов
      service.image.split(" ").forEach((oneClass) => {
        serviceTemplateGeneratedImage.classList.add(oneClass);
      });
   
      serviceTemplateGeneratedButton.addEventListener('click', () => {
        servicePopup.querySelector('.popup__headline').textContent = service.title;
        servicePopup.querySelector('.popup__para').textContent = service.description;
        openPopup(servicePopup);
      });

      //вставка экземпляров шаблона в блок услуг
      servicesDiv.append(serviceTemplateGenerated);
    })
  });
}; 

//создание секций личного кабинета для их последующей вставки

//секция профиля (изначальная секция)
const userSpaceDefaultHeadline = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
const userSpacePara = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
const userSpaceRecentOrdersPara = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
 
//секция заказов с разбивкой по категориям
const ordersSpaceHeadline = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
const ordersSpaceNavigationList = generateTemplate(personalSpaceListTemplate, '.personal-space__list');
const ordersSpaceList = generateTemplate(personalSpaceListTemplate, '.personal-space__list');
const ordersSpaceContentDiv = generateTemplate(personalSpaceOrdersTemplate, '.personal-space__orders');

//заказов у категории нет
const noOrderHeadline = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
noOrderHeadline.textContent = 'У Вас пока нет заказов, но это можно легко исправить!';

ordersSpaceHeadline.textContent = 'Ваши заказы';
ordersSpaceNavigationList.classList.add('personal-space__list_categories');

//обновление числа предметов у кнопки корзины
userCartSpan.textContent = userCartOrders.length;

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
    openPopup(loginPopup);
   });
  };
  if(i === 1) {
    return button.addEventListener('click', () => {
      openPopup(registerPopup);
    });
  };
});

popups.forEach((popup, i, array) => {
  let dataToPost = {};
  const popupForm = popup.querySelector('.popup__form');
  if(popupForm !== null) {
    
    const popupFormInputs = Array.from(popupForm.querySelectorAll('.popup__form-input'));
    const popupFormButton = popupForm.querySelector('.popup__form-button');

    popupFormInputs.forEach((input, i, array) => {
      changeFormButtonStatus(array, popupFormButton);

      input.addEventListener('input', (evt) => {
        const errorSpan = popupForm.querySelector(`#${evt.target.id}-error`);
        dataToPost[evt.target.name] = evt.target.value;
        if(!input.validity.valid) {
          input.style.border = '1px solid red';
          if(input.validity.typeMismatch) {
            return errorSpan.textContent = "Необходим формат почты mail@example.com";
          }
          if(input.validity.valueMissing) {
            return errorSpan.textContent = "Поле должно быть заполнено";
          }
          if(input.validity.tooShort) {
            return errorSpan.textContent = 'Неободимо минимум 4 символа';
          }
          return errorSpan.textContent = input.validationMessage;
        } else {
          input.style.border = 'none';
          errorSpan.textContent = '';
        }
        changeFormButtonStatus(array, popupFormButton);
      });
    });

    popupFormButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      Array.from(evt.target.classList).includes('popup__form-button_login') ? 
      postOnServer('/login', dataToPost)
      .then((response) => {
        if(response.err) {
          throw new Error(response.err);
        }
        
        return getDataLoggedIn('/current-user')
        .then((data) => {

          userButtonSpan.textContent = data.name.charAt(0);
          userProfileSegment.textContent = data.name;

          user = data;
          userSpaceDefaultHeadline.textContent = `Здравствуйте, ${user.name}!`;

          //загрузка данных о заказах пользователя
          getDataLoggedIn('/show-orders')
          .then((data) => {
            if(data.message) {
              return;
            }

            data.userOrders.forEach((element, i, array) => {
              userOrders[element.status] = array.filter((order) => {
                return order.status === element.status; 
              });
            });

            //личный кабинет секция профиля
            userSpacePara.textContent = `У Вас ${userOrders['active'] ? userOrders['active'].length : "пока нет"} активных заказов`;
            userSpaceRecentOrdersPara.textContent = "Ваши последние заказы";
            
            for (let key in userOrders) {
              if(key === 'canceled' || key === 'finished') {
                continue;
              }
              const sortedArray = userOrders[key].sort((a, b) => {
                return Date.parse(b.orderTime) - Date.parse(a.orderTime);
              });
              sortedArray.slice(0, 3).forEach((element) => {
                const timeOfOrder = new Date(element.orderTime);
                const userSpaceRecenetOrder = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
                const userSpaceRecentOrderTimePara = userSpaceRecenetOrder.querySelector('.personal-space__order-time');
                const userSpaceRecentOrderList = userSpaceRecenetOrder.querySelector('.personal-space__order-list');
                const userSpaceRecentOrderStatus = userSpaceRecenetOrder.querySelector('.personal-space__order-side');
                const userSpaceRecentOrderButton =  userSpaceRecenetOrder.querySelector('.personal-space__order-button');
                
                let userSpaceRecentOrderStatusButtons = orderPopupStatusSteps.filter((element) => {
                  return Array.from(element.classList).includes('popup__status-wrapper-step_pending');
                });

                if(element.status === 'active') {
                  userSpaceRecentOrderStatusButtons = orderPopupStatusSteps.filter((element) => {
                    return !Array.from(element.classList).includes('popup__status-wrapper-step_finished');
                  });
                }

                userSpaceRecentOrderStatus.style.setProperty('--sidecolor', '#e3c022');
                if(element.status === 'active') {
                  userSpaceRecentOrderStatus.style.setProperty('--sidecolor', 'yellowgreen');
                }

                userSpaceRecentOrderTimePara.textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;

                element.orderContent.forEach((order) => {
                  const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                  ordersListElement.textContent = order.orderContent;
                  userSpaceRecentOrderList.append(ordersListElement);
                });

                //дописать работу кнопки заказа "Открыть"
                userSpaceRecentOrderButton.addEventListener('click', () => {
                  orderPopupTimePara.textContent = userSpaceRecentOrderTimePara.textContent;
                  orderPopupListOfContent.innerHTML = '';
                  orderPopupStatusSteps.forEach((stepButton) => {
                    stepButton.classList.remove('popup__status-wrapper-step_achieved');
                    stepButton.querySelector('.popup__status-wrapper-step-span').classList.remove('popup__status-wrapper-step-span_current');
                  });

                  element.orderContent.forEach((order) => {
                    const orderPopuplistElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                    orderPopuplistElement.textContent = `${order.orderContent} ${order.quantity}`;
                    orderPopupListOfContent.append(orderPopuplistElement);
                  });

                  userSpaceRecentOrderStatusButtons.forEach((stepButton) => {
                    // stepButton.classList.add('popup__status-wrapper-step_current');
                    stepButton.classList.add('popup__status-wrapper-step_achieved');
                    stepButton.querySelector('.popup__status-wrapper-step-span').classList.add('popup__status-wrapper-step-span_current');
                  });

                  orderPopup.classList.add('popup_opened');
                });

                defaultProfilePageOrdersArray.push(userSpaceRecenetOrder);
              })
            }

            //личный кабинет секция заказов
            //отображение заказов по умолчанию статуса "в ожидании"
            if(userOrders['pending']) {
              const sortedArray = userOrders['pending'].sort((a, b) => {
                return Date.parse(b.orderTime) - Date.parse(a.orderTime);
              });
                
              sortedArray.forEach((order) => {
                const orderDiv = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
                const timePara = orderDiv.querySelector('.personal-space__order-time');
                const orderContentList = orderDiv.querySelector('.personal-space__order-list');
                const orderStatus = orderDiv.querySelector('.personal-space__order-side');
                const orderButton = orderDiv.querySelector('.personal-space__order-button');
                //переменная количества кнопок для статуса заказа
                let statusStepsButtons = orderPopupStatusSteps.filter((statusStep) => {
                   return Array.from(statusStep.classList).includes('popup__status-wrapper-step_pending');
                });
  
                const orderTime = new Date(order.orderTime);
                
                orderStatus.style.setProperty('--sidecolor', '#e3c022');
                  
                timePara.textContent = `${orderTime.getDate()} / ${orderTime.getMonth() + 1} / ${orderTime.getFullYear()}`;
                
                order.orderContent.forEach((element) => {
                  const orderContentListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                  orderContentListElement.textContent = element.orderContent;
                  orderContentList.append(orderContentListElement);
                });
                
                orderButton.addEventListener('click', () => {
                  orderPopupListOfContent.innerHTML = '';
                  orderPopupTimePara.textContent = timePara.textContent;

                  orderPopupStatusSteps.forEach((stepButton) => {
                    stepButton.classList.remove('popup__status-wrapper-step_achieved');
                    stepButton.querySelector('.popup__status-wrapper-step-span').classList.remove('popup__status-wrapper-step-span_current');
                  });
                  
                  order.orderContent.forEach((element) => {
                    const orderPopuplistElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                    orderPopuplistElement.textContent = `${element.orderContent} ${element.quantity}`;
                    orderPopupListOfContent.append(orderPopuplistElement);
                  });
                    
                  statusStepsButtons.forEach((stepButton) => {
                      // stepButton.classList.add('popup__status-wrapper-step_current');
                    stepButton.classList.add('popup__status-wrapper-step_achieved');
                    stepButton.querySelector('.popup__status-wrapper-step-span').classList.add('popup__status-wrapper-step-span_current');
                  });
                  orderPopup.classList.add('popup_opened');
                });
                
                defaultPendingOrdersArray.push(orderDiv);
              });
            }
          });
          // hideHeaderButtons(openButtons);
          hideHeaderListElements(openButtonsListElements);
          showHeaderListElements(openButtonsListElementsHidden);
          // showHeaderButtons(loggedInButtons);

          closePopup(popup);
        });

      })
      .catch((err) => {
        loginEmailErrorSpan.textContent = err;
      })
       
      : 

      postOnServer('/register', dataToPost)
      .then((response) => {
        if(response.err) {
          throw new Error(response.err);
        }
        return getDataLoggedIn('/current-user')
        .then((data) => {
          // userButton.textContent = data.email;
          userButtonSpan.textContent = data.name.charAt(0);
          userProfileSegment.textContent = data.name;
          showHeaderButtons(loggedInButtons);

          hideHeaderButtons(openButtons);
          
          //запись данных объекта пользователя
          user = data;

          //секция профиля пользователя
          userSpaceDefaultHeadline.textContent = `Здравствуйте, ${user.name}!`;
          userSpacePara.textContent = `У Вас пока нет активных заказов`;

          //секция категорий заказов
          //добавить вставку картинки в категории заказов, когда заказов у пользователя нет
          closePopup(popup);
        })
      })
      .catch((err) => {
        registerEmailErrorSpan.textContent = err;
      })
    })
  }

  const closeButton = popup.querySelector('.popup__button-close');
  const overlay = popup.querySelector('.popup__overlay');

  closeButton.addEventListener('click', () => {
    closePopup(popup)
  });
  overlay.addEventListener('click', () => {
    closePopup(popup)
  });
});

//обработчики кнопок + и - в попапе заказа
servicePopupOrderButtons.forEach((button, i, array) => {
  button.addEventListener('click', () => {
    if (i === 0) {
      servicePopupOrderInput.value--;
      if(+servicePopupOrderInput.value < 1) {
        servicePopupOrderMinusButton.disabled = true;
        servicePopupOrderMinusButton.classList.add('popup__service-quantity-form-button_blocked');
      };
    }
    if(i === 1) {
      servicePopupOrderInput.value++;
      if(+servicePopupOrderInput.value > 0) {
        servicePopupOrderMinusButton.disabled = false;
        servicePopupOrderMinusButton.classList.remove('popup__service-quantity-form-button_blocked');
      }
    }
  })
});

//обработчик кнопки корзины с заказами
userCartButton.addEventListener('click', () => {
  // console.log(userCartOrders);
  userCart.classList.toggle('cart_opened');
});
//обработчики кнопок прокрутки
firstMainButton.addEventListener('click',() => {
  scrollToSection(servicesSection);
});

//обработчки открытия главной страницы
headerMainButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  // changeAddressBar(evt.target.href);
});

//обработчик прокрутки до каталога
headerCatalogueButton.addEventListener('click', () => {
  scrollToSection(servicesSection);
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

//обработчик нажатия на кнопку попапа заказов
servicePopupButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  //наполнение объекта заказа значениями
  let orderToMake = {
    orderContent: "",
    quantity: 0,
  };

  orderToMake.orderContent = servicePopup.querySelector('.popup__headline').textContent;
  orderToMake.quantity = servicePopup.querySelector('.popup__service-quantity-form-input').value;
  userCartOrders.push(orderToMake);

  //обновление количества предметов заказа в корзине
  userCartSpan.textContent = userCartOrders.length;

  //создание экземпляра шаблона элемента списка в корзине
  const cartListElement = generateTemplate(cartListElementTemplate, '.cart__list-element');
  cartListElement.querySelector('.cart__list-element-para').textContent = orderToMake.orderContent;
  
  //нахождение блока с кнопками и инпутом в элементе списка корзины заказа
  const cartListElementNavigation = cartListElement.querySelector('.cart__list-element-navigation');
  const cartListElementNavigationMinusButton = cartListElement.querySelector('.cart__list-element-navigation-button_minus');
  const cartListElementNavigationInput = cartListElementNavigation.querySelector('.cart__list-element-navigation-input');

  //изменение количества предмета в корзине заказа в зависимости от того, какое количество было указано в окне услуги
  cartListElementNavigationInput.value = orderToMake.quantity;

  //добавление обработчиков для кнопок изменения количества элемента заказа
  Array.from(cartListElementNavigation.children).forEach((child, i, array) => {
    if(i === 1) {
      return child.addEventListener('input', () => {
        console.log(child.value);
      });
    } 
    return child.addEventListener('click', () => {
      if(i === 0) {
        cartListElementNavigationInput.value--
        if(cartListElementNavigationInput.value <= 0) {
          return cartListElementNavigationMinusButton.disabled = true;
        }
      } else {
        cartListElementNavigationInput.value++;
        if(cartListElementNavigationInput.value > 0) {
          return cartListElementNavigationMinusButton.disabled = false;
        }
      }
    });
  });

  userCartList.append(cartListElement);

  //изменение количества предметов в корзине заказа
  userCartOrderQuantity.textContent = userCartOrders.length;
  
  servicePopupForm.reset();
  closePopup(servicePopup);
});

//обработчик оформдения заказа в корзине заказа
userCartOderButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  const timeOfOrder = new Date();
  //сброс данных массива с заказами по умолчанию
  defaultProfilePageOrdersArray.splice(0, defaultProfilePageOrdersArray.length);
  defaultPendingOrdersArray.splice(0, defaultPendingOrdersArray.length);

  postOnServer('/add-service', {
    userCartOrders, 
    timeOfOrder,
    quantity: userCartOrders.length,
  })
  .then((data) => {
    if(data.errorMessage) {
      return console.log('ошибка');
    }
    
    getDataLoggedIn('/show-orders')
    .then((orders) => {
      orders.userOrders.forEach((userOrder, i, array) => {
        const filteredArray = array.filter((element) => {
          return element.status === userOrder.status;
        });
        userOrders[userOrder.status] = filteredArray;
      });

      //секция профиля личного кабинета
      for(let key in userOrders) {
        if(key === 'canceled' || key === 'finished') {
          continue;
        }
        const sortedArray = userOrders[key].sort((a, b) => {
          return Date.parse(b.orderTime) - Date.parse(a.orderTime);
        });
        sortedArray.slice(0, 3).forEach((element) => {
          //настроить цвет статуса заказа
          const timeOfOrder = new Date(element.orderTime);
          const userSpaceRecenetOrder = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
          userSpaceRecenetOrder.querySelector('.personal-space__order-time').textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
          const userSpaceRecentOrderList = userSpaceRecenetOrder.querySelector('.personal-space__order-list');

          element.orderContent.forEach((order) => {
            const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            ordersListElement.textContent = order.orderContent;
            userSpaceRecentOrderList.append(ordersListElement);
          });

          //добавить открытие окна при нажатии на кнопку "Открыть" у заказа
          defaultProfilePageOrdersArray.push(userSpaceRecenetOrder);
        });
      };

      //секция категорий личного кабинета
      if(userOrders['pending']) {
        const sortedArray = userOrders['pending'].sort((a, b) => {
          return Date.parse(b.orderTime) - Date.parse(a.orderTime);
        });

        sortedArray.forEach((element) => {
          //настроить цвет статуса заказа

          const timeOfOrder = new Date(element.orderTime);
          const userSpaceRecenetOrder = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
          userSpaceRecenetOrder.querySelector('.personal-space__order-time').textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
          const userSpaceRecentOrderList = userSpaceRecenetOrder.querySelector('.personal-space__order-list');
    
          element.orderContent.forEach((order) => {
            const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            ordersListElement.textContent = order.orderContent;
            userSpaceRecentOrderList.append(ordersListElement);
          });
          //добавить открытие окна при нажатии на кнопку "Открыть" у заказа
          defaultPendingOrdersArray.push(userSpaceRecenetOrder);
        });
      };

      userCartList.innerHTML = '';
      userCartPara.textContent = orders.success;
      //обнуление предметов в корзине заказа
      userCartOrders.splice(0, userCartOrders.length);
      userCartSpan.textContent = userCartOrders.length;
      setTimeout(() => {
        userCartPara.textContent="";
        userCart.classList.remove('cart_opened');
      }, 1500)
    })
  })
});

//обработчик выхода пользователя
userLogoutButton.addEventListener('click', () => {
  logout();
});

//обработчик открытия личного кабинета
userButton.addEventListener('click', () => {
  userSection.classList.toggle('dashboard_opened');
});

const orderCategoryImage = generateTemplate(personalSpaceImageTemplate, '.personal-space__image');
orderCategoryImage.src = 'https://measy.org/assets/images/bitmaps/no_orders.svg';

//создание кнопок категорий заказов личного кабинета
orderCategories.forEach((category) => {
  const orderCategorylistElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
  const orderCategoryButton = generateTemplate(personalSpaceListElementButtonTemplate, '.personal-space__list-element-button');

  orderCategoryButton.textContent = category.title;
  orderCategoryButton.setAttribute('data', category.type);
  orderCategoryButton.addEventListener('click', () => {
    navPrevButton.classList.remove('personal-space__list-element-button_selected');
    // console.log(orderCategoryButton.getAttribute('data'));
    personalSpaceContentDivOrders.innerHTML = '';

    if(!userOrders[orderCategoryButton.getAttribute('data')]) {
      personalSpaceContentDivOrders.append(noOrderHeadline);
      personalSpaceContentDivOrders.append(orderCategoryImage);
    } else {
      userOrders[orderCategoryButton.getAttribute('data')].forEach((order) => {
        const personSpaceCategoryOrder = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
        const orderStatusDiv = personSpaceCategoryOrder.querySelector('.personal-space__order-side');
        const personalSpaceOrderButton = personSpaceCategoryOrder.querySelector('.personal-space__order-button');
        const timePara = personSpaceCategoryOrder.querySelector('.personal-space__order-time');
        const timeOfOrder = new Date(order.orderTime);

        let orderStatusButtons = orderPopupStatusSteps.filter((element) => {
          return Array.from(element.classList).includes('popup__status-wrapper-step_pending');
        });

        if(order.status === 'active') {
          orderStatusButtons = orderPopupStatusSteps.filter((element) => {
            return !Array.from(element.classList).includes('popup__status-wrapper-step_finished');
          });
        }

        if(order.status === 'finished') {
          orderStatusButtons = orderPopupStatusSteps;
        }

        orderStatusDiv.style.setProperty('--sidecolor', '#e3c022');

        if(order.status === 'active') {
          orderStatusDiv.style.setProperty('--sidecolor', 'yellowgreen');
        }
      
        if(orderCategoryButton.getAttribute('data') === 'finished') {
          orderStatusDiv.style.setProperty('--sidecolor', '#d1361b');
        }
      
        if(orderCategoryButton.getAttribute('data') === 'canceled') {
          orderStatusDiv.style.setProperty('--sidecolor', '#21a35e');
        }

        timePara.textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
  
        const personSpaceCategoryOrderList = personSpaceCategoryOrder.querySelector('.personal-space__order-list');

        order.orderContent.forEach((orderUnit) => {
          const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          ordersListElement.textContent = orderUnit.orderContent;
          personSpaceCategoryOrderList.append(ordersListElement);
        });

        personalSpaceOrderButton.addEventListener('click', () => {
          orderPopupListOfContent.innerHTML = '';

          orderPopupStatusSteps.forEach((stepButton) => {
            stepButton.classList.remove('popup__status-wrapper-step_achieved');
            stepButton.querySelector('.popup__status-wrapper-step-span').classList.remove('popup__status-wrapper-step-span_current');
          });

          orderPopupTimePara.textContent = timePara.textContent;

          order.orderContent.forEach((element) => {
            const orderPopuplistElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            orderPopuplistElement.textContent = `${element.orderContent} ${element.quantity}`;
            orderPopupListOfContent.append(orderPopuplistElement);
          });

          orderStatusButtons.forEach((stepsButton) => {
            stepsButton.classList.add('popup__status-wrapper-step_achieved');
            stepsButton.querySelector('.popup__status-wrapper-step-span').classList.add('popup__status-wrapper-step-span_current');
          });

          orderPopup.classList.add('popup_opened');
        });
       
        personalSpaceContentDivOrders.append(personSpaceCategoryOrder);
      });
    };
    navPrevButton = orderCategoryButton;
    navPrevButton.classList.add('personal-space__list-element-button_selected');
  });

  orderCategorylistElement.append(orderCategoryButton);
  defaultCategoryButtons.push(orderCategorylistElement);
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

    //тест другой загрузки страницы
    rootElement.classList.add('root_private-space')
    mainContainer.classList.add('main_padding');
    personalSpaceContentTextDiv.innerHTML = '';
    personalSpaceContentDivOrders.innerHTML = '';
    mainContainer.innerHTML = "";

    mainContainer.append(userPage);
    
    if(privateNavPrevButton) {
      privateNavPrevButton.classList.remove('personal-space__list-element-button_active');
    }

    if(index === 0) {
      personalSpaceContentTextDiv.append(userSpaceDefaultHeadline);
      personalSpaceContentTextDiv.append(userSpacePara);

      defaultProfilePageOrdersArray.forEach((el) => {
        personalSpaceContentDivOrders.append(el);
      });

      privateNavPrevButton = privateNavButtons[0];
      privateNavPrevButton.classList.add('personal-space__list-element-button_active');
      // navPrevButton = defaultCategoryButtons[0];
    }; 

    if(index === 1) {
      // navPrevButton.classList.remove('personal-space__list-element-button_selected');
      if(navPrevButton) {
        navPrevButton.classList.remove('personal-space__list-element-button_selected');
      };

      defaultCategoryButtons.forEach((button) => {
        ordersSpaceNavigationList.append(button);
      });
      personalSpaceContentTextDiv.append(ordersSpaceNavigationList);

      if(defaultPendingOrdersArray.length === 0) {
        personalSpaceContentDivOrders.append(noOrderHeadline);
        personalSpaceContentDivOrders.append(orderCategoryImage);
      } else {
        defaultPendingOrdersArray.forEach((order) => {
          personalSpaceContentDivOrders.append(order);
        });
      }

      privateNavPrevButton = privateNavButtons[1];
      privateNavPrevButton.classList.add('personal-space__list-element-button_active');
      
      navPrevButton = defaultCategoryButtons[1].querySelector('.personal-space__list-element-button');
    
      navPrevButton.classList.add('personal-space__list-element-button_selected');
    };

    if(index === 2) {
      privateNavPrevButton = privateNavButtons[2];
      privateNavPrevButton.classList.add('personal-space__list-element-button_active');
    }

    if(index === 3) {
      privateNavPrevButton = privateNavButtons[3];
      privateNavPrevButton.classList.add('personal-space__list-element-button_active');
    };

    userSection.classList.remove('dashboard_opened');
  });
  
});

