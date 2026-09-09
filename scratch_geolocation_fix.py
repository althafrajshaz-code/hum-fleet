import re

files = [
    r'D:\Althaf\hum\src\pages\PassengerDashboard.jsx',
    r'D:\Althaf\hum\src\pages\DriverDashboard.jsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject import if not exists
    if "import { Geolocation } from '@capacitor/geolocation';" not in content:
        content = "import { Geolocation } from '@capacitor/geolocation';\n" + content

    # Replace block for getCurrentPosition
    # E.g. navigator.geolocation.getCurrentPosition(async (position) => {
    # becomes: Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(async (position) => {
    
    # Actually, let's manually write replacements to be safe.
    # In PassengerDashboard:
    content = content.replace(
        "if (navigator.geolocation) {", 
        "if (true) {"
    )
    
    # We have to deal with the error callback properly for PassengerDashboard
    content = re.sub(
        r"navigator\.geolocation\.getCurrentPosition\(\s*(async\s*\([^\)]+\)\s*=>\s*\{.*?\})\s*,\s*\(\s*\)\s*=>\s*\{(.*?)\}\s*,\s*\{.*?\}\s*\);",
        r"Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }).then(\1).catch((err) => {\2});",
        content,
        flags=re.DOTALL
    )

    # In DriverDashboard:
    content = re.sub(
        r"navigator\.geolocation\.getCurrentPosition\(\s*(async\s*\([^\)]+\)\s*=>\s*\{.*?\})\s*,\s*\(.*?\)\s*=>\s*\{(.*?)\}\s*,\s*\{.*?\}\s*\);",
        r"Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }).then(\1).catch((err) => {\2});",
        content,
        flags=re.DOTALL
    )

    # Simple replacements without error handler
    content = re.sub(
        r"navigator\.geolocation\.getCurrentPosition\(\s*(async\s*\([^\)]+\)\s*=>\s*\{.*?\})\s*\);",
        r"Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(\1).catch(e => console.error(e));",
        content,
        flags=re.DOTALL
    )
    
    content = re.sub(
        r"navigator\.geolocation\.getCurrentPosition\(\s*(\([^\)]+\)\s*=>\s*\{.*?\})\s*\);",
        r"Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(\1).catch(e => console.error(e));",
        content,
        flags=re.DOTALL
    )
    
    # For watchPosition
    content = re.sub(
        r"navigator\.geolocation\.watchPosition\(\s*(async\s*\([^\)]+\)\s*=>\s*\{.*?\})\s*,\s*\(.*?\)\s*=>\s*\{.*?\}\s*,\s*\{.*?\}\s*\)",
        r"Geolocation.watchPosition({ enableHighAccuracy: true, timeout: 10000 }, \1)",
        content,
        flags=re.DOTALL
    )

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated {file}")
