async function testOpenLibrary() {
  const query = 'test';
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=3`;

  console.log(`Fetching: ${url}\n`);

  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const body = await response.text();
      console.error('Response body:', body.slice(0, 500));
      return;
    }

    const data = await response.json();
    console.log(`Total results: ${data.numFound}`);
    console.log(`Returned docs: ${data.docs.length}\n`);

    data.docs.forEach((doc, i) => {
      console.log(`[${i + 1}] ${doc.title}`);
      console.log(`    Author: ${doc.author_name ? doc.author_name.join(', ') : 'N/A'}`);
      console.log(`    Year: ${doc.first_publish_year || 'N/A'}`);
      console.log(`    Cover ID: ${doc.cover_i || 'N/A'}\n`);
    });

    console.log('API is working!');
  } catch (err) {
    console.error('Request failed:', err.message);
  }
}

testOpenLibrary();