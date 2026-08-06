export default async function handler(req, res) {

const clientID = "1532870250482237530";

const clientSecret = process.env.DISCORD_SECRET;

const redirect =
"https://pixelbot-dashboard-v1-23-3q9f.vercel.app/api/discord-login";


if (!req.query.code) {

const discordURL =
"https://discord.com/oauth2/authorize" +
"?client_id=" + clientID +
"&response_type=code" +
"&redirect_uri=" + encodeURIComponent(redirect) +
"&scope=identify%20guilds";


return res.redirect(discordURL);

}


const tokenResponse = await fetch(
"https://discord.com/api/oauth2/token",
{
method:"POST",

headers:{
"Content-Type":"application/x-www-form-urlencoded"
},

body:new URLSearchParams({

client_id: clientID,

client_secret: clientSecret,

grant_type:"authorization_code",

code:req.query.code,

redirect_uri:redirect

})

});


const token = await tokenResponse.json();
if(!token.access_token){
    return res.status(500).json(token);
}

const userResponse = await fetch(
"https://discord.com/api/users/@me",
{
headers:{
Authorization:`Bearer ${token.access_token}`
}
});


const user = await userResponse.json();


const data = {
    user: user,
    guilds: await getGuilds(token.access_token)
    async function getGuilds(accessToken){

const response = await fetch(
"https://discord.com/api/users/@me/guilds",
{
headers:{
Authorization:
`Bearer ${accessToken}`
}
});

return await response.json();

}
};


res.setHeader(
"Set-Cookie",
`discord_data=${encodeURIComponent(JSON.stringify(data))}; Path=/; Max-Age=3600; SameSite=Lax`
);

res.redirect("/dashboard.html");

}
