import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_audio = """                // Play a notifying sound
                try {
                  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                  const oscillator = audioCtx.createOscillator();
                  const gainNode = audioCtx.createGain();
                  oscillator.connect(gainNode);
                  gainNode.connect(audioCtx.destination);
                  oscillator.type = 'sine';
                  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
                  oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
                  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
                  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                  oscillator.start();
                  oscillator.stop(audioCtx.currentTime + 0.5);
                } catch (err) { console.error("Audio error:", err); }"""

new_audio = """                // Play a notifying sound
                try {
                  const audio = new Audio('/ringtone.ogg');
                  audio.play().catch(e => console.log('Audio play failed:', e));
                } catch (err) { console.error("Audio error:", err); }"""

if old_audio in text:
    text = text.replace(old_audio, new_audio)
    print("Replaced audio")
else:
    print("Could not find audio block exactly")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
