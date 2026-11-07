const API_URL = 'http://localhost:3000';

const searchButton = document.querySelector('#search-button');

// Le script est aussi chargé sur cart.html et bookings.html, où le bouton n'existe pas
if (searchButton) {
searchButton.addEventListener('click', function () {
    const departure = document.querySelector('#departure').value;
    const arrival = document.querySelector('#arrival').value;
    const date = document.querySelector('#date').value; // format AAAA-MM-JJ

    if (!departure || !arrival || !date) {
        alert('Please fill in all fields.');
        return;
    }

    const formattedDate = date.split('-').reverse().join('-');

    fetch(`${API_URL}/trips/search/${encodeURIComponent(departure)}/${encodeURIComponent(arrival)}/${formattedDate}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.querySelector('#results');
            resultsContainer.innerHTML = '';

            const trips = data.Trips || [];

            if (trips.length === 0) {
                resultsContainer.innerHTML = '<img src="./images/notfound.png" alt="No results found"> <p>No results found for your journey.</p>';
                return;
            }

            trips.forEach(trip => {
                const time = new Date(trip.date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const resultDiv = document.createElement('div');
                resultDiv.classList.add('result');
                resultDiv.innerHTML = `
                    <span class="trip-route">${trip.departure} &gt; ${trip.arrival}</span>
                    <span class="trip-time">${time}</span>
                    <span class="trip-price">${trip.price}€</span>
                    <button class="book-btn" data-id="${trip._id}">Book</button>
                `;
                resultsContainer.appendChild(resultDiv);

                resultDiv.querySelector('.book-btn').addEventListener('click', function () {
                    const tripId = this.dataset.id; // id du trajet stocké dans data-id
                    // Ajout du trajet au panier (route POST /cart du backend)
                    fetch(`${API_URL}/cart`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tripId })
                    })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        return response.json();
                    })
                    .then(() => {
                        // Redirection vers la page panier
                        window.location.assign('cart.html');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to add the trip to your cart. Please try again.');
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
}

// Formate une date en heure HH:MM
function formatTime(date) {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ===== Page panier (cart.html) =====
const cartList = document.querySelector('#cart-list');

function loadCart() {
    fetch(`${API_URL}/cart`)
        .then(response => response.json())
        .then(data => {
            cartList.innerHTML = '';
            const items = data.cart || [];

            if (items.length === 0) {
                cartList.innerHTML = '<p>No tickets in your cart.</p><p>Why not plan a trip?</p>';
                document.querySelector('#total').textContent = 'Total: 0€';
                return;
            }

            let total = 0;
            items.forEach(item => {
                total += item.trip.price;
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('result');
                itemDiv.innerHTML = `
                    <span class="trip-route">${item.trip.departure} &gt; ${item.trip.arrival}</span>
                    <span class="trip-time">${formatTime(item.trip.date)}</span>
                    <span class="trip-price">${item.trip.price}€</span>
                    <button class="delete-btn" data-id="${item._id}">X</button>
                `;
                cartList.appendChild(itemDiv);

                itemDiv.querySelector('.delete-btn').addEventListener('click', function () {
                    fetch(`${API_URL}/cart/${this.dataset.id}`, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(() => loadCart())
                        .catch(error => console.error('Error:', error));
                });
            });

            document.querySelector('#total').textContent = `Total: ${total}€`;
        })
        .catch(error => console.error('Error:', error));
}

if (cartList) {
    loadCart();

    document.querySelector('#purchase-button').addEventListener('click', function () {
        fetch(`${API_URL}/cart/purchase`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    window.location.assign('bookings.html');
                } else {
                    alert(data.error || 'Purchase failed. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
    });
}

// ===== Page réservations (bookings.html) =====
const bookingsList = document.querySelector('#bookings-list');

if (bookingsList) {
    fetch(`${API_URL}/bookings`)
        .then(response => response.json())
        .then(data => {
            const bookings = data.bookings || [];
            if (bookings.length === 0) {
                bookingsList.innerHTML = '<p>No bookings yet.</p><p>Why not plan a trip?</p>';
                return;
            }

            bookingsList.innerHTML = '';
            bookings.forEach(booking => {
                const trip = booking.trip;
                const hoursLeft = Math.round((new Date(trip.date) - new Date()) / (1000 * 60 * 60));
                const departureText = hoursLeft > 0 ? `Departure in ${hoursLeft} hours` : 'Departed';

                const bookingDiv = document.createElement('div');
                bookingDiv.classList.add('result');
                bookingDiv.innerHTML = `
                    <span class="trip-route">${trip.departure} &gt; ${trip.arrival}</span>
                    <span class="trip-time">${formatTime(trip.date)}</span>
                    <span class="trip-price">${trip.price}€</span>
                    <span>${departureText}</span>
                `;
                bookingsList.appendChild(bookingDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}
