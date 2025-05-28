// ✅ 전역 변수 초기화
let musicbook = [];
let addOrdered = [];
let artistOrdered = [];
let singerOrdered = []; // 추가
let songOrdered = [];   // 추가

let category_selected = "";
let genre_selected = "";

let categories = [];

let sort_selected = "byAdd";
let noCover = `https://i.ytimg.com/vi/-Sp9Xyaa3Nk/maxresdefault.jpg`;

let removeToast;
document.addEventListener("DOMContentLoaded", () => {

	// ✅ 버튼 이벤트 연결은 DOM 로드 후
	const openMenuBtn = document.getElementById("openMenu");
	if (openMenuBtn) {
		openMenuBtn.onclick = function () {
			const sidebar = document.getElementById("sidebar-id");
			const wrapper = document.getElementById("sidebar-wrapper-id");

			if (sidebar) sidebar.classList.toggle("sidebar-hide");
			if (wrapper) wrapper.classList.toggle("sidebar-wrapper-hide");
		};
	}

	// ✅ 초기 정렬 버튼 클릭 처리기 등록
	const btnAdd = document.getElementById("byAdd");
	const btnSinger = document.getElementById("bySinger");
	const btnSong = document.getElementById("bySong");

	if (btnAdd) btnAdd.onclick = sortAdded;
	if (btnSinger) btnSinger.onclick = sortSinger;
	if (btnSong) btnSong.onclick = sortSong;

	// ✅ 입력창 검색 처리기
	const input = document.getElementById("inputsearch");
	if (input) {
		input.addEventListener("keydown", (event) => {
			if (event.key === "Enter") populateSection(musicbook, 1);
		});
		input.addEventListener("input", () => {
			input.setAttribute("value", input.value);
		});
	}
});

// ✅ 정렬 함수들
function sortSinger() {
	const btn = document.getElementById("bySinger");
	if (!btn || !singerOrdered) return;
	document.getElementById(sort_selected)?.classList.remove("button-selected");
	btn.classList.add("button-selected");
	sort_selected = "bySinger";
	musicbook = singerOrdered;
	populateSection(musicbook, 1);
}

function sortSong() {
	const btn = document.getElementById("bySong");
	if (!btn || !songOrdered) return;
	document.getElementById(sort_selected)?.classList.remove("button-selected");
	btn.classList.add("button-selected");
	sort_selected = "bySong";
	musicbook = songOrdered;
	populateSection(musicbook, 1);
}

function sortAdded() {
	const btn = document.getElementById("byAdd");
	if (!btn || !addOrdered) return;
	document.getElementById(sort_selected)?.classList.remove("button-selected");
	btn.classList.add("button-selected");
	sort_selected = "byAdd";
	musicbook = addOrdered;
	populateSection(musicbook, 1);
}

// ✅ 토스트 메시지 함수
function toast(message) {
	const toast = document.getElementById("toast");
	if (!toast) return;

	if (toast.classList.contains("reveal")) {
		clearTimeout(removeToast);
		removeToast = setTimeout(() => toast.classList.remove("reveal"), 1000);
	} else {
		removeToast = setTimeout(() => toast.classList.remove("reveal"), 3000);
	}
	toast.classList.add("reveal");
	toast.innerText = message;
}

