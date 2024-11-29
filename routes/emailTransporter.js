// import nodemailer from 'nodemailer';
// import oAuth2Client from './oauth.js';

// export async function createTransporter() {
//   const accessToken = await oAuth2Client.getAccessToken();

//   return nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: 'OAuth2',
//       user: process.env.GMAIL_EMAIL,
//       clientId: process.env.GMAIL_CLIENT_ID,
//       clientSecret: process.env.GMAIL_CLIENT_SECRET,
//       refreshToken: process.env.GMAIL_REFRESH_TOKEN,
//       accessToken: accessToken.token,
//     },
//   });
// }