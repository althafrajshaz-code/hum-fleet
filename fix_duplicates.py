import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Wait, the second offline message doesn't have the comment "{/* Offline Message */}" because it was the original one which didn't have that comment, only the one I injected had it!
# Wait, let me just find all blocks of `<h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800' }}>You are Currently Offline</h4>`
# and delete the SECOND one.

regex_offline = r"\{!isOnline && \(\s*<div style=\{\{ border: '1px solid var\(--border\)', borderRadius: '14px', padding: '24px', textAlign: 'center', background: 'rgba\(255,255,255,0\.01\)' \}\}>\s*<Power size=\{32\} color=\"var\(--text-muted\)\" style=\{\{ marginBottom: '10px' \}\} \/>\s*<h4 style=\{\{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800' \}\}>You are Currently Offline<\/h4>\s*<p style=\{\{ margin: 0, fontSize: '12px', color: 'var\(--text-muted\)' \}\}>Click \"Go Online\" in the header to start accepting ride dispatches\.<\/p>\s*<\/div>\s*\)\}"

matches = list(re.finditer(regex_offline, content))
if len(matches) > 1:
    last_match = matches[-1]
    content = content[:last_match.start()] + content[last_match.end():]

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
