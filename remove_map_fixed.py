
import re

for file_path in ['src/pages/DriverDashboard.jsx', 'src/pages/PassengerDashboard.jsx']:
    with open(file_path, 'r', encoding='utf-8') as f:
        code = f.read()
    
    # We find the start of dashboard-map and remove up to the FIRST closing div
    code = re.sub(r'<div className=.dashboard-map.*?/>\s*</div>', '', code, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    
    print('Removed map from ' + file_path)

