const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const deck = require("./11-2-2021-FINAL.json");
var imageBank = {};

loadImage("./full_white_256.png").then((img) => {
	loaded( "black", img );
});
loadImage("./full_black_256.png").then((img) => {
	loaded( "white", img );
});

const pageWidth = 4090; // 10 cols is 409 width each
const pageHeight = 4098; //7 rows is 585 px height each
const cardWidth = pageWidth / 10;
const cardHeight = pageHeight / 7;

	//cards are 7 rows 10 columns

var first = 0;
function loaded( color, img ){
	console.log(`loaded: ${first}, ${color}` );
	imageBank[ color ] = img;
	if( first == 0 ){
		first = color;
	} else {
		runPrints( color );
		runPrints( flip(color) );
	}
}
function flip( color){	
	if( color == "black") {
		return "white";
	} else if ( color == "white") {
		return "black";
	}
	throw("BAD COLOR FLIP:" + color );
}
function runPrints( color ){
	
	console.log( "runprints: " + color );
	
	const canvas = createCanvas(pageWidth, pageHeight);
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, pageWidth, pageHeight);	
	console.log("decksize: "+ deck[ color + "Cards" ].length );
	for( var i = 0; i < deck[ color + "Cards" ].length; i++){
		drawCard( ctx, deck[ color + "Cards" ][i], i%69, color);
		if( i != 0 && i % 69 == 0 ){
			var x = 9;
			var y = 6;
			ctx.drawImage( imageBank[color], ( cardWidth * x ) + ( cardWidth / 2 ) -128, ( cardHeight * y ) + ( cardHeight / 2 ) - 128 );
			ctx.strokeStyle = flip( color );
			ctx.strokeRect(( cardWidth * x )+40, ( cardHeight * y )+40, cardWidth-80, cardHeight-80);	
			ctx.strokeRect(( cardWidth * x )+10, ( cardHeight * y )+10, cardWidth-20, cardHeight-20);	
			printImage( canvas, color + "_page_" + Math.floor(i/70) );
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, pageWidth, pageHeight);	
		}
	}
	
}
var fontSize = 35;
function drawCard( ctx, card, index, color ){
	console.log("drawing "+card.text+ " by "+card.author+ " index: "+ index);	
	var x = index % 10;
	var y = Math.floor(index / 10);
	console.log("position: "+x+","+y);
	
	// 8 = 8,0
	// 9 = 9,0
	// 10= 0,1
	// 19= 9,1
	// 20= 0,2
	
	ctx.drawImage( imageBank[color], ( cardWidth * x ) + ( cardWidth / 2 ) -128, ( cardHeight * y ) + ( cardHeight / 2 ) - 128 );
	if( color == "black") {
		ctx.fillStyle = "rgba(0,0,0,.8)";
	} else if ( color == "white") {
		ctx.fillStyle = "rgba(255,255,255,.8)";
	}
	console.log( `bounds ${( cardWidth * x )},${( cardHeight * y )},${cardWidth},${cardHeight}`);
	ctx.fillRect(( cardWidth * x ), ( cardHeight * y ), cardWidth, cardHeight);	
	ctx.strokeStyle = flip( color );
	ctx.strokeRect(( cardWidth * x )+10, ( cardHeight * y )+10, cardWidth-20, cardHeight-20);	
	ctx.fillStyle = flip(color);
	ctx.font = "bold " + fontSize + "px Arial";
	wrapText( card.text, cardWidth*.9, ctx ).forEach((line,i) => {
		let size = ctx.measureText( line );
		ctx.fillText( line, 
			( cardWidth * (x+.5) ) - (size.width/2), 
			( cardHeight * y )+ fontSize + (fontSize*1.2)+ (fontSize*i)
		);
	});
	ctx.fillStyle = "#a10000";
	ctx.font = "bold " + Math.floor(fontSize/1.7) + "px Courier";
    ctx.fillText( 
		card.author, 
		( cardWidth * ( x + .5) ) - ( ctx.measureText( card.author ).width / 2 ), 
		( cardHeight * ( y + 1 )- 50 )
	);
}

function printImage( canvas, name ){
	const buffer = canvas.toBuffer("image/png");
	const fs = require("fs");
	fs.writeFileSync( "./output/" + name + ".png", buffer );
}


function wrapText( text, maxWidth, ctx ) {
	if ( ctx.measureText(text).width < maxWidth ) {
		return [text];
	}
	var line = "";
	var lines = [];
	var words = text.split(' ');
	while (words.length > 0) {
		while ( ctx.measureText( words[0] ).width >= maxWidth ) {
			var tmp = words[0];
			words[0] = tmp.slice( 0, -1 );
			if ( words.length > 1 ) {
				words[1] = tmp.slice( -1 ) + words[1];
			} else {
				words.push( tmp.slice( -1 ) );
			}
		}
		if ( ctx.measureText( line + words[0] ).width < maxWidth ) {
			line += words.shift() + " ";
		} else {
			lines.push( line );
			line = "";
		}
		if (words.length === 0) {
			lines.push( line );
		}
	}
	return lines;
}
