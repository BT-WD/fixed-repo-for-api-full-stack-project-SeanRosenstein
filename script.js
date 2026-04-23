const API_KEY = "oRlnjWXbBOXT65QqG1fTQebp1fScWb1h1AnCICQG";

const titleEl = document.getElementById("title");
const imgEl = document.getElementById("apod-image");
const descEl = document.getElementById("description");
const loadBtn = document.getElementById("load-btn");
const datePicker = document.getElementById("date-picker");

async function fetchAPOD(date = "") {
  try {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    if (date) {
      url += `&date=${date}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    titleEl.textContent = data.title;
    descEl.textContent = data.explanation;

    if (data.media_type === "image") {
      imgEl.src = data.url;
      imgEl.style.display = "block";
    } else {
      imgEl.style.display = "none";
      descEl.textContent = "This entry is a video. Visit NASA site.";
    }

  } catch (error) {
    console.error("Error fetching APOD:", error);
  }
}

// Load today's image on start
fetchAPOD();

// Button event
loadBtn.addEventListener("click", () => {
  const selectedDate = datePicker.value;
  fetchAPOD(selectedDate);
});