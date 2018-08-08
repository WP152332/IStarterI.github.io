//선언부 좌표, 플레이어와 턴은 1부터 시작함
//시작 유닛 위치
const startField =
[["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"],
["Rook", "Knight", "Bishop", "King", "Queen", "Bishop", "Knight", "Rook"]];
//플레이어 색상
const playerColor = [, "#F06292", "#62F092"];
//플레이어 별 보유 유닛
let p1u = 0;
let p2u = 0;
//현재 턴
let turn = 1;
//앙파상이 가능한 턴인지
let angpa = 0;
//공격 맵 (체크메이트 확인용)
let AttackMap = [];
//유닛들 King = 0, 8 && 1, 7
let Units = [[],[]];
let clickx;
let clicky;
let checkCount = [[1],[1]];
let checkMode = false;
//Unit 클래스 생성
function Unit(job, player, x, y) {
  this.job = job;
  this.x = x;
  this.y = y;
  this.player = player;
  this.alive = true;
}

//배경 판 만들기
let AM1 = [];
let AM2 = [];
AttackMap.push([]);
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
  AM1.push(Temp1);
  AM2.push(Temp2);
}
AttackMap.push(AM1);
AttackMap.push(AM2);

//유닛 세팅
for(let i = 0; i < 8; i++) {
  p1u += 2;
  p2u += 2;
  addUnit(startField[0][i], 1, i + 1, 1);
  addUnit("Pawn", 1, i + 1, 2);
  addUnit("Pawn", 2, i + 1, 7);
  addUnit(startField[1][i], 2, i + 1, 8);
}

//공격 가능칸 변형
function changeAttackMap() {
  //공격 맵 초기화
  for(let x = 1; x <= 8; x++) {
    for(let y = 1; y <= 8; y++) {
      AttackMap[1][x][y] = 0;
      AttackMap[2][x][y] = 0;
    }
  }
  for(let p = 0; p < 2; p++) {
    for(let n = 0; n < 16; n++) {
      if(Units[p][n].alive) {
        let player = p + 1;
        let name = Units[p][n].job;
        let x = Units[p][n].x;
        let y = Units[p][n].y;
        let unit = document.getElementById("unit" + x + y);
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
  }
  isCheck();
}

//유닛 추가
function addUnit(name, player, x, y) {
  //유닛 생성 후 저장
  let unitpush = new Unit(name, player, x, y);
  Units[player - 1].push(unitpush);
  //유닛 칸 설정
  let unit = document.createElement('img');
  unit.id = "unit" + x + y;
  unit.className = name;
  unit.owner = player;
  unit.number = Units[player - 1].length - 1;
  unit.style.gridColumn = x + "";
  unit.style.gridRow = y + "";
  unit.style.height = "12.5vh";
  unit.style.width = "12.5vh";
  unit.src = "./img/" + name + player + ".svg";
  unit.style.cursor = "pointer";
  //클릭 이벤트 생성
  unit = addView(unit, name, player, x, y);
  //캐슬링
  if(name == "King" || name == "Rook") unit.enableCastling = true;
  //유닛 시각화
  document.getElementById('ChessBoard').appendChild(unit);
}

//유닛 클릭
function addView(unit, name, player, x, y) {
  unit.onclick = function() {
    //플레이어 턴에만 클릭
    if(player != turn) return;
    //이전 힌트 삭제
    reset();
    clickx = x;
    clicky = y;
    //네임에 따라
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

//유닛 이동
function addMove(name, player, x, y, tx, ty) {
  //유닛과 이동할 칸 설정
  if(clickx != x || clicky != y) return;
  let unit = document.getElementById("unit" + x + y);
  let target = document.getElementById("front" + tx + ty);
  //타겟을 위로 뛰워 색 구분
  target.style.zIndex = "5";
  //타겟 클릭 시
  target.onclick = function() {
    checkCount[0] = 0;
    checkCount[1] = 0;
    //움직였으므로 캐슬링 불가
    if(unit.enableCastling != null) unit.enableCastling = null;
    //승진 가능성 확인
    unit = promotion(unit, target, player);
    //다음턴으로 넘어감
    turn = 3 - turn;
    //유닛 상태 바꾸고
    unit.style.gridColumn = tx + "";
    unit.style.gridRow = ty + "";
    unit.id = "unit" + tx + ty;
    //클릭 재설정
    unit = addView(unit, unit.className, player, tx, ty);
    //유닛 상태 변경
    Units[player - 1][unit.number].x = tx;
    Units[player - 1][unit.number].y = ty;
    //앙파상 불가능
    angpa = 0;
    changeAttackMap();
    //이동 화면 제거
    reset();
    //만약 폰 움직였으면 앙파상 가능
    if(name == "Pawn" && Math.abs(ty - y) == 2)
    angpa = Number("" + tx + ty + player);
  }
  //배경 바꾸기
  changeBackground(tx, ty, player);
}

//유닛 공격
function addAttack(player, x, y, tx, ty) {
  if(clickx != x || clicky != y) return;
  //유닛과 타겟 선정
  let unit = document.getElementById("unit" + x + y);
  let tarunit = document.getElementById("unit" + tx + ty);
  let target = document.getElementById("front" + tx + ty);
  target.style.zIndex = "5";
  target.onclick = function() {
    checkCount[0] = 0;
    checkCount[1] = 0;
    //승진 가능 확인
    unit = promotion(unit, target, player);
    turn = 3 - turn;
    //죽은 유닛 삭제
    Units[2 - player][tarunit.number].alive = false;
    document.getElementById("ChessBoard").removeChild(tarunit);
    //플레이어 유닛 줄어듦
    if(player == 1) p2u -= 1;
    else p1u -= 1;
    //유닛 상태 바꾸고
    unit.style.gridColumn = tx + "";
    unit.style.gridRow = ty + "";
    unit.id = "unit" + tx + ty;
    //클릭 재설정
    unit = addView(unit, unit.className, player, tx, ty);
    //유닛 상태 변경
    Units[player - 1][unit.number].x = tx;
    Units[player - 1][unit.number].y = ty;
    //앙파상 불가능
    angpa = 0;
    changeAttackMap();
    //이동 화면 제거
    reset();
  }
  //배경 생성
  changeBackground(tx, ty, player);
}

//승진
function promotion(unit, target, player) {
  if(unit.className == "Pawn" && (target.style.gridRow[0] == "1" || target.style.gridRow[0] == "8")) {
    let changeTo = "";
    while(changeTo != "Rook" && changeTo != "Knight" && changeTo != "Bishop" && changeTo != "Queen") {
      changeTo = prompt('Rook or Knight or Bishop or Queen');
    }
    Units[player - 1][unit.number].job = changeTo;
    unit.className = changeTo;
    unit.src = "./img/" + changeTo + player + ".svg";
  } return unit;
}

function castling(x, y, player) {
  if(checkKingSideCastling(player)) {
    if(player == 1) {
      if(!checkMode && !checkCheck("move", player, x, y, x + 2, y))
      castleMove(x, y, x + 2, player);
    }
    else {
      if(!checkMode && !checkCheck("move", player, x, y, x - 2, y))
      castleMove(x, y, x - 2, player);
    }
  }
  if(checkQueenSideCastling(player)) {
    if(player == 1) {
      if(!checkMode && !checkCheck("move", player, x, y, x - 2, y))
      castleMove(x, y, x - 2, player);
    }
    else {
      if(!checkMode && !checkCheck("move", player, x, y, x + 2, y))
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
    turn = 3 - turn;

    if(tx > x) {
      //유닛 상태 바꾸고
      let rook = document.getElementById("unit" + 8 + y);
      rook.style.gridColumn = (tx - 1) + "";
      rook.id = "unit" + (tx - 1) + y;
      rook = addView(rook, "Rook", player, tx - 1, y);
      //유닛 상태 변경
      Units[player - 1][rook.number].x = tx - 1;
      //앙파상 불가능
      angpa = 0;
      changeAttackMap();
      //이동 화면 제거
      reset();
    } else {
      let rook = document.getElementById("unit" + 1 + y);
      rook.style.gridColumn = (tx + 1) + "";
      rook.id = "unit" + (tx + 1) + y;
      rook = addView(rook, "Rook", player, tx + 1, y);
      //유닛 상태 변경
      Units[player - 1][rook.number].x = tx + 1;
      //앙파상 불가능
      angpa = 0;
      changeAttackMap();
      //이동 화면 제거
      reset();
    }
    unit.style.gridColumn = tx + "";
    unit.id = "unit" + tx + y;
    unit = addView(unit, "King", player, tx, y);
    //유닛 상태 변경
    Units[player - 1][unit.number].x = tx;
    //앙파상 불가능
    angpa = 0;
    changeAttackMap();
    //이동 화면 제거
    reset();
    if(!checkCount[2 - player]) alert("체크메이트");
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
  let tarunit = document.getElementById("unit" + tx + y);
  let target = document.getElementById("front" + tx + ty);
  target.style.zIndex = "5";
  target.onclick = function() {
    turn = 3 - turn;
    Units[2 - player][tarunit.number].alive = false;
    document.getElementById("ChessBoard").removeChild(tarunit);
    if(player == 1) p2u -= 1;
    else p1u -= 1;
    //유닛 상태 바꾸고
    unit.style.gridColumn = tx + "";
    unit.style.gridRow = ty + "";
    unit.id = "unit" + tx + ty;
    //클릭 재설정
    unit = addView(unit, unit.className, player, tx, ty);
    //유닛 상태 변경
    Units[player - 1][unit.number].x = tx;
    Units[player - 1][unit.number].y = ty;
    //앙파상 불가능
    angpa = 0;
    changeAttackMap();
    //이동 화면 제거
    reset();
  }
  changeBackground(tx, ty, player);
}

//폰의 움직임
function addPawn(x, y, player) {
  //플레이어에 따라 방향이 바뀜
  const addNum = player == 1 ? 1 : -1;
  if(Math.floor(angpa / 100) == x - 1 || Math.floor(angpa / 100) == x + 1) {
    if(angpa % 10 != player) {
      if(Math.floor(angpa % 100 / 10) == y) {
        if(!checkMode && !checkCheck("angpa", player, x, y, x + 1, y + addNum))
        angpasang(x, y, Math.floor(angpa / 100) == x - 1 ? x - 1 : x + 1, y + addNum, player);
      }
    }
  }
  if (checkFull(player, x + 1, y + addNum) && checkEnemy(x + 1, y + addNum, player)) {
    if(!checkMode && !checkCheck("attack", player, x, y, x + 1, y + addNum))
      addAttack(player, x, y, (x + 1), (y + addNum));
  }
  if (checkFull(player, x - 1, y + addNum) && checkEnemy(x - 1, y + addNum, player)) {
    if(!checkMode && !checkCheck("attack", player, x, y, x - 1, y + addNum))
      addAttack(player, x, y, (x - 1), (y + addNum));
  }
  if (!checkFull(0, x, y + addNum)) {
    if(!checkMode && !checkCheck("move", player, x, y, x, y + addNum))
      addMove("Pawn", player, x, y, x, y + addNum);
    if ((y == 2 && player == 1) || ((y == 7) && player == 2)) {
      if (checkInfield(x, y + addNum) && !checkFull(0, x, y + 2 * addNum)) {
        if(!checkMode && !checkCheck("move", player, x, y, x, y + 2 * addNum))
          addMove("Pawn", player, x, y, x, y + 2 * addNum);
      }
    }
  }
}

function addLinear(name, x, y, xd, yd, player) {
  let px = x + xd;
  let py = y + yd;
  while(checkInfield(px, py)) {
    if(checkFull(player, px, py)) {
      if(checkEnemy(px, py, player)) {
        if(!checkMode && !checkCheck("attack", player, x, y, px, py)) {
          addAttack(player, x, y, px, py);
          changeBackground(px, py, player);
        }
      }
      break;
    }
    if(!checkMode && !checkCheck("move", player, x, y, px, py))
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
        if(checkFull(player, px, py)) {
          if(checkEnemy(px, py, player)) {
            if(!checkMode && !checkCheck("attack", player, x, y, px, py))
            addAttack(player, x, y, px, py);
          }
          continue;
        }
        if(!checkMode && !checkCheck("move", player, x, y, px, py))
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
        if (checkFull(player, px, py)) {
          if (checkEnemy(px, py, player)) {
          if(!checkMode && !checkCheck("attack", player, x, y, px, py))
            addAttack(player, x, y, px, py);
          }
          continue;
        }
        if(!checkMode && !checkCheck("move", player, x, y, px, py))
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

function checkFull(player, x, y) {
  if(player && checkInfield(x, y)) AttackMap[3 - player][x][y] = 1;
  let unit = document.getElementById("unit" + x + y);
  return !(unit == null || !Units[unit.owner - 1][unit.number].alive);
}

function checkEnemy(x, y, player) {
  return (document.getElementById("unit" + x + y).owner != player);
}

function isCheck() {
  let cnt = 0;
  if(AttackMap[1][Units[1][8].x][Units[1][8].y]) {
    cnt += 1;
  }
  if(AttackMap[2][Units[0][7].x][Units[0][7].y]) {
    cnt += 2;
  }
  return cnt;
}

function checkCheck(mode, player, x, y, tx, ty) {
  let checking = false;
  let unit;
  let target;
  switch (mode) {
    case "attack":
      unit = document.getElementById("unit" + x + y);
      target = document.getElementById("unit" + tx + ty);
      //유닛 상태 바꾸고
      unit.style.gridColumn = tx + "";
      unit.style.gridRow = ty + "";
      target.id = "temp";
      unit.id = "unit" + tx + ty;
      //유닛 상태 변경
      Units[player - 1][unit.number].x = tx;
      Units[player - 1][unit.number].y = ty;
      Units[2 - player][target.number].alive = false;
      checkMode = true;
      changeAttackMap();
      checkMode = false;
      if(player == 1) {
        if(isCheck() % 2) {
          checking = true;
        }
      } else if(player == 2) {
        if(isCheck() >= 2) {
          checking = true;
        }
      }
      unit.style.gridColumn = x + "";
      unit.style.gridRow = y + "";
      unit.id = "unit" + x + y;
      target.id = "unit" + tx + ty;
      //유닛 상태 변경
      Units[player - 1][unit.number].x = x;
      Units[player - 1][unit.number].y = y;
      Units[2 - player][target.number].alive = true;
      break;
    case "move":
      unit = document.getElementById("unit" + x + y);
      //유닛 상태 바꾸고
      unit.style.gridColumn = tx + "";
      unit.style.gridRow = ty + "";
      unit.id = "unit" + tx + ty;
      //유닛 상태 변경
      Units[player - 1][unit.number].x = tx;
      Units[player - 1][unit.number].y = ty;
      checkMode = true;
      changeAttackMap();
      checkMode = false;
      if(player == 1) {
        if(isCheck() % 2) {
          checking = true;
        }
      } else if(player == 2) {
        if(isCheck() >= 2) {
          checking = true;
        }
      }
      unit.style.gridColumn = x + "";
      unit.style.gridRow = y + "";
      unit.id = "unit" + x + y;
      //유닛 상태 변경
      Units[player - 1][unit.number].x = x;
      Units[player - 1][unit.number].y = y;
      break;
    case "angpa":
      unit = document.getElementById("unit" + x + y);
      target = document.getElementById("unit" + tx + y);
      //유닛 상태 바꾸고
      unit.style.gridColumn = tx + "";
      unit.style.gridRow = ty + "";
      target.id = "temp";
      unit.id = "unit" + tx + ty;
      //유닛 상태 변경
      Units[player - 1][unit.number].x = tx;
      Units[player - 1][unit.number].y = ty;
      Units[2 - player][target.number].alive = false;
      checkMode = true;
      changeAttackMap();
      checkMode = false;
      if(player == 1) {
        if(isCheck() % 2) {
          checking = true;
        }
      } else if(player == 2) {
        if(isCheck() >= 2) {
          checking = true;
        }
      }
      unit.style.gridColumn = x + "";
      unit.style.gridRow = y + "";
      unit.id = "unit" + x + y;
      target.id = "unit" + tx + y;
      //유닛 상태 변경
      Units[player - 1][unit.number].x = x;
      Units[player - 1][unit.number].y = y;
      Units[2 - player][target.number].alive = true;
      break;
    default:
      break;
  }
  if(!checking) checkCount[player - 1]++;
  return checking;
}
