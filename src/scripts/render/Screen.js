import { createContext } from '../utils.js'

export default class Screen {
	constructor () {
		this.ctx = createContext();
		this.domElement = this.ctx.canvas;
		
		let { width, height } = this.domElement;
		this.setSize(width, height);
	}
	
	setSize (width, height) {
		this.domElement.width = this.width = width;
		this.domElement.height = this.height = height;
	}
	
	clear () {
		this.ctx.clearRect(0,0, this.width, this.height);
	}
	
	fill (color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0,0, this.width, this.height);
	}
	
	update () {}
	render () {}
}
