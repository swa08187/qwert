// JS 전체 코드 - Google Sheets API v4 버전

const SHEET_ID = "1i-sXORfTZXdWSDDFHvdBRd8ZyCDS7f8065af3Ou7Btg";
const API_KEY = "AIzaSyA13XaHj7QD6HDYVa0zgtTBE0ewihrhf8M";  // 본인 API 키 입력
const RANGE = "시트1!A2:F"; // 시트이름과 범위 조정 필요

const genreContainer = document.querySelector('.genre-list');
const randomContainer = document.querySelector('.random-music-list');
const musicListContainer = document.getElementById('musicList');
const searchInput = document.getElementById('inputsearch');

let musicbook = [];
let categories = [];
let cate_selected = "전체";

// 1) Google Sheets API 호출
function loadSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("API 요청 실패");
      return res.json();
    })
    .then(data => {
      // data.values는 2차원 배열 [[artist, song, genre, cover], ...]
      if (!data.values || data.values.length === 0) {
        console.warn("시트에 데이터가 없습니다.");
        return;
      }

      // 객체 배열로 변환
      musicbook = data.values.map(row => ({
        artist: row[0] || "",
        song: row[1] || "",
        genre: row[2] || "",
        cover: row[3] || ""
      }));

      initUI();
    })
    .catch(err => {
      console.error("데이터 로드 실패:", err);
    });
}

// 2) UI 초기화 및 이벤트 바인딩
function initUI() {
  categorize(musicbook);
  random_select(musicbook, 6);
  populateSection(musicbook, "전체");

  // 장르 버튼 클릭 이벤트 이미 categorize 내에서 등록됨

  // 검색 입력 이벤트
  searchInput.addEventListener('input', () => {
    populateSection(musicbook, cate_selected);
  });
}

// 3) 장르(카테고리) 버튼 생성 및 클릭 처리
function categorize(data) {
  // 고유 장르 추출, "전체" 포함
  const uniqueGenres = Array.from(new Set(data.map(d => d.genre))).filter(g => g);
  categories = ["전체", ...uniqueGenres];

  genreContainer.innerHTML = ""; // 초기화
  const cateDiv = document.createElement('div');
  cateDiv.classList.add("genre-select");
  genreContainer.appendChild(cateDiv);

  categories.forEach((genreName, idx) => {
    const btn = document.createElement('button');
    btn.textContent = genreName;
    btn.classList.add("genre-button");
    if (idx === 0) {
      btn.classList.add("button-selected");
    }
    btn.id = "genre-" + idx;
    btn.onclick = () => {
      document.querySelectorAll(".genre-button").forEach(b => b.classList.remove("button-selected"));
      btn.classList.add("button-selected");
      cate_selected = genreName;
      populateSection(musicbook, cate_selected);
    };
    cateDiv.appendChild(btn);
  });
}

// 4) 랜덤 노래 6개 선택 & 표시
function random_select(data, num) {
  randomContainer.innerHTML = "";

  const picked = [];
  const maxTries = data.length * 3;
  let tries = 0;
  while (picked.length < num && tries < maxTries) {
    const rndIndex = Math.floor(Math.random() * data.length);
    if (!picked.includes(rndIndex) && data[rndIndex].artist !== "") {
      picked.push(rndIndex);
    }
    tries++;
  }

  picked.forEach(idx => {
    const song = data[idx];
    const songDiv = createSongItem(song, true);
    randomContainer.appendChild(songDiv);
  });
}

// 5) 노래 목록 화면 표시
function populateSection(data, genreFilter) {
  musicListContainer.innerHTML = "";

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filtered = data.filter(item => {
    const matchesGenre = (genreFilter === "전체") || (item.genre === genreFilter);
    const matchesSearch = !searchTerm ||
      item.song.toLowerCase().includes(searchTerm) ||
      item.artist.toLowerCase().includes(searchTerm);
    return matchesGenre && matchesSearch && item.artist !== "";
  });

  filtered.forEach(song => {
    const songDiv = createSongItem(song, false);
    musicListContainer.appendChild(songDiv);
  });
}

// 6) 노래 아이템 DOM 생성 (랜덤 or 일반)
function createSongItem(song, isRandom = false) {
  const div = document.createElement("div");
  div.classList.add(isRandom ? "random-song" : "song-div", "clickable");

  const coverDiv = document.createElement("div");
  coverDiv.classList.add(isRandom ? "random-cover-div" : "album-cover-div");

  const img = document.createElement("img");
  img.src = song.cover || "https://i.ytimg.com/vi/-Sp9Xyaa3Nk/maxresdefault.jpg";
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
    navigator.clipboard.writeText(text).then(() => alert("복사 완료"));
  };

  return div;
}

// 7) 시작
loadSheetData();

