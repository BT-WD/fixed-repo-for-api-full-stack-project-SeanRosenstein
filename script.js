const API_KEY = "oRlnjWXbBOXT65QqG1fTQebp1fScWb1h1AnCICQG";

const titleEl = document.getElementById("title");
const imgEl = document.getElementById("apod-image");
const descEl = document.getElementById("description");
const loadBtn = document.getElementById("load-btn");
const datePicker = document.getElementById("date-picker");
const saveBtn = document.getElementById("save-btn");
const favoritesList = document.getElementById("favorites-list");

let currentData = null;

// Fetch APOD
async function fetchAPOD(date = "") {
  try {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    if (date) {
      url += `&date=${date}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    console.log("API DATA:", data);

    currentData = data;

    titleEl.textContent = data.title;
    descEl.textContent = data.explanation;

    if (data.media_type === "image") {
      imgEl.src = data.url;
      imgEl.style.display = "block";
      imgEl.classList.remove("loaded");

      imgEl.onload = () => {
        imgEl.classList.add("loaded");
      };
    } else {
      imgEl.style.display = "none";
      descEl.textContent = "This APOD is a video. Visit NASA site to watch.";
    }

  } catch (error) {
    console.error("Error fetching APOD:", error);
    titleEl.textContent = "Error loading data.";
    descEl.textContent = "Check console for details.";
  }
}

// Save to localStorage
function saveToFavorites(data) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Prevent duplicates
  const exists = favorites.some(item => item.date === data.date);
  if (!exists) {
    favorites.push(data);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// Load favorites from localStorage
function loadFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favoritesList.innerHTML = "";

  favorites.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("favorite-item");

    div.innerHTML = `
      <h3>${item.title}</h3>
      <img src="${item.url}" alt="${item.title}">
      <p>${item.date}</p>
      <button onclick="removeFavorite('${item.date}')">Remove</button>
    `;

    favoritesList.appendChild(div);
  });
}

// Remove favorite
function removeFavorite(date) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.filter(item => item.date !== date);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

// Event: Load button
loadBtn.addEventListener("click", () => {
  const selectedDate = datePicker.value;
  fetchAPOD(selectedDate);
});

// Event: Save button
saveBtn.addEventListener("click", () => {
  if (currentData) {
    saveToFavorites(currentData);
    loadFavorites();
  }
});

// Initial load
fetchAPOD();
loadFavorites();