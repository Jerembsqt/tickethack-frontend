document.querySelector("#search-button").addEventListener("click", function(event) {
    fetch("https://api.example.com/search?query=" + document.querySelector("#search-input").value)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.querySelector("#results");
            resultsContainer.innerHTML = "";
        });
});

document.querySelector("#purchase-button").addEventListener("click", function(event) {
    fetch("https://api.example.com/purchase", {
        method: "POST",
        body: JSON.stringify({ items: getCartItems() }),
    })
    .then(response => response.json())
    .then(data => {
        alert("Purchase successful!");
    });
    
});

