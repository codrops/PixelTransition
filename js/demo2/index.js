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
    rows: 9,
    columns: 17
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
            duration: 1,
            ease: 'power3.inOut',
            scaleX: 1.8,
            opacity: 0
        });

        overlay.show({
            // Duration for each cell animation
            duration: 0.25,
            // Ease for each cell animation
            ease: 'power1.in',
            // Stagger object
            stagger: {
                grid: [overlay.options.rows, overlay.options.columns],
                from: 'center',
                each: 0.025
            }
        })
        .then(() => {
            // show content
            intro.classList.add('intro--closed');
            contentElements[position].classList.add('content--open');
            
            // Now hide the overlay
            overlay.hide({
                // Duration for each cell animation
                duration: 0.25,
                // Ease for each cell animation
                ease: 'power1',
                // Stagger object
                stagger: {
                    grid: [overlay.options.rows, overlay.options.columns],
                    from: 'center',
                    each: 0.025
                }
            }).then(() => isAnimating = false);
            
            // Animate content image
            gsap.fromTo(contentElements[position].querySelector('.content__img'), {
                scaleX: 0.5,
                opacity: 0
            }, {
                duration: 0.8,
                ease: 'power3',
                scaleX: 1,
                opacity: 1
            });
        })
        
    });
});

// Attach click event listeners to each content back button
contentElements.forEach((content) => {
    content.querySelector('.content__back').addEventListener('click', () => {
        if ( isAnimating ) return;
        isAnimating = true;

        // Animate content image
        gsap.to(content.querySelector('.content__img'), {
            duration: 0.7,
            ease: 'power2.in',
            scaleX: 0.75,
            opacity: 0
        });
 
        overlay.show({
            // Duration for each cell animation
            duration: 0.25,
            // Ease for each cell animation
            ease: 'power1.in',
            // Stagger object
            stagger: {
                grid: [overlay.options.rows, overlay.options.columns],
                from: 'edges',
                each: 0.025
            }
        })
        .then(() => {
            // hide content here
            intro.classList.remove('intro--closed');
            content.classList.remove('content--open');
            
            // Now hide the overlay
            overlay.hide({
                // Duration for each cell animation
                duration: 0.25,
                // Ease for each cell animation
                ease: 'power1',
                // Stagger object
                stagger: {
                    grid: [overlay.options.rows, overlay.options.columns],
                    from: 'edges',
                    each: 0.025
                }
            }).then(() => isAnimating = false);

            // Animate intro section
            gsap.to(intro, {
                duration: 0.8,
                ease: 'expo',
                scaleX: 1,
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