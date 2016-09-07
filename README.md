# electronQC

This is a minimal Electron application that can replace GeckoFX in QuantConnect.Lean in order to graph backtest results in a desktop environment.

## To Use

To clone and run this repository you'll need the following installed on your computer
   - [Git](https://git-scm.com)
   - [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com))
   - Visual Studio 2015 with Visual C++ and associated tools installed

From your command line:

```bash
# Clone this repository
git clone https://github.com/andrewhart098/electronQC.git
# Go into the repository
cd electronQC
# Install dependencies and run the app
npm install 

# rerun electron-rebuild
./node_modules/.bin/electron-rebuild
# Or if you are in Windows
.\node_modules\.bin\electron-rebuild.cmd

# Now start the electron app with 
npm start
```

Run the [QuantConnect.Lean](https://github.com/QuantConnect/Lean) engine in visual studio configured to run in a desktop environment.
Be sure you have your user id and api access token configured.

Comment out the following [lines in Program.cs QuantConnect.Lean.Launcher](https://github.com/QuantConnect/Lean/blob/master/Launcher/Program.cs):

``` csharp
    if (environment.EndsWith("-desktop"))            {
        var info = new ProcessStartInfo
        {
            UseShellExecute = false,
            FileName = Config.Get("desktop-exe"),
            Arguments = Config.Get("desktop-http-port")
        };
        Process.Start(info);
    }
```

Learn more about QuantConnect go to [QuantConnect.com](http://www.quantConnect.com).