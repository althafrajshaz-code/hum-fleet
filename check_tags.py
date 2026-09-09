import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('  return (\n    <div className="dashboard-page">')
if start_idx == -1:
    print('return not found')
    exit()

text = text[start_idx + len('  return (\n'):]

depth = 0
for match in re.finditer(r'<(/?)([a-zA-Z0-9_]+)\b[^>]*?(/?)\>', text):
    is_closing = match.group(1) == '/'
    tag = match.group(2)
    is_self_closing = match.group(3) == '/' or tag in ['br', 'hr', 'img', 'input', 'canvas', 'source']
    
    if text[match.end()-2:match.end()] == '/>':
        is_self_closing = True

    if not tag[0].isupper() and tag not in ['div', 'span', 'p', 'h2', 'h3', 'h4', 'form', 'button', 'strong', 'label', 'table', 'thead', 'tbody', 'tr', 'th', 'td']:
        continue

    if is_self_closing:
        continue

    if is_closing:
        depth -= 1
        if depth < 0:
            print('EXTRA CLOSING TAG AT LINE:', text[:match.start()].count('\n'))
            try:
                print('Context:')
                print(text[match.start()-100:match.start()+100])
            except Exception:
                print("Could not print context due to encoding error")
            break
    else:
        depth += 1
