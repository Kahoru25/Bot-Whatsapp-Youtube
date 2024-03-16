const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer, addAction } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const ytdl = require('ytdl-core');



let urlUser;



const flujo = addKeyword(EVENTS.WELCOME)
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic('¡Hola! \n\n Ingresa un enlace de YouTube para descargar el video 😎');
    })
    .addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
        await state.update({ name: ctx.body });
        const urlUser = ctx.body; // Asigna el valor a la variable urlUser
        console.log(urlUser);
        await flowDynamic(`Estamos procesando el video, espera un momento 😏🫡`);

        try {
            const videoInfo = await ytdl.getInfo(urlUser);
            const mp4Format = videoInfo.formats.find(format => format.container === 'mp4');
            if (!mp4Format) {
                console.error('No se encontró un formato MP4 para el video.');
                return;
            }
            const urlVideo = mp4Format.url;
            console.log('URL del video en formato MP4:', urlVideo);

            // Aquí puedes realizar más acciones con la URL del video (por ejemplo, descargarlo).

            await flowDynamic('Disfrutalo! 🥳', {
                media: urlVideo
            });
        } catch (error) {
            console.error('Error al obtener información del video:', error.message);
        }
    });






const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flujo]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });


};

main();




// const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
// const QRPortalWeb = require('@bot-whatsapp/portal');
// const BaileysProvider = require('@bot-whatsapp/provider/baileys');
// const MockAdapter = require('@bot-whatsapp/database/mock');
// const ytdl = require('ytdl-core');

// const youtubeVideoLink = 'https://www.youtube.com/watch?v=GtRuQqqVLZE'; // Reemplaza con el enlace del video de YouTube

// const getVideoUrl = async () => {
//     try {
//         const videoInfo = await ytdl.getInfo(youtubeVideoLink);
//         return videoInfo.formats.find(format => format.container === 'mp4').url;
//     } catch (error) {
//         console.error('Error al obtener el enlace del video:', error.message);
//         return null;
//     }
// };

// const main = async () => {
//     const adapterDB = new MockAdapter();
//     const adapterFlow = createFlow([
//         addKeyword(EVENTS.WELCOME)
//             .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
//             .addAnswer('Aqui esta', { media: await getVideoUrl() || 'No se pudo obtener el enlace del video.' })
//     ]);
//     const adapterProvider = createProvider(BaileysProvider);

//     createBot({
//         flow: adapterFlow,
//         provider: adapterProvider,
//         database: adapterDB,
//     });

//     QRPortalWeb();
// };

// main();

