function tabs(tabsSelector, tarbsContentSelector, tabsParentSelector, activeClass) {
    //ТАБЫ

    // получил лементы в псевдомасив
    const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tarbsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);
    // скрываю лишние блоки со строницы, оставляю один
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove(activeClass);
        });
    }
    // функция котора запускает отображение блока в зависимости от его индекса,
    // он получается при клике в др.функции, по умолчанию, если в i ничего не попадает тогода i = 0
    function showTabConten(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }
    // запускаю функцию скрыия всех элементов и отображения первого для инициализации
    hideTabContent();
    showTabConten();
    //вешаю обработчик события который при клике на таб, показывает соответствующий контент
    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        //проверяю через евент клик если true и еслить имеет класс
        if (target && target.classList.contains(tabsSelector.slice(1))) {
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
}

export default tabs;