var CharacterX = 2;
var Score = 0;
var Bullet = 10;
var Map = [];
var BulletM = [];
var color = ["none", "none", "none", "none", "none", "none", "red", "yellow", "green", "black"];
var Time = 0;
var SpeedUp = 0;
var CharacterColor = "white";
var Ghost = 0;

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
    div.style.backgroundSize = "cover";
    document.getElementById('GameBoard').appendChild(div);
  }
  Map.push(tempM);
  BulletM.push(tempBM);
}
document.getElementById("Map" + CharacterX + "6").style.background = CharacterColor;

setInterval(function() {
  Time++;
  if(Map[CharacterX][6] > 5 && Ghost == 0) {
    alert('앙 주금');
    CharacterX = -100;
    window.location.reload();
  }
  if(Ghost > 0) Ghost--;
  if(Time % (Math.max(50,(100 - Score / 50 - SpeedUp))) == 0) {
    for(var x = 0; x < 5; x++) {
      for(var y = 6; y > 0; y--) {
       Map[x][y] = Map[x][y - 1];
       if(Map[x][y] != -1)
          document.getElementById("Map" + x + y).style.background = color[Map[x][y]];
       else {
         document.getElementById("Map" + x + y).style.background = "orange";
       }
      }
      var Random = Math.floor(Math.random() * 10);
      if(Random != 0) {
        Map[x][0] = Random;
      }
      else {
        switch (Math.floor(Math.random() * 50)) {
          case 0:
          case 1:
          case 2:
          case 3: Map[x][0] = -1; break;
          default: Map[x][0] = 1; break;
        }
      }
      if(Map[x][y] != -1)
        document.getElementById("Map" + x + y).style.background = color[Map[x][y]];
      else {
        document.getElementById("Map" + x + y).style.background = "orange";
      }
    }
    Bullet += 1;
    document.getElementById("Map" + CharacterX + "6").style.background = CharacterColor;
    Time = 0;
  }
}, 1);

setInterval(function() {
  document.getElementById("GameInform").innerHTML
  = "Score : " + Score + "<br>Bullet : " + Bullet + "<br>SpeedUp : " + SpeedUp  + "<br>Ghost : " + Ghost;
  for(var x = 0; x < 5; x++) {
    for(var y = 0; y < 6; y++) {
      BulletM[x][y] = BulletM[x][y + 1];
      BulletM[x][y + 1] = 0;
      if(BulletM[x][y]) {
        document.getElementById("Map" + x + y).style.background = "grey";
        document.getElementById("Map" + x + (y + 1)).style.background = "none";
        document.getElementById("Map" + CharacterX + "6").style.background = CharacterColor;

        if(Map[x][y] == -1) {
          BulletM[x][y] = 0;
          Map[x][y] = 0;
          document.getElementById("Map" + x + y).style.background = "none";
          document.getElementById("Map" + x + (y + 1)).style.background = "none";
          document.getElementById("Map" + CharacterX + "6").style.background = CharacterColor;
          ItemUse(Math.floor(Math.random() * 5));
          return;
        }

        else if(Map[x][y] > 5) {
          BulletM[x][y] = 0;
          Map[x][y] -= 1;
          document.getElementById("Map" + x + y).style.background = color[Map[x][y]];
          document.getElementById("Map" + x + (y + 1)).style.background = "none";
          document.getElementById("Map" + CharacterX + "6").style.background = CharacterColor;
          Score += 50;
          return;
        }

        else if(Map[x][y - 1] == -1) {
          BulletM[x][y] = 0;
          Map[x][y - 1] = 0;
          document.getElementById("Map" + x + y).style.background = "none";
          document.getElementById("Map" + x + (y - 1)).style.background = "none";
          document.getElementById("Map" + CharacterX + "6").style.background = CharacterColor;
          Score += 50;
          ItemUse(Math.floor(Math.random() * 5));
          return;
        }

        else if(Map[x][y - 1] > 5) {
          BulletM[x][y] = 0;
          Map[x][y - 1] -= 1;
          document.getElementById("Map" + x + y).style.background = "none";
          document.getElementById("Map" + x + (y - 1)).style.background = color[Map[x][y - 1]];
          document.getElementById("Map" + CharacterX + "6").style.background = CharacterColor;
          Score += 50;
          return;
        }

        else if(y == 0)
        document.getElementById("Map" + x + y).style.background = "none";
      }
    }
  }
}, 50);

function keycheck(evt){
    var keyCode = evt.keyCode;
    if(keyCode == 38) Up();
    if(keyCode == 37) Left();
    if(keyCode == 39) Right();
    if(keyCode == 32) SpeedUp += 5;
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
  document.getElementById("Map" + CharacterX + "6").style.background = CharacterColor;
}

function ItemUse(Option) {
  switch (Option) {
    case 0: Bullet += 50; break;
    case 1: SpeedUp += 20; break;
    case 2: SpeedUp -= 20; break;
    case 3:
      if(CharacterColor=="none") CharacterColor = "white";
      else CharacterColor = "none"; break;
    default: Ghost = 1000; break;

  }
}
