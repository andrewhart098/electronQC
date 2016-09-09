const moment = require('moment')
const $ = require('jquery')

let job

function resetExitedState() {
    document.body.classList.remove('exited');
    document.body.classList.remove('crashed');
    document.body.classList.remove('killed');
}

function navigateTo(url) {
    resetExitedState();
    document.querySelector('webview').src = url;
}

function getUrl(job, liveMode = false, holdReady = false) {
    var hold = holdReady == false ? "0" : "1";
    var embedPage = liveMode ? "embeddedLive" : "embedded";

    var url = "https://www.quantconnect.com/terminal/{0}?user={1}&token={2}&pid={3}&version={4}&holdReady={5}&bid={6}"
    var arguments = [embedPage, job.iUserID, job.sChannel, job.iProjectID, "2.2.0.2", hold, job.sAlgorithmID];

    for (var i = 0; i < arguments.length; i++) {       
        var reg = new RegExp("\\{" + i + "\\}", "gm");             
        url = url.replace(reg, arguments[i]);
    }

    return url;
}

function console_log(message) {
    var TheTextBox = document.getElementById("console");
    TheTextBox.value = TheTextBox.value + message + "\n";
}

function console_clear() {
    var TheTextBox = document.getElementById("console");
    TheTextBox.value = "";
}
        
function displayBacktestResultsPacket(packet) {
    if (packet.dProgress != 1) return;

    var url = getUrl(job, false, true);
    var dateFormat = "YYYY-MM-DD HH:mm:ss";
    var final = {};
    var resultData = {};

    final.dtPeriodStart = moment(packet.dtPeriodStart).format(dateFormat);
    final.dtPeriodFinished = moment(packet.dtPeriodFinish).add(1, 'day').format(dateFormat);

    resultData.version = "3";
    resultData.results = packet.oResults;
    resultData.statistics = packet.oResults.Statistics;
    resultData.iTradeableDates = 1;
    resultData.ranking = null;

    final.oResultData = resultData;
    
    var json = JSON.stringify(final);
    
    navigateTo(url)
    
    var webView = document.getElementById("foo")
    webView.executeJavaScript("window.jnBacktest = $.parseJSON('" + json + "');")
    webView.executeJavaScript("$.holdReady(false)")
    
}

require('electron').ipcRenderer
    .on('log', (event, packet) => {
        console_log(moment().format('YYYYMMDD HH:mm:ss') + " Trace:: " + packet.sMessage)
    })
    .on('backtestNode', (event, packet) => {
        job = packet
        console_clear()
        var url = getUrl(packet)
        navigateTo(url)
    })
    .on('backtestResult', (event, packet) => {
        displayBacktestResultsPacket(packet);
    })