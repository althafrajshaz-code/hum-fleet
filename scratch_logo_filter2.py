import sys
import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 2. Convert ternary to simple && and remove NORMAL DESTINATION FILTER
# The block looks like:
#              ) : (
#                /* NORMAL DESTINATION FILTER */
#                <div className="glass-card" ... >
#                  ...
#                </div>
#              )}
#
# But wait, we moved it! Let's find `/* NORMAL DESTINATION FILTER */` and delete everything from the previous `) : (` down to the next `)}` that matches it.

normal_filter_regex = re.compile(r"\s*\) : \(\r?\n\s*/\* NORMAL DESTINATION FILTER \*/.*?</div>\r?\n\s*\)}", re.DOTALL)

match = normal_filter_regex.search(content)
if match:
    content = content[:match.start()] + "\n              )}" + content[match.end():]
    
    # Also fix the ternary `? (` to `&& (`
    ternary_regex = re.compile(r"\{currentRide && \(currentRide\.status === 'Accepted' \|\| currentRide\.status === 'Arrived'\) \? \(")
    content = ternary_regex.sub(r"{currentRide && (currentRide.status === 'Accepted' || currentRide.status === 'Arrived') && (", content)
    print("Removed Normal Destination Filter and fixed ternary")
else:
    print("Could not match regex")
    # Let's try string find just in case
    idx = content.find("/* NORMAL DESTINATION FILTER */")
    if idx != -1:
        print("Found NORMAL DESTINATION FILTER at index", idx)
        
with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
