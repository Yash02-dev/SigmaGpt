let IS_PROD = true;
const server = IS_PROD?
"https://sigmagpt-1backend.onrender.com":
"http://localhost:8080"

export default server;