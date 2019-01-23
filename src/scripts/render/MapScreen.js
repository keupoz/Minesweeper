import Screen from './Screen.js'

export default class MapScreen extends Screen {
	constructor (mapRenderer) {
		super();
		
		this.mapRenderer = mapRenderer;
		
		this.mapX = this.mapY = 0;
		this.offsetX = this.offsetY = 0;
		this.scale = 0.5;
	}
	
	setOffset (x,y) {
		this.offsetX = x;
		this.offsetY = y;
	}
	
	move (x, y) {
		this.setOffset(this.offsetX + x / this.scale, this.offsetY + y / this.scale);
	}
	
	zoom (scale) {
		this.scale += scale;
		
		if (this.scale < 0.25) this.scale = 0.25;
		else if (this.scale > 2) this.scale = 2;
	}
	
	updateCenter () {
		this.centerX = this.width / 2;
		this.centerY = this.height / 2;
	}
		
	updateMapPosition () {
		this.mapX = this.offsetX - this.mapRenderer.width / 2;
		this.mapY = this.offsetY - this.mapRenderer.height / 2;
	}
	
	update ({ width, height }) {
		if (this.width !== width || this.height !== height) {
			this.setSize(width, height);
			this.updateCenter();
		}
		
		this.mapRenderer.update();
		this.updateMapPosition();
	}
	
	render () {
		if (!this.mapRenderer.changed) return;
		
		this.mapRenderer.render();
		
		this.ctx.setTransform(1,0,0,1,0,0);
		this.clear();
		
		this.ctx.translate(this.centerX, this.centerY);
		this.ctx.scale(this.scale, this.scale);
		this.ctx.translate(this.mapX, this.mapY);
		
		this.ctx.drawImage(this.mapRenderer.domElement, 0,0);
	}
}
