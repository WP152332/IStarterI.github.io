window.onload = function() {
  document.getElementById("Side").innerHTML =
    '<span id="Hambuger" class="icon fa fa-bars"></span> ' +
    '<a href="main.html"><span id="Home" class="icon fas fa-home"></span></a>' +
    '<a href="Me.html"><span id="User" class="icon fas fa-user-alt"></span></a>' +
    '<a href="One.html"><span id="One" class="icon fas fa-dice-one"></span></a>' +
    '<a href="Two.html"><span id="Two" class="icon fas fa-dice-two"></span></a>' +
    '<a href="Three.html"><span id="Three" class="icon fas fa-dice-three"></span></a>' +
    '<a><span class="icon" style="height:90px; cursor:default"></span></a>'+
    '<a href="https://github.com/IStarterI/"><span id="Git" class="icon fab fa-github"></span></a>' +
    '<a href="https://www.facebook.com/profile.php?id=100011013164003"><span id="Facebook" class="icon fab fa-facebook"></span></a>' +
    '<a href="https://www.instagram.com/qkdwl462/"><span id="Instagram" class="icon fab fa-instagram"></span></a>' +
    '<div id="SideBar">' +
    '  <div id="SideContent">' +
    '    <div id="ExplainContent">' +
    '      <a href="main.html">처음 화면으로</a>' +
    '      <a href="Me.html">개발자 정보</a>' +
    '      <a href="One.html">고등학교 1학년 시절</a>' +
    '      <a href="Two.html">고등학교 2학년 시절</a>' +
    '      <a href="Three.html">고등학교 3학년 시절</a>' +
    '      <a style="height:70px"></a>' +
    '      <a href="https://github.com/IStarterI">깃허브 바로가기</a>' +
    '      <a href="https://www.facebook.com/profile.php?id=100011013164003">페이스북 바로가기</a>' +
    '      <a href="https://www.instagram.com/qkdwl462">인스타그램 바로가기</a>' +
    '    </div>' +
    '    <div id="XContent">' +
    '      <span id="X" class="icon fas fa-times"></span>' +
    '    </div>' +
    '  </div>' +
    '</div>' +
    '<script type="text/javascript" src="./script/Main.js"></script>';

    var SNS = document.getElementsByClassName("fab");

    document.getElementById("Hambuger").onclick = function() {
      document.getElementById("Hambuger").style.visibility = "hidden";
      document.getElementById("SideBar").style.width = "280px";
      document.getElementById("SideContent").style.visibility = "visible";
      for(var i = 0; i < SNS.length; i++) {
         var S = SNS[i];
         S.style.visibility = "visible";
      }
      document.getElementById("ExplainContent").style.display = "block";
    }

    document.getElementById("X").onclick = function() {
      document.getElementById("Hambuger").style.visibility = "visible";
      document.getElementById("SideBar").style.width = "70px";
      document.getElementById("SideContent").style.visibility = "hidden";
      for(var i = 0; i < SNS.length; i++) {
	       var S = SNS[i];
	       S.style.visibility = "hidden";
      }
      document.getElementById("ExplainContent").style.display = "none";
    }
}
