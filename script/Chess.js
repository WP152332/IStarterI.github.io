const startField =
[["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"],
["Rook", "Knight", "Bishop", "King", "Queen", "Bishop", "Knight", "Rook"]];
let p1u = 0;
let p2u = 0;
let turn = 1;
let angpa = 0;
let AttackMap = [];
const playerColor = [, "#F06292", "#62F092"];

let AM1 = [];
let AM2 = [];
let Units = [[],[]];

function Unit(job, player, x, y) {
  this.job = job;
  this.x = x;
  this.y = y;
  this.player = player;
  this.alive = true;
}

AM1.push([]);
AM2.push([]);
for (let i = 0; i < 8; i++) {
  let Temp1 = [];
  let Temp2 = [];
  for (let j = 0; j < 8; j++) {
    let div = document.createElement('div');
    let front = document.createElement('div');
    let x = i + 1;
    let y = j + 1;
    div.style.background = (i + j) % 2 ? "black" : "white";
    Temp1.push(0);
    Temp2.push(0);
    makeField("back", x, y, div);
    makeField("front", x, y, front);
  }
  Temp1.push(0);
  Temp2.push(0);
  AM1.push(Temp1);
  AM2.push(Temp2);
}
AttackMap.push(AM1);
AttackMap.push(AM2);

for(let i = 0; i < 8; i++) {
  p1u += 2;
  p2u += 2;
  addUnit(startField[0][i], 1, i + 1, 1);
  addUnit("Pawn", 1, i + 1, 2);
  addUnit("Pawn", 2, i + 1, 7);
  addUnit(startField[1][i], 2, i + 1, 8);
}

function changeAttackMap() {

}

function addUnit(name, player, x, y) {
  let unitpush = new Unit(name, player, x, y);
  Units[player - 1].push(unitpush);
  let unit = document.createElement('img');
  unit.id = "unit" + x + y;
  unit.className = name;
  unit.owner = player;
  unit.style.gridColumn = x + "";
  unit.style.gridRow = y + "";
  unit.style.height = "12.5vh";
  unit.style.width = "12.5vh";
  unit.src = "./img/" + name + player + ".svg";
  unit.style.cursor = "pointer";
  unit = addView(unit, name, player, x, y);
  if(name == "King" || name == "Rook") unit.enableCastling = true;
  document.getElementById('ChessBoard').appendChild(unit);
}

function addView(unit, name, player, x, y) {
  unit.onclick = function() {
    if(player != turn) return;
    reset();
    switch (name) {
      case "Pawn":
        addPawn(x, y, player);
        break;
      case "Rook":
        addRook(name, x, y, player);
        break;
      case "Knight":
        addKnight(x, y, player);
        break;
      case "Bishop":
        addBishop(name, x, y, player);
        break;
      case "Queen":
        addRook(name, x, y, player);
        addBishop(name, x, y, player);
        break;
      case "King": addKing(x, y, player); break;
    }
  }
  return unit;
}

function addMove(name, player, x, y, tx, ty) {
  let unit = document.getElementById("unit" + x + y);
  let target = document.getElementById("front" + tx + ty);
  target.style.zIndex = "5";
  target.onclick = function() {
    if(unit.enableCastling != null) unit.enableCastling = null;
    promotion(unit, target, player);
    turn = (2 * turn) % 3;
    target.style.zIndex = 0;
    unit.style.gridColumn = tx + "";
    unit.style.gridRow = ty + "";
    unit.id = "unit" + tx + ty;
    unit = addView(unit, name, player, tx, ty);
    let uns = isWhichUnit(x, y);
    uns.x = tx;
    uns.y = ty;
    checkCheck(player);
    reset();
    angpa = 0;
    if(name == "Pawn" && Math.abs(ty - y) == 2)
    angpa = Number("" + tx + ty + player);
  }
  changeBackground(tx, ty, player);
}

function addAttack(name, player, x, y, tx, ty) {
  let unit = document.getElementById("unit" + x + y);
  let target = document.getElementById("front" + tx + ty);
  target.style.zIndex = "5";
  target.onclick = function() {
    promotion(unit, target, player);
    turn = (2 * turn) % 3;
    document.getElementById("ChessBoard").removeChild(
    document.getElementById("unit" + tx + ty));
    if(player == 1) p2u -= 1;
    else p1u -= 1;
    addUnit(unit.className, player, tx, ty)
    document.getElementById("ChessBoard").removeChild(unit);
    let uns = isWhichUnit(x, y);
    uns.x = tx;
    uns.y = ty;
    checkCheck(player);
    reset();
    angpa = 0;
  }
  changeBackground(tx, ty, player);
}

function promotion(unit, target, player) {
  if(unit.className == "Pawn" && (target.style.gridRow[0] == "1" || target.style.gridRow[0] == "8")) {
    let changeTo = "";
    while(changeTo != "Rook" && changeTo != "Knight" && changeTo != "Bishop" && changeTo != "Queen") {
      changeTo = prompt('Rook or Knight or Bishop or Queen');
    }
    let uns = isWhichUnit(unit.style.gridColumn, unit.style.gridRow);
    uns.job = changeTo;
    unit.className = changeTo;
    unit.src = "./img/" + changeTo + player + ".svg";
  } return unit;
}

function castling(x, y, player) {
  if(checkKingSideCastling(player)) {
    if(player == 1) {
      castleMove(x, y, x + 2, player);
    }
    else {
      castleMove(x, y, x - 2, player);
    }
  }
  if(checkQueenSideCastling(player)) {
    if(player == 1) {
      castleMove(x, y, x - 2, player);
    }
    else {
      castleMove(x, y, x + 2, player);
    }
  }
}

function castleMove(x, y, tx, player) {
  let unit = document.getElementById("unit" + x + y);
  let target = document.getElementById("front" + tx + y);
  target.style.zIndex = "5";
  target.onclick = function() {
    if(unit.enableCastling) unit.enableCastling = null;
    if(tx > x) {
      let rook = document.getElementById("unit" + 8 + y);
      rook.style.gridColumn = (tx - 1) + "";
      rook.id = "unit" + (tx - 1) + y;
      rook = addView(rook, "Rook", player, tx - 1, y);
      let unr = isWhichUnit(8, y);
      unr.x = tx - 1;
      unr.y = y;
      reset();
    } else {
      let rook = document.getElementById("unit" + 1 + y);
      rook.style.gridColumn = (tx + 1) + "";
      rook.id = "unit" + (tx + 1) + y;
      rook = addView(rook, "Rook", player, tx + 1, y);
      let unr = isWhichUnit(8, y);
      unr.x = tx + 1;
      unr.y = y;
      reset();
    }
    turn = (2 * turn) % 3;
    target.style.zIndex = 0;
    unit.style.gridColumn = tx + "";
    unit.id = "unit" + tx + y;
    unit = addView(unit, "King", player, tx, y);
    let uns = isWhichUnit(x, y);
    uns.x = tx;
    uns.y = y;
    reset();
    angpa = 0;
  }
  changeBackground(tx, y, player);
}

function checkKingSideCastling(player) {
  if (player == 1 &&
    document.getElementById("unit51") && document.getElementById("unit51").enableCastling && document.getElementById("unit81") && document.getElementById("unit81").enableCastling &&
    document.getElementById("unit61") == null &&
    document.getElementById("unit71") == null)
    return true;
  else if (player == 2 &&
    document.getElementById("unit48") && document.getElementById("unit48").enableCastling && document.getElementById("unit18") && document.getElementById("unit18").enableCastling &&
    document.getElementById("unit28") == null &&
    document.getElementById("unit38") == null)
    return true;
}

function checkQueenSideCastling(player) {
  if (player == 1 &&
    document.getElementById("unit51") && document.getElementById("unit51").enableCastling && document.getElementById("unit11") && document.getElementById("unit11").enableCastling &&
    document.getElementById("unit21") == null &&
    document.getElementById("unit31") == null &&
    document.getElementById("unit41") == null)
    return true;
  else if (player == 2 &&
    document.getElementById("unit48") && document.getElementById("unit48").enableCastling && document.getElementById("unit88") && document.getElementById("unit88").enableCastling &&
    document.getElementById("unit58") == null &&
    document.getElementById("unit68") == null &&
    document.getElementById("unit78") == null)
    return true;
}

function angpasang(x, y, tx, ty, player) {
  let unit = document.getElementById("unit" + x + y);
  let target = document.getElementById("front" + tx + ty);
  target.style.zIndex = "5";
  target.onclick = function() {
    promotion(unit, target, player);
    turn = (2 * turn) % 3;
    document.getElementById("ChessBoard").removeChild(
    document.getElementById("unit" + tx + y));
    if(player == 1) p2u -= 1;
    else p1u -= 1;
    addUnit(unit.className, player, tx, ty)
    document.getElementById("ChessBoard").removeChild(unit);
    reset();
    angpa = 0;
  }
  changeBackground(tx, ty, player);
}

function addPawn(x, y, player) {
  const addNum = player == 1 ? 1 : -1;
  if(Math.floor(angpa / 100) == x - 1 || Math.floor(angpa / 100) == x + 1) {
    if(angpa % 10 != player) {
      if(Math.floor(angpa % 100 / 10) == y) {
        angpasang(x, y, Math.floor(angpa / 100) == x - 1 ? x - 1 : x + 1, y + addNum, player);
      }
    }
  }
  if (checkFull(x + 1, y + addNum) && checkEnemy(x + 1, y + addNum, player)) {
    addAttack("Pawn", player, x, y, (x + 1), (y + addNum));
  }
  if (checkFull(x - 1, y + addNum) && checkEnemy(x - 1, y + addNum, player)) {
    addAttack("Pawn", player, x, y, (x - 1), (y + addNum));
  }
  if (!checkFull(x, y + addNum)) {
    addMove("Pawn", player, x, y, x, y + addNum);
    if ((y == 2 && player == 1) || ((y == 7) && player == 2)) {
      if (checkInfield(x, y + addNum) && !checkFull(x, y + 2 * addNum)) {
        addMove("Pawn", player, x, y, x, y + 2 * addNum);
      }
    }
  }
}

function addLinear(name, x, y, xd, yd, player) {
  let px = x + xd;
  let py = y + yd;
  while(checkInfield(px, py)) {
    if(checkFull(px, py)) {
      if(checkEnemy(px, py, player)) {
        addAttack(name, player, x, y, px, py);
        changeBackground(px, py, player);
      }
      break;
    }
    addMove(name, player, x, y, px, py);
    px += xd;
    py += yd;
  }
}

function addRook(name, x, y, player) {
  addLinear(name, x, y, 0, 1, player);
  addLinear(name, x, y, 0, -1, player);
  addLinear(name, x, y, 1, 0, player);
  addLinear(name, x, y, -1, 0, player);
}

function addKnight(x, y, player) {
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      const px = x + i;
      const py = y + j;
      if (Math.abs(i) + Math.abs(j) == 3 && checkInfield(px, py)) {
        if(checkFull(px, py)) {
          if(checkEnemy(px, py, player)) {
            addAttack("Knight", player, x, y, px, py);
          }
          continue;
        }
        addMove("Knight", player, x, y, px, py);
      }
    }
  }
}

function addBishop(name, x, y, player) {
  addLinear(name, x, y, 1, 1, player);
  addLinear(name, x, y, 1, -1, player);
  addLinear(name, x, y, -1, 1, player);
  addLinear(name, x, y, -1, -1, player);
}

function addKing(x, y, player) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const px = x + i;
      const py = y + j;
      if (checkInfield(px, py)) {
        if (checkFull(px, py)) {
          if (checkEnemy(px, py, player)) {
            addAttack("King", player, x, y, px, py);
          }
          continue;
        }
        addMove("King", player, x, y, px, py);
      }
    }
  }
  castling(x, y, player);
}

function makeField(name, x, y, div) {
  div.id = name + x + y;
  div.style.gridColumn = x + "";
  div.style.gridRow = y + "";
  document.getElementById('Chess' + name.charAt(0).toUpperCase()
  + name.slice(1)).appendChild(div);
}

function changeBackground(x, y, player) {
  document.getElementById("back" + x + y).style.background = playerColor[player];
}

function reset() {
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      document.getElementById("back" + i + j).style.background =
        (i + j) % 2 ? "black" : "white";
      document.getElementById("front" + i + j).style.zIndex = 0;
      document.getElementById("front" + i + j).onclick = null;
    }
  }
}

function isWhichUnit(x, y) {
  for(let p = 0; p < 2; p++) {
    for(let c = 0; c < 16; c++) {
      let checkUnit = Units[p][c];
      if(checkUnit.alive == true && checkUnit.x == x && checkUnit.y == y) {
        return Units[p][c];
      }
    }
  }
}

function checkInfield(x, y) {
  return (x >= 1 && x <= 8 && y >= 1 && y <= 8);
}

function checkFull(x, y) {
  if(document.getElementById("unit" + x + y) && document.getElementById("unit" + x + y).className == "King" && document.getElementById("unit" + x + y).owner == turn) alert("체크얌");
  return document.getElementById("unit" + x + y) != null;
}

function checkEnemy(x, y, player) {
  return (document.getElementById("unit" + x + y).owner != player);
}

function checkCheck(player) {
  for(let checkC = 0; checkC < 16; checkC++) {
    let thisUnit = Units[player - 1][checkC];
    let name = thisUnit.job;
    let x = thisUnit.x;
    let y = thisUnit.y;
    switch (name) {
      case "Pawn":
        addPawn(x, y, player);
        break;
      case "Rook":
        addRook(name, x, y, player);
        break;
      case "Knight":
        addKnight(x, y, player);
        break;
      case "Bishop":
        addBishop(name, x, y, player);
        break;
      case "Queen":
        addRook(name, x, y, player);
        addBishop(name, x, y, player);
        break;
      case "King": addKing(x, y, player); break;
    }
  }
}
