function modal() {
    // modal
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

}
module.exports = modal;