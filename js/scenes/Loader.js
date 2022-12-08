export default class Loader {
    constructor(state) {
        this.spinner = document.getElementsByTagName('svg')[0];
        this.button = document.querySelector('#loading button');
        this.button.addEventListener('click', e => {
            state.currScene = 'mainMenu';
            document.getElementById('loading').style.display = 'none';
            document.getElementById('menu').style.display = 'block';
            document.getElementById(state.currScene).style.display = 'block';
        });
    }

    hideSpinner() {
        this.spinner.style.display = 'none';
        this.spinner.nextSibling.nextSibling.style.display = 'none';
    }

    showButton() {
        this.button.style.display = 'block';
    }

    loadImg(images) {
        const imgList = ['tileset.png', 'hero.png', 'items.png', 'monsters.png', 'invBody.png', 'invThrow.png'];
        const loadingText = document.querySelector('#loading svg + div');

        return imgList.map(imgName => {
            return new Promise((resolve, reject) => {
                let paramName = imgName.split('.')[0];
                let url = './assets/img/' + imgName;

                images[paramName] = new Image();
                images[paramName].addEventListener('loadstart', () => loadingText.innerText = `Loading ${imgName} ...`)
                images[paramName].addEventListener('loadend', () => resolve(console.log(`OK --> ${imgName}`)));
                images[paramName].addEventListener('error', err => reject(loadingText.innerText = `ERROR loading ${imgName}`));
                images[paramName].src = url;
            })
        })
    }

    loadMusic(musics) {

    }

    loadSounds(sounds) {
        const soundList = ['interface.mp3', 'ogre.mp3', 'swing.mp3', 'sword.mp3'];
        const loadingText = document.querySelector('#loading svg + div');

        return soundList.map(soundName => {
            return new Promise((resolve, reject) => {
                let paramName = soundName.split('.')[0];
                let url = './assets/sounds/' + soundName;

                sounds[paramName] = new Audio();
                sounds[paramName].addEventListener('loadstart', () => loadingText.innerText = `Loading ${soundName} ...`)
                sounds[paramName].addEventListener('loadend', () => resolve(console.log(`OK --> ${soundName}`)));
                sounds[paramName].addEventListener('error', err => reject(loadingText.innerText = `ERROR loading ${soundName}`));
                sounds[paramName].src = url;
            })
        })
    }
}