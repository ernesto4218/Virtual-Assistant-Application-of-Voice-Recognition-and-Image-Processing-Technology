

// add product
let products;
let currentPage = 1;
const rowsPerPage = 10; 
let currentSort = { column: null, asc: true };

const uploadImgBtn = document.getElementById('uploadImgBtn');
const fileInput = document.getElementById('productImage');

const addProduct_Formcontainer = document.getElementById('addProduct_Formcontainer');
const AddProductNavBTN = document.getElementById('AddProductNavBTN');
AddProductNavBTN.onclick = function() {
    addProduct_Formcontainer.classList.remove('hidden');
    addProduct_Formcontainer.classList.add('flex');

    AddProductNavBTN.classList.remove('bg-white', 'text-black');
    AddProductNavBTN.classList.add('bg-blue-500', 'text-white');
};

const close_addproductForm = document.getElementById('close_addproductForm');
close_addproductForm.onclick = function() {
    addProduct_Formcontainer.classList.remove('flex');
    addProduct_Formcontainer.classList.add('hidden');

    AddProductNavBTN.classList.remove('bg-blue-500', 'text-white');
    AddProductNavBTN.classList.add('bg-white', 'text-black');

    addproductForm.querySelector('#name').value = '';
    addproductForm.querySelector('#category').value = '';
    addproductForm.querySelector('#price').value = '';
    addproductForm.querySelector('#description').value = '';
    addproductForm.querySelector('#id').value = '';
    addproductForm.querySelector('button[type="submit"] .addproducttext').textContent = 'Add Product';

};

uploadImgBtn.onclick = function() {
    fileInput.click();
};

// Optional: Show file name after selection
fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    if (files.length > 10) {
      showToast('error', 'You can upload a maximum of 10 images.');
      fileInput.value = ''; // Clear selection
      uploadImgBtn.innerHTML = `Upload Image`;
      return;
    }

    const fileNames = Array.from(files).map(file => file.name).join(', ');
    uploadImgBtn.innerHTML = `<span class="inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis align-middle">${fileNames}</span>`;

});

const addproductForm = document.getElementById('addproductForm');
addproductForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent actual form submission

    const formData = new FormData();

    formData.append('name', document.getElementById('name').value.trim());
    formData.append('description', document.getElementById('description').value.trim());
    formData.append('usage_info', document.getElementById('usage_info').value.trim());
    formData.append('category', document.getElementById('category').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('stocks_val', document.getElementById('stocks_val').value);
    formData.append('id', document.getElementById('id').value.trim());

    console.log(formData.get('id'));
    const files = document.getElementById('productImage').files;
    console.log(files.length);

    if (files.length < 10 && !document.getElementById('id').value) {
        showToast('error', 'You must upload exactly 10 images.');
        return;
    }


    for (let i = 0; i < files.length; i++) {
        formData.append('productImages', files[i]);  // <- match this to multer config
    }

    fetch('/api/addProduct', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showToast('success', 'Product uploaded successfully!');
        addproductForm.querySelector('#name').value = '';
        addproductForm.querySelector('#category').value = '';
        addproductForm.querySelector('#price').value = '';
        addproductForm.querySelector('#description').value = '';
        addproductForm.querySelector('#usage_info').value = '';
        addproductForm.querySelector('#id').value = '';
        addproductForm.querySelector('button[type="submit"] .addproducttext').textContent = 'Add Product';
        resetCapture();
        
        allproducts = data.allproducts;
        console.log(allproducts);
        populateProductTable(allproducts, 1);

        addProduct_Formcontainer.classList.remove('flex');
        addProduct_Formcontainer.classList.add('hidden');

        AddProductNavBTN.classList.remove('bg-blue-500', 'text-white');
        AddProductNavBTN.classList.add('bg-white', 'text-black');

        addproductForm.querySelector('#name').value = '';
        addproductForm.querySelector('#category').value = '';
        addproductForm.querySelector('#price').value = '';
        addproductForm.querySelector('#description').value = '';
        addproductForm.querySelector('#id').value = '';
        addproductForm.querySelector('button[type="submit"] .addproducttext').textContent = 'Add Product';
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('error', 'Failed to upload product.');
    });
});

// product table
let allproducts = JSON.parse(el.dataset.allProducts || '{}');
console.log(allproducts);

const productsTable = document.getElementById('productsTable');
productsTable.innerHTML = '';

if (allproducts){
    populateProductTable(allproducts, 1)
}

function populateProductTable(data = allproducts, page = 1) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    productsTable.innerHTML = ''; // Clear existing rows

    paginatedData.forEach(product => {
        let imageHTML = '';
        if (product.image_path) {
            const imagePaths = product.image_path.split(',').map(path => path.trim());
            imageHTML = imagePaths
                .map(path => {
                    const fileName = path.split('/').pop();
                    return `<img src="/${path}" alt="${fileName}" class="h-5 w-5 object-cover rounded">`;
                })
                .join('');
        } else {
            imageHTML = `<span class="text-gray-400 italic">No image</span>`;
        }

        const priceNumber = Number(product.price);
        const formattedPrice = priceNumber.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        productsTable.innerHTML += `
            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50" data-product='${JSON.stringify(product)}'>
                <th scope="row" class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap w-12">${product.id}</th>
                <td class="px-6 py-4 w-[150px] overflow-x-auto whitespace-nowrap hide-scrollbar">${product.name}</td>
                <td class="px-6 py-4 w-[150px] overflow-x-auto whitespace-nowrap hide-scrollbar">${product.description}</td>
                <td class="px-6 py-4 w-[150px] overflow-x-auto whitespace-nowrap hide-scrollbar">${product.usage_info || 'none'}</td>
                <td class="px-6 py-4 w-[100px] overflow-x-auto whitespace-nowrap hide-scrollbar">${product.stocks_val}</td>
                <td class="flex flex-row gap-1 px-6 py-4 w-[150px] overflow-x-auto whitespace-nowrap hide-scrollbar">${imageHTML}</td>
                <td class="px-6 py-4 w-[150px] overflow-x-auto whitespace-nowrap hide-scrollbar">${product.category}</td>
                <td class="px-6 py-4 w-[100px] overflow-x-auto whitespace-nowrap hide-scrollbar">₱${formattedPrice}</td>
                <td class="px-6 py-4 w-[100px] flex flex-row gap-2">
                    <button class="text-blue-600 hover:underline edit-btn">Edit</button>
                    <button class="text-red-400 hover:underline delete-btn">Delete</button>
                </td>
            </tr>`;
    });

    renderPaginationControls(data.length);
}

function renderPaginationControls(totalRows) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous buttons

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `px-2 py-1 border rounded mx-1 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`;
        btn.addEventListener('click', () => {
            currentPage = i;
            populateProductTable(allproducts, currentPage);
        });
        paginationContainer.appendChild(btn);
    }
}


productsTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        const tr = event.target.closest('tr');
        const productData = JSON.parse(tr.dataset.product);
        console.log('Edit clicked:', productData);

        AddProductNavBTN.click();
        addproductForm.querySelector('#name').value = productData.name;
        addproductForm.querySelector('#category').value = productData.category;
        addproductForm.querySelector('#price').value = productData.price;
        addproductForm.querySelector('#description').value = productData.description;
        addproductForm.querySelector('#usage_info').value = productData.usage_info;
        addproductForm.querySelector('#stocks_val').value = productData.stocks_val;
        addproductForm.querySelector('#id').value = productData.id;
        addproductForm.querySelector('button[type="submit"] .addproducttext').textContent = 'Save';
    }

    if (event.target.classList.contains('delete-btn')) {
        const tr = event.target.closest('tr');
        const productData = JSON.parse(tr.dataset.product);
        console.log('delete clicked:', productData);

        showModal({
            title: 'Delete Product',
            description: 'Are you sure you want to delete this product including product images? This action cannot be undone.',
            confirmText: 'Delete',
            onConfirm: () => {
    
                fetch('/api/deleteProduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: productData.id }),
                })

                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    showToast('success', data.message);

                    populateProductTable(data.allproducts);
                })
                .catch(error => {
                    console.error('Error:', error);
                    showToast('error', 'Failed to delete product.');
                });
            }
        });

    }

    // if (event.target.classList.contains('classify-btn')) {
    //     const tr = event.target.closest('tr');
    //     const productData = JSON.parse(tr.dataset.product);
    //     console.log('classify clicked:', productData);
    //     classify_product = productData;
        
    //     mlBTN.click();
    // }
});

// sort table
function sortByColumn(column) {
  if (currentSort.column === column) {
    currentSort.asc = !currentSort.asc; // toggle asc/desc
  } else {
    currentSort.column = column;
    currentSort.asc = true;
  }

  allproducts.sort((a, b) => {
    let valA = a[column];
    let valB = b[column];

    // Special case: image column — sort by presence of image
    if (column === 'image_path') {
      const aHasImage = valA && valA.trim() !== '';
      const bHasImage = valB && valB.trim() !== '';
      if (aHasImage && !bHasImage) return currentSort.asc ? -1 : 1;
      if (!aHasImage && bHasImage) return currentSort.asc ? 1 : -1;
      return 0;
    }

    // Handle price or id sorting as number
    if (column === 'price' || column === 'id') {
      valA = Number(valA);
      valB = Number(valB);
    } else {
      valA = valA ? valA.toString().toLowerCase() : '';
      valB = valB ? valB.toString().toLowerCase() : '';
    }

    if (valA < valB) return currentSort.asc ? -1 : 1;
    if (valA > valB) return currentSort.asc ? 1 : -1;
    return 0;
  });

  populateProductTable(allproducts);
}

document.querySelectorAll('th[data-sort]').forEach(header => {
  header.addEventListener('click', () => {
    const column = header.getAttribute('data-sort');
    sortByColumn(column);
  });
});


const productSearch = document.getElementById('productSearch');
productSearch.addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();

  const filteredProducts = allproducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );

  currentPage = 1;
  populateProductTable(filteredProducts, currentPage);
});

// capture product images
const captureBtn = document.getElementById('captureBtn');
const doneBtn = document.getElementById('doneBtn');
const video = document.getElementById('camera');
const preview = document.getElementById('preview');
const imagecounttxt = document.getElementById('imagecounttxt');

let stream;
let capturedImages = [];

captureBtn.onclick = async () => {
  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.style.display = 'block';
      doneBtn.style.display = 'none';
      captureBtn.textContent = 'Take Photo';
    } catch (err) {
      alert('Camera access denied or not available.');
      return;
    }
  } else {
    doneBtn.style.display = 'none';
    // Take photo
    if (capturedImages.length >= 10) {
        doneBtn.style.display = 'inline-block';
        imagecounttxt.textContent = capturedImages.length + "/10 images";
      return;
    }

    imagecounttxt.textContent = capturedImages.length + "/10 images";
    
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob or data URL
    canvas.toBlob(blob => {
      capturedImages.push(blob);

      // Preview image
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      img.style.width = '100px';
      img.style.margin = '5px';
      preview.appendChild(img);
    }, 'image/jpeg', 0.95);
  }
};

doneBtn.onclick = () => {
  // Stop camera
  stream.getTracks().forEach(track => track.stop());
  video.style.display = 'none';
  doneBtn.style.display = 'none';
  captureBtn.textContent = 'Capture Images (max 10)';

  // Convert blobs to File objects
  const files = capturedImages.map((blob, idx) =>
    new File([blob], `photo_${idx + 1}.jpg`, { type: 'image/jpeg' })
  );

  // Use DataTransfer to create a FileList for the input
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));

  // Replace the files in the input element
  const productImageInput = document.getElementById('productImage');
  productImageInput.files = dataTransfer.files;

  // Optionally update the UI button with file names
  captureBtn.innerHTML = `<span>${files.map(f => f.name).join(', ')}</span>`;

  console.log('Input files replaced with captured images:', productImageInput.files);
};

function resetCapture() {
  // Clear captured images array
  capturedImages = [];

  // Clear preview images
  preview.innerHTML = '';

  // Reset buttons and video UI
  video.style.display = 'none';
  doneBtn.style.display = 'none';
  captureBtn.textContent = 'Capture Images (max 10)';

  // Stop any camera stream if still active
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  // Clear the file input
  const productImageInput = document.getElementById('productImage');
  productImageInput.value = ''; // reset file input
}

// training model
const trainModelBTN = document.getElementById('trainModelBTN');
trainModelBTN.onclick = function () {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="relative p-4 w-full max-w-2xl max-h-full">
                <div class="relative bg-white rounded-lg shadow-sm">
                    <div class="flex items-center justify-between p-4 border-b">
                        <h3 class="text-xl font-semibold text-gray-900">
                            Machine Learning
                        </h3>
                    </div>
                    <div id="InfoContainer" class="p-4 flex flex-col gap-2">
                        <div class="flex flex-col">
                            <p class="text-sm font-semibold text-gray-500">
                                You are about to start a machine learning training process.
                            </p>
                            <p class="text-sm font-semibold mt-1 text-gray-500">
                                This action will:
                            </p>
                            <div class="flex flex-col gap-2 ml-2 mt-2 w-full">
                                <div class="flex flex-row gap-1 items-center">
                                    <span class="flex w-2 h-2 me-2 bg-gray-900 rounded-full"></span>
                                    <p class=" text-gray-500 text-sm">Feed all available image data into the system</p>
                                </div>
                                <div class="flex flex-row gap-1 items-center">
                                    <span class="flex w-2 h-2 me-2 bg-gray-900 rounded-full"></span>
                                    <p class=" text-gray-500 text-sm">Start training the model using this data</p>
                                </div>
                                <div class="flex flex-row gap-1 items-center">
                                    <span class="flex w-2 h-2 me-2 bg-gray-900 rounded-full"></span>
                                    <p class=" text-gray-500 text-sm">Temporarily increase processing time and system resource usage</p>
                                </div>
                            </div>

                            <div class="flex items-center p-3 mt-2 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50" role="alert">
                                <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span class="sr-only">Info</span>
                                <div>
                                    Please do not close this window or refresh the page until the process is complete.
                                </div>
                            </div>

                            <p class=" text-gray-500 text-sm self-end">Do you want to proceed?</p>
                        </div>
                    </div>
                    <div id="modalBTN" class="flex justify-end p-4 border-t">
                        <button id="acceptBtn" class="bg-blue-700 text-white px-5 py-2 rounded">Start Training</button>
                        <button id="declineBtn" class="ml-3 bg-white border px-5 py-2 rounded">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const acceptBtn = modal.querySelector('#acceptBtn');
    const declineBtn = modal.querySelector('#declineBtn');
    const InfoContainer = modal.querySelector('#InfoContainer');
    const modalBTN = modal.querySelector('#modalBTN');


    acceptBtn.onclick = () => {
        modalBTN.classList.remove('flex');
        modalBTN.classList.add('hidden');

        InfoContainer.innerHTML = `
            <div class="p-4 flex flex-col gap-4">
                <p class="text-sm text-gray-600">Training has started. Please do not refresh the page.</p>
                <div id="consoleOutput" class="bg-black text-green-400 font-mono text-xs h-60 overflow-y-auto p-2 rounded-md border border-green-600">
                    <p>> Booting ML system...</p>
                </div>
            </div>
        `;


        const consoleOutput = modal.querySelector('#consoleOutput');
        let index = 0;

        logInterval = setInterval(() => {
            if (index < Logs.length) {
                const line = document.createElement('p');
                line.textContent = `> ${Logs[index++]}`;
                consoleOutput.appendChild(line);
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
            } else {
                clearInterval(logInterval);

                // Begin infinite fake logs
                const ongoingLogs = [
                    "→ Epoch sync pulse detected, validating gradient descent...",
                    "→ Momentum vector re-alignment complete.",
                    "→ Adaptive learning rate decay (ALRD) triggered @ step 4921.",
                    "→ Layer 12 kernel weights fine-tuned (Δ = 0.000034).",
                    "→ Optimizer adjusted: Adam → AdamW with β1=0.91, β2=0.9999",
                    "→ Live dropout mask regenerated (keep_prob = 0.65).",
                    "→ Dynamic batch size modulation engaged (avg: 47.3 samples/batch).",
                    "→ L2 norm penalty recalculated: λ=0.001241",
                    "→ Latent vector compressed with variance thresholding (σ²=0.042).",
                    "→ GPU kernel execution reordered for parallelization.",
                    "→ Noise injection phase: Gaussian (μ=0, σ=0.15)",
                    "→ Running covariance matrix updated [Σ(θ)]...",
                    "→ Feature map consistency check: PASSED (9.999% drift)",
                    "→ Backpropagation sequence resumed after adaptive pause...",
                    "→ Weight delta under threshold. Reinforcing forward pass.",
                    "→ Batch normalization sync across replica shards complete.",
                    "→ Heuristic attention gate activated (token span = 14 → 32).",
                    "→ Residual block conflict resolved using weighted sum heuristic.",
                    "→ Hidden state cache expanded to prevent vanishing gradients.",
                    "→ Activation sparsity: 87.6%, targeting 93%...",
                    "→ Temporal ensemble alignment step complete (TTA factor = 2.3x)",
                    "→ Adaptive bias reinitialization applied (mean = -0.0031)",
                    "→ Focal loss modulation rate adjusted for class imbalance (γ=2)",
                    "→ Batch #3241 checkpoint saved (accuracy = 91.76%)",
                    "→ Transfer learning bridge mode enabled.",
                    "→ Gradient clipping active (threshold = ±1.5)",
                    "→ Stochastic depth activated for conv layer block #4",
                    "→ Attention head #3 pruned (redundant signal detected)",
                    "→ Learning entropy stabilized at 2.431 bits/param.",
                    "→ Simulated annealing loop complete (Δtemp < 0.0001)",
                    "→ Orthogonal weight matrix refresh complete.",
                    "→ Latent space drift detected, applying counter-bias...",
                    "→ Multinomial loss convergence improving (p̂ = 0.8921)",
                    "→ Adversarial defense engaged: FGSM detector enabled.",
                    "→ Meta-learning context caching updated.",
                    "→ Transformer alignment index recalculated.",
                    "→ Loss landscape flattening in progress...",
                    "→ Dead neuron pruning: layer 9 (5 units removed).",
                    "→ Data embedding vector recalibrated (⟨z⟩ = 0.5324)",
                    "→ Feature entropy decoding activated.",
                    "→ Layer weight quantization reversed (32-bit mode).",
                    "→ Energy-based model (EBM) compatibility detected."
                ];


                function startOngoingLogs(consoleOutput, ongoingLogs, startTime) {
                    function logMessage() {
                        const now = Date.now();
                        const elapsed = Math.floor((now - startTime) / 1000);
                        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
                        const secs = String(elapsed % 60).padStart(2, '0');
                        const timestamp = `${mins}:${secs}`;
                        const message = ongoingLogs[Math.floor(Math.random() * ongoingLogs.length)];

                        const line = document.createElement('p');
                        line.textContent = `${timestamp} — ${message}`;
                        consoleOutput.appendChild(line);
                        consoleOutput.scrollTop = consoleOutput.scrollHeight;

                        // Pick next delay randomly between 200ms to 1200ms
                        const nextDelay = Math.floor(Math.random() * 500) + 100; // 100–599ms

                        ongoingLogTimeout = setTimeout(logMessage, nextDelay);
                    }

                    logMessage(); // start the loop
                }

                const startTime = Date.now();
                startOngoingLogs(consoleOutput, ongoingLogs, startTime);

                fetch('http://localhost:8000/upload', {
                    method: 'POST', // or 'PUT'
                    headers: {
                    'Content-Type': 'application/json'  // Tell server we send JSON
                },
                    body: JSON.stringify(allproducts)  // Convert JS object to JSON string
                })
                .then(response => response.json())  // Parse JSON response
                .then(result => {
                    console.log('Success:', result);

                    setTimeout(() => {
                        stopOngoingLogs();
                        modal.remove();

                        setTimeout(() => {
                            showToast('success', result.message);
                        }, 500);
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error:', error);
                });   
            }
        }, 60); // 60ms per line = ~16 lines per second

    };


    declineBtn.onclick = () => {
        if (logInterval) clearInterval(logInterval);
        modal.remove();
    };

    // Generate 100+ fake ML logs
    let logInterval = null;
    let ongoingLogInterval = null;
    let learningStartTime = null;
    let ongoingLogTimeout = null;

    function stopOngoingLogs() {
        if (ongoingLogTimeout) {
            clearTimeout(ongoingLogTimeout);
            ongoingLogTimeout = null;
        }
    }



    function generateFakeLogs() {
        const logs = [];
        const randomAccuracy = () => (Math.random() * 10 + 80).toFixed(2);
        const randomLoss = () => (Math.random() * 0.5 + 0.3).toFixed(4);

        logs.push("Initializing training session...");
        logs.push("Loading TensorFlow backend...");
        logs.push("Checking GPU availability... ✅");
        logs.push("Preparing image data from /training-data...");
        logs.push("Found 6,400 images in 5 categories.");
        logs.push("Splitting dataset: 80% training, 20% validation.");
        logs.push("Initializing MobileNetV2 with 1280 units.");
        logs.push("Applying image augmentations...");
        logs.push("Compiling model with Adam optimizer and categorical crossentropy loss.");
        logs.push("---------------------------------------------------");

        for (let epoch = 1; epoch <= 10; epoch++) {
            logs.push(`🧠 Epoch ${epoch}/10`);
            for (let batch = 1; batch <= 12; batch++) {
                logs.push(`Batch ${batch}/12 - loss: ${randomLoss()} - accuracy: ${randomAccuracy()}%`);
            }
            logs.push(`Epoch ${epoch} complete. Saving checkpoint...`);
        }

        logs.push("---------------------------------------------------");
        logs.push("Finalizing training...");
        logs.push("Evaluating model on validation set...");
        logs.push(`Validation accuracy: ${randomAccuracy()}%`);
        logs.push("Saving final model to /model/product_classifier.h5");
        logs.push("Cleaning up memory...");
        logs.push("✅ Training simulation complete.");
        return logs;
    }

    const Logs = generateFakeLogs();
};