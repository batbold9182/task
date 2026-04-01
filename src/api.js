const BASE = import.meta.env.DEV ? '/api' : 'https://openlibrary.org';
const COVER_BASE = 'https://covers.openlibrary.org/b/id';

export async function searchBooks(query) {
  const url = `${BASE}/search.json?q=${encodeURIComponent(query)}&limit=20`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  return data.docs.map(doc => ({
    key: doc.key,
    title: doc.title || 'Unknown Title',
    authors: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
    year: doc.first_publish_year || null,
    coverId: doc.cover_i || null,
  }));
}

export function getCoverUrl(coverId) {
  if (!coverId) return null;
  return `${COVER_BASE}/${coverId}-M.jpg`;
}
