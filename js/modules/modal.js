//повторяющиеся действия, занесены отдельно в вызываемую функцию
function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}
//Вешаю обработчик события на каждую кнопку открытия модального окна
function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    console.log(modalTimerId);
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}
function modal(tiggerSelector, modalSelector, modalTimerId) {
    // modal
    //Получаю элементы модального окна и обложки
    const modalTrigger = document.querySelectorAll(tiggerSelector),
        modal = document.querySelector(modalSelector);


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });


    //проверка, если пользователь нажал на обложку, тогда закрывается модальное окно
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });
    //проверка если пользователь нажал кнопку Esc на клавиатуре и у модального окна есть класс show, тогда закрыть окно
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });
    


    function showModalByscroll() {
        //Сравнение сколько пользователь прокрутил с тем блоком на котором он сейчас находится
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            //удаляем обработчик событий после одного просмотра
            window.removeEventListener('scroll', showModalByscroll);
        }
    }
    // Появление модального окна если пользователь долистал страничку до конца
    window.addEventListener('scroll', showModalByscroll);

}
export default modal;

export { closeModal };
export { openModal };
