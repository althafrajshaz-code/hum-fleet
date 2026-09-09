import re

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Simplify Fare Breakdown Box (STATE 2: Searching)
fare_breakdown_pattern = re.compile(r"<div style=\{\{ background: 'rgba\(0,0,0,0\.2\)', padding: '12px', borderRadius: '8px', border: '1px solid var\(--border\)' \}\}>[\s\S]*?<div style=\{\{ fontSize: '13px' \}\}><strong>To:<\/strong> \{dropoff\.split\(\',\',\s*1\)\[0\] \|\| dropoff\.split\(\',\', 1\)\[0\]\}<\/div>\s*<\/div>")
# Wait, dropoff.split(',')[0] in my current grep result is exactly {dropoff.split(',')[0]}

target = r'''                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Base Fare:</strong> INR {parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])).toFixed(2)}</div>
                  {parseFloat(customFare) > 0 && <div style={{ fontSize: '13px', marginBottom: '6px', color: '#10b981' }}><strong>Driver Tip:</strong> INR {parseFloat(customFare).toFixed(2)}</div>}
                  <div style={{ fontSize: '13px', marginBottom: '6px', color: '#f59e0b' }}><strong>GST Surcharge (5%):</strong> INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 0.05).toFixed(2)}</div>
                  <div style={{ fontSize: '13px', marginBottom: '6px', color: '#6366f1' }}><strong>Platform Fee:</strong> INR {(() => { const f = parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])); return f >= 1500 ? '20.00' : f > 500 ? '15.00' : '10.00'; })()}</div>
                  <div style={{ fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}><strong>Total Cash Due:</strong> INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 1.05 + (parseFloat(customFare) || 0) + (parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) >= 1500 ? 20 : parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) > 500 ? 15 : 10)).toFixed(2)}</div>
                  <div style={{ fontSize: '13px' }}><strong>To:</strong> {dropoff.split(',')[0]}</div>
                </div>'''

replacement = r'''                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>TRIP FARE: INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 1.05 + (parseFloat(customFare) || 0) + (parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) >= 1500 ? 20 : parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) > 500 ? 15 : 10)).toFixed(2)}</div>
                </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced searching fare box")
else:
    print("Could not find searching fare box target")

# 2. Centralize Intercity Trip Approved
content = content.replace(
    "<span style={{ background: '#6366f1', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>",
    "<span style={{ background: '#6366f1', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', alignSelf: 'center' }}>"
)

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

