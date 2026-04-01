const STORAGE_KEY = 'book_catalog_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function addFavorite(book) {
  const favorites = getFavorites();
  if (!favorites.some(b => b.key === book.key)) {
    favorites.push(book);
    saveFavorites(favorites);
  }
}

export function removeFavorite(key) {
  const favorites = getFavorites().filter(b => b.key !== key);
  saveFavorites(favorites);
}

export function isFavorite(key) {
  return getFavorites().some(b => b.key === key);
}
