import './event-utils.js'

import Game from './Game.js'

let game = new Game(30,20, 0.25, 100,5),
    output = document.querySelector('#game');

game.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', function () {
	game.setSize(window.innerWidth, window.innerHeight);
});

output.appendChild(game.canvas);
