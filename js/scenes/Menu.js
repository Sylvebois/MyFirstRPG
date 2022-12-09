import { buttons as buttonsText, forms as formsText, titles as titlesText, story } from "../text.js";

export default class Menu {
    constructor(state) {
        this.buttons = document.querySelectorAll('#menu button');
        this.buttons.forEach(button => button.addEventListener('click', e => {
            e.preventDefault();
            let buttonClass = e.target.className;

            if (buttonClass === 'new') { this.switchTo(state, 'creationForm'); }
            else if (buttonClass === 'load') { this.switchTo(state, 'loadForm'); }
            else if (buttonClass === 'options') { this.switchTo(state, 'optionsForm'); }
            else if (buttonClass === 'credits') { this.switchTo(state, 'credits'); }
            else if (buttonClass === 'back') {
                state.currScene === 'creationForm' ? this.resetCreationForm() : null;
                this.switchTo(state, 'mainMenu');
            }
            else if (buttonClass === 'start') {
                if (state.currScene === 'story') {
                    this.goToGame(state);
                }
                else {
                    if (this.validateCreationForm()) {
                        this.setCreationFormData(state);
                        this.resetCreationForm();
                        this.setIntroText(state);
                        this.switchTo(state, 'story');
                    }
                }
            }
        }));

        this.creationForm = document.getElementById('createHero');
        this.creationForm.addEventListener('change', this.updateCreationForm);
        this.resetCreationForm(); // Reset on the first run in case the user reloaded the page
        this.optionsForm = document.getElementById('options');
        this.manageOptionsForm(state);
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

    setIntroText(state) {
        document.getElementById('story').firstElementChild.innerText = story.intro[state.options.language]
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
        nbPoints.style = `color: ${points > 0 ? '#00ee00' : '#ff0000'}`;
    }

    validateCreationForm() {
        let nbPointsLeft = document.getElementById('nbPoints').firstChild.nodeValue;
        let nameFieldValue = document.getElementById('name').value;
        return (nbPointsLeft === '0' && nameFieldValue !== '') ? true : false;
    }

    setCreationFormData(state) {
        let inputs = this.creationForm.querySelectorAll('input[type="range"]');
        inputs.forEach(elem => state.game.player[elem.id] = parseInt(elem.value));
        state.game.player.name = this.creationForm.querySelector('input[type="text"').value;
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

    manageOptionsForm(state) {
        let options = state.options;
        let soundSwitch = this.optionsForm.querySelectorAll('#options input[name="soundSwitch"]');
        soundSwitch.forEach(radio => {
            if ((options.sound && radio.id === 'soundOn') ||
                (!options.sound && radio.id === 'soundOff')) {
                radio.checked = true;
            }
            radio.addEventListener('change', () => options.sound = parseInt(radio.value) ? true : false)
        });

        let musicSwitch = this.optionsForm.querySelectorAll('#options input[name="musicSwitch"]');
        musicSwitch.forEach(radio => {
            if ((options.music && radio.id === 'musicOn') ||
                (!options.music && radio.id === 'musicOff')) {
                radio.checked = true;
            }
            radio.addEventListener('change', () => {
                if (parseInt(radio.value)) {
                    options.music = true;
                    this.playMusic(state.assets.musics.menu);
                }
                else {
                    options.music = false;
                    this.stopMusic(state.assets.musics.menu);
                }
            })
        });

        let langSwitch = this.optionsForm.querySelectorAll('#options input[name="langSwitch"]');
        langSwitch.forEach(radio => {
            if (options.language === radio.value) {
                radio.checked = true;
            }
            radio.addEventListener('change', () => {
                options.language = radio.value;
                this.updateText(options.language);
            })
        });
    }

    playMusic(music) {
        console.log(music)
        if (music.paused) { music.play(); }
    }

    stopMusic(music) {
        if (!music.paused) { music.pause(); }
    }

    updateText(newLang) {
        let allTitles = document.querySelectorAll('h2');
        allTitles.forEach(t => t.innerText = titlesText[t.className][newLang]);

        let allButtons = document.querySelectorAll('button');
        allButtons.forEach(b => b.innerText = buttonsText[b.className][newLang]);

        let allLabels = document.querySelectorAll('label');
        allLabels.forEach(l => l.innerText = formsText[l.htmlFor][newLang]);

        let optionSpans = document.querySelectorAll('#optionsForm span');
        optionSpans.forEach(s => s.innerHTML = formsText[s.className][newLang]);

        document.querySelector('.pointsLeft').innerHTML = formsText['pointsLeft'][newLang];
    }
}