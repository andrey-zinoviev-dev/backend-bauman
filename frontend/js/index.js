// const { showCurrentUser } = require("../../controllers/getControllers");

// const { showUserOrders } = require("../../controllers/getControllers");

//назначение первой кнопки 1 отзыва при загрузке страницы
window.onload = () => {
  // if(window.location.pathname.includes('user')) {
  //   console.log('profile page is selected');
  // }
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
   
    data.userOrders.forEach((userOrder, i, array) => {
      const filteredArray = array.filter((element) => {
        return element.status === userOrder.status;
      });
      userOrders[userOrder.status] = filteredArray;
    });

    //вставка контента в параграф с количеством активных заказов в личном кабинете в секции профиля
    userSpacePara.textContent = `У Вас ${userOrders['active'].length} активных заказов`;
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
          userSpaceRecenetOrder.querySelector('.personal-space__order-time').textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth()} / ${timeOfOrder.getFullYear()}`;
          const userSpaceRecentOrderList = userSpaceRecenetOrder.querySelector('.personal-space__order-list');

          order.orderContent.forEach((element) => {
            const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            ordersListElement.textContent = element.orderContent;
            userSpaceRecentOrderList.append(ordersListElement);
          });
          defaultProfilePageOrdersArray.push(userSpaceRecenetOrder);
        });
      }
    };
    
    //создание элементов секции всех заказов с разбивкой по категориям
    for (let key in userOrders) {
      const orderCategorylistElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
      const orderCategoryButton = generateTemplate(personalSpaceListElementButtonTemplate, '.personal-space__list-element-button');
      
      if(key === 'active') {
        orderCategoryButton.textContent = "Активные заказы";
        orderCategoryButton.setAttribute('data', 'active');
        orderCategorylistElement.prepend(orderCategoryButton);    
      }
      if(key === 'pending') {
        orderCategoryButton.textContent = "Заказы в процессе";
        orderCategoryButton.setAttribute('data', 'pending');
        orderCategorylistElement.prepend(orderCategoryButton);

        //отображение заказов в ожидании по умолчанию
        const sortedArray = userOrders[key].sort((a, b) => {
          return Date.parse(b.orderTime) - Date.parse(a.orderTime);
        });

        sortedArray.forEach((order) => {
          const orderDiv = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
          const timePara = orderDiv.querySelector('.personal-space__order-time');
          const orderContentList = orderDiv.querySelector('.personal-space__order-list');
          const orderTime = new Date(order.orderTime);
    
          timePara.textContent = `${orderTime.getDate()} / ${orderTime.getMonth() + 1} / ${orderTime.getFullYear()}`;
    
          order.orderContent.forEach((element) => {
            const orderContentListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            orderContentListElement.textContent = element.orderContent;
            orderContentList.append(orderContentListElement);
          });
          defaultPendingOrdersArray.push(orderDiv);
        });
      }
      if(key === 'finished') {
        orderCategoryButton.textContent = "Заказы завершенные";
        orderCategoryButton.setAttribute('data', 'finished');
        orderCategorylistElement.append(orderCategoryButton);    
      }
      if(key === 'canceled') {
        orderCategoryButton.textContent = "Заказы отмененные";
        orderCategoryButton.setAttribute('data', 'canceled');
        orderCategorylistElement.append(orderCategoryButton);
      }
      
      orderCategoryButton.addEventListener('click', () => {
        // orderCategoryButton.classList.add('clicked');
        
        personalSpaceContentDivOrders.innerHTML = '';
  
        const lastSortedArray = userOrders[key].sort((a, b) => {
          return Date.parse(b.orderTime) - Date.parse(a.orderTime);
        });

        lastSortedArray.forEach((order) => {
          const orderDiv = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
          const timePara = orderDiv.querySelector('.personal-space__order-time');
          const orderContentList = orderDiv.querySelector('.personal-space__order-list');
          const orderTime = new Date(order.orderTime);

          timePara.textContent = `${orderTime.getDate()} / ${orderTime.getMonth() + 1} / ${orderTime.getFullYear()}`;

          order.orderContent.forEach((element) => {
            const orderContentListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            orderContentListElement.textContent = element.orderContent;
            orderContentList.append(orderContentListElement);
          });

          personalSpaceContentDivOrders.append(orderDiv);
        });
      });

      defaultCategoryButtons.push(orderCategorylistElement);
    }

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
            userSpacePara.textContent = `У Вас ${userOrders['active'].length} активных заказов`;
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
                userSpaceRecenetOrder.querySelector('.personal-space__order-time').textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
                const userSpaceRecentOrderList = userSpaceRecenetOrder.querySelector('.personal-space__order-list');
                // console.log(userSpaceRecentOrderList);
                element.orderContent.forEach((order) => {
                  const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                  ordersListElement.textContent = order.orderContent;
                  userSpaceRecentOrderList.append(ordersListElement);
                });

                defaultProfilePageOrdersArray.push(userSpaceRecenetOrder);
              })
            }

            //личный кабинет секция заказов
            for (let key in userOrders) {
              const orderCategorylistElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
              const orderCategoryButton = generateTemplate(personalSpaceListElementButtonTemplate, '.personal-space__list-element-button');
              
              if(key === 'active') {
                orderCategoryButton.textContent = "Активные заказы";
                orderCategoryButton.setAttribute('data', 'active');
                orderCategorylistElement.prepend(orderCategoryButton);
                // ordersSpaceNavigationList.prepend(orderCategorylistElement);
              }
              if(key === 'pending') {
                orderCategoryButton.textContent = "Заказы в процессе";
                orderCategoryButton.setAttribute('data', 'pending');
                orderCategorylistElement.prepend(orderCategoryButton);
                // ordersSpaceNavigationList.prepend(orderCategorylistElement);

                //отображение заказов по умолчанию статуса "в ожидании"
                const sortedArray = userOrders[key].sort((a, b) => {
                  return Date.parse(b.orderTime) - Date.parse(a.orderTime);
                });

                sortedArray.forEach((order) => {
                  const orderDiv = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
                  const timePara = orderDiv.querySelector('.personal-space__order-time');
                  const orderContentList = orderDiv.querySelector('.personal-space__order-list');
                  const orderTime = new Date(order.orderTime);

                  timePara.textContent = `${orderTime.getDate()} / ${orderTime.getMonth() + 1} / ${orderTime.getFullYear()}`;

                  order.orderContent.forEach((element) => {
                    const orderContentListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                    orderContentListElement.textContent = element.orderContent;
                    orderContentList.append(orderContentListElement);
                  });
                  defaultPendingOrdersArray.push(orderDiv);
                })
              }
              if(key === 'finished') {
                orderCategoryButton.textContent = "Заказы завершенные";
                orderCategoryButton.setAttribute('data', 'finished');
                orderCategorylistElement.append(orderCategoryButton);
                // ordersSpaceNavigationList.append(orderCategorylistElement);
              }
              if(key === 'canceled') {
                orderCategoryButton.textContent = "Заказы отмененные";
                orderCategoryButton.setAttribute('data', 'canceled');
                orderCategorylistElement.append(orderCategoryButton);
                // ordersSpaceNavigationList.append(orderCategorylistElement);
              }
              
              orderCategoryButton.addEventListener('click', () => {
                personalSpaceContentDivOrders.innerHTML = '';
                
                const lastSortedArray = userOrders[key].sort((a, b) => {
                  return Date.parse(b.orderTime) - Date.parse(a.orderTime);
                });

                lastSortedArray.forEach((order) => {
                  const orderDiv = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
                  const timePara = orderDiv.querySelector('.personal-space__order-time');
                  const orderContentList = orderDiv.querySelector('.personal-space__order-list');
                  const orderTime = new Date(order.orderTime);

                  timePara.textContent = `${orderTime.getDate()} / ${orderTime.getMonth() + 1} / ${orderTime.getFullYear()}`;

                  order.orderContent.forEach((element) => {
                    const orderContentListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
                    orderContentListElement.textContent = element.orderContent;
                    orderContentList.append(orderContentListElement);
                  });

                  personalSpaceContentDivOrders.append(orderDiv);
                })
              });

              defaultCategoryButtons.push(orderCategorylistElement);
            };
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
          
          //запись данных объекта пользователя
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
          const timeOfOrder = new Date(element.orderTime);
          const userSpaceRecenetOrder = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
          userSpaceRecenetOrder.querySelector('.personal-space__order-time').textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
          const userSpaceRecentOrderList = userSpaceRecenetOrder.querySelector('.personal-space__order-list');

          element.orderContent.forEach((order) => {
            const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
            ordersListElement.textContent = order.orderContent;
            userSpaceRecentOrderList.append(ordersListElement);
          });

          defaultProfilePageOrdersArray.push(userSpaceRecenetOrder);
        });
      };

      //секция категорий личного кабинета
      for(let key in userOrders) {
        const sortedArray = userOrders[key].sort((a, b) => {
          return Date.parse(b.orderTime) - Date.parse(a.orderTime);
        });
        
        if(key === 'pending') {
          sortedArray.forEach((element) => {
            const timeOfOrder = new Date(element.orderTime);
            const userSpaceRecenetOrder = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
            userSpaceRecenetOrder.querySelector('.personal-space__order-time').textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
            const userSpaceRecentOrderList = userSpaceRecenetOrder.querySelector('.personal-space__order-list');
  
            element.orderContent.forEach((order) => {
              const ordersListElement = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
              ordersListElement.textContent = order.orderContent;
              userSpaceRecentOrderList.append(ordersListElement);
            });
            defaultPendingOrdersArray.push(userSpaceRecenetOrder);
          })
        }
      }

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

//обработчики карточек каталога
// services.forEach((service) => {
//   service.addEventListener('click', () => {
//     orderToMake.title = service.querySelector('.services__service-new-headline').textContent;
//     orderToMake.time = new Date();
//     servicePopup.querySelector('.popup__headline').textContent = service.querySelector('.services__service-new-headline').textContent;
//     openPopup(servicePopup);
//   });
// });

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

      personalSpaceContentDiv = mainContainer.querySelector('.personal-space__content');
      personalSpaceContentDivOrders = personalSpaceContentDiv.querySelector('.personal-space__content-orders-wrapper');

      const personalSpaceTextWrapper = mainContainer.querySelector('.personal-space__content-text-wrapper');
      // const personalSpaceOrdersWrapper = mainContainer.querySelector('.personal-space__content-orders-wrapper');

      const privateSpaceButtons = Array.from(document.querySelectorAll('.personal-space__list-element-button'));

      let firstButton;

      personalSpaceTextWrapper.innerHTML = "";
      personalSpaceContentDivOrders.innerHTML = "";

      privateSpaceButtons.forEach((button, i, array) => {
        button.addEventListener('click', () => {

          firstButton.classList.remove('personal-space__list-element-button_active');
          button.classList.add('personal-space__list-element-button_active');
          firstButton = button;

          personalSpaceTextWrapper.innerHTML = "";
          personalSpaceContentDivOrders.innerHTML = "";

          // if(i === 0) {
          //   personalSpaceContentDiv.append(userSpaceTextWrapper);
          //   personalSpaceContentDiv.append(userSpaceRecentOrdersPara);
          //   personalSpaceContentDiv.append(userSpaceRecentOrdersDiv);
          //   // const textWrapperTemplate = generateTemplate(personalSpaceContentTextWrapperTemplate, '.personal-space__content-text-wrapper');
          //   // const headlineTemplateGenerated = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
          //   // const paraTemplateGenerated = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
          //   // const paraTemplateOrdersDiv = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
    
          //   // const ordersDivTemplate = generateTemplate(personalSpaceOrdersTemplate, '.personal-space__orders');
    
          //   // //теперь добавлять данные на страницу профиля в личном кабинете
          //   // headlineTemplateGenerated.textContent = `Здравствуйте, ${user.name}!`;
          //   // paraTemplateGenerated.textContent = `У Вас ${userOrders['active']  ? userOrders['active'].length : "нет" } активных заказов, вернитесь к ним как можно скорее, чтобы стать еще более продуктивным!`;
          //   // paraTemplateOrdersDiv.textContent = 'Ваши последние заказы';
            
          //   // textWrapperTemplate.append(headlineTemplateGenerated);
          //   // textWrapperTemplate.append(paraTemplateGenerated);

          //   // personalSpaceContentDiv.append(textWrapperTemplate);
          //   // personalSpaceContentDiv.append(paraTemplateOrdersDiv);
          //   // personalSpaceContentDiv.append(ordersDivTemplate);
            
          //   // for (let key in userOrders) {
          //   //   if(key === 'canceled' || key === 'finished') {
          //   //     continue;
          //   //   }
          //   //   // console.log(userOrders[key]);
          //   //   //сортировка массивов заказов по убыванию времени заказа
          //   //   const sortedOrdersArray = userOrders[key].sort((a, b) => {
          //   //     return Date.parse(b.orderTime) - Date.parse(a.orderTime);
          //   //   });

          //   //   sortedOrdersArray.slice(0, 3).forEach((order) => {
          //   //     const orderTemplate = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
          //   //     // const headlineFromTemplate = orderTemplate.querySelector('.perosnal-space__order-headline');
          //   //     const paraFromTemplate = orderTemplate.querySelector('.personal-space__order-time');
          //   //     const listFromTemplate = orderTemplate.querySelector('.personal-space__order-list');
          //   //     const statusDivFromTemplate = orderTemplate.querySelector('.personal-space__order-status-logo');
          //   //     const buttonFromTemplate = orderTemplate.querySelector('.personal-space__order-button');
              
          //   //     // создание переменной времени заказа
          //   //     const timeOfOrder = new Date(order.orderTime);
          //   //     //заполнение элементов блока заказов данными
          //   //     // headlineFromTemplate.textContent = order.orderContent;
          //   //     paraFromTemplate.textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;

          //   //     order.orderContent.forEach((element) => {
          //   //       const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          //   //       listElementTemplate.textContent = `${element.orderContent} ${element.quantity}`;
          //   //       listFromTemplate.append(listElementTemplate);
          //   //     });

          //   //   //   buttonFromTemplate.addEventListener('click', () => {
          //   //   //     console.log('order clicked');
          //   //   //   });
          //   //     //изменение цвета блока статус
          //   //     if(key === 'pending') {
          //   //       statusDivFromTemplate.style.backgroundColor = '#ccbc2b';
          //   //     };
          //   //     //вставка сгенерированных шаблонов в блок личного кабинета
          //   //     ordersDivTemplate.append(orderTemplate);
          //   //   });
          //   // }
          // }
          // if(i === 1) {
          //   //создание пунктов раздела Заказы в личном кабинете
          //   const paraTemplate = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
          //   paraTemplate.textContent = "Ваши заказы";
          //   personalSpaceContentDiv.append(paraTemplate);
            
          //   for (let key in userOrders) {
          //     const personalHeadlineTemplate = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
          //     const listTemplate = generateTemplate(personalSpaceListTemplate, '.personal-space__list');
             
          //     if(key.includes('active')) {
          //       userOrders[key].forEach((element) => {
          //         const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          //         listElementTemplate.textContent = element.orderContent;
          //         listTemplate.append(listElementTemplate);
          //       });

          //       personalHeadlineTemplate.textContent = 'Активные заказы';
          //       listTemplate.classList.add('personal-space__list_active-orders');
          //     }
          //     if(key.includes('pending')) {
          //       userOrders[key].forEach((element) => {
          //         const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          //         listElementTemplate.textContent = element.orderContent;
          //         listTemplate.append(listElementTemplate);
          //       });

          //       personalHeadlineTemplate.textContent = 'Заказы в ожидании';
          //       listTemplate.classList.add('personal-space__list_pending-orders');
          //     }
          //     if(key.includes('finished')) {
          //       userOrders[key].forEach((element) => {
          //         const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          //         listElementTemplate.textContent = element.orderContent;
          //         listTemplate.append(listElementTemplate);
          //       });

          //       personalHeadlineTemplate.textContent = 'Завершенные заказы';
          //       listTemplate.classList.add('personal-space__list_finished-orders');
          //     }
          //     if(key.includes('canceled')) {
          //       userOrders[key].forEach((element) => {
          //         const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          //         listElementTemplate.textContent = element.orderContent;
          //         listTemplate.append(listElementTemplate);
          //       });

          //       personalHeadlineTemplate.textContent = 'Отмененные заказы';
          //       listTemplate.classList.add('personal-space__list_canceled-orders');
          //     }
          //     personalSpaceContentDiv.append(personalHeadlineTemplate);
          //     personalSpaceContentDiv.append(listTemplate);
          //   }
          //   // for(let key in userOrders) {
          //   //   const listTemplate = generateTemplate(personalSpaceListTemplate, '.personal-space__list');
          //   //   const listELementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
          
          //   //   if(key.includes('active')) {
          //   //     listTemplate.classList.add('personal-space__list_active-orders');
          //   //     listELementTemplate.textContent = userOrders[key];
          //   //     listTemplate.append(listELementTemplate);
          //   //   }

          //   //   if(key.includes('pending')) {
          //   //     listTemplate.classList.add('personal-space__list_pending-orders');
          //   //     listELementTemplate.textContent = userOrders[key];
          //   //     listTemplate.append(listELementTemplate);
          //   //   }

          //   //   if(key.includes('finished')) {
          //   //     listTemplate.classList.add('personal-space__list_finished-orders');
          //   //     listELementTemplate.textContent = userOrders[key];
          //   //     listTemplate.append(listELementTemplate);
          //   //   }

          //   //   if(key.includes('canceled')) {
          //   //     listTemplate.classList.add('personal-space__list_canceled-orders');
          //   //     listELementTemplate.textContent = userOrders[key];
          //   //     listTemplate.append(listELementTemplate);
          //   //   }

          //   //   personalSpaceContentDiv.append(listTemplate);
          //   // };
          // }
          // if(i === 2) {
          //   console.log('показать историю')
          // }
        });
      });

      if(index === 0) {

        firstButton = mainContainer.querySelector('.personal-space__list-element-button_profile');
        firstButton.classList.add('personal-space__list-element-button_active');
        
        personalSpaceTextWrapper.append(userSpaceDefaultHeadline);
        personalSpaceTextWrapper.append(userSpacePara);
        personalSpaceContentDivOrders.append(userSpaceRecentOrdersPara);

        defaultProfilePageOrdersArray.forEach((order) => {
          personalSpaceContentDivOrders.append(order);
        });
        

        // personalSpaceContentDiv.append(userSpaceTextWrapper);
        // personalSpaceContentDiv.append(userSpaceRecentOrdersPara);
        // personalSpaceContentDiv.append(userSpaceRecentOrdersDiv);

        // const textWrapperTemplate = generateTemplate(personalSpaceContentTextWrapperTemplate, '.personal-space__content-text-wrapper');
        // const headlineTemplateGenerated = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
        // const paraTemplateGenerated = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
        // const paraTemplateOrdersDiv = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');

        // const ordersDivTemplate = generateTemplate(personalSpaceOrdersTemplate, '.personal-space__orders');

        // //теперь добавлять данные на страницу профиля в личном кабинете
        // headlineTemplateGenerated.textContent = `Здравствуйте, ${user.name}!`;
        // paraTemplateGenerated.textContent = `У Вас ${userOrders['active'] ? userOrders['active'].length : 'нет'} активных заказов, вернитесь к ним как можно скорее, чтобы стать еще более продуктивным!`;
        // paraTemplateOrdersDiv.textContent = 'Ваши последние заказы';
        
        // textWrapperTemplate.append(headlineTemplateGenerated);
        // textWrapperTemplate.append(paraTemplateGenerated)
        // // personalSpaceContentDiv.append(headlineTemplateGenerated);
        // // personalSpaceContentDiv.append(paraTemplateGenerated);
        // personalSpaceContentDiv.append(textWrapperTemplate);
        // personalSpaceContentDiv.append(paraTemplateOrdersDiv);
        // personalSpaceContentDiv.append(ordersDivTemplate);

        // for(let key in userOrders) {
        //   if(key === "canceled" || key === "finished") {
        //     continue;
        //   } 
        //   //сортировка заказов по убыванию времени заказа
        //   const sortedArray = userOrders[key].sort((a, b) => {
        //     return Date.parse(b.orderTime) - Date.parse(a.orderTime);
        //   });
        //   //отсечение заказов до 3 максимум в категориях активных и в ожидании
        //   sortedArray.slice(0, 3).forEach((order) => {
        //     // создание экземпляра шаблона заказа для каждого элемента массива и определение каждого элемента DOM для экземпляра шаблона
        //     const orderTemplate = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
            
        //     // const headlineFromTemplate = orderTemplate.querySelector('.perosnal-space__order-headline');
        //     const paraFromTemplate = orderTemplate.querySelector('.personal-space__order-time');
        //     const listFromTemplate = orderTemplate.querySelector('.personal-space__order-list');
        //     const statusDivFromTemplate = orderTemplate.querySelector('.personal-space__order-status-logo');
        //     const buttonFromTemplate = orderTemplate.querySelector('.personal-space__order-button');
            
        //     //создание переменной времени для заказа
        //     const timeOfOrder = new Date(order.orderTime);

        //     //заполнение элементов блока заказов данными
        //     // headlineFromTemplate.textContent = order.orderContent;
        //     paraFromTemplate.textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
        //     order.orderContent.forEach((element) => {
        //       const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
        //       listElementTemplate.textContent = `${element.orderContent} ${element.quantity}`;
        //       listFromTemplate.append(listElementTemplate);
        //     })

        //     // buttonFromTemplate.addEventListener('click', () => {
        //     //   // console.log(order);
        //     //   uniquePopup.querySelector('.popup__headline').textContent = order.orderContent;
        //     //   uniquePopup.querySelector('.popup__para').textContent = `${timeOfOrder.getDate()} / ${timeOfOrder.getMonth() + 1} / ${timeOfOrder.getFullYear()}`;
        //     //   uniquePopup.querySelector('.popup__para_order-status').querySelector('.popup__span').textContent = order.status;
        //     //   openPopup(uniquePopup);
        //     // });

        //     //изменение цвета блока статус
        //     if(key === 'pending') {
        //       statusDivFromTemplate.style.backgroundColor = '#ccbc2b';
        //     }
        //     //вставка сгенерированных шаблонов в блок личного кабинета
        //     ordersDivTemplate.append(orderTemplate);
        //   });
          
        // }
        // userOrders["active"].forEach((order) => {
        //   const orderTemplate = generateTemplate(personalSpaceOrderTemplate, '.personal-space__order');
        //   const headlineFromTemplate = orderTemplate.querySelector('.perosnal-space__order-headline');
        //   const paraFromTemplate = orderTemplate.querySelector('.personal-space__order-time');
        //   const statusDivFromTemplate = orderTemplate.querySelector('.personal-space__order-status-logo');
        //   const buttonFromTemplate = orderTemplate.querySelector('.personal-space__order-button');
          
        //   //заполнение элементов блока заказов данными
        //   headlineFromTemplate.textContent = order.orderContent;
        //   paraFromTemplate.textContent = order.orderTime;
        //   buttonFromTemplate.addEventListener('click', () => {
        //     console.log('order clicked');
        //   });
        //   //вставка сгенерированных шаблонов в блок личного кабинета
        //   ordersDivTemplate.append(orderTemplate);
        // });
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

        personalSpaceTextWrapper.append(ordersSpaceHeadline);

        //вставка кнопок категорий заказов в список секций категорий заказов личного кабинета
        defaultCategoryButtons.forEach((button) => {
          ordersSpaceNavigationList.append(button);
        });

        personalSpaceTextWrapper.append(ordersSpaceNavigationList);

        defaultPendingOrdersArray.forEach((order) => {
          personalSpaceContentDivOrders.append(order);
        });

        
        // const paraTemplate = generateTemplate(personalSpaceParaTemplate, '.personal-space__para');
        // paraTemplate.textContent = "Ваши заказы";

        // personalSpaceContentDiv.append(ordersSpaceHeadline);
        // personalSpaceContentDiv.append(ordersSpaceNavigationList);
        // personalSpaceContentDiv.append(ordersSpaceList);
        // for (let key in userOrders) {

        //   const personalHeadlineTemplate = generateTemplate(personalSpaceHeadlineTemplate, '.personal-space__headline');
        //   const listTemplate = generateTemplate(personalSpaceListTemplate, '.personal-space__list');

        //   if(key.includes('active')) {
           
        //     userOrders[key].forEach((element) => {
        //       const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
        //       listElementTemplate.textContent = element.orderContent;
        //       listTemplate.append(listElementTemplate);
        //     });

        //     personalHeadlineTemplate.textContent = 'Активные заказы';
        //     listTemplate.classList.add('personal-space__list_active-orders');
        //     // listTemplate.textContent =
        //   }
        //   if(key.includes('pending')) {
        //     userOrders[key].forEach((element) => {
        //       const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
        //       listElementTemplate.textContent = element.orderContent;
        //       listTemplate.append(listElementTemplate);
        //     });
        //     personalHeadlineTemplate.textContent = 'Заказы в ожидании';
        //     listTemplate.classList.add('personal-space__list_pending-orders');
        //   }
        //   if(key.includes('finished')) {
        //     userOrders[key].forEach((element) => {
        //       const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
        //       listElementTemplate.textContent = element.orderContent;
        //       listTemplate.append(listElementTemplate);
        //     });
        //     personalHeadlineTemplate.textContent = 'Завершенные заказы';
        //     listTemplate.classList.add('personal-space__list_finished-orders');
        //   }
        //   if(key.includes('canceled')) {
        //     userOrders[key].forEach((element) => {
        //       const listElementTemplate = generateTemplate(personalSpaceListElementTemplate, '.personal-space__list-element');
        //       listElementTemplate.textContent = element.orderContent;
        //       listTemplate.append(listElementTemplate);
        //     });
        //     personalHeadlineTemplate.textContent = 'Отмененные заказы';
        //     listTemplate.classList.add('personal-space__list_canceled-orders');
        //   }
        //   personalSpaceContentDiv.append(personalHeadlineTemplate);
        //   personalSpaceContentDiv.append(listTemplate);
        // }

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