import Youtube from "simple-youtube-api";
import dotenv from "dotenv";
dotenv.config();

const youtube = new Youtube(process.env.REACT_APP_GOOGLE_API_KEY);
export { youtube };
