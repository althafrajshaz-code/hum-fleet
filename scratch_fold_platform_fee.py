import re

def fold_platform_fee():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for the Trip Fare line we added earlier:
    # <strong>Trip Fare:</strong> INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 1.05).toFixed(2)}
    
    old_trip_fare = "<strong>Trip Fare:</strong> INR {(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) * 1.05).toFixed(2)}"
    
    new_trip_fare = "<strong>Trip Fare:</strong> INR {(() => { const f = parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])); const pFee = f >= 1500 ? 20 : f > 500 ? 15 : 10; return (f * 1.05 + pFee).toFixed(2); })()}"
    
    if old_trip_fare in content:
        content = content.replace(old_trip_fare, new_trip_fare)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully folded platform fee into Trip Fare")
    else:
        print("Trip fare pattern not found!")

fold_platform_fee()
