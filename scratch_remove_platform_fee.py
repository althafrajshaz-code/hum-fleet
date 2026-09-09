import re

def remove_platform_fee():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The platform fee line:
    # <div style={{ fontSize: '13px', marginBottom: '6px', color: '#6366f1' }}><strong>Platform Fee:</strong> INR {(() => { const f = parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])); return f >= 1500 ? '20.00' : f > 500 ? '15.00' : '10.00'; })()}</div>
    
    # We will use regex to remove it entirely
    pattern = re.compile(r"<div style=\{\{ fontSize: '13px', marginBottom: '6px', color: '#6366f1' \}\}><strong>Platform Fee:<\/strong> INR \{\(\(\) => \{ const f = parseFloat\(calculateCategoryFare\(categories\.find\(c => c\.name === selectedTier\) \|\| categories\[0\]\)\); return f >= 1500 \? '20\.00' : f > 500 \? '15\.00' : '10\.00'; \}\)\(\)\}<\/div>\s*", re.MULTILINE)
    
    if pattern.search(content):
        content = pattern.sub('', content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully removed Platform Fee display.")
    else:
        print("Pattern not found!")

remove_platform_fee()
