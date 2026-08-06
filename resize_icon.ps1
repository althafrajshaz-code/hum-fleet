Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\Althaf\hum\public\hum_fleet_official_logo.jpg")
$bmp = New-Object System.Drawing.Bitmap 512, 512
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.DrawImage($img, 0, 0, 512, 512)
$bmp.Save("d:\Althaf\hum\play_store_icon.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$graph.Dispose()
$bmp.Dispose()
$img.Dispose()
