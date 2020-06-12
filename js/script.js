'use stcrict';
document.addEventListener('DOMContentLoaded', () => {
	//ТАБЫ

	// получил лементы в псевдомасив
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');
	// скрываю лишние блоки со строницы, оставляю один
	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}
	// функция котора запускает отображение блока в зависимости от его индекса,
	// он получается при клике в др.функции, по умолчанию, если в i ничего не попадает тогода i = 0
	function showTabConten(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}
	// запускаю функцию скрыия всех элементов и отображения первого для инициализации
	hideTabContent();
	showTabConten();
	//вешаю обработчик события который при клике на таб, показывает соответствующий контент
	tabsParent.addEventListener('click', (event) => {
		const target = event.target;
		//проверяю через евент клик если true и еслить имеет класс
		if (target && target.classList.contains('tabheader__item')) {
			// делаю вторую проверку, что элемент на который кликнули совпадает с элементом из псевдомассива
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					// передаю порядковый номер элемента на который кликнули, для отображения этого таба
					showTabConten(i);
				}
			});
		}
	});

	//ТАЙМЕР ОБРАТНОГО ОТСЧЕТА

	const deadline = '2020-06-23';
	//функция которая сравнивает вермя в deadline и текущее время и полчает разницу между датами
	function getTimeRemaining(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / (1000 * 60 * 60) % 24)),
			minutes = Math.floor((t / 1000 / 60) % 60),
			seconds = Math.floor((t / 1000) % 60);

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};

	}
	//функция проверки на число меньше 10, если да, то подставлять 0
	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	// функция которая устанавливает таймер на страничку
	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timerinterval = setInterval(updateClock, 1000);
		//инициализирую функцию для устранения бага с первоначальной датой
		updateClock();
		//функция которая обновляет таймер
		function updateClock() {
			const t = getTimeRemaining(endtime);
			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);
			//если таймер дошел до 0, то остановить.
			if (t.total <= 0) {
				clearInterval(timerinterval);
			}
		}
	}

	setClock('.timer', deadline);

	// Работа с модальным окном
	//Получаю элементы модального окна и обложки
	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');
	//Вешаю обработчик события на каждую кнопку открытия модального окна
	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId);
	}

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal);
	});

	//повторяющиеся действия, занесены отдельно в вызываемую функцию
	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}
	//проверка, если пользователь нажал на обложку, тогда закрывается модальное окно
	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});
	//проверка если пользователь нажал кнопку Esc на клавиатуре и у модального окна есть класс show, тогда закрыть окно
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});

	function showModalByscroll() {
		//Сравнение сколько пользователь прокрутил с тем блоком на котором он сейчас находится
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			//удаляем обработчик событий после одного просмотра
			window.removeEventListener('scroll', showModalByscroll);
		}
	}
	//Открытие модального окна через несколько секунд
	const modalTimerId = setTimeout(openModal, 50000);

	// Появление модального окна если пользователь долистал страничку до конца
	window.addEventListener('scroll', showModalByscroll);

	//Реализация динамических карточек на страницу через шаблонизацию КЛАССЫ конструкторы

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.parent = document.querySelector(parentSelector);
			this.classes = classes;
			this.transfer = 2;
			this.changeToUAH();
		}
		changeToUAH() {
			this.price = this.price * this.transfer;
		}
		renred() {
			const element = document.createElement('div');
			//Проверка на то что  ...classes не пустой, если пустой то передать параметры по умолчанию 'menu_iten'
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => element.classList.add(className));
			}
			element.innerHTML = `
										<img src=${this.src} alt=${this.alt}>
										<h3 class="menu__item-subtitle">${this.title}</h3>
										<div class="menu__item-descr">${this.descr}</div>
										<div class="menu__item-divider"></div>
										<div class="menu__item-price">
												<div class="menu__item-cost">Цена:</div>
												<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
										</div>
						`;
			this.parent.append(element);
		}
	}

	new MenuCard(
		'img/tabs/vegy.jpg',
		'vegy',
		'Меню "vegy"',
		`Меню "vegy" - это новый подход к приготовлению блюд: больше свежих
				овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной
				ценой и высоким качеством!`,
		9,
		'.menu .container',
		'menu__item',
		'big'
	).renred();

	new MenuCard(
		'img/tabs/elite.jpg',
		'elite',
		'Меню "elite"',
		`Меню "elite" - это новый подход к приготовлению блюд: больше свежих
				овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной
				ценой и высоким качеством!`,
		12,
		'.menu .container',
		'menu__item'
	).renred();

	new MenuCard(
		'img/tabs/post.jpg',
		'vegy',
		'Меню "post"',
		`Меню "post" - это новый подход к приготовлению блюд: больше свежих
				овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной
				ценой и высоким качеством!`,
		5,
		'.menu .container',
		'menu__item'
	).renred();

	//Forms
	const forms = document.querySelectorAll('form')
	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся!',
		failure: 'Что-то пошло не так...'
	}
	forms.forEach(item => {
		postData(item);
	});

	function postData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			const object = {};
			formData.forEach((value, key) => {
				object[key] = value;
			});

			fetch('server.php', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(object)
			}).then(data => data.text()).then(data => {
				console.log(data);
				showThanksModal(message.success);
				statusMessage.remove();
			}).catch(() => {
				showThanksModal(message.failure);
			}).finally(() => {
				form.reset();
			})
		});
	}
	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');
		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;
		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}

});