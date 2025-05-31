<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>노래책</title>
  <style>
    /* 간단 스타일 */
    .song-div { margin: 10px; cursor: pointer; }
    .button-selected { background-color: #aaf; }
    button { margin: 5px; }
  </style>
</head>
<body>
  <input type="text" id="inputsearch" placeholder="검색" />
  <div id="genre"></div>
  <div id="category"></div>
  <div id="random"></div>
  <div id="musicList"></div>

  <script>
    // 여기에 아까 보여준 fetchSheetData 함수와 관련 JS 함수 모두 들어갑니다.

    const SHEET_ID = "1i-sXORfTZXdWSDDFHvdBRd8ZyCDS7f8065af3Ou7Btg";
    const API_KEY = "AIzaSyA13XaHj7QD6HDYVa0zgtTBE0ewihrhf8M"; // 실제 키 넣기
    const RANGE = "시트1!A2:g";

    const DEFAULT_COVER = "https://i.ytimg.com/vi/-Sp9Xyaa3Nk/maxresdefault.jpg";

    const genreContainer = document.getElementById("genre");
    const categoryContainer = document.getElementById("category");
    const randomContainer = document.getElementById("random");
    const musicListContainer = document.getElementById('musicbookList');
    const searchInput = document.getElementById("inputsearch");

    let musicData = [], currentGenre = "", currentCategory = "";

    async function fetchSheetData() {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        if (!data.values || data.values.length === 0) {
          console.error("스프레드시트 데이터가 비어있거나 없어요");
          return;
        }

        const columns = ["order", "artist", "song", "genre", "category", "cover_link"];

        musicData = data.values.map(row => {
          const obj = {};
          columns.forEach((col, idx) => obj[col] = row[idx] || "");
          return obj;
        });

        initFilters();
        renderList(musicData);
        renderRandom(musicData, 6);

      } catch (e) {
        console.error("데이터 불러오기 실패:", e);
      }
    }

    // utils
    const clearChildren = node => node && (node.innerHTML = "");
    const normalize = str => (str || "").toLowerCase();

    // renderList, renderRandom, createSongItem, initFilters, buildFilterButtons 함수도
    // 여기에 아까 보여준 함수들 그대로 넣으면 됩니다.

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
      div.textContent = `${song.song} - ${song.artist}`;
      div.onclick = () => {
        navigator.clipboard.writeText(`${song.song} - ${song.artist}`).then(() => alert("복사완료"));
      };
      return div;
    }

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

    // 검색 이벤트 연결
    searchInput.addEventListener("input", () => renderList(musicData));

    // 초기 데이터 불러오기 실행
    fetchSheetData();

  </script>
</body>
</html>
