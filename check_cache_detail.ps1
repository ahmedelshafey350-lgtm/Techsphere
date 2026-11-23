$cache = Get-Content 'f:/Techsphere/image_cache_validated.json' -Raw | ConvertFrom-Json
$total = $cache.PSObject.Properties.Count
$specific = ($cache.PSObject.Properties | Where-Object { $_.Value.source -eq 'wikimedia_commons' }).Count
$fallback = ($cache.PSObject.Properties | Where-Object { $_.Value.source -eq 'wikimedia_category_fallback' }).Count
Write-Host "Total cache entries: $total"
Write-Host "Specific Wikimedia Commons images: $specific"
Write-Host "Category fallback images: $fallback"
Write-Host ""
Write-Host "Sample of specific project images:" -ForegroundColor Cyan
$specificItems = $cache.PSObject.Properties | Where-Object { $_.Value.source -eq 'wikimedia_commons' } | Select-Object -First 10
foreach ($item in $specificItems) {
    Write-Host "  $($item.Name) => $($item.Value.url)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Sample of category fallback images:" -ForegroundColor Yellow
$fallbackItems = $cache.PSObject.Properties | Where-Object { $_.Value.source -eq 'wikimedia_category_fallback' } | Select-Object -First 5
foreach ($item in $fallbackItems) {
    Write-Host "  $($item.Name) => $($item.Value.url)" -ForegroundColor Gray
}