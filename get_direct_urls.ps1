# ============================================================================
# Get Direct Wikimedia Commons Image URLs
# Fixed version with proper URL encoding
# ============================================================================

$apiBase = "https://commons.wikimedia.org/w/api.php"
$cacheFile = "f:/Techsphere/direct_image_urls.json"

# Load existing cache if available
$directUrls = @{}
if (Test-Path $cacheFile) {
    $directUrls = Get-Content $cacheFile -Raw | ConvertFrom-Json
    Write-Host "Loaded " $directUrls.Count " cached direct URLs" -ForegroundColor Cyan
}

# Load image mapping
. "f:/Techsphere/image_mapping.ps1"

# Get all unique image filenames
$uniqueImages = @{}
foreach ($kvp in $imageMap.GetEnumerator()) {
    $filename = $kvp.Value
    if (-not $uniqueImages.ContainsKey($filename)) {
        $uniqueImages[$filename] = $true
    }
}
# Add fallback images
$fallbackImages = @("Microcontroller.svg", "Logic_gates.svg", "Electronic_circuit.svg", "Mechanical_engineering.svg", "Industrial_robot.svg", "Artificial_intelligence.svg", "Engineering.svg")
foreach ($img in $fallbackImages) {
    if (-not $uniqueImages.ContainsKey($img)) {
        $uniqueImages[$img] = $true
    }
}

Write-Host "Total unique images to resolve: " $uniqueImages.Count -ForegroundColor Cyan

# Resolve each image to direct URL using Wikimedia API
$resolvedCount = 0
foreach ($filename in $uniqueImages.Keys) {
    # Skip if already cached
    if ($directUrls.ContainsKey($filename)) {
        continue
    }

    # URL encode the filename
    $encodedFilename = [System.Uri]::EscapeDataString($filename)
    $apiUrl = $apiBase + "?action=query&titles=File:" + $encodedFilename + "&prop=imageinfo&iiprop=url&format=json&origin=*"
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method GET -TimeoutSec 15 -ErrorAction Stop
        
        $pages = $response.query.pages
        foreach ($pageId in $pages.PSObject.Properties.Name) {
            $page = $pages.$pageId
            if ($page.imageinfo -and $page.imageinfo.Count -gt 0) {
                $directUrl = $page.imageinfo[0].url
                $directUrls[$filename] = $directUrl
                $resolvedCount++
                Write-Host "OK: " $filename "->" $directUrl -ForegroundColor Green
            }
        }
    } catch {
        Write-Host "FAIL: " $filename " - " $_.Exception.Message -ForegroundColor Red
    }
    
    # Rate limiting - small delay between requests
    Start-Sleep -Milliseconds 100
}

# Save cache
$directUrls | ConvertTo-Json -Depth 4 | Set-Content $cacheFile -Encoding UTF8

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Resolved: " $resolvedCount " new direct URLs" -ForegroundColor Cyan
Write-Host "Total cached: " $directUrls.Count -ForegroundColor Cyan
Write-Host "Cache saved to: " $cacheFile -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan