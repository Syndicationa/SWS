class Player {
	constructor(num, isAI, faction) {
		this.ShipList = [];
		this.Name = `Player ${num}`;
		this.Faction = faction;
		this.Color = factionColors[faction];
		this.isAI = isAI;
		this.playerNum = num;
		this.hasMoved = false;
		this.lastMove = "";
		this.moves = [];
		this.curAP = 0;
		this.AP = 0;
	}

	createMoves() {

	}

	weighMove(move) {

	}

	pickMove() {

	}

	runMove(str) {
		this.hasMoved = true;
		if (str.startsWith("S-")) {
			const dString = str.substr(2).split(";");
			this.Name = dString[0];
			dString.shift();
			this.Faction = dString[0];
			this.Color = factionColors[dString[0]];
			dString.shift();
			for (let val of dString) {
				const substrs = val.split(".");
				const position = JSON.parse(substrs[2]);
				const sector = JSON.parse(substrs[3]);
				const loc = [...sector,position];
				const nShip = new Ship(this.playerNum, this.ShipList.length, substrs[0],Number(substrs[1]),loc,Number(substrs[4]));
				this.ShipList.push(nShip);
				updatePlayerSettings();
			}
			this.updateAP();
			drawBoard();
		} else if (str.startsWith("M-")) {
			const dString = str.substr(4).split(";");
			for (let val of dString) {
				let substrs = val.split(".");
				let mShip = this.ShipList[Number(substrs[0])];
				mShip.dX = Number(substrs[1]);
				mShip.dY = Number(substrs[2]);
				mShip.rot = Number(substrs[3]);
				mShip.moveShip();
			}
			drawBoard();
		} else if (str.startsWith("A-")) {
			const dString = str.substr(2).split(";");
			if (dString.length === 0) return;
			for (let val of dString) {
				const substrs = val.split(".");
				const atkShip = this.ShipList[Number(substrs[0])];
				const dPlayerNames = JSON.parse(substrs[2]);
				const dShips = JSON.parse(substrs[3]);
				const hits = JSON.parse(substrs[4]);
				let defShip;
				let dPlayers;
				if (Array.isArray(dPlayerNames)) {
					dPlayers = dPlayerNames.map((val) => Players.find((player) => player.Name === val).playerNum);
					defShip = dPlayers.map((val,index) => Players[val].ShipList[dShips[index]]);
				} else {
					dPlayers = Players.find((player) => (player.Name === dPlayerNames)).playerNum;
					defShip = Players[dPlayers].ShipList[dShips];
				}
				console.log(defShip);
				attackShip(atkShip,defShip,Number(substrs[1]),hits);
			}
			attackList = [];
		}
		/*storedPlayer[factionIn] = 1;
		storedData[storeNum][factionIn] = str;
		if(storedPlayer.reduce(sum) == playerCount) {
			storeNum++;
			storedPlayer = [0,0,0,0];
			storedData.push([]);
			destroyShips();
			setOlHP();
		}*/
	}

	updateAP () {
		this.AP = this.ShipList.length;
	}

	controlSquare (pos) {
		let type = -1;
		let shape = "";
		let rotaion = -1;
		for (let ship of this.ShipList) {
			if (ship.isInLocation(pos) && type < ship.type) {
				type = ship.type;
				shape = ship.shape;
				rotaion = ship.rot;
			}
		}
		if (type === -1) {
			return null;
		} else {
			return [shape,rotaion];
		}
	}

	shipsInPos (pos) {
		let ships = [];
		for (let ship of this.ShipList) {
			if (ship.isInLocation(pos)) {
				ships.push(ship);
			}
		}
		return ships;
	}
}

class Ship {
	constructor (player,shipNum,faction, type, loc, r) {
		let ship = ShipTypes[faction][type];

		this.player = player;
		this.number = shipNum;

		//Name
		this.Name = ship.Name;

		//Health
		this.HP = ship.HP;
		this.oldHP = ship.HP;
		this.maxHP = ship.HP;

		//Accuracy, Defense, Movement, and Size
		this.Acc = ship.Acc;
		this.Def = ship.Def;
		this.Mov = ship.Mov;
		this.sX = ship.SizeX;
		this.sY = ship.SizeY;

		//Weapons
		this.Weap = copyArray(ship.Weap);
		this.Weap.forEach((weap) => {if (weap.Count === null) weap.Count = Infinity});
		this.Weap.push({Name: "Wait", Type:"Wait", Count:Infinity, Watk: 0, Whit: 0, Wran: 0, WRatk: 0, APCost:1});
		this.defensive = -1;
		this.checkDefenses();

		//Position
		this.sectorDepth = loc.length - 1;
		this.position = copyArray(loc)[this.sectorDepth];
		this.oldposition = copyArray(loc)[this.sectorDepth];
		this.sector = copyArray(loc).slice(0,this.sectorDepth);
		this.olSector = copyArray(loc).slice(0,this.sectorDepth);
		this.rot = r;
		this.Area = [];
		this.reArea();
		this.shape = ship.Shape;

		//Velocity
		this.dX = 0;
		this.dY = 0;
		this.moveData = "";
		this.moved = false;
		
		//Factions
		this.faction = faction;
		this.type = type;
	}

	//Move Commands
	canMove(movX, movY) {
		let val = false;
		if (movType === 0) {
			this.addMovData(movX, movY);
			let tMData = this.moveData.replace(/[+-]/g,"||||").length;
			val = Math.ceil(tMData/4) <= this.Mov;
			this.addMovData(-movX, -movY);
		} else {
			val = (Math.abs(this.dX + movX) + Math.abs(this.dY + movY)) <= this.Mov;
		}
		return val;
	}
	
	addMovData(movX, movY) {
		const val = ((movY + 3)/2)*(movX == 0) + (((movX + 3)/2) + 2)*(movY == 0) - 1;
		const movStr = ["+","-","L","R"];
		const revMovStrs = ["-","+","R","L"];
		if (this.moveData.endsWith(revMovStrs[val])) {
			this.moveData = this.moveData.slice(0,-1);
		} else {
			this.moveData += movStr[val];
		}
		//if (preMoveInst ==  + )
	}
	
	moveTo(diX = 0,diY = 0,to = false) {
		//to is true then diX and diY are locations to moveTo
		if (to) {
			this.dX = diX - this.oldposition[0];
			this.dY = diY - this.oldposition[1];
		} else {
			this.dX += diX;
			this.dY += diY;
		}
		this.moveShip(false);
	}

	moveShip (val = true) {
		if(this.moved && val) {
			return;
		} else {
			this.moved = true;
			this.position[0] = this.oldposition[0] + this.dX;
			this.position[1] = this.oldposition[1] + this.dY;
			let newPosition = updateSector([...this.olSector,this.position]);
			if (newPosition.length !== 0) {
				this.position = newPosition.pop();
				this.sector = newPosition;
			}
			this.reArea();
		}
	}

	finalizeMove() {
		this.moveShip();
		this.oldposition = copyArray(this.position);
		this.olSector = copyArray(this.sector);
		this.moveData = "";
		if (movType === 1) {
			this.dX = 0;
			this.dY = 0;
		}
		this.moved = false;
	}

	//Attack Commands
	canFire(weapon){
		return this.Weap[weapon].Count > 0;
	}

	getWeapon(weapon) {
		return this.Weap[weapon];
	}

	attack(weapon, undo) {
		let aWeap = this.Weap[weapon];
		if (undo) {
			switch (aWeap.Type) {
			case "Generic":
				aWeap.Count += 1;
			break;
			
			case "Missile":
				aWeap.Count += 1;
			break;
			
			case "Defensive":
				aWeap.Count += 1;
			break;
			
			case "Deploying":
				aWeap.Count += 1;
			break;
			
			case "Healing":
				aWeap.Count += 1;
			break;
			
			case "Ramming":
				//aWeap.Count += 1;
			break;
			
			case "Destruct":
				this.HP = aWeap.Count;
				aWeap.Count = 1;
			break;
		}
		} else {
			switch (aWeap.Type) {
			case "Generic":
				aWeap.Count -= 1;
			break;
			
			case "Missile":
				aWeap.Count -= 1;
			break;
			
			case "Defensive":
				aWeap.Count -= 1;
			break;
			
			case "Deploying":
				aWeap.Count -= 1;
			break;
			
			case "Healing":
				aWeap.Count -= 1;
			break;
			
			case "Ramming":
				
			break;
			
			case "Destruct":
				aWeap.Count = this.HP;
				this.HP = 0;
				this.reArea();
			break;
			}
		}
		this.reArea();
	}

	defend(damage, wType, undo) {
		if (wType === "Missile" && this.defensive !== -1) {
			this.Weap[this.defensive].Count += 2*undo -1;
			this.checkDefenses();
		} else if (wType == 'Healing') {
			damage = -damage;
		}
		this.HP += (2*undo -1)*damage;
		if (this.HP > this.maxHP) this.HP = this.maxHP;
		this.reArea();
	}

	//return Ship defenses, so [Def, Mov, defensive]
	getDefenses() {
		return [this.Def, this.Mov, this.defensive];
	}

	//Check if any defensive weapons are fully loaded
	checkDefenses() {
		this.defensive = -1;
		this.Weap.forEach((weapon, index) => {
			if (weapon.Type === "Defensive" && weapon.Count > 0) {
				this.defensive = index;
			}
		});
		return this.Weap[this.defensive];
	}
	
	finalizeAttack() {
		this.oldHP = this.HP;
	}

	//Ship placement
	reArea() {
		this.Area = [];

		if (this.HP <= 0) {
			destroy.play();
			return;
		}
		
		//if a ship is a 1x1 then all Area needs to be is itself
		if (this.sX*this.sY == 1) {
			this.Area = [this.location];
			this.updateAreaSectors();
			return;
		}
		console.log("Learn to Program");

		//Temp ReArea Code
		//Line Ships Vx1 || 1xV
		let pTheta = -(Math.PI*this.rot)/4;
		if (this.sX === 1) {
			this.Area.push(this.location);
			let dX = Math.round(Math.sin(pTheta));
			let dY = Math.round(Math.cos(pTheta));
			let above = Math.ceil(this.sY/2) - 1;
			for (let y = 0; y < above; y++) {
				let newPos = [
				Math.round(this.position[0] - (y+1)*dX),
				Math.round(this.position[1] - (y+1)*dY)
				];
				this.Area.push([...this.sector,newPos]);
			}
			let below = Math.floor(this.sY/2);
			for (let y = 0; y < below; y++) {
				let newPos = [
				Math.round(this.position[0] + (y+1)*dX),
				Math.round(this.position[1] + (y+1)*dY)
				];
				this.Area.push([...this.sector,newPos]);
			}
			this.updateAreaSectors();
			return;
		} else if (this.sY === 1) {
			this.Area.push(this.location);
			let dX = Math.cos(pTheta);
			let dY = Math.sin(pTheta);
			let above = Math.ceil(this.sX/2) - 1;
			for (let y = 0; y < above; y++) {
				let newPos = [
				Math.round(this.postion[0] - (y+1)*dX),
				Math.round(this.position[1] - (y+1)*dY)
				]
				this.Area.push([...this.sector,newPos]);
			}
			let below = Math.floor(this.sX/2);
			for (let y = 0; y < below; y++) {
				let newPos = [
				Math.round(this.position[0] + (y+1)*dX),
				Math.round(this.position[1] + (y+1)*dY)
				]
				this.Area.push([...this.sector,newPos]);
			}
			this.updateAreaSectors();
			return;
		}
		//Square Ships VxV && Rotation isn't calculated
		if (this.sX === this.sY) {
			this.Area.push(this.location);
			let above = Math.ceil(this.sY/2) - 1;
			let below = Math.floor(this.sY/2);
			let left = Math.ceil(this.sX/2) - 1;
			let right = Math.floor(this.sX/2);
			for (let y = this.position[1] - above; y <= this.position[1] + below; y++) {
				for (let x = this.position[0] - left; x <= this.position[0] + right; x++) {
					this.Area.push([...this.sector,[x,y]]);
				}
			}
			this.updateAreaSectors();
			return;
		}
		//Other ships aren't yet supported
	}

	updateAreaSectors() {
		if (this.sector.length == 0) {
			return;
		}
		this.Area = this.Area.map((val) => {
			let nVal = updateSector(val);
			if (nVal.length === 0) {
				nVal = val;
			}
			return nVal;
		});
	}

	get location () {
		return [...this.sector, this.position];
	}

		//Needs Work
	isInLocation (loc) {
		return this.Area.some((val) => compareArray(val,loc,loc.length));
	}
}

function compareArray(arr1 = [], arr2 = [], length = 0) {
	if (!length) {
		length = arr1.length;
	}
	let array1 = arr1.slice(0,length);
	let array2 = arr2.slice(0,length);
	return JSON.stringify(array1) === JSON.stringify(array2);
}

function copyArray(arr) {
	return JSON.parse(JSON.stringify(arr))
}

function updateSector(LocArray) {
	let position = LocArray[LocArray.length - 1];
	let sector = LocArray.slice(0,-1);
	let [x,y] = position;
	let [secX,secY] = [0,0];
	if (x >= 0 && x < grSize[sector.length] && y >= 0 && y < grSize[sector.length]) {
		return [...sector,position];
	}
	if (sector.length > 0) {
		[secX,secY] = sector[sector.length - 1];
	}
	if (x < 0) {
		secX -= 1;
		x = grSize[sector.length] + x;
	} else if (x >= grSize[sector.length]) {
		secX += 1;
		x = x - grSize[sector.length];
	}
	 if (y < 0) {
		secY -= 1;
		y = grSize[sector.length] + y;
	} else if (y >= grSize[sector.length]) {
		secY += 1;
		y = y - grSize[sector.length];
	}
	if (sector.length === 0) {
		return [];
	} else
	sector[sector.length - 1] = [secX,secY];
	let nSector = updateSector(sector);
	if (nSector == false) {
		return [];
	}
	return [...nSector,[x,y]];
}

function calculateDist(LocArr1 = [], LocArr2 = []) {
	let location1 = [0,0];
	let location2 = [0,0];
	LocArr1.forEach((loc,index) => {
		location1[0] *= grSize[index];
		location1[0] += loc[0];
		location1[1] *= grSize[index];
		location1[1] += loc[1];
	});
	LocArr2.forEach((loc,index) => {
		location2[0] *= grSize[index];
		location2[0] += loc[0];
		location2[1] *= grSize[index];
		location2[1] += loc[1];
	});
	let xdist = Math.abs(location1[0] - location2[0]);
	let ydist = Math.abs(location1[1] - location2[1]);
	return xdist + ydist;
}

function setupHTML() {
	//Hiding
	$("#GridHome").hide();
	
	//Buttons
	const buttonsymbols = [
		[String.fromCodePoint(0x1F864),
			String.fromCodePoint(0x1F861),
			String.fromCodePoint(0x1F865)],
		[String.fromCodePoint(0x1F860),
			String.fromCodePoint(0x29BF),
			String.fromCodePoint(0x1F862)],
		[String.fromCodePoint(0x1F867),
			String.fromCodePoint(0x1F863),
			String.fromCodePoint(0x1F866)]];
	
	let buttons = document.getElementById("Buttons");
	
	for (let y = 0; y < buttonsymbols.length; y++) {
		for (let x = 0; x < buttonsymbols[y].length; x++) {
			let button = document.createElement("button");
			let bnumber = (3*y + x + 1);
			button.id = `b${bnumber}`;
			button.type = "button";
			button.classList.add("bgrid");
			button.style.gridArea = button.id;
			button.innerText = buttonsymbols[y][x];
			button.onclick = () => input((x-1),(y-1));
			buttons.appendChild(button);
		}
	}

	document.getElementById("Menu").innerText = String.fromCodePoint(0x263C);

	//Selectors
	let movStyles = document.getElementById("MovStyl");
	for (let x = 0; x < moveTypeStrings.length; x++) {
		let options = document.createElement("option");
		options.text = moveTypeStrings[x];
			options.value = x;
		movStyles.add(options);
	}

	//Settings
	document.getElementById("Return").innerText = String.fromCodePoint(0x229E);
	$("#GameSettings").show();
	$("#PlayerSettings").hide();
	$("#AudioSettings").hide();
	$("#ControlSettings").hide();
	$("#LoadingSaving").hide();

	document.getElementById("GameSet").classList.add("active");
	document.getElementById("PlayerSet").classList.remove("active");
	document.getElementById("AudioSet").classList.remove("active");
	document.getElementById("ControlSet").classList.remove("active");
	document.getElementById("LoadSave").classList.remove("active");	

	//Game Settings
	let gModes = document.getElementById("GType");
	for (let x = 0; x < gameModes.length; x++) {
		let options = document.createElement("option");
		options.text = gameModes[x];
		options.value = gameModes[x];
		gModes.add(options);
	}

	//Player Settings
	updatePlayerSettings();

	//Control Settings
	updateKeyCodes();
}

const movDataStrs = ["+","-","L","R"];
const revmDataStrs = ["-","+","R","L"];

//Letters for Up, Down, Left, Right, Action, Back, Info, End Turn, Zoom In, Zoom Out
let keyCodes = ["w","s","a","d","e","q","f","r","Alt"," "];
let changeKeyCode = -1;
let movStr = "u        u";
/*
Stage 0: Place Ships
Stage 1: Choose Ship Type
Stage 2: Choose Ship Rotation

Stage 5: Choose Base Location
Stage 6: Choose Base Type???

Stage 8: Input / Output

Stage 10: Move Ships
Stage 11: Choose Specific ship in Grid
Stage 12: Move the ship
Stage 13: Choose Rotation for Naval Movement

Stage 20: Attack Phase
Stage 21: Choose Specific Attacker
Stage 22: Choose Defending grid
Stage 23: Choose Specific Defender
Stage 24: Choose Weapon

Stage 28: Impulse I/O

Future
Stage 30: Place Reinforcements
Stage 31: Choose Types
Stage 32: Choose Rotation

Stage 40: Win/Loss
Stage 50: Spectator
*/
let stage = 0;
let nStage = 0;

let impulse = 0;
let impulseCount = 0;

let curAP = 0;
let impulseAP = 0;

let info = false;

let movType = 0;
const moveTypeStrings = ["Momentum","Naval"];
let movShip = {};

let attackingShip = {};
let defensiveShip = {};
let attackList = [];
let weaponText = "";

let Players = [new Player(0,false,factionNames[0])];
let inputPlayer = 1;
Players[0].Name = defaultName;
//Grid
let grSize = [32];

//Drawing
const gridcanvas = document.getElementById("GridHome");
const grid = gridcanvas.getContext("2d");
const bcanvas = document.getElementById("GameBoard");
const board = bcanvas.getContext("2d");
//let stars;
let width = bcanvas.width/grSize[0];
let height = bcanvas.height/grSize[0];

//Sound Files
const mov = document.getElementById("moveSound");
const press = document.getElementById("pressSound");
const backSound = document.getElementById("backSound");
const destroy = document.getElementById("destroySound");

//Game Systems
const gameModes = ["Deathmatch","Base War","Defend","Attack","Spectator"];
let gameMode = "Deathmatch";
let win = false;
let lose = false;

//Cursor Cax,Cay ... C1x,C1y,C0x,C0y\
let cLevel = 0;
let cursorLoc = new Array(grSize.length);
cursorLoc.fill([0,0]);
let cRot = -1;
let cMenu = -1;
let cMenuMax = 0;
let oldCursorLocation = [[0,0]];
let cursorData = [0,0];