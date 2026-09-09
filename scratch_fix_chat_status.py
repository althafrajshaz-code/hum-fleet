import re

def fix_chat_status():
    with open('server/index.js', 'r', encoding='utf-8') as f:
        content = f.read()

    old_logic = "if (!ride || (ride.status !== 'Accepted' && ride.status !== 'In Progress')) {"
    new_logic = "if (!ride || (ride.status !== 'Accepted' && ride.status !== 'Arrived' && ride.status !== 'In Progress')) {"
    
    if old_logic in content:
        content = content.replace(old_logic, new_logic)
        with open('server/index.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Not found")

fix_chat_status()
