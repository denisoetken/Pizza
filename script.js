/**
 * Created by Denis on 09.07.2017.
 */

var belegeDiv = document.getElementById('belegeDiv');
var belegeStrings = ['Chorizowurst', 'Oliven', 'Salami', 'Chamipgnons', 'Thunfisch', 'Artischocken', 'Zwiebeln'];
var ausgewaehlterKaese = "";
var ausgewaehlteBelege = [];
var pizzaSize = 28;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bestellen = document.getElementById('bestellen');
var letztePizza = document.getElementById('letztePizza');
// var salami = document.getElementById('salami');

if (document.cookie) {
    if (getCookie("pizzaSize") != "")
        pizzaSize = getCookie("pizzaSize");
    if (getCookie("ausgewaehlteBelege") != "")
        ausgewaehlteBelege = JSON.parse(getCookie("ausgewaehlteBelege"));
    if (getCookie("ausgewaehlterKaese") != "")
        ausgewaehlterKaese = getCookie("ausgewaehlterKaese");
}
createBelege();

function createBelege() {
    let string = "<table>";
    for (let i = 0; i < belegeStrings.length / 2; i++) {
        string += "<tr>";
        for (let j = 0; j < 2; j++) {
            if (belegeStrings[2 * i + j] != null) {
                string += "<td><input type='checkbox' name='belege' value='" + belegeStrings[2 * i + j] + "'>" + belegeStrings[2 * i + j]
            }
        }
        string += "</tr>";
    }
    string += "</table>";
    belegeDiv.innerHTML = string;
}
var kaese = document.getElementsByName('kaese');
for (let auswahl of kaese) {
    if (auswahl.value === ausgewaehlterKaese) {
        auswahl.checked = true;
    }
    auswahl.addEventListener('change', function () {
        setCheckedKaese();
        refreshCanvas();
    });
}

function setCheckedKaese() {
    for (let auswahl of kaese) {
        if (auswahl.checked) {
            ausgewaehlterKaese = auswahl.value;
            document.cookie = "ausgewaehlterKaese=" + ausgewaehlterKaese;
        }
    }
}

var belege = document.getElementsByName('belege');
for (let auswahl of belege) {
    if (ausgewaehlteBelege.includes(auswahl.value)) {
        auswahl.checked = true;
    }
    auswahl.addEventListener('change', function () {
        setCheckedBelege();
        refreshCanvas();

    })
}

function setCheckedBelege() {
    ausgewaehlteBelege.length = 0;
    for (let auswahl of belege) {
        if (auswahl.checked) {
            ausgewaehlteBelege.push(auswahl.value);
            document.cookie = "ausgewaehlteBelege=" + JSON.stringify(ausgewaehlteBelege);
        }
    }
}

var groesse = document.getElementById('groesse');
var groessenDisplay = document.getElementById('groessenDisplay');
groesse.value = pizzaSize;
groessenDisplay.innerHTML = pizzaSize;
groesse.addEventListener('change', function () {
    pizzaSize = groesse.value;
    groessenDisplay.innerHTML = pizzaSize;
    refreshCanvas();
    document.cookie = "pizzaSize=" + pizzaSize;
})
refreshCanvas();

function refreshCanvas() {
    // "leeren":
    canvas.width = canvas.width;
    //Pizza:
    ctx.beginPath();
    ctx.fillStyle = "#F1E514";
    ctx.beginPath();
    // x,y,Radius, Startwinkel, EndWinkel, Umfang/Laenge
    ctx.arc(400 / 2, 400 / 2, pizzaSize * 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    //Belege:
    if (ausgewaehlteBelege.length > 0) {
        for (let i = 0; i < ausgewaehlteBelege.length; i++) {
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.font = '32px monospace';
            if (ausgewaehlteBelege[i] != "Salami") {
                ctx.fillText(ausgewaehlteBelege[i], 200, 100 + i * 35);
            } else {
                ctx.drawImage(salami, 100, 200, 50, 50);
                ctx.drawImage(salami, 150, 120, 50, 50);
                ctx.drawImage(salami, 230, 200, 50, 50);
                ctx.drawImage(salami, 250, 140, 50, 50);
            }
        }
    }
//    Kaese
    if (ausgewaehlterKaese != "") {
        ctx.beginPath();
        let kaeseSorten = {"gouda": "253,255,9,0.5", "mozzarella": "255,255,255,0.5", "emmentaler": "254,255,130,0.5"};
        ctx.fillStyle = 'rgba(' + kaeseSorten[ausgewaehlterKaese] + ')';
        ctx.beginPath();
        ctx.arc(400 / 2, 400 / 2, pizzaSize * 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == '') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

bestellen.addEventListener('click', function () {
    let pizza = {
        "pizzaSize": pizzaSize,
        "ausgewaehlterKaese": ausgewaehlterKaese,
        "ausgewaehlteBelege": ausgewaehlteBelege,
    };
    fetch("server.php", {
        method: "post",
        body: JSON.stringify(pizza)
    }).then(
        resp => resp.json()
    ).then(
        ausgabe=> {
            console.log(ausgabe);
            let gesamtBetrag = Number(ausgabe.pizzaSize[pizzaSize]) + ausgabe.ausgewaehlteBelege[pizzaSize] + Number(ausgabe.ausgewaehlterKaese[ausgewaehlterKaese]);
            letztePizza.innerHTML = "<h2>Kassenbon</h2>";
            letztePizza.innerHTML += "Ihre Bestellung: <br>";
            letztePizza.innerHTML += pizza.pizzaSize + "cm mit " + pizza.ausgewaehlterKaese + " mit:";
            letztePizza.innerHTML += "<ul>";
            for (let i = 0; i < pizza.ausgewaehlteBelege.length; i++) {
                letztePizza.innerHTML += "<li>" + pizza.ausgewaehlteBelege[i];
            }
            letztePizza.innerHTML += "zum Preis von: " + gesamtBetrag + " €";
        }
    )
})