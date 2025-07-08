const el = document.getElementById('config-data');
const products = JSON.parse(el.dataset.products || '{}');

const train = document.getElementById('train');
train.onclick = function() {
  fetch('http://localhost:8000/upload', {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json'  // Tell server we send JSON
    },
        body: JSON.stringify(products)  // Convert JS object to JSON string
    })
    .then(response => response.json())  // Parse JSON response
    .then(result => {
        showToast('success', result.message);
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });   
};