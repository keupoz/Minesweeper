import Map from './game/Map.js'

import MapRenderer from './render/Map.js'
import MapScreen from './render/MapScreen.js'
import StatsScreen from './render/StatsScreen.js'
import Renderer from './render/Renderer.js'

import Controls from './controls/Controls.js'
import MapControls from './controls/MapControls.js'

export default class Game {
	constructor (mapWidth, mapHeight, minesPercentage, tileSize, margin) {
		this.map         = new Map(mapWidth, mapHeight, minesPercentage);
		this.mapRenderer = new MapRenderer(this.map, tileSize, margin);
		this.mapScreen   = new MapScreen(this.mapRenderer);
		this.renderer    = new Renderer();
		
		this.controls = new Controls(this.canvas, this.renderer);
		this.controls.add(new MapControls(this.map, this.mapScreen));
		
		this.renderer.add(this.mapScreen, new StatsScreen(this.map));
	}
	
	get canvas () {
		return this.renderer.domElement;
	}
	
	setSize (width, height) {
		if (this.renderer.width === width || this.renderer.height === height) return;
		
		this.renderer.setSize(width, height);
		this.renderer.update();
		this.renderer.render();
	}
}
