const themeBtn = document.getElementById("toggleTheme");
const form = document.getElementById("searchForm");
const input = document.getElementById("typeWord");
const loading = document.getElementById("loading");
const resultsPanel = document.getElementById("resultsPanel");
const audioPlayer = document.querySelector("#audioBox audio");
const savedBtn = document.getElementById("saveWord");
const favoritesDiv = document.getElementById("favorites");

let currentWord = "";
let favorites =JSON.parse(localStorage.getItem("favorites")) || [];

// SEARCH SECTION
form.addEventListener("submit", function(e){
    e.preventDefault();

    const word = input.value.trim();
    if(!word) return

    currentWord = word;

    loading.style.display = "block";
    resultsPanel.innerHTML = "<p>Loading...</p>"

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(res => {
            if(!res.ok) throw new Error("The Word is not found");
            return res.json();

        })
        .then(data => displayData(data[0]))
        .catch(err => {
            resultsPanel.innerHTML = `<p style= "color:red;"> Error: ${err.message}</p>`;
        })
        .finally(() => {
            loading.style.display = "none";
        })
});

// DISPLAY SECTION
function displayData(data) {
    const word = data.word;
    const phonetic = data.phonetic || "Not Applicable";

    const meaning = data.meanings[0];
    const definitions = meaning.definitions[0].definition;
    const example = meaning.definitions[0].example || "There is currently no examples available.";
    const synonyms = meaning.synonyms?.join(", ") || "None";

    resultsPanel.innerHTML = `
    <h3> ${word}</h3>
    <p><strong>Pronunciation: ${phonetic}</strong></p>
    <p><strong>Definition: ${definitions}</strong></p>
    <p><strong>Examples: ${example}</strong></p>
    <p><strong>Synonyms: ${synonyms}</strong></p>`;

    //AUDIO SECTION
    const audioSrc = data.phonetics.find(p => p.audio)?.audio;
    audioPlayer.src = audioSrc || "";
}

//FAVORITES SECTION
savedBtn.addEventListener("click",() => {
    if(!currentWord) return;

    if(!favorites.includes(currentWord)) {
        favorites.push(currentWord);
        localStorage.setItem("favorites",JSON.stringify(favorites));
        renderFavorites();
    }
});

function renderFavorites(){
    favoritesDiv.innerHTML = "";

    if(favorites.length === 0) {
        favoritesDiv.innerHTML = `<p class = "text-muted">No words have been saved yet.</p>`;
        return;
    }
    favorites.forEach(word =>{
        const item = document.createElement("div");
        item.textContent = word;
        item.className = "list-group-item";
        favoritesDiv.appendChild(item);
    })
}
renderFavorites();

//THEME SECTION
let currentTheme = localStorage.getItem("theme") || "light";
applyTheme(currentTheme);

themeBtn.addEventListener("click", () =>{
    currentTheme = currentTheme === "light"? "dark":"light";
    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme);
});

function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");

    themeBtn.textContent = theme === "dark" ? "☀️ Light Mode": "🌑 Dark Mode";
}




