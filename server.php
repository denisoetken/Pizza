<?php
/**
 * Created by IntelliJ IDEA.
 * User: Denis
 * Date: 09.07.2017
 * Time: 21:17
 */

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $eingabeInformationen = $_GET['Information'];
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $eingabeInformationen = file_get_contents("php://input");
    file_put_contents("bestellungen.txt", $eingabeInformationen . "\n", FILE_APPEND);
    $bestellung = json_decode($eingabeInformationen, true);
    $preise = json_decode(file_get_contents("preise.json"), true);
    foreach ($preise["pizzaSize"] as $key => $value) {
        if ($bestellung["pizzaSize"] != $key) {
            unset($preise["pizzaSize"][$key]);
        }
    }
    foreach ($preise["ausgewaehlteBelege"] as $key => $value) {
        if ($bestellung["pizzaSize"] != $key) {
            unset($preise["ausgewaehlteBelege"][$key]);
        } else {
            $preise["ausgewaehlteBelege"][$key] *= count($bestellung["ausgewaehlteBelege"]);
        }
    }
    foreach ($preise["ausgewaehlterKaese"] as $key => $value) {
        if ($bestellung["ausgewaehlterKaese"] != $key) {
            unset($preise["ausgewaehlterKaese"][$key]);
        }
    }
    echo json_encode($preise);
}
