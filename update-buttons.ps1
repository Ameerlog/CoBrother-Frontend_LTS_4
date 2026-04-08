$files = Get-ChildItem -Path "src" -Recurse -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Pattern 1: bg-purple buttons
    if ($content -match 'className="[^"]*bg-purple[^"]*"') {
        $content = $content -replace 'className="[^"]*bg-purple[^"]*border-purple[^"]*rounded-full[^"]*"', 'className="btn-glow"'
        $modified = $true
    }
    
    # Pattern 2: gradient buttons
    if ($content -match 'className="[^"]*from-purple[^"]*to-indigo[^"]*"') {
        $content = $content -replace 'className="[^"]*from-purple-\d+\s+to-indigo-\d+[^"]*rounded-full[^"]*"', 'className="btn-glow"'
        $modified = $true
    }
    
    # Pattern 3: border-purple buttons
    if ($content -match 'className="[^"]*border-2\s+border-purple[^"]*"') {
        $content = $content -replace 'className="[^"]*border-2\s+border-purple[^"]*rounded-full[^"]*"', 'className="btn-glow"'
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated: $($file.FullName)"
    }
}
