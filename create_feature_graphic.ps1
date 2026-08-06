Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\Althaf\hum\public\hum_fleet_official_logo.jpg")

# Create a 1024x500 canvas for the feature graphic
$bmp = New-Object System.Drawing.Bitmap 1024, 500
$graph = [System.Drawing.Graphics]::FromImage($bmp)

# Sample the top-left pixel color of the original logo to use as the background color
$bgColor = (([System.Drawing.Bitmap]$img).GetPixel(0, 0))
$brush = New-Object System.Drawing.SolidBrush $bgColor

# Fill the background
$graph.FillRectangle($brush, 0, 0, 1024, 500)

# Calculate dimensions to center the logo. We'll make the logo 400x400.
$logoSize = 400
$x = (1024 - $logoSize) / 2
$y = (500 - $logoSize) / 2

# Draw the logo in the center
$graph.DrawImage($img, $x, $y, $logoSize, $logoSize)

# Save the feature graphic
$bmp.Save("d:\Althaf\hum\play_store_feature_graphic.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Clean up
$brush.Dispose()
$graph.Dispose()
$bmp.Dispose()
$img.Dispose()
