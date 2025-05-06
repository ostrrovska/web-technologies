const sliderConfig = {
    images: [
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg'
    ],
    autoplay: true,
    autoplayInterval: 3000,
    showArrows: true,
    showDots: true,
    animationDuration: 500
};


const sliderContainer = document.getElementById('sliderContainer');
const slider = document.getElementById('slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');
const autoplayCheckbox = document.getElementById('autoplayCheckbox');
const autoplayIntervalInput = document.getElementById('autoplayInterval');


let currentSlide = 0;
let autoplayInterval;
let isMouseOverSlider = false;


/**
 * Initializes the image slider with the provided configuration settings.
 * This function sets up the slider by:
 *  - Clearing and populating the slider with images specified in the config.
 *  - Creating clickable dots for navigation if `showDots` is enabled.
 *  - Starting autoplay functionality if `autoplay` is enabled.
 *  - Adding event listeners for previous/next buttons, keyboard navigation,
 *    mouse interactions, and autoplay configuration changes.
 *
 * @param {Object} config - Slider configuration object.
 * @param {Array} config.images - Array of image paths to display in the slider.
 * @param {boolean} config.autoplay - Enables or disables autoplay functionality.
 * @param {number} config.autoplayInterval - Delay interval (in ms) for autoplay.
 * @param {boolean} config.showArrows - Displays or hides navigation arrows.
 * @param {boolean} config.showDots - Toggles the visibility of navigation dots.
 * @param {number} config.animationDuration - Duration of slide transition animation.
 */
function initSlider(config) {

    slider.innerHTML = '';
    sliderDots.innerHTML = '';


    config.images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${image}" alt="Slide ${index + 1}">`;
        slider.appendChild(slide);
    });


    if (config.showDots) {
        config.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'slider-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            sliderDots.appendChild(dot);
        });
    } else {
        sliderDots.style.display = 'none';
    }


    if (config.autoplay) {
        startAutoplay(config.autoplayInterval);
    }


    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);


    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    //event lestener if cursor enters the slide
    sliderContainer.addEventListener('mouseenter', () => {
        isMouseOverSlider = true;
        if (config.autoplay) stopAutoplay();
    });

    sliderContainer.addEventListener('mouseleave', () => {
        isMouseOverSlider = false;
        if (config.autoplay && !isMouseOverSlider) startAutoplay(config.autoplayInterval);
    });


    autoplayCheckbox.addEventListener('change', () => {
        config.autoplay = autoplayCheckbox.checked;
        if (config.autoplay && !isMouseOverSlider) {
            startAutoplay(config.autoplayInterval);
        } else {
            stopAutoplay();
        }
    });

    autoplayIntervalInput.addEventListener('change', () => {
        config.autoplayInterval = parseInt(autoplayIntervalInput.value);
        if (config.autoplay && !isMouseOverSlider) {
            stopAutoplay();
            startAutoplay(config.autoplayInterval);
        }
    });
}


/**
 * Navigates to a specific slide based on the provided slide index.
 * Updates the slider position and the active dot indicator.
 *
 * @param {number} slideIndex - The index of the slide to navigate to.
 */
function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    currentSlide = slideIndex;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

/**
 * Moves to the next slide in the slider.
 * If the current slide is the last one, it loops back to the first slide.
 */
function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

/**
 * Moves to the previous slide in the slider.
 * If the current slide is the first one, it loops back to the last slide.
 */
function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
}


function startAutoplay(interval) {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, interval);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}


initSlider(sliderConfig);