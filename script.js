'use strict';
///////////////////////////////////////
// Modal window

// Objects
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const message = document.createElement('div');

// Buttons
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
// Operations Tabbed Component
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content  ');
// NAV
const nav = document.querySelector('.nav');
const navLinksUl = document.querySelector('.nav__links');
// Sections
const sections = document.querySelectorAll('.section');
const sectionOne = document.getElementById('section--1');
// Images
const lazyImgs = document.querySelectorAll('img[data-src]');
// SLIDER
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
let dotsContainer = document.querySelector('.dots');

//^ Open Madal click on the btnsOpenModal
const openModal = event => {
  // Prevent scrolling up
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

//^ Close Modal Cases
const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

//^ Cookie-message
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.append(message);
message.style.height = parseFloat(getComputedStyle(message).height) + 25 + 'px';

const btn = document.querySelector('.btn--close-cookie');
btn.addEventListener('click', () => message.remove());

//^ Scrolle btn Learn More smoothly
btnScrollTo.addEventListener('click', event => {
  // Prevent scrolling up
  event.preventDefault();
  // # the modern way
  sectionOne.scrollIntoView({ behavior: 'smooth' });
});

//^ Page Navigation
navLinksUl.addEventListener('click', event => {
  event.preventDefault();

  if (event.target.classList.contains('nav__link')) {
    const section = document.querySelector(event.target.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

//^ Building a Tabbed Component
tabsContainer.addEventListener('click', event => {
  event.preventDefault();

  // # to make sure if the span was clicked it also refer to the tab
  const clicked = event.target.closest('.operations__tab');
  // # Guard clause
  if (!clicked) return;

  // #
  tabsContent.forEach(content =>
    content ===
    document.querySelector(`.operations__content--${clicked.dataset.tab}`)
      ? content.classList.add('operations__content--active')
      : content.classList.remove('operations__content--active')
  );

  // #
  tabs.forEach(tab =>
    tab === clicked
      ? tab.classList.add('operations__tab--active')
      : tab.classList.remove('operations__tab--active')
  );
});

//^ Menu Fade Anamation
// Refactring fn for mouseover and mouseout
const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(sibling => {
      sibling !== link ? (sibling.style.opacity = this) : sibling;
    });
    logo.style.opacity = this;
  }
};
// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//^ Sticky navigation
//THE better way of event scroll: THE INTERSECTION OBSERVER API:
function stickyNav(entries, observer) {
  // # we have only 1 threshold so >> 1 entry
  const [entry] = entries;
  // # check first when it is really Intersecting and make it appear
  if (entry.isIntersecting) nav.classList.remove('sticky');
  else nav.classList.add('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${getComputedStyle(nav).height}`,
});
headerObserver.observe(header);

//^ Revealing Sections on Scroll
const sectionsRevealing = (entries, observer) => {
  const [entry] = entries;

  // Using gaurd clusar
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  // # To Stop observing the sections more that one time
  observer.unobserve(entry.target);
};
const sectionsObserver = new IntersectionObserver(sectionsRevealing, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

//^ Lazy loading images
// this is for better performance more that visual
// really great for performance : old,slow mobiles or internet
const lazyImgsLoading = (entries, observer) => {
  const [entry] = entries;
  // #
  if (!entry.isIntersecting) return;
  // #  replace the img with the small size img
  entry.target.src = entry.target.dataset.src;
  // # DO this just right when the img is loading (depents on the user internet)
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  // #
  observer.unobserve(entry.target);
};
const imagesObserver = new IntersectionObserver(lazyImgsLoading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyImgs.forEach(img => imagesObserver.observe(img));

//^ THe slider
function sliderActivate() {
  let curSlide = 0;
  let maxSlide = slides.length - 1;

  // Functions
  const createDots = () => {
    slides.forEach((_, i) => {
      i === 0
        ? (dotsContainer.innerHTML += `<button class="dots__dot dots__dot--active" data-slide = "${i}"></div>`)
        : (dotsContainer.innerHTML += `<button class="dots__dot " data-slide = "${i}"></div>`);
    });
  };
  createDots();

  const dots = document.querySelectorAll('.dots__dot');

  const dotActive = slide =>
    dots.forEach(dot =>
      dot.dataset.slide == slide
        ? dot.classList.add('dots__dot--active')
        : dot.classList.remove('dots__dot--active')
    );

  const goToSlide = slide =>
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  goToSlide(0);

  const nextSlide = () => {
    curSlide === maxSlide ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
    dotActive(curSlide);
  };

  const prevSlide = () => {
    curSlide === 0 ? (curSlide = maxSlide) : curSlide--;
    goToSlide(curSlide);
    dotActive(curSlide);
  };

  // Event handlers ...
  slider.addEventListener('click', event => {
    if (event.target.classList.contains('slider__btn--right')) nextSlide();
    else if (event.target.classList.contains('slider__btn--left')) prevSlide();
    else if (event.target.classList.contains('dots__dot')) {
      goToSlide(event.target.dataset.slide);
      dotActive(event.target.dataset.slide);
    }
  });

  document.addEventListener('keydown', e => {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
}

sliderActivate();

////////////////////////////////////////////
////////////////////////////////////////////
