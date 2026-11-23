# ============================================================================
# TECHSPHERE - Category-Based SVG Images (Self-Contained Data URIs)
# Creates SVG images for each project category and updates all 310 projects
# No external dependencies - images are embedded directly in the database
# ============================================================================

param(
    [switch]$Live = $false
)

$supabaseUrl = "https://gzzmrwdolrhjhzpovytg.supabase.co"
$edgeFunctionUrl = "$supabaseUrl/functions/v1/admin-image-import"
$projectsFile = "f:/Techsphere/projects_310.json"
$logFile = "f:/Techsphere/svg_image_import_log.txt"
$stateFile = "f:/Techsphere/svg_image_import_state.json"

$dryRun = -not $Live
$batchSize = 15
$requestTimeoutSec = 60
$maxRetries = 3
$retryDelaySec = 3

# ============================================================================
# Category-specific SVG images (as Data URIs)
# Each category gets a unique colored SVG icon
# ============================================================================

$categorySvgMap = @{
    "embedded-iot"        = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#0d6efd"/><circle cx="150" cy="80" r="30" fill="#ffffff"/><rect x="120" y="110" width="60" height="30" rx="5" fill="#ffffff"/><text x="150" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">IoT</text></svg>'
    "digital-logic"       = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#6610f2"/><polygon points="80,60 220,60 220,140 80,140" fill="#ffffff"/><line x1="80" y1="100" x2="220" y2="100" stroke="#6610f2" stroke-width="8"/><text x="150" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">Logic</text></svg>'
    "electronics"         = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#fd7e14"/><circle cx="150" cy="80" r="25" fill="#ffffff"/><line x1="125" y1="105" x2="175" y2="105" stroke="#fd7e14" stroke-width="6"/><line x1="150" y1="80" x2="150" y2="130" stroke="#fd7e14" stroke-width="6"/><text x="150" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">Electronics</text></svg>'
    "mechanical-design"   = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#20c997"/><circle cx="150" cy="100" r="40" fill="#ffffff" stroke="#20c997" stroke-width="4"/><circle cx="150" cy="100" r="20" fill="#20c997"/><line x1="150" y1="60" x2="150" y2="140" stroke="#20c997" stroke-width="4"/><line x1="110" y1="100" x2="190" y2="100" stroke="#20c997" stroke-width="4"/><text x="150" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">Mechanical</text></svg>'
    "industrial-automation" = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#dc3545"/><rect x="100" y="60" width="100" height="80" rx="10" fill="#ffffff"/><rect x="125" y="80" width="50" height="40" rx="5" fill="#dc3545"/><text x="150" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">Industrial</text></svg>'
    "embedded-systems"    = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#6f42c1"/><rect x="90" y="60" width="120" height="80" rx="8" fill="#ffffff"/><circle cx="120" cy="100" r="8" fill="#6f42c1"/><circle cx="150" cy="100" r="8" fill="#6f42c1"/><circle cx="180" cy="100" r="8" fill="#6f42c1"/><text x="150" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">Embedded</text></svg>'
    "software-ai"         = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#198754"/><circle cx="70" cy="70" r="15" fill="#ffffff"/><circle cx="150" cy="70" r="15" fill="#ffffff"/><circle cx="230" cy="70" r="15" fill="#ffffff"/><circle cx="100" cy="130" r="15" fill="#ffffff"/><circle cx="200" cy="130" r="15" fill="#ffffff"/><line x1="85" y1="85" x2="135" y2="85" stroke="#ffffff" stroke-width="3"/><line x1="165" y1="85" x2="215" y2="85" stroke="#ffffff" stroke-width="3"/><line x1="115" y1="115" x2="185" y2="115" stroke="#ffffff" stroke-width="3"/><text x="150" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">AI</text></svg>'
}

# Default SVG for unknown categories
$defaultSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#6c757d"/><text x="150" y="100" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="18">Project</text><text x="150" y="130" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="14">Image</text></svg>'

# ============================================================================
# Helper Functions
# ============================================================================

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line = "[$timestamp] [$Level] $Message"
    $line | Out-File -FilePath $logFile -Append -Encoding UTF8
    switch ($Level) {
        "SUCCESS" { Write-Host $line -ForegroundColor Green }
        "ERROR"   { Write-Host $line -ForegroundColor Red }
        "WARN"    { Write-Host $line -ForegroundColor Yellow }
        "DRYRUN"  { Write-Host $line -ForegroundColor Cyan }
        default   { Write-Host $line -ForegroundColor Gray }
    }
}

function Write-LogNoNewline {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line = "[$timestamp] [$Level] $Message"
    $line | Out-File -FilePath $logFile -Append -Encoding UTF8
    switch ($Level) {
        "SUCCESS" { Write-Host $line -NoNewline -ForegroundColor Green }
        "ERROR"   { Write-Host $line -NoNewline -ForegroundColor Red }
        "WARN"    { Write-Host $line -NoNewline -ForegroundColor Yellow }
        "DRYRUN"  { Write-Host $line -NoNewline -ForegroundColor Cyan }
        default   { Write-Host $line -NoNewline -ForegroundColor Gray }
    }
}

function Load-State {
    param([string]$StateFile)
    if (-not (Test-Path $StateFile)) {
        return @{ completed = @(); lastIndex = -1 }
    }
    try {
        $json = Get-Content $StateFile -Raw | ConvertFrom-Json -ErrorAction Stop
        return @{
            completed = @($json.completed)
            lastIndex = [int]$json.lastIndex
        }
    } catch {
        return @{ completed = @(); lastIndex = -1 }
    }
}

function Save-State {
    param([string]$StateFile, [hashtable]$State)
    $json = $State | ConvertTo-Json -Depth 4
    $json | Set-Content $StateFile -Encoding UTF8
}

function Get-SvgDataUri {
    param([string]$Category)
    
    $svg = if ($categorySvgMap.ContainsKey($Category)) { $categorySvgMap[$Category] } else { $defaultSvg }
    
    # Convert SVG to base64 data URI
    $utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($svg)
    $base64 = [Convert]::ToBase64String($utf8Bytes)
    $dataUri = "data:image/svg+xml;base64,$base64"
    
    return $dataUri
}

function Call-EdgeFunctionBatch {
    param(
        [string]$ImportSecret,
        [array]$BatchItems,
        [switch]$Overwrite
    )

    $payload = @{
        action = "import_batch"
        batch = $BatchItems
    } | ConvertTo-Json -Depth 5

    $lastError = $null

    for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
        try {
            $response = Invoke-RestMethod -Uri $edgeFunctionUrl -Method POST -Headers @{
                "X-Import-Secret" = $ImportSecret
                "Content-Type" = "application/json"
            } -Body $payload -TimeoutSec $requestTimeoutSec -ErrorAction Stop

            return @{ status = "OK"; data = $response }
        } catch {
            $lastError = $_

            if ($_.Exception.Response) {
                $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
                $errBody = $reader.ReadToEnd()
                $reader.Close()
                $statusCode = [int]$_.Exception.Response.StatusCode

                if ($statusCode -eq 401) {
                    Write-Log "Import secret invalid or missing (401)." "ERROR"
                    return @{ status = "FAIL_AUTH"; message = "Invalid or missing import secret" }
                }
                Write-Log "Attempt $attempt/$maxRetries failed: HTTP $statusCode - $errBody" "WARN"
            } else {
                Write-Log "Attempt $attempt/$maxRetries failed: $($_.Exception.Message)" "WARN"
            }

            if ($attempt -lt $maxRetries) {
                Start-Sleep -Seconds $retryDelaySec
            }
        }
    }

    return @{ status = "FAIL"; message = "Failed after $maxRetries retries. Last error: $($lastError.Exception.Message)" }
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

$modeLabel = if ($dryRun) { "DRY RUN (test only)" } else { "LIVE MODE (will update database)" }

"============================================================" | Out-File -FilePath $logFile -Encoding UTF8
"TECHSPHERE SVG Image Import - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -FilePath $logFile -Append -Encoding UTF8
"Mode: $modeLabel" | Out-File -FilePath $logFile -Append -Encoding UTF8
"============================================================" | Out-File -FilePath $logFile -Append -Encoding UTF8

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "TECHSPHERE - SVG Image Import" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Mode: $modeLabel" -ForegroundColor Cyan
Write-Host "Images: Self-contained SVG Data URIs (no external dependencies)" -ForegroundColor Cyan
Write-Host ""

if ($dryRun) {
    Write-Host "WARNING: This is test mode only. Database will NOT be updated." -ForegroundColor Yellow
    Write-Host ""
}

# Load projects
if (-not (Test-Path $projectsFile)) {
    Write-Log "Projects file not found: $projectsFile" "ERROR"
    exit 1
}

$allProjects = Get-Content $projectsFile -Raw | ConvertFrom-Json
Write-Log "Loaded $($allProjects.Count) projects from $projectsFile" "INFO"
Write-Host "Total projects: $($allProjects.Count)" -ForegroundColor Cyan

# Load state for resume
$state = Load-State -StateFile $stateFile
if ($state.lastIndex -ge 0 -and $state.lastIndex -lt $allProjects.Count) {
    Write-Log "Resuming from index $($state.lastIndex + 1)" "INFO"
    Write-Host "Resuming from project number $($state.lastIndex + 1)" -ForegroundColor Cyan
}

# Check import secret only if Live mode
$imageImportSecret = $null
if (-not $dryRun) {
    $imageImportSecret = $env:IMAGE_IMPORT_SECRET
    if (-not $imageImportSecret -or $imageImportSecret.Length -lt 10) {
        Write-Log "IMAGE_IMPORT_SECRET environment variable is not set or too short." "ERROR"
        Write-Host "ERROR: IMAGE_IMPORT_SECRET environment variable is required for Live mode." -ForegroundColor Red
        Write-Host "   Set it with: $env:IMAGE_IMPORT_SECRET = \"your-secret-here\"" -ForegroundColor Yellow
        exit 1
    }
    Write-Log "Import secret loaded (length: $($imageImportSecret.Length) characters)" "INFO"
}

# ============================================================================
# Process projects in batches
# ============================================================================

$results = @()
$startIndex = if ($state.lastIndex -ge 0) { $state.lastIndex + 1 } else { 0 }
$totalProcessed = 0
$totalUpdated = 0
$totalSkipped = 0
$totalFailed = 0
$totalSkippedCache = 0

Write-Host ""
Write-Host "Processing projects from $($startIndex + 1) to $($allProjects.Count) in batches of $batchSize..." -ForegroundColor Cyan
Write-Host ""

$batchItems = @()

for ($i = $startIndex; $i -lt $allProjects.Count; $i++) {
    $project = $allProjects[$i]
    $actualIndex = $i + 1

    # Skip if already completed
    if ($state.completed -contains $project.code) {
        $totalSkippedCache++
        continue
    }

    # Get SVG data URI for this project's category
    $imageUrl = Get-SvgDataUri -Category $project.category
    $imageAltText = "$($project.title) - $($project.category) project"
    $imageSource = "Techshpere SVG (self-contained)"

    $batchItems += @{
        project_code = $project.code
        image_url = $imageUrl
        image_alt_text = $imageAltText
        image_source = $imageSource
    }

    # Process batch when full or at end
    $isLast = ($i -eq $allProjects.Count - 1)
    if ($batchItems.Count -ge $batchSize -or $isLast) {
        $actualBatchSize = $batchItems.Count
        Write-LogNoNewline "[$actualIndex/310] Sending batch of $actualBatchSize projects to Edge Function... " "INFO"

        if (-not $dryRun) {
            $result = Call-EdgeFunctionBatch -ImportSecret $imageImportSecret -BatchItems $batchItems

            switch ($result.status) {
                "OK" {
                    $data = $result.data
                    $totalUpdated += $data.updated
                    $totalSkipped += $data.skipped
                    $totalFailed += $data.failed
                    $totalProcessed += $data.batch_size

                    Write-Host " [Updated: $($data.updated), Skipped: $($data.skipped), Failed: $($data.failed)]" -ForegroundColor Green

                    foreach ($r in $data.results) {
                        if ($r.status -eq "failed") {
                            Write-Log "  FAIL: $($r.project_code) - $($r.message)" "ERROR"
                        }
                    }

                    foreach ($item in $batchItems) {
                        $state.completed += $item.project_code
                    }
                    $state.lastIndex = $i
                    Save-State -StateFile $stateFile -State $state
                }
                "FAIL_AUTH" {
                    $totalFailed += $actualBatchSize
                    Write-Log "Authentication failed. Stopping execution." "ERROR"
                    Write-Host " [AUTH FAILED - stopping]" -ForegroundColor Red
                    break
                }
                "FAIL" {
                    $totalFailed += $actualBatchSize
                    Write-Log "Batch failed: $($result.message)" "ERROR"
                    Write-Host " [BATCH FAILED: $($result.message)]" -ForegroundColor Red

                    foreach ($item in $batchItems) {
                        $state.completed += $item.project_code
                    }
                    $state.lastIndex = $i
                    Save-State -StateFile $stateFile -State $state
                }
            }
        } else {
            $totalProcessed += $actualBatchSize
            $totalUpdated += $actualBatchSize

            Write-Host " [DRY RUN - $actualBatchSize projects would be sent]" -ForegroundColor Cyan

            foreach ($item in $batchItems) {
                $state.completed += $item.project_code
            }
            $state.lastIndex = $i
            Save-State -StateFile $stateFile -State $state
        }

        $batchItems = @()

        if (-not $isLast) {
            Start-Sleep -Milliseconds 500
        }
    }

    if ($result.status -eq "FAIL_AUTH") { break }
}

# ============================================================================
# Final Report
# ============================================================================

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Final Report - SVG Images" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host "Total projects processed: $totalProcessed" -ForegroundColor Cyan
Write-Host "Updated in database: $totalUpdated" -ForegroundColor Green
Write-Host "Skipped: $totalSkipped" -ForegroundColor Yellow
Write-Host "Skipped (already in state): $totalSkippedCache" -ForegroundColor Gray
Write-Host "Failed: $totalFailed" -ForegroundColor Red

# Save report
$reportMode = if ($dryRun) { "DRY_RUN" } else { "LIVE" }
$report = @{
    mode = $reportMode
    total_projects = $allProjects.Count
    processed = $totalProcessed
    updated = $totalUpdated
    skipped = $totalSkipped
    failed = $totalFailed
    skipped_from_cache = $totalSkippedCache
    timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    dry_run = $dryRun
    image_type = "SVG Data URI (self-contained)"
} | ConvertTo-Json -Depth 4

$reportFile = if ($dryRun) { "f:/Techsphere/dry_run_report_svg.json" } else { "f:/Techsphere/live_run_report_svg.json" }
$report | Set-Content $reportFile -Encoding UTF8

Write-Host ""
Write-Host "Report saved to: $reportFile" -ForegroundColor Cyan
Write-Host "State file: $stateFile" -ForegroundColor Cyan
Write-Host "Log saved to: $logFile" -ForegroundColor Cyan
Write-Host ""

if ($dryRun) {
    Write-Host "=============================================" -ForegroundColor Yellow
    Write-Host "This was DRY RUN only." -ForegroundColor Yellow
    Write-Host "To perform actual database update:" -ForegroundColor Yellow
    Write-Host "1. Set IMAGE_IMPORT_SECRET environment variable" -ForegroundColor Yellow
    Write-Host "2. Run with -Live switch" -ForegroundColor Yellow
    Write-Host "=============================================" -ForegroundColor Yellow
} else {
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "Live database update completed!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
}

Write-Host ""
Write-Host "Execution complete!" -ForegroundColor Cyan