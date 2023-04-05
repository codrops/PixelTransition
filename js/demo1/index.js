import { preloadImages, preloadFonts } from '../utils.js';
import { Overlay } from './overlay.js';

// Select the overlay element from the DOM
const overlayEl = document.querySelector('.overlay');

// Intro
const intro = document.querySelector('.intro');

// Intro images
const images = [...intro.querySelectorAll('.intro__image')];

// Content elements
const contentElements = [...document.querySelectorAll('.content-wrap > .content')];

// Instantiate an Overlay object using the selected overlay element
const overlay = new Overlay(overlayEl, {
    rows: 8,
    columns: 14
});

let isAnimating = false;

// Attach click event listeners to each intro image
images.forEach((image, position) => {
    // Show the overlay when an intro image is clicked
    image.addEventListener('click', () => {
        if ( isAnimating ) return;
        isAnimating = true;
        
        // Animate intro section
        gsap.to(intro, {
            duration: 0.8,
            ease: 'power3.inOut',
            yPercent: 15,
            opacity: 0
        });

        overlay.show({
            // Specify the cell's transform origin
            transformOrigin: '50% 0%',
            // Duration for each cell animation
            duration: 0.4,
            // Ease for each cell animation
            ease: 'power3.inOut',
            // Stagger function
            stagger: index => 0.03 * (overlay.cells.flat()[index].row + gsap.utils.random(0,5))
        })
        .then(() => {
            // show content
            intro.classList.add('intro--closed');
            contentElements[position].classList.add('content--open');
            
            // Now hide the overlay
            overlay.hide({
                // Specify the cell's transform origin
                transformOrigin: '50% 100%',
                // Duration for each cell animation
                duration: 0.4,
                // Ease for each cell animation 
                ease: 'power2',
                // Stagger function
                stagger: index => 0.03 * (overlay.cells.flat()[index].row + gsap.utils.random(0,5))
            }).then(() => isAnimating = false);

            // Animate content image
            gsap.fromTo(contentElements[position].querySelector('.content__img'), {
                yPercent: -25,
                opacity: 0
            }, {
                duration: 0.8,
                ease: 'power3',
                yPercent: 0,
                opacity: 1
            });
        })
        
    });
});

// Attach click event listeners to each content back button
contentElements.forEach((content, position) => {
    content.querySelector('.content__back').addEventListener('click', () => {
        if ( isAnimating ) return;
        isAnimating = true;

        // Animate content image
        gsap.to(content.querySelector('.content__img'), {
            duration: 0.8,
            ease: 'power3.inOut',
            yPercent: -15,
            opacity: 0
        });

        overlay.show({
            // Specify the cell's transform origin
            transformOrigin: '50% 100%',
            // Duration for each cell animation
            duration: 0.4,
            // Ease for each cell animation
            ease: 'power3.inOut',
            // Stagger function
            stagger: (index, _, array) => 0.03 * (overlay.cells.flat()[array.length-index-1].row + gsap.utils.random(0,5))
        })
        .then(() => {
            // hide content
            intro.classList.remove('intro--closed');
            content.classList.remove('content--open');
            // Now hide the overlay
            overlay.hide({
                // Specify the cell's transform origin
                transformOrigin: '50% 0%',
                // Duration for each cell animation
                duration: 0.4,
                // Ease for each cell animation 
                ease: 'power2',
                // Stagger function
                stagger: (index, _, array) => 0.03 * (overlay.cells.flat()[array.length-index-1].row + gsap.utils.random(0,5))
            }).then(() => isAnimating = false);

            // Animate intro section
            gsap.to(intro, {
                duration: 0.8,
                ease: 'power3',
                yPercent: 0,
                opacity: 1
            });
        })

    });
});

// Preload images and fonts and remove loader
Promise.all([
    preloadImages('.intro__image, .content__img-inner'), 
    preloadFonts('ctp6pec')
]).then(() => document.body.classList.remove('loading'));