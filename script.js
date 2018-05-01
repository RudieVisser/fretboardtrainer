var displayNotes = new Array("C", "Csharp", "Db", "D", "Dsharp", "Eb", "E", "F",
    "Fsharp", "Gb", "G", "Gsharp", "Ab", "A", "Asharp", "Bb", "B");
var notes = new Array("C", "Csharp/Db", "D", "Dsharp/Eb", "E", "F",
    "Fsharp/Gb", "G", "Gsharp/Ab", "A", "Asharp/Bb", "B");
var strings = {E: "13px", A: "36px", D: "61px", G: "86px", B: "110px", e: "134px"};

var activeString = null;
var activeNote = null;

var stringImg = $(".string")[0];
$(stringImg).mousedown(checkAnswer);

var score = 0;

function random(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function randomObjElem (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
}

function getObjKeyByValue(obj, value) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
             if(obj[prop] === value)
                return prop;
        }
    }
}

function randomNote(oldVal) {
    var val = displayNotes[random(0, displayNotes.length)];
    while (oldVal == val) {
        val = displayNotes[random(0, displayNotes.length)];
    }
    return val;
}

function randomString(oldVal) {
    var val = randomObjElem(strings);
    while (oldVal == val) {
        val = randomObjElem(strings);
    }
    return val;
}

function updateNote() {
    activeNote = randomNote(activeNote);
    activeString = randomString(activeString);

    $(".note").text(activeNote.replace("sharp", "#"));
    $(".string").css("bottom", activeString);
}

function findPosition(oElement) {
    if (typeof(oElement.offsetParent) != "undefined") {
        for(var posX = 0.0, posY = 0.0; oElement; oElement = oElement.offsetParent) {
            posX += oElement.offsetLeft;
            posY += oElement.offsetTop;
        }
        return [posX, posY];
    } else {
        return [oElement.x, oElement.y];
    }
}

function getCoordinates(e) {
    var PosX = 0.0;
    var PosY = 0.0;
    var ImgPos;
    ImgPos = findPosition(stringImg);
    if (!e)
        var e = window.event;
    if (e.pageX || e.pageY) {
        PosX = e.pageX;
        PosY = e.pageY;
    } else if (e.clientX || e.clientY) {
        PosX = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }
    PosX = PosX - ImgPos[0];
    PosY = PosY - ImgPos[1];

    return {X: PosX, Y: PosY};
}

function checkAnswer(e) {
    var coords = getCoordinates(e.originalEvent);
    var fret =  getFret(coords.X);
    var note = getNote(fret);
    var possibilities = note.split("/");

    var correct = false;
    for (var i = 0; i < possibilities.length; i++) {
        if (possibilities[i] == activeNote)
            correct = true;
    }

    if (correct) {
        score++;

        $("#score").text(score);
        $(".answer").stop(true, true).show().css("color", "#00f700").text("Good");
        setTimeout(function() {
            $(".answer").fadeOut(500);
        }, 500);
        updateNote();
    } else {
        if (score != 0)
            score--;

        $("#score").text(score);
        $(".answer").stop(true, true).show().css("color", "#ff1f1f").text("Wrong");
        setTimeout(function() {
            $(".answer").fadeOut(500);
        }, 500);
    }
}

function getFret(x) {
    var fretboardWidth = $(".fretboard-grid").width();
    var fretWidth = fretboardWidth / 12;

    var fretEnds = new Array();
    for (var i = 1; i <= 12; i++) {
        fretEnds.push(i * fretWidth);
    }

    var fret;
    for (var i = 0; i < fretEnds.length; i++) {
        if (x >= (i == 0 ? 0 : fretEnds[(i - 1)]) && x <= fretEnds[i])
            fret = i;
    }

    return fret;
}

function getNote(fret) {
    var string = getObjKeyByValue(strings, activeString).toUpperCase();
    var openNoteIndex = notes.indexOf(string) + 1;
    var noteOrdered = notes.slice(openNoteIndex).concat(notes.slice(0, openNoteIndex));

    return noteOrdered[fret];
}

var timer;
function startGame() {
    score = 0;
    clearInterval(timer);
    $("#score").text(score);
    $(".scoreboard").show();
    $(".fretboard-grid").show();
    $(".note").show();
    $(".restart").hide();
    $(".end-game").hide();

    $(".note").text("Prepare!");
    $(".time-remaining").html("100");
    setTimeout(function() {
        startGameTimer();
        updateNote();
        if (!$(".string").is(":visible"))
            $(".string").show();

        $(".restart").show();
    }, 2000);
}

function startGameTimer() {
    countDown(99, function(){
        endGame();
    });
}

function countDown(i, callback) {
    timer = setInterval(function() {
        $(".time-remaining").html(i);
        i-- || (clearInterval(timer), callback());
    }, 1000);
}

function endGame() {
    $(".scoreboard").hide();
    $(".fretboard-grid").hide();
    $(".note").hide();

    $("#finalscore").text(score);
    $(".end-game").show();
}
