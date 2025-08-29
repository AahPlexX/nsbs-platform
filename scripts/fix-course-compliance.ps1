# Script to fix all course meta.json files for NSBS platform compliance
# Removes forbidden fields and ensures correct structure

$coursesPath = "c:\Users\eastm\Desktop\nsbs0820\data\courses"
$courseDirectories = Get-ChildItem -Path $coursesPath -Directory

Write-Host "Starting compliance fix for all courses..." -ForegroundColor Green

foreach ($courseDir in $courseDirectories) {
    $metaJsonPath = Join-Path $courseDir.FullName "course\meta.json"
    
    if (Test-Path $metaJsonPath) {
        Write-Host "Processing: $($courseDir.Name)" -ForegroundColor Yellow
        
        try {
            # Read the current meta.json
            $content = Get-Content $metaJsonPath -Raw | ConvertFrom-Json
            
            # Create compliant structure
            $newMeta = @{
                id = $courseDir.Name
                title = $content.title
                subtitle = if ($content.subtitle) { $content.subtitle } else { "Professional certification course" }
                description = $content.description
                price = 298
                currency = "USD"
                language = "en"
                category = $content.category
                tags = $content.tags
                certification = @{
                    name = $content.certification.name -replace '\s*\([^)]*\)\s*$', '' + " (" + ($courseDir.Name -split '-')[-1].ToUpper() + ")"
                    authority = "The National Society of Business Sciences"
                }
                learningOutcomes = if ($content.learningOutcomes) { $content.learningOutcomes } elseif ($content.learningObjectives) { $content.learningObjectives } else { @() }
            }
            
            # Write the corrected structure
            $newMeta | ConvertTo-Json -Depth 10 | Set-Content $metaJsonPath
            Write-Host "✓ Fixed: $($courseDir.Name)" -ForegroundColor Green
            
        } catch {
            Write-Host "✗ Error processing $($courseDir.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "! No meta.json found for: $($courseDir.Name)" -ForegroundColor Magenta
    }
}

Write-Host "Compliance fix completed!" -ForegroundColor Green
