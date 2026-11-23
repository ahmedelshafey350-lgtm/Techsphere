$srcDir = "F:\Techsphere\src"
$excludeFile = "Router.jsx"

$files = Get-ChildItem -Path $srcDir -Recurse -Filter "*.jsx" | Where-Object { $_.Name -ne $excludeFile }

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $newLines = @()
    $changed = $false
    
    foreach ($line in $lines) {
        # Skip lines that import Footer
        if ($line -match "import Footer from") {
            $changed = $true
            continue
        }
        # Skip lines that render Footer component
        if ($line -match "<Footer") {
            $changed = $true
            continue
        }
        $newLines += $line
    }
    
    if ($changed) {
        # Join lines and clean up extra blank lines
        $content = ($newLines -join "`n")
        $content = $content -replace "`n{3,}", "`n`n"
        # Trim trailing whitespace from each line
        $lines = $content -split "`n" | ForEach-Object { $_.TrimEnd() }
        $content = $lines -join "`n"
        
        Set-Content $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "No change: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "`nDone! Footer removed from all pages except Router.jsx" -ForegroundColor Cyan