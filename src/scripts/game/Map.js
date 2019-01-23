import { random } from '../utils.js'
import Tile from './Tile.js'

export default class Map {
	constructor (...args) {
		this.changed = new Array();
		this.init(...args);
	}
	
	get finished () {
		return this.won || this.failed;
	}
	
	resetChanges () {
		this.changed.length = 0;
	}
	
	reset () {
		this.started = this.won = this.failed = false;
		this.minesTotal = this.minesLeft = this.minesPercentage * this.tiles.length;
		
		this.resetChanges();
	}
	
	reinit () {
		this.init(this.width, this.height, this.minesPercentage);
	}
	
	init (width, height, minesPercentage) {
		this.width = width;
		this.height = height;
		this.minesPercentage = minesPercentage;
		
		this.field = new Array(this.width);
		this.tiles = new Array(this.width * this.height);
		
		this.reset();
		
		let i = 0;
		
		for (let x = 0; x < this.width; x++) {
			this.field[x] = new Array(this.height);
			for (let y = 0; y < this.height; y++) {
				this.field[x][y] = this.tiles[i++] = this.changed[i++] = new Tile(x, y);
			}
		}
	}
	
	start (x, y) {
		this.placeMines(x,y);
		this.reveal(x,y);
		this.started = true;
	}
	
	
	getTile (x, y, callback) {
		if (this.field[x] && this.field[x][y]) {
			callback.call(this, this.field[x][y]);
		}
	}
	
	getNeighbours ({ x, y }, callback) {
		for (let x1 = -1; x1 <= 1; x1++) {
			for (let y1 = -1; y1 <= 1; y1++) {
				if (x1 !== 0 || y1 !== 0) this.getTile(x + x1, y + y1, callback);
			}
		}
	}
	
	placeMines (x, y) {
		let tiles = this.tiles.filter(tile => tile.x !== x && tile.y !== y);
		
		for (let i = 0; i < this.minesTotal; i++) {
			let index = random(tiles.length);
			tiles[index].placeMine();
			tiles.splice(index, 1);
		}
		
		this.tiles.forEach(tile => {
			if (!tile.hasMine) this.getNeighbours(tile, function (neighbour) {
				if (neighbour.hasMine) tile.minesAround++;
			});
		});
	}
	
	
	revealNeighbours (tile) {
		let toReveal = [], marked = 0;
		
		this.getNeighbours(tile, neighbour => {
			if (neighbour.marked) marked++;
			else if (!neighbour.revealed) toReveal.push(neighbour);
		});
		
		if (toReveal.length && (!tile.minesAround || (marked && marked >= tile.minesAround))) {
			toReveal.forEach(neighbour => this.revealTile(neighbour));
		}
	}
	
	revealTile (tile, force) {
		if (tile.reveal()) {
			this.changed.push(tile);
			
			if (tile.hasMine) this.failed = true;
		}
		if (!this.failed && (!tile.minesAround || force)) this.revealNeighbours(tile);
	}
	
	reveal (x, y) {
		this.getTile(x, y, function (tile) {
			if (tile.marked) return;
			
			this.revealTile(tile, tile.revealed);
			this.checkWin();
		});
	}
	
	
	markTile (tile) {
		if (tile.mark()) {
			this.minesLeft += tile.marked ? -1 : 1;
			this.changed.push(tile);
		}
	}
	
	markNeighbours (tile) {
		let toMark = [], unrevealed = 0;
		
		this.getNeighbours(tile, function (neighbour) {
			if (!neighbour.revealed) {
				if (!neighbour.marked) toMark.push(neighbour);
				unrevealed++;
			}
		});
		
		if (toMark.length && tile.minesAround >= unrevealed) {
			toMark.forEach(neighbour => this.markTile(neighbour));
		}
	}
	
	mark (x,y) {
		this.getTile(x, y, function (tile) {
			if (tile.revealed) this.markNeighbours(tile);
			else this.markTile(tile);
		});
		
		this.checkWin();
	}
	
	checkWin () {
		if (this.won || this.failed || !this.changed.length) return;
		
		let unrevealed = [], unmarked = [],
		    rightMarked = 0;
		
		this.tiles.forEach(tile => {
			if (!tile.revealed) {
				unrevealed.push(tile);
				
				if (!tile.marked) unmarked.push(tile);
				else if (tile.hasMine) rightMarked++;
			}
		});
		
		if (unrevealed.length === this.minesTotal) {
			unrevealed.forEach(tile => tile.mark(true));
			this.minesLeft = 0;
			this.won = true;
		} else if (rightMarked === this.minesTotal) {
			unmarked.forEach(tile => this.revealTile(tile));
			this.won = true;
		}
	}
}
