export default class Controls {
	constructor (element, renderer) {
		this.element = element;
		this.renderer = renderer;
		
		this.subControls = [];
		this.moveHandler = this.move.bind(this);
		
		this.element.on('touchstart mousedown', this.start.bind(this));
		this.element.on('touchend touchcancel mouseup mouseleave', this.end.bind(this));
	}
	
	add (...controls) {
		this.subControls.push(...controls);
	}
	
	startDelay () {
		this.delayed = false;
		this.timer = setTimeout(() => {
			this.delayed = true;
			this.end();
		}, 200);
	}
	
	stopDelay () {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = 0;
		}
	}
	
	call (method, point = this.point) {
		try {
			this.subControls.forEach(control => control[method](point));
		} catch (err) { alert(err.stack); }
	}
	
	click () {
		if (!this.started || this.moving) return;
		
		this.call(this.delayed ? 'longPress' : 'click');
		this.renderer.update();
		this.renderer.render();
	}
	
	start (event) {
		event.preventDefault();
		
		if (this.started) return;
		
		this.started = true;
		
		if (!event.touches || event.touches.length === 1) {
			this.point = event.getPoint();
			this.startDelay();
		}
		
		this.element.on('touchmove mousemove', this.moveHandler);
	}
	
	move (event) {
		event.preventDefault();
		
		let point = event.getPoint(),
		    deltaX = point.x - this.point.x,
		    deltaY = point.y - this.point.y,
		    
		    hypot = Math.hypot(deltaX, deltaY);
		
		if (!this.moving && hypot > 3) {
			this.moving = true;
			this.stopDelay();
		}
		
		if (this.moving) {
			this.call('move', {
				point, lastPoint: this.point,
				hypot, deltaX, deltaY,
				touches: event.touches
			});
			
			this.renderer.update();
			this.renderer.render();
			
			this.point = point;
		} else this.end();
	}
	
	end () {
		if (!this.started) return;
		
		this.stopDelay();
		this.click();
		this.started = this.moving = this.delayed = false;
		
		this.element.off('touchmove mousemove', this.moveHandler);
		this.element.off('touchend touchcancel mouseup mouseleave', this.endHandler);
	}
}
