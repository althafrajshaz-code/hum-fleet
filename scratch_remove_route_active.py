with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{(isSearching || rideAccepted) && (" in line:
        start_idx = i
    if "Route Active" in line and start_idx != -1:
        # found it, now find the closing )}
        for j in range(i, len(lines)):
            if ")} " in lines[j] or ")}" in lines[j]:
                end_idx = j + 1
                break
        break

if start_idx != -1 and end_idx != -1:
    del lines[start_idx:end_idx]
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Success: Removed lines", start_idx, "to", end_idx)
else:
    print("Not found", start_idx, end_idx)
