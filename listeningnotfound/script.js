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
        'bassoon': { name: 'Rodrigo Rodrigues', profession: 'Bassoon' },
        'contrabassoon': { name: 'Rodrigo Rodrigues', profession: 'Contrabassoon' },
        'flute': { name: 'Giusy Panzanaro', profession: 'Flute' },
        'piano': { name: 'Valentina Donato', profession: 'Piano' },
        'theremin': { name: 'Valentina Donato', profession: 'Theremin' },
        'percussion': { name: 'Vitalia Agrba', profession: 'Percussion' },
        'drum kit': { name: 'Vitalia Agrba', profession: 'Drum Kit' },
        'violin': { name: 'Bahar Erünsal', profession: 'Violin' }
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
        { name: "Entry Loop", duration: 0, description: "Initial ambient state." },
        { name: "Activation", duration: 2.667, description: "Activation of spatial nodes." },
        { name: "Exploratory Field", duration: 4.167, description: "Sonic exploration of the physical space." },
        { name: "Latent Space Walk", duration: 2.8, description: "Traversing the digital latent dimensions." },
        { name: "Orbital Deepfake", duration: 2.9, description: "Simulated orbital spatialisation." },
        { name: "Ghost Takeover", duration: 1.233, description: "Spectral elements dominate the soundscape." },
        { name: "Digital Error", duration: 1.533, description: "Intentional artifacts and glitches." },
        { name: "Void", duration: 1, description: "Moment of silence and spatial emptiness." },
        { name: "Virtual Rain", duration: 2.1, description: "Dense granular textures." },
        { name: "Lyric Stream", duration: 2.367, description: "Melodic lines emerging from the noise." },
        { name: "Gear Network", duration: 1.633, description: "Mechanical and rhythmic interplay." },
        { name: "Memory Leak", duration: 3.067, description: "Recursive sound patterns and accumulation." },
        { name: "Ghost Swarm", duration: 1.8, description: "Collective spectral movement." },
        { name: "Post-Digital Tempest", duration: 1.867, description: "Violent digital transformation." },
        { name: "Buffer Error", duration: 1.733, description: "Temporal stuttering and delay loops." },
        { name: "Resonator", duration: 1.667, description: "Harmonic resonance and spatial tuning." },
        { name: "Micro", duration: 1.833, description: "Close-up detail and slow movement." },
        { name: "Upload Ascension", duration: 1.933, description: "Final spatial ascent." }
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
                <div class="section">${i + 1}. ${s.name}</div>
                <div class="status-container" style="width: 100%; display: flex; justify-content: center; height: 15px;"></div>
            `;
            item.addEventListener('click', () => {
                if (parseInt(item.dataset.index) <= currentSequenceData.currentIndex) {
                    openSectionModal(s);
                }
            });
            sectionList.appendChild(item);
        });
    }
    initSectionList();

    function openSectionModal(section) {
        carouselControls.style.display = 'none';
        modalImage.style.display = 'none';
        modalTitle.textContent = section.name;
        modalDescription.innerHTML = section.description;
        modalOverlay.classList.add('active');
    }

    // CACHE SYSTEM FOR BIOS
    const bioCache = {};

    async function preloadBios() {
        const biosToLoad = ['bassoon', 'flute', 'piano', 'percussion', 'violin', 'oscar', 'adri', 'isay'];
        for (const id of biosToLoad) {
            try {
                const response = await fetch('profiles/' + id + '.txt');
                if (response.ok) {
                    bioCache[id] = await response.text();
                }
            } catch (e) {
                console.warn(`Could not preload bio for ${id}`);
            }
        }
    }
    preloadBios();

    // SYNC BIO (REVERTED TO STATIC FILES)
    function syncBio(id, fallbackFile, targetEl) {
        fetchBioFromFile(fallbackFile, targetEl);
    }

    async function fetchBioFromFile(filename, targetEl) {
        const id = filename.replace('.txt', '');
        if (bioCache[id]) {
            targetEl.innerHTML = formatText(bioCache[id]);
            return;
        }

        try {
            const response = await fetch('profiles/' + filename);
            if (response.ok) {
                const text = await response.text();
                bioCache[id] = text; // Cache it for next time
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
            
            // Show current, completed, and the NEXT one
            item.style.display = i <= (activeIdx + 1) ? 'flex' : 'none';
            item.classList.remove('active', 'completed', 'next-teaser');
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
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
            } else if (i === activeIdx + 1) {
                item.classList.add('next-teaser');
                item.style.opacity = '0.3';
                item.style.pointerEvents = 'none';
                statusContainer.innerHTML = '<span class="status-text" style="font-size: 0.5rem; opacity: 0.5;">NEXT UP</span>';
            }
        });

        const activeItem = sectionList.querySelector('.section-item.active');
        if (activeItem) {
            // If the section just changed, force a jump even if user was scrolling
            const forceJump = (typeof lastActiveIndex !== 'undefined' && lastActiveIndex !== activeIdx);
            
            if (!isUserScrolling || forceJump) {
                resyncBtn.classList.remove('visible');
                isResyncing = true;
                setTimeout(() => {
                    activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => { isResyncing = false; }, 1000);
                }, 100);
            }
        }
        window.lastActiveIndex = activeIdx;

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

        const instrRef = window.firebaseRef(window.firebaseDB, 'config/instruments');
        let prevInstruments = {};

        window.firebaseOnValue(instrRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            console.log('Instrument Data Received:', data);

            const mapping = {
                'bassoon': 'Bassoon',
                'contrabassoon': 'Contrabassoon',
                'drumset': 'Drum Kit',
                'percussion': 'Percussion',
                'piano': 'Piano',
                'theremin': 'Theremin'
            };

            const pairs = [
                { opt1: 'bassoon', opt2: 'contrabassoon', key: 'pos3' },
                { opt1: 'drumset', opt2: 'percussion', key: 'pos4' },
                { opt1: 'piano', opt2: 'theremin', key: 'pos5' }
            ];

            pairs.forEach(pair => {
                const currentVal = data[pair.key];
                const prevVal = prevInstruments[pair.key];

                if (currentVal && prevVal && currentVal !== prevVal) {
                    const sourceTitle = mapping[prevVal];
                    const targetTitle = mapping[currentVal];
                    const sourceEl = Array.from(spots).find(s => s.getAttribute('title') === sourceTitle);
                    const targetEl = Array.from(spots).find(s => s.getAttribute('title') === targetTitle);
                    
                    if (sourceEl && targetEl && sourceEl.classList.contains('has-image')) {
                        triggerFlight(sourceEl, targetEl);
                    }
                } else if (currentVal && !prevVal) {
                    // Initial load sync
                    const activeTitle = mapping[currentVal];
                    const inactiveTitle = mapping[currentVal === pair.opt1 ? pair.opt2 : pair.opt1];
                    const activeEl = Array.from(spots).find(s => s.getAttribute('title') === activeTitle);
                    const inactiveEl = Array.from(spots).find(s => s.getAttribute('title') === inactiveTitle);
                    
                    if (activeEl && inactiveEl && !activeEl.classList.contains('has-image')) {
                        if (inactiveEl.classList.contains('has-image')) {
                            const img = inactiveEl.style.backgroundImage;
                            inactiveEl.style.backgroundImage = 'none';
                            inactiveEl.style.removeProperty('--photo-url');
                            inactiveEl.classList.remove('has-image');
                            activeEl.style.backgroundImage = img;
                            activeEl.style.setProperty('--photo-url', img);
                            activeEl.classList.add('has-image');
                        }
                    }
                }
                prevInstruments[pair.key] = currentVal;
            });

            // Handle Instrument Visibilities
            const visibilityMap = {
                'rodrigoVisible': ['Bassoon', 'Contrabassoon'],
                'valentinaVisible': ['Piano', 'Theremin'],
                'vitaliaVisible': ['Drum Kit', 'Percussion'],
                'giusyVisible': ['Flute'],
                'baharVisible': ['Violin']
            };

            Object.entries(visibilityMap).forEach(([key, instrumentTitles]) => {
                const isVisible = data[key] !== false;
                spots.forEach(s => {
                    if (instrumentTitles.includes(s.getAttribute('title'))) {
                        if (!isVisible) {
                            s.classList.add('photo-hidden');
                        } else {
                            s.classList.remove('photo-hidden');
                        }
                    }
                });
            });
        });

        window.firebaseOnValue(seqRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                currentSequenceData = data;
                updateSectionUI();
                updateVisualFocus();
            }
        });

        // --- Color Tint Sync ---
        const colorRef = window.firebaseRef(window.firebaseDB, 'config/color');
        let tintOverlay = document.getElementById('bg-tint-overlay');
        if (!tintOverlay) {
            tintOverlay = document.createElement('div');
            tintOverlay.id = 'bg-tint-overlay';
            Object.assign(tintOverlay.style, {
                position: 'fixed',
                top: 0, left: 0, width: '100%', height: '100%',
                pointerEvents: 'none',
                zIndex: '-1',
                backgroundColor: 'transparent'
            });
            tintOverlay.classList.add('tint-overlay');
            document.body.appendChild(tintOverlay);
        }

        window.firebaseOnValue(colorRef, (snap) => {
            const color = snap.val();
            if (color && /^#[0-9A-F]{6}$/i.test(color)) {
                // Set opacity to 45% (72 in hex)
                const tint = color + '72';
                tintOverlay.style.backgroundColor = tint;
                
                // Also apply to header
                const header = document.querySelector('.glitch-header');
                if (header) {
                    header.style.backgroundColor = tint;
                }
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

        if (spot.classList.contains('has-image') && !spot.classList.contains('photo-hidden')) {
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
            
            // Prevent selection if photo is hidden or doesn't have an image
            if (!spot.classList.contains('has-image') || spot.classList.contains('photo-hidden')) {
                spot.classList.add('buzz');
                setTimeout(() => spot.classList.remove('buzz'), 300);
                return;
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
        
        // Centers for the line
        const x1 = pRect.left + pRect.width / 2;
        const y1 = pRect.top + pRect.height / 2;
        const x2 = cRect.left + cRect.width / 2;
        const y2 = cRect.top + cRect.height / 2;
        const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;

        // 1. Create the dashed line
        const line = document.createElement('div');
        Object.assign(line.style, {
            position: 'fixed',
            top: y1 + 'px',
            left: x1 + 'px',
            width: dist + 'px',
            height: '1px',
            background: 'repeating-linear-gradient(90deg, white 0, white 4px, transparent 4px, transparent 8px)',
            transformOrigin: '0 50%',
            transform: `rotate(${angle}deg)`,
            opacity: '0',
            zIndex: '9998',
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease, clip-path 10s ease-in-out',
            clipPath: 'inset(0 0 0 0)',
            filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))'
        });
        document.body.appendChild(line);

        // 2. Setup the flying photo (but don't move it yet)
        sourceEl.style.backgroundImage = 'none';
        sourceEl.style.removeProperty('--photo-url');
        sourceEl.classList.remove('has-image');
        
        const flyingPhoto = document.createElement('div');
        if (sourceEl.classList.contains('photo-hidden')) {
            flyingPhoto.classList.add('photo-hidden');
        }
        Object.assign(flyingPhoto.style, {
            position: 'fixed',
            top: pRect.top + 'px',
            left: pRect.left + 'px',
            width: pRect.width + 'px',
            height: pRect.height + 'px',
            backgroundImage: originalBg,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            boxShadow: 'var(--neon-shadow)',
            zIndex: '9999',
            transition: 'transform 10s ease-in-out, opacity 0.3s ease',
            pointerEvents: 'none'
        });
        document.body.appendChild(flyingPhoto);

        // Show the line first
        setTimeout(() => { line.style.opacity = '0.4'; }, 50);

        // 3. Start the animation after a short delay
        setTimeout(() => {
            flyingPhoto.offsetWidth; // force reflow
            flyingPhoto.style.transform = `translate(${cRect.left - pRect.left}px, ${cRect.top - pRect.top}px)`;
            line.style.clipPath = 'inset(0 0 0 100%)';
            
            targetEl.style.pointerEvents = 'none';
            
            setTimeout(() => {
                flyingPhoto.style.opacity = '0';
                line.style.opacity = '0';
                setTimeout(() => {
                    flyingPhoto.remove();
                    line.remove();
                    targetEl.style.backgroundImage = originalBg;
                    targetEl.style.setProperty('--photo-url', originalBg);
                    targetEl.classList.add('has-image');
                    targetEl.style.pointerEvents = 'auto';
                }, 300);
            }, 10000);
        }, 600); // 600ms delay to show the line before flight
    }
});

