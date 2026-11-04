document.querySelector('#search-button').addEventListener('click', function() {
    const departure = document.querySelector('#departure').value;
    const arrival = document.querySelector('#arrival').value;
    const date = document.querySelector('#date').value;

    if (!departure || !arrival || !date) {
        alert('Please fill in all fields.');
        return;
    }

    fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: document.querySelector('#departure').value,
            query: document.querySelector('#arrival').value,
            query: document.querySelector('#date').value,
        })
    })
    .then(response => response.json())
    .then(data => {
        const resultsContainer = document.querySelector('#results');
        resultsContainer.innerHTML += '';

        data.results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result');
            resultDiv.innerHTML += `
                <p>Departure: ${result.departure}</p>
                <p>Arrival: ${result.arrival}</p>
                <p>Date: ${result.date}</p>
                <p>Price: ${result.price}</p>
            `;
            resultsContainer.appendChild(resultDiv);
        });
        if (data.results.length === 0) {
            document.querySelector('#results').innerHTML += '<p>No results found.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
})
