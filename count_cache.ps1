$json = Get-Content 'f:/Techsphere/image_cache.json' -Raw | ConvertFrom-Json
Write-Host "Cache entries: $($json.PSObject.Properties.Count)"