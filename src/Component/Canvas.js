import React, { useRef, useEffect } from 'react';

const image = new Image();

class Cell{
    constructor(x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }

    draw = (ctx) => {
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

class AsciiEffect {
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;

    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
        console.log(this.#pixels.data);
    }

    #convertToSymbol = (currentColor) => {
        if (currentColor > 250) return '@';
        else if (currentColor < 240) return '*';
        else if (currentColor < 220) return '+';
        else if (currentColor < 200) return '#';
        else if (currentColor < 180) return '&';
        else if (currentColor < 160) return '%';
        else if (currentColor < 140) return '_';
        else if (currentColor < 120) return ':';
        else if (currentColor < 100) return '$';
        else if (currentColor < 80) return '/';
        else if (currentColor < 60) return '-';
        else if (currentColor < 40) return 'x';
        else if (currentColor < 20) return 'w';
        else return '.';
    }

    #scanImage = (cellSize) => {
        this.#imageCellArray = [];

        for(let y = 0; y < this.#pixels.height; y += cellSize) {
            for(let x = 0; x < this.#pixels.width; x += cellSize){
                // Every 4th position in #pixel.data array represents RGBA for 1 pixel color
                const posX = x * 4;
                const posY = y * 4;
                // current vert y pos, current horz X pos => finds index of certain pixel | const pos = all completed rows + current x position
                const pos = (posY * this.#pixels.width) + posX

                // 3 represents 4th position in #pixels.data array, consider if non transparent or semi-transparent
                if (this.#pixels.data[pos + 3] > 128){
                    // get RGB prespectfully
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos + 2];
                    // values between 0-255 inclusive
                    const total = red + green + blue;
                    // get average of total
                    const averageColorValue = total / 3;
                    // save color as rgb declaration for characters to use original color from image
                    const color = "rgb(" + red + "," + green +  "," + blue + ")";
                    // To take averageColorvalue and return different symbol based on value
                    const symbol = this.#convertToSymbol(averageColorValue);
                    // exclude dark and/or dim colors
                    if (total > 200) 
                        this.#imageCellArray.push(new Cell(x, y, symbol, color));
                }
            }
        }
        console.log(this.#imageCellArray);
    }
    
    #drawAscii = () => {
        // clear canvas from old paint
        this.#ctx.clearRect(0, 0, this.#width, this.#height);

        for(let i = 0; i < this.#imageCellArray.length; i++) {
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }

    draw = (cellSize) =>{
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
}

const Canvas = ( props ) => {
    const draw = ( ctx, canvas ) => {
        image.src = 'data:image/png;base64,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';
        image.onload = function initialize() {
            canvas.width = image.width;
            canvas.height = image.height;
            let effect = new AsciiEffect(ctx, image.width, image.height);
            // each cell will be param * param pixels big
            // Each cell has color, symbol, x and y properties
            effect.draw(10);
        }
    };
        

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        draw(context, canvas);
    });
    
    return (
        <div>
            <canvas ref={ canvasRef } { ...props } />
        </div>
    );
}

export default Canvas;