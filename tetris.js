'use strict';

var Tetris = function() {
	var defaults = {
			unit: 30,
			width: 10,
			height: 20,
			speed: 200
		},
		settings = defaults,
		current_letter = null,
		bg_color = '#161616',
		grid_color = '#333',
		width,
		height,
		grid_width = 1,
		KEYS = {
			ENTER       : 13,
			PAUSE_BREAK : 19,
			ESC         : 27,
			SPACE       : 32,
			LEFT        : 37,
			TOP         : 38,
			RIGHT       : 39,
			BOTTOM      : 40
		}; 


	/* Utilities */
	var utils = {
		get_pixel_coords : function(units) {
			return (settings.unit + 1) * units + 1;
		},
		random : function(num) {
			return Math.floor(Math.random() * num);
		}
	};
				
	/* Drawing object */
	var canvas = function(){
		var el = document.getElementById('cnv'),
			context = el.getContext('2d');
					
		function init() {
			el.width = width;
			el.height = height;
				
			clear();
		}
					
		function clear() {
			clear_bg();
			draw_grid();
		}
					
		function clear_bg() { /* Очищает поле */
			context.fillStyle = bg_color;
			context.fillRect(0, 0, settings.width*settings.unit, settings.height*settings.unit);
		}
				
		function draw_horizontal_line(y) {
			context.fillStyle = grid_color;
			context.fillRect(0, y, width, 1);
		}
			
		function draw_vertical_line(x) {
			context.fillStyle = grid_color;
			context.fillRect(x, 0, 1, height);
		}
				
		function draw_grid() { // Draw grid
			draw_vertical_line(0);
			for(var i = 1, count_vert = settings.width; i <= count_vert; i++) {
				draw_vertical_line(i * (settings.unit + 1));
			}
			draw_horizontal_line(0);
			for(var j = 1, count_hor = settings.height; j <= count_hor; j++) {
				draw_horizontal_line(j * (settings.unit + 1));
			}
		}
					
		function draw_unit(x, y, color) {
			context.fillStyle = color;
			context.fillRect(utils.get_pixel_coords(x), utils.get_pixel_coords(y), settings.unit, settings.unit);
		}
				
				
		return {
			init : init,
			clear : clear,
			draw_unit : draw_unit
		};
	}();
				
				
	/* Data object */
	var data = function() {
		var matrix = [],
			colors = [];
			
		function create_base(width, height, unit) {
			for (var i = 0; i < height; i++) {
				matrix[i] = 0;
				for (var j = 0; i < height; j++) {
					matrix[i][j] = 0;
				}
			}
		}
		
		function add_letter() {
			for (var i = 0; i < current.coords.length; i++) {
				var m = current.coords[i];
				for (var j = 0, d = m.length; j < d; j++) {
					if (current.coords[i][j] === 1) {
						matrix.coords[current.y + i][current.x + j] = current.color;
					}
				}
			}
		}
					
		function draw() {
			for (var i = 0, c = matrix.length; i < c; i++) {
				var arr = matrix[i];
				for (var j = 0, d = arr.length; j < d; j++) {
					if (matrix[i][j] !== 0) {
						canvas.draw_unit(j, i, matrix[i][j]);
					}
				}
			}
		}
			
		return {
			init : function(width, height, unit) {
				create_base(width, height, unit);
			},
			addColor : function(color) {
				colors.push(color);
			},
			draw : draw
		};
	}();
				
				
				
	window.addEventListener('keyup', function(e){
		var key = e.keyCode;
		switch(key) {
		case KEYS.ENTER:
			// Enter
			
			break;
		case KEYS.PAUSE_BREAK:
			// Pause break
					
			break;
		case KEYS.ESC:
			// Esc
			utils.clear();
				
			break;
		case KEYS.SPACE:
			// Space
					
			break;
		case KEYS.LEFT:
			// Left
			if (current_letter.x > 0) {
				current_letter.x -= 1;
			}
							
			break;
		case KEYS.TOP:
			// Top
							
			break;
		case KEYS.RIGHT:
			// Right
			if (current_letter.x < settings.width - current_letter.width) {
				current_letter.x += 1;
			}
							
			break;
		case KEYS.BOTTOM:
			// Bottom
					
			break;
		}	
	});
				
			
				
				
				
	// Основные характеристики букв -
	// позиция - х и у
	// массив данных
	// цвет
	// ширина, высота - высчитывается
				
	/* Main figure constructor */
	function Letters(x, y) { 
		this.x = x || 0;
		this.y = y || 0;
	}
	
	Letters.prototype = {
		get_width : function() {
			return this.coords[0].length;
		},
		get_height : function() {
			return this.coords.length;
		},
		get_startx : function() {
			return Math.floor((settings.width - this.get_width())/2);
		},
		draw : function() {
			for(var i = 0, count_i = this.coords.length; i < count_i; i++) {
				for(var j = 0, count_j = this.coords[i].length; j < count_j; j++) {
					if (this.coords[i][j]) {
						canvas.draw_unit(this.x + j, this.y + i, this.color);
					}
				}
			}
		}
	};
				
	var base_letter = new Letters(0, 0);
			
	Letters.all = []; // Array of all letter
				
	// Create new letter by type
	Letters.create = function(type) {
		if (typeof Letters[type] !== 'function') {
			throw new Error('Error: ...');
		}
		return new Letters[type]();
	}
			
	// Create new letter of random type 
	Letters.random = function() {
		return Letters.create(Letters.all[utils.random(Letters.all.length)]);
	};
				
	// Add new letter type
	Letters.addNew = function(letter, func) {
		Letters.all.push(letter);
		Letters[letter] = func;
		Letters[letter].prototype = base_letter;
	}
				
				
	/* ***** default letters: I, J, L, O, S, T, Z ***** */
	
	/* I constructor */
	Letters.addNew('I', function (x, y) {
		this.coords = [
			[1],
			[1],
			[1],
			[1]
		];
					
		this.x = x || this.get_startx();
		this.y = y || 0;
					
		this.type = 'I';
		this.color = '#31C6B0';
		this.width = this.get_width();
		this.height = this.get_height();
	});
				
					
	/* J constructor */
	Letters.addNew('J', function (x, y) {
		this.coords = [
			[0, 1],
			[0, 1],
			[1, 1]
		];
					
		this.x = x || this.get_startx();
		this.y = y || 0;
					
		this.type = 'J';
		this.color = '#C6319F';
		this.width = this.get_width();
		this.height = this.get_height();
	});
					
	/* L constructor */
	Letters.addNew('L', function (x, y) {
		this.coords = [
			[1, 0],
			[1, 0],
			[1, 1]
		];
					
		this.x = x || this.get_startx();
		this.y = y || 0;
					
		this.type = 'L';
		this.color = '#C68131';
		this.width = this.get_width();
		this.height = this.get_height();
	});
	
	/* O constructor */
	Letters.addNew('O', function (x, y) {
		this.coords = [
			[1, 1],
			[1, 1]
		];
					
		this.x = x || this.get_startx();
		this.y = y || 0;
					
		this.type = 'O';
		this.color = '#B7C631';
					
		this.width = this.get_width();
		this.height = this.get_height();
	});
	
	/* S constructor */
	Letters.addNew('S', function (x, y) {
		this.coords = [
			[0, 1, 1],
			[1, 1, 0]
		];
					
		this.x = x || this.get_startx();
		this.y = y || 0;
						
		this.type = 'S';
		this.color = '#32C832';
					
		this.width = this.get_width();
		this.height = this.get_height();
	});
	
	/* T constructor */
	Letters.addNew('T', function (x, y) {
		this.coords = [
			[0, 1, 0],
			[1, 1, 1]
		];
					
		this.x = x || this.get_startx();
		this.y = y || 0;
					
		this.type = 'T';
		this.color = '#31C679';
		this.width = this.get_width();
		this.height = this.get_height();
	});
					
	/* Z constructor */
	Letters.addNew('Z', function (x, y) {
		this.coords = [
			[1, 1, 0],
			[0, 1, 1]
		];
						
		this.x = x || this.get_startx();
		this.y = y || 0;
							
		this.type = 'Z';
		this.color = '#BFC631';
						
		this.width = this.get_width();
		this.height = this.get_height();
	});
					
			
	/* Returned object */
	return {
		init : function(params) {
			settings = params;
			width = settings.width * (settings.unit + 1) + 1;
			height = settings.height * (settings.unit + 1) + 1;
			canvas.init();
			// ////////////////////////////
	
			current_letter = Letters.random();
			current_letter.draw();
			setInterval(function(){
				if (current_letter.y + current_letter.height == settings.height) {
					current_letter = Letters.random();
				} else {
					current_letter.y += 1;
				}
				canvas.clear();
				current_letter.draw();
			}, settings.speed);
		}
	};
}();