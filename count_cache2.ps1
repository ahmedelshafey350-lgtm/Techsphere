$json = Get-Content 'f:/Techsphere/image_cache.json' -Raw | ConvertFrom-Json
$count = ($json.PSObject.Properties | Measure-Object).Count
Write-Host "Cache entries: $count"