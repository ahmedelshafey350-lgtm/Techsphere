# Script to generate documentation for all 310 projects
# This will call the document_publish Edge Function for each project

$script:projects = @()
$script:adminToken = ""
$script:supabaseUrl = "https://gzzmrwdolrhjhzpovytg.supabase.co"

function Get-AdminToken {
    param(
        [string]$Email,
        [string]$Password
    )
    
    Write-Host "Getting admin token for $Email..."
    
    $body = @{
        email = $Email
        password = $Password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$script:supabaseUrl/auth/v1/token?grant_type=password" -Method POST -Headers @{
            apikey = "sb_publishable_GC9KQfkI3qw_dIOU82Bfrw_EEMGUqlL"
            "Content-Type" = "application/json"
        } -Body $body -ErrorAction Stop
        
        $script:adminToken = $response.access_token
        Write-Host "Admin token obtained successfully"
        return $true
    }
    catch {
        Write-Host "Failed to get admin token: $($_.Exception.Message)"
        return $false
    }
}

function Get-AllProjects {
    Write-Host "Fetching all projects from Supabase..."
    
    $headers = @{
        apikey = "sb_publishable_GC9KQfkI3qw_dIOU82Bfrw_EEMGUqlL"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$script:supabaseUrl/rest/v1/service_projects?select=id,project_code,slug,category_id,title_ar,title_en,public_description_en,difficulty,source_document,status,catalog_visible&order=project_code&limit=1000" -Method GET -Headers $headers -ErrorAction Stop
        
        $script:projects = $response.value
        Write-Host "Found $($script:projects.Count) projects"
        return $true
    }
    catch {
        Write-Host "Failed to fetch projects: $($_.Exception.Message)"
        return $false
    }
}

function Generate-Documentation {
    param(
        [string]$ProjectCode,
        [string]$TitleEn,
        [string]$TitleAr,
        [string]$DescriptionEn,
        [string]$SourceDocument
    )
    
    # Generate comprehensive documentation based on project type and source
    $documentation = @{
        title = $TitleEn
        arabic_title = $TitleAr
        description = $DescriptionEn
        technical_overview = ""
        implementation_guide = ""
        components_required = @()
        circuit_diagrams = @()
        code_examples = @()
        testing_procedures = @()
        safety_considerations = @()
        troubleshooting = @()
        references = @()
        learning_outcomes = @()
        difficulty_level = ""
        estimated_completion_time = ""
        prerequisites = @()
        extensions = @()
    }
    
    # Extract project type from project code
    $projectType = $ProjectCode.Substring(4, 3)
    
    switch ($projectType) {
        "ESP" {
            $documentation.technical_overview = "IoT project using ESP32 microcontroller with cloud connectivity and advanced features."
            $documentation.implementation_guide = "Set up ESP32 development environment, install required libraries, configure Wi-Fi, implement sensor data collection, and establish cloud communication."
            $documentation.components_required = @("ESP32 Development Board", "Sensors (as per project)", "Breadboard and jumper wires", "Power supply")
            $documentation.difficulty_level = if ($SourceDocument -match "Expert") { "Advanced" } elseif ($SourceDocument -match "advanced") { "Advanced" } else { "Intermediate" }
            $documentation.estimated_completion_time = "8-12 hours"
            $documentation.prerequisites = @("Basic C/C++ programming", "Understanding of IoT concepts", "ESP32 basics")
            break
        }
        "DLG" {
            $documentation.technical_overview = "Digital logic circuit implementation using discrete components or integrated circuits."
            $documentation.implementation_guide = "Design logic circuit, select appropriate ICs, build on breadboard or PCB, verify functionality with truth table, and optimize design."
            $documentation.components_required = @("Logic ICs (74 series)", "Breadboard and jumper wires", "LEDs and resistors", "Power supply (5V)")
            $documentation.difficulty_level = if ($SourceDocument -match "Expert") { "Advanced" } else { "Beginner" }
            $documentation.estimated_completion_time = "2-4 hours"
            $documentation.prerequisites = @("Basic digital logic concepts", "Boolean algebra", "Truth tables")
            break
        }
        "EE-" {
            $documentation.technical_overview = "Electronic circuit design with practical applications and component selection."
            $documentation.implementation_guide = "Design circuit schematic, select components, build prototype, test functionality, and troubleshoot issues."
            $documentation.components_required = @("Microcontroller or ICs", "Resistors, capacitors, diodes", "Sensors and actuators", "PCB or protoboard")
            $documentation.difficulty_level = if ($SourceDocument -match "advanced") { "Advanced" } elseif ($SourceDocument -match "intermediate") { "Intermediate" } else { "Beginner" }
            $documentation.estimated_completion_time = "4-8 hours"
            $documentation.prerequisites = @("Basic electronics", "Ohm's law", "Circuit analysis")
            break
        }
        "ELC" {
            $documentation.technical_overview = "Electronic circuit implementation with practical applications."
            $documentation.implementation_guide = "Assemble circuit components on protoboard or PCB, test functionality, and optimize for reliability."
            $documentation.components_required = @("Electronic components", "Breadboard and jumper wires", "Power supply", "Testing equipment")
            $documentation.difficulty_level = "Beginner"
            $documentation.estimated_completion_time = "2-6 hours"
            $documentation.prerequisites = @("Basic electronics knowledge", "Component identification")
            break
        }
        "MAT" {
            $documentation.technical_overview = "Mechanical design and stress analysis for engineering applications."
            $documentation.implementation_guide = "Perform stress analysis, select appropriate materials, design mechanical components, and validate through simulation."
            $documentation.components_required = @("CAD software", "Material specifications", "Testing equipment", "Manufacturing tools")
            $documentation.difficulty_level = "Advanced"
            $documentation.estimated_completion_time = "12-24 hours"
            $documentation.prerequisites = @("Mechanical engineering", "CAD skills", "Stress analysis")
            break
        }
        "IND" {
            $documentation.technical_overview = "Industrial automation and control systems implementation."
            $documentation.implementation_guide = "Design control logic, configure PLC or VFD, implement safety systems, and test industrial applications."
            $documentation.components_required = @("PLC or industrial controller", "VFD motor drive", "Sensors and actuators", "Control panel")
            $documentation.difficulty_level = "Intermediate"
            $documentation.estimated_completion_time = "6-12 hours"
            $documentation.prerequisites = @("Industrial automation", "PLC programming", "Electrical safety")
            break
        }
        "ARD" {
            $documentation.technical_overview = "Arduino-based embedded system with advanced features and sensors."
            $documentation.implementation_guide = "Set up Arduino development environment, install libraries, implement sensor integration, and add control logic."
            $documentation.components_required = @("Arduino board", "Sensors and actuators", "Breadboard and jumper wires", "Power supply")
            $documentation.difficulty_level = if ($SourceDocument -match "advanced") { "Advanced" } else { "Intermediate" }
            $documentation.estimated_completion_time = "4-10 hours"
            $documentation.prerequisites = @("Basic Arduino programming", "C/C++ basics", "Sensor interfacing")
            break
        }
        "FSA" {
            $documentation.technical_overview = "Full-stack software development with AI integration and modern technologies."
            $documentation.implementation_guide = "Set up development environment, implement backend API, create frontend interface, integrate AI components, and deploy application."
            $documentation.components_required = @("Development environment", "Database system", "AI libraries", "Cloud hosting")
            $documentation.difficulty_level = "Advanced"
            $documentation.estimated_completion_time = "16-32 hours"
            $documentation.prerequisites = @("Programming fundamentals", "Web development", "AI/ML basics")
            break
        }
        default {
            $documentation.technical_overview = "Engineering project with practical implementation."
            $documentation.implementation_guide = "Design, implement, and test the project according to specifications."
            $documentation.difficulty_level = "Intermediate"
            $documentation.estimated_completion_time = "8-16 hours"
        }
    }
    
    # Add troubleshooting based on project type
    $documentation.troubleshooting = @(
        "Check power connections and voltage levels",
        "Verify component specifications and compatibility",
        "Review code syntax and logic",
        "Test individual components before integration",
        "Consult documentation and reference materials"
    )
    
    # Add learning outcomes
    $documentation.learning_outcomes = @(
        "Understand core concepts and principles",
        "Develop practical implementation skills",
        "Learn troubleshooting and debugging techniques",
        "Gain experience with relevant technologies",
        "Develop problem-solving abilities"
    )
    
    # Add extensions and enhancements
    $documentation.extensions = @(
        "Add wireless connectivity",
        "Implement data logging and analysis",
        "Create mobile app interface",
        "Add automated testing",
        "Integrate with other systems"
    )
    
    # Extract additional info from source document
    if ($SourceDocument -match "PDF p\.(\d+)") {
        $documentation.source_page = $matches[1]
    }
    
    return $documentation
}

function Publish-Documentation {
    param(
        [string]$ProjectCode,
        [string]$ProjectId,
        [object]$Documentation,
        [string]$Version = "1.0.0"
    )
    
    Write-Host "Publishing documentation for $ProjectCode..."
    
    $body = @{
        project_code = $ProjectCode
        documentation = $Documentation
        version = $Version
        changelog_en = "Initial comprehensive documentation publication"
        changelog_ar = "نشر التوثيق الشامل الأول"
        source_document = "Generated by Techsphere documentation system"
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$script:supabaseUrl/functions/v1/document_publish" -Method POST -Headers @{
            Authorization = "Bearer $script:adminToken"
            "Content-Type" = "application/json"
        } -Body $body -ErrorAction Stop
        
        Write-Host "Successfully published documentation for $ProjectCode"
        Write-Host "  Document ID: $($response.document_version_id)"
        Write-Host "  Version: $($response.version)"
        return $true
    }
    catch {
        Write-Host "Failed to publish documentation for $ProjectCode: $($_.Exception.Message)"
        return $false
    }
}

# Main execution
Write-Host "=== Techsphere Documentation Publisher ==="
Write-Host "Starting documentation generation for all projects..."
Write-Host ""

# Step 1: Get admin token
if (-not (Get-AdminToken -Email "admin@techsphere.local" -Password "AdminPass123!")) {
    Write-Host "Cannot continue without admin token"
    exit 1
}

# Step 2: Get all projects
if (-not (Get-AllProjects)) {
    Write-Host "Cannot continue without project data"
    exit 1
}

Write-Host ""
Write-Host "Starting documentation generation and publication..."
Write-Host ""

# Step 3: Generate and publish documentation for each project
$successCount = 0
$failureCount = 0
$totalCount = $script:projects.Count

foreach ($project in $script:projects) {
    Write-Host "Processing project $($project.project_code) - $($project.title_en) [$($projects.IndexOf($project) + 1)/$totalCount]"
    
    $documentation = Generate-Documentation -ProjectCode $project.project_code -TitleEn $project.title_en -TitleAr $project.title_ar -DescriptionEn $project.public_description_en -SourceDocument $project.source_document
    
    if (Publish-Documentation -ProjectCode $project.project_code -ProjectId $project.id -Documentation $documentation -Version "1.0.0") {
        $successCount++
    } else {
        $failureCount++
    }
    
    # Add small delay to avoid rate limiting
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "=== Documentation Publishing Complete ==="
Write-Host "Total projects: $totalCount"
Write-Host "Successful publications: $successCount"
Write-Host "Failed publications: $failureCount"
Write-Host "Success rate: $(($successCount / $totalCount * 100).ToString("0.00"))%"

if ($failureCount -gt 0) {
    Write-Host ""
    Write-Host "Some publications failed. Check error messages above for details."
}
else {
    Write-Host ""
    Write-Host "All documentation published successfully!"
}