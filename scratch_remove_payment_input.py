import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern1 = re.compile(r"<label style=\{\{\s*fontSize:\s*'11px',\s*color:\s*'var\(--text-muted\)',\s*fontWeight:\s*'700'\s*\}\}>Enter Payment Amount \(INR\)</label>\s*<input\s*type=\"number\"\s*className=\"input-field\"\s*placeholder=\{e\.g\. \$\{parseFloat\(wallet\.toBePaid \|\| 0\)\.toFixed\(2\)\}\}\s*value=\{payAmount\}\s*onChange=\{\(e\) => setPayAmount\(e\.target\.value\)\}\s*style=\{\{\s*width:\s*'100%',\s*fontSize:\s*'14px',\s*padding:\s*'10px 12px'\s*\}\}\s*/>")

replacement1 = r""

if pattern1.search(content):
    content = pattern1.sub(replacement1, content)
    print("Found and replaced input field.")
else:
    print("Input field not found.")

pattern2 = re.compile(r"disabled=\{isPayingDues\}\s*onClick=\{async \(\) => \{\s*const amt = parseFloat\(payAmount\);\s*if \(isNaN\(amt\) \|\| amt <= 0\) \{\s*alert\('Please enter a valid payment amount\.'\);\s*return;\s*\}")

replacement2 = r'''disabled={isPayingDues || parseFloat(wallet?.toBePaid || 0) <= 0}
                onClick={async () => {
                  const amt = parseFloat(wallet?.toBePaid || 0);
                  if (isNaN(amt) || amt <= 0) {
                    alert('No pending dues to settle.');
                    return;
                  }'''

if pattern2.search(content):
    content = pattern2.sub(replacement2, content)
    print("Found and replaced button logic.")
else:
    print("Button logic not found.")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

