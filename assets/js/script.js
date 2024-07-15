// * Анимация у smartphone и laptop при перемещении курсора
let smartphone = document.getElementById("smartphone");
let laptop = document.getElementById("laptop");
let mousePos = { x: undefined, y: undefined };
let updateScheduled = false;
window.addEventListener('mousemove', (event) => {
    mousePos = { x: event.clientX, y: event.clientY };
    if (!updateScheduled) {
        updateScheduled = true;
        requestAnimationFrame(updateElements);
    }
});
window.addEventListener('mouseout', () => {
    smartphone.style.transform = 'translate(0px, 0px)';
    laptop.style.transform = 'translate(0px, 0px)';
});
function updateElements() {
    let mousePosSmartphone = { x: ((window.innerWidth-mousePos.x)/window.innerWidth-0.5)*20, y: ((window.innerHeight-mousePos.y)/window.innerHeight-0.5)*20 };
    let mousePosLaptop = { x: (mousePos.x/window.innerWidth-0.5)*20, y: (mousePos.y/window.innerHeight-0.5)*20 };
    smartphone.style.transform = `translate(${mousePosSmartphone.x}px, ${mousePosSmartphone.y}px)`;
    laptop.style.transform = `translate(${mousePosLaptop.x}px, ${mousePosLaptop.y}px)`;
    updateScheduled = false;
}

// * Быстрый рост числа с атрибутом toNumber (и toNumberSpeed в мс)
let numberElement = document.querySelectorAll('[toNumber]');
let numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let el = entry.target;
            let maxNumber = parseInt(el.getAttribute('toNumber'));
            let speed = el.getAttribute('toNumberSpeed');
            let duration = speed ? parseFloat(speed) : 1000;
            let currentNumber = 0;
            let originalContent = el.innerHTML;
            let startTime = performance.now();
            let tempEl = el.cloneNode(true);
            tempEl.style.visibility = 'hidden';
            tempEl.style.position = 'absolute';
            tempEl.innerHTML = originalContent.replace('0', maxNumber);
            document.body.appendChild(tempEl);
            let rect = tempEl.getBoundingClientRect().width;
            let originalRect = el.getBoundingClientRect().width;
            if (originalRect < rect) {
                el.style.width = rect + 'px';
            }
            document.body.removeChild(tempEl);
            function updateNumber() {
                let elapsed = performance.now() - startTime;
                currentNumber = Math.floor(maxNumber * elapsed / duration);
                if (currentNumber > maxNumber) {
                    currentNumber = maxNumber;
                }
                el.innerHTML = originalContent.replace('0', currentNumber);
                if (currentNumber < maxNumber) {
                    requestAnimationFrame(updateNumber);
                }
            }
            updateNumber();
            numberObserver.unobserve(el);
        }
    });
});
numberElement.forEach(el => {
    numberObserver.observe(el);
});

// * Плавное переливание фона у cta 
let gradientShift = 0;
let intervalId = null;
function shiftGradient() {
    const cta = document.getElementById('cta');
    if (cta) {
        if (gradientShift < 105) {
            cta.style.background = `linear-gradient(45deg, #efb76e ${gradientShift - 105}%, #eb791d ${gradientShift - 5}%, #eb791d ${gradientShift}%, #efb76e ${gradientShift + 100}%)`;
        } else {
            cta.style.background = `linear-gradient(45deg, #eb791d ${gradientShift - 210}%, #efb76e ${gradientShift - 110}%, #efb76e ${gradientShift - 105}%, #eb791d ${gradientShift - 5}%)`;
        }
        gradientShift = (gradientShift + 1) % 210;
    }
}
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!intervalId) {
                intervalId = setInterval(shiftGradient, 75);
            }
        } else {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    });
}, {});
observer.observe(document.getElementById('cta'));



// * Выбор локации
function chooseLocation(n){
    document.querySelector(`.loc-sel.selected`).classList.remove("selected");
    document.querySelector(`#location${n}`).classList.add("selected");
}


// * Загрузка
let body = document.querySelector('body');
let loader = document.getElementById("loader");
window.addEventListener("load", function () {
    setTimeout(function () {
        body.style.overflowX = 'auto';
        body.style.overflowY = 'auto';
        loader.classList.add("hidden");
    }, 300);
});