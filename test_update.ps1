$anonKey = "sb_publishable_GC9KQfkI3qw_dIOU82Bfrw_EEMGUqlL"
$supabaseUrl = "https://gzzmrwdolrhjhzpovytg.supabase.co"

$headers = @{
    apikey = $anonKey
    Authorization = "Bearer $anonKey"
    "Content-Type" = "application/json"
    Prefer = "return=representation"
}

# اختبار تحديث مشروع واحد
$body = @{
    image_source_url = "https://source.unsplash.com/800x600/?iot,electronics"
    image_alt_text = "Test project image"
    image_license = "unsplash"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/service_projects?project_code=eq.TXH-ESP-001" -Method PATCH -Headers $headers -Body $body -TimeoutSec 15
    Write-Host "SUCCESS: $($response | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "FAILED: $($_.Exception.Response.StatusCode)"
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Host $reader.ReadToEnd()
    $reader.Close()
}