function drawBoard() {
	board.clearRect(0,0,bcanvas.width,bcanvas.height);
	let stars = document.getElementById("Stars");
	board.drawImage(stars,0,0);
	drawShips();
	drawCursor();
	board.drawImage(gridcanvas,0,0);
}

function updateBoard(xLoc,yLoc) {
	let x = xLoc*width;
	let y = yLoc*width;
	const sector = cursorLoc.slice(0,cLevel);
	board.clearRect(x,y,width,height);
	let stars = document.getElementById("Stars");
	board.drawImage(stars,x,y,width,height,x,y,width,height);

	let factCount = 0;
	let shape = "";
	let rotation = 0;
	let colors = [];
	for (player of Players) {
		let result = player.controlSquare([...sector,[xLoc,yLoc]]);
		if (result) {
			colors[factCount] = player.Color;
			factCount++;
			shape = result[0];
			rotation = result[1];
		}
	}
	drawShip(xLoc,yLoc,factCount,shape,rotation,colors)
	board.drawImage(gridcanvas,0,0);
}

//Currently only works for 1 layer so far -Fixed
function drawShips() {
	let factCount = 0;
	let shape = "";
	let rotation = 0;
	const sector = cursorLoc.slice(0,cLevel);
	for (let y = 0; y < grSize[cLevel]; y++) {
		for (let x = 0; x < grSize[cLevel]; x++) {
			factCount = 0;
			shape = "";
			colors = [];
			for (player of Players) {
				let result = player.controlSquare([...sector, [x,y]]);
				if (result) {
					colors.push(player.Color);
					factCount++;
					shape = result[0];
					rotation = result[1];
				}
			}
			drawShip(x,y,factCount,shape,rotation,colors);
		}
	}
}

function drawShip(x,y,count,shape,rotation,colors) {
	const shipLevel = (cLevel === cursorLoc.length - 1);
	board.beginPath();
	if (count === 0) {
		return;
	} else if (count === 1 && shipLevel) {
		board.strokeStyle = colors[0];
		board.fillStyle = colors[0];
		if (shape == "Rectangle") {
			board.moveTo(width*((x +0.5)+0.5*Math.sin(Math.PI*((rotation/4) - 1/6))),height*((y +0.5)-0.5*Math.cos(Math.PI*((rotation/4) - 1/6))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*((rotation/4) + 1/6))),height*((y +0.5)-0.5*Math.cos(Math.PI*((rotation/4) + 1/6))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(((rotation-4)/4) - 1/6))),height*((y +0.5)-0.5*Math.cos(Math.PI*(((rotation-4)/4) - 1/6))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(((rotation-4)/4) + 1/6))),height*((y +0.5)-0.5*Math.cos(Math.PI*(((rotation-4)/4) + 1/6))));
			board.closePath();
			board.fill();
			board.stroke();
			return;
		} else if(shape == "Square") {
			board.fillRect(x*width,y*height,width,height);
			board.stroke();
			board.beginPath();
			board.strokeStyle = "#ffffff";
			board.fillStyle = "#ffffff";
			if (rotation < 0) {
				return;
			}
		} else if(shape == "Octagon") {
			board.moveTo(width*((x +0.5)+0.5*Math.sin(0)),height*((y +0.5)-0.5*Math.cos(0)));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(1/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*(1/4))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(2/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*(2/4))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(3/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*(3/4))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(4/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*(-4/4))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(-3/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*(-3/4))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(-2/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*(rotation-2/4))));
			board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(-1/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*(-1/4))));
			board.closePath();
			board.fill();
			board.stroke();
			board.beginPath();
			board.strokeStyle = "#ffffff";
			board.fillStyle = "#ffffff";
		} else if(shape == "Circle") {
			board.arc((x + 0.5)*width, (y + 0.5)*height, width/2, 0, 2*Math.PI);
			board.fill();
			board.stroke();
			board.beginPath();
			board.strokeStyle = "#ffffff";
			board.fillStyle = "#ffffff";
		}
		//Drawing Direction Triangle
		board.moveTo(width*((x +0.5)+0.5*Math.sin(Math.PI*(rotation/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*(rotation/4))));
		board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*((rotation+3)/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*((rotation+3)/4))));
		board.lineTo(width*((x +0.5)+0.5*Math.sin(Math.PI*((rotation-3)/4))),height*((y +0.5)-0.5*Math.cos(Math.PI*((rotation-3)/4))));
		board.closePath();
		board.fill();
		board.stroke();
	} else {
		for (let i = 0; i < count; i++) {
			board.strokeStyle = colors[i];
			board.fillStyle = colors[i];
			board.fillRect(x*width, (i/count + y)*height, width, height/count);
			board.stroke();
		}
	}
}

/*function drawStars() {
	grid.strokeStyle = "#d0d0d0";
	grid.fillStyle = "#d0d0d0";
	for(let i = 0; i < 300; i++) {
		let starsize = 2*(Math.random()**9);
		let xpos = gridcanvas.width*Math.random();
		let ypos = gridcanvas.height*Math.random();
		grid.beginPath();
		grid.moveTo(xpos,ypos);
		grid.arc(xpos,ypos,starsize,0,2*Math.PI);
		grid.fill();
		grid.stroke();
	}
	stars = grid.getImageData(0,0,gridcanvas.width,gridcanvas.height);
	grid.clearRect(0,0,gridcanvas.width,gridcanvas.height);
}*/

function drawGrid() {
	grid.clearRect(0,0,gridcanvas.width,gridcanvas.height);
	grid.lineWidth = width/20;
	for (let i = 0; i <= grSize[cLevel]; i++) {
		grid.beginPath();
		if (i/grSize[cLevel] == 1/2 || i == 0 || i == grSize[cLevel]) {
			grid.strokeStyle = "#D0D0D0";
			//console.log(grid.strokeStyle);
		} else if (i/grSize[cLevel] == 1/4 || i/grSize[cLevel] == 3/4) {
			grid.strokeStyle = "#A0A0A0";
			//console.log("Gaa");
		} else if (i % 2 == 0 && grSize[cLevel] % 2 == 0) {
			grid.strokeStyle = "#707070";
		} else {
			grid.strokeStyle = "#404040";
		}
		//console.log(grid.strokeStyle);
		grid.moveTo(i*width,0);
		grid.lineTo(i*width,grSize[cLevel]*height);
		grid.moveTo(0,i*height);
		grid.lineTo(grSize[cLevel]*width,i*height);
		grid.stroke();
		grid.moveTo(i*width,0);
		grid.lineTo(i*width,grSize[cLevel]*height);
		grid.moveTo(0,i*height);
		grid.lineTo(grSize[cLevel]*width,i*height);
		grid.stroke();	
	}
}

function drawCursor() {
	let [x,y] = cursorLoc[cLevel];
	board.beginPath();
	board.strokeStyle = "#808080";
	board.fillStyle = "#808080";
	board.arc(
		height*(x + 0.5),
		width*(y + 0.5),width/2,0,2*Math.PI);
	board.closePath();
	board.fill();
	board.stroke();
	if (cRot != -1) {
		board.beginPath();
		board.strokeStyle = "#FFFFFF";
		board.fillStyle = "#FFFFFF";
		board.moveTo(
			width*(x + 
				(1/2)*Math.sin((Math.PI/4)*cRot) + (1/2)),
			height*(y - 
				(1/2)*Math.cos((Math.PI/4)*cRot) + (1/2)));
				
		board.lineTo(width*(x + 
				(1/2)*Math.sin((Math.PI/4)*(cRot + 4) - Math.PI/6) + (1/2)),
			height*(y - 
				(1/2)*Math.cos((Math.PI/4)*(cRot + 4) - Math.PI/6) + (1/2)));
				
		board.lineTo(width*(x + 
				(1/2)*Math.sin((Math.PI/4)*(cRot + 4) + Math.PI/6) + (1/2)),
			height*(y -
				(1/2)*Math.cos((Math.PI/4)*(cRot + 4) + Math.PI/6) + (1/2)));
		board.closePath();
		board.fill();
		board.stroke();
	}
}

function updateGrid() {
	width = bcanvas.width/grSize[cLevel];
	height = bcanvas.height/grSize[cLevel];
	drawGrid();
	drawBoard();
}