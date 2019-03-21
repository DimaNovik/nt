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

});