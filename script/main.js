
// =========================
// 재료 요소 및 전역 변수
// =========================

const ingredients = document.querySelectorAll('.ingredient');

const ingredientDesc =
    document.getElementById('ingredientDesc');
const ingredientNote =
    document.getElementById('ingredientNote');

const DEFAULT_DESC_TEXT =
    '...';

let selectedIngredientId = null; // 클릭으로 '고정 선택'된 재료 (없으면 null)

let draggedIngredient = null;
let dragGhost = null;
let isDragging = false;
let activePointerId = null;

const MAX_INGREDIENTS = 3;



// =========================
// 레시피 데이터베이스

const RECIPES = {};

// 재료 id 배열 → 정렬된 키로 변환 (순서 실수 방지용, 이 함수로만 키를 만든다)
function makeRecipeKey(...ids) {
    return ids.slice().sort().join('-');
}

function registerRecipe(...recipes) {
    for (let i = 0; i < recipes.length; i += 2) {
        const ids = recipes[i];
        const data = recipes[i + 1];

        const key = makeRecipeKey(...ids);
        RECIPES[key] = data;
    }
}

//물약
registerRecipe(
    ["water", "herb", "mandrake"],
    //물 + 허브 + 발광버섯
    {
        name: "체력 회복 포션",
        desc: "모든 상처를 즉시 회복시키는 신비한 초록 물약입니다.",
        image: "./assets/potion/healing.webp"
    },

    ["water", "dragonsClaw", "cactusflower"],
    //물 + 드래곤의 발톱 + 선인장의 꽃
    {
        name: "힘의 포션",
        desc: "힘이 증가해 가하는 공격이 강해집니다.",
        image: "./assets/potion/strength.webp"
    },


    ["water", "spiritCore", "moonlightFlower"],
    //물 + 정령의 핵 + 달빛을 머금은 꽃
    {
        name: "마력 증폭의 포션",
        desc: "일시적으로 마력 회복 속도와 마법의 위력이 대폭 상승합니다.",
        image: "./assets/potion/mana.webp"
    },


    ["water", "phoenixFeather", "blessingOfTheGoddess"],
    //물 + 불사조의 깃털 + 여신의 비호
    {
        name: "신성한 불사 포션",
        desc: "아무리 큰 상처에도 죽지 않으며 모든 피해를 회복시킵니다.",
        image: "./assets/potion/undead.webp"
    },


    ["water", "poisonousMushroom", "silkyScales"],
    //물 + 독버섯 + 비단뱀의 비늘
    {
        name: "맹독성 부식 포션",
        desc: "마시거나 장비에 바르면 강력한 중독 및 부식을 일으킬 수 있습니다.",
        image: "./assets/potion/poison.webp"
    },


    ["water", "youngSpiritsPoop", "silverFlower"],
    // 물 + 어린 정령의 똥 + 은구슬 꽃
    {
        name: "환수의 영양 포션",
        desc: "마법 생물이나 환수에게 먹이면 소환수의 성장이 빨라집니다.",
        image: "./assets/potion/beast.webp"
    },


    ["water", "slimeCore", "starDust"],
    //물 + 슬라임의 핵 + 별똥별 조각
    {
        name: "피부활력증가 포션",
        desc: "마시면 피부에 생기가 생기고 건강해 보입니다.",
        image: "./assets/potion/skin.webp"
    },


    ["water", "blessingOfTheGoddess", "runeFragment"],
    //물 + 여신의 비호 + 룬 조각
    {
        name: "신성한 정화수",
        desc: "모든 저주와 저주받은 장비를 즉시 정화합니다.",
        image: "./assets/potion/cleanser.webp"
    },


    ["water", "mandrake", "poisonousMushroom"],
    //물 + 만드라고라 + 독버섯
    {
        name: "환각의 마법 포션",
        desc: "마신 적에게 심한 환각을 일으켜 서로 공격하게 만드는 혼란 상태에 빠뜨립니다.",
        image: "./assets/potion/disarray.webp"
    },


    ["water", "coralStarfish", "brightMushroom"],
    //물 + 산호 불가사리 + 발광버섯
    {
        name: "바다의 축복 포션",
        desc: "마시면 물속에서 숨을 쉴 수 있고 이동 속도가 빨라집니다.",
        image: "./assets/potion/sea.webp"
    },


    ["water", "sunriseFlower", "fairyDust"],
    //물 + 해맞이 꽃 + 요정의 가루
    {
        name: "광명의 각성 포션",
        desc: "마시면 시야가 매우 밝아져 어두운 곳에서도 낮과 같이 볼 수 있습니다.",
        image: "./assets/potion/vision.webp"
    },


    ["water", "dragonsClaw", "phoenixFeather"],
    //물 + 드래곤의 발톱 + 불사조의 깃털
    {
        name: "화염 내성 포션",
        desc: "일시적으로 화염으로부터 보호받습니다.",
        image: "./assets/ingredient/starDust.webp"
    },


    ["water", "runeFragment", "slimeCore"],
    // 물 + 룬 조각 + 슬라임의 핵
    {
        name: "충격파 방출 포션",
        desc: " 바닥에 던지면 넓은 범위로 강력한 마력 충격파를 방출하여 주변 적을 밀쳐냅니다.",
        image: "./assets/ingredient/starDust.webp"
    },


    ["water", "mandrake", "moonlightFlower"],
    //물 + 만드라고라 + 달빛을 머금은 꽃
    {
        name: "환각성 음파 포션",
        desc: "마신 자의 목소리를 기이한 음파로 바꾸어 주변 적들에게 공포를 줍니다.",
        image: "./assets/ingredient/starDust.webp"
    },


    ["water", "silkyScales", "manaOre"],
    //물 + 비단뱀의 비늘 + 마력 광석
    {
        name: "수호의 갑옷 포션",
        desc: "피부가 단단해지며 물리 방어력이 크게 상승합니다.",
        image: "./assets/ingredient/starDust.webp"
    },

);












//약  
registerRecipe(
    ["fairyDust", "silverFlower", "sunriseFlower"],
    // 요정의 가루 + 은구슬 꽃 + 해맞이 꽃
    {
        name: "정신 진정 연고",
        desc: "상처 부위에 바르면 정신적 공포와 수면 장애를 해소해 줍니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["mandrake", "slimeCore", "manaOre"],
    // 만드라고라 + 슬라임의 핵 + 마력 광석
    {
        name: "신체 강화 알약",
        desc: "단단하게 뭉쳐 복용하면 일시적으로 근력과 방어력이 대폭 상승합니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["coralStarfish", "runeFragment", "silkyScales"],
    // 산호 불가사리 + 룬 조각 + 비단뱀의 비늘
    {
        name: "해독 가루 환",
        desc: "체내에 침투한 치명적인 독을 즉시 흡수하여 배출시킵니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["starDust", "spiritCore", "manaOre"],
    // 별똥별 조각 + 정령의 핵 + 마력 광석
    {
        name: "마법 감응 분말",
        desc: "마력에 대한 감응력이 증가하고 마법의 위력이 강해집니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["youngSpiritsPoop", "herb", "sunriseFlower"],
    // 어린 정령의 똥 + 허브 + 해맞이 꽃
    {
        name: "초기 성장의 비약",
        desc: "식물이나 작은 정령에게 뿌리면 빠른 성장을 촉진하는 유기농 영양제입니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["phoenixFeather", "manaOre", "blessingOfTheGoddess"],
    //  불사조의 깃털 + 마력 광석 + 여신의 비호
    {
        name: "불사조의 알약",
        desc: "굳혀 만든 결정 알약으로, 복용 시 천천히 힘이 차오릅니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["poisonousMushroom", "silkyScales", "dragonsClaw"],
    // 독버섯 + 비단뱀의 비늘 + 드래곤의 발톱
    {
        name: "마비 독 가루",
        desc: "무기 표면에 바르거나 던지면 적을 일시적으로 완전 마비시킵니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["fairyDust", "moonlightFlower", "cactusflower"],
    // 요정의 가루 + 달빛을 머금은 꽃 + 선인장의 꽃
    {
        name: "마력 흡수 연고",
        desc: "피부에 바르면 주변 마력으로 회복을 촉진합니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["brightMushroom", "runeFragment", "starDust"],
    // 발광버섯 + 별똥별 조각 + 룬 조각
    {
        name: "야간 시야 분말",
        desc: "눈 주위에 바르면 칠흑 같은 어둠 속에서도 완벽한 시야를 확보합니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["slimeCore", "mandrake", "herb"],
    //  슬라임의 핵 + 만드라고라 + 허브
    {
        name: "생명 각성 젤리",
        desc: "쫀득하게 응축한 고체 약으로, 섭취 시 최대 체력의 한계를 일시적으로 늘려줍니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["starDust", "coralStarfish", "herb"],
    // 별똥별 조각 + 산호 불가사리 + 허브
    {
        name: "별빛 응급 연고",
        desc: "상처에 바르면 부위가 별빛으로 치유되며 부상을 즉시 지혈합니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["youngSpiritsPoop", "blessingOfTheGoddess", "cactusflower"],
    // 어린 정령의 똥 + 여신의 비호 + 선인장의 꽃
    {
        name: "성스러운 자양환",
        desc: "먹기 거북하지만 복용 시 허기짐이 즉시 채워지고 힘이 소폭 증가합니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["poisonousMushroom", "brightMushroom", "spiritCore"],
    // 독버섯 + 발광버섯 + 정령의 핵
    {
        name: "신경 마비 가루",
        desc: "적에게 뿌리면 적의 마력 회복을 방해하고 움직임을 느리게 만듭니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["silverFlower", "spiritCore", "fairyDust"],
    // 은구슬 꽃 + 정령의 핵 + 요정의 가루
    {
        name: "영혼 포착 젤리",
        desc: "굳혀 만든 젤리 형태의 약으로, 보이지 않는 영체를 볼수 있게 됩니다.",
        image: "./assets/ingredient/herb.webp"
    },
    ["cactusflower", "coralStarfish", "slimeCore"],
    // 선인장의 꽃 + 산호 불가사리 + 슬라임의 핵
    {
        name: "열기 차단 크림",
        desc: "몸 전체에 바르면 화염 및 용암 지대에서 받는 환경 피해를 일정 시간 무효화합니다.",
        image: "./assets/ingredient/herb.webp"
    },
);

const UNKNOWN_RECIPE = {
    name: "알 수 없는 잿더미",
    desc: "재료의 비율이 맞지 않아 검은 연기와 함께 실패했습니다.",
    image: "./assets/dust.webp"
};

// =========================
// 재료 이벤트

// =========================
// 쪽지 텍스트 갱신 (플립 애니메이션)
// =========================

function updateNoteText(text) {

    if (!ingredientDesc) return;

    // 이미 같은 내용이면 애니메이션 생략
    if (ingredientDesc.textContent === text) return;

    if (ingredientNote) {
        ingredientNote.classList.remove('flip');
        void ingredientNote.offsetWidth; // 리플로우 강제 (연속 재생 위해)
        ingredientNote.classList.add('flip');
    }

    // 애니메이션 절반 시점(옆면이 안 보일 때)에 텍스트 교체
    setTimeout(() => {
        ingredientDesc.innerHTML = text;
    }, 180);

    if (ingredientNote) {
        ingredientNote.addEventListener('animationend', () => {
            ingredientNote.classList.remove('flip');
        }, { once: true });
    }

}

ingredients.forEach((ingredient) => {

    // -------------------------
    // 설명 쪽지 갱신 (호버)
    // -------------------------

    ingredient.addEventListener('mouseenter', () => {

        if (isDragging) return;

        const name = ingredient.getAttribute('aria-label');
        const description = ingredient.dataset.description;

        if (!description) return;

        updateNoteText(
            `<strong>${name}</strong><br>${description}`
        );
    });

    ingredient.addEventListener('mouseleave', () => {

        // 선택된 재료가 있으면 그 설명으로 되돌리고, 없으면 기본 문구로
        if (selectedIngredientId) {

            const selected =
                document.querySelector(
                    `.ingredient[data-id="${selectedIngredientId}"]`
                );

            updateNoteText(selected?.dataset.description || DEFAULT_DESC_TEXT);

        } else {

            updateNoteText(DEFAULT_DESC_TEXT);

        }

    });

    // -------------------------
    // 설명 쪽지 갱신 (클릭 = 선택 고정)
    // -------------------------


    ingredient.addEventListener('click', () => {

        selectedIngredientId = ingredient.dataset.id;

        updateNoteText(ingredient.dataset.description || DEFAULT_DESC_TEXT);

    });

    // 키보드 접근성 (tabindex로 포커스 가능하니 Enter/Space도 클릭과 동일 동작)
    ingredient.addEventListener('keydown', (e) => {

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            ingredient.click();
        }

    });



    // -------------------------
    // 드래그 시작
    // -------------------------

    ingredient.addEventListener('pointerdown', (e) => {

        // 마우스 왼쪽 버튼만
        if (
            e.pointerType === 'mouse' &&
            e.button !== 0
        ) {
            return;
        }

        e.preventDefault();

        draggedIngredient = ingredient;
        isDragging = true;
        activePointerId = e.pointerId;

        ingredient.setPointerCapture(e.pointerId);

        const image =
            ingredient.querySelector('.ingredient-img');

        if (!image) {
            cancelDrag();
            return;
        }

        dragGhost = image.cloneNode(true);
        dragGhost.className = 'drag-ghost';
        dragGhost.draggable = false;

        document.body.appendChild(dragGhost);

        moveGhost(e.clientX, e.clientY);

    });

    // -------------------------
    // 드래그 중
    // -------------------------

    document.addEventListener('pointermove', (e) => {
        if (!isDragging || !dragGhost) return;

        moveGhost(e.clientX, e.clientY);
    });

    // -------------------------
    // 드롭
    // -------------------------

    document.addEventListener('pointerup', (e) => {
        if (!isDragging) return;

        finishDrag(e);
    });
    // -------------------------
    // 드래그 취소
    // -------------------------

    document.addEventListener('pointercancel', () => {
        if (!isDragging) return;

        cancelDrag();
    });

});


// =========================
// 드래그 이미지 이동
// =========================

function moveGhost(x, y) {

    if (!dragGhost) {
        return;
    }


    dragGhost.style.left =
        `${x}px`;

    dragGhost.style.top =
        `${y}px`;

}


// =========================
// 드래그 취소
// =========================

function cancelDrag() {


    // 포인터 캡처 해제
    if (
        draggedIngredient &&
        activePointerId !== null
    ) {

        try {

            draggedIngredient.releasePointerCapture(
                activePointerId
            );

        } catch (err) {

            // 이미 해제된 경우 무시

        }

    }


    // 드래그 이미지 제거
    if (dragGhost) {

        dragGhost.remove();

        dragGhost = null;

    }


    draggedIngredient = null;

    isDragging = false;

    activePointerId = null;

}


// =========================
// 드롭 처리
// =========================

function finishDrag(e) {

    if (!isDragging || !draggedIngredient) {
        return;
    }

    // 드래그 이미지 숨기기
    if (dragGhost) {
        dragGhost.style.display = 'none';
    }

    const jarZone = document.getElementById('jarZone');
    const jarInterior = document.getElementById('jarInterior');

    if (!jarZone || !jarInterior) {
        cancelDrag();
        return;
    }

    // 항아리 내부 드롭 영역의 위치
    const rect = jarInterior.getBoundingClientRect();

    // 마우스가 jarInterior 영역 안에 있는지
    const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    if (!isInside) {
        cancelDrag();
        return;
    }

    // 현재 들어있는 재료 개수
    const currentCount =
        jarInterior.querySelectorAll('.ingredient-item').length;

    // 최대 3개
    if (currentCount >= MAX_INGREDIENTS) {

        showToast(
            '⚠️ 항아리가 가득 찼습니다! (최대 3개)'
        );

        cancelDrag();
        return;
    }

    // 재료 ID
    const ingredientId =
        draggedIngredient.dataset.id;

    // 재료 이미지
    const ingredientImg =
        draggedIngredient.querySelector('.ingredient-img');

    if (!ingredientImg) {
        cancelDrag();
        return;
    }

    // 항아리에 추가
    addIngredientToJar(
        ingredientImg.src,
        ingredientId,
        e.clientX,
        e.clientY
    );

    cancelDrag();
}


// =========================
// 항아리에 재료 추가
// =========================

function addIngredientToJar(
    imageSrc,
    id,
    clientX,
    clientY
) {

    const jarInterior =
        document.getElementById('jarInterior');

    if (!jarInterior) {
        return;
    }

    const rect =
        jarInterior.getBoundingClientRect();

    // jarInterior 기준 좌표
    const localX =
        clientX - rect.left;

    const localY =
        clientY - rect.top;

    // 재료 컨테이너
    const item =
        document.createElement('div');

    item.className =
        'ingredient-item';

    item.dataset.id =
        id;

    // 이미지 생성
    const img =
        document.createElement('img');

    img.src =
        imageSrc;

    img.alt =
        id;

    img.draggable =
        false;

    // 이미지 추가
    item.appendChild(img);

    // 위치
    item.style.left =
        `${localX}px`;

    item.style.top =
        `${localY}px`;

    // 항아리에 추가
    jarInterior.appendChild(item);

    // 상태 업데이트
    updateJarStatus();
}


// =========================
// 항아리 상태 관리
// =========================

function updateJarStatus() {


    const jarInterior =
        document.getElementById(
            'jarInterior'
        );


    const craftBtnWrap =
        document.getElementById(
            'craftBtnWrap'
        );


    if (
        !jarInterior ||
        !craftBtnWrap
    ) {
        return;
    }


    const currentCount =
        jarInterior.querySelectorAll(
            '.ingredient-item'
        ).length;


    // 3개가 되면 조합 버튼 표시
    if (
        currentCount >= MAX_INGREDIENTS
    ) {

        craftBtnWrap.classList.add(
            'show'
        );

    } else {

        craftBtnWrap.classList.remove(
            'show'
        );

    }

}


// =========================
// 항아리 비우기
// =========================

function clearJar() {


    const jarInterior =
        document.getElementById(
            'jarInterior'
        );


    if (jarInterior) {

        jarInterior.innerHTML =
            '';

    }


    updateJarStatus();

}


// =========================
// 조합 실행
// =========================

function startBrewing() {

    const items =
        document.querySelectorAll('#jarInterior .ingredient-item');

    const currentIngredients =
        Array.from(items)
            .map(item => item.dataset.id)
            .sort()
            .join('-');

    const result =
        RECIPES[currentIngredients] || UNKNOWN_RECIPE;

    if (RECIPES[currentIngredients]) {
        recordDiscovery(currentIngredients);
    }
    const resultName =
        document.getElementById('resultName');

    if (resultName) {
        resultName.textContent = result.name;
    }

    const resultDesc =
        document.getElementById('resultDesc');

    if (resultDesc) {
        resultDesc.textContent = result.desc;
    }

    const resultImage =
        document.getElementById('resultImage');

    if (resultImage) {
        resultImage.src = result.image;
        resultImage.alt = result.name;
    }

    const overlay =
        document.getElementById('overlay');

    const craftBtnWrap =
        document.getElementById('craftBtnWrap');

    if (craftBtnWrap) {
        craftBtnWrap.classList.remove('show');
    }

    if (overlay) {
        overlay.classList.add('show');
    }

    // 2초 뒤 자동으로 카드 닫고 항아리 초기화
    setTimeout(() => {

        if (overlay) {
            overlay.classList.remove('show');
        }

        clearJar();

    }, 2000);

}
// =========================
// 도감 기록 (발견한 레시피 갱신)
// =========================



// =========================
// 버튼 이벤트
// =========================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        applyDiscoveredRecipes(); // ✅ 추가


        const resetBtn =
            document.getElementById(
                'resetBtn'
            );


        const craftBtn =
            document.getElementById(
                'craftBtn'
            );


        const againBtn =
            document.getElementById(
                'againBtn'
            );


        // 초기화 버튼
        if (resetBtn) {

            resetBtn.addEventListener(
                'click',
                clearJar
            );

        }


        // 조합 버튼
        if (craftBtn) {

            craftBtn.addEventListener(
                'click',
                startBrewing
            );

        }


        // 다시 하기 버튼
        if (againBtn) {

            againBtn.addEventListener(
                'click',
                () => {


                    const overlay =
                        document.getElementById(
                            'overlay'
                        );


                    if (overlay) {

                        overlay.classList.remove(
                            'show'
                        );

                    }


                    clearJar();

                }
            );

        }

    }
);


// =========================
// 경고 토스트
// =========================

let toastTimeout = null;


function showToast(message) {


    const toast =
        document.getElementById(
            'toastMessage'
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        'show'
    );


    if (toastTimeout) {

        clearTimeout(
            toastTimeout
        );

    }


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    'show'
                );

            },
            2000
        );

}

// 도감 펼치고 접기 + 페이지 넘기기
const book = document.querySelector(".book");
const bookOverlay = document.getElementById("bookOverlay");
const bookPages = document.querySelectorAll(".book-page");
const bookPrevBtn = document.getElementById("bookPrevBtn");
const bookNextBtn = document.getElementById("bookNextBtn");

let currentPage = 0;
const totalPages = bookPages.length;

function showPage(index) {
    bookPages.forEach((page) => {
        page.classList.toggle("active", Number(page.dataset.page) === index);
    });

    // 첫/마지막 페이지에서 화살표 비활성화 (원치 않으면 이 두 줄 지워도 됨)
    if (bookPrevBtn) bookPrevBtn.disabled = index === 0;
    if (bookNextBtn) bookNextBtn.disabled = index === totalPages - 1;
}

book.addEventListener("click", () => {
    currentPage = 0;
    showPage(currentPage);
    bookOverlay.classList.add("show");
});

bookOverlay.addEventListener("click", (e) => {
    if (e.target === bookOverlay) {
        bookOverlay.classList.remove("show");
    }
});

if (bookPrevBtn) {
    bookPrevBtn.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    });
}

if (bookNextBtn) {
    bookNextBtn.addEventListener("click", () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            showPage(currentPage);
        }
    });
}

// =========================
// 도감 발견 기록 저장/불러오기 (localStorage)
// =========================

const STORAGE_KEY = 'witchAlchemy_discoveredRecipes';

function loadDiscoveredRecipes() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (err) {
        return [];
    }
}

function saveDiscoveredRecipes(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
        // 저장 실패해도 무시
    }
}

function applyDiscoveredRecipes() {
    const discoveredList = loadDiscoveredRecipes();

    discoveredList.forEach((recipeKey) => {
        const page =
            document.querySelector(`.book-page[data-recipe="${recipeKey}"]`);

        if (page) {
            page.classList.add('discovered');
        }
    });
}

function recordDiscovery(recipeKey) {

    const page =
        document.querySelector(`.book-page[data-recipe="${recipeKey}"]`);

    if (!page) return;

    page.classList.add('discovered');
    const discoveredList = loadDiscoveredRecipes();
    if (!discoveredList.includes(recipeKey)) {
        discoveredList.push(recipeKey);
        saveDiscoveredRecipes(discoveredList);
    }
}

const bookCloseBtn = document.getElementById('bookCloseBtn');

if (bookCloseBtn) {
    bookCloseBtn.addEventListener('click', () => {
        bookOverlay.classList.remove('show');
    });
}
// =========================
// 도감 초기화 (개발/테스트용)
// =========================

const bookResetBtn = document.getElementById('bookResetBtn');

if (bookResetBtn) {
    bookResetBtn.addEventListener('click', () => {

        const confirmed = confirm('도감 발견 기록을 모두 초기화할까요?');

        if (!confirmed) return;

        localStorage.removeItem(STORAGE_KEY);

        document.querySelectorAll('.book-page.discovered').forEach((page) => {
            page.classList.remove('discovered');
        });
    });
}


const helpButton = document.querySelector('.help');
const helpOverlay = document.getElementById('helpOverlay');
const helpClose = document.getElementById('helpClose');

helpButton.addEventListener('click', () => {
    helpOverlay.classList.add('show');
});

helpClose.addEventListener('click', () => {
    helpOverlay.classList.remove('show');
});


// =========================
// 플레이 시간
// =========================

const playTime = document.getElementById("playTime");

let startTime = Date.now();

function updatePlayTime() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    playTime.textContent =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

setInterval(updatePlayTime, 1000);


const memo = document.querySelector('.memo');

if (memo) {
    memo.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
}