var CharacterX = 2;
var Score = 0;
var Bullet = 10;
var Map = [];
var BulletM = [];
var color = ["none", "none", "none", "none", "none", "none", "red", "yellow", "green", "black"];
var Time = 0;

for(var i = 0; i < 5; i++) {
  var tempM = [];
  var tempBM = [];
  for(var j = 0; j < 7; j++) {
    tempM.push(0);
    tempBM.push(0);
    var div = document.createElement('div');
    div.id = "Map" + i + j;
    var x = i + 1;
    var y = j + 1;
    div.style.gridColumn = x + "";
    div.style.gridRow = y + "";
    document.getElementById('GameBoard').appendChild(div);
  }
  Map.push(tempM);
  BulletM.push(tempBM);
}
document.getElementById("Map" + CharacterX + "6").style.background = "white";

setInterval(function() {
  Time++;
  if(Map[CharacterX][6] > 5) {
    alert('앙 주금');
    window.open('about:blank','_self').self.close();
  }
  if(Time % (Math.max(25,(120 - Score / 100))) == 0) {
    for(var x = 0; x < 5; x++) {
      for(var y = 6; y > 0; y--) {
       Map[x][y] = Map[x][y - 1];
       document.getElementById("Map" + x + y).style.background = color[Map[x][y]];
      }
      Map[x][0] = Math.floor(Math.random() * 10);
      document.getElementById("Map" + x + y).style.background = color[Map[x][y]];
    }
    Bullet += 1;
    document.getElementById("Map" + CharacterX + "6").style.background = "white";
    Time = 0;
  }
}, 1);

setInterval(function() {
  document.getElementById("GameInform").innerHTML
  = "Score : " + Score + "<br>Bullet : " + Bullet;
  for(var x = 0; x < 5; x++) {
    for(var y = 0; y < 6; y++) {
      BulletM[x][y] = BulletM[x][y + 1];
      BulletM[x][y + 1] = 0;
      if(BulletM[x][y]) {
        document.getElementById("Map" + x + y).style.background = "grey";
        document.getElementById("Map" + x + (y + 1)).style.background = "none";
        document.getElementById("Map" + CharacterX + "6").style.background = "white";
      }
      if(BulletM[x][y] && Map[x][y] > 5) {
        BulletM[x][y] = 0;
        Map[x][y] -= 1;
        document.getElementById("Map" + x + y).style.background = color[Map[x][y]];
        document.getElementById("Map" + x + (y + 1)).style.background = "none";
        document.getElementById("Map" + CharacterX + "6").style.background = "white";
        Score += 50;
      }
      if(BulletM[x][y] && Map[x][y + 1] > 5) {
        BulletM[x][y] = 0;
        Map[x][y] -= 1;
        document.getElementById("Map" + x + y).style.background = "none";
        document.getElementById("Map" + x + (y + 1)).style.background = color[Map[x][y + 1]];
        document.getElementById("Map" + CharacterX + "6").style.background = "white";
        Score += 50;
      }
      if(y == 0 && BulletM[x][y])
      document.getElementById("Map" + x + y).style.background = "none";
    }
  }
}, 25);

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
  if(Bullet > 0) {
    BulletM[CharacterX][6] = 1;
    Bullet -= 1;
  }
}

function Move(Direction) {
  document.getElementById("Map" + CharacterX + "6").style.background = "none";
  CharacterX += Direction;
  document.getElementById("Map" + CharacterX + "6").style.background = "white";
}
