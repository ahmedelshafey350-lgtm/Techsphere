$errors = $null
$null = [System.Management.Automation.Language.Parser]::ParseFile('f:/Techsphere/process_all_310_final.ps1', [ref] $null, [ref] $errors)
if ($errors) {
    $errors | ForEach-Object { Write-Host "Line $($_.Extent.StartLineNumber): $($_.Message)" }
} else {
    Write-Host "Script syntax: OK"
}