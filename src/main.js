import './style.css';
import { searchBooks, getCoverUrl } from './api.js';
import { getFavorites, addFavorite, removeFavorite, isFavorite } from './favorites.js';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const favoritesList = document.getElementById('favorites-list');
const favCount = document.getElementById('fav-count');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str != null ? String(str) : '';
  return div.innerHTML;
}

function renderFavorites() {
  const favorites = getFavorites();
  const count = favorites.length;
  favCount.textContent = `${count} book${count !== 1 ? 's' : ''} saved`;

  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p class="fav-empty">No favorites yet</p>';
    return;
  }

  favoritesList.innerHTML = favorites.map(book => {
    const coverUrl = getCoverUrl(book.coverId);
    return `
      <div class="fav-item">
        ${coverUrl
          ? `<img class="fav-thumb" src="${escapeHtml(coverUrl)}" alt="${escapeHtml(book.title)}" loading="lazy">`
          : '<div class="fav-thumb-placeholder">📖</div>'}
        <div class="fav-item-info">
          <h4>${escapeHtml(book.title)}</h4>
          <p>${escapeHtml(book.authors)}</p>
          <p class="fav-year">${escapeHtml(book.year)}</p>
        </div>
        <button class="remove-fav-btn" data-key="${escapeHtml(book.key)}" title="Remove from favorites">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');

  // Handle broken thumbnail images
  favoritesList.querySelectorAll('.fav-thumb').forEach(img => {
    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'fav-thumb-placeholder';
      placeholder.textContent = '📖';
      img.replaceWith(placeholder);
    });
  });

  favoritesList.querySelectorAll('.remove-fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      removeFavorite(key);
      renderFavorites();
      // Sync heart in search results
      const cardBtn = searchResults.querySelector(`.fav-btn[data-key="${CSS.escape(key)}"]`);
      if (cardBtn) cardBtn.classList.remove('active');
    });
  });
}

function createBookCard(book) {
  const coverUrl = getCoverUrl(book.coverId);
  const favored = isFavorite(book.key);

  const card = document.createElement('div');
  card.className = 'book-card';

  // Cover wrapper
  const coverWrap = document.createElement('div');
  coverWrap.className = 'book-cover-wrap';

  // Placeholder
  const placeholder = document.createElement('div');
  placeholder.className = 'book-cover-placeholder';
  placeholder.innerHTML = '<span>📖</span>';
  const placeholderTitle = document.createElement('p');
  placeholderTitle.textContent = book.title;
  placeholder.appendChild(placeholderTitle);

  if (coverUrl) {
    const img = document.createElement('img');
    img.src = coverUrl;
    img.alt = book.title;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      img.remove();
      placeholder.style.display = 'flex';
    });
    placeholder.style.display = 'none';
    coverWrap.appendChild(img);
  }
  coverWrap.appendChild(placeholder);

  // Heart button
  const favBtn = document.createElement('button');
  favBtn.className = `fav-btn${favored ? ' active' : ''}`;
  favBtn.dataset.key = book.key;
  favBtn.title = favored ? 'Remove from favorites' : 'Add to favorites';
  favBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="${favored ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`;

  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const key = book.key;
    const nowFav = isFavorite(key);
    if (nowFav) {
      removeFavorite(key);
      favBtn.classList.remove('active');
      favBtn.title = 'Add to favorites';
      favBtn.querySelector('path').setAttribute('fill', 'none');
    } else {
      addFavorite(book);
      favBtn.classList.add('active');
      favBtn.title = 'Remove from favorites';
      favBtn.querySelector('path').setAttribute('fill', 'currentColor');
    }
    renderFavorites();
  });

  coverWrap.appendChild(favBtn);

  // Info
  const info = document.createElement('div');
  info.className = 'book-info';

  const title = document.createElement('h3');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.className = 'author';
  author.textContent = book.authors;

  const year = document.createElement('p');
  year.className = 'year';
  year.textContent = book.year || '';

  info.appendChild(title);
  info.appendChild(author);
  info.appendChild(year);

  card.appendChild(coverWrap);
  card.appendChild(info);

  return card;
}

function showStatus(msg) {
  searchResults.innerHTML = `<div class="status-msg">${msg}</div>`;
}

async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    showStatus('Please enter a search term.');
    return;
  }
  if (query.length < 3) {
    showStatus('Please enter at least 3 characters.');
    return;
  }
  showStatus('Loading...');
  try {
    const books = await searchBooks(query);
    if (books.length === 0) {
      showStatus('No books found. Try a different search term.');
      return;
    }
    searchResults.innerHTML = '';
    books.forEach(book => searchResults.appendChild(createBookCard(book)));
  } catch {
    showStatus('Network error. Please check your connection and try again.');
  }
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

renderFavorites();
