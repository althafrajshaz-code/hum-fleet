import re

def update_passenger():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update the downloaded invoice
    # Find the table row for Base Fare and GST, and replace it.
    
    # We can just replace the specific string blocks for the downloaded invoice
    old_base_fare_html = '''        <tr class="item">
          <td style="padding: 10px; border-bottom: 1px solid #eee;">Base Fare (\ KM)</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹\</td>
        </tr>'''
    
    new_base_fare_html = '''        <tr class="item">
          <td style="padding: 10px; border-bottom: 1px solid #eee;">Trip Fare (\ KM)</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹\</td>
        </tr>'''
        
    old_gst_html = '''        <tr class="item">
          <td style="padding: 10px; border-bottom: 1px solid #eee;">GST (5% on Base Fare)</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">+₹\</td>
        </tr>'''
        
    if old_base_fare_html in content:
        content = content.replace(old_base_fare_html, new_base_fare_html)
    if old_gst_html in content:
        content = content.replace(old_gst_html, "")
        
    # 2. Update the on-screen invoice
    old_base_fare_jsx = '''                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Base Fare ({liveDist.toFixed(1)} KM)</span>
                          <strong>₹{recalculatedMinFare.toFixed(2)}</strong>
                        </div>'''
                        
    new_base_fare_jsx = '''                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Trip Fare ({liveDist.toFixed(1)} KM)</span>
                          <strong>₹{(recalculatedMinFare + tax).toFixed(2)}</strong>
                        </div>'''
                        
    old_gst_jsx = '''                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                          <strong>+₹{tax.toFixed(2)}</strong>
                        </div>'''
                        
    if old_base_fare_jsx in content:
        content = content.replace(old_base_fare_jsx, new_base_fare_jsx)
    if old_gst_jsx in content:
        content = content.replace(old_gst_jsx, "")
        
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("GST removed from Passenger Dashboard successfully.")

update_passenger()
