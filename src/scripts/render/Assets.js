import { createContext } from '../utils.js'

let colors = [-1, 'royalblue', 'forestgreen', 'tomato', 'darkblue', 'maroon', 'darkcyan', 'purple', 'cyan']

export default class Assets {
	constructor (tileSize) {
		this.tileSize = tileSize;
		this.tileHalf = this.tileSize / 2;
		
		this.init();
	}
	
	getRevealed (mines) {
		if (mines === true) mines = -1;
		
		return this['revealed' + mines];
	}
	
	prepair () {
		let ctx = createContext();
		ctx.canvas.width = ctx.canvas.height = this.tileSize;
		return ctx;
	}
	
	initRevealed (mines) {
		let ctx  = this.prepair();
		
		this['revealed' + mines] = ctx.canvas;
		
		ctx.fillStyle = 'whitesmoke';
		ctx.fillRect(0,0, this.tileSize, this.tileSize);
		
		if (mines === -1) {
			let radius = this.tileSize / 3;
			
			ctx.beginPath();
			ctx.fillStyle = '#333333';
			ctx.arc(this.tileHalf, this.tileHalf, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
		} else if (mines) {
			ctx.fillStyle = colors[mines];
			ctx.font = 'bold ' + this.tileHalf + 'px monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(mines, this.tileHalf, this.tileHalf);
		}
	}
	
	initUnrevealed () {
		let ctx = this.prepair();
		
		this.unrevealed = ctx.canvas;
		
		ctx.fillStyle = 'dodgerblue';
		ctx.fillRect(0,0, this.tileSize, this.tileSize);
	}
	
	initMarked () {
		let ctx = this.prepair(),
		    radius = this.tileSize / 3;
		
		this.marked = ctx.canvas;
		
		ctx.drawImage(this.unrevealed, 0,0);
		ctx.beginPath();
		ctx.fillStyle = '#eeeeee';
		ctx.arc(this.tileHalf, this.tileHalf, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
	
	init () {
		for (let i = -1; i < 9; i++) this.initRevealed(i);
		this.initUnrevealed();
		this.initMarked();
	}
}
