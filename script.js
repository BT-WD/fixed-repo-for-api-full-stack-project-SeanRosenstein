document.addEventListener("DOMContentLoaded", () => {

  const API_KEY = "oRlnjWXbBOXT65QqG1fTQebp1fScWb1h1AnCICQG";

  const titleEl = document.getElementById("title");
  const imgEl = document.getElementById("apod-image");
  const descEl = document.getElementById("description");
  const loadBtn = document.getElementById("load-btn");
  const datePicker = document.getElementById("date-picker");
  const saveBtn = document.getElementById("save-btn");
  const favoritesList = document.getElementById("favorites-list");
  const loader = document.getElementById("loader");

  let currentData = null;
  let isLoading = false;

  // -------------------------
  // LOADING UI CONTROL
  // -------------------------
  function showLoading() {
    loader.style.display = "block";
    loadBtn.disabled = true;
    titleEl.textContent = "Loading...";
    descEl.textContent = "";
    imgEl.style.display = "none";
  }

  function hideLoading() {
    loader.style.display = "none";
    loadBtn.disabled = false;
  }

  // -------------------------
  // FETCH APOD (ROBUST)
  // -------------------------
  async function fetchAPOD(date = "") {
    try {
      showLoading();

      let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
      if (date) url += `&date=${date}`;

      console.log("Fetching:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("NASA API unavailable (503 or rate limit)");
      }

      const data = await response.json();

      currentData = data;

      titleEl.textContent = data.title;
      descEl.textContent = data.explanation;

      if (data.media_type === "image") {
        imgEl.src = data.url;
        imgEl.style.display = "block";
      } else {
        imgEl.style.display = "none";
        descEl.textContent = "This is a video APOD.";
      }

    } catch (error) {
      console.error("Error fetching APOD:", error);

      titleEl.textContent = "NASA API temporarily unavailable";
      descEl.textContent = "Try again in a few minutes.";
      imgEl.style.display = "none";

    } finally {
      hideLoading();
    }
  }

  // -------------------------
  // FAVORITES
  // -------------------------
  function saveToFavorites(data) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.some(item => item.date === data.date)) {
      favorites.push(data);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      loadFavorites();  // Re-load favorites list after saving
    }
  }

  function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesList.innerHTML = "";

    favorites.forEach(item => {
      const div = document.createElement("div");

      div.innerHTML = `
        <h3>${item.title}</h3>
        <img src="${item.url}" width="150">
        <p>${item.date}</p>
      `;

      favoritesList.appendChild(div);
    });
  }

  // -------------------------
  // EVENTS
  // -------------------------
  loadBtn.addEventListener("click", () => {
    fetchAPOD(datePicker.value);
  });

  saveBtn.addEventListener("click", () => {
    if (!currentData) {
      alert("No image loaded yet.");
      return;
    }

    saveToFavorites(currentData);
  });

  // -------------------------
  // INIT
  // -------------------------
  const today = new Date().toISOString().split('T')[0]; // Get today's date as YYYY-MM-DD format
  datePicker.value = today; // Set date picker to today's date
  fetchAPOD(today); // Load today's APOD by default
  loadFavorites(); // Load favorites on page load

});