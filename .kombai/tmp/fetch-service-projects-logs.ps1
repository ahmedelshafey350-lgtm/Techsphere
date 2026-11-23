# Pulls recent service-projects edge function logs from the Supabase Management API.
#
# Usage (token is never written to disk by this script):
#   $env:SUPABASE_ACCESS_TOKEN = "sbp_xxx"   # Dashboard -> Account -> Access Tokens
#   powershell -ExecutionPolicy Bypass -File .\.kombai\tmp\fetch-service-projects-logs.ps1
#
# Revoke the token in the dashboard once the review is done.

param(
    [string]$Token = $env:SUPABASE_ACCESS_TOKEN,
    [string]$ProjectRef = "gzzmrwdolrhjhzpovytg",
    [int]$Hours = 24
)

if (-not $Token) {
    Write-Output "Set SUPABASE_ACCESS_TOKEN first (Dashboard -> Account -> Access Tokens)."
    exit 1
}

$start = (Get-Date).ToUniversalTime().AddHours(-$Hours).ToString("yyyy-MM-ddTHH:mm:ssZ")
$end = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$headers = @{ Authorization = "Bearer $Token" }

function Get-LogRows {
    param([string]$Sql)

    $query = "sql=" + [uri]::EscapeDataString($Sql) +
        "&iso_timestamp_start=" + [uri]::EscapeDataString($start) +
        "&iso_timestamp_end=" + [uri]::EscapeDataString($end)
    $uri = "https://api.supabase.com/v1/projects/$ProjectRef/analytics/endpoints/logs.all?$query"

    try {
        $response = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -TimeoutSec 60
        return $response.result
    } catch {
        Write-Output ("QUERY FAILED: " + $_.Exception.Message)
        if ($_.ErrorDetails.Message) { Write-Output $_.ErrorDetails.Message }
        return @()
    }
}

Write-Output "Window: $start .. $end (UTC)"
Write-Output ""
Write-Output "=== Diagnostic console output (the real refusal reasons) ==="
Get-LogRows -Sql "select timestamp, event_message from function_logs where regexp_contains(event_message, 'ctivation code|reissue') order by timestamp desc limit 200" |
    Format-Table -AutoSize -Wrap

Write-Output ""
Write-Output "=== Redeem / re-issue requests and their HTTP status ==="
Get-LogRows -Sql "select timestamp, event_message, response.status_code from function_edge_logs where regexp_contains(event_message, 'redeem_activation_code|activation_code_reissue|activation_code_issue') order by timestamp desc limit 200" |
    Format-Table -AutoSize -Wrap

Write-Output ""
Write-Output "Reminder: revoke the access token you used for this run."
