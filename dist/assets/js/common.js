window.addEventListener('load', function () {

    (function togglePopup() {
        var link = document.querySelector('.header__auth .link');
        var popup = document.querySelector('.auth__popup');
        var overlay = document.querySelector('.overlay');

        link.addEventListener('click', function (e) {
            e.preventDefault();

            if(!popup.classList.contains('active')) popup.classList.add('active');

            if(!overlay.classList.contains('active')) overlay.classList.add('active');
        });

        overlay.addEventListener('click', function () {
            popup.classList.remove('active');
            this.classList.remove('active');
        })
    })();

    (function toogleMenu() {
        var nav = document.querySelector('.header__nav');
        var burger = document.querySelector('.header__nav_mob .burger');
        var menu = document.querySelectorAll('.header__list .link');

        burger.addEventListener('click', function (e) {
            e.preventDefault();
            nav.classList.toggle('active');
        });

        menu.forEach(function (item) {
            item.addEventListener('click', function () {
                this.nextElementSibling.classList.toggle('active');
            })
        })

    })();

});