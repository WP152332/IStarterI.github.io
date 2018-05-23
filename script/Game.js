var CharacterX = 2;

var Map = [];

for(var i = 0; i < 5; i++) {
  var tempM = [];
  for(var j = 0; j < 7; j++) {
    tempM.push(0);
    var div = document.createElement('div');
    div.id = "Map" + i + j;
    var x = i + 1;
    var y = j + 1;
    div.style.gridColumn = x + "";
    div.style.gridRow = y + "";
    document.getElementById('GameBoard').appendChild(div);
  }
  Map.push(tempM);
}
document.getElementById("Map" + CharacterX + "6").style.background = "Red";

setInterval(function() {
  var EneCnt = Math.floor(Math.random() * 5) + 1;
  while(EneCnt == 6) EneCnt = Math.floor(Math.random() * 5) + 1;
  var result = [];
  for(var x = 0; x < 5; x++) {
    for(var c = 1; c < 6; c++) {
     Map[x][c] = Map[x][c - 1]; 
     var color;
     switch(Map[x][0]) {
      case 0: color = "none"; break;
      case 1: color = "red"; break;
      case 2: color = "yellow"; break;
      case 3: color = "green"; break;
     }
    document.getElementById("Map" + x + 0).style.background = color;
    }
    Map[x][0] = Math.floor(Math.random() * 4);
    while(Map[x][0] == 4) Map[x][0] = Math.floor(Math.random()*4);
    var color;
    switch(Map[x][0]) {
      case 0: color = "none"; break;
      case 1: color = "red"; break;
      case 2: color = "yellow"; break;
      case 3: color = "green"; break;
    }
    document.getElementById("Map" + x + 0).style.background = color;
  }
}, 500);

function keycheck(evt){
    var keyCode = evt.keyCode;
    if(keyCode == 37) Left();
    if(keyCode == 39) Right();
    if(keyCode == 38) Up();
}

function Left() {
  if(CharacterX > 0) Move(-1);
}

function Right() {
  if(CharacterX < 4) Move(1);
}

function Up() {
  Move(0);
}

function Move(Direction) {
  document.getElementById("Map" + CharacterX + "6").style.background = "none";
  CharacterX += Direction;
  document.getElementById("Map" + CharacterX + "6").style.background = "Red";
}
