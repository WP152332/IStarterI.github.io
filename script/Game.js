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
    Map[x][0] = 0;
    document.getElementById("Map" + x + 0).style.background = "none";
  }
  for(var x = 0; x < EneCnt; x++) {
    var a = Math.floor(Math.random() * 5);
    while(a == 6 || result.indexOf(a) != -1)
    a = Math.floor(Math.random() * 5);
    result.push(a);
    Map[a][0] = 1;
    document.getElementById("Map" + a + 0).style.background = "green";
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
