export default class MapControls {
	constructor (map, mapScreen) {
		this.map = map;
		this.mapScreen = mapScreen;
		this.mapRenderer = this.mapScreen.mapRenderer;
	}
	
	getPoint (point) {
		let { centerX, centerY, mapX, mapY, scale } = this.mapScreen,
		    
		    mapOffsetX = centerX + mapX * scale,
		    mapOffsetY = centerY + mapY * scale,
		    
		    tileArea = this.mapRenderer.tileArea * scale,
		    
		    x = Math.floor((point.x - mapOffsetX) / tileArea),
		    y = Math.floor((point.y - mapOffsetY) / tileArea);
		
		return { x, y };
	}
	
	click (point) {
		if (this.map.finished) return this.map.reinit();
		
		let { x, y } = this.getPoint(point);
		
		if (!this.map.started) this.map.start(x,y);
		else this.map.reveal(x,y);
	}
	
	longPress (point) {
		if (!this.map.started || this.map.finished) return;
		
		let { x, y } = this.getPoint(point);
		this.map.mark(x,y);
	}
	
	move ({ touches, deltaX, deltaY }) {
		if (touches && touches.length == 2) {
			let dX = touches[0].clientX - touches[1].clientX,
			    dY = touches[0].clientY - touches[1].clientY,
			    
			    hypot = Math.hypot(dX, dY);
			
			if (this.hypot) this.mapScreen.zoom(hypot < this.hypot ? -0.075 : 0.075);
			
			this.hypot = hypot;
		} else this.mapScreen.move(deltaX, deltaY);
	}
}
