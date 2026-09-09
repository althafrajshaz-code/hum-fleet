import re

def add_platform_fee_passenger():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. handleDownloadInvoice
    old_download = '''    let recalculatedMinFare = catBase + (liveDist * rate);
    if (activeRide.isIntercity) {
      recalculatedMinFare += 250;
    }
    
    const tipAmount = parseFloat(activeRide.driverTip || 0);
    const tax = recalculatedMinFare * 0.05;
    const total = recalculatedMinFare + tax + tipAmount;'''
    
    new_download = '''    let recalculatedMinFare = catBase + (liveDist * rate);
    if (activeRide.isIntercity) {
      recalculatedMinFare += 250;
    }
    
    const platformFee = recalculatedMinFare >= 1500 ? 20 : (recalculatedMinFare > 500 ? 15 : 10);
    const tax = recalculatedMinFare * 0.05;
    const tripFare = recalculatedMinFare + platformFee + tax;
    
    const tipAmount = parseFloat(activeRide.driverTip || 0);
    const total = tripFare + tipAmount;'''

    # Fix the display in the downloaded invoice string
    old_download_html = '''<td style="padding: 10px; border-bottom: 1px solid #eee;">Trip Fare ( KM)</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹</td>'''
          
    new_download_html = '''<td style="padding: 10px; border-bottom: 1px solid #eee;">Trip Fare ( KM)</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹</td>'''

    # 2. showRating block
    old_rating = '''                    let recalculatedMinFare = catBase + (liveDist * rate);
                    if (activeRide.isIntercity) recalculatedMinFare += 250;
                    const tipAmount = parseFloat(activeRide.driverTip || 0);
                    const tax = recalculatedMinFare * 0.05;
                    const total = recalculatedMinFare + tax + tipAmount;'''
                    
    new_rating = '''                    let recalculatedMinFare = catBase + (liveDist * rate);
                    if (activeRide.isIntercity) recalculatedMinFare += 250;
                    const platformFee = recalculatedMinFare >= 1500 ? 20 : (recalculatedMinFare > 500 ? 15 : 10);
                    const tax = recalculatedMinFare * 0.05;
                    const tripFare = recalculatedMinFare + platformFee + tax;
                    const tipAmount = parseFloat(activeRide.driverTip || 0);
                    const total = tripFare + tipAmount;'''

    old_rating_jsx = '''                          <span style={{ color: 'var(--text-muted)' }}>Trip Fare ({liveDist.toFixed(1)} KM)</span>
                          <strong>₹{(recalculatedMinFare + tax).toFixed(2)}</strong>'''
                          
    new_rating_jsx = '''                          <span style={{ color: 'var(--text-muted)' }}>Trip Fare ({liveDist.toFixed(1)} KM)</span>
                          <strong>₹{tripFare.toFixed(2)}</strong>'''

    content = content.replace(old_download, new_download)
    content = content.replace(old_download_html, new_download_html)
    content = content.replace(old_rating, new_rating)
    content = content.replace(old_rating_jsx, new_rating_jsx)
    
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

add_platform_fee_passenger()
