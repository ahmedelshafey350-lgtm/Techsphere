$files = @(
    "F:\Techsphere\src\Contact\Contact.jsx",
    "F:\Techsphere\src\Education\Education.jsx",
    "F:\Techsphere\src\Footer\Footer.jsx",
    "F:\Techsphere\src\OneArticals\OneArticals.jsx",
    "F:\Techsphere\src\Opinins\Review.jsx",
    "F:\Techsphere\src\Projects\MyProjects.jsx",
    "F:\Techsphere\src\Projects\ProjectDetails.jsx",
    "F:\Techsphere\src\Projects\ProjectRequestForm.jsx"
)

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file)
    $found = $false
    for ($i = 0; $i -lt $content.Length; $i++) {
        $chCode = [int]$content[$i]
        if ($chCode -eq 216 -or $chCode -eq 217 -or $chCode -eq 194 -or $chCode -eq 195 -or $chCode -eq 197 -or $chCode -eq 226) {
            if (-not $found) {
                Write-Host ("`n=== " + (Split-Path $file -Leaf) + " ===")
                $found = $true
            }
            $start = [math]::Max(0, $i - 10)
            $len = [math]::Min(20, $content.Length - $i)
            $ctx = $content.Substring($start, $len)
            $ch = $content[$i]
            Write-Host ("Pos " + $i + ": code=" + $chCode + " char='" + $ch + "' context='..." + $ctx + "...'")
        }
    }
}
