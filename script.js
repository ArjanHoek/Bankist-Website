'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

///////////////////////////////////////
// Modal window
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

// Smooth scrolling

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

// Page navigation
// const navLinks = document.querySelectorAll('.nav__link');

// navLinks.forEach(link =>
//   link.addEventListener('click', function (e) {
//     e.preventDefault();

//     const anchorId = link.getAttribute('href');

//     if (anchorId === '#') {
//       return;
//     }

//     const anchorEl = document.querySelector(anchorId);

//     if (anchorEl) {
//       smoothTo(anchorEl);
//     }
//   })
// );

const navLinks = document.querySelector('.nav__links');

navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  const anchorId = e.target.getAttribute('href');

  if (anchorId && anchorId !== '#') {
    const anchorEl = document.querySelector(anchorId);
    smoothTo(anchorEl);
  }
});
