const BASE = 'https://openlibrary.org';
const COVER_BASE = 'https://covers.openlibrary.org/b/id';

export async function searchBooks(query, author = '') {
  const params = new URLSearchParams({ q: query, limit: '20' });
  if (author) params.set('author', author);

  const res = await fetch(`${BASE}/search.json?${params}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const data = await res.json();

  return (data.docs || []).map(doc => ({
    key: doc.key,
    title: doc.title,
    authors: (doc.author_name || []).join(', '),
    year: doc.first_publish_year ? String(doc.first_publish_year) : '',
    coverId: doc.cover_i || null,
  }));
}

export function getCoverUrl(coverId) {
  if (!coverId) return null;
  return `${COVER_BASE}/${coverId}-M.jpg`;
}
