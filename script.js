'use strict';

// MODAL WINDOW
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLLING
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

/* Old method */
// const smoothTo = el =>
//   window.scrollTo({
//     top: el.getBoundingClientRect().top + window.scrollY,
//     behavior: 'smooth',
//   });

const smoothTo = el => el.scrollIntoView({ behavior: 'smooth' });

btnScrollTo.addEventListener('click', function () {
  smoothTo(section1);
});

// PAGE NAVIGATION
const navLinks = document.querySelector('.nav__links');

navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  const anchorId = e.target.getAttribute('href');

  if (anchorId && anchorId !== '#') {
    const anchorEl = document.querySelector(anchorId);
    smoothTo(anchorEl);
  }
});

// TABBED COMPONENT
const switchClass = (className, removeFromItems, addToItem) => {
  removeFromItems.forEach(item => item.classList.remove(className));
  addToItem && addToItem.classList.add(className);
};

const operationsEl = document.querySelector('.operations');
const tabContainer = operationsEl.querySelector('.operations__tab-container');
const tabItems = tabContainer.querySelectorAll('.operations__tab');
const contentItems = operationsEl.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function ({ target }) {
  const tab = target.closest('.operations__tab');

  if (!tab) return;

  const newTab = operationsEl.querySelector(
    `.operations__content--${tab.getAttribute('data-tab')}`
  );

  switchClass('operations__tab--active', tabItems, tab);
  switchClass('operations__content--active', contentItems, newTab);
});

// NAVIGATION HOVER EFFECT
const getSiblings = (self, siblingClass, parentClass) =>
  Array.from(
    self.closest(`.${parentClass}`).querySelectorAll(`.${siblingClass}`)
  ).filter(el => el !== self);

const navEl = document.querySelector('.nav');

const handleHover = function ({ target, type }) {
  if (!target.classList.contains('nav__link')) return;

  const siblings = getSiblings(target, 'nav__link', 'nav__links');
  const logo = target.closest('.nav').querySelector('img');

  [...siblings, logo].forEach(item =>
    item.classList[type === 'mouseover' ? 'add' : 'remove']('opaque')
  );
};

['mouseover', 'mouseout'].forEach(event =>
  navEl.addEventListener(event, handleHover)
);

// STICKY NAVIGATION
// window.addEventListener('scroll', function () {
//   const threshold = section1.getBoundingClientRect().top;

//   if (threshold < 0) {
//     navEl.classList.add('sticky');
//   } else {
//     navEl.classList.remove('sticky');
//   }
// });

const headerEl = document.querySelector('.header');
const stickyNavRootMargin = `-${navEl.getBoundingClientRect().height}px`;

const stickyNavCallback = ([{ isIntersecting }]) => {
  navEl.classList[isIntersecting ? 'remove' : 'add']('sticky');
};

const stickyNavOptions = {
  root: null,
  threshold: 0,
  rootMargin: stickyNavRootMargin,
};

const stickyNavObserver = new IntersectionObserver(
  stickyNavCallback,
  stickyNavOptions
);

stickyNavObserver.observe(headerEl);

// REVEAL SECTIONS ON SCROLL
const sections = document.querySelectorAll('.section');

const sectionRevealCallback = (entries, observer) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      target.classList.remove('section--hidden');
      observer.unobserve(target);
    }
  });
};

const sectionRevealOptions = {
  root: null,
  threshold: 0.2,
};

const sectionRevealObserver = new IntersectionObserver(
  sectionRevealCallback,
  sectionRevealOptions
);

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionRevealObserver.observe(section);
});

// REVEAL IMAGES ON SCROLL
const images = document.querySelectorAll('.lazy-img');

const imgCallback = (entries, observer) => {
  entries.forEach(entry => {
    const { isIntersecting, target } = entry;

    if (!isIntersecting) return;

    target.src = target.getAttribute('data-src');

    target.addEventListener('load', function () {
      target.classList.remove('lazy-img');
    });

    observer.unobserve(target);
  });
};

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imgObserver = new IntersectionObserver(imgCallback, imgOptions);

images.forEach(img => imgObserver.observe(img));

// IMAGE SLIDER
const sliderEl = document.querySelector('.slider');
const slides = sliderEl.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

let curSlide = 0;

const setCurSlide = slideNum => (curSlide = slideNum);

const moveSlides = () =>
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - curSlide) * 100}%)`;
  });

const updateDots = () =>
  dotsContainer.querySelectorAll('.dots__dot').forEach(dot => {
    if (+dot.dataset.slide === curSlide) {
      dot.classList.add('dots__dot--active');
    } else {
      dot.classList.remove('dots__dot--active');
    }
  });

const goToSlide = slideNum => {
  setCurSlide(slideNum);
  moveSlides();
  updateDots();
};

const getLastIndex = () => slides.length - 1;
const getNextSlide = cur => (cur === getLastIndex() ? 0 : cur + 1);
const getPrevSlide = cur => (cur === 0 ? getLastIndex() : cur - 1);

const createDots = () =>
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.classList.add('dots__dot');
    d.dataset.slide = i;
    dotsContainer.appendChild(d);
  });

const addSliderEventListeners = () => {
  sliderEl.addEventListener('click', function ({ target }) {
    const isBtn = target.closest('.slider__btn');

    if (!isBtn) return;

    const next = target.classList.contains('slider__btn--right');

    goToSlide(next ? getNextSlide(curSlide) : getPrevSlide(curSlide));
  });

  dotsContainer.addEventListener('click', function ({ target: { dataset } }) {
    const { slide } = dataset;
    dataset && goToSlide(+slide);
  });

  document.addEventListener('keydown', function ({ key }) {
    key === 'ArrowLeft' && goToSlide(getPrevSlide(curSlide));
    key === 'ArrowRight' && goToSlide(getNextSlide(curSlide));
  });
};

// INITIATE SLIDER
(() => {
  addSliderEventListeners();
  createDots();
  goToSlide(0);
})();
