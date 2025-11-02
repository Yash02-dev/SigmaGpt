let IS_PROD = true;
const server = IS_PROD?
"https://sigmagpt-g0y4.onrender.com":
"http://localhost:8080"

export default server;