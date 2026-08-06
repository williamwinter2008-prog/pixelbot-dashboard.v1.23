import cookie from "cookie";

export default async function handler(req, res) {

    const clientID = "1532870250482237530";

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


    const params = new URLSearchParams();

    params.append(
        "client_id",
        clientID
    );

    params.append(
        "client_secret",
        process.env.DISCORD_CLIENT_SECRET
    );

    params.append(
        "grant_type",
        "authorization_code"
    );

    params.append(
        "code",
        req.query.code
    );

    params.append(
        "redirect_uri",
        redirect
    );


    const tokenResponse = await fetch(
        "https://discord.com/api/oauth2/token",
        {
            method:"POST",
            headers:{
                "Content-Type":
                "application/x-www-form-urlencoded"
            },
            body:params
        }
    );


    const token = await tokenResponse.json();


    const userResponse = await fetch(
        "https://discord.com/api/users/@me",
        {
            headers:{
                Authorization:
                `Bearer ${token.access_token}`
            }
        }
    );


    const user = await userResponse.json();


    res.setHeader(
        "Set-Cookie",
        cookie.serialize(
            "discord_user",
            JSON.stringify(user),
            {
                httpOnly:false,
                maxAge:3600,
                path:"/"
            }
        )
    );


    res.redirect("/dashboard.html");

}
