const markersContainer = document.getElementById("markerContainer");
const cardStack = document.getElementById("cardStack");
const vehicleButtons = document.querySelectorAll(".tr-vehicle-selector button");

// Parse product data JSON from script tag
const productData = JSON.parse(
  document.getElementById("vehicle-products").textContent
);

// Static position data
const vehicleData = {
  jeep: [
    { pos: ["30%", "13%"] },
    { pos: ["82%", "26%"] },
    { pos: ["35%", "55%"] },
    { pos: ["60%", "63%"] },
    { pos: ["37%", "76%"] },
    { pos: ["25%", "90%"] },
    { pos: ["51%", "89%"] },
  ],
  truck: [
    { pos: ["60%", "18%"] },
    { pos: ["25%", "23%"] },
    { pos: ["12%", "42%"] },
    { pos: ["67%", "63%"] },
    { pos: ["29%", "73%"] },
    { pos: ["40%", "84%"] },
  ],
  car: [
    { pos: ["67%", "13%"] },
    { pos: ["43%", "30%"] },
    { pos: ["14%", "48%"] },
    { pos: ["28%", "62%"] },
    { pos: ["48%", "80%"] },
  ],
  motorcycle: [
    { pos: ["28%", "21%"] },
    { pos: ["45%", "30%"] },
    { pos: ["59%", "49%"] },
    { pos: ["56%", "78%"] },
    { pos: ["69%", "88%"] },
  ],
  cybertruck: [
    { pos: ["80%", "10%"] },
    { pos: ["45%", "16%"] },
    { pos: ["12%", "34%"] },
    { pos: ["70%", "63%"] },
    { pos: ["23%", "84%"] },
  ],
};

// Merge product data into vehicleData
for (const type in vehicleData) {
  const products = productData[type] || [];

  vehicleData[type] = vehicleData[type].map((marker, index) => {
    const product = products[index];
    return {
      ...marker,
      title: product?.title ?? "",
      price: product?.price ?? "",
      img: product?.img ?? "",
      url: product?.url ?? "",
    };
  });
}

const vehicleOrder = ["jeep", "truck", "car", "motorcycle", "cybertruck"];
let currentVehicleIndex = 0;

const carousel = document.querySelector(".tr-carousel-images");
const images = document.querySelectorAll(".tr-carousel-images img");

function changeVehicle(offset) {
  currentVehicleIndex =
    (currentVehicleIndex + offset + vehicleOrder.length) % vehicleOrder.length;

  const nextVehicle = vehicleOrder[currentVehicleIndex];

  // Move the carousel to the correct image
  const imageWidth = images[0].clientWidth;
  carousel.style.transform = `translateX(-${
    currentVehicleIndex * imageWidth
  }px)`;

  // Highlight active vehicle button if buttons exist
  vehicleButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.vehicle === nextVehicle);
  });

  // Call your custom render function
  renderVehicle(nextVehicle);
}

// Handle prev/next button clicks
document.querySelector(".tr-prev-btn").addEventListener("click", () => {
  changeVehicle(-1);
});

document.querySelector(".tr-next-btn").addEventListener("click", () => {
  changeVehicle(1);
});

const buttons = document.querySelectorAll(".tr-vehicle-selector button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Optional logic
    const vehicleType = button.dataset.vehicle;
  });
});

function renderVehicle(vehicle) {
  markersContainer.innerHTML = "";
  cardStack.innerHTML = "";
  const parts = vehicleData[vehicle];

  parts.forEach((part, index) => {
    const marker = document.createElement("div");
    marker.className = "tr-marker";
    marker.style.top = part.pos[0];
    marker.style.left = part.pos[1];
    marker.textContent = index + 1;
    marker.dataset.index = index;
    markersContainer.appendChild(marker);

    const card = document.createElement("div");
    card.className = "tr-card";
    card.innerHTML = `<a href="${part.url || "#"}" class="tr-a">
    <div class="tr-card-badge">${index + 1}</div>
    <img src="${part.img}" alt="${part.title}" />
    <div class="tr-card-body">
      <div class="tr-card-info">
        <h4>${part.title}</h4>
        <p>${part.price}</p>
      </div>
       <a href="${
         part.url || "#"
       }" class="tr-view-btn">VIEW PRODUCT <span>❯</span></a>
    </div>
    </a>
    
  `;
    cardStack.appendChild(card);

    marker.addEventListener("click", () => {
      document
        .querySelectorAll(".tr-marker, .tr-card")
        .forEach((el) => el.classList.remove("active"));
      marker.classList.add("active");
      card.classList.add("active");
      card.scrollIntoView({ behavior: "smooth", inline: "center" });
    });

    card.addEventListener("click", () => {
      document
        .querySelectorAll(".tr-marker, .tr-card")
        .forEach((el) => el.classList.remove("active"));
      card.classList.add("active");
      marker.classList.add("active");
    });

    card.addEventListener("mouseover", () => {
      marker.classList.add("active");
    });

    card.addEventListener("mouseout", () => {
      // Only remove if not clicked
      if (!card.classList.contains("active")) {
        marker.classList.remove("active");
      }
    });
  });
}

vehicleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const vehicleType = button.dataset.vehicle;
    const targetIndex = vehicleOrder.indexOf(vehicleType);

    if (targetIndex === -1) return;

    currentVehicleIndex = targetIndex;

    // Move the carousel to the correct image
    const imageWidth = images[0].clientWidth;
    carousel.style.transform = `translateX(-${
      currentVehicleIndex * imageWidth
    }px)`;

    vehicleButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    renderVehicle(vehicleType);
  });
});

renderVehicle("jeep");

let isDown = false;
let startX;
let scrollLeft;

cardStack.addEventListener("mousedown", (e) => {
  isDown = true;
  cardStack.classList.add("active");
  startX = e.pageX - cardStack.offsetLeft;
  scrollLeft = cardStack.scrollLeft;
});

cardStack.addEventListener("mouseleave", () => {
  isDown = false;
  cardStack.classList.remove("active");
});

cardStack.addEventListener("mouseup", () => {
  isDown = false;
  cardStack.classList.remove("active");
});

cardStack.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - cardStack.offsetLeft;
  const walk = (x - startX) * 2;
  cardStack.scrollLeft = scrollLeft - walk;
});

// Deselect marker and card on outside click
document.addEventListener("click", (e) => {
  const isMarker = e.target.classList.contains("tr-marker");
  const isCard = e.target.closest(".tr-card");

  if (!isMarker && !isCard) {
    document.querySelectorAll(".tr-marker, .tr-card").forEach((el) => {
      el.classList.remove("active");
    });
  }
});
