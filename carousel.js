const IMAGE_LIST_FILE = 'Static/images.txt';
const IMAGE_FOLDER = 'Static/Profile Pics/';

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load and populate carousel
async function loadCarouselImages() {
    try {
        const response = await fetch(IMAGE_LIST_FILE);
        const text = await response.text();
        const images = text.split('\n')
                          .map(line => line.trim())
                          .filter(line => line.length > 0);
        
        console.log(`✓ Loaded ${images.length} images for carousel`);
        
        // Shuffle images for random order
        const shuffledImages = shuffleArray(images);
        
        // Create carousel
        createCarousel(shuffledImages);
        
        // Start infinite scroll animation
        startInfiniteScroll();
    } catch (error) {
        console.error('✗ Error loading carousel images:', error);
    }
}

function createCarousel(images) {
    const track = document.getElementById('carouselTrack');
    
    if (!track) {
        console.error('Carousel track not found');
        return;
    }
    
    // Create multiple copies for truly seamless infinite loop (5 copies)
    const allImages = [...images, ...images, ...images, ...images, ...images];
    
    allImages.forEach(imageName => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'carousel-item';
        
        const img = document.createElement('img');
        img.src = `${IMAGE_FOLDER}${imageName}`;
        img.alt = imageName;
        img.loading = 'lazy';
        
        img.onerror = () => {
            console.warn(`Failed to load: ${imageName}`);
            imgWrapper.style.display = 'none';
        };
        
        imgWrapper.appendChild(img);
        track.appendChild(imgWrapper);
    });
    
    // Start from random position
    const randomOffset = Math.floor(Math.random() * images.length);
    const itemWidth = 80 + 15; // width + gap
    window.carouselPosition = -(randomOffset * itemWidth);
    
    track.style.transform = `translateX(${window.carouselPosition}px)`;
    
    console.log(`✓ Carousel created with ${allImages.length} images (${images.length} unique), starting at position ${randomOffset}`);
}

// Infinite scroll using JavaScript animation
function startInfiniteScroll() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    const itemWidth = 80 + 15; // width + gap
    const speed = 0.5; // pixels per frame (adjust for speed: higher = faster)
    
    let isPaused = false;
    
    // Pause on hover
    track.parentElement.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    track.parentElement.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    function animate() {
        if (!isPaused) {
            // Move left continuously
            window.carouselPosition -= speed;
            
            // Get total width of one set of images
            const totalItems = track.children.length;
            const oneSetWidth = (totalItems / 5) * itemWidth; // 5 copies, so divide by 5
            
            // When we've scrolled past one full set, reset seamlessly
            if (Math.abs(window.carouselPosition) >= oneSetWidth) {
                window.carouselPosition += oneSetWidth;
            }
            
            track.style.transform = `translateX(${window.carouselPosition}px)`;
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    requestAnimationFrame(animate);
    
    console.log('🎬 Infinite scroll animation started');
}

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎠 Initializing image carousel...');
    loadCarouselImages();
});
