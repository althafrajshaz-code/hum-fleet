import re

def fix_passenger_gst():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix the Searching state breakdown (bookingStep === 2)
    # Old text:
    # <div style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Base Fare:</strong> INR {parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])).toFixed(2)}</div>
    # {parseFloat(customFare) > 0 && <div style={{ fontSize: '13px', marginBottom: '6px', color: '#10b981' }}><strong>Driver Tip:</strong> INR {parseFloat(customFare).toFixed(2)}</div>}
    # <div style={{ fontSize: '13px', marginBottom: '6px', color: '#f59e0b' }}><strong>GST Surcharge (5%):</strong> INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 0.05).toFixed(2)}</div>
    
    # We will replace the Base Fare to include 1.05 and rename to Trip Fare, and delete GST Surcharge.
    
    old_base_fare = "<strong>Base Fare:</strong> INR {parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])).toFixed(2)}"
    new_base_fare = "<strong>Trip Fare:</strong> INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 1.05).toFixed(2)}"
    
    old_gst_search = "<div style={{ fontSize: '13px', marginBottom: '6px', color: '#f59e0b' }}><strong>GST Surcharge (5%):</strong> INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 0.05).toFixed(2)}</div>"
    
    if old_base_fare in content:
        content = content.replace(old_base_fare, new_base_fare)
    
    if old_gst_search in content:
        content = content.replace(old_gst_search, "")
        
    # 2. Fix the STATE 3 breakdown (Ride accepted / In progress)
    # <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    #   <span>Fare Price:</span>
    #   <span>INR {parseFloat(activeRide.fare || 0).toFixed(2)}</span>
    # </div>
    # <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
    #   <span>GST (5%):</span>
    #   <span>+INR {parseFloat(activeRide.gst || (parseFloat(activeRide.fare || 0) * 0.05)).toFixed(2)}</span>
    # </div>
    # We'll change Fare Price to (fare * 1.05) and remove GST row.
    
    old_fare_price = "<span>INR {parseFloat(activeRide.fare || 0).toFixed(2)}</span>"
    # Actually wait, I need to make sure this is ONLY replaced in that specific block, or replace the whole block.
    # Let's replace the whole block.
    
    old_state3_block = '''                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Fare Price:</span>
                      <span>INR {parseFloat(activeRide.fare || 0).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
                      <span>GST (5%):</span>
                      <span>+INR {parseFloat(activeRide.gst || (parseFloat(activeRide.fare || 0) * 0.05)).toFixed(2)}</span>
                    </div>'''
                    
    new_state3_block = '''                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Trip Fare:</span>
                      <span>INR {(parseFloat(activeRide.fare || 0) * 1.05).toFixed(2)}</span>
                    </div>'''
                    
    if old_state3_block in content:
        content = content.replace(old_state3_block, new_state3_block)
        
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Done applying GST removal for passenger")

fix_passenger_gst()
