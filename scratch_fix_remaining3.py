import re
with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r"<\s*div style=\{\{\s*border:\s*'1px solid var\(--border\)',\s*borderRadius:\s*'12px',\s*padding:\s*'16px',\s*width:\s*'100%',\s*background:\s*'rgba\(0,0,0,0\.01\)',\s*textAlign:\s*'left'\s*\}\}>\s*<\s*div[^>]*>\s*<strong[^>]*>Base Fare:[\s\S]*?<\/\s*div>\s*<\/\s*div>", re.MULTILINE)

replacement = r'''                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>TRIP FARE: INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 1.05 + (parseFloat(customFare) || 0) + (parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) >= 1500 ? 20 : parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) > 500 ? 15 : 10)).toFixed(2)}</div>
                </div>'''

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Not found regex")

