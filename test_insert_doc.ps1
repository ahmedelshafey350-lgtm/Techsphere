$anonKey = "sb_publishable_GC9KQfkI3qw_dIOU82Bfrw_EEMGUqlL"
$supabaseUrl = "https://gzzmrwdolrhjhzpovytg.supabase.co"

$headers = @{
    apikey = $anonKey
    Authorization = "Bearer $anonKey"
    "Content-Type" = "application/json"
    Prefer = "return=representation"
}

# تجربة إدراج توثيق تجريبي
$body = @{
    project_id = "00000000-0000-0000-0000-000000000000"
    version = "9.9.9"
    documentation = @{ test = "hello" }
    changelog_en = "test"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/service_project_document_versions" -Method POST -Headers $headers -Body $body -TimeoutSec 15 -ErrorAction Stop
    Write-Host "SUCCESS: Can insert document versions with anon key"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "FAILED: $($_.Exception.Response.StatusCode)"
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Host $reader.ReadToEnd()
    $reader.Close()
}