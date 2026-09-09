import re

helper_code = r'''const getPlatformFee = (fare) => {
  const f = parseFloat(fare || 0);
  if (f >= 1500) return 25;
  if (f >= 1000) return 20;
  if (f >= 500) return 15;
  if (f >= 200) return 10;
  return 5;
};'''

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    pd = f.read()

if 'const getPlatformFee' not in pd:
    pd = pd.replace("const calculateCategoryFare = (cat) => {", helper_code + "\n\n  const calculateCategoryFare = (cat) => {")

pattern = r'\(parseFloat\(calculateCategoryFare\(categories\.find\(c => c\.name === selectedTier\) \|\| categories\[0\]\)\) >= 1500 \? 20 : parseFloat\(calculateCategoryFare\(categories\.find\(c => c\.name === selectedTier\) \|\| categories\[0\]\)\) > 500 \? 15 : 10\)'
replacement = r'getPlatformFee(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0]))'

pd = re.sub(pattern, replacement, pd)

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(pd)

print("Replaced logic in passenger dashboard.")
