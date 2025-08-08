// index.js

const apiBase = 'http://localhost:3000/api';

async function fetchListings() {
  try {
    const res = await fetch(`${apiBase}/listings`);
    const listings = await res.json();
    renderListings(listings);
  } catch (err) {
    console.error('Error fetching listings:', err);
  }
}

function renderListings(listings) {
  const container = document.getElementById('property-list');
  if (!listings.length) {
    container.innerHTML = '<p>No listings found.</p>';
    return;
  }

  container.innerHTML = listings
    .filter(l => l.status === 'approved') // only show approved
    .map(listing => `
      <div class="card">
        <img src="${listing.images?.[0] || 'https://source.unsplash.com/400x300/?house'}" alt="${listing.title}">
        <h3>${listing.title}</h3>
        <p>${listing.type} • ₹${listing.price.toLocaleString()}</p>
        <p>${listing.address}</p>
      </div>
    `).join('');
}

fetchListings();
