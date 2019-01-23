EventTarget.prototype.on = function (events, handler, ...options) {
	events.split(' ').forEach(event => {
		this.addEventListener(event, handler, ...options);
	});
};

EventTarget.prototype.off = function (events, handler, ...options) {
	events.split(' ').forEach(event => {
		this.removeEventListener(event, handler, ...options);
	});
};

function getPoint (source) {
	let { clientX: x, clientY: y } = source;
	
	x -= this.target.offsetLeft;
	y -= this.target.offsetTop;
	
	return { x, y };
}

MouseEvent.prototype.getPoint = function () {
	return getPoint.call(this, this);
};

if ('TouchEvent' in window) {
	TouchEvent.prototype.getPoint = function () {
		return getPoint.call(this, this.changedTouches[0]);
	};
}
