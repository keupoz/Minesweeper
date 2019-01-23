import Screen from './Screen.js'
import Assets from './Assets.js'

export default class MapRenderer extends Screen {
	constructor (map, tileSize, margin) {
		super();
		
		this.map = map;
		
		this.tileSize = tileSize;
		this.margin = margin;
		this.tileArea = this.tileSize + this.margin;
		
		this.assets = new Assets(this.tileSize);
		
		this.changed = false;
	}
	
	update () {
		let width  = this.tileArea * this.map.width  - this.margin,
		    height = this.tileArea * this.map.height - this.margin;
		
		if (this.width === width && this.height === height) return;
		
		this.setSize(width, height);
		this.changed = true;
	}
	
	render () {
		if (!this.changed || !this.map.changed.length) return;
		
		let tiles = this.changed ? this.map.tiles : this.map.changed;
		
		if (this.changed) this.fill('#dddddd');
		
		if (tiles.length) tiles.forEach(tile => {
			let dx = tile.x * this.tileArea,
			    dy = tile.y * this.tileArea,
			    asset;
			
			if (tile.revealed) {
				asset = this.assets.getRevealed(tile.hasMine || tile.minesAround);
			} else if (tile.marked) {
				asset = this.assets.marked;
			} else {
				asset = this.assets.unrevealed;
			}
			
			this.ctx.drawImage(asset, dx,dy);
		});
		
		this.map.resetChanges();
	}
}
