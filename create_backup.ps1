$source = "D:\Althaf\hum"
$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$destinationZip = "D:\Althaf\hum_backup_$timestamp.zip"
$tempDir = Join-Path $env:TEMP "hum_backup_temp_$timestamp"

if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

$exclude = @("node_modules", ".git", ".vercel", "dist")

Write-Host "Copying files to temporary directory..."
Get-ChildItem -Path $source -Recurse | Where-Object {
    $path = $_.FullName
    $skip = $false
    foreach ($ex in $exclude) {
        if ($path -match "\\$ex\\?" -or $path -like "*\$ex") {
            $skip = $true
            break
        }
    }
    -not $skip
} | ForEach-Object {
    $relativePath = $_.FullName.Substring($source.Length + 1)
    $targetPath = Join-Path $tempDir $relativePath
    if ($_.PSIsContainer) {
        if (-not (Test-Path $targetPath)) {
            New-Item -ItemType Directory -Path $targetPath | Out-Null
        }
    } else {
        $parentDir = Split-Path $targetPath
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir | Out-Null
        }
        Copy-Item -Path $_.FullName -Destination $targetPath
    }
}

Write-Host "Compressing files..."
Compress-Archive -Path "$tempDir\*" -DestinationPath $destinationZip -Force

Write-Host "Cleaning up temporary files..."
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Backup successfully created at: $destinationZip"
