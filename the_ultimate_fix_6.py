import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("fetch(`${API_BASE}", "fetch(API_BASE + `")
text = text.replace("fetch(API_BASE + `/api/drivers/bank`, {", "fetch(API_BASE + '/api/drivers/bank', {")
text = text.replace("fetch(API_BASE + `/api/drivers/pay-dues`, {", "fetch(API_BASE + '/api/drivers/pay-dues', {")
text = text.replace("fetch(API_BASE + `/api/drivers/earnings?email=${encodeURIComponent(email)}`);", "fetch(API_BASE + '/api/drivers/earnings?email=' + encodeURIComponent(email));")
text = text.replace("fetch(API_BASE + `/api/rides/${currentRide.id}/complete`, {", "fetch(API_BASE + '/api/rides/' + currentRide.id + '/complete', {")

# Let's just catch any remaining backticks inside fetch
text = re.sub(r'fetch\(API_BASE \+ `([^`]+)`', r"fetch(API_BASE + '\1'", text)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
