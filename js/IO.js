function input(dx,dy) {
	if (dx == 0 && dy == 0) {
		pressButton();
		easterEgg("a");
	} else {
		moveCursor(dx,dy);
		if (dx == 0) {
			let dirstr = ["u","d"]
			dirnum = (dy + 1)/2;
			easterEgg(dirstr[dirnum]);
		} else {
			let dirstr = ["l","r"]
			dirnum = (dx + 1)/2;
			easterEgg(dirstr[dirnum]);
		}
	}
	
}

$("#Back").click(() => back());

$("#Info").click(() => inform());

$("#EndTurn").click(() => endTurn());

$("#ZoomIn").click(() => {
	Zoom(1);
});

$("#ZoomOut").click(() => {
	Zoom(-1);
});

$(document).keydown( (val) => {
	if (changeKeyCode > -1) {
		keyCodes[changeKeyCode] = val.key;
		changeKeyCode = -1;
		updateKeyCodes();
	}
	if ($(document.activeElement)[0].localName === "body") {
		switch (val.key) {
			case keyCodes[0]:
				input(0,-1);
				break;
			case keyCodes[1]:
				input(0,1);
				break;
			case keyCodes[2]:
				input(-1,0);
				break;
			case keyCodes[3]:
				input(1,0);
				break;
			case keyCodes[4]:
				input(0,0);
				break;
			case keyCodes[5]:
				back();
				break;
			case keyCodes[6]:
				inform();
				break;
			case keyCodes[7]:
				endTurn();
				break;
			case keyCodes[8]:
				Zoom(1);
				break;
			case keyCodes[9]:
				Zoom(-1);
				break;
		}
	}
});

$("#MenuToggle").click(() => {
	console.log($("#MenuToggle").text());
	if($("#MenuToggle").text() === "Menu V") {
		$("#MenuToggle").text("Menu " + String.fromCodePoint(0x039B));
		$("#Controls").hide();
	} else {
		$("#MenuToggle").text("Menu V");
		$("#Controls").show();
	}
});

$("#Menu").click(() => {
	let game = document.getElementById("Game");
	let settings = document.getElementById("Settings");
	game.style.visibility = "hidden";
	settings.style.visibility = "visible";
});

$("#Return").click(() => {
	let game = document.getElementById("Game");
	let settings = document.getElementById("Settings");
	game.style.visibility = "visible";
	settings.style.visibility = "hidden";
});

$("#CopyText").click(() => {
	/* Get the text field */
 var copyText = $("#Output");
 /* Select the text field */
 copyText.select();
 //copyText.setSelectionRange(0, 99999); /* For mobile devices */
 /* Copy the text inside the text field */
 document.execCommand("copy");
});

$("#SetInput").click(() => {
	let str = document.getElementById("Input").value;
	Players[inputPlayer].runMove(str);
	updateInputBox();
});

function Zoom (val) {
	if (!(stage === 0 || stage === 5 || stage === 8 || stage === 10 || stage === 20)) {
		return;
	}
	cLevel += val;
	if (cLevel < 0 || cLevel >= cursorLoc.length) {
		cLevel -= val;
	}
	updateGrid();
}

let astley = true;
let oAstley = true;
//let movStr = "u        u";

function easterEgg(str) {
	let infoDoc = document.getElementById("Info");
	movStr = movStr.slice(1) + str;
	if (movStr.slice(2) === "uuddlrlr") {
		console.log("Trans Rights");
		infoDoc.innerText = "Trans Rights";
	} else if (movStr.slice(2) == "uulrlrdd") {
		return;
		console.log("Working");
		endingFaction = 5;
		updateHTML();
	} else if (movStr.split("u").length == 1 && astley) {
		infoDoc.innerText = "Astley Ready";
		let root = document.querySelector(':root');
	} else if ((!movStr.includes("u")) && astley) {
		console.log("hhhhhhhhhhhh");
		window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
	} else if (!astley && oAstley && str != "u") {
		oAstley = false;
	} else if (movStr.split("u").length - 1 == movStr.length && oAstley) {
		astley = false;
		infoDoc.innerText = "Astley Offline";
	} else {

	}
}

/*$('#GameBoard').click((e) => {
	let mouseX = e.pageX;
	console.log(mouseX);
	let mouseY = e.pageY;
	if (stage === 0 || stage === 5 || stage === 10 || stage === 20 || stage === 22 || stage === 8 || stage === 50) {
		console.log(mouseX/width);
		cursorLoc[cLevel][0] = Math.floor(mouseX/width);
		cursorLoc[cLevel][1] = Math.floor(mouseY/height);
	}
	moveCursor(0,0);
})*/


//Settings

//Buttons

$("#GameSet").click(() => {
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
});

$("#PlayerSet").click(() => {
	$("#GameSettings").hide();
	$("#PlayerSettings").show();
	$("#AudioSettings").hide();
	$("#ControlSettings").hide();
	$("#LoadingSaving").hide();

	document.getElementById("GameSet").classList.remove("active");
	document.getElementById("PlayerSet").classList.add("active");
	document.getElementById("AudioSet").classList.remove("active");
	document.getElementById("ControlSet").classList.remove("active");
	document.getElementById("LoadSave").classList.remove("active");
});

$("#AudioSet").click(() => {
	$("#GameSettings").hide();
	$("#PlayerSettings").hide();
	$("#AudioSettings").show();
	$("#ControlSettings").hide();
	$("#LoadingSaving").hide();

	document.getElementById("GameSet").classList.remove("active");
	document.getElementById("PlayerSet").classList.remove("active");
	document.getElementById("AudioSet").classList.add("active");
	document.getElementById("ControlSet").classList.remove("active");
	document.getElementById("LoadSave").classList.remove("active");
});

$("#ControlSet").click(() => {
	$("#GameSettings").hide();
	$("#PlayerSettings").hide();
	$("#AudioSettings").hide();
	$("#ControlSettings").show();
	$("#LoadingSaving").hide();

	document.getElementById("GameSet").classList.remove("active");
	document.getElementById("PlayerSet").classList.remove("active");
	document.getElementById("AudioSet").classList.remove("active");
	document.getElementById("ControlSet").classList.add("active");
	document.getElementById("LoadSave").classList.remove("active");
});

$("#LoadSave").click(() => {
	$("#GameSettings").hide();
	$("#PlayerSettings").hide();
	$("#AudioSettings").hide();
	$("#ControlSettings").hide();
	$("#LoadingSaving").show();

	document.getElementById("GameSet").classList.remove("active");
	document.getElementById("PlayerSet").classList.remove("active");
	document.getElementById("AudioSet").classList.remove("active");
	document.getElementById("ControlSet").classList.remove("active");
	document.getElementById("LoadSave").classList.add("active");
});

//Game Settings

document.getElementById("updateLayers").onclick = () => {
	let layerCount = Number(document.getElementById("LayerCount").value);
	updateLayerCount(layerCount);
}

function updateLayerCount(layerCount) {
	if (stage >= 10 && layerCount < grSize.length || layerCount === grSize.length) {
		return;
	}

	if (layerCount < grSize.length) {
		grSize = grSize.slice(layerCount);
		cursorLoc = cursorLoc.slice(layerCount);
	} else {
		for(let val = grSize.length; val < layerCount; val++) {
			grSize = [16, ...grSize];
			cursorLoc = [[0,0], ...cursorLoc];
		}
	}
	updateLayerData();
}

function updateLayerData() {
	let bLayers = document.getElementById("BoardLayers");
	bLayers.innerHTML = "";
	grSize.forEach((val,index,arr) => {
		let label = document.createElement("label");
		label.htmlFor = `L${index}Size`;
		label.innerText = `Size of Layer ${index}(Val x Val): `;
		let input = document.createElement("input");
		input.id = `L${index}Size`
		input.type = "number";
		input.classList.add("numbox");
		input.min = "1";
		input.max = "256";
		input.value = val;
		let button = document.createElement("button");
		button.id = `updateL${index}Size`;
		button.type = "button";
		button.classList.add("button");
		button.innerText = "Update"
		button.onclick = () => {
			grSize[index] = Number(input.value);
			updateGrid();
		};

		bLayers.appendChild(label);
		bLayers.appendChild(input);
		bLayers.appendChild(button);
		if (arr.length - 1 !== index) {
			bLayers.appendChild(document.createElement("br"));
			bLayers.appendChild(document.createElement("hr"));
			bLayers.appendChild(document.createElement("br"));
		}
	});
	updateGrid();
}

document.getElementById("updateHPlay").onclick = () => {
	let hPlayCount = document.getElementById("HumanPlayers").value;
	updateHumanPlayerCount(hPlayCount);
};

function updateHumanPlayerCount(num) {
	const hPlayers = Players.filter((val) => !val.isAI)
	if (stage >= 10 && num < hPlayers.length || num === hPlayers.length) {
		return;
	}

	if (num < hPlayers.length) {
		let tNum = hPlayers.length - num;
		let index = Players.length - 1;
		while (tNum > 0) {
			if (!Players[index].isAI) {
				tNum --;
				Players.splice(index,1);
			}
			index--;
		}
	} else {
		for(let val = hPlayers.length; val < num; val++) {
			let nPlayer = new Player(val,false,"Astute");
			Players.push(nPlayer);
		}
	}
	updatePlayerSettings();
}

document.getElementById("updateCPlay").onclick = () => {
	let cPlayCount = document.getElementById("CompPlayers").value;
	updateCompPlayerCount(cPlayCount);
};

function updateCompPlayerCount(num) {
	const cPlayers = Players.filter((val) => val.isAI)
	if (stage >= 10 && num < cPlayers.length || num === cPlayers.length) {
		return;
	}

	if (num < cPlayers.length) {
		let tNum = cPlayers.length - num;
		let index = Players.length
		while (tNum > 0) {
			if (Players[index].isAI) {
				tNum --;
				Players.splice(index,1);
			}
			index--;
		}
	} else {
		for(let val = cPlayers.length; val < num; val++) {
			let nPlayer = new Player(val,true,"Astute");
			Players.push(nPlayer);
		}
	}
	updatePlayerSettings();
}

document.getElementById("GType").onchange = () => {
	if (stage !== 0 && stage !== 5) {
		return;
	}
	gameMode = GType.value;
	Players[0].ShipList = [];
	drawBoard();
	if (gameMode === "Base War" || gameMode === "Defend") {
		stage = 5;
	} else if (gameMode === "Spectator") {
		stage = 50;
	} else {
		stage = 0;
	}
};

document.getElementById("MovStyl").onchange = () => movType = Number(MovStyl.value);

//Player Settings

function updatePlayerSettings() {
	const playSet = document.getElementById("PlayerSettings");
	playSet.innerHTML = "";

	const hPlayers = document.createElement("div");
	hPlayers.style.width = "50%";
	//hPlayers.style.height = "50%";
	//hPlayers.style.overflowY = "scroll"
	let title = document.createElement("h5");
	title.innerText = "Human Players:";
	hPlayers.appendChild(title);

	const cPlayers = document.createElement("div");
	cPlayers.style.width = "50%";
	//cPlayers.style.height = "50%";
	//cPlayers.style.overflowY = "scroll"
	title = document.createElement("h5");
	title.innerText = "Computer Players:"
	cPlayers.appendChild(title);

	Players.forEach((player, i) => {
		player.playerNum = i;
		const playerObj = document.createElement("div");
		playerObj.classList.add("player");
		playerObj.style.border = "1px #444 solid";
		playerObj.style.height = "5rem";

		const pName = document.createElement("input");
		pName.value = player.Name;
		pName.style.fontSize = "2.5rem";
		pName.style.gridArea = "Name";
		pName.style.border = "none";
		pName.style.borderRight = "1px #444 solid";
		pName.style.borderBottom = "1px #444 solid";
		playerObj.appendChild(pName);

		const update = document.createElement("button");
		update.innerText = "Update";
		update.style.border = "none";
		update.style.borderBottom = "1px #444 solid";
		update.style.gridArea = "Update";
		playerObj.appendChild(update);

		const isAI = document.createElement("div");
		isAI.innerText = "AI";
		isAI.style.gridArea = "AI";
		isAI.style.display = "flex";
		isAI.style.fontSize = "2.5rem";
		isAI.style.justifyContent = "center";
		isAI.style.alignItems = "center";
		if (player.isAI) {
			isAI.style.color = "#0F990F";
		} else {
			isAI.style.color = "#0F0F0F";
		}
		playerObj.appendChild(isAI);

		const pFaction = document.createElement("select");
		for (fName of factionNames) {
			let options = document.createElement("option");
			options.text = fName;
			options.value = fName;
			if (player.Faction === fName) {
				options.selected = true;
			}
			pFaction.add(options);
		}
		pFaction.style.gridArea = "Faction";
		pFaction.style.borderLeft = "1px #444 solid";
		pFaction.style.borderRight = "1px #444 solid";
		playerObj.appendChild(pFaction);

		const pColor = document.createElement("input");
		pColor.type = "color";
		pColor.value = player.Color;
		pColor.style.border = "none";
		pColor.style.borderRight = "1px #444 solid";
		pColor.style.gridArea = "Color";
		pColor.style.width = "100%";
		pColor.style.height = "100%"
		playerObj.appendChild(pColor);

		const del = document.createElement("button");
		del.innerText = "Delete";
		del.style.color = "#BB4444";
		del.style.border = "none";

		playerObj.appendChild(del);

		update.onclick = () => {
			Players[i].Name = pName.value;
			if (pFaction.value !== Players[i].Faction) {
				Players[i].Color = factionColors[pFaction.value];
			} else {
				Players[i].Color = pColor.value;
			}
			Players[i].Faction = pFaction.value;
			updatePlayerSettings();
		};

		del.onclick = () => {
			Players.splice(i,1);
			updatePlayerSettings();
		};

		if (player.isAI) {
			cPlayers.appendChild(playerObj);
		} else {
			hPlayers.appendChild(playerObj);
		}
	});
	playSet.appendChild(hPlayers);
	playSet.appendChild(cPlayers);
}

//Audio Settings

document.getElementById("Sounds").onchange = () => {
	let value = document.getElementById("Sounds").value;
	value /= 10;
	mov.volume = value;
	press.volume = value;
	backSound.volume = value;
	destroy.volume = value;
}

//Control Settings

function updateKeyCodes () {
	keyCodes.forEach((val, index) => {
		const docString = "KC" + index;
		const item = document.getElementById(docString);
		try {
			item.innerText = val;
			item.onclick = () => {
				changeKeyCode = index;
				item.innerText = val + " ...";
			}
		} catch (err) {

		}
	});
}

//Loading and Saving

const inp = document.getElementById("ImportGameFile");
document.getElementById("ImportGameSettings").onclick = () => inp.click();
inp.addEventListener('change', read);

function read() {
	const reader = new FileReader();
	reader.addEventListener("load", () => {
		updateSettings(reader.result);
	}, false);
	reader.removeEventListener("load",() => {
		updateSettings(reader.result);
	});
	reader.readAsText(inp.files[0]);
}

function updateSettings(string) {
	let [layerstr,playstr,gmeMode,movem,vol,contrstr] = string.split(".");
	//Layers
	grSize = JSON.parse(layerstr);
	document.getElementById("LayerCount").value = grSize.length;
	updateLayerData();

	//Players
	let plays = JSON.parse(playstr);
	Players = [];
	plays.forEach((player,index) => {
		Players.push(new Player(index, player.isAI, player.Faction));
		Players[index].Name = player.Name;
		Players[index].Color = player.Color;
	});
	document.getElementById("HumanPlayers").value = Players.filter((val) => !val.isAI).length;
	document.getElementById("CompPlayers").value = Players.filter((val) => val.isAI).length;
	updatePlayerSettings();

	//GameMode
	gameMode = gmeMode;
	document.getElementById("GType").value = gmeMode;

	//Movement
	movType = Number(movem);
	document.getElementById("MovStyl").value = movType;

	//Volume
	let value = Number(vol)/10;
	document.getElementById("Sounds").value = value*10;
	mov.volume = value;
	press.volume = value;
	backSound.volume = value;
	destroy.volume = value;

	//Controls
	keyCodes = JSON.parse(contrstr);
	changeKeyCode = -1;
	updateKeyCodes();
}

document.getElementById("ExportGameSettings").onclick = () => writeSettings();

function writeSettings() {
	let layers = JSON.stringify(grSize);
	let plays = [];
	Players.forEach((player) => {
		plays.push({Name: player.Name, Faction: player.Faction, Color: player.Color, isAI: player.isAI});
	})
	let playstr = JSON.stringify(plays);
	let gmeMode = gameMode;
	let movem = movType;
	let vol = mov.volume*10;
	let controls = JSON.stringify(keyCodes);

	const settings = `${layers}.${playstr}.${gmeMode}.${movem}.${vol}.${controls}`;
	const blob = new Blob([settings],{type: "text/plain;charset=utf-8"});
	saveAs(blob, "Settings.txt");
}

let dataStr = "";
let infoStr = "";

function createSaveData () {
	infoStr = Players.reduce((prev, curr, i, arr) => {
		let newStr = curr.Name;
		if (i + 1 < arr.length) {
			newStr += " vs. ";
		}
		return prev + newStr;
	}, "FS: ");
	let playData = [];
	for (let x = 0; x < Players[0].moves.length; x++) {
		let nArray = Players.map((player) => player.moves[x]);
		playData.push(nArray);
	}

	dataStr = "FS." + JSON.stringify(playData);
}

function createQuickSave () {
	infoStr = Players.reduce((prev, curr, i, arr) => {
		let newStr = curr.Name;
		if (i + 1 < arr.length) {
			newStr += " vs. ";
		}
		return prev + newStr;
	}, "QS: ");
	const playData = Players.map((player) => {
		return {ShipList: player.ShipList, Name: player.Name, 
			Faction: player.Faction, Color: player.Color,
			isAI: player.isAI, playerNum: player.playerNum,
			curAP: curAP, AP: player.AP, hasMoved: player.hasMoved};
	});
	dataStr = `QS.${stage}.${nStage}.${JSON.stringify(playData)}`;
}

function localSaveData () {
	if (typeof(Storage) === "undefined") return;
	let id = JSON.parse(localStorage.getItem("Saves"));
	if (id === null) id = [];
	let info = JSON.parse(localStorage.getItem("Information"));
	if (info === null) info = [];
	const d = new Date();
	const time = d.getTime();

	localStorage.setItem(time,dataStr);

	id.push(time);
	info.push(infoStr);

	localStorage.setItem("Saves",JSON.stringify(id));
	localStorage.setItem("Information", JSON.stringify(info));

	updateSaves();
}

function downloadSaveData () {
	const blob = new Blob([dataStr],{type: "text/plain;charset=utf-8"});
	saveAs(blob, "Save.txt");
}

const upload = document.getElementById("UploadSaveFile");
document.getElementById("USave").onclick = () => upload.click();
upload.addEventListener('change', uploadSaveData);

function uploadSaveData() {
	const reader = new FileReader();
	reader.addEventListener("load", () => {
		loadSaveData(reader.result);
	}, false);
	reader.removeEventListener("load",() => {
		loadSaveData(reader.result);
	});
	reader.readAsText(upload.files[0]);
}

function loadSaveData(string = String) {
	if (string.slice(0,3) === "FS.") {
		string = string.slice(3);
		console.log(string)
		let arr = JSON.parse(string);
		Players = [];
		stage = 0;
		arr[0].forEach((player,i) => {
			Players.push(new Player(i,false, "Astute"))
		});

		updatePlayerSettings();

		arr.forEach(move => {
			endTurn();
			Players[0].moves.pop();
			move.forEach((plmove, j) => {
				Players[j].runMove(plmove);
			});
			updateInputBox();
		});

	} else {
		string = string.slice(3);
		let [stge, nStge, pData] = string.split(".");
		pData = JSON.parse(pData);
		Players = [];
		stage = Number(stge);
		nStage = Number(nStge);
		pData.forEach((pDatum,i) => {
			Players.push(new Player(i, pDatum.isAI ,pDatum.Faction));
			play = Players[i];
			pDatum.ShipList.forEach((ship,j) => {
				let tShip = new Ship(i,j,ship.faction,ship.type,[...ship.sector,ship.position],ship.rot);
				tShip.HP = ship.HP;
				tShip.oldHP = ship.oldHP;
				tShip.Weap = ship.Weap;
				tShip.dX = ship.dX;
				tShip.dY = ship.dY;
				tShip.moved = ship.moved;
				tShip.checkDefenses();
				play.ShipList.push(tShip);
			})
			play.Name = pDatum.Name;
			play.Faction = pDatum.Faction;
			play.Color = pDatum.Color;
			play.isAI = pDatum.isAI;
			play.playerNum = pDatum.playerNum;
			play.hasMoved = pDatum.hasMoved;
			curAP = pDatum.curAP, 
			play.AP = pDatum.AP;
		})
		if (stge === 8 || stge === 28) {
			updateInputBox();
		}
	}
}

function updateSaves() {
	let cSaves = document.getElementById("CurrSaves");
	cSaves.innerHTML = "";
	if (typeof(Storage) !== "undefined") {
		let id = JSON.parse(localStorage.getItem("Saves"));
		let data = JSON.parse(localStorage.getItem("Information"))
		if (id == null) id = [];

		id.forEach((val, i) => {
			const saveObj = document.createElement("div");
			const sName = document.createElement("a");
			sName.innerText = data[i];
			sName.style.fontSize = "2.5rem";
			sName.style.gridArea = "Name";
			sName.style.border = "none";
			sName.style.borderBottom = "1px #444 solid";
			saveObj.appendChild(sName);

			const load = document.createElement("button");
			load.innerText = "Load";
			load.style.border = "none";
			load.style.borderRight = "1px #444 solid";
			load.style.gridArea = "Load";
			saveObj.appendChild(load);

			const del = document.createElement("button");
			del.innerText = "Delete";
			del.style.color = "#BB4444";
			del.style.border = "none";
			del.style.gridArea = "Delete";
			saveObj.appendChild(del);	

			load.onclick = () => {
				const datum = localStorage.getItem(val);
				loadSaveData(datum);
			};
			
			del.onclick = () => {
				localStorage.removeItem(val);
				data.splice(i,1);
				id.splice(i,1);
				localStorage.setItem("Saves",JSON.stringify(id));
				localStorage.setItem("Information",JSON.stringify(data));
				updateSaves();
			};

			cSaves.appendChild(saveObj);
		});
	} else {
		cSaves.innerHTML = "Local storage is not supported by your browser."
	}
}

//Output
function dispData () {
	if (stage === 0 || stage === 5 || stage === 8 || stage === 10 || stage === 11 || stage === 20 || stage === 21 || stage === 22 || stage === 23) {
		dispShipList();
	} else if (stage === 1) {
		dispShipTypes();
	} else if (stage === 2) {
		dispShipData(ShipTypes[Players[0].Faction][cMenu]);
		let hr = document.createElement("hr");
		let rot = document.createElement("li");
		rot.innerText = `Rotation: ${cRot}`;
		let list = document.getElementById("ShipData");
		list.appendChild(hr);
		list.appendChild(rot);
	} else if (stage === 12) {
		let infoDoc = document.getElementById("Info");
		infoDoc.removeChild(infoDoc.lastChild);
		let list = document.createElement("ul");

		let shipMov = document.createElement("li");
		shipMov.innerText = `Movement: ${movShip.Mov}`;
		list.appendChild(shipMov);
		if (movType === 0) {
			let movData = document.createElement("li");
			movData.innerText = `Movement Steps: ${movShip.moveData}`;
			list.appendChild(movData);
		} else {
			let movData = document.createElement("li");
			movData.innerText = `Delta-X: ${movShip.dX} Delta-Y: ${movShip.dY}`;
			list.appendChild(movData);
		}
		infoDoc.appendChild(list);
	} else if (stage === 24) {
		dispWeapons();
	}
}

function dispWeapons () {
	let shipListDoc = document.getElementById("ShipList");
	shipListDoc.removeChild(shipListDoc.lastChild);

	let list = document.createElement("ul");

	attackingShip.Weap.forEach((weap, index) => {
		let shipWeap = document.createElement("li");
		let selected = (index === cMenu)? ">":"";
		shipWeap.innerText = `${selected}${weap.Name}`;
		list.appendChild(shipWeap);
	});
	shipListDoc.appendChild(list);

	let weap = attackingShip.Weap[cMenu];

	let infoDoc = document.getElementById("Info");
	infoDoc.removeChild(infoDoc.lastChild);

	let dlist = document.createElement("ul");
	dlist.id = "WeapData";

	let weapName = document.createElement("li");
	weapName.innerText = `Name: ${weap.Name}`;
	dlist.appendChild(weapName);

	let weapCount = document.createElement("li");
	weapCount.innerText = `Count: ${weap.Count}`;
	dlist.appendChild(weapCount);

	let weapAtk = document.createElement("li");
	weapAtk.innerText = `Attack: ${weap.Watk}`;
	dlist.appendChild(weapAtk);

	let weapHit = document.createElement("li");
	weapHit.innerText = `Hit: ${weap.Whit}`;
	dlist.appendChild(weapHit);

	let weapRan = document.createElement("li");
	weapRan.innerText = `Range: ${weap.Wran}`;
	dlist.appendChild(weapRan);

	let weapCost = document.createElement("li");
	weapCost.innerText = `AP Cost: ${weap.APCost}`;
	dlist.appendChild(weapCost);

	let splitter = document.createElement("li");
	splitter.innerText = "\n";
	dlist.appendChild(splitter);

	if (!(weap.Type === "Deploying" || weap.Type === "Healing" || weap.Type === "Wait")) {
		const trueHit = hitData(attackingShip, defensiveShip, weap)[1];

		let hitchance = document.createElement("li");
		hitchance.innerText = `Hit Chance: ${trueHit}`;
		dlist.appendChild(hitchance);

		let atkShip = document.createElement("li");
		atkShip.innerText = `Attacking Ship: ${attackingShip.Name} HP: ${attackingShip.HP}/${attackingShip.maxHP} Acc: ${attackingShip.Acc}`;
		dlist.appendChild(atkShip);

		let defShip = document.createElement("li");
		defShip.innerText = `Defending Ship: ${defensiveShip.Name} HP: ${defensiveShip.HP}/${defensiveShip.maxHP} Def: ${defensiveShip.Def}`;
		dlist.appendChild(defShip);
	}

	infoDoc.appendChild(dlist);
}

function dispShipList () {
	let shipListDoc = document.getElementById("ShipList");
	shipListDoc.removeChild(shipListDoc.lastChild);

	let list = document.createElement("div");
	let shipsInSquare = Players.reduce((arr, player) => [...arr, ...player.shipsInPos(cursorLoc)],[]);
	let prevPlayer = -1;
	shipsInSquare.forEach((ship,index) => {
		if (ship.player !== prevPlayer) {
			if (prevPlayer !== -1) list.appendChild(slist);
			let player = Players[ship.player];

			let playerItem = document.createElement("span");
			playerItem.innerHTML = `<h5>${player.Name} of ${player.Faction}:</h5>`;
			list.appendChild(playerItem);
			prevPlayer = ship.player;

			slist = document.createElement("ul");
		}
		let shipItem = document.createElement("li");
		let selected = "";
		if (cMenu === index) {
			selected = ">"
			dispShipData(ship);
		}
		shipItem.innerHTML = `<div>${selected}${ship.Name}<br>HP: ${ship.HP}/${ship.maxHP}</div><br>`;
		slist.appendChild(shipItem);
	});
	if (prevPlayer !== -1) list.appendChild(slist);
	shipListDoc.appendChild(list);
	if (cMenu === -1) {
		dispCursorLoc();
	}
} 

function dispCursorLoc () {
	let infoDoc = document.getElementById("Info");
	infoDoc.removeChild(infoDoc.lastChild);

	let [x,y] = cursorLoc[cLevel];
	let sectorData = "";
	if (cLevel !== 0) {
		sectorData = " Sector: " + JSON.stringify(cursorLoc.slice(0,cLevel));
	}

	let Instructions = ""
	
	switch (stage) {
		case 0:
			Instructions = "Place Ships";
			break;
		case 5:
			Instructions = "Place Base";
			break;
		case 10:
			Instructions = "Select Ships to Move";
			break;
		case 20:
			Instructions = `Select Attacking Ship\nCurrent Action Points: ${curAP}\n${weaponText}`;
			if (weaponText.length !== 0) {
				weaponText = "";
			}
			break;
		case 22:
			Instructions = "Select Defending Ship";
			break;
	}

	const cursorData = document.createElement("div")
	cursorData.innerText = 	`Cursor Level: ${cLevel}${sectorData} Position: ${x},${y} \n${Instructions}`;

	infoDoc.appendChild(cursorData);
}

function dispShipTypes () {
	let shipListDoc = document.getElementById("ShipList");
	shipListDoc.removeChild(shipListDoc.lastChild);

	let list = document.createElement("ul");
	const pShipTypes = ShipTypes[Players[0].Faction];
	for(let val = 0; val < pShipTypes.length; val++) {
		let shipItem = document.createElement("li");
		let ship = pShipTypes[val];
		let str =" "
		if (val === cMenu) {
			str = "&gt;";
		}
		shipItem.innerHTML = `<div>${str}${ship.Name} HP: ${ship.HP}</div>`;
		list.appendChild(shipItem);
	}
	shipListDoc.appendChild(list);

	dispShipData(pShipTypes[cMenu]);
}

function dispShipData (ship) {
	let infoDoc = document.getElementById("Info");
	infoDoc.removeChild(infoDoc.lastChild);

	let list = document.createElement("ul");
	list.id = "ShipData";
	
	let shipName = document.createElement("li");
	shipName.innerText = `Name: ${ship.Name}`;
	list.appendChild(shipName);

	let shipHP = document.createElement("li");
	shipHP.innerText = `HP: ${ship.HP}`;
	list.appendChild(shipHP);

	let shipAcc = document.createElement("li");
	shipAcc.innerText = `Accuracy: ${ship.Acc}`;
	list.appendChild(shipAcc);

	let shipDef = document.createElement("li");
	shipDef.innerText = `Defense: ${ship.Def}`;
	list.appendChild(shipDef);

	let shipMov = document.createElement("li");
	shipMov.innerText = `Movement: ${ship.Mov}`;
	list.appendChild(shipMov);

	for (weap of ship.Weap) {
		let shipWeap = document.createElement("li");
		shipWeap.innerText = `${weap.Name} | Count: ${weap.Count}`;
		list.appendChild(shipWeap);
	}

	infoDoc.appendChild(list);
}

function updateFooter() {
	const stageItem = document.getElementById("Stage");
	stageItem.innerHTML = "";

	const stages = ["Move Phase",`Attack Phase ${impulse + 1}/${impulseCount}`,"Deploy Stage"];
	let currStage = stage/10 -1;
	let stageCount = 2;
	if (gameMode === "Base War" || gameMode === "Defend") {
		stageCount ++;
	}

	for (let ind = 0; ind < 9; ind++) {
		let stageBox = document.createElement("div");
		stageBox.classList.add("stageItem");
		if (ind === 0) {
			stageBox.classList.add("active");
		}
		stageBox.innerText = stages[currStage];

		let text = document.createTextNode(">>");

		stageItem.appendChild(stageBox);
		stageItem.appendChild(text);

		currStage++;
		if (currStage === stageCount) {
			currStage = 0;
		}
	}

	let settings = document.createElement("button");
	settings.id = "Menu";
	settings.innerText = String.fromCodePoint(0x263C);
	settings.onclick = () => {
		let game = document.getElementById("Game");
		let settings = document.getElementById("Settings");
		game.style.visibility = "hidden";
		settings.style.visibility = "visible";
	}
	stageItem.appendChild(settings);
}