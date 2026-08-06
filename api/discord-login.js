export default async function handler(req, res) {

const clientID = "1532870250482237530";

const clientSecret = "PkpwJxSvp_RkZ75DiuBqrtbMyqO1yv0q";

const redirect =
"https://pixelbot-dashboard-v1-23-3q9f.vercel.app/api/discord-login";


if(!req.query.code){

const discordURL =
"https://discord.com/oauth2/authorize" +
"?client_id=" + clientID +
"&response_type=code" +
"&redirect_uri=" + encodeURIComponent(redirect) +
"&scope=identify%20guilds";


return res.redirect(discordURL);

}


const code = req.query.code;


const tokenResponse = await fetch(
"https://discord.com/api/oauth2/token",
{
method:"POST",

headers:{
"Content-Type":"application/x-www-form-urlencoded"
},

body:
new URLSearchParams({

client_id:clientID,

client_secret:clientSecret,

grant_type:"authorization_code",

code:code,

redirect_uri:redirect

})

});


const token = await tokenResponse.json();


const userResponse = await fetch(
"https://discord.com/api/users/@me",
{
headers:{
Authorization:
`Bearer ${token.access_token}`
}
});


const user = await userResponse.json();


res.setHeader(
"Set-Cookie",
`discord_user=${encodeURIComponent(JSON.stringify(user))}; Path=/;`
);


res.redirect("/dashboard.html");


}
