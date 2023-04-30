import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/createMarkup';
import { getImages } from './js/getImages';
import {
  openImageModal,
  refreshImageModal,
  } from './js/simpleLightBox';


const form = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');



let currentPage = 1;
let queryParam = null;
let loadMore = false;

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoadMore, options);

form.addEventListener('submit', onSearchForm);
galleryEl.addEventListener('click', evt => {
  evt.preventDefault();
});

function onLoadMore(entries, observer) {
   
    if (!loadMore){
        return;
    }
  entries.forEach(entry => {
    if (entry.isIntersecting) {
    currentPage += 1;
    renderImagesOnLoadMore();
             
    }
  });

}

async function onSearchForm(evt) {
  evt.preventDefault();
  galleryEl.innerHTML = '';
  queryParam = evt.currentTarget.elements.searchQuery.value.trim();
  
  if (!queryParam) {
    Notify.warning('Please, fill the field');
    
    return;

  };
  
  await renderImagesBySubmit(queryParam);
  observer.observe(target);
 
}

async function renderImagesOnLoadMore() {
  try { 
    const response = await getImages(queryParam, currentPage);
    const dataArray = response.data.hits;    
    if (dataArray.length * currentPage >= response.data.totalHits) {
      observer.unobserve(target);
      Notify.info(`Hooray! All ${response.data.totalHits} images has finished.`);
      currentPage = 1;
      loadMore = false;
     
    };
    
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(dataArray));
    const newGalleryItems = galleryEl.querySelectorAll('.gallery a');
    newGalleryItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        lightbox.open(item.href);
      });
    });
    refreshImageModal();
  } catch (error) {
    console.log(error);
  }
}

async function renderImagesBySubmit() {
  try {
    const response = await getImages(queryParam);
    const dataArray = response.data.hits;
    
    if (!dataArray.length) {
        throw new Error('not found');
       
    } 
    if (dataArray.length){
        Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
        galleryEl.innerHTML = createMarkup(dataArray);
        
    }
    
    if (dataArray.length * currentPage >= response.data.totalHits) {
        observer.unobserve(target);
        currentPage = 1;
        loadMore = false;
        
       
      } else {
        loadMore = true;
      }

        openImageModal();
       

      
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    galleryEl.innerHTML = '';
  }
}