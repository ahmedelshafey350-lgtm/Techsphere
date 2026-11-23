if (Test-Path 'f:/Techsphere/image_cache.json') {
    $s = (Get-Item 'f:/Techsphere/image_cache.json').Length
    Write-Host "File size: $s bytes"
    $content = Get-Content 'f:/Techsphere/image_cache.json' -TotalCount 5
    $content
} else {
    Write-Host 'No cache file'
}