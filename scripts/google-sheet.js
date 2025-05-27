var header = document.querySelector('header');
var section = document.querySelector('section');
var genre = document.querySelector('.genre.genre-list');
var category = document.querySelector('.category');
var random = document.querySelector('.random');

let myKey = "10t2OeFeHW2JZ1A_Hq-PcCMgWZiJ7MhwlTbT_-BqNxII"; 
let noCover = "https://i.namu.wiki/i/PgMGTIiIqNjYe5R56mm0yzlejxWA3l15ZrjwTJA4T03s25vH7SuWLaEvKXhG7Q_VybX0goll8IfcTrKxja7fjg.webp";

var musicbook;
var addOrdered;
var artistOrdered;
var songOrdered;

var category_selected = "";
var categories;
var genre_selected = "";

google.charts.load("current", { packages: ["corechart"] }).then(() => {
  let query = new google.visualization.Query(
    `https://docs.google.com/spreadsheets/d/${myKey}/gviz/tq?tqx=out:json`
  );

  query.send((response) => {
    if (response.isError()) {
      console.error(
        "Error in query: " + response.getMessage() + " " + response.getDetailedMessage()
      );
      return;
    }

    let dataTable = response.getDataTable().toJSON();
    let jsonData = JSON.parse(dataTable);
    let cols = ["order", "artist", "song", "genre", "category", "cover_link"];

    musicbook = jsonData.rows.map((row) => {
      let newRow = {};
      row.c.forEach((obj, index) => {
        if (!obj) return;
        newRow[cols[index]] = "f" in obj ? obj.f : obj.v;
      });
      return newRow;
    });

    // 복사본 생성
    addOrdered = JSON.parse(JSON.stringify(musicbook));
    songOrdered = [...musicbook].sort((a, b) => a.song.toLowerCase().localeCompare(b.song.toLowerCase()));
    artistOrdered = [...musicbook].sort((a, b) => a.artist.toLowerCase().localeCompare(b.artist.toLowerCase()));

    category_populate(musicbook);
    genre_populate(musicbook);
    random_select(musicbook, 6);

    populateSection(musicbook, 1);
  });
});

function sortAdded() {
  addOrdered.sort((a, b) => Number(a.order) - Number(b.order));
  populateSection(addOrdered, 1);
}

function genre_populate(jsonObj) {
  categories = Array.from(new Set(jsonObj.map(item => item.genre)));

  var cateDiv = document.createElement('div');
  cateDiv.classList.add("genre-select");
  genre.appendChild(cateDiv);

  categories.forEach((cat, i) => {
    var cateName = document.createElement('button');
    var cateString = document.createElement('formatted-string');

    cateString.textContent = cat;
    cateString.classList.add("genre-text");
    cateName.appendChild(cateString);

    cateName.classList.add("genre-button", "clickable");
    cateName.id = "genre-" + i;

    cateName.addEventListener('click', function () {
      var prev_sel = document.getElementsByClassName("genre-button");
      if (this.classList.contains("button-selected")) {
        [...prev_sel].forEach(el => el.classList.remove("button-selected"));
        genre_selected = "";
        populateSection(musicbook, 1);
      } else {
        [...prev_sel].forEach(el => el.classList.remove("button-selected"));
        this.classList.add("button-selected");
        genre_selected = this.textContent;
        populateSection(musicbook, 1);
      }
    });

    cateDiv.appendChild(cateName);
  });
}

function category_populate(jsonObj) {
  categories = Array.from(new Set(jsonObj.map(item => item.category)));

  var cateDiv = document.createElement('div');
  cateDiv.classList.add("category-select");
  category.appendChild(cateDiv);

  categories.forEach((cat, i) => {
    var cateName = document.createElement('button');
    var cateString = document.createElement('formatted-string');

    cateString.textContent = cat;
    cateString.classList.add("category-text");
    cateName.appendChild(cateString);

    cateName.classList.add("category-button", "clickable");
    cateName.id = "category-" + i;

    cateName.addEventListener('click', function () {
      var prev_sel = document.getElementsByClassName("category-button");
      if (this.classList.contains("button-selected")) {
        [...prev_sel].forEach(el => el.classList.remove("button-selected"));
        category_selected = "";
        populateSection(musicbook, 1);
      } else {
        [...prev_sel].forEach(el => el.classList.remove("button-selected"));
        this.classList.add("button-selected");
        category_selected = this.textContent;
        populateSection(musicbook, 1);
      }
    });

    cateDiv.appendChild(cateName);
  });
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function random_select(jsonObj, num) {
  var musiclist = jsonObj;
  const myNode = document.querySelector(".random-music-list");

  while (myNode && myNode.lastElementChild) {
    myNode.removeChild(myNode.lastElementChild);
  }

  var dup = [];
  dup[0] = 0;

  for (var i = 0; i < num; i++) {
    var rnd = getRndInteger(1, musiclist.length);

    for (var j = 0; j < i; j++) {
      while (dup[j] === rnd) {
        rnd = (rnd + 1) % musiclist.length;
        if (rnd === 0) rnd = 1;
      }
    }
    dup[i] = rnd;

    var myDiv = document.createElement('div');
    var coverDiv = document.createElement('div');
    var coverImg = document.createElement('img');
    var infoDiv = document.createElement('div');
    var infoSong = document.createElement('formatted-string');
    var infoArtist = document.createElement('formatted-string');

    myDiv.classList.add("random-song");
    coverDiv.classList.add("random-cover-div");
    coverImg.classList.add("random-cover-img");

    coverImg.src = musiclist[rnd].cover_link || noCover;

    infoDiv.classList.add("random-info-div");
    infoArtist.classList.add("random-artist-name");
    infoSong.classList.add("random-song-name");
    infoArtist.textContent = musiclist[rnd].artist;
    infoSong.textContent = musiclist[rnd].song;

    coverDiv.appendChild(coverImg);
    infoDiv.appendChild(infoSong);
    infoDiv.appendChild(infoArtist);
    myDiv.appendChild(coverDiv);
    myDiv.appendChild(infoDiv);

    myDiv.classList.add("clickable");
    myDiv.addEventListener('click', function () {
      var song = this.childNodes[1].childNodes[0];
      var artist = this.childNodes[1].childNodes[1];
      var text = song.textContent + " - " + artist.textContent;
      window.navigator.clipboard.writeText(text).then(() => {
        toast("복사완료");
      });
    });

    random.appendChild(myDiv);
  }
}

function populateSection(jsonObj, direction) {
  var musiclist = jsonObj;
  console.log("populateSection", musiclist);

  const myNode = document.getElementById("musicList");
  while (myNode.lastElementChild) {
    myNode.removeChild(myNode.lastElementChild);
  }

  const search_value = document.getElementById("inputsearch").value;

  var i, end;
  if (direction === 1) {
    i = 0;
    end = musiclist.length;
  } else {
    i = musiclist.length - 1;
    end = -1;
  }

  for (; i !== end; i += direction) {
    if (search_value !== "") {
      if (
        musiclist[i].artist.indexOf(search_value) === -1 &&
        musiclist[i].song.indexOf(search_value) === -1
      ) {
        continue;
      }
    }
    if (category_selected !== "" && musiclist[i].category !== category_selected) {
      continue;
    }
    if (genre_selected !== "" && musiclist[i].genre !== genre_selected) {
      continue;
    }

    var myDiv = document.createElement('div');
    var coverDiv = document.createElement('div');
    var coverImg = document.createElement('img');
    var infoDiv = document.createElement('div');
    var infoSong = document.createElement('formatted-string');
    var infoArtist = document.createElement('formatted-string');

    myDiv.classList.add("song-div");
    coverDiv.classList.add("album-cover-div");
    coverImg.classList.add("album-cover-img");

    coverImg.src = musiclist[i].cover_link || noCover;

    infoDiv.classList.add("info-div");
    infoArtist.classList.add("artist-name");
    infoSong.classList.add("song-name");

    infoArtist.textContent = musiclist[i].artist;
    infoSong.textContent = musiclist[i].song;

    coverDiv.appendChild(coverImg);
    infoDiv.appendChild(infoSong);
    infoDiv.appendChild(infoArtist);
    myDiv.appendChild(coverDiv);
    myDiv.appendChild(infoDiv);

    myDiv.addEventListener('click', function () {
      const coverImg = this.querySelector("img");
      const link = coverImg?.src;

      if (link && !link.includes("namu.wiki")) {
        window.open(link, "_blank");
      } else {
        alert("이 노래는 링크가 없습니다.");
      }
    });

    myNode.appendChild(myDiv);
  }
}

		
