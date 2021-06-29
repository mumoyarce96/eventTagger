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

events = [];
function update(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0,canvas.width, canvas.height);
  for(var i=0; i<events.length; i++){
    context.fillStyle = events[i].color;
    if (events[i].type == "single") {
      let myCircle = new Circle(events[i].x, events[i].y, 3);
      myCircle.draw(context);
    } else {
      context.beginPath();
      context.strokeStyle = events[i].color;
      context.moveTo(events[i].x, events[i].y);
      context.lineTo(events[i].xEnd, events[i].yEnd);
      context.stroke();
      let myCircle = new Circle(events[i].xEnd, events[i].yEnd, 3);
      myCircle.draw(context);
    }
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

canvas.addEventListener("mousedown", function (evt) {
  mouseDownPos = getMousePos(canvas, evt);
   
});


function onDeleteRow(e){
  if (!e.target.classList.contains('deleteBtn')){
  return;
  }
  const btn = e.target;
  btn.closest('tr').remove();
}

canvas.addEventListener('mouseup', function (evt){
    var row           = table.insertRow(-1);
    var teamCell      = row.insertCell(0);
    var numberCell    = row.insertCell(1);
    var eventCell     = row.insertCell(2);
    var xCell         = row.insertCell(3);
    var yCell         = row.insertCell(4);
    var x1Cell        = row.insertCell(5);
    var y1Cell        = row.insertCell(6);
    var deleteRowCell = row.insertCell(7);
    var mouseUpPos    = getMousePos(canvas,evt);
    console.log(getDistance(mouseDownPos, mouseUpPos))
    var color = "black"
    if (selectedTeam == document.getElementById("team2-button").innerText) {
      color = "red";
    }
    

    if (getDistance(mouseDownPos, mouseUpPos)>1){
        events.push({
          type: "double",
          x:mouseDownPos.x, y:mouseDownPos.y,
          xEnd: mouseUpPos.x, yEnd: mouseUpPos.y,
          color: color,
        })
        update();
        x1Cell.innerHTML = mouseUpPos.x;
        y1Cell.innerHTML = mouseUpPos.y; 
    
    } else {
      events.push({
        type: "single",
        x:mouseDownPos.x, y:mouseDownPos.y,
        color: color
      });
      update();
    }
    
    
    teamCell.innerHTML = selectedTeam;
    numberCell.innerHTML = selectedNumber.value;
    eventCell.innerHTML = eventType;
    xCell.innerHTML = Math.floor(mouseDownPos.x);
    yCell.innerHTML = Math.floor(mouseDownPos.y);
    deleteRowCell.innerHTML = '<button class="deleteBtn">X</button>';
})

table.addEventListener('click',onDeleteRow)

function getDistance(pos1, pos2){
  return Math.sqrt((pos1.x-pos2.x)**2+(pos1.y-pos2.y)**2)
}

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
  events.pop();
  update();
};

document.getElementById("clear").onclick = function () {
  table.innerHTML = "";
  events = [];
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


