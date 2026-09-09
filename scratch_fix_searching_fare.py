import re

def fix_searching_fare():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    old_div_start = "              <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', width: '100%', background: 'rgba(0,0,0,0.01)', textAlign: 'left' }}>"
    old_div_content = """                <div style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Trip Fare:</strong> INR {(() => { const f = parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])); const pFee = f >= 1500 ? 20 : f > 500 ? 15 : 10; return (f * 1.05 + pFee).toFixed(2); })()}</div>
                {parseFloat(customFare) > 0 && <div style={{ fontSize: '13px', marginBottom: '6px', color: '#10b981' }}><strong>Driver Tip:</strong> INR {parseFloat(customFare).toFixed(2)}</div>}
                
                <div style={{ fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}><strong>Total Cash Due:</strong> INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 1.05 + (parseFloat(customFare) || 0) + (parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) >= 1500 ? 20 : parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) > 500 ? 15 : 10)).toFixed(2)}</div>
                <div style={{ fontSize: '13px' }}><strong>To:</strong> {dropoff.split(',')[0]}</div>"""

    new_div_content = """                <div style={{ fontSize: '16px', fontWeight: '900', textAlign: 'center', color: 'var(--text-main)' }}>
                  TRIP FARE: INR {(() => { 
                    const f = parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])); 
                    const pFee = f >= 1500 ? 20 : f > 500 ? 15 : 10; 
                    const tip = parseFloat(customFare) || 0;
                    return (f * 1.05 + pFee + tip).toFixed(2); 
                  })()}
                </div>"""

    # We can just replace the old content with new
    if old_div_content in content:
        content = content.replace(old_div_content, new_div_content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Not found")

fix_searching_fare()
