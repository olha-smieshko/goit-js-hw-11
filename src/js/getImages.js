import axios from 'axios';

export async function getImages(queryParam, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY_API = '35872306-ed45c7bf8a958c397ab2f86db';
  return axios.get(
    `${BASE_URL}?key=${KEY_API}&q=${queryParam}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
}
