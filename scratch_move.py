import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The block to move
start_marker = "            {/* DRIVER TRAVEL ROUTE / DESTINATION FILTER */}"
end_marker = "            {/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

block_to_move = content[start_idx:end_idx]

# Remove it from the original location
content = content[:start_idx] + content[end_idx:]

# Insert it before the driver profile card
insert_marker = "          {/* DRIVER PROFILE & ONLINE STATUS CARD */}"
insert_idx = content.find(insert_marker)

if insert_idx == -1:
    print("Could not find insert marker")
    sys.exit(1)

content = content[:insert_idx] + block_to_move + "\n" + content[insert_idx:]

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved successfully")
