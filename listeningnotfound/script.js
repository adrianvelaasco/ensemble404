document.addEventListener('DOMContentLoaded', () => {
    const spots = document.querySelectorAll('.spot');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    const pairedInstruments = {
        'contrabassoon': 'bassoon',
        'bassoon': 'contrabassoon',
        'drum kit': 'percussion',
        'percussion': 'drum kit',
        'theremin': 'piano',
        'piano': 'theremin'
    };

    const textInheritance = {
        'contrabassoon': 'bassoon',
        'drumkit': 'percussion',
        'theremin': 'piano'
    };

    const musicians = {
        'bassoon': { name: 'Rodrigo Rodrigues', profession: 'Bassoonist' },
        'contrabassoon': { name: 'Rodrigo Rodrigues', profession: 'Contrabassoonist' },
        'flute': { name: 'Giusy Panazador', profession: 'Flutist' },
        'piano': { name: 'Valentina Donato', profession: 'Pianist' },
        'theremin': { name: 'Valentina Donato', profession: 'Thereminist' },
        'percussion': { name: 'Vitalia Agrba', profession: 'Percussionist' },
        'drum kit': { name: 'Vitalia Agrba', profession: 'Drummer' },
        'violin': { name: 'Bahar Erünsal', profession: 'Violinist' }
    };

    const fohProfiles = [
        { id: 'oscar', name: 'Oscar Corpo', profession: 'Composer and Artistic Director' },
        { id: 'adri', name: 'Adri Velasco', profession: 'Video, Light, Web Design' },
        { id: 'isay', name: 'Isay Ramirez', profession: 'Sound Engineer' }
    ];
    let currentFohIndex = 0;

    const carouselControls = document.getElementById('carousel-controls');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselDots = document.getElementById('carousel-dots');

    const btnListening = document.getElementById('btn-listening');
    const btnEnsemble = document.getElementById('btn-ensemble');

    // SECTION SEQUENCE DATA
    const sections = [
        { name: "Entry Loop", duration: 0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { name: "Activation", duration: 2, description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
        { name: "Exploratory Field", duration: 4, description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
        { name: "Latent Space Walk", duration: 2, description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
        { name: "Orbit", duration: 1, description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium." },
        { name: "Deepfake", duration: 2, description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur." },
        { name: "Ghost Takeover", duration: 2, description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit." },
        { name: "Digital Error", duration: 1, description: "Aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis." },
        { name: "Rarefied", duration: 2, description: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur." },
        { name: "Pointillism", duration: 2, description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum." },
        { name: "Digital Rain", duration: 2, description: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est." },
        { name: "Etheric + Melody", duration: 2, description: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias." },
        { name: "Whisper Network", duration: 2, description: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et." },
        { name: "Groups + Spatialisation + Imitation + Memory Leak", duration: 2, description: "Error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo." },
        { name: "Ghost Swarm", duration: 2, description: "Inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem." },
        { name: "Collective Swell", duration: 1, description: "Quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione." },
        { name: "Post-Digital Tempest", duration: 1, description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit." },
        { name: "Buffer Error", duration: 2, description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium." },
        { name: "Resonator", duration: 2, description: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta." },
        { name: "Micro + Slow Movement", duration: 3, description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur." },
        { name: "Upload Ascension", duration: 4, description: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur." }
    ];

    let currentSequenceData = { currentIndex: 0, startTime: 0, isRunning: false };
    let serverTimeOffset = 0;

    // UI ELEMENTS FOR SECTIONS
    const sectionList = document.getElementById('section-list');
    const resyncBtn = document.getElementById('resync-btn');
    let isUserScrolling = false;
    let isResyncing = false;

    // Initialize Section List
    function initSectionList() {
        if (!sectionList) return;
        sectionList.innerHTML = '';
        sections.forEach((s, i) => {
            const item = document.createElement('div');
            item.className = 'section-item';
            item.dataset.index = i;
            item.innerHTML = `
                <div class="section">[${toRoman(i+1)}] ${s.name}</div>
                <div class="status-container" style="width: 100%; display: flex; justify-content: center; height: 15px;"></div>
            `;
            item.addEventListener('click', () => openSectionModal(s));
            sectionList.appendChild(item);
        });
    }
    initSectionList();

    function openSectionModal(section) {
        carouselControls.style.display = 'none';
        modalImage.style.display = 'none';
        modalTitle.textContent = section.name;
        modalDescription.innerHTML = `<span style="font-size: 0.7rem; opacity: 0.5; display: block; margin-bottom: 10px;">SECTION [${toRoman(sections.indexOf(section)+1)}]</span>` + section.description;
        modalOverlay.classList.add('active');
    }

    // SYNC BIO (REVERTED TO STATIC FILES)
    function syncBio(id, fallbackFile, targetEl) {
        fetchBioFromFile(fallbackFile, targetEl);
    }

    async function fetchBioFromFile(filename, targetEl) {
        try {
            const response = await fetch('profiles/' + filename);
            if (response.ok) {
                const text = await response.text();
                targetEl.innerHTML = formatText(text);
            } else {
                targetEl.innerText = "No technical description found.";
            }
        } catch (e) {
            targetEl.innerText = "Error loading data.";
        }
    }

    function formatText(text) {
        if (!text) return "";
        return text.replace(/\n/g, '<br>');
    }

    function toRoman(num) {
        if (typeof num !== 'number' || num <= 0) return "";
        const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        let roman = '';
        for (let i in lookup) {
            while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    }

    function updateSectionUI() {
        if (!sectionList) return;
        const activeIdx = currentSequenceData.currentIndex;
        const items = sectionList.querySelectorAll('.section-item');
        
        items.forEach((item, i) => {
            const statusContainer = item.querySelector('.status-container');
            
            item.style.display = 'flex';
            item.classList.remove('active', 'completed');
            statusContainer.innerHTML = '';

            if (i < activeIdx) {
                item.classList.add('completed');
                statusContainer.innerHTML = '<span class="status-text">COMPLETED</span>';
            } else if (i === activeIdx) {
                item.classList.add('active');
                if (currentSequenceData.isRunning) {
                    statusContainer.innerHTML = `
                        <div class="progress-container" style="width: 180px; height: 2px; background: rgba(255,255,255,0.1); border-radius: 1px; overflow: hidden;">
                            <div id="section-progress-bar" style="height: 100%; width: 0%; background: var(--rect-border); transition: width 0.1s linear;"></div>
                        </div>
                    `;
                }
            }
        });

        if (!isUserScrolling) {
            resyncBtn.classList.remove('visible');
            const activeItem = sectionList.querySelector('.section-item.active');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Manual update of visual active state
        updateVisualFocus();
    }

    function updateVisualFocus() {
        const items = sectionList.querySelectorAll('.section-item');
        const containerRect = sectionList.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;

        let closestItem = null;
        let minDistance = Infinity;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;
            const distance = Math.abs(itemCenter - containerCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });

        items.forEach(item => item.classList.remove('visual-active'));
        if (closestItem) {
            closestItem.classList.add('visual-active');
        }
    }

    if (sectionList) {
        const handleUserInteraction = () => {
            if (isResyncing) return; // Ignore if we are auto-scrolling
            isUserScrolling = true;
        };

        sectionList.addEventListener('wheel', handleUserInteraction);
        sectionList.addEventListener('touchstart', handleUserInteraction);

        sectionList.addEventListener('scroll', () => {
            updateVisualFocus();

            const activeItem = sectionList.querySelector('.section-item.active');
            if (!activeItem || isResyncing) return;

            const containerRect = sectionList.getBoundingClientRect();
            const activeRect = activeItem.getBoundingClientRect();
            
            // CAP SCROLL: Prevent scrolling beyond the active item
            const containerCenter = containerRect.top + containerRect.height / 2;
            const activeCenter = activeRect.top + activeRect.height / 2;

            if (activeCenter < containerCenter - 5) {
                sectionList.scrollTo({
                    top: activeItem.offsetTop - (containerRect.height / 2) + (activeRect.height / 2),
                    behavior: 'auto'
                });
                return;
            }

            const centerDiff = Math.abs(activeCenter - containerCenter);

            // Reactive visibility based on distance
            if (centerDiff > 25) {
                isUserScrolling = true;
                resyncBtn.classList.add('visible');
            } else if (centerDiff < 10) {
                isUserScrolling = false;
                resyncBtn.classList.remove('visible');
            }
        });
    }

    function handleResync() {
        if (isResyncing) return;
        isUserScrolling = false;
        isResyncing = true;
        resyncBtn.classList.remove('visible');
        
        const activeItem = sectionList.querySelector('.section-item.active');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
            isResyncing = false;
        }, 600);
    }

    if (resyncBtn) {
        resyncBtn.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Stop drift and potential double trigger
            handleResync();
        }, { passive: false });
        
        resyncBtn.addEventListener('click', (e) => {
            handleResync();
        });
    }

    // FIREBASE SEQUENCE INTEGRATION
    if (window.firebaseDB && window.firebaseRef && window.firebaseOnValue) {
        const seqRef = window.firebaseRef(window.firebaseDB, 'sequence');
        const offsetRef = window.firebaseRef(window.firebaseDB, ".info/serverTimeOffset");

        window.firebaseOnValue(offsetRef, (snap) => {
            serverTimeOffset = snap.val() || 0;
        });

        window.firebaseOnValue(seqRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                currentSequenceData = data;
                updateSectionUI();
            }
        });
    }

    // TIMER LOOP
    function tick() {
        if (currentSequenceData.isRunning && currentSequenceData.startTime) {
            const idx = currentSequenceData.currentIndex;
            const currentSection = sections[idx];

            if (currentSection && currentSection.duration > 0) {
                const durationMs = currentSection.duration * 60 * 1000;
                const elapsed = Date.now() - (currentSequenceData.startTime - serverTimeOffset);
                const progress = Math.min(100, (elapsed / durationMs) * 100);

                const progressBar = document.getElementById('section-progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }

                // AUTO ADVANCE
                if (progress >= 100) {
                    const nextIdx = idx + 1;
                    if (nextIdx < sections.length) {
                        window.firebaseSet(window.firebaseRef(window.firebaseDB, 'sequence'), {
                            currentIndex: nextIdx,
                            startTime: Date.now() + serverTimeOffset,
                            isRunning: true
                        });
                    } else {
                        // End of sequence
                        window.firebaseSet(window.firebaseRef(window.firebaseDB, 'sequence'), {
                            currentIndex: idx,
                            startTime: 0,
                            isRunning: false
                        });
                    }
                }
            }
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // REST OF THE SCRIPT (MODALS, FLYING PHOTOS, ETC.)
    if (btnListening) {
        btnListening.addEventListener('click', () => {
            openSpecialModal('Listening Not Found', 'listeningnotfound');
        });
    }

    if (btnEnsemble) {
        btnEnsemble.addEventListener('click', () => {
            openSpecialModal('Ensemble 404', 'ensemble404');
        });
    }

    function openSpecialModal(title, id) {
        carouselControls.style.display = 'none';
        modalImage.style.display = 'none';
        modalTitle.textContent = title;
        modalDescription.innerHTML = 'Loading...';
        modalOverlay.classList.add('active');

        syncBio(id, id + '.txt', modalDescription);
    }

    async function showFohProfile(index) {
        currentFohIndex = index;
        const profile = fohProfiles[index];

        modalTitle.innerHTML = `${profile.name} <span class="profession">${profile.profession}</span>`;
        modalImage.style.backgroundImage = `url('profiles/${profile.id}.jpg')`;
        modalImage.style.display = 'block';
        carouselControls.style.display = 'flex';
        carouselDots.innerHTML = fohProfiles.map((_, i) => `<span class="dot ${i === index ? 'active' : ''}"></span>`).join('');

        modalDescription.innerHTML = 'Loading...';
        syncBio(profile.id, profile.id + '.txt', modalDescription);
    }

    async function openModal(spot) {
        carouselControls.style.display = 'none';
        const title = spot.getAttribute('title');
        const lowerTitle = title.toLowerCase();

        if (musicians[lowerTitle]) {
            modalTitle.innerHTML = `${musicians[lowerTitle].name} <span class="profession">${musicians[lowerTitle].profession}</span>`;
        } else {
            modalTitle.textContent = title;
        }

        modalDescription.textContent = 'Loading details...';

        if (spot.classList.contains('has-image')) {
            const bgImage = spot.style.backgroundImage;
            const urlMatch = bgImage.match(/url\(["']?([^"']*)["']?\)/);
            if (urlMatch && urlMatch[1]) {
                const imgUrl = urlMatch[1];
                modalImage.style.backgroundImage = `url('${imgUrl}')`;
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }
        } else {
            modalImage.style.display = 'none';
        }

        modalOverlay.classList.add('active');

        let fileNameBase = title.toLowerCase().replace(/ /g, '');
        if (textInheritance[fileNameBase]) {
            fileNameBase = textInheritance[fileNameBase];
        }

        syncBio(fileNameBase, fileNameBase + '.txt', modalDescription);
    }

    const fohBox = document.querySelector('.foh-box');
    if (fohBox) {
        fohBox.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            showFohProfile(0);
        });
    }

    carouselPrev.addEventListener('click', () => {
        let newIndex = currentFohIndex - 1;
        if (newIndex < 0) newIndex = fohProfiles.length - 1;
        const dynamicContent = document.getElementById('modal-dynamic-content');
        dynamicContent.classList.add('slide-out-left');
        setTimeout(async () => {
            await showFohProfile(newIndex);
            dynamicContent.classList.remove('slide-out-left');
            dynamicContent.classList.add('slide-in-right');
            setTimeout(() => dynamicContent.classList.remove('slide-in-right'), 150);
        }, 150);
    });

    carouselNext.addEventListener('click', () => {
        let newIndex = currentFohIndex + 1;
        if (newIndex >= fohProfiles.length) newIndex = 0;
        const dynamicContent = document.getElementById('modal-dynamic-content');
        dynamicContent.classList.add('slide-out-right');
        setTimeout(async () => {
            await showFohProfile(newIndex);
            dynamicContent.classList.remove('slide-out-right');
            dynamicContent.classList.add('slide-in-left');
            setTimeout(() => dynamicContent.classList.remove('slide-in-left'), 150);
        }, 150);
    });

    spots.forEach(spot => {
        spot.addEventListener('click', () => {
            const title = spot.getAttribute('title');
            const lowerTitle = title.toLowerCase();
            if (pairedInstruments[lowerTitle] && !spot.classList.contains('has-image')) {
                const partnerTitleMatch = pairedInstruments[lowerTitle];
                let partnerElement = Array.from(spots).find(s => s.getAttribute('title').toLowerCase() === partnerTitleMatch);
                if (partnerElement && partnerElement.classList.contains('has-image')) {
                    triggerFlight(partnerElement, spot);
                    return;
                }
            }
            openModal(spot);
        });
    });

    closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('active'); });

    spots.forEach(spot => {
        spot.addEventListener('mouseenter', () => spot.style.transform = 'scale(1.1)');
        spot.addEventListener('mouseleave', () => spot.style.transform = '');
    });

    function triggerFlight(sourceEl, targetEl) {
        const pRect = sourceEl.getBoundingClientRect();
        const cRect = targetEl.getBoundingClientRect();
        const originalBg = sourceEl.style.backgroundImage;
        sourceEl.style.backgroundImage = 'none';
        sourceEl.classList.remove('has-image');
        const flyingPhoto = document.createElement('div');
        Object.assign(flyingPhoto.style, {
            position: 'fixed', top: pRect.top + 'px', left: pRect.left + 'px',
            width: pRect.width + 'px', height: pRect.height + 'px',
            backgroundImage: originalBg, backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: '9999',
            transition: 'all 4s ease-in-out', pointerEvents: 'none'
        });
        document.body.appendChild(flyingPhoto);
        flyingPhoto.offsetWidth;
        const randomRotation = Math.random() > 0.5 ? 360 : -360;
        flyingPhoto.style.transform = `translate(${cRect.left - pRect.left}px, ${cRect.top - pRect.top}px) rotate(${randomRotation}deg) scale(1.2)`;
        targetEl.style.pointerEvents = 'none';
        setTimeout(() => {
            flyingPhoto.remove();
            targetEl.style.backgroundImage = originalBg;
            targetEl.classList.add('has-image');
            targetEl.style.pointerEvents = 'auto';
        }, 4100);
    }

    const automaticPairs = [['bassoon', 'contrabassoon'], ['piano', 'theremin'], ['percussion', 'drum kit']];
    function scheduleRandomFlight(pairArr) {
        setTimeout(() => {
            const spotA = Array.from(spots).find(s => s.getAttribute('title').toLowerCase() === pairArr[0]);
            const spotB = Array.from(spots).find(s => s.getAttribute('title').toLowerCase() === pairArr[1]);
            if (spotA && spotB) {
                if (spotA.classList.contains('has-image') && !spotB.classList.contains('has-image')) triggerFlight(spotA, spotB);
                else if (spotB.classList.contains('has-image') && !spotA.classList.contains('has-image')) triggerFlight(spotB, spotA);
            }
            scheduleRandomFlight(pairArr);
        }, Math.random() * 80000 + 40000);
    }
    automaticPairs.forEach(pair => scheduleRandomFlight(pair));
});
