# Applies .kombai/tmp/apply-activation-fixes.sql through the Supabase Management API.
#
# Usage:
#   $env:SUPABASE_ACCESS_TOKEN = "sbp_xxx"     # Dashboard -> Account -> Access Tokens
#   powershell -ExecutionPolicy Bypass -File .\.kombai\tmp\apply-activation-fixes.ps1
#
# Passing the token through the environment keeps it out of the PowerShell history.

param(
    [string]$Token = $env:SUPABASE_ACCESS_TOKEN,
    [string]$ProjectRef = "gzzmrwdolrhjhzpovytg",
    [string]$SqlFile = (Join-Path $PSScriptRoot "apply-activation-fixes.sql")
)

if (-not $Token) {
    Write-Output "Set SUPABASE_ACCESS_TOKEN first (Dashboard -> Account -> Access Tokens)."
    exit 1
}
if (-not (Test-Path $SqlFile)) {
    Write-Output "SQL file not found: $SqlFile"
    exit 1
}

$sql = Get-Content -Path $SqlFile -Raw
$body = @{ query = $sql } | ConvertTo-Json -Depth 3
$headers = @{
    Authorization  = "Bearer $Token"
    "Content-Type" = "application/json"
}
$uri = "https://api.supabase.com/v1/projects/$ProjectRef/database/query"

try {
    $result = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body -TimeoutSec 180
    Write-Output "Migration applied. Last statement result:"
    if ($null -eq $result) { Write-Output "(no rows returned)" } else { $result | ConvertTo-Json -Depth 6 }
} catch {
    Write-Output ("FAILED: " + $_.Exception.Message)
    if ($_.ErrorDetails.Message) { Write-Output $_.ErrorDetails.Message }
    exit 1
}

Write-Output ""
Write-Output "Reminder: revoke the access token you used for this run."
