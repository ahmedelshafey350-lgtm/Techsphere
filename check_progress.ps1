if (Test-Path 'f:/Techsphere/image_import_state.json') {
    $s = Get-Content 'f:/Techsphere/image_import_state.json' -Raw | ConvertFrom-Json
    Write-Host "Last index: $($s.lastIndex)"
    Write-Host "Completed count: $($s.completed.Count)"
    Write-Host "Dry run: $($s.dryRun)"
} else {
    Write-Host 'No state file'
}

if (Test-Path 'f:/Techsphere/image_cache_validated.json') {
    $c = Get-Content 'f:/Techsphere/image_cache_validated.json' -Raw | ConvertFrom-Json
    $valid = ($c.PSObject.Properties | Where-Object { $_.Value.status -eq 'valid' }).Count
    $invalid = ($c.PSObject.Properties | Where-Object { $_.Value.status -eq 'invalid' }).Count
    Write-Host "Cache entries: $($c.PSObject.Properties.Count)"
    Write-Host "Valid: $valid"
    Write-Host "Invalid: $invalid"
}

if (Test-Path 'f:/Techsphere/image_import_log.txt') {
    $lines = Get-Content 'f:/Techsphere/image_import_log.txt'
    Write-Host "Log lines: $($lines.Count)"
    $last5 = $lines | Select-Object -Last 5
    $last5
}