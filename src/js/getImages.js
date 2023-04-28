import axios from 'axios';

export async function getImages(queryParam, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY_API = '35736305-5d79b99fc6e7e7bd6a57f0349';
  return await axios.get(
    `${BASE_URL}?key=${KEY_API}&q=${queryParam}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
}
