const API_KEY = 'AIzaSyA13XaHj7QD6HDYVa0zgtTBE0ewihrhf8M'; // 생성한 API 키로 대체
const SPREADSHEET_ID = '1i-sXORfTZXdWSDDFHvdBRd8ZyCDS7f8065af3Ou7Btg'; // 스프레드시트 ID로 대체
const SHEET_NAME = '시트1'; // 시트 이름으로 대체

let musicbook = [];
let addOrdered = [];
let singerOrdered = [];
let songOrdered = [];
let categories = [];
let cate_selected = "genre-0";

// 스프레드시트에서 데이터 가져오기
async function fetchSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.values) {
      musicbook = data.values.slice(1); // 헤더 제외
      categorize(musicbook);
      addOrdered = JSON.parse(JSON.stringify(musicbook));

      // 곡명순 정렬
      songOrdered = JSON.parse(JSON.stringify(musicbook)).sort((a, b) => a[1].localeCompare(b[1]));

      // 가수명순 정렬
      singerOrdered = JSON.parse(JSON.stringify(musicbook)).sort((a, b) => a[0].localeCompare(b[0]));

      musicbook = addOrdered;

      random_select(musicbook, 6);
      populateSection(musicbook, -1, "전체");
    } else {
      console.error('데이터를 가져오지 못했습니다.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// 장르 분류 및 버튼 생성
function categorize(jsonObj) {
  let tmp_genre = ["전체"];
  jsonObj.forEach(row => {
    if (!tmp_genre.includes(row[2])) {
      tmp_genre.push(row[2]);
    }
  });
  categories = JSON.parse(JSON.stringify(tmp_genre));

  const cateDiv = document.createElement('div');
  cateDiv.classList.add("genre-select");
  document.querySelector('.genre-list').appendChild(cateDiv);

  categories.forEach((genre, index) => {
    const cateName = document.createElement('button');
    const cateString = document.createElement('formatted-string');

    cateString.textContent = genre;
    cateString.classList.add("genre-text");
    cateName.appendChild(cateString);

    cateName.classList.add("genre-button");
    cateName.setAttribute("id", "genre-" + index);

    cateDiv.appendChild(cateName);
  });

  cate_selected = "genre-0";
  document.getElementById("genre-0").classList.add("button-selected");

  const cate_click = document.getElementsByClassName("genre-button");
  for (let i = 0; i < cate_click.length; i++) {
    cate_click[i].onclick = function() {
      document.getElementById(cate_selected).classList.remove("button-selected");
      document.getElementById(this.id).classList.add("button-selected");
      cate_selected = this.id;
      populateSection(musicbook, 1, document.getElementById(cate_selected).textContent);
    }
  }
}

// 랜덤 노래 선택
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function random_select(jsonObj, num) {
  const myNode = document.getElementsByClassName("random-music-list")[0];
  while (myNode.lastElementChild) {
    myNode.removeChild(myNode.lastElementChild);
  }

  let dup = [];
  let i = 0;

  while (i < num) {
    let rnd = getRndInteger(0, jsonObj.length);
    if (dup.includes(rnd) || jsonObj[rnd][0] === "가수") continue;
    dup.push(rnd);

    const myDiv = document.createElement('div');
    const coverDiv = document.createElement('div');
    const coverImg = document.createElement('img');
    const infoDiv = document.createElement('div');
    const infoSong = document.createElement('formatted-string');
    const infoSinger = document.createElement('formatted-string');

    myDiv.classList.add("random-song");

    coverDiv.classList.add("random-cover-div");
    coverImg.classList.add("
::contentReference[oaicite:33]{index=33}
 

