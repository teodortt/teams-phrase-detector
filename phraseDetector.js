function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square'; // louder, harsher tone
    oscillator.frequency.value = 1000; // Hz (higher pitch for noticeability)
    gainNode.gain.value = 0.5; // louder (0.0 to 1.0, be careful with 1.0)

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.8); // longer beep (0.8s)
}

// Flash screen once for a few seconds
function flashScreen(matchedWord) {
    if (document.getElementById('flash-alert')) return; // avoid duplicates

    const overlay = document.createElement('div');
    overlay.id = 'flash-alert';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'red',
        opacity: '0.8',
        zIndex: '999999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center'
    });
    overlay.innerText = `⚠ ALERT: Keyword Detected! ⚠\nMatched Word: ${matchedWord}`;

    document.body.appendChild(overlay);

    let visible = true;
    const interval = setInterval(() => {
        visible = !visible;
        overlay.style.opacity = visible ? '0.8' : '0';
    }, 300);

    setTimeout(() => {
        clearInterval(interval);
        overlay.remove();
    }, 5000); // flash for 5 seconds
}

function watchCaptionsWithAlert(keywords, onMatch, delay = 1000) {
    const lowerKeywords = keywords.map(k => k.toLowerCase());
    const seen = new WeakSet();

    function handleElement(el) {
        if (!el.matches || !el.matches('span[data-tid="closed-caption-text"]') || seen.has(el)) return;
        seen.add(el);

        let lastText = el.textContent.trim();
        let stableTimer;

        function checkForUpdate() {
            const currentText = el.textContent.trim();
            if (currentText !== lastText) {
                lastText = currentText;
                clearTimeout(stableTimer);
                stableTimer = setTimeout(finalCheck, delay);  // restart delay if text changed
            }
        }

        function finalCheck() {
            const text = el.textContent.trim();
            const lowerText = text.toLowerCase();

            const matchedWord = lowerKeywords.find(word => lowerText.includes(word));

            if (matchedWord) {
                playBeep();
                flashScreen(matchedWord); // Pass the matched word as an argument
                if (onMatch) onMatch(text);
            }
        }


        // Start monitoring text changes
        const observer = new MutationObserver(checkForUpdate);
        observer.observe(el, { characterData: true, subtree: true, childList: true });

        // Initial delay before first check
        stableTimer = setTimeout(finalCheck, delay);
    }

    // Process existing captions
    document.querySelectorAll('span[data-tid="closed-caption-text"]').forEach(handleElement);

    // Observe for new caption spans
    const mainObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    handleElement(node);
                    node.querySelectorAll?.('span[data-tid="closed-caption-text"]').forEach(handleElement);
                }
            }
        }
    });

    mainObserver.observe(document.body, { childList: true, subtree: true });

    return () => mainObserver.disconnect();
}

// ---- Usage ----
const keywords = ['Teodor', 'Theodore', 'Todor', 'Tudor', 'Theo', 'Tio', 'Odor', 'Dale', 'Front-end team', 'Frontend team', 'Front-end side', 'Front end'];
const stop = watchCaptionsWithAlert(keywords, text => {
    console.log('Keyword detected in caption:', text);
});
