async function testLive() {
  try {
    const imgRes = await fetch('https://recallx.tech/og-image.png');
    console.log('og-image.png status:', imgRes.status, 'Content-Type:', imgRes.headers.get('content-type'), 'Content-Length:', imgRes.headers.get('content-length'));

    const htmlRes = await fetch('https://recallx.tech', {
      headers: {
        'User-Agent': 'Twitterbot/1.0',
      },
    });
    console.log('HTML status:', htmlRes.status);
    const text = await htmlRes.text();
    
    const titleMatch = text.match(/<title>(.*?)<\/title>/);
    console.log('Live <title>:', titleMatch ? titleMatch[1] : 'Not found');

    const metaTags = text.match(/<meta[^>]+>/g) || [];
    const relevant = metaTags.filter(m => m.includes('twitter') || m.includes('og:'));
    console.log('\nRelevant meta tags on live site:');
    relevant.forEach(m => console.log(' ', m));

  } catch (err) {
    console.error('Error fetching live site:', err);
  }
}

testLive();
