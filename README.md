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

## 🛠️ Installation & Usage (as bookmark)

1. Copy the code below and paste it as the URL of a new bookmark

2. Name it as you like.

3. Join a Teams meeting and turn on captions.

4. Click the bookmark → Enter your keywords → Done!

```javascript
javascript: (function () {
  try {
    const e = prompt(
      "Enter keywords (comma separated):",
      "Computer,Meeting,Project"
    );
    if (!e) return;
    const t = e.split(",").map((e) => e.trim());
    let o = !1;
    const n = (function (e, t, n = 1e3) {
        const r = e.map((e) => e.toLowerCase()),
          c = new WeakSet();
        let i;
        function d(e) {
          if (
            !e.matches ||
            !e.matches('span[data-tid="closed-caption-text"]') ||
            c.has(e)
          )
            return;
          c.add(e);
          let i,
            d = e.textContent.trim();
          function a() {
            const n = e.textContent.trim(),
              c = n.toLowerCase(),
              i = r.find((e) => c.includes(e));
            i &&
              (!(function () {
                if (o) return;
                const e = new (window.AudioContext ||
                    window.webkitAudioContext)(),
                  t = e.createOscillator(),
                  n = e.createGain();
                t.connect(n),
                  n.connect(e.destination),
                  (t.type = "square"),
                  (t.frequency.value = 1e3),
                  (n.gain.value = 0.5),
                  t.start(),
                  t.stop(e.currentTime + 0.8);
              })(),
              (function (e) {
                if (document.getElementById("flash-alert")) return;
                const t = document.createElement("div");
                (t.id = "flash-alert"),
                  Object.assign(t.style, {
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
                const o = document.createElement("div");
                o.textContent = "⚠ ALERT: Keyword Detected! ⚠";
                const n = document.createElement("div");
                (n.textContent = "Matched Word: " + e),
                  t.appendChild(o),
                  t.appendChild(n),
                  document.body.appendChild(t);
                let r = !0;
                const c = setInterval(() => {
                  (r = !r), (t.style.opacity = r ? "0.8" : "0");
                }, 300);
                setTimeout(() => {
                  clearInterval(c), t.remove();
                }, 5e3);
              })(i),
              t && t(n));
          }
          new MutationObserver(function () {
            const t = e.textContent.trim();
            t !== d && ((d = t), clearTimeout(i), (i = setTimeout(a, n)));
          }).observe(e, { characterData: !0, subtree: !0, childList: !0 }),
            (i = setTimeout(a, n));
        }
        return (
          document
            .querySelectorAll('span[data-tid="closed-caption-text"]')
            .forEach(d),
          (i = new MutationObserver((e) => {
            for (const t of e)
              for (const e of t.addedNodes)
                1 === e.nodeType &&
                  (d(e),
                  e
                    .querySelectorAll?.('span[data-tid="closed-caption-text"]')
                    .forEach(d));
          })),
          i.observe(document.body, { childList: !0, subtree: !0 }),
          () => i.disconnect()
        );
      })(t, (e) => console.log("Keyword detected:", e)),
      r = document.createElement("button");
    (r.innerText = "🛑 Stop Detector"),
      Object.assign(r.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 999999,
        padding: "10px 20px",
        background: "black",
        color: "white",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }),
      document.body.appendChild(r),
      (r.onclick = () => {
        n(), r.remove(), c.remove(), alert("✅ Detector stopped.");
      });
    const c = document.createElement("button");
    (c.innerText = "🔊 Sound On"),
      Object.assign(c.style, {
        position: "fixed",
        bottom: "60px",
        right: "20px",
        zIndex: 999999,
        padding: "10px 20px",
        background: "black",
        color: "white",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }),
      document.body.appendChild(c),
      (c.onclick = () => {
        (o = !o), (c.innerText = o ? "🔇 Muted" : "🔊 Sound On");
      }),
      alert("✅ Teams Phrase Detector is running...");
  } catch (e) {
    console.error("Bookmarklet error:", e),
      alert("❌ Error: Check console for details.");
  }
})();
```
