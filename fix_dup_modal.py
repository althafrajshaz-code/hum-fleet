import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# The modal starts with "{/* ========== RIDE PREFERENCES MODAL ========== */}"
# Let's count them
count = text.count('{/* ========== RIDE PREFERENCES MODAL ========== */}')
print(f'Found {count} ride preferences modals.')

if count > 1:
    # Find the second one and remove everything from it until `    </div>\n    </>\n  );\n};` or something similar
    start_idx = text.rfind('{/* ========== RIDE PREFERENCES MODAL ========== */}')
    end_idx = text.find('    </div>\n    </>\n  );\n};', start_idx)
    
    if end_idx != -1:
        text = text[:start_idx] + text[end_idx:]
    else:
        # maybe just `  );\n};`
        end_idx2 = text.find('  );\n};', start_idx)
        text = text[:start_idx] + text[end_idx2:]

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
