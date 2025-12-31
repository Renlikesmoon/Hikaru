const { getContentType } = require("@whiskeysockets/baileys");

const parseMessage = (m) => {
    if (!m.message) return null;
    
    const type = getContentType(m.message);
    const msg = type === 'viewOnceMessage' ? m.message[type].message[getContentType(m.message[type].message)] : m.message[type];
    
    const body = (type === 'conversation') ? m.message.conversation : 
                 (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                 (type === 'imageMessage' || type === 'videoMessage') ? m.message[type].caption : 
                 (type === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : 
                 (type === 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
                 (type === 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : '';

    return {
        type,
        body,
        sender: m.key.remoteJid,
        isGroup: m.key.remoteJid.endsWith('@g.us'),
        fromMe: m.key.fromMe,
        id: m.key.id,
        pushname: m.pushName,
        message: msg
    };
};

const smsg = (sock, m) => {
    if (!m) return m;
    let res = parseMessage(m);
    if (!res) return m;

    res.reply = (text) => sock.sendMessage(res.sender, { text: text }, { quoted: m });
    return res;
};

module.exports = { 
    parseMessage, 
    smsg,
    getContentType 
};
