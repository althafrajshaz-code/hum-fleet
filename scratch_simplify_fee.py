import re

new_helper = r'''const getPlatformFee = (fare) => {
  const f = parseFloat(fare || 0);
  if (f >= 500) return 15;
  if (f >= 200) return 10;
  return 5;
};'''

old_helper = r'''const getPlatformFee = (fare) => {
  const f = parseFloat(fare || 0);
  if (f >= 1500) return 25;
  if (f >= 1000) return 20;
  if (f >= 500) return 15;
  if (f >= 200) return 10;
  return 5;
};'''

def replace_in_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    if old_helper in content:
        content = content.replace(old_helper, new_helper)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Replaced in {filename}")

replace_in_file('src/pages/DriverDashboard.jsx')
replace_in_file('src/pages/PassengerDashboard.jsx')
replace_in_file('server/index.js')
