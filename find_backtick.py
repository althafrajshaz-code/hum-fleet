with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
count = 0
for i, line in enumerate(lines[:700]):
    c = line.count("`")
    if c > 0:
        count += c
        print(f"Line {i+1} has {c} backticks. Total so far: {count}")
