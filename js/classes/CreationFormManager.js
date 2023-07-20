export class CreationFormManager {
    constructor() {
        this.form = document.getElementById('createHero');
        this.form.addEventListener('change', this.update);
        this.reset(); // Reset on the first run in case the user reloaded the page
    }

    update(e) {
        let inputs = document.querySelectorAll('#creationForm input[type="range"]');
        let nbPoints = document.getElementById('nbPoints');
        let points = 24;

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

    validate() {
        let nbPointsLeft = document.getElementById('nbPoints').firstChild.nodeValue;
        let nameFieldValue = document.getElementById('name').value;
        return (nbPointsLeft === '0' && nameFieldValue !== '') ? true : false;
    }

    setData(state) {
        let inputs = this.form.querySelectorAll('input[type="range"]');
        inputs.forEach(elem => state.game.player[elem.id] = parseInt(elem.value));
        state.game.player.name = this.form.querySelector('input[type="text"').value;
    }

    reset() {
        let nbPoints = document.getElementById('nbPoints');
        nbPoints.innerHTML = 25;
        nbPoints.style.color = '#00ee00';

        let inputs = document.querySelectorAll('#creationForm input[type="range"]');
        inputs.forEach(elem => {
            elem.value = 1;
            elem.max = 22;
            elem.nextSibling.innerHTML = '1';
        })
        this.form.querySelector('input[type="text"').value = '';
    }
}