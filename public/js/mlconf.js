const activeModelTXT = document.getElementById('activeModelTXT');
const dropArea = document.getElementById("drop-area");
const fileInputModel = document.getElementById("fileElemModel");

// Optional: handle file input change
fileInputModel.addEventListener("change", (e) => {
    handleFiles(e.target.files);
});

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight on drag over
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add("bg-gray-100"), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove("bg-gray-100"), false);
});

// Handle dropped files
dropArea.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
});

async function handleFiles(files) {
  const file = files[0];

  if (!file || !file.name.endsWith('.zip')) {
    return showToast('error', 'Please upload a .zip file only.');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload-model', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    showToast(data.status || 'success', data.message || 'File uploaded successfully.');
    setTimeout(() => {
        location.reload();
    }, 1000);
  } catch (err) {
    console.error(err);
    showToast('error', err.message || 'Upload failed.');
  }
}

document.querySelectorAll(".delete-model-btn").forEach(button => {
  button.addEventListener("click", async function () {
    const modelId = this.getAttribute("data-id");
    console.log(modelId);
    showModal({
        title: 'Delete Model?',
        description: 'Are you sure you want to delete this machine learning model? This action cannot be undone.',
        confirmText: 'Delete',
        onConfirm: async () => {
            console.log('Confirmed!');
            console.log("Clicked model ID:", modelId);

            try {
                const response = await fetch('/api/delete-model', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model_id: modelId }),
                });


                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                showToast(data.status || 'success', data.message || 'Model deleted successfully.');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } catch (err) {
                console.error(err);
                showToast('error', err.message || 'Delete failed.');
            }
        }
    });
  });
});

document.querySelectorAll(".use-model-btn").forEach(button => {
  button.addEventListener("click", async function () {
    const modelId = this.getAttribute("data-id");
    console.log("Clicked model ID:", modelId);

    const formData = new FormData();
    formData.append('model_id', modelId);

    try {
        const response = await fetch('/api/use-model', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model_id: modelId }),
        });


        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        document.querySelector("#activeModelTXT").textContent = data.model;

        showToast(data.status || 'success', data.message || 'Model activated.');

        setTimeout(() => {
            location.reload();
        }, 1000);
    } catch (err) {
        console.error(err);
        showToast('error', err.message || 'Upload failed.');
    }
  });
});