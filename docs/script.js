        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

const modal = document.getElementById('projectModal');
const closeBtn = document.querySelector('.close-btn');
const projectLinks = document.querySelectorAll('.project-link');

function openModal(projectTitle, projectPeriod, projectDetails) {
    document.getElementById('modalProjectTitle').textContent = projectTitle;
    document.getElementById('modalProjectPeriod').textContent = projectPeriod;
    document.getElementById('modalProjectDetails').innerHTML = projectDetails;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeModal);

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'returnBtn') {
        closeModal();
    }
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
            e.preventDefault();
            const projectCard = e.target.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            const projectPeriod = projectCard.querySelector('h4').textContent;
            const projectDescription = projectCard.querySelector('p').textContent;
            const projectSpecs = projectCard.getAttribute('data-specs');
            const projectImages = projectCard.getAttribute('data-images');
            const githubLink = projectCard.getAttribute('data-github');
            const techTags = projectCard.querySelectorAll('.tech-tag');

            let tagsHTML = '<h4>Technologies utilisées :</h4><div class="tech-tags">';
            techTags.forEach(tag => {
                tagsHTML += `<span class="tech-tag">${tag.textContent}</span>`;
            });
            tagsHTML += '</div>';

            const githubHTML = githubLink ? `
                <a href="${githubLink}" target="_blank" class="github-link">
                    <img src="images/logo_github.png" alt="GitHub"> Voir le code source
                </a>
            ` : '';

            let imagesHTML = '';
            if (projectImages) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(projectImages, 'text/html');
                const images = doc.querySelectorAll('img');
                
                if (images.length > 1) {
                    const imagesWithCaptions = Array.from(images).map((img, i) => {
                        const caption = img.getAttribute('data-caption') || img.getAttribute('alt') || '';
                        return `
                            <div class="carousel-slide">
                                ${img.outerHTML}
                                ${caption ? `<p class="image-caption">${caption}</p>` : ''}
                            </div>
                        `;
                    }).join('');
                    
                    imagesHTML = `
                        <div class="carousel-container">
                            <button class="carousel-btn prev">‹</button>
                            <div class="carousel-images">
                                ${imagesWithCaptions}
                            </div>
                            <button class="carousel-btn next">›</button>
                        </div>
                        <div class="carousel-indicators">
                            ${Array.from(images).map((_, i) => 
                                `<div class="carousel-indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
                            ).join('')}
                        </div>
                    `;
                } else if (images.length === 1) {
                    const img = images[0];
                    const caption = img.getAttribute('data-caption') || img.getAttribute('alt') || '';
                    imagesHTML = `
                        <div class="single-image">
                            ${img.outerHTML}
                            ${caption ? `<p class="image-caption">${caption}</p>` : ''}
                        </div>
                    `;
                }
            }

            const projectDetails = `
                <div>
                    <p>${projectDescription}</p>
                    ${projectSpecs ? `<div class="project-specs">${projectSpecs}</div>` : ''}
                    ${tagsHTML}
                    ${githubHTML}
                    <button class="btn btn-secondary" id="returnBtn" style="margin-top: 16px;">Retour</button>
                </div>
                ${imagesHTML ? `<div class="project-images">${imagesHTML}</div>` : ''}
            `;

            openModal(projectTitle, projectPeriod, projectDetails);

            if (projectImages) {
                initCarousel();
            }
        }
    });
});

function initCarousel() {
    const carouselImages = document.querySelector('.carousel-images');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!carouselImages) return;
    
    const images = carouselImages.querySelectorAll('img');
    let currentIndex = 0;

    function updateCarousel() {
        carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
}