canvas = document.getElementById('canvas');
context = canvas.getContext('2d');
canvas.width = 650;
canvas.height = 600;
selectedTeam = "Team 1"
eventType = "Shot";
var selectedNumber = document.getElementById("selectedNumber");
selectedNumber.value = 1;

let img = new Image();
img.onload = function(){
  w = canvas.width;
  nw = img.naturalWidth;
  nh = img.naturalHeight;
  aspect = nw/nh;
  h = canvas.width/aspect;
  canvas.height = h;
  context.drawImage(img, 0, 0, w, h);
  update();
 }

img.src = 'https://i.imgur.com/tRl1Xux.png';

class Circle {
  constructor(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }
}

circles = [];
function update(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0,canvas.width, canvas.height);
  for(var i=0; i<circles.length; i++){
    context.fillStyle = circles[i].color;
    let myCircle = new Circle(circles[i].x, circles[i].y, 5);
    myCircle.draw(context);
  }
} 

var teamButtons = document.getElementsByClassName("team-button");

var eventButtons = document.getElementsByClassName("event-button");

var changeEvent = function () {
  eventType = this.innerHTML;
};

for (var i = 0; i < eventButtons.length; i++) {
  eventButtons[i].onclick = changeEvent;
}


var addEventButton = function () {
  var buttonText = document.getElementById("add-event").value;
  var buttonHTML =
    '<button class="event-button" id="' +
    buttonText +
    '">' +
    buttonText +
    "</button>";
  document.getElementById("event-container").innerHTML += buttonHTML;
  for (var i = 0; i < eventButtons.length; i++) {
    eventButtons[i].onclick = changeEvent;
  }
};

var eventAdder = function (e) {
  var key = e.keyCode;

  if (key == 13) {
    addEventButton();
  }
};

var changeTeamName = function () {
  var team1Name = document.getElementById("add-team1-name").value;
  var team2Name = document.getElementById("add-team2-name").value;
  if (team1Name){
    document.getElementById("team1-button").innerText = team1Name;
  } 
  
  if (team2Name) {
  document.getElementById("team2-button").innerText = team2Name;
  }
};

var teamNameChanger = function (e) {
  var key = e.keyCode;

  if (key == 13) {
    changeTeamName();
  }
};

var changeTeam = function () {
  selectedTeam = this.innerHTML;
};

for (var i = 0; i < teamButtons.length; i++) {
  teamButtons[i].onclick = changeTeam;
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var table = document.getElementById("data-body");

canvas.addEventListener("click", function (evt) {
  var mousePos = getMousePos(canvas, evt);
  var contextCircle = canvas.getContext("2d");
  var row = table.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1)
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  cell1.innerHTML = selectedTeam;
  cell2.innerHTML = selectedNumber.value;
  cell3.innerHTML = eventType;
  cell4.innerHTML = Math.floor(mousePos.x);
  cell5.innerHTML = Math.floor(mousePos.y);
  cell6.innerHTML = '<button class="deleteBtn">X</button>';

  
  circles.push({
  x:mousePos.x, y:mousePos.y,
  color: "black"
  });
  
  if (selectedTeam == document.getElementById("team2-button").innerText) {
    circles[circles.length-1].color = "red";
  }
  update();
  
  document.getElementById(
    "table-container"
  ).scrollTop = document.getElementById("table-container").scrollHeight;
});

function onDeleteRow(e){
  if (!e.target.classList.contains('deleteBtn')){
  return;
  }
  const btn = e.target;
  btn.closest('tr').remove();
}

table.addEventListener('click',onDeleteRow)


function loadImage() {
        var input, file, fr;
        if (typeof window.FileReader !== 'function') {
            write("The file API isn't supported on this browser yet.");
            return;
        }
        input = document.getElementById('imgfile');
        if (!input) {
            write("Um, couldn't find the imgfile element.");
        }
        else if (!input.files) {
            write("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
            write("Please select a file before clicking 'Load'");
        }
        else {
            file = input.files[0];
            fr = new FileReader();
            fr.onload = createImage;
            fr.readAsDataURL(file);
        }
        function createImage() {
            img = new Image();
            img.onload = imageLoaded;
            source = fr.result;
            img.src = source;
        }
        function imageLoaded() {
            w = canvas.width
            nw = img.width;
            nh = img.height;
            aspect = nw/nh;
            h = canvas.width/aspect;
            canvas.height = h;
            context.drawImage(img,0,0, w, h);
            update();
            }

        function write(msg) {
            var p = document.createElement('p');
            p.innerHTML = msg;
            document.body.appendChild(p);
        }
    }

document.getElementById("undo").onclick = function () {
  var table = document.getElementById("data");
  if (table.rows.length > 1) {
    table.deleteRow(table.rows.length - 1);
  } 
  circles.pop();
  update();
};

document.getElementById("clear").onclick = function () {
  table.innerHTML = "";
  circles = [];
  update();
};

function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV file
  csvFile = new Blob([csv], { type: "text/csv" });

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // Create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Hide download link
  downloadLink.style.display = "none";

  // Add the link to DOM
  document.body.appendChild(downloadLink);

  // Click download link
  downloadLink.click();
}

function exportTableToCSV(filename) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cols.length-1; j++) row.push(cols[j].innerText);

    csv.push(row.join(","));
  }

  // Download CSV file
  downloadCSV(csv.join("\n"), 'events.csv');
}


