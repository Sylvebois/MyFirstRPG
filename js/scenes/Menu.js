export default class Menu {
    constructor(currentScene) {
        this.currentScene = currentScene;
        this.main = document.getElementById('menu');
        this.buttons = document.querySelectorAll('#menu button');
        this.buttons.forEach(button => button.addEventListener('click', e => {
            e.preventDefault();
            let buttonClass = e.target.className;

            switch (buttonClass) {
                case 'new':
                    this.switchTo('creationForm');
                    break;
                case 'load':
                    this.switchTo('loadForm');
                    break;
                case 'options':
                    this.switchTo('optionsForm');
                    break;
                case 'credits':
                    this.switchTo('credits');
                    break;
                case 'back':
                    this.switchTo('mainMenu');
                    break;
                case 'start':
                    this.currScene === 'story' ? this.hide() : this.switchTo('story');
                    break;
            } 
        }));
    }

    switchTo(next) {
        document.getElementById(this.currentScene).style.display = 'none';
        document.getElementById(next).style.display = 'block';
        this.currentScene = next;
    }

    show() {
        document.getElementById('menu').style.display = 'block';
        document.getElementById(this.currentScene).style.display = 'block';
    }

    hide() {
        document.getElementById('menu').style.display = 'none';
        document.getElementById(this.currentScene).style.display = 'none';
    }
}