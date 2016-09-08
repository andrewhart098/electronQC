// worker.js
var zmq = require('zmq')
  , sock = zmq.socket('pull')
  , moment = require('moment');

(function() {

  const {BrowserWindow} = require('electron')

  let win = new BrowserWindow({width: 800, height: 1500})
  win.loadURL('http://github.com')

  let contents = win.webContents
  console.log(contents)

  var port = "1234"
  var DateFormat = "yyyyMMdd HH:mm:ss";

  sock.connect("tcp://localhost:" + port);

  // Should log in the terminal
  console.log('Worker connected to port ' + port);

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
}())
// 
