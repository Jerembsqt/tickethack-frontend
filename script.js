document.querySelector('#search-button').addEventListener('click', function () {
    const departure = document.querySelector('#departure').value;
    const arrival = document.querySelector('#arrival').value;
    const date = document.querySelector('#date').value; // format AAAA-MM-JJ

    if (!departure || !arrival || !date) {
        alert('Please fill in all fields.');
        return;
    }

    const formattedDate = date.split('-').reverse().join('-');

    fetch(`http://localhost:3000/trips/search/${encodeURIComponent(departure)}/${encodeURIComponent(arrival)}/${formattedDate}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.querySelector('#results');
            resultsContainer.innerHTML = '';

            if (data.Trips.length === 0) {
                resultsContainer.innerHTML = '<img src="./images/notfound.png" alt="No results found"> <p>No results found for your journey.</p>';
                return;
            }

            data.Trips.forEach(trip => {
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
                    console.log(this.dataset.id);
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});