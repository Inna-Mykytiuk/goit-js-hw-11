import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-form-input'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let page = 1;

refs.btnLoadMore.style.display = 'none';
refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onBtnLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  page = 1;
  refs.gallery.innerHTML = '';

  const name = refs.input.value.trim();

  if (name !== '') {
    pixabay(name);
  } else {
    refs.btnLoadMore.style.display = 'none';

    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function onBtnLoadMore() {
  const name = refs.input.value.trim();
  page += 1;
  pixabay(name, page);
}

async function pixabay(name, page) {
  const API_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '34130140-d575f247069181564a4d7a644',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };

  try {
    const response = await axios.get(API_URL, options);

    notification(response.data.hits.length, response.data.total);

    createMarkup(response.data);
    refs.form.reset();
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr) {
  const markup = arr.hits
    .map(
      item =>
        `<a class="photo-link" href="${item.largeImageURL}">
          <div class="photo-card">
          <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
          <div class="info">
              <p class="info-item">
                  <b>Likes</b>
                  ${item.likes}
              </p>
              <p class="info-item">
                  <b>Views</b>
                  ${item.views}
              </p>
              <p class="info-item">
                  <b>Comments</b>
                  ${item.comments}
              </p>
              <p class="info-item">
                  <b>Downloads</b>
                  ${item.downloads}
              </p>
          </div>
          </div>
        </a>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();
}

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// всі сповіщення notiflix
function notification(length, totalHits) {
  if (length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (page === 1) {
    refs.btnLoadMore.style.display = 'flex';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (length < 40) {
    refs.btnLoadMore.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
