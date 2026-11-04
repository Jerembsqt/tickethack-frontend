document.querySelector('#search-button').addEventListener('click', function () {
    const departure = document.querySelector('#departure').value;
    const arrival = document.querySelector('#arrival').value;
    const date = document.querySelector('#date').value; // format AAAA-MM-JJ
    const formattedDate = date.split('-').reverse().join('-');
    
    if (!departure || !arrival || !date) {
        alert('Please fill in all fields.');
        return;
    }
   
    fetch(`http://localhost:3000/trips/search/${encodeURIComponent(departure)}/${encodeURIComponent(arrival)}/${formattedDate}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.querySelector('#results');
            resultsContainer.innerHTML = '';

            if (data.Trips.length === 0) {
                resultsContainer.innerHTML = ' <img src="./images/notfound.png" alt="No results found"> <p>No results found for your journey.</p>';
                return;
            }

            data.Trips.forEach(trip => {
                const resultDiv = document.createElement('div');
                resultDiv.classList.add('result');
                resultDiv.innerHTML = `
                    <p>Departure: ${trip.departure}</p>
                    <p>Arrival: ${trip.arrival}</p>
                    <p>Date: ${new Date(trip.date).toLocaleDateString('fr-FR')}</p>
                    <p>Price: ${trip.price}</p>
                `;
                resultsContainer.appendChild(resultDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}); 