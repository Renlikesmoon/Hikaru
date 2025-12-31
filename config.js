const fs = require('fs');

global.owner = "";
global.nomorbot = "";
global.namebot = "Bot WhatsApp";
global.prefix = ".";

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    delete require.cache[file];
    require(file);
});
