import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the oscillator beep code with playing an audio file
old_audio = r"// Play a notifying sound\s*try \{\s*const audioCtx = new \(window\.AudioContext \|\| window\.webkitAudioContext\)\(\);\s*const oscillator = audioCtx\.createOscillator\(\);\s*const gainNode = audioCtx\.createGain\(\);\s*oscillator\.connect\(gainNode\);\s*gainNode\.connect\(audioCtx\.destination\);\s*oscillator\.type = 'sine';\s*oscillator\.frequency\.setValueAtTime\(880, audioCtx\.currentTime\);\s*oscillator\.frequency\.exponentialRampToValueAtTime\(440, audioCtx\.currentTime \+ 0\.5\);\s*gainNode\.gain\.setValueAtTime\(1, audioCtx\.currentTime\);\s*gainNode\.gain\.exponentialRampToValueAtTime\(0\.01, audioCtx\.currentTime \+ 0\.5\);\s*oscillator\.start\(\);\s*oscillator\.stop\(audioCtx\.currentTime \+ 0\.5\);\s*\} catch \(err\) \{ console\.error\(\"Audio error:\", err\); \}"

new_audio = """// Play a notifying sound
                try {
                  const audio = new Audio('/ringtone.ogg');
                  audio.play().catch(e => console.log('Audio play failed:', e));
                } catch (err) { console.error("Audio error:", err); }"""

if re.search(old_audio, text):
    text = re.sub(old_audio, new_audio, text)
    print("Replaced audio")
else:
    print("Could not find audio")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
