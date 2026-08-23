// =========================
// 재료 요소 및 전역 변수
// =========================

const ingredients = document.querySelectorAll('.ingredient');

const shelfWrap =
    document.querySelector('.ingredient-shelf');

const tooltip =
    document.getElementById('ingredientTooltip');

let draggedIngredient = null;
let dragGhost = null;
let isDragging = false;
let activePointerId = null;

const MAX_INGREDIENTS = 3;


// =========================
// 레시피 데이터베이스
// =========================

const RECIPES = {

    "herb-water-mandrake": {
        name: "강화 체력 포션",
        desc: "모든 상처를 즉시 회복시키는 신비한 붉은 물약입니다.",
        icons: "🌿💧🔥"
    },

    "bone-mushroom-stardust": {
        name: "환상 환각제",
        desc: "밤하늘의 환영을 보게 만드는 보랏빛 물약입니다.",
        icons: "🍄🦴✨"
    },

    "herb-herb-herb": {
        name: "순수 허브 엑기스",
        desc: "진한 진록색의 농축 허브 액체입니다.",
        icons: "🌿🌿🌿"
    }

};


const UNKNOWN_RECIPE = {

    name: "알 수 없는 잿더미",
    desc: "재료의 비율이 맞지 않아 검은 연기와 함께 실패했습니다.",
    icons: "💨💥"

};


// =========================
// 재료 이벤트
// =========================

ingredients.forEach((ingredient) => {


    // -------------------------
    // 툴팁
    // -------------------------

    ingredient.addEventListener('mouseenter', () => {

        // 툴팁 HTML이 없으면 그냥 넘어감
        if (!tooltip || !shelfWrap) return;

        const description =
            ingredient.dataset.description;

        if (!description || isDragging) return;


        tooltip.textContent = description;

        tooltip.classList.add('show');


        const ingredientRect =
            ingredient.getBoundingClientRect();

        const wrapRect =
            shelfWrap.getBoundingClientRect();


        const x =
            ingredientRect.left
            - wrapRect.left
            - tooltip.offsetWidth
            - 8;


        const y =
            ingredientRect.top
            - wrapRect.top
            + (ingredientRect.height / 2)
            - (tooltip.offsetHeight / 2);


        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;

    });


    ingredient.addEventListener('mouseleave', () => {

        if (!tooltip) return;

        tooltip.classList.remove('show');

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


        // 툴팁 제거
        if (tooltip) {
            tooltip.classList.remove('show');
        }


        // 포인터 캡처
        ingredient.setPointerCapture(e.pointerId);


        // 이미지 가져오기
        const image =
            ingredient.querySelector('.ingredient-img');


        if (!image) {

            cancelDrag();

            return;
        }


        // 드래그용 이미지 복제
        dragGhost =
            image.cloneNode(true);


        dragGhost.className =
            'drag-ghost';


        dragGhost.draggable = false;


        document.body.appendChild(
            dragGhost
        );


        moveGhost(
            e.clientX,
            e.clientY
        );

    });


    // -------------------------
    // 드래그 중
    // -------------------------

    ingredient.addEventListener('pointermove', (e) => {

        if (
            !isDragging ||
            !dragGhost
        ) {
            return;
        }


        moveGhost(
            e.clientX,
            e.clientY
        );

    });


    // -------------------------
    // 드롭
    // -------------------------

    ingredient.addEventListener('pointerup', (e) => {

        if (!isDragging) {
            return;
        }


        finishDrag(e);

    });


    // -------------------------
    // 드래그 취소
    // -------------------------

    ingredient.addEventListener('pointercancel', () => {

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
        document.querySelectorAll(
            '#jarInterior .ingredient-item'
        );


    // 재료 ID 가져오기
    // 알파벳 순서로 정렬해서 레시피 검색
    const currentIngredients =
        Array.from(items)

            .map(
                item =>
                    item.dataset.id
            )

            .sort()

            .join('-');


    // 레시피 검색
    const result =
        RECIPES[currentIngredients]
        || UNKNOWN_RECIPE;


    // 결과 이름
    const resultName =
        document.getElementById(
            'resultName'
        );


    if (resultName) {

        resultName.textContent =
            result.name;

    }


    // 결과 설명
    const resultDesc =
        document.getElementById(
            'resultDesc'
        );


    if (resultDesc) {

        resultDesc.textContent =
            result.desc;

    }


    // 결과 아이콘
    const resultIcons =
        document.getElementById(
            'resultIcons'
        );


    if (resultIcons) {

        resultIcons.textContent =
            result.icons;

    }


    // 모달
    const overlay =
        document.getElementById(
            'overlay'
        );


    const craftBtnWrap =
        document.getElementById(
            'craftBtnWrap'
        );


    if (craftBtnWrap) {

        craftBtnWrap.classList.remove(
            'show'
        );

    }


    if (overlay) {

        overlay.classList.add(
            'show'
        );

    }

}


// =========================
// 버튼 이벤트
// =========================

document.addEventListener(
    'DOMContentLoaded',
    () => {


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