import Screen from './Screen.js'

export default class Renderer extends Screen {
	constructor () {
		super();
		
		this.screens = new Array();
	}
	
	add (...screens) {
		this.screens.push(...screens);
	}
	
	update () {
		this.screens.forEach(screen => screen.update(this));
	}
	
	render () {
		this.fill('#000000');
		
		this.screens.forEach(screen => {
			screen.render();
			this.ctx.drawImage(screen.domElement, 0,0);
		});
	}
}
