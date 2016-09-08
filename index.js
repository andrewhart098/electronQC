var job = null;

// from: https://github.com/hokein/electron-sample-apps/blob/master/webview/browser/browser.js
function navigateTo(url) {
  resetExitedState();
  document.querySelector('webview').src = url;
}

 getUrl(job, liveMode = false, holdReady = false) {
    var hold = holdReady == false ? "0" : "1";
    var embedPage = liveMode ? "embeddedLive" : "embedded";

    var url = "https://www.quantconnect.com/terminal/{0}?user={1}&token={2}&pid={3}&version={4}&holdReady={5}&bid={6}"
    var arguments = [embedPage, job.iUserID, job.sChannel, job.iProjectID, "2.2.0.2", hold, job.sAlgorithmID];

    for (var i = 0; i < arguments.length - 1; i++) {       
        var reg = new RegExp("\\{" + i + "\\}", "gm");             
        s = s.replace(reg, arguments[i + 1]);
    }
    return url;
}

function displayBacktestResultsPacket(packet) {
  if (packet.dProgress != 1) return;

  var url = GetUrl(_job, _liveMode, true);
  var dateFormat = "YYYY-MM-DD HH:mm:ss";
  var final = {};
  var resultData = {};

  final.dtPeriodStart = moment(packet.dtPeriodStart).ToString(dateFormat);
  final.dtPeriodFinished = moment(packet.dtPeriodFinished).add(1, 'day').format(dateFormat);

  resultData.version = "3";
  resultData.results = packet.oResults;
  resultData.statistics = packet.oResults.Statistics;
  resultData.iTradeableDates = 1;
  resultData.ranking = null;

  final.oResultData = resultData;

  
}

//        var packet =  moment().format('YYYYMMDD HH:mm:ss') + " Trace:: " + message.sMessage;


//        var url = getUrl(message)
        // job = message
        // navigateTo(url)