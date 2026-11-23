# ============================================================================
# TECHSPHERE - Project-Specific Image Import via Edge Function
# ============================================================================
# Creates project-specific image URLs based on title keywords and category,
# then updates all 310 projects via the Edge Function with overwrite=true.
#
# Usage:
#   $env:IMAGE_IMPORT_SECRET = "your-secret-here"
#   powershell -ExecutionPolicy Bypass -File "f:/Techsphere/process_all_310_project_specific.ps1"
# ============================================================================

param(
    [switch]$Live = $false,
    [switch]$Overwrite = $true
)

$supabaseUrl = "https://gzzmrwdolrhjhzpovytg.supabase.co"
$edgeFunctionUrl = "$supabaseUrl/functions/v1/admin-image-import"
$projectsFile = "f:/Techsphere/projects_310.json"
$mappingFile = "f:/Techsphere/image_mapping.ps1"
$logFile = "f:/Techsphere/image_import_project_specific_log.txt"
$stateFile = "f:/Techsphere/image_import_project_specific_state.json"

# Determine mode
$dryRun = -not $Live

# Settings
$batchSize = 15
$requestTimeoutSec = 60
$maxRetries = 3
$retryDelaySec = 3

# ============================================================================
# Logging Functions (NEVER prints secrets)
# ============================================================================

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
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
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
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

# ============================================================================
# State Management
# ============================================================================

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
        Write-Log "Failed to load state file, starting from scratch: $($_.Exception.Message)" "WARN"
        return @{ completed = @(); lastIndex = -1 }
    }
}

function Save-State {
    param([string]$StateFile, [hashtable]$State)
    $json = $State | ConvertTo-Json -Depth 4
    $json | Set-Content $StateFile -Encoding UTF8
}

# ============================================================================
# Load image mapping
# ============================================================================

if (-not (Test-Path $mappingFile)) {
    Write-Log "Image mapping file not found: $mappingFile" "ERROR"
    exit 1
}

# Dot-source the mapping file to load the $imageMap hashtable
. $mappingFile

function Get-ProjectImageUrl {
    param([string]$Title, [string]$Category, [string]$Code)
    
    $titleLower = $Title.ToLower()
    
    # Find matching keyword
    $matchedImage = $null
    $matchedKeyword = $null
    
    foreach ($kvp in $imageMap.GetEnumerator()) {
        if ($titleLower -like "*$($kvp.Key.ToLower())*") {
            $matchedImage = $kvp.Value
            $matchedKeyword = $kvp.Key
            break
        }
    }
    
    # Fallback to category-based image
    if (-not $matchedImage) {
        $fallbackMap = @{
            "embedded-iot"         = "Microcontroller.svg"
            "digital-logic"        = "Logic_gates.svg"
            "electronics"          = "Electronic_circuit.svg"
            "mechanical-design"    = "Mechanical_engineering.svg"
            "industrial-automation"= "Industrial_robot.svg"
            "embedded-systems"     = "Microcontroller.svg"
            "software-ai"          = "Artificial_intelligence.svg"
        }
        $matchedImage = if ($fallbackMap.ContainsKey($Category)) { $fallbackMap[$Category] } else { "Engineering.svg" }
    }
    
    # Return direct Wikimedia Commons URL
    $url = "https://commons.wikimedia.org/wiki/Special:FilePath/$matchedImage"
    
    return @{
        image_url = $url
        image_alt_text = "$Title - $Category engineering project"
        image_source = "Wikimedia Commons: $matchedImage"
        matched_keyword = $matchedKeyword
    }
}

# ============================================================================
# Call Edge Function with batch
# ============================================================================

function Call-EdgeFunctionBatch {
    param(
        [string]$ImportSecret,
        [array]$BatchItems,
        [switch]$Overwrite
    )

    $payload = @{
        action = "import_batch"
        batch = $BatchItems
        overwrite = $Overwrite
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
                    Write-Log "Import secret invalid or missing (401). Check IMAGE_IMPORT_SECRET environment variable." "ERROR"
                    return @{ status = "FAIL_AUTH"; message = "Invalid or missing import secret" }
                }
                if ($statusCode -eq 403) {
                    Write-Log "Access forbidden (403)." "ERROR"
                    return @{ status = "FAIL_AUTH"; message = "Access forbidden" }
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
$overwriteLabel = if ($Overwrite) { "WITH OVERWRITE (will replace existing images)" } else { "SKIP EXISTING (keep current images)" }

# Reset log file
"============================================================" | Out-File -FilePath $logFile -Encoding UTF8
"TECHSPHERE Project-Specific Image Import - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -FilePath $logFile -Append -Encoding UTF8
"Mode: $modeLabel" | Out-File -FilePath $logFile -Append -Encoding UTF8
"Overwrite: $overwriteLabel" | Out-File -FilePath $logFile -Append -Encoding UTF8
"============================================================" | Out-File -FilePath $logFile -Append -Encoding UTF8

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "TECHSPHERE - Project-Specific Image Import" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Mode: $modeLabel" -ForegroundColor Cyan
Write-Host "Overwrite: $overwriteLabel" -ForegroundColor Cyan
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
    Write-Log "Resuming from index $($state.lastIndex + 1) ($($state.completed.Count) projects completed previously)" "INFO"
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

    # Get image data from mapping
    $imageData = Get-ProjectImageUrl -Title $project.title -Category $project.category -Code $project.code

    $batchItems += @{
        project_code = $project.code
        image_url = $imageData.image_url
        image_alt_text = $imageData.image_alt_text
        image_source = $imageData.image_source
    }

    # Process batch when full or at end
    $isLast = ($i -eq $allProjects.Count - 1)
    if ($batchItems.Count -ge $batchSize -or $isLast) {
        $actualBatchSize = $batchItems.Count
        Write-LogNoNewline "[$actualIndex/310] Sending batch of $actualBatchSize projects to Edge Function... " "INFO"

        if (-not $dryRun) {
            $result = Call-EdgeFunctionBatch -ImportSecret $imageImportSecret -BatchItems $batchItems -Overwrite:$Overwrite

            switch ($result.status) {
                "OK" {
                    $data = $result.data
                    $totalUpdated += $data.updated
                    $totalSkipped += $data.skipped
                    $totalFailed += $data.failed
                    $totalProcessed += $data.batch_size

                    Write-Host " [Updated: $($data.updated), Skipped: $($data.skipped), Failed: $($data.failed)]" -ForegroundColor Green

                    # Log detailed results
                    foreach ($r in $data.results) {
                        if ($r.status -eq "failed") {
                            Write-Log "  FAIL: $($r.project_code) - $($r.message)" "ERROR"
                        }
                    }

                    # Mark all projects in this batch as completed
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
            # Dry Run
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

        if (-not $isLast -and $batchSize -gt 0) {
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
Write-Host "Final Report - Project-Specific Images" -ForegroundColor Cyan
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
    overwrite = $Overwrite
    timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    dry_run = $dryRun
} | ConvertTo-Json -Depth 4

$reportFile = if ($dryRun) { "f:/Techsphere/dry_run_report_project_specific.json" } else { "f:/Techsphere/live_run_report_project_specific.json" }
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
    Write-Host "2. Run with -Live switch:" -ForegroundColor Yellow
    Write-Host "   $env:IMAGE_IMPORT_SECRET = \"your-secret\"" -ForegroundColor Yellow
    Write-Host "   powershell -ExecutionPolicy Bypass -File `"f:/Techsphere/process_all_310_project_specific.ps1`" -Live" -ForegroundColor Yellow
    Write-Host "=============================================" -ForegroundColor Yellow
} else {
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "Live database update completed!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
}

Write-Host ""
Write-Host "Execution complete!" -ForegroundColor Cyan