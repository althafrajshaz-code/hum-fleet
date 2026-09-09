import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

bad_start = '  return (\n    <div className="dashboard-page">'
good_start = '  return (\n    <>\n    <div className="dashboard-page">'
text = text.replace(bad_start, good_start)

bad_end = '      )}\n    </div>\n  );\n};'
good_end = '      )}\n    </div>\n    </>\n  );\n};'
text = text.replace(bad_end, good_end)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
