const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

const width = 4098; //7 cols is 585 px each
const height = 4090; // 10 cols is 409 each


const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

loadImage("./full_black_256.png").then((image) => {
});
loadImage("./full_white_256.png").then((image) => {
});
//cards are 7 rows 10 columns

const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

/*context.fillStyle = "#fff";
context.fillRect(0, 0, width, height);
const buffer = canvas.toBuffer("image/png");
const fs = require("fs");
fs.writeFileSync("./image.png", buffer);
*/