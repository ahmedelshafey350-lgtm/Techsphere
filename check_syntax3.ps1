$errors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile('f:/Techsphere/process_all_310_svg_images.ps1', [ref] $null, [ref] $errors)
if ($errors.Count -gt 0) {
    $errors.ForEach({ Write-Host "Error: $($_.Message) at line $($_.Extent.StartLineNumber)" -ForegroundColor Red })
} else {
    Write-Host "Syntax OK" -ForegroundColor Green
}