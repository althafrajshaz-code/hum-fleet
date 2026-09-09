import re

def update_passenger():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where the rate logic is in handleDownloadInvoice
    old_download = '''    const baseTotal = parseFloat(activeRide.totalKm || 8.0);
    const liveDist = parseFloat(activeRide.finalDistance || baseTotal);
    const rate = 15.00;
    
    let recalculatedMinFare = liveDist * rate;
    if (activeRide.isIntercity) {
      recalculatedMinFare += 250;
    }'''
              
    new_download = '''    const baseTotal = parseFloat(activeRide.totalKm || 8.0);
    const liveDist = parseFloat(activeRide.finalDistance || baseTotal);
    
    // Dynamically calculate based on Category
    const catObj = categories?.find(c => c.name === activeRide.vehicleCategory) || categories?.[0] || {};
    let catBase = parseFloat(catObj.baseFare !== undefined ? catObj.baseFare : 50.0);
    let rate = parseFloat(catObj.ratePerKm !== undefined ? catObj.ratePerKm : 15.0);
    
    let recalculatedMinFare = catBase + (liveDist * rate);
    if (activeRide.isIntercity) {
      recalculatedMinFare += 250;
    }'''
              
    old_ui = '''                  const baseTotal = parseFloat(activeRide.totalKm || 8.0);
                  const liveDist = parseFloat(activeRide.finalDistance || baseTotal);
                  const rate = 15.00;
                  let recalculatedMinFare = liveDist * rate;
                  if (activeRide.isIntercity) recalculatedMinFare += 250;'''
                    
    new_ui = '''                  const baseTotal = parseFloat(activeRide.totalKm || 8.0);
                  const liveDist = parseFloat(activeRide.finalDistance || baseTotal);
                  const catObj = categories?.find(c => c.name === activeRide.vehicleCategory) || categories?.[0] || {};
                  let catBase = parseFloat(catObj.baseFare !== undefined ? catObj.baseFare : 50.0);
                  let rate = parseFloat(catObj.ratePerKm !== undefined ? catObj.ratePerKm : 15.0);
                  
                  let recalculatedMinFare = catBase + (liveDist * rate);
                  if (activeRide.isIntercity) recalculatedMinFare += 250;'''

    content = content.replace(old_download, new_download)
    content = content.replace(old_ui, new_ui)
    
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

update_passenger()
