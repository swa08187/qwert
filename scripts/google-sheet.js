// Constants & Globals
const SHEET_KEY = "10t2OeFeHW2JZ1A_Hq-PcCMgWZiJ7MhwlTbT_-BqNxII";
const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_KEY}/gviz/tq?tqx=out:json`;
const DEFAULT_COVER = "https://i.ytimg.com/vi/-Sp9Xyaa3Nk/maxresdefault.jpg";

const genreContainer = document.getElementById("genre");
const categoryContainer = document.getElementById("category");
const randomContainer = document.getElementById("random");
const musicListContainer = document.getElementById("musicList");
const searchInput = document.getElementById("inputsearch");

let musicData = [], currentGenre = "", currentCategory = "";

// Load & Init
google.charts.load("current", { packages: ["corechart"] }).then(() => {
    const query = new google.visualization.Query(SPREADSHEET_URL);
    query.send(response => {
        if (response.isError()) {
            console.error("Query Error:", response.getMessage(), response.getDetailedMessage());
            return;
        }

        const jsonTable = JSON.parse(response.getDataTable().toJSON());
        const cols = ["order", "artist", "song", "genre", "category", "cover_link"];

        musicData = jsonTable.rows.map(row => {
            const entry = {};
            row.c.forEach((cell, idx) => {
                if (cell) {
                    entry[cols[idx]] = cell.f || cell.v;
                }
            });
            return entry;
        });

        initFilters();
        renderList(musicData);
        renderRandom(musicData, 6);
    });
});

// Utils
const clearChildren = node => node && (node.innerHTML = "");
const normalize = str => (str || "").toLowerCase();

// Filtering / Rendering
function renderList(data) {
    clearChildren(musicListContainer);

    const filtered = data.filter(item => {
        const matchesGenre = !currentGenre || item.genre === currentGenre;
        const matchesCategory = !currentCategory || item.category === currentCategory;
        const searchTerm = normalize(searchInput.value);
        const matchesSearch = !searchTerm || normalize(item.song).includes(searchTerm) || normalize(item.artist).includes(searchTerm);
        return matchesGenre && matchesCategory && matchesSearch;
    });

    for (const song of filtered) {
        const songDiv = createSongItem(song);
        musicListContainer.appendChild(songDiv);
    }
}

function renderRandom(data, count) {
    clearChildren(randomContainer);

    const picked = [];
    const maxTries = data.length * 2;
    let tries = 0;

    while (picked.length < count && tries < maxTries) {
        const candidate = data[Math.floor(Math.random() * data.length)];
        if (!picked.includes(candidate)) picked.push(candidate);
        tries++;
    }

    picked.forEach(song => {
        const songDiv = createSongItem(song, true);
        randomContainer.appendChild(songDiv);
    });
}

function createSongItem(song, isRandom = false) {
    const div = document.createElement("div");
    div.classList.add(isRandom ? "random-song" : "song-div", "clickable");

    const coverDiv = document.createElement("div");
    coverDiv.classList.add(isRandom ? "random-cover-div" : "album-cover-div");

    const img = document.createElement("img");
    img.src = song.cover_link || DEFAULT_COVER;
    img.classList.add(isRandom ? "random-cover-img" : "album-cover-img");
    coverDiv.appendChild(img);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add(isRandom ? "random-info-div" : "info-div");

    const songEl = document.createElement("span");
    songEl.textContent = song.song;
    songEl.classList.add(isRandom ? "random-song-name" : "song-name");

    const artistEl = document.createElement("span");
    artistEl.textContent = song.artist;
    artistEl.classList.add(isRandom ? "random-artist-name" : "artist-name");

    infoDiv.append(songEl, artistEl);
    div.append(coverDiv, infoDiv);

    div.onclick = () => {
        const text = `${song.song} - ${song.artist}`;
        navigator.clipboard.writeText(text).then(() => toast("복사완료"));
    };

    return div;
}

// Filter Button Builders
function initFilters() {
    buildFilterButtons(genreContainer, [...new Set(musicData.map(m => m.genre))], "genre");
    buildFilterButtons(categoryContainer, [...new Set(musicData.map(m => m.category))], "category");
}

function buildFilterButtons(container, values, type) {
    clearChildren(container);

    const wrapper = document.createElement("div");
    wrapper.classList.add(`${type}-select`);
    container.appendChild(wrapper);

    values.forEach(val => {
        const btn = document.createElement("button");
        btn.textContent = val;
        btn.classList.add(`${type}-button`, "clickable");

        btn.onclick = () => {
            const allBtns = wrapper.querySelectorAll("button");
            allBtns.forEach(b => b.classList.remove("button-selected"));

            if ((type === "genre" && currentGenre === val) || (type === "category" && currentCategory === val)) {
                if (type === "genre") currentGenre = "";
                if (type === "category") currentCategory = "";
            } else {
                btn.classList.add("button-selected");
                if (type === "genre") currentGenre = val;
                if (type === "category") currentCategory = val;
            }

            renderList(musicData);
        };

        wrapper.appendChild(btn);
    });
}

// Hook for Search
searchInput.addEventListener("input", () => renderList(musicData));


		
