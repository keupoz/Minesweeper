export function random (max) {
	return Math.floor(Math.random() * max);
}

export function createContext () {
	let ctx = document.createElement('canvas').getContext('2d');
	ctx.imageSmoothingEnabled = false;
	return ctx;
}
