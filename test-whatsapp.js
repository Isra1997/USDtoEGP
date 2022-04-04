const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', async() => {
    console.log('Client is ready!');
});

client.on('message',(message)=>{
    console.log(message.body);
    if(message.body === 'USD to EGP'){
        console.log(message.from);
        client.sendMessage(message.from,"The current exchange rate is 18.5!")
    }
})



client.initialize();