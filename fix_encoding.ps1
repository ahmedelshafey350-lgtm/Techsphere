$path = "f:/Techsphere/process_all_310_final.ps1"
$content = Get-Content $path -Raw
# استبدال أي سطر يحتوي على changelog_ar بنص إنجليزي بسيط
$content = $content -replace 'changelog_ar\s*=\s*".*?"', 'changelog_ar = "Documentation release"'
Set-Content $path -Value $content
Write-Host "Fixed encoding"