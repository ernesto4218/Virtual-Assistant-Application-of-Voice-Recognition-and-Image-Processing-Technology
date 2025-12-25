// Function to check if restriction already exists
function restrictionExists(restrictionText) {
const badges = document.querySelectorAll('#badge-container span');
return Array.from(badges).some(badge => badge.firstChild.textContent.trim() === restrictionText);
}

// Function to add badge dynamically
function addRestrictionBadge(restrictionText) {
if (restrictionExists(restrictionText)) {
    showToast('error', 'Restirctions already added.');

    return;
}

const badgeContainer = document.getElementById('badge-container');
const badgeId = `badge-${Date.now()}`; // unique id based on timestamp

const span = document.createElement('span');
span.id = badgeId;
span.className = 'inline-flex items-center px-2 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-sm dark:bg-gray-700 dark:text-gray-300';
span.innerHTML = `
    ${restrictionText}
    <button type="button" class="inline-flex items-center p-1 ms-2 text-sm text-gray-400 bg-transparent rounded-xs hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300"
            onclick="removeBadge('${badgeId}')" aria-label="Remove">
        <svg class="w-2 h-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
        <span class="sr-only">Remove badge</span>
    </button>
`;
badgeContainer.appendChild(span);
}

// Listen for select change
document.getElementById('restrictions').addEventListener('change', function() {
const selectedRestriction = this.value;
if (selectedRestriction) {
    addRestrictionBadge(selectedRestriction);
    this.selectedIndex = 0; // reset select back to 'Choose'
}
});

// Remove badge function (you probably already have this)
function removeBadge(badgeId) {
const badge = document.getElementById(badgeId);
if (badge) {
    badge.remove();
    showToast('warning', 'Restirctions removed.');
};
}

const saveConfigBTN = document.getElementById('saveConfigBTN');
saveConfigBTN.onclick = function() {
    const api_key = document.getElementById('api_key').value.trim();
    const instructions = document.getElementById('instructions').value.trim();

    const badges = document.querySelectorAll('#badge-container > span');
    const restrictions = Array.from(badges).map(badge => {
        // Clone the badge and remove the button before extracting text
        const clone = badge.cloneNode(true);
        const button = clone.querySelector('button');
        if (button) button.remove();
        return clone.textContent.trim();
    }).join(',');

    // console.log(restrictions);
    const data = {
        api_key: api_key,
        instructions: instructions,
        restrictions: restrictions,
        recognition_model: checkSelectedRecognition()
    };

    fetch('/api/saveconfig', {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json'  // Tell server we send JSON
    },
        body: JSON.stringify(data)  // Convert JS object to JSON string
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

const restrictionSelect = document.getElementById('restrictions');
const badgeContainer = document.getElementById('badge-container');

const restrictionList = el.dataset.restrictions.split(',').map(x => x.trim());
const selectedrestrictionList = el.dataset.selectedRestrictions.split(',').map(x => x.trim());

// Render restriction options
restrictionList.forEach(restriction => {
    const option = document.createElement("option");
    option.value = restriction;
    option.textContent = restriction;
    restrictionSelect.appendChild(option);
});

// Render selected restriction badges
selectedrestrictionList.forEach((item, index) => {
    const trimmedItem = item.trim();
    if (!trimmedItem) return;

    const badgeId = `badge-${index}`;
    const span = document.createElement("span");
    span.id = badgeId;
    span.className = "badge_name inline-flex items-center px-2 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-sm dark:bg-gray-700 dark:text-gray-300";
    span.innerHTML = `
        <span class="flex flex-row gap-2 items-center">
            <span class="badge_name">${trimmedItem}</span>
            <a href="javascript:void(0);" onclick="removeBadge('${badgeId}')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-4 h-4" fill="currentColor">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </a>
        </span>
    `;

    badgeContainer.appendChild(span);
});

// Badge removal function
function removeBadge(id) {
    const badge = document.getElementById(id);
    if (badge) badge.remove();
}

// navigation
const AssistantNavBTN = document.getElementById('AssistantNavBTN');
AssistantNavBTN.onclick = function() {
    assistant_component.classList.remove('hidden');
    assistant_component.classList.add('flex');

    products_component.classList.remove('flex');
    products_component.classList.add('hidden');

    machinelearning_component.classList.remove('flex');
    machinelearning_component.classList.add('hidden');

    // nav btn styles
    AssistantNavBTN.classList.remove('bg-white', 'text-black');
    AssistantNavBTN.classList.add('bg-blue-500', 'text-white');

    ProductNavBTN.classList.remove('bg-blue-500', 'text-white');
    ProductNavBTN.classList.add('bg-white', 'text-black');

};

const ProductNavBTN = document.getElementById('ProductNavBTN');
ProductNavBTN.onclick = function() {
    assistant_component.classList.remove('flex');
    assistant_component.classList.add('hidden');

    products_component.classList.remove('hidden');
    products_component.classList.add('flex');

    machinelearning_component.classList.remove('flex');
    machinelearning_component.classList.add('hidden');

    // nav btn styles
    ProductNavBTN.classList.remove('bg-white', 'text-black');
    ProductNavBTN.classList.add('bg-blue-500', 'text-white');

    AssistantNavBTN.classList.remove('bg-blue-500', 'text-white');
    AssistantNavBTN.classList.add('bg-white', 'text-black');

    mlBTN.classList.remove('bg-blue-500', 'text-white');
    mlBTN.classList.add('bg-white', 'text-black');
};

AssistantNavBTN.click();

const mlBTN = document.getElementById('mlBTN');
mlBTN.onclick = function() {
    assistant_component.classList.remove('flex');
    assistant_component.classList.add('hidden');

    products_component.classList.remove('flex');
    products_component.classList.add('hidden');

    machinelearning_component.classList.remove('hidden');
    machinelearning_component.classList.add('flex');

    // nav btn styles
    ProductNavBTN.classList.add('bg-white', 'text-black');
    ProductNavBTN.classList.remove('bg-blue-500', 'text-white');

    AssistantNavBTN.classList.add('bg-white', 'text-black');
    AssistantNavBTN.classList.remove('bg-blue-500', 'text-white');

    mlBTN.classList.add('bg-blue-500', 'text-white');
    mlBTN.classList.remove('bg-white', 'text-black');

    const product_name = document.getElementById('product_name');
    product_name.textContent = classify_product.name;
    // console.log(CLASS_NAMES);
};

const checkboxes = document.querySelectorAll('.recognition-toggle');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      // Uncheck the other checkbox
      checkboxes.forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
      });
    }
  });
});

function checkSelectedRecognition() {
    const checkboxes = document.querySelectorAll('.recognition-toggle');
    let selectedValue = null;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedValue = checkbox.value;
      }
    });

    console.log('Selected recognition:', selectedValue);
    return selectedValue;
  }