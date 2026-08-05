export default function handler(req, res) {

const clientID = "1532870250482237530";


const redirect =
"https://YOUR-DOMAIN.vercel.app/api/discord-login";


const discordURL =
"https://discord.com/oauth2/authorize" +
"?client_id=" + clientID +
"&response_type=code" +
"&redirect_uri=" + encodeURIComponent(redirect) +
"&scope=identify%20guilds";


res.redirect(discordURL);

}
