import Screen from './Screen.js'

export default class StatsScreen extends Screen {
	constructor (map) {
		super();
		this.map = map;
	}
	
	update ({ width, height }) {
		if (this.width === width && this.height === height) return;
		
		this.setSize(width, height);
	}
	
	render () {
		this.clear();
		
		this.ctx.fillStyle = '#333333';
		this.ctx.fillRect(0,0, 40,40);
		
		this.ctx.fillStyle = 'whitesmoke';
		this.ctx.font = 'bold 20px monospace';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(this.map.minesLeft, 20,20);
		
		if (this.map.finished) {
			this.ctx.fillStyle = this.map.won ? 'limegreen' : 'maroon';
			this.ctx.font = 'bold ' + (this.map.failed ? 'italic' : '') + ' 70px monospace';
			this.ctx.fillText(this.map.won ? 'You won!' : 'YOU DIED', this.width / 2, this.height / 2);
		}
	}
}
