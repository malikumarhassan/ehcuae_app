document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelectorAll('.prev');
    const nextBtn = document.querySelectorAll('.next');
    const progressBar = document.querySelector('.progress-bar');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;
    let isAnimating = false;
    let progressInterval;

    // Function to reset and animate the progress bar
    function startProgressBar() {
        const progressBar = slides[currentSlideIndex].querySelector('.progress-bar');
        progressBar.style.width = '0%'; // Reset progress bar
        let progress = 0;

        // Smoothly increase the progress bar width over the duration of the slide
        clearInterval(progressInterval); // Clear any previous intervals
        progressInterval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(progressInterval); // Stop the interval once progress reaches 100%
            } else {
                progress += 1; // Increase by 1% for smooth animation
                progressBar.style.width = `${progress}%`;
            }
        }, 50); // Adjust interval for smoothness (50ms per step)
    }

    // Function to handle slide transitions
    function updateSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const nextSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
        const currentSlide = slides[currentSlideIndex];
        const nextSlide = slides[nextSlideIndex];

        // Set initial visibility for next slide
        gsap.set(nextSlide, { visibility: 'visible' });

        // Create timeline for smooth transition
        const tl = gsap.timeline({
            onComplete: () => {
                currentSlide.classList.remove('active');
                nextSlide.classList.add('active');
                gsap.set(currentSlide, { visibility: 'hidden' });
                currentSlideIndex = nextSlideIndex;
                isAnimating = false;
                startProgressBar(); // Restart progress bar animation after slide change
            }
        });

        // Animate out current slide
        tl.to(currentSlide.querySelector('.main-content'), {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: 'power2.inOut'
        })
        .to(currentSlide, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        }, '-=0.3');

        // Animate in next slide
        tl.fromTo(nextSlide, 
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.inOut'
            },
            '-=0.3'
        )
        .fromTo(nextSlide.querySelector('.main-content'),
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            },
            '-=0.2'
        );
    }

    // Event listeners for navigation buttons
    prevBtn.forEach(btn => btn.addEventListener('click', () => updateSlide(-1)));
    nextBtn.forEach(btn => btn.addEventListener('click', () => updateSlide(1)));
    
    // .addEventListener('click', () => updateSlide(-1));
    // nextBtn.addEventListener('click', () => updateSlide(1));

    // Initial setup for progress bar
    startProgressBar();

    // Auto-slide every 5 seconds (5000ms)
   let autoSlideInterval = setInterval(() => {
        updateSlide(1); // Move to the next slide
    }, 6000);

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', (e) => {

        if (e.key === 'ArrowLeft') {
            clearInterval(autoSlideInterval); 
            updateSlide(-1)
            autoSlideInterval = setInterval(() => {
                updateSlide(1); // Move to the next slide
            }, 6000);
        };
        if (e.key === 'ArrowRight'){
                 clearInterval(autoSlideInterval); 
            updateSlide(-1)
            autoSlideInterval = setInterval(() => {
                updateSlide(1); // Move to the next slide
            }, 6000);
        };
    });
});
