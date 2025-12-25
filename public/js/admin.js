const el = document.getElementById('config-data');
const activities = JSON.parse(el.dataset.questions || '{}');
const recognitions = JSON.parse(el.dataset.recognitions || '{}');

const q_parent = document.getElementById('q_parent');
function populateCustomerActivites(data) {
    q_parent.innerHTML = '';

    const sortedData = data.sort((a, b) => b.id - a.id);

    sortedData.forEach((activity, index) => {
        const date = new Date(activity.created_at);
        const formattedDate = date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const newDiv = document.createElement('div');
        newDiv.classList.add("border-b");

        // Create the button
        const button = document.createElement('button');
        button.className = "inline-flex items-center gap-x-4 text-start w-full py-2 px-4";
        button.setAttribute("data-index", index);
        button.innerHTML = `
            <span class="text-gray-500 text-sm">#${activity.id}</span>
            <div class="text-gray-700 text-[12px] font-bold flex items-center gap-2 p-3">
                <span>${activity.question}</span>
                <span class="bg-gray-700 text-gray-300 text-xs font-medium px-[7px] py-[3px] rounded-sm">
                    Question
                </span>
            </div>

        `;

        // Create the collapsible content
        const content = document.createElement('div');
        content.className = "w-full overflow-hidden transition-[max-height] duration-300 max-h-0";
        content.innerHTML = `
            <div class="px-5 flex flex-col gap-2 py-3">
                <div class="text-gray-700 text-[12px] font-bold flex flex-col gap-2">
                    <div class="flex flex-row gap-2">
                        <span class="bg-emerald-700 text-emerald-300 text-xs font-medium px-[7px] py-[3px] rounded-sm w-fit">
                            Response
                        </span>

                        ${
                            activity.matched_item_name
                                ? `<span class="bg-yellow-600 text-yellow-300 text-xs font-medium px-[7px] py-[3px] rounded-sm w-fit">
                                    ${activity.matched_item_name}
                                </span>`
                                : ''
                        }
                    </div>
                    
                    <span class="text-gray-700 font-normal text-xs">${activity.response}</span>
                </div>
                <p class="text-gray-400 font-normal text-xs">${formattedDate}</p>
            </div>
        `;


        // Toggle logic on button click
        button.addEventListener('click', () => {
            if (content.style.maxHeight && content.style.maxHeight !== '0px') {
                content.style.maxHeight = '0px';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });

        newDiv.appendChild(button);
        newDiv.appendChild(content);
        q_parent.appendChild(newDiv);
    });
}

const image_recParent = document.getElementById('image_recParent');
function populateImageRecognition(data){
    image_recParent.innerHTML = '';

    const sortedData = data.sort((a, b) => b.id - a.id);
    sortedData.forEach(recognition => {
        const date = new Date(recognition.created_at);
        const formattedDate = date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const newDiv = document.createElement('div');

        newDiv.innerHTML = `
            <div class="mt-3 bg-white rounded-3xl flex flex-row p-2 gap-5">
                <div class="w-fit flex flex-row items-center">
                    <img class="w-[250px] rounded-3xl" src="${recognition.image_path}" alt="">
                </div>
                <div class="w-full flex flex-col gap-2">
                    <div class="flex flex-row gap-2 items-center">
                        <span class="text-gray-700 font-bold text-[12px]">${recognition.question}</span>
                        <span class="bg-gray-700 text-gray-300 text-xs font-medium px-[7px] py-[3px] rounded-sm">
                            Question
                        </span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-gray-700 font-normal text-xs">${recognition.matched_item_name || 'Item not found'}</span>
                        <span class="text-gray-700 font-normal text-xs">${recognition.matched_item_description || ""}</span>
                        <span class="bg-emerald-700 text-emerald-300 text-xs font-medium px-[7px] py-[3px] rounded-sm w-fit">
                            ₱${recognition.price || 0}
                        </span>
                        <p class="text-gray-400 font-normal text-xs">${formattedDate}</p>
                    </div>

                </div>
            </div>   
            `

        image_recParent.appendChild(newDiv);
    });
}


if (activities){
    console.log(activities);
    populateCustomerActivites(activities);
}

if (recognitions){
    populateImageRecognition(recognitions);
}

// filter
function loadQueries(data, range) {
  const today = new Date();
  let filteredData = [];

  // Filter data based on selected range
  if (range === "Today") {
    const todayStr = today.toISOString().split("T")[0];
    filteredData = data.filter(item => item.created_at.startsWith(todayStr));
  } else if (range === "Last 7 Days") {
    const last7 = new Date(today);
    last7.setDate(today.getDate() - 6);
    filteredData = data.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate >= last7 && itemDate <= today;
    });
  } else if (range === "Last 30 Days") {
    const last30 = new Date(today);
    last30.setDate(today.getDate() - 29);
    filteredData = data.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate >= last30 && itemDate <= today;
    });
  } else {
    filteredData = data; // All Time
  }

  // Group data
  const dateCounts = {};

  filteredData.forEach(item => {
    const dateObj = new Date(item.created_at);

    let key;
    if (range === "Today") {
      // Get hour (24h format) with leading zero
      const hour = dateObj.getHours().toString().padStart(2, "0");
      key = `${hour}:00`; // e.g., "14:00"
    } else {
      // Group by date
      key = item.created_at.split("T")[0];
    }

    if (!dateCounts[key]) {
      dateCounts[key] = 0;
    }
    dateCounts[key]++;
  });

  // Prepare x and y data
  let sortedKeys;
  if (range === "Today") {
    // Always show 24 hours even if empty
    sortedKeys = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0") + ":00");
  } else {
    sortedKeys = Object.keys(dateCounts).sort();
  }

  const chartData = {
    x: sortedKeys,
    y: sortedKeys.map(key => dateCounts[key] || 0), // fill 0 if no data
  };

  // ApexCharts options
  const options = {
    chart: {
      height: "300px",
      maxWidth: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: "#6366f1", opacity: 0.4 },
          { offset: 100, color: "#8b5cf6", opacity: 0 },
        ],
      },
    },
    colors: ["#6366f1"],
    tooltip: { enabled: true },
    legend: { show: false },
    series: [
      {
        name: "Questions",
        data: chartData.y,
      },
    ],
    xaxis: {
      categories: chartData.x,
      labels: {
        show: true,
        rotate: range === "Today" ? -45 : 0,
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        style: { fontSize: "14px" },
      },
    },
  };

  if (
    document.getElementById("area-chart-flexible") &&
    typeof ApexCharts !== "undefined"
  ) {
    const chart = new ApexCharts(
      document.getElementById("area-chart-flexible"),
      options
    );
    chart.render();
  }
}

const dropdownList = document.getElementById('dropdownList');
dropdownList.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      event.preventDefault(); // prevent default anchor behavior
      const selectedText = event.target.textContent.trim();
      handleSelection(selectedText);
    }
});

function handleSelection(selection) {
  console.log("User selected:", selection);
  document.getElementById('selectedDropdownTXT').textContent = selection;

  document.getElementById('area-chart-flexible').innerHTML = '';
  loadQueries(activities, selection); // Pass the selection to loadQueries
}


function triggerClickOnItem(textToClick) {
    const links = dropdownList.querySelectorAll('a');
    for (let link of links) {
      if (link.textContent.trim() === textToClick) {
        link.click(); // Triggers the click event
        break;
      }
    }
  }

// Example usage
handleSelection('Today')


// most asked product
function loadMostAskedProducts(data, range) {
  const today = new Date();
  let filteredData = [];

  // Filter by range
  if (range === "Today") {
    const todayStr = today.toISOString().split("T")[0];
    filteredData = data.filter(item => item.created_at.startsWith(todayStr));
  } else if (range === "Last 7 Days") {
    const last7 = new Date(today);
    last7.setDate(today.getDate() - 6);
    filteredData = data.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate >= last7 && itemDate <= today;
    });
  } else if (range === "Last 30 Days") {
    const last30 = new Date(today);
    last30.setDate(today.getDate() - 29);
    filteredData = data.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate >= last30 && itemDate <= today;
    });
  } else {
    filteredData = data;
  }

  // Count questions per product
  const productCounts = {};
  filteredData.forEach(item => {
    const product = item.matched_item_name || "Unknown";
    if (!productCounts[product]) productCounts[product] = 0;
    productCounts[product]++;
  });

  // Prepare chart data (top 10 products)
  const sortedProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const chartData = {
    x: sortedProducts.map(item => item[0]),
    y: sortedProducts.map(item => item[1]),
  };

  const options = {
    chart: {
      type: 'bar',
      height: '300px',
      toolbar: { show: false },
    },
    series: [{
      name: 'Questions',
      data: chartData.y
    }],
    xaxis: {
      categories: chartData.x,
      labels: { rotate: -45 }
    },
    dataLabels: { enabled: true },
    colors: ['#6366f1']
  };

  if (document.getElementById("most-asked-product-chart") && typeof ApexCharts !== "undefined") {
    const chart = new ApexCharts(document.getElementById("most-asked-product-chart"), options);
    chart.render();
  }
}

// Dropdown handling
const productDropdownList = document.getElementById('productDropdownList');
productDropdownList.addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
    event.preventDefault();
    const selectedText = event.target.textContent.trim();
    handleProductSelection(selectedText);
  }
});

function handleProductSelection(selection) {
  document.getElementById('selectedProductDropdownTXT').textContent = selection;
  document.getElementById('most-asked-product-chart').innerHTML = '';
  loadMostAskedProducts(activities, selection); // Use your data array
}

// Initialize
handleProductSelection('Today');
