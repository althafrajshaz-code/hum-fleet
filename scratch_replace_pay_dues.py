import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the setShowPayDuesModal function calls
whatsapp_code = r"onClick={() => window.open('https://api.whatsapp.com/send?phone=918848347290&text=' + encodeURIComponent('Hello Admin, I am driver ' + (driverDetails?.name || 'Partner') + ' (' + (driverDetails?.phone || '') + '). My pending platform commission dues have reached Rs.' + parseFloat(wallet?.toBePaid || 0).toFixed(2) + '. I would like to clear my dues.'), '_blank')}"
content = content.replace("onClick={() => setShowPayDuesModal(true)}", whatsapp_code)

# Fix the multi-line one in Dues Notice Modal
dues_modal_btn = r'''onClick={() => {
                    setShowDuesNoticeModal(false);
                    setShowPayDuesModal(true);
                  }}'''
dues_modal_whatsapp = r'''onClick={() => {
                    setShowDuesNoticeModal(false);
                    window.open('https://api.whatsapp.com/send?phone=918848347290&text=' + encodeURIComponent('Hello Admin, I am driver ' + (driverDetails?.name || 'Partner') + ' (' + (driverDetails?.phone || '') + '). My pending platform commission dues have reached Rs.' + parseFloat(wallet?.toBePaid || 0).toFixed(2) + '. I would like to clear my dues.'), '_blank');
                  }}'''
content = content.replace(dues_modal_btn, dues_modal_whatsapp)

# Replace button texts
content = content.replace("Pay Commission via Payment Gateway", "Chat Admin to Settle Dues")
content = content.replace("Pay Dues Online", "Chat Admin to Settle Dues")

# Completely remove the showPayDuesModal block
pattern_modal = re.compile(r"\{\/\* ========== PAYMENT GATEWAY MODAL ========== \*\/\}.*?showPayDuesModal.*?</div>\s*</div>\s*\)\}", re.DOTALL)
if pattern_modal.search(content):
    content = pattern_modal.sub("", content)
    print("Removed Pay Dues modal.")
else:
    print("Modal not found")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Success")
