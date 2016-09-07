// worker.js
var zmq = require('zmq')
  , sock = zmq.socket('pull')
  , moment = require('moment');

// from: https://github.com/hokein/electron-sample-apps/blob/master/webview/browser/browser.js
function navigateTo(url) {
  resetExitedState();
  document.querySelector('webview').src = url;
}

function resetExitedState() {
  document.body.classList.remove('exited');
  document.body.classList.remove('crashed');
  document.body.classList.remove('killed');
}

//
var port = "1234"
var DateFormat = "yyyyMMdd HH:mm:ss";
var job = null;

sock.connect("tcp://localhost:" + port);
console.log('Worker connected to port ' + port);

function printProp(obj) {
  var propValue;
  for(var propName in obj) {
      propValue = obj[propName]

      console.log(propName,propValue);
  }
}

String.format = function() {
      var s = arguments[0];
      for (var i = 0; i < arguments.length - 1; i++) {       
          var reg = new RegExp("\\{" + i + "\\}", "gm");             
          s = s.replace(reg, arguments[i + 1]);
      }
      return s;
  }

function getUrl(job, liveMode = false, holdReady = false) {
    var url = "";
    var hold = holdReady == false ? "0" : "1";
    var embedPage = liveMode ? "embeddedLive" : "embedded";

    url = String.format(
                "https://www.quantconnect.com/terminal/{0}?user={1}&token={2}&pid={3}&version={4}&holdReady={5}&bid={6}",
                embedPage, job.iUserID, job.sChannel, job.iProjectID, "2.2.0.2", hold, job.sAlgorithmID);

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

sock.on('message', function(msg){
  try {
    // deserialize
    let message = JSON.parse(msg);
    console.log(message);

    if (message.eType == "Debug" || message.eType == "Log" || message.eType == "Error") {
      var date = moment().format('YYYYMMDD HH:mm:ss');
      console.log(date + " Trace:: " + message.sMessage);
    } 

    if (message.eType == "BacktestNode") {
      var url = getUrl(message);
      job = message;
      navigateTo(url);
    } 

    if (message.eType == "BacktestResult") {
        displayBacktestResultsPacket(message);
    }

  } catch (err) {
    console.log(err.message);
  }


});