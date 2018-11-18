import Youtube from 'simple-youtube-api';
const youtube = new Youtube(process.env.REACT_APP_GOOGLE_API_KEY);
export { youtube };