
# [pitneybowes-bot-showcase  (1.0.0)](https://github.com/in4margaret/pitneybowes-bot-showcase) [![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

Showcase of PitneyBowes API with Microsoft Bot Framework

![Demo](demo.gif?raw=true "Demo")

### How to run

#### Option 1 to deploy on Azure:

Go to https://github.com/in4margaret/pitneybowes-bot-showcase
Press - Deploy to Azure button
Enter API keys: MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD and env variable. More info at https://docs.microsoft.com/en-us/bot-framework/portal-register-bot PITNEYBOWES_API_KEY and PITNEYBOWES_API_SECRET env variable. More info at https://identify.pitneybowes.com/docs/identify/v1/en/rest/index.html#CustomerInformationManagementAPI/source/RegisteringPBMarketplace.html

#### Option 2 to run locally:

git clone https://github.com/in4margaret/pitneybowes-bot-showcase.git cd ./pitneybowes-bot-showcase/ npm install
On MacOs PITNEYBOWES_API_KEY=xxxxxxxxxxxxx PITNEYBOWES_API_SECRET=xxxxxxx node ./app.js Download BotFramework-Emulator at https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v3.5.31 Open bot emulator and connect emulator to http://localhost:3978/api/messages
On Windows $env:PITNEYBOWES_API_KEY="xxxxxxxxxxxxx"; $env:PITNEYBOWES_API_SECRET="xxxxxxx"; node ./app.js Download BotFramework-Emulator at https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v3.5.31 Open bot emulator and connect emulator to http://localhost:3978/api/messages

[MIT license](LICENSE).
