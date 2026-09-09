import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r"<div style=\{\{\s*paddingLeft:\s*'8px',\s*borderLeft:\s*'2px solid var\(--primary\)',\s*color:\s*'#4b5563',\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*'2px',\s*fontSize:\s*'12px'\s*\}\}>\s*<div>.*Passenger Base Fare: INR \{parseFloat\(incomingRide\.fare\)\.toFixed\(2\)\}</div>\s*\{parseFloat\(incomingRide\.driverTip\) > 0 && <div>.*Passenger Tip: \+INR \{parseFloat\(incomingRide\.driverTip\)\.toFixed\(2\)\}</div>\}\s*<div>.*GST Tax \(5%\): \+INR \{\(parseFloat\(incomingRide\.fare\) \* 0\.05\)\.toFixed\(2\)\}</div>\s*<div>.*Platform Fee: \+INR \{parseFloat\(incomingRide\.platformFee \|\| \(parseFloat\(incomingRide\.fare\) >= 1500 \? 20 : parseFloat\(incomingRide\.fare\) > 500 \? 15 : 10\)\)\.toFixed\(2\)\}</div>\s*<div style=\{\{\s*borderTop:\s*'1px solid #e5e7eb',\s*marginTop:\s*'4px',\s*paddingTop:\s*'4px',\s*fontWeight:\s*'bold',\s*color:\s*'#000000'\s*\}\}>\s*.*Collect Cash: INR \{\(parseFloat\(incomingRide\.fare\) \* 1\.05 \+ parseFloat\(incomingRide\.driverTip \|\| 0\) \+ parseFloat\(incomingRide\.platformFee \|\| \(parseFloat\(incomingRide\.fare\) >= 1500 \? 20 : parseFloat\(incomingRide\.fare\) > 500 \? 15 : 10\)\)\)\.toFixed\(2\)\}\s*</div>\s*</div>\s*</div>\s*<div className=\"req-price est-price\" style=\{\{\s*marginTop:\s*'8px',\s*color:\s*'#000000'\s*\}\}>Total Offer: INR \{\(parseFloat\(incomingRide\.fare\) \* 1\.05 \+ parseFloat\(incomingRide\.driverTip \|\| 0\) \+ parseFloat\(incomingRide\.platformFee \|\| \(parseFloat\(incomingRide\.fare\) >= 1500 \? 20 : parseFloat\(incomingRide\.fare\) > 500 \? 15 : 10\)\)\)\.toFixed\(2\)\}</div>")

replacement = r'''</div>
                      
                      <div className="req-price est-price" style={{ marginTop: '8px', color: '#000000', display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e5e7eb', paddingTop: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800' }}>TRIP FARE:</span>
                        <span style={{ fontSize: '18px', fontWeight: '900' }}>INR {(parseFloat(incomingRide.fare) * 1.05 + parseFloat(incomingRide.driverTip || 0)).toFixed(2)}</span>
                      </div>'''

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success incoming")
else:
    print("Target not found incoming")

