# Teams Phrase Detector

A lightweight tool that monitors Microsoft Teams live captions for specific keywords and alerts you with sound + a flashing full-screen warning whenever a match is detected. Perfect for catching important names, topics, or compliance keywords during meetings.

✅ Features

Live Monitoring of Teams closed captions in real time
Custom Keywords: Enter any list of words dynamically
Visual Alert: Full-screen red flash with the matched word
Audio Alert: Beep sound for extra attention
Runs in Browser – No install required

🚀 How It Works:

Teams must have captions enabled (Turn on live captions).
The script watches for changes in the captions area (span[data-tid="closed-caption-text"]).

If any keyword is detected:

- Plays a beep sound
- Shows a red flashing overlay for 5 seconds
- Displays the matched word

## 📌 🛠️ Installation & Usage (as bookmark)

1. Copy the code below and paste it as the URL of a new bookmark

2. Name it as you like.

3. Join a Teams meeting and turn on captions.

4. Click the bookmark → Enter your keywords → Done!

```javascript
javascript: (function () {
  try {
    const input = prompt(
      "Enter keywords (comma separated):",
      "Computer,Meeting,Project"
    );
    if (!input) return;
    const keywords = input.split(",").map((k) => k.trim());
    function playBeep() {
      const ctx = new (window.AudioContext || window.webkitAudioContext)(),
        osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.value = 1000;
      gain.gain.value = 0.5;
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    }
    function flashScreen(matchedWord) {
      if (document.getElementById("flash-alert")) return;
      const o = document.createElement("div");
      o.id = "flash-alert";
      Object.assign(o.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "red",
        opacity: "0.8",
        zIndex: "999999",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "48px",
        fontWeight: "bold",
        textAlign: "center",
      });
      const line1 = document.createElement("div");
      line1.textContent = "⚠ ALERT: Keyword Detected! ⚠";
      const line2 = document.createElement("div");
      line2.textContent = "Matched Word: " + matchedWord;
      o.appendChild(line1);
      o.appendChild(line2);
      document.body.appendChild(o);
      let v = true;
      const i = setInterval(() => {
        v = !v;
        o.style.opacity = v ? "0.8" : "0";
      }, 300);
      setTimeout(() => {
        clearInterval(i);
        o.remove();
      }, 5000);
    }
    function watchCaptionsWithAlert(words, onMatch, delay = 1000) {
      const lowerKeywords = words.map((w) => w.toLowerCase()),
        seen = new WeakSet();
      function handleElement(el) {
        if (
          !el.matches ||
          !el.matches('span[data-tid="closed-caption-text"]') ||
          seen.has(el)
        )
          return;
        seen.add(el);
        let lastText = el.textContent.trim(),
          stableTimer;
        function checkForUpdate() {
          const currentText = el.textContent.trim();
          if (currentText !== lastText) {
            lastText = currentText;
            clearTimeout(stableTimer);
            stableTimer = setTimeout(finalCheck, delay);
          }
        }
        function finalCheck() {
          const text = el.textContent.trim(),
            lowerText = text.toLowerCase(),
            matchedWord = lowerKeywords.find((word) =>
              lowerText.includes(word)
            );
          if (matchedWord) {
            playBeep();
            flashScreen(matchedWord);
            if (onMatch) onMatch(text);
          }
        }
        new MutationObserver(checkForUpdate).observe(el, {
          characterData: true,
          subtree: true,
          childList: true,
        });
        stableTimer = setTimeout(finalCheck, delay);
      }
      document
        .querySelectorAll('span[data-tid="closed-caption-text"]')
        .forEach(handleElement);
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              handleElement(node);
              node
                .querySelectorAll?.('span[data-tid="closed-caption-text"]')
                .forEach(handleElement);
            }
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
      return () => mainObserver.disconnect();
    }
    watchCaptionsWithAlert(keywords, (text) =>
      console.log("Keyword detected in caption:", text)
    );
    alert("✅ Teams Phrase Detector is running...");
  } catch (e) {
    console.error("Bookmarklet error:", e);
    alert("❌ Error: Check console for details.");
  }
})();
```
