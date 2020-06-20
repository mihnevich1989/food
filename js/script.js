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
		render() {
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

	getResource('http://localhost:3000/menu')
		.then(data => {
			data.forEach(({
				img,
				altimg,
				title,
				descr,
				price
			}) => {
				new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
			});
		});

	// альтернативный способ добавления карточки
	/* getResource('http://localhost:3000/menu')
		.then(data => createData(data));

	function createData(data) {
		data.forEach(({ img, altimg, title, descr, price }) => {
			const element = document.createElement('div');

			element.classList.add('menu__item');

			element.innerHTML = `
			<img src=${img} alt=${altimg}>
				<h3 class="menu__item-subtitle">${title}</h3>
				<div class="menu__item-descr">${descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${price}</span> грн/день</div>
				</div>
			`;
			document.querySelector('.menu .container').append(element);
		});
	} */

	//Forms
	const forms = document.querySelectorAll('form');
	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся!',
		failure: 'Что-то пошло не так...'
	};
	forms.forEach(item => {
		bindPostData(item);
	});

	const postData = async (url, data) => {
		let res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});
		return await res.json();
	};

	async function getResource(url) {
		let res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Не могу зафечить ${url}, статус: ${res.status}`);
		}
		return await res.json();
	}

	function bindPostData(form) {
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

			//пояснение смотреть в ud.59
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				}).catch(() => {
					showThanksModal(message.failure);
				}).finally(() => {
					form.reset();
				});
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

	//слайдер
	const prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		current = document.querySelector('#current'),
		total = document.querySelector('#total'),
		slides = document.querySelectorAll('.offer__slide'),
		slider = document.querySelector('.offer__slider'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slider-inner'),
		width = window.getComputedStyle(slidesWrapper).width;
	let slideIndex = 1;
	let offset = 0;

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}

	slidesField.style.width = 100 * slides.length + '%';
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';
	slidesWrapper.style.overflow = 'hidden'
	slides.forEach(slide => {
		slide.style.width = width;
	});

	slider.style.position = 'relative';

	const indicators = document.createElement('ol'),
		dots = [];
	indicators.classList.add('carousel-indicators');
	indicators.style.cssText = `
	position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
	list-style: none;
	`;
	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
		box-sizing: content-box;
		flex: 0 1 auto;
		width: 30px;
		height: 6px;
		margin-right: 3px;
		margin-left: 3px;
		cursor: pointer;
		background-color: #fff;
		background-clip: padding-box;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		opacity: .5;
		transition: opacity .6s ease;
		`;
		if (i == 0) {
			dot.style.opacity = 1;
		}
		indicators.append(dot);
		dots.push(dot);
	}
	function currentText(index) {
		if (slides.length < 10) {
			current.textContent = `0${index}`
		} else {
			current.textContent = index;
		}
	}
	function styleOpacity() {
		dots.forEach(dot => dot.style.opacity = 0.5);
		dots[slideIndex - 1].style.opacity = 1;
	}
	function deleteNotDigits(str) {
		return +str.replace(/\D/g, '');
	}
	next.addEventListener('click', () => {
		if (offset == deleteNotDigits(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += deleteNotDigits(width);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}
		currentText(slideIndex);

		styleOpacity();
	});
	prev.addEventListener('click', () => {
		if (offset == 0) {
			offset = deleteNotDigits(width) * (slides.length - 1)
		} else {
			offset -= deleteNotDigits(width);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		currentText(slideIndex)

		styleOpacity();
	});
	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = deleteNotDigits(width) * (slideTo - 1);

			slidesField.style.transform = `translateX(-${offset}px)`;

			currentText(slideIndex)

			styleOpacity();

		});
	});
	//Простой слайдер
	/* showSlides(slideIndex);
	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
	} else {
		total.textContent = slides.length;
	}

	function showSlides(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = slides.length;
		}
		slides.forEach(item => item.style.display = 'none');
		slides[slideIndex - 1].style.display = 'block';
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}

	function plusSlides(n) {
		showSlides(slideIndex += n);
	}
	prev.addEventListener('click', () => {
		plusSlides(-1);
	});
	next.addEventListener('click', () => {
		plusSlides(1);
	}); */
});