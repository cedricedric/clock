/*global window, console*/
(function () {
    "use strict";
    /*** variables "globales" (IIFE) ***/

    var nbSecFrom0 = 0;  /* */

    var clockInterval;

    var alarmNbSecFrom0 = 0;

    /*** les fonctions du script (les utilisées avant celles qui les utilisent) ***/

    /* La fonction fRotateElement effectue une rotation horaires de rot (paramètre) degrés sur un élément el (paramètre).

        -paramètres :

            - el : l'élément à faire touner
            - rot : le nombre de degrés pour la rotation de l'élément

        -retour: /
    */
    /* tous les éléments possède un objet style avec ne méthode SetProperty */

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
    /*Tous les él input possède une propri value */

    var fSetHMS = function (inH, inM, inS, nbSFrom0) {
        inS.value = nbSFrom0 % 60;
        inM.value = Math.floor(nbSFrom0 / 60) % 60;
        inH.value = Math.floor(nbSFrom0 / 3600);
    };


    /*  La fonction fSetClockTitle change l'heure dans le titre en fonction du nombre de secondes (paramètre) écoulées depuis minuit.
    La fonction suppose que l'heure est inscrite dans le titre sous le format xHyMzS, par exemple "4H15M25S".
        - paramètres :

            - nbSFrom0 : le nombre de secondes écoulées depuis minuit

        - retour : /
    */

    var fSetClockTitle = function (nbSFrom0) {
        document.title = document.title.replace(/[0-2]?[0-9]H/, Math.floor(nbSFrom0 / 3600) + "H").replace(/[0-5]?[0-9]M/, Math.floor(nbSFrom0 / 60) % 60 + "M").replace(/[0-5]?[0-9]S/, nbSFrom0 % 60 + "S");
    };


    /*  La fonction fIsAM indique si le nombre de secondes (paramètre) écoulées depuis minuit se situe au matin, soit entre minuit et 11h59:59 inclus.

        - paramètres :

            - nbSFrom0 : le nombre de secondes écoulées depuis minuit

        - retour : true si le nombre de secondes (paramètre) écoulées depuis minuitse situe au matin, soit entre minuit et 11h59:59 inclus (false, sinon).
    */

    var fIsAM = function (nbSFrom0) {
        if (nbSFrom0 <= 43199) {
            return true;
        } else {
            return false;
        }
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
        fRotateElement(sNeedle, nbSFrom0 * 6);
        fRotateElement(mNeedle, nbSFrom0 * 0.1);
        fRotateElement(hNeedle, nbSFrom0 / 120);
    };


    /*  La fonction fDisplayNewTime, règle l'affichage de l'heure sous ses diverses formes, en fonction du nombre de secondes écoulées depuis minuit (paramètre NbSFrom0). Cette fonction va :    1) régler les aiguilles de l'horloge (3 paramètres hNeedle, mNeedle et sNeedle) (affichage de l'heure version aiguilles) ainsi que l'affichage correcte de "AM" ou "PM" dans un paragraphe prévu à cet effet (paramètre clockAMPM)    2) régler 3 inputs de type number (3 paramètres inH, inM et inS) (affichage de l'heure version chiffres)    3) changer l'heure dans le titre.

        - paramètres :

            - hNeedle : le div pour l'aiguille des heures
            - mNeedle : le div pour l'aiguille des minutes
            - sNeedle : le div pour l'aiguille des secondes
            - clockAMPM : l'élément p pour indiquer que l'alarme est prévue le matin ("AM Alarm") ou l'après-midi ("PM Alarm")
            - inH : l'input de type number qui recevra les heures en fonction de nbSFrom0
            - inM : l'input de type number qui recevra les minutes en fonction de nbSFrom0
            - inS : l'input de type number qui recevra les secondes en fonction de nbSFrom0
            - nbSFrom0 : le nombre de secondes écoulées depuis minuit

        - retour : /
    */
    /* FsetClock fait tourner les 3 aiguilles */

    var fDisplayNewTime = function (hNeedle, mNeedle, sNeedle, clockAMPM, inH, inM, inS, nbSFrom0) {
        fSetClock(hNeedle, mNeedle, sNeedle, nbSFrom0);
        if (fIsAM(nbSFrom0)) {
            clockAMPM.textContent = "AM";
        } else {
            clockAMPM.textContent = "PM";
        }
        fSetHMS(inH, inM, inS, nbSFrom0);
        fSetClockTitle(nbSFrom0);
    };


    /*  La fonction f1Tick fait (à chaque appel d'un timer) avancer d'une unité le nombre de secondes (variable globale) écoulées depuis minuit puis utilise la fonction fDisplayNewTime pour régler l'horloge (version aiguilles et numériques) sur ce nouveau nombre de secondes. Enfin, la fonction vérifie s'il est maitenant l'heure (ou plutôt la seconde) pour déclencher l'alarme.

        - paramètres : /

        - retour : /
    */
    /**/

    var f1Tick = function () {
        nbSecFrom0 = (nbSecFrom0 + 1) % 86400;
        fDisplayNewTime(document.getElementById("hours"), document.getElementById("minutes"), document.getElementById("seconds"), document.getElementById("clockAmPm"), document.getElementById("hour"), document.getElementById("min"), document.getElementById("sec"), nbSecFrom0);
        if (nbSecFrom0 === alarmNbSecFrom0) {
            document.getElementById('alarmSound').pause();
            document.getElementById('alarmSound').currentTime = 0;
            document.getElementById('alarmSound').play();
        }
    };


     /*  La fonction fStartClock fait en sorte de lancer la fonction f1Tick sur une base de temps donnée en paramètre afin de faire tourner l'horloge. !! Cette fonction suppose et utilise une variable globale clockInterval !!

            - paramètres :

                - nbMilli : le nombre de millisecondes entre chaque appels à f1Tick

            - retour : /
    */
    /* ClearInterval annule l'action repeté. setInterval fonction qui appel une fonction(1er para) toutes les milli secondes (2e para) */

    var fStartClock = function (nbMilli) {
        clearInterval(clockInterval);
        clockInterval = setInterval(f1Tick, nbMilli);
    };


    /*  La fonction fComicsClicked gère les clics sur la case à cocher "comics" en ajoutant ou retirant la classe "comics" au body.

            - paramètres : /

            - retour : /
    */
    /* Tout él de page Web possède une propri classList, qui représente la liste des classes qui s'appliquent à l'él en question. Et la méthode toggle qui permet d'ajouter ou supp une class */

    var fComicsClicked = function () {
        document.querySelector("body").classList.toggle("comics");
    };


     /* La fonction fGetNbMilli calcule et retourne un nombre de millisecondes en fonction d'un paramètre speedValue compris entre 1 (le + lent) et 11 (le + rapide).
        * Si speedValue vaut 1, fGetNbMilli retourne 2000 (ms = 1 tic toutes les 10/5eme de s = 2s)
        * Si speedValue vaut 2, fGetNbMilli retourne 1800 (ms = 1 tic toutes les 9/5eme de s)
        * Si speedValue vaut 6, fGetNbMilli retourne 1000 (ms = 1 tic toutes les 5/5eme de s = 1s)
        * Si speedValue vaut 7, fGetNbMilli retourne 800 (ms = 1 tic toutes les 4/5eme de s)
        * Si speedValue vaut 10, fGetNbMilli retourne 200 (ms = 1 tic tous les 1/5ème de s)
        * Si speedValue vaut 11, fGetNbMilli retourne 0 (ms = vitesse max possible, 1 tic "tout le temps")

             - paramètres :

                - speedValue : un nombre (a priori entier) entre 1 (vitesse minimale) et 11 (vitesse maximale). 6 étant une vitesse normale d'écoulement du temps (1s)

             - retour : /
    */

    var fGetNbMilli = function (speedValue) {
        return (11 - speedValue) * 200;
    };


    /*  La fonction fPlayClock gère les clics sur le bouton "play" en démarrant l'horloge sur base du délai (en ms) calculé via le paramètre de vitesse "clockSpeed"

            - paramètres : /

            -retour : /
    */
    /*La propri valueAsNumber d'un objet qui représente un champ « input » de type « range » contient le nombre correspondant au curseur du « range ». */

    var fPlayClock = function () {
        fStartClock(fGetNbMilli(document.getElementById("clockSpeed").valueAsNumber));
    };


    /*  La fonction fNotAlwaysOnTime insère "not" après "is" dans le titre.

            - paramètres : /

            - retour : /
    */

    var fNotAlwaysOnTime = function () {
        var title = document.querySelector("header h1");
        title.textContent = title.textContent.replace(/is\salways/, "is not always");
    };


    /*  La fonction fPauseClock stoppe l'horloge (via le timer clockInterval).

            - paramètres : /

            - retour : /
    */
    /* Dès que fPauseClock est lancé la fonction fNotAlwaysOnTime change le titre de la page. La fonction clearInterval annule la répitition d'appel d'un setInterval*/

    var fPauseClock = function () {
        clearInterval(clockInterval);
        fNotAlwaysOnTime();
    };


    /*  La fonction fSpeedChange gère les changements de valeurs sur l'input de type "range" (de 1 à 11) "clockSpeed".

            - paramètres : /

            - retour : /
    */

    var fSpeedChange = function () {
        fPauseClock();
        fPlayClock();
    };


    /*  La fonction fAlwaysOnTime remplace "is not" pas "is" dans le titre.

            - paramètres : /

            - retour : /
    */

    var fAlwaysOnTime = function () {
        var title = document.querySelector("header h1");
        title.textContent = title.textContent.replace(/is\snot/, 'is');
    };


    /*  La fonction fResetClock remet la pendule à l'heure (selon l'heure actuelle du client)

            - paramètres : /

            - retour : /
    */
    /* La fonction Date.now donne le temps écoulé depuis le 1er janvier 1970 minuit GTM. new Date().getTimezoneOffset() nous donne le décalage (en minutes!) entre le fuseau GMT heure d'hiver et le fuseau et la saison de l'Internaute */

    var fResetClock = function () {
        fPauseClock();
        document.getElementById("clockSpeed").value = 6;
        nbSecFrom0 = (Math.round(Date.now() / 1000) - (new Date().getTimezoneOffset() * 60)) % (24 * 60 * 60);
        fDisplayNewTime(document.getElementById("hours"), document.getElementById("minutes"), document.getElementById("seconds"), document.getElementById("clockAmPm"), document.getElementById("hour"), document.getElementById("min"), document.getElementById("sec"), nbSecFrom0);
        fPlayClock();
        fAlwaysOnTime();
    };


    /*  La fonction fFocusInput gère le focus sur un des input pour régler l'heure ou l'alarme en agrandissant cet input (e.currentTarget) qui vient de recevoir le focus d'un facteur 1.5 et en indiquant qu'il faut perdre le focus pour valider tout changement. Cette fonction va rendre visible cette petite astérisque (balise <sup> de classe "notice" dans le label correspondant à l'input) par ajout de classe "changesNotApplied" sur cette balise <sup> de classe "notice"

            - paramètres :

                - e : l'événement (focus) survenu, comprenant la propriété currentTarget (l'input qui vient de recevoir le focus)

            - retour : /
    */

    var fFocusInput = function (e) {
        var nameOfTheInput = e.currentTarget.getAttribute('name');
        if (nameOfTheInput === "hour" || nameOfTheInput === "min" || nameOfTheInput === "sec") {
            fPauseClock();
            e.currentTarget.style.setProperty("transform", "scale(1.5)", "");//; mieux de faire en CSS
            e.currentTarget.parentNode.parentNode.querySelector("sup.notice").classList.add("changesNotApplied");
        } else {
            e.currentTarget.style.setProperty("transform", "scale(1.5)", "");//; mieux de faire en CSS
            e.currentTarget.parentNode.parentNode.querySelector("sup.notice").classList.add("changesNotApplied");
        }
    };


    /*  La fonction fHMS2nbSec calcule et retourne le nombre de secondes écoulées depuis minuit en fonction
        de 3 inputs (paramètres) qui contiennent respectivement 3 nombres entiers: un pour les heures, un pour
        les minutes, un pour les secondes.

            - paramètres :

                - inH : l'input contenant le nombre (entier entre 0 et 11) d'heures écoulées depuis minuit
                - inM : l'input contenant le nombre (entier entre 0 et 59) de minutes écoulées depuis la dernière heure (la plus proche dans le passé)
                - inS : l'input contenant le nombre (entier entre 0 et 59) de secondes écoulées depuis la dernière minute (la plus proche dans le passé)

            - retour : le nombre de secondes écoulées depuis minuit
    */

    var fHMS2nbSec = function (inH, inM, inS) {
        return inH.valueAsNumber * 3600 + inM.valueAsNumber * 60 + inS.valueAsNumber;

    };


    /*  La fonction fSetClockManually gère les changements de valeurs sur les inputs "hour", "min" et "sec"
        en réglant les divers affichages de l'heure en fonction de ces valeurs des inputs "hour", "min" et "sec".
        La fonction va également ne plus rendre visible cette petite astérisque d'avertissement qui indique que
        la modification n'a pas encore été prise en compte (balise <sup> de classe "notice" dans le label
        correspondant à l'input) par suppression de classe "changesNotApplied"
        sur cette balise <sup> de classe "notice"

            - paramètres : /

                - e : l'événement (changement de valeur) survenu, comprenant la propriété currentTarget
                (l'input number qui vient de changer de valeur)

            - retour : /
    */

    var fSetClockManually = function (e) {
        nbSecFrom0 = fHMS2nbSec(document.getElementById("hour"),
                document.getElementById("min"),
                document.getElementById("sec"));
        fDisplayNewTime(document.getElementById("hours"),
                document.getElementById("minutes"),
                document.getElementById("seconds"),
                document.getElementById("clockAmPm"),
                document.getElementById("hour"),
                document.getElementById("min"),
                document.getElementById("sec"),
                nbSecFrom0);
        e.currentTarget.parentNode.parentNode.querySelector("sup.notice").classList.remove("changesNotApplied");
    };


    /* la fonction fChangeSound change la source (le fichier) et le type de l'élément source dans l'élément audio (passé en second paramètre) pour qu'elle corresponde au fichier fileName (premier paramètre, supposé non vide, dans le dossier "sounds" et d'extension soit mp3, ogg, ou wav). Cette fonction retourne -1 si l'extension du fichier n'est ni mp3, ni ogg, ni wav.

        - paramètres :

            - fileName : le nom du fichier (supposé non vide et d'extension mp3, wav ou ogg).
            - elAudio : l'élément <audio> qui va utiliser le fichier fileName

        - retour : -1 si l'extension du fichier fileName n'est ni mp3, ni ogg, ni wav; 0 sinon.
    */

    var fChangeSound = function (fileName, elAudio) {
        var elSource = document.getElementsByTagName("source")[0];
        var fileExt = fileName.substring((fileName.lastIndexOf(".")), (fileName.lastIndexOf(".")) + 4);
        switch (fileExt) {
        case ".mp3":
            elSource.setAttribute("type", "audio/mpeg");
            break;
        case ".wav":
            elSource.setAttribute("type", "audio/wav");
            break;
        case ".ogg":
            elSource.setAttribute("type", "audio/ogg");
            break;
        default:
            return -1;
        }
        elSource.setAttribute("src", "./sounds/" + fileName);
        elAudio.load();
        return 0;
    };


    /* La fonction fChangeAlSound gère les changements d'options sur le select "selDefAlarmSound" en changeant le fichier son lu (dans la balise audio "alarmSound" = dans la préécoute et si l'heure courante et l'heure de l'alarme coincident) et en activant ou désactivant la sélection de fichier et la préécoute selon les cas (si l'option sélectionnée est la dernière (supposée être un "son personnel") ou non)

        - paramètres :

            - e : l'événement (changement d'option) survenu, comprenant la propriété currentTarget (le select qui vient de changer d'option)

        - retour : /
    */

    var fChangeAlSound = function (e) {
        if (document.getElementById("selDefAlarmSound").selectedIndex < document.getElementById("selDefAlarmSound").length - 1) {
            document.getElementById("persAlarmSound").classList.add("disabled");
            fChangeSound(e.currentTarget.value, document.getElementById("alarmSound"));
            document.getElementById("playSound").classList.remove("disabled");
        } else {
            document.getElementById("persAlarmSound").classList.remove("disabled");
            if (document.getElementById("fiPersAlarmSound").value === "") {
                document.getElementById("playSound").classList.add("disabled");
            } else {
                if (fChangeSound(document.getElementById('fiPersAlarmSound').files[0].name, document.getElementById("alarmSound")) === -1) {
                    document.getElementById("playSound").classList.add("disabled");
                } else {
                    document.getElementById("playSound").classList.remove("disabled");

                }
            }
        }
    };


    /* La fonction fChangePersAlSound gère les changements de fichiers sur l'input de type file "fiPersAlarmSound" en changeant le fichier son lu (dans la balise audio "alarmSound" = dans la préécoute et si l'heure courante et l'heure de l'alarme coincident) et en activant ou désactivant la pré-écoute selon les cas. Cette fonction gère également l'affichage ou non d'une erreur (prévue dans le html) de format du fichier personnel choisi.

        - paramètres :

            - e : l'événement (changement de fichier) survenu, comprenant la propriété currentTarget (l'input de type file qui vient de changer de fichier)

        - retour : /
    */

    var fChangePersAlSound = function (e) {
        if (fChangeSound(e.currentTarget.files[0].name, document.getElementById("alarmSound")) === -1) {
            document.getElementById("playSound").classList.add("disabled");
            document.getElementById("msgNoExt").classList.remove("notYet");
        } else {
            document.getElementById("msgNoExt").classList.add("notYet");
            document.getElementById("playSound").classList.remove("disabled");
        }
    };


    /*  La fonction fBlurInput gère la perte de focus sur un input pour régler l'heure ou l'alarme en redonnant sa taille initiale à l'input et en supprimant l'indication qu'il faut perdre le focus pour valider tout changement. La fonction va également plus rendre visible cette petite astérisque (balise <sup> de classe "notice" dans le label correspondant à l'input) par suppression
        de classe "changesNotApplied" sur cette balise <sup> de classe "notice"

            - paramètres :

                - e : l'événement (blur) survenu, comprenant la propriété currentTarget
                (l'input qui vient de perdre le focus)

            - retour : /
    */

    var fBlurInput = function (e) {
        e.currentTarget.style.setProperty("transform", "scale(1)", "");//; mieux de faire en CSS
        e.currentTarget.parentNode.parentNode.querySelector("sup.notice").classList.remove("changesNotApplied");
    };


     /*  La fonction fSetAlarm règle l'aiguille d'alarme de l'horloge (paramètre) en fonction du nombre de secondes écoulées depuis minuit pour l'alarme (paramètre nbSAlFrom0).

         - paramètres :

            - alNeedle : le div pour l'aiguille de l'alarme
            - nbSAlFrom0 : le nombre de secondes écoulées depuis minuit pour l'alarme

        - retour : /
    */

    var fSetAlarm = function (alNeedle, nbSAlFrom0) {
        fRotateElement(alNeedle, nbSAlFrom0 / 120);
    };


    /*  La fonction fSetAlarmTitle change l'alarme dans le titre en fonction du nombre de secondes écoulées depuis minuit pour déclencher l'alarme (paramètre). La fonction suppose que l'alarme dans le titre est inscrite au format xhymzs, par exemple "4h15m25s".

        - paramètres :

            - nbSAlFrom0 : le nombre de secondes écoulées depuis minuit pour déclencher l'alarme

        - retour :
    */

    var fSetAlarmTitle = function (nbSAlFrom0) {
        document.title = document.title.replace(/[0-2]?[0-9]h/, Math.floor(nbSAlFrom0 / 3600) + "h").replace(/[0-5]?[0-9]m/, Math.floor(nbSAlFrom0 / 60) % 60 + "m").replace(/[0-5]?[0-9]s/, nbSAlFrom0 % 60 + "s");

    };



    /*  La fonction fDisplayNewAlarm, règle l'affichage de l'alarme sous ses diverses formes, en fonction du nombre de secondes écoulées depuis minuit pour l'alarme (paramètre NbSAlFrom0). Cette fonction va :    1) régler l'aiguille de l'alarme (paramètre alNeedle) ainsi que l'affichage correcte de "AM Alarm" ou "PM Alarm" dans un paragraphe prévu à cet effet (paramètre clockAMPM)    2) changer l'alarme dans le titre.

        - paramètres :

            - alNeedle : le div pour l'aiguille de l'alarme
            - alarmAMPM : l'élément p pour indiquer que l'alarme est prévue le matin ("AM Alarm") ou l'après-midi ("PM Alarm")
            - nbSAlFrom0 : le nombre de secondes écoulées depuis minuit pour l'alarme

        - retour : /
    */

    var fDisplayNewAlarm = function (alNeedle, alarmAMPM, nbSAlFrom0) {
        fSetAlarm(alNeedle, nbSAlFrom0);
        fSetAlarmTitle(nbSAlFrom0);
        if (fIsAM(nbSAlFrom0)) {
            alarmAMPM.textContent = "AM Alarm";
        } else {
            alarmAMPM.textContent = "PM Alarm";
        }
    };


    /*  La fonction fSetAlarmManually gère les changements de valeurs sur les inputs "alarmHour", "alarmMin" et "alarmSec" en réglant les divers affichages de l'alarme (aiguille avec mention (AM Alarm) ou (PM Alarm) et titre) en fonction des valeurs de ces inputs "alarmHour", "alarmMin" et "alarmSec". La fonction va également ne plus rendre visible cette petite astérisque d'avertissement qui indique que la modification n'a pas encore été prise en compte (balise <sup> de classe "notice" dans le label correspondant à l'input) par suppression de classe "changesNotApplied" sur cette balise <sup> de classe "notice"

        - paramètres : /

            - e : l'événement (changement de valeur) survenu, comprenant la propriété currentTarget (l'input number qui vient de changer de valeur)

        - retour : /
    */

    var fSetAlarmManually = function (e) {
        alarmNbSecFrom0 = fHMS2nbSec(document.getElementById("alarmHour"), document.getElementById("alarmMin"), document.getElementById("alarmSec"));
        fDisplayNewAlarm(document.getElementById("wakeUp"), document.getElementById("alarmAmPm"), alarmNbSecFrom0);
        e.currentTarget.parentNode.parentNode.querySelector("sup.notice").classList.remove("changesNotApplied");
    };


    /*** la fonction qui démarre le script (une fois la page Web complètement téléchargée et affichée) ***/
    /* La fonction fPageIsLoaded gère le chargement de la page (démarrage du script) et ajoute les gestionnaires
    des événements pour les commandes de l'horloge, puis règle l'horloge (aiguilles + nombres)

            - paramètres : /

            - retour : /
    */

    var fPageIsLoaded = function () {
        fResetClock();
        document.getElementById("commands").reset();
        document.getElementById("comics").addEventListener("click", fComicsClicked, false);
        document.getElementById("clockSpeed").addEventListener("change", fSpeedChange, false);
        document.getElementById("pause").addEventListener("click", fPauseClock, false);
        document.getElementById("play").addEventListener("click", fPlayClock, false);
        document.getElementById("reset").addEventListener("click", fResetClock, false);
        document.getElementById("hour").addEventListener("focus", fFocusInput, false);
        document.getElementById("min").addEventListener("focus", fFocusInput, false);
        document.getElementById("sec").addEventListener("focus", fFocusInput, false);
        document.getElementById("hour").addEventListener("change", fSetClockManually, false);
        document.getElementById("min").addEventListener("change", fSetClockManually, false);
        document.getElementById("sec").addEventListener("change", fSetClockManually, false);
        document.getElementById("hour").addEventListener("blur", fBlurInput, false);
        document.getElementById("min").addEventListener("blur", fBlurInput, false);
        document.getElementById("sec").addEventListener("blur", fBlurInput, false);
        document.getElementById("alarmHour").addEventListener("focus", fFocusInput, false);
        document.getElementById("alarmMin").addEventListener("focus", fFocusInput, false);
        document.getElementById("alarmSec").addEventListener("focus", fFocusInput, false);
        document.getElementById("alarmHour").addEventListener("blur", fBlurInput, false);
        document.getElementById("alarmMin").addEventListener("blur", fBlurInput, false);
        document.getElementById("alarmSec").addEventListener("blur", fBlurInput, false);
        document.getElementById("alarmSec").addEventListener("blur", fBlurInput, false);
        document.getElementById("selDefAlarmSound").addEventListener("change", fChangeAlSound, false);
        document.getElementById("alarmHour").addEventListener("change", fSetAlarmManually, false);
        document.getElementById("alarmMin").addEventListener("change", fSetAlarmManually, false);
        document.getElementById("alarmSec").addEventListener("change", fSetAlarmManually, false);
        document.getElementById("selDefAlarmSound").addEventListener("click", fChangeAlSound, false);
        document.getElementById("fiPersAlarmSound").addEventListener("change", fChangePersAlSound, false);


    };


    //gestion de l'événement "load" pour démarrer le script

    window.addEventListener("load", fPageIsLoaded, false);
}());