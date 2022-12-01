export default class Menu {
    constructor(state) {
        this.buttons = document.querySelectorAll('#menu button');
        this.buttons.forEach(button => button.addEventListener('click', e => {
            e.preventDefault();
            let buttonClass = e.target.className;

            switch (buttonClass) {
                case 'new':
                    this.switchTo(state, 'creationForm');
                    break;
                case 'load':
                    this.switchTo(state, 'loadForm');
                    break;
                case 'options':
                    this.switchTo(state, 'optionsForm');
                    break;
                case 'credits':
                    this.switchTo(state, 'credits');
                    break;
                case 'back':
                    state.currScene === 'creationForm' ? this.resetCreationForm() : null;
                    this.switchTo(state, 'mainMenu');
                    break;
                case 'start':
                    if (state.currScene === 'story') {
                        this.goToGame(state);
                    }
                    else {
                        if (this.validateCreationForm()) {
                            this.setCreationFormData(state);
                            this.resetCreationForm();
                            this.switchTo(state, 'story');
                        }
                    }
                    break;
            }
        }));

        this.creationForm = document.getElementById('createHero');
        this.creationForm.addEventListener('change', this.updateCreationForm);
        this.resetCreationForm(); // Reset on the first run in case the user reloaded the page
    }

    show(state) {
        document.getElementById('menu').style.display = 'block';
        document.getElementById(state.currScene).style.display = 'block';
    }

    switchTo(state, next) {
        document.getElementById(state.currScene).style.display = 'none';
        document.getElementById(next).style.display = 'block';
        state.currScene = next;
    }

    goToGame(state) {
        document.getElementById('menu').style.display = 'none';
        document.getElementById(state.currScene).style.display = 'none';
        document.getElementById('gameInterface').style.display = 'block';
        state.currScene = 'gameInterface';
    }

    resetCreationForm() {
        document.getElementById('nbPoints').innerHTML = 25;

        let inputs = document.querySelectorAll('#creationForm input[type="range"]');
        inputs.forEach(elem => {
            elem.value = 1;
            elem.max = 22;
            elem.nextSibling.innerHTML = '1';
        })
        this.creationForm.querySelector('input[type="text"').value = '';
    }

    updateCreationForm(e) {
        let inputs = document.querySelectorAll('#creationForm input[type="range"]');
        let nbPoints = document.getElementById('nbPoints');
        let points = 25;

        inputs.forEach(elem => {
            points -= parseInt(elem.value);
            elem.nextSibling.innerHTML = elem.value;
        });
        inputs.forEach(elem => {
            let reste = points + parseInt(elem.value);
            elem.max = reste <= 0 ? 1 : reste;
        })

        nbPoints.innerHTML = points;
        nbPoints.style = `color: ${points >= 0 ? '#00ee00' : '#ff0000'}`;
    }

    validateCreationForm() {
        let nbPointsLeft = document.getElementById('nbPoints').firstChild.nodeValue;
        let nameFieldValue = document.getElementById('name').value;
        return (nbPointsLeft === '0' && nameFieldValue !== '') ? true : false;
    }

    setCreationFormData(state) {
        let inputs = this.creationForm.querySelectorAll('input[type="range"]');
        inputs.forEach(elem => state.game.player[elem.id] = parseInt(elem.value));
        state.game.player.name = this.creationForm.querySelector('input[type="text"').value ;
    }
}