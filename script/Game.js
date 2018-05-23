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
  for(var x = 0; x < 5; x++) {
    for(var c = 5; c > 0; c--) {
     Map[x][c] = Map[x][c - 1]; 
     var color;
     switch(Map[x][c]) {
       case 0:
       case 1:
       case 2: color = "none"; break;
       case 3: color = "red"; break;
       case 4: color = "yellow"; break;
       case 5: color = "green"; break;
     }
    document.getElementById("Map" + x + c).style.background = color;
    }
    Map[x][0] = Math.floor(Math.random() * 6);
    while(Map[x][0] == 6) Map[x][0] = Math.floor(Math.random()*6);
    var color;
    switch(Map[x][0]) {
       case 0:
       case 1:
       case 2: color = "none"; break;
       case 3: color = "red"; break;
       case 4: color = "yellow"; break;
       case 5: color = "green"; break;
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
