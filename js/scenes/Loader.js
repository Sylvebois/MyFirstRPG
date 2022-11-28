export default class Loader {
    constructor() {
        this.spinner = document.getElementsByTagName('svg')[0];
        this.button = document.querySelector('#loading button');
        this.button.addEventListener('click', this.goToMenu);
    }

    hideSpinner() {
        this.spinner.style.display = 'none';
        this.spinner.nextSibling.nextSibling.style.display = 'none';
    }

    showButton() {
        this.button.style.display = 'block';
    }

    goToMenu(e) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
        document.getElementById('mainMenu').style.display = 'block';
    }
}