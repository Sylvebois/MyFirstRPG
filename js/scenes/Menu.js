import { buttons as buttonsText, forms as formsText, titles as titlesText, story } from "../text.js";
import { CreationFormManager } from "../classes/CreationFormManager.js";

export default class Menu {
    constructor(state) {
        this.initEventListeners(state);
        this.creationForm = new CreationFormManager();
        this.optionsForm = document.getElementById('options');
        this.manageOptionsForm(state);
    }

    initEventListeners(state) {
        let buttons = document.querySelectorAll('#menu button');
        buttons.forEach(button => button.addEventListener('click', e => {
            e.preventDefault();
            let buttonClass = e.target.className;

            if (buttonClass === 'new') { this.switchTo(state, 'creationForm'); }
            else if (buttonClass === 'load') { this.switchTo(state, 'loadForm'); }
            else if (buttonClass === 'save') { this.saveData(state); }
            else if (buttonClass === 'options') { this.switchTo(state, 'optionsForm'); }
            else if (buttonClass === 'credits') { this.switchTo(state, 'credits'); }
            else if (buttonClass === 'backToMain') {
                this.switchTo(state, 'mainMenu');
                state.gameIsRunning = false;
            }
            else if (buttonClass === 'start') {
                if (state.currScene === 'story') {
                    this.goToGame(state);
                }
                else {
                    if (this.creationForm.validate()) {
                        this.creationForm.setData(state);
                        this.creationForm.reset();
                        this.setIntroText(state);
                        this.switchTo(state, 'story');
                    }
                }
            }
            else if (buttonClass === 'back') {
                if (state.currScene === 'creationForm') { this.creationForm.reset(); }

                if (state.currScene === 'inGameMenu') { this.goToGame(state); }
                else if (state.currScene === 'optionsForm' && state.gameIsRunning) {
                    this.switchTo(state, 'inGameMenu');
                }
                else {
                    this.switchTo(state, 'mainMenu');
                }
            }
        }));
    }

    saveData(state) {
        console.log('SAVED');
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
        document.getElementById('gameInterface').style.visibility = 'visible';
        state.currScene = 'gameInterface';
        state.gameIsRunning = true;
    }

    setIntroText(state) {
        document.getElementById('story').firstElementChild.innerText = story.intro[state.options.language]
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