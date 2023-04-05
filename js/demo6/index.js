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
    rows: 6,
    columns: 11
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
            duration: 1.1,
            ease: 'power3.inOut',
            xPercent: 5,
            opacity: 0
        });

        overlay.show({
            // Specify the cell's transform origin
            transformOrigin: '0% 50%',
            // Duration for each cell animation
            duration: 0.3,
            // Ease for each cell animation
            ease: 'power4.in',
            // Stagger object
            stagger: {
                grid: [overlay.options.rows, overlay.options.columns],
                from: 'start',
                each: 0.04
            }
        })
        .then(() => {
            // show content
            intro.classList.add('intro--closed');
            contentElements[position].classList.add('content--open');
            
            // Now hide the overlay
            overlay.hide({
                // Specify the cell's transform origin
                transformOrigin: '100% 50%',
                // Duration for each cell animation
                duration: 0.5,
                // Ease for each cell animation 
                ease: 'power4',
                // Stagger function
                stagger: {
                    grid: [overlay.options.rows, overlay.options.columns],
                    from: 'start',
                    each: 0.04
                }
            }).then(() => isAnimating = false);

            // Animate content image
            gsap.fromTo(contentElements[position].querySelector('.content__img'), {
                xPercent: -10,
                opacity: 0
            }, {
                duration: 0.9,
                ease: 'power4',
                xPercent: 0,
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
            duration: 1.1,
            ease: 'power3.inOut',
            xPercent: -5,
            opacity: 0
        });

        overlay.show({
            // Specify the cell's transform origin
            transformOrigin: '100% 50%',
            // Duration for each cell animation
            duration: 0.3,
            // Ease for each cell animation
            ease: 'power4.in',
            // Stagger function
            stagger: {
                grid: [overlay.options.rows, overlay.options.columns],
                from: 'end',
                each: 0.04
            }
        })
        .then(() => {
            // hide content
            intro.classList.remove('intro--closed');
            content.classList.remove('content--open');
            // Now hide the overlay
            overlay.hide({
                // Specify the cell's transform origin
                transformOrigin: '0% 50%',
                // Duration for each cell animation
                duration: 0.5,
                // Ease for each cell animation 
                ease: 'power4',
                // Stagger function
                stagger: {
                    grid: [overlay.options.rows, overlay.options.columns],
                    from: 'end',
                    each: 0.04
                }
            }).then(() => isAnimating = false);

            // Animate intro section
            gsap.fromTo(intro, {
                xPercent: 10,
            }, {
                duration: 0.9,
                ease: 'power4',
                xPercent: 0,
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