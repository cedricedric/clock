/*global window, console*/
(function () {
    "use strict";
    /*** variables "globales" (IIFE) ***/
    var nbSecFrom0 = 0;
    var clockInterval;
    /*** les fonctions du script (les utilisées avant celles qui les utilisent) ***/
    /* La fonction fRotateElement effectue une rotation horaires de rot
    (paramètre) degrés sur un élément el (paramètre) .
        -paramètres :
            -el : l'élément à faire touner
            - rot : le nombre de degrés pour la rotation de l'élément
        -retour: /
    */
    var fRotateElement = function (el, rot) {
        el.style.setProperty("transform", "rotate(" + rot + "deg)", "");

    };
    /* La fonction fSetHMS règle 3 inputs de type number (3 paramètres inH, inM et inS) en fonction du nombre de secondes écoulées depuis minuit (paramètre)
        - paramètres :
            - inH : l'input de type number qui recevra les heures en fonction de nbSFrom0
            - inM : l'input de type number qui recevra les minutes en fonction de nbSFrom0
            - inS : l'input de type number qui recevra les secondes en fonction de nbSFrom0
            - nbSFrom0 : le nombre de secondes écoulées depuis minuit
            - retour : /
    */
    var fSetHMS = function (inH, inM, inS, nbSFrom0) {
        inS.value = nbSFrom0 % 60;
        inM.value = Math.floor(nbSFrom0 / 60) % 60;
        inH.value = Math.floor(nbSFrom0 / 3600);
    };

    /* La fonction fSetClocl règle les aiguilles de l'horloge( 3 paramètres hNeedle, mNeedle et sNeedle) en fonction du nombre de secondes ( paramètre nbsFrom) écoulées deouis minuit

     La rotation de hNeedle( paramètre) correspond au nombre réel d'heures contenues dans nbSFrom0.

     La rotation de mNeedle( paramètre) correspond au nombre réel de minutes contenues dans nbSFrom0.

     La rotation de sNeedle( paramètre) correspond au nombre réel de secondes contenues dans nbSFrom0.

     -paramètres :
        -hNeedle : le div pour l'aiguille des heures
        -mNeedle : le div pour l'aiguille des minutes
        -sNeedle : le div pour l'aiguille des secondes
        -nbSFrom0 : le nombre de secondes écoulées depuis minuit
    - retour : /
    */
    var fSetClock = function (hNeedle, mNeedle, sNeedle, nbSFrom0) {
        //console.log(hNeedle, mNeedle, sNeedle, nbSFrom0);
        fRotateElement(sNeedle, nbSFrom0 * 6);
        fRotateElement(mNeedle, nbSFrom0 * 0.1);
        fRotateElement(hNeedle, nbSFrom0 / 120);
    };
    /* La fonction fDisplayNewTime, règle l'affichage de l'heure sous ses
         diverses formes, en fonction du nombre de secondes écoulées depuis minuit
            (paramètre NbSFrom0). Cette fonction va :
        1) régler les aiguilles de l'horloge (3 paramètres hNeedle, mNeedle et
            sNeedle) (affichage de l'heure version aiguilles)
        2) régler 3 inputs de type number (3 paramètres inH, inM et inS) (affichage
            de l'heure version chiffres)
            - paramètres :
                - hNeedle : le div pour l'aiguille des heures
                - mNeedle : le div pour l'aiguille des minutes
                - sNeedle : le div pour l'aiguille des secondes
                - inH : l'input de type number qui recevra les heures en fonction de
                    nbSFrom0
                - inM : l'input de type number qui recevra les minutes en fonction
                    de nbSFrom0
                - inS : l'input de type number qui recevra les secondes en fonction
                    de nbSFrom0
                - nbSFrom0 : le nombre de secondes écoulées depuis minuit
                - retour : /
    */
    var fDisplayNewTime = function (hNeedle, mNeedle, sNeedle, inH, inM, inS, nbSFrom0) {
        fSetClock(hNeedle, mNeedle, sNeedle, nbSFrom0);
        fSetHMS(inH, inM, inS, nbSFrom0);
    };

    /* La fonction f1Tick fait (à chaque appel d'un timer) avancer d'une unité le nombre de secondes (variable globale nbSecFrom0) écoulées depuis minuit puis utilise la fonction fDisplayNewTime pour régler l'horloge (version aiguilles et numériques) sur ce nouveau nombre de secondes.
            - paramètres : /
            - retour : /
            86399

    */
    var f1Tick = function () {
        nbSecFrom0 = (nbSecFrom0 + 1) % 86400;
        fDisplayNewTime(document.getElementById("hours"), document.getElementById("minutes"), document.getElementById("seconds"), document.getElementById("hour"), document.getElementById("min"), document.getElementById("sec"), nbSecFrom0);
    };

     /*  La fonction fStartClock fait en sorte de lancer la fonction f1Tick sur une base de temps donnée en paramètre afin de faire tourner l'horloge. !! Cette fonction suppose et utilise une variable globale clockInterval !!
            - paramètres :
                - nbMilli : le nombre de millisecondes entre chaque appels à f1Tick
            - retour : /
    */
    var fStartClock = function (nbMilli) {
        clearInterval(clockInterval);
        clockInterval = setInterval(f1Tick, nbMilli);
    };
    /*  La fonction fPlayClock démarre l'horloge sur base d'un délai de 1000ms
            - paramètres : /
            -retour : /
    */
    var fPlayClock = function () {
        fStartClock(1000);
    };
    /*  La fonction fPauseClock stoppe l'horloge (via le timer clockInterval).
            - paramètres : /
            - retour : /
    */
    var fPauseClock = function () {
        clearInterval(clockInterval);
    };
    /*  La fonction fResetClock remet la pendule à l'heure (selon l'heure actuelle du client)
            - paramètres : /
            - retour : /
    */
    var fResetClock = function () {
        fPauseClock();
        document.getElementById("clockSpeed").value = 6;
        nbSecFrom0 = (Math.round(Date.now() / 1000) - (new Date().getTimezoneOffset() * 60)) % (24 * 60 * 60);
        fDisplayNewTime(document.getElementById("hours"), document.getElementById("minutes"), document.getElementById("seconds"), document.getElementById("hour"), document.getElementById("min"), document.getElementById("sec"), nbSecFrom0);
        fPlayClock();
    };
    /*** la fonction qui démarre le script (une fois la page Web complètement téléchargée et affichée) ***/
    /* La fonction fPageIsLoaded gère le chargement de la page (démarrage du script) et (expliquer ce qu'elle fait)
            - paramètres : /
            - retour : /
    */
    var fPageIsLoaded = function () {
        fResetClock();
        document.getElementById("commands").reset()
    };
    //gestion de l'événement "load" pour démarrer le script
    window.addEventListener("load", fPageIsLoaded, false);
}());