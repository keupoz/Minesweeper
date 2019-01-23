export default class Tile {
	constructor (x, y) {
		this.x = x;
		this.y = y;
		
		this.hasMine = this.marked = this.revealed = false;
		this.minesAround = 0;
	}
	
	placeMine () {
		this.hasMine = true;
	}
	
	mark (force) {
		if (this.revealed) return false;
		
		this.marked = force || !this.marked;
		return true;
	}
	
	reveal () {
		if (this.revealed || this.marked) return false;
		
		this.revealed = true;
		return true;
	}
}
