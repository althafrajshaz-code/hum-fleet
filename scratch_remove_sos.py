import re

def remove_sos():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The block to remove starts with {/* FLOATING SOS BUTTON ON MAP */}
    # and ends with </button>\n          )}
    
    pattern = re.compile(r"\{\/\* FLOATING SOS BUTTON ON MAP \*\/\}[\s\S]*?<\/button>\s*\)\}", re.MULTILINE)
    
    if pattern.search(content):
        content = pattern.sub('', content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Not found")

remove_sos()
