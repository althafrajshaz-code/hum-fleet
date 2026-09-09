import sys, re

with open('src/utils/background.js', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace("ride_requests_5", "ride_requests_6")
with open('src/utils/background.js', 'w', encoding='utf-8') as f:
    f.write(text)

with open('android/app/src/main/java/com/humfleet/main/MainActivity.java', 'r', encoding='utf-8') as f:
    text2 = f.read()
text2 = text2.replace("ride_requests_5", "ride_requests_6")
with open('android/app/src/main/java/com/humfleet/main/MainActivity.java', 'w', encoding='utf-8') as f:
    f.write(text2)
