import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// пошук елементів документа
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let page = 1; // початкове значення параметра page повинно бути 1 сторніка

refs.btnLoadMore.style.display = 'none'; // ховаємо кнопку
refs.form.addEventListener('submit', onSearch); // слухач події на submit
refs.btnLoadMore.addEventListener('click', onBtnLoadMore); // слухач події клік по кнопці loadMore

// обробка події на submit
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

// дії кнопки LoadMore
function onBtnLoadMore() {
  const name = refs.input.value.trim();
  page += 1;
  pixabay(name, page); // завантаження зображень
}

async function pixabay(name, page) {
  const API_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '33717102-715c10c4f2cae8a60768f134f',
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
            <div class="photo">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
            </div>
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
// function notification(length, totalHits) {
//   if (length === 0) {
//     // вивести повідомлення про те, що НЕ знайдено жодного зображення
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );

//     return;
//   }

//   if (page === 1) {
//     refs.btnLoadMore.style.display = 'flex'; // показуємо кнопку loadMore

//     // вивести повідомлення про кількість знайдених зобрежнь
//     Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
//   }

//   if (length < 40) {
//     refs.btnLoadMore.style.display = 'none'; // ховаємо кнопку loadMore

//     // вивести інфо-повідомлення про те, що більше вже немає зображень
//     Notiflix.Notify.info(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
// }

function notification(length, totalHits) {
  if (length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    refs.btnLoadMore.style.display = 'none';
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

function validateInput() {
  const searchValue = refs.input.value.trim();

  if (searchValue === '') {
    refs.btnLoadMore.style.display = 'none'; // ховаємо кнопку loadMore
    return;
  }

  refs.form.addEventListener('submit', e => {
    e.preventDefault();
    // Do your search logic here
  });
}

validateInput();
