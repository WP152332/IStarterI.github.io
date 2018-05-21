document.getElementById("Hambuger").onclick = function() {
  document.getElementById("Hambuger").style.visibility = "hidden";
  document.getElementById("SideBar").style.width = "280px";
  document.getElementById("SideContent").style.visibility = "visible";
}

document.getElementById("X").onclick = function() {
  document.getElementById("Hambuger").style.visibility = "visible";
  document.getElementById("SideBar").style.width = "70px";
  document.getElementById("SideContent").style.visibility = "hidden";
}
