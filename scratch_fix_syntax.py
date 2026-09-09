import re

with open('server/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I broke it around line 2454
# It looks like:
'''
  const monthly = completed.filter(r => new Date(r.completedAt || r.createdAt || now) >= monthAgo);

      fare: r.fare,
      passengerName: r.passengerName,
'''

pattern = re.compile(r"const monthly = completed\.filter\(r => new Date\(r\.completedAt \|\| r\.createdAt \|\| now\) >= monthAgo\);\s*fare: r\.fare,\s*passengerName: r\.passengerName,\s*completedAt: r\.completedAt \|\| r\.createdAt \|\| null,\s*driverBalance: r\.driverBalance\s*\}\)\)\s*\}\);")

replacement = r'''const monthly = completed.filter(r => new Date(r.completedAt || r.createdAt || now) >= monthAgo);
  
    const summarise = (rides) => {
      const gross = rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0);
      const commission = rides.reduce((s, r) => s + parseFloat(r.commission || (parseFloat(r.fare || 0) > 1500 ? 25 : (parseFloat(r.fare || 0) > 1000 ? 20 : 10))), 0);
      return {
        count: rides.length,
        gross: gross.toFixed(2),
        commission: commission.toFixed(2),
        net: (gross - commission).toFixed(2),
        rides: rides.map(r => ({
          id: r.id,
          pickup: r.pickup,
          dropoff: r.dropoff,
          fare: r.fare,
          passengerName: r.passengerName,
          completedAt: r.completedAt || r.createdAt || null,
          driverBalance: r.driverBalance
        }))
      };
    };'''

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('server/index.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed syntax error")
else:
    print("Pattern not found")

