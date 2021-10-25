function moveCursor(dx,dy) {
	let [x,y] = cursorLoc[cLevel];
	updateBoard(x,y);
	if ((stage === 0 || stage === 5 || stage === 10 || stage === 20 || stage === 22 || stage === 8 || stage === 50) && !info) {
		x += dx;
		y += dy;
		cursorLoc[cLevel] = [x,y];
		let NewCurLoc = updateSector(cursorLoc.slice(0,cLevel + 1));
		if (NewCurLoc.length === 0) {
			if (x < 0 || x >= grSize[cLevel]) {
				x -= dx;
			}
			if (y < 0 || y >= grSize[cLevel]) {
				y -= dy;
			}
			cursorLoc[cLevel] = [x,y];	
		} else {
			cursorLoc = [...NewCurLoc,...cursorLoc.slice(cLevel + 1,cursorLoc.length)];
			drawBoard();
		}
	} else if (stage === 1 || stage === 11 || stage === 21 || stage === 23 || stage === 24 || info) {
		cMenu += dy;
		if (cMenu < 0) {
			cMenu = cMenuMax - 1;
		} else if (cMenu >= cMenuMax) {
			cMenu = 0;
		}
	} else if (stage === 2 || stage === 13) {
		cRot = (8 - 4*Math.sign(dy + 1)+(4*Math.atan(-dx/dy)/Math.PI))%8;
	} else if (stage === 12 && movShip.canMove(dx,dy)) {
		if (movType == 0 && Math.abs(dx) + Math.abs(dy) < 2 && Math.abs(dx) + Math.abs(dy) > 0) {
			let tRot = (cRot*Math.PI)/4
			let diX = Math.sign(Math.round(Math.sin(tRot)))*Math.sign(-dy);
			let diY = Math.sign(Math.round(Math.cos(tRot)))*Math.sign(dy);
			x += diX;
			y += diY;
			cRot += dx;
			cRot = cRot - 8*(cRot >= 8) + 8*(cRot < 0);

			cursorLoc[cLevel] = [x,y];
			movShip.rot = cRot;
			movShip.addMovData(dx,dy);
			movShip.moveTo(diX,diY);
			let NewCurLoc = updateSector(cursorLoc);
			if (NewCurLoc.length !== 0) {
				cursorLoc = NewCurLoc;
			}
		} else if (movType === 1) {
			x += dx;
			y += dy;
			cursorLoc[cLevel] = [x,y];
			movShip.moveTo(dx,dy);
			let NewCurLoc = updateSector(cursorLoc);
			if (NewCurLoc.length !== 0) {
				cursorLoc = NewCurLoc;
			}
		}
		drawBoard();
	}
	dispData();
	drawCursor();
	mov.play();
}

function pressButton() {
	if (info) {
		
	} else if (cLevel !== cursorLoc.length - 1) {
		cLevel++;
		updateGrid();
	} else if (stage === 0 && Players.length !== 0) {
		cMenu = cursorData[0];
		cMenuMax = ShipTypes[Players[0].Faction].length;
		stage = 1;
	} else if (stage === 1) {
		cRot = cursorData[1];
		stage = 2;
	} else if (stage === 2) {
		const nShip = new Ship(0,Players[0].ShipList.length,Players[0].Faction,cMenu,cursorLoc,cRot);
		Players[0].ShipList.push(nShip);

		cursorData = [cMenu,cRot];
		cMenu = -1;
		cRot = -1;
		stage = 0;

		drawBoard();
	} else if (stage === 5) {
		const nShip = new Ship(0,Players[0].ShipList.length,"Base",0,cursorLoc,-1);
		ShipTypes[Players[0].Faction].forEach( (val, i) => {
			const nWeap = {Name: val.Name, Type:"Deploying", Count: Infinity, dType: i, APCost: "Full Impulse"};
			nShip.Weap.splice(i,0,nWeap);
		});
		Players[0].ShipList.push(nShip);
		stage = 0;

		drawBoard();
	} else if (stage === 10) {
		if (Players[0].controlSquare(cursorLoc)) {
			cursorData = cursorLoc;
			cMenu = 0;
			cMenuMax = Players[0].shipsInPos(cursorLoc).length;
			stage = 11;
			if (cMenuMax === 1) {
				pressButton();
			}
		}
	} else if (stage === 11) {
		movShip = Players[0].shipsInPos(cursorLoc)[cMenu];
		cursorLoc = copyArray([...movShip.olSector,movShip.oldposition]);
		cursorLoc[cursorLoc.length - 1][0] += movShip.dX;
		cursorLoc[cursorLoc.length - 1][1] += movShip.dY;
		if (movType === 0) {
			cRot = movShip.rot;
		}
		cursorLoc = updateSector(cursorLoc);
		stage = 12;
		drawBoard();
	} else if (stage === 12) {
		if (movType === 1) {
			cRot = movShip.rot;
			stage = 13;
		} else {
			cursorLoc = cursorData;
			cRot = -1;
			cMenu = -1;
			stage = 10;
			drawBoard();
		}
	} else if (stage === 13) {
		cursorLoc = cursorData;
		movShip.rot = cRot;
		cRot = -1;
		cRot = -1;
		cMenu = -1;
		stage = 10;
		drawBoard();	
	} else if (stage === 20 && curAP > 0 && Players[0].controlSquare(cursorLoc)) {
		if (Players[0].controlSquare(cursorLoc)) {
			cMenu = 0;
			cMenuMax = Players[0].shipsInPos(cursorLoc).length;
			stage = 21;
			if (cMenuMax === 1) {
				pressButton();
			}
		}
	} else if (stage === 21) {
		attackingShip = Players[0].shipsInPos(cursorLoc)[cMenu];
		cMenu = -1;
		stage = 22;
	} else if (stage === 22) {
		if (Players.some((player) => player.controlSquare(cursorLoc))) {
			cursorData = cursorLoc;
			cMenu = 0;
			cMenuMax = Players.reduce((num,player) => {
				return num + player.shipsInPos(cursorLoc).length
			},0);
			stage = 23;
			if (cMenuMax === 1) {
				pressButton();
			}
		}
	} else if (stage === 23) {
		let shipsInSquare = Players.reduce((arr, player) => [...arr, ...player.shipsInPos(cursorLoc)],[]);
		defensiveShip = shipsInSquare[cMenu];
		cMenu = 0;
		cMenuMax = attackingShip.Weap.length;
		stage = 24;
	} else if (stage === 24) {
		if (attackingShip.canFire(cMenu)) {
			stage = 2;
			attackShip(attackingShip,defensiveShip,cMenu,-1);
			cMenu = -1;
		}
		stage = 20;
	}
	dispData();
	drawCursor();
	press.play();
}

function back() {
	if (info) {
		inform();
		backSound.play();
		return;
	}
	switch (stage) {
		case 0:
			Players[0].ShipList.pop();
			drawBoard();
			if (Players[0].ShipList.length === 0 && (gameMode === "Base War" || gameMode === "Defend")) {
				stage = 5;
			}
			break;
		case 1:
			cursorData[0] = cMenu;
			cMenu = -1;
			dispShipList();
			stage = 0;
			break;
		case 2:
			cursorData[1] = cRot;
			cRot = -1;
			dispShipTypes();
			drawCursor();
			stage = 1;
			break;
		case 11:
			cursorLoc = cursorData;
			cMenu = -1;
			stage = 10;
			break;
		case 13:
			stage = 12;
			break;
		case 20:
			let temp = attackList[attackList.length - 1];
			if (Array.isArray(temp[2])) {
				attackShip(Players[0].ShipList[temp[0]],[temp[2],temp[3]],temp[1],temp[4],true);
			} else {
				attackShip(Players[0].ShipList[temp[0]],Players[temp[2]].ShipList[temp[3]],temp[1],temp[4],true);
			}
			break;
		case 21:
			stage = 20;
			cMenu = -1;
			break;
		case 22:
			cMenu = 0;
			stage = 21;
			attackingShip = {};
			break;
		case 23:
			stage = 22;
			cMenu = -1;
			break;
		case 24:
			stage = 23;
			cMenu = 0;
			defensiveShip = {};
			cMenuMax = Players.reduce((num,player) => {
				return num + player.shipsInPos(cursorLoc).length
			},0);
			break;
	}
	backSound.play();
}

function inform() {
	if ((stage === 0 || stage === 5 || stage === 10 || stage === 20 || stage === 22 || stage === 8 || stage === 50) && !info) {
		if (Players.some((player) => player.controlSquare(cursorLoc))) {
			info = true;
			cMenu = 0;
			cMenuMax = Players.reduce((num,player) => {
				return num + player.shipsInPos(cursorLoc).length
			},0);
		}
	} else if (info) {
		cMenu = -1;
		info = false;
	}
}

function hitData(atkShip = Ship, defShip = Ship, aWeap = Object) {
	let wHit = aWeap.Whit;
	let wRan = aWeap.Wran; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
	acc = atkShip.Acc; // + factionTraits[atkShip.player.Faction][2]*(factionTraits[atkShip.player.Faction][10]) + factionTraits[atkShip.player.Faction][2];
	let defdata = defShip.getDefenses();
	let mov = defdata[1];
	let dist = calculateDist(atkShip.location,defShip.location);
	let wCov = 0;
	let dHit = 0;
	let hitchance = wHit + acc - 5*(3^(mov/5));
	hitchance /= (dist - wRan - 1)*(dist - wRan > 0) + 1;
	let hitDchance = hitchance;
	if (defdata[2] >= 0 && aWeap.Type == "Missile") {
		let dWeapon = defShip.checkDefenses();
		wCov  = dWeapon.Wcov;
		dHit = dWeapon.Whit;
		hitDchance -= ((dHit*wCov)/20); //+  factionTraits[atkShip.player.Faction][3];
	}
	return [hitchance, hitDchance];
}

function calculateHit(atkShip = Ship, defShip = Ship, weap = Number) {
	let aWeap = atkShip.getWeapon(weap);
	let defdata;
	if (!(aWeap.Type === "Deploying" || aWeap.Type === "Destruct")) defdata = defShip.getDefenses();
	let data = [];

	if (aWeap.Type === "Deploying") {
		const hit = atkShip.rot;
		location = 0;
		atkShip.Area.forEach((val, index) => {
			if (compareArray(val,cursorLoc)) {
				location = index;
			}
		});
		data = [atkShip.number,weap,0,location,hit];
	} else if (aWeap.Type === "Healing") {
		let dist = calculateDist(atkShip.location,defShip.location);
		const hit = 2*(dist <= 1);
		data = [atkShip.number,weap,defShip.player,defShip.number,hit];
	} else if (aWeap.Type === "Destruct") {
		let DataList = [[],[],[]]; //Player, ShipNum, hit
		let [sx,sy] = atkShip.position;
		let cSector = atkShip.sector;
		let wRan = aWeap.Wran;
		for (let x = sx - wRan; x <= sx + wRan; x++) {
			for (let y = sy - wRan; y <= sy + wRan; y++) {
				let loc = updateSector([...cSector,[x,y]]);
				if (loc.length === 0) {
					return;
				}
				let dShips = Players.reduce((arr, player) => [...arr, ...player.shipsInPos(loc)],[]);
				dShips.forEach((defShip) => {
					const hitchance = hitData(atkShip,defShip, aWeap)[0];
					let rand = Math.floor(Math.random()*100 + Math.random()*100)/2;
					const hit = 2*(hitchance > rand);
					DataList[0].push(defShip.player)
					DataList[1].push(defShip.number);
					DataList[2].push(hit);
				});
			}
		}
		data = [atkShip.number,weap,DataList[0],DataList[1],DataList[2]];
	} else if (aWeap.type === "Wait") {
		data = [atkShip.number,weap,defShip.player,defShip.number,0];
	} else {
		const [hitchance, hitDchance] = hitData(atkShip, defShip, aWeap);
		let rand = Math.floor(Math.random()*100 + Math.random()*100)/2;
		const hit = (hitchance > rand) + (hitDchance > rand);
		console.log(`Hit: ${hitchance}, Def Hit: ${hitDchance}, Rand: ${rand}`);
		data = [atkShip.number,weap,defShip.player,defShip.number,hit];
	}

	return data;
}

function attackShip(atkShip = Ship,defShip,weap = Number,hit = Number,undo = false) {
	if (weap === -1) {
		return;
	}

	let aWeap = atkShip.getWeapon(weap);

	let defdata;
	if (!(aWeap.Type === "Deploying" || aWeap.Type === "Destruct")) defdata = defShip.getDefenses();

	if (atkShip.player === 0) curAP += aWeap.APCost*(2*undo - 1);

	if (hit < 0) {
		const results = calculateHit(atkShip, defShip, weap);
		hit = results[4];
		attackList.push(results);
	}

	str = "";
	let wAtk = 0;
	let wRan = 0;
	let wRAtk = 0;
	let def = 0;
	let dist = 0;
	let damage = 0;
	//let cDefW = 0;

	atkShip.attack(weap,undo);

	switch (aWeap.Type) {
		case "Generic":
			wAtk = aWeap.Watk;// + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRan = aWeap.Wran;// + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRAtk = aWeap.WRatk;// + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			def = defdata[0];
			dist = calculateDist(atkShip.location,defShip.location);
			damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
			damage *= 100// + Math.round(factionTraits[atkShip.player.Faction][0]*(1-(atkShip.oldHP/atkShip.maxHP)))*(factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][0]*(!factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][1];
			damage = Math.round(damage/100);
			damage = damage*(damage > 0);
			defShip.defend(damage*(hit === 2),aWeap.Type,undo);
			if (!undo) {
				if (hit === 2) {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} hits ${Players[defShip.player].Name}'s ${defShip.Name} for ${damage} HP.\n`;
				} else {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} misses ${Players[defShip.player].Name}'s ${defShip.Name}.\n`;
				}
			}
		break;
		
		case "Missile":
			wAtk = aWeap.Watk; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRan = aWeap.Wran; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRAtk = aWeap.WRatk; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			def = defShip.Def;
			dist = calculateDist(atkShip.location,defShip.location);
			damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
			damage *= 100; // + Math.round(factionTraits[atkShip.player.Faction][0]*(1-(atkShip.oldHP/atkShip.maxHP)))*(factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][0]*(!factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][1];
			damage = Math.round(damage/100);
			damage = damage*(damage > 0);
			defShip.defend(damage*(hit === 2),aWeap.Type,undo);
			if (!undo) {
				if (hit == 2) {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} hits ${Players[defShip.player].Name}'s ${defShip.Name} for ${damage} HP.\n`;
				} else if (hit == 1) {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name}'s fire is intercepted by ${Players[defShip.player].Name}'s ${defShip.Name}.\n`;
				} else {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} misses ${Players[defShip.player].Name}'s ${defShip.Name}.\n`;
				}
			}
		break;
		
		case "Defensive":
			wAtk = aWeap.Watk; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRan = aWeap.Wran; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRAtk = aWeap.WRatk; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			def = defdata[0];
			dist = calculateDist(atkShip.location,defShip.location);
			damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
			damage *= 100; // + Math.round(factionTraits[atkShip.player.Faction][0]*(1-(atkShip.oldHP/atkShip.maxHP)))*(factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][0]*(!factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][1];
			damage = Math.round(damage/100);
			damage = damage*(damage > 0);
			defShip.defend(damage*(hit === 2),aWeap.Type,undo);
			if (!undo) {
				if (hit === 2) {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} hits ${Players[defShip.player].Name}'s ${defShip.Name} for ${damage} HP.\n`;
				} else {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} misses ${Players[defShip.player].Name}'s ${defShip.Name}.\n`;
				}
			}
		break;
		
		case "Deploying":
			if (undo) {
				let playerNum = atkShip.player
				let player = Players[playerNum];
				player.ShipList.pop();
			} else {
				let playerNum = atkShip.player
				let player = Players[playerNum];
				let nShip = new Ship(playerNum,player.ShipList.length,atkShip.faction,aWeap.dType,atkShip.Area[defShip],hit);
				player.ShipList.push(nShip);
				str += `${Players[atkShip.player].Name}'s ${atkShip.Name} deploys a ${nShip.Name}.\n`
			}
		break;
		
		case "Healing":
			wAtk = aWeap.Watk;
			damage = wAtk;
			damage = damage*(damage > 0);
			defShip.defend(damage*(hit === 2),aWeap.Type,undo);
			if (!undo) {
				if (hit === 2) {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} heals ${Players[defShip.player].Name}'s ${defShip.Name} for ${damage} HP.\n`;
				}
			}
		break;
		
		case "Ramming":
			wAtk = aWeap.Watk; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRan = aWeap.Wran; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRAtk = aWeap.WRatk; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			def = defdata[0];
			dist = calculateDist(atkShip.location,defShip.location);
			damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
			damage *= 100; // + Math.round(factionTraits[atkShip.player.Faction][0]*(1-(atkShip.oldHP/atkShip.maxHP)))*(factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][0]*(!factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][1];
			damage = Math.round(damage/100);
			damage = damage*(damage > 0);
			defShip.defend(damage*(hit === 2),aWeap.Type,undo);
			if (!undo) {
				if (hit === 2) {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} hits ${Players[defShip.player].Name}'s ${defShip.Name} for ${damage} HP.\n`;
				} else {
					str += `${Players[atkShip.player].Name}'s ${atkShip.Name} misses ${Players[defShip.player].Name}'s ${defShip.Name}.\n`;
				}
			}
		break;
		
		case "Destruct":
			wAtk = aWeap.Watk; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRan = aWeap.Wran; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];
			wRAtk = aWeap.WRatk; // + factionTraits[atkShip.player.Faction][5] + factionTraits[atkShip.player.Faction][5];

			defShip.forEach((defShip,i) => {
				def = defShip.getDefenses()[0];
				dist = calculateDist(atkShip.location,defShip.location);
				damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
				damage *= 100; // + Math.round(factionTraits[atkShip.player.Faction][0]*(1-(atkShip.oldHP/atkShip.maxHP)))*(factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][0]*(!factionTraits[atkShip.player.Faction][9]) + factionTraits[atkShip.player.Faction][1];
				damage = Math.round(damage/100);
				damage = damage*(damage > 0);
				defShip.defend(damage*(Number(hit[i]) === 2),aWeap.Type,undo);
				if (!undo) {
					if (Number(hit[i]) === 2) {
						str += `${Players[atkShip.player].Name}'s ${atkShip.Name} hits ${Players[defShip.player].Name}'s ${defShip.Name} for ${damage} HP.\n`;
					} else {
						str += `${Players[atkShip.player].Name}'s ${atkShip.Name} misses ${Players[defShip.player].Name}'s ${defShip.Name}.\n`;
					}
				}
			});
		break;
		
		case "Wait":
			str += `${Players[atkShip.player].Name}'s ${atkShip.Name} waits.\n`;
		break;
	}
	weaponText = str;
}

function endTurn () {
	if ((stage === 0 || stage === 1 || stage === 2) && Players.length > 1) {
		stage = 8;
		nStage = 10;
		let buttons = document.getElementById("Buttons");
		let input = document.getElementById("IO");
		buttons.style.visibility = "hidden";
		input.style.visibility = "visible";
		updateInputBox(); 
		updateDataString();
	} else if ((stage === 0 || stage === 1 || stage === 2) && Players.length === 1) {
		nStage = 10;
		nextTurn();
	} else if ((stage === 10 || stage === 11) && Players.length > 1) {
		stage = 8;
		nStage = 20;
		let buttons = document.getElementById("Buttons");
		let input = document.getElementById("IO");
		buttons.style.visibility = "hidden";
		input.style.visibility = "visible";
		updateInputBox(); 
		updateDataString();
	} else if (stage === 10 || stage === 11) {
		nStage = 20;
		nextTurn();
	} else if (stage === 20 && impulse < impulseCount) {
		stage = 28;
		nStage = 28;
		let buttons = document.getElementById("Buttons");
		let input = document.getElementById("IO");
		buttons.style.visibility = "hidden";
		input.style.visibility = "visible";
		updateInputBox();
		updateDataString();
	}


}

function nextTurn () {
	stage = nStage;
	let buttons = document.getElementById("Buttons");
	let input = document.getElementById("IO");
	buttons.style.visibility = "visible";
	input.style.visibility = "hidden";

	Players.forEach((player) => player.hasMoved = false);

	deleteShips();
	if (stage === 10) {
		Players[0].ShipList.forEach((ship) => ship.finalizeMove());
	} else if (stage === 20) {
		impulse = 0;
		Players.forEach((player) => player.updateAP());
		updateImpulse();
		if (impulse !== impulseCount - 1) {
			curAP = impulseAP;
			Players[0].AP -= impulseAP;
		} else {
			curAP = Players[0].AP;
			Players[0].AP = 0;
		}
	} else if (stage === 28) {
		impulse++;
		if (impulse === impulseCount) {
			nStage = 10;
			nextTurn();
			return;
		} else if (impulse === impulseCount - 1) {
			curAP = Players[0].AP;
			Players[0].AP = 0;
		} else {
			curAP = impulseAP;
			Players[0].AP -= impulseAP;
		}
		stage = 20;
	} else {
		updateImpulse();
	}
	checkVictory();
	dispData();
	updateFooter();
}

function checkVictory() {
	//"Deathmatch","Base War","Defend","Attack","Spectator"
	if (gameMode === "Deathmatch") {
		if (Players[0].ShipList.length === 0) {
			stage = 40;
			lose = true;
			alert("You Lose");
		} else if (Players.filter(player => player.ShipList.length > 0) === 1) {
			stage = 40;
			win = true;
			alert("You Win");
		} else {
			Players = Players.filter(player => player.ShipList.length > 0);
		}
	}
}

function updateDataString () {
	let dString = "";
	if (nStage === 10) {
		dString = `S-${Players[0].Name};${Players[0].Faction};`;
		for (let i = 0; i < Players[0].ShipList.length; i++) {
			const faction = Players[0].ShipList[i].faction;
			const type =  Players[0].ShipList[i].type;
			const position = JSON.stringify(Players[0].ShipList[i].position);
			const sector = JSON.stringify(Players[0].ShipList[i].sector);
			const rot = Players[0].ShipList[i].rot;
			dString += `${faction}.${type}.${position}.${sector}.${rot}`;
			if(i + 1 != Players[0].ShipList.length) {
				dString += ";"
			}
		}
	} else if (nStage === 20) {
		dString = "";
		dString += "M-" + movType + ";";
		Players[0].ShipList.forEach((val,ind,arr) => {
			dString += `${ind}.${val.dX}.${val.dY}.${val.rot}`;
			if (ind !== arr.length - 1){
				dString += ";";
			}
		});
	} else if (nStage === 28) {
		dString = "";
		dString += "A-"
		attackList.forEach((atk,ind,arr) => {
			let defPlayers = "";
			if (Array.isArray(atk[2])) {
				let dPlayers = [];
				atk[2].forEach((val) => dPlayers.push(Players[val].Name));
				defPlayers = JSON.stringify(dPlayers);
			} else {
				defPlayers = JSON.stringify(Players[atk[2]].Name);
			}
			const defShips = JSON.stringify(atk[3]);
			const hits = JSON.stringify(atk[4]);
			//ShipNum, Weapon, Defending Player, def Ship Num, Hit
			dString += `${atk[0]}.${atk[1]}.${defPlayers}.${defShips}.${hits}`;
			if (ind !== arr.length - 1){
				dString += ";";
			}
		});
	}
	let output = document.getElementById("Output");
	output.value = dString;
}

function updateInputBox () {
	let inPlayer = Players.find((player) => {
		return !player.hasMoved && !player.isAI && (player.playerNum !== 0 || stage === 50);
	});
	if (!inPlayer) {
		nextTurn();
		return;
	}
	inputPlayer = inPlayer.playerNum;
	document.getElementById("InputName").innerText = `${inPlayer.Name}:`
	document.getElementById("Input").value = "";
}

function updateImpulse () {
	let APCount = Players[0].AP;
	impulseAP = 2*Math.ceil(APCount/16);

	const impulseArr = Players.map((val) => {
		let tImpulseAP = 2*Math.ceil(val.AP/16);
		return Math.ceil(val.AP/tImpulseAP);
	});
	impulseArr.sort(function(a, b){return a-b});

	if (impulseArr[0] !== impulseArr[impulseArr.length -1]) {
		impulseArr[0]++;
	}

	impulseCount = impulseArr[0]; 
}

function deleteShips() {
	for (player of Players) {
		player.ShipList = player.ShipList.filter((ship) => {
			let val = ship.HP > 0 && ship.Area.every((loc) => updateSector(loc).length !== 0);
			return val;
		});
		player.ShipList.forEach((ship,ind) => ship.number = ind);
	}
}