import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# First replace the starting wrapper
old_wrapper = r"\{isOnline && currentRide && !showRating && showEndTripSummary && \(\s*<div style=\{\{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba\(0,0,0,0\.7\)', backdropFilter: 'blur\(4px\)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' \}\}>\s*<div style=\{\{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 16px 48px rgba\(0,0,0,0\.25\)', scrollbarWidth: 'none', msOverflowStyle: 'none' \}\}>\s*<style>\{`\.end-trip-modal::\-webkit\-scrollbar \{ display: none; \}`\}</style>\s*<div className=\"end-trip-modal\">"

new_wrapper = """{isOnline && currentRide && !showRating && showEndTripSummary && (
                  <div className="animate-fade-in delay-100" style={{ margin: '16px -8px', width: 'calc(100% + 16px)', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '24px', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <style>{`.end-trip-modal::-webkit-scrollbar { display: none; }`}</style>
                      <div className="end-trip-modal">"""

if re.search(old_wrapper, text):
    text = re.sub(old_wrapper, new_wrapper, text)
    print("Replaced wrapper start")
else:
    print("Could not find wrapper start")

# Now replace the ending wrapper for that block
# The end of the block looks like:
#                           </Button>
#                         </div>
#                       </div>
#                     </div>
#                   </div>
#                 )}
# Let's replace the last 3 closing divs with 2 closing divs, only for the showEndTripSummary block!
old_end = r"Confirm & Complete\s*</Button>\s*</div>\s*</div>\s*</div>\s*</div>\s*\)\}"
new_end = r"""Confirm & Complete
                          </Button>
                        </div>
                      </div>
                  </div>
                )}"""
if re.search(old_end, text):
    text = re.sub(old_end, new_end, text)
    print("Replaced wrapper end")
else:
    print("Could not find wrapper end")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
