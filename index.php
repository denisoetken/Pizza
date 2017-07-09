<?php
/**
 * Created by IntelliJ IDEA.
 * User: Denis
 * Date: 09.07.2017
 * Time: 19:43
 */
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Pizza Editor</title>
    <style>
        canvas {
            border: 1px solid black;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        #bestellung {
            float: left;
            margin-left: 20%;
        }

        #letztePizza {
            float: right;
            margin-right: 20%;;
        }
    </style>
</head>
<body>
<h1>Pizza Editor</h1>
<canvas width="400" height="400" id="canvas"></canvas>
<br>
<div id="bestellung">
    <h2>Bestellung</h2>
    <form action="">
        <input type="radio" name="kaese" value="gouda">Gouda
        <input type="radio" name="kaese" value="mozzarella">Mozzarella
        <input type="radio" name="kaese" value="emmentaler">Emmentaler
        <br>
        <!--Pizzagröße 24, 28 oder 32-->
        <input type="range" min="24" max="32" value="28" step="4" id="groesse">
        <span id="groessenDisplay">28</span><br>
        <div id="belegeDiv"></div>
        <button type="button" id="bestellen">Bestellen</button>
    </form>
</div>
<div id="letztePizza"><h2>Kassenbon</h2></div>

<!--<img src="salami.png" style="display: none" id="salami">-->
<script src="script.js"></script>
</body>
</html>
