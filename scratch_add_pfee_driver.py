import re

def update_driver():
    with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. handleDownloadInvoice
    old_download = '''              let recalculatedMinFare = catBase + (finalDist * rate);
              if (currentRide.isIntercity) {
                recalculatedMinFare += 250;
              }
              
              const tipAmount = parseFloat(currentRide.driverTip || 0);
              const tax = recalculatedMinFare * 0.05;
              const total = recalculatedMinFare + tax + tipAmount;'''
              
    new_download = '''              let recalculatedMinFare = catBase + (finalDist * rate);
              if (currentRide.isIntercity) {
                recalculatedMinFare += 250;
              }
              
              const platformFee = recalculatedMinFare >= 1500 ? 20 : (recalculatedMinFare > 500 ? 15 : 10);
              const tax = recalculatedMinFare * 0.05;
              const tripFare = recalculatedMinFare + platformFee + tax;
              
              const tipAmount = parseFloat(currentRide.driverTip || 0);
              const total = tripFare + tipAmount;'''

    # Fix HTML display
    old_download_html_1 = '''<td style="padding: 10px; border-bottom: 1px solid #eee;">Base Fare (\ KM)</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹\</td>'''
    new_download_html_1 = '''<td style="padding: 10px; border-bottom: 1px solid #eee;">Trip Fare (\ KM)</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹\</td>'''
          
    old_download_html_2 = '''<tr class="item">
          <td style="padding: 10px; border-bottom: 1px solid #eee;">GST (5% on Base Fare)</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">+₹\</td>
        </tr>'''

    # 2. End Trip Summary
    old_summary = '''                          let recalculatedMinFare = catBase + (finalDist * rate);
                          if (currentRide.isIntercity) recalculatedMinFare += 250;
                          
                          const tipAmount = parseFloat(currentRide.driverTip || 0);
                          
                          // Tax is ONLY on the recalculated base fare
                          const tax = recalculatedMinFare * 0.05;
                          
                          const total = recalculatedMinFare + tax + tipAmount;'''
                          
    new_summary = '''                          let recalculatedMinFare = catBase + (finalDist * rate);
                          if (currentRide.isIntercity) recalculatedMinFare += 250;
                          
                          const platformFee = recalculatedMinFare >= 1500 ? 20 : (recalculatedMinFare > 500 ? 15 : 10);
                          const tax = recalculatedMinFare * 0.05;
                          const tripFare = recalculatedMinFare + platformFee + tax;
                          
                          const tipAmount = parseFloat(currentRide.driverTip || 0);
                          const total = tripFare + tipAmount;'''

    old_summary_jsx_1 = '''                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Base Fare ({finalDist.toFixed(1)} KM)</span>
                            <strong>₹{recalculatedMinFare.toFixed(2)}</strong>
                          </div>'''
    new_summary_jsx_1 = '''                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Trip Fare ({finalDist.toFixed(1)} KM)</span>
                            <strong>₹{tripFare.toFixed(2)}</strong>
                          </div>'''
                          
    old_summary_jsx_2 = '''                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                            <strong>+₹{tax.toFixed(2)}</strong>
                          </div>'''

    # 3. showRating block
    old_rating = '''                      let recalculatedMinFare = catBase + (finalDist * rate);
                      if (currentRide.isIntercity) recalculatedMinFare += 250;
                      const tipAmount = parseFloat(currentRide.driverTip || 0);
                      const tax = recalculatedMinFare * 0.05;
                      const total = recalculatedMinFare + tax + tipAmount;'''
                      
    new_rating = '''                      let recalculatedMinFare = catBase + (finalDist * rate);
                      if (currentRide.isIntercity) recalculatedMinFare += 250;
                      const platformFee = recalculatedMinFare >= 1500 ? 20 : (recalculatedMinFare > 500 ? 15 : 10);
                      const tax = recalculatedMinFare * 0.05;
                      const tripFare = recalculatedMinFare + platformFee + tax;
                      const tipAmount = parseFloat(currentRide.driverTip || 0);
                      const total = tripFare + tipAmount;'''

    old_rating_jsx_1 = '''                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Base Fare ({finalDist.toFixed(1)} KM)</span>
                          <strong>₹{recalculatedMinFare.toFixed(2)}</strong>
                        </div>'''
    new_rating_jsx_1 = '''                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Trip Fare ({finalDist.toFixed(1)} KM)</span>
                          <strong>₹{tripFare.toFixed(2)}</strong>
                        </div>'''
                        
    old_rating_jsx_2 = '''                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                          <strong>+₹{tax.toFixed(2)}</strong>
                        </div>'''

    if old_download in content:
        content = content.replace(old_download, new_download)
    content = content.replace(old_download_html_1, new_download_html_1)
    content = content.replace(old_download_html_2, '')
    
    if old_summary in content:
        content = content.replace(old_summary, new_summary)
    content = content.replace(old_summary_jsx_1, new_summary_jsx_1)
    content = content.replace(old_summary_jsx_2, '')
    
    if old_rating in content:
        content = content.replace(old_rating, new_rating)
    content = content.replace(old_rating_jsx_1, new_rating_jsx_1)
    content = content.replace(old_rating_jsx_2, '')
    
    with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

update_driver()
