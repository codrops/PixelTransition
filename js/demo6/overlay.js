
// Cell class definition
class Cell {
    DOM = {
		el: null
	};
    row;
    column;

    constructor(row, column) {
        this.DOM.el = document.createElement('div');
        gsap.set(this.DOM.el, {willChange: 'opacity, transform'});
        this.row = row;
        this.column = column;
    }
}

// Overlay class definition
export class Overlay {
	DOM = {
		el: null
	};
	// cells array
    cells = [];
    // options
    options = {
        // Number of cell rows
        rows: 10,
        // Number of cell columns
        columns: 10,
    };

	// Constructor accepts a DOM element representing the overlay
	constructor(DOM_el, customOptions) {	
        this.DOM.el = DOM_el;
		
        // Merge default options with provided options
        this.options = Object.assign({}, this.options, customOptions);
        
        // Set the value of the CSS variable
        this.DOM.el.style.setProperty('--columns', this.options.columns);
		
        // Create an array of all cells
		this.cells = new Array(this.options.rows);
        for (let i = 0; i < this.options.rows; ++i) {
            this.cells[i] = new Array(this.options.columns);
        }

        // Fill the array with values
        for (let i = 0; i < this.options.rows; ++i) {
            for (let j = 0; j < this.options.columns; ++j) {
                const cell = new Cell(i,j);
                this.cells[i][j] = cell;
                this.DOM.el.appendChild(cell.DOM.el);
            }
        }
	}

    // Show the overlay and animate the cells in
    show(customConfig = {}) {
        return new Promise((resolve) => {
            // Default animation configuration
            const defaultConfig = {
                // Specify the cell's transform origin
                transformOrigin: '50% 50%',
                // Duration for each cell animation
                duration: 0.5,
                // Ease for each cell animation
                ease: 'none',
                // Stagger object
                stagger: {
                    grid: [this.options.rows, this.options.columns],
                    from: 0,
                    each: 0.05,
                    ease: 'none'
                }
            };
            const config = Object.assign({}, defaultConfig, customConfig);

            gsap.set(this.DOM.el, {opacity: 1});
            gsap.fromTo(this.cells.flat().map(cell => cell.DOM.el), {
                scaleX: 0,
                //opacity: 0,
                transformOrigin: config.transformOrigin
            }, {
                duration: config.duration,
                ease: config.ease,
                scale: 1.01,
                //opacity: 1,
                stagger: config.stagger,
                onComplete: resolve
            });
        });
    }
    // Hide the overlay and animate the cells out
    hide(customConfig = {}) {
        return new Promise((resolve) => {
            // Default animation configuration
            const defaultConfig = {
                transformOrigin: '50% 50%',
                // Duration for each cell animation
                duration: 0.5,
                // Ease for each cell animation
                ease: 'none',
                // Stagger object
                stagger: {
                    grid: [this.options.rows, this.options.columns],
                    from: 0,
                    each: 0.05,
                    ease: 'none'
                }
            };
            const config = Object.assign({}, defaultConfig, customConfig);

            gsap.fromTo(this.cells.flat().map(cell => cell.DOM.el), {
                transformOrigin: config.transformOrigin
            }, {
                duration: config.duration,
                ease: config.ease,
                scaleX: 0,
                //opacity: 0,
                stagger: config.stagger,
                onComplete: resolve
            });
        });
    }
}