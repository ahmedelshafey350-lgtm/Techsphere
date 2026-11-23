# Process all remaining projects for documentation publishing
# Using token from admin_token_new.txt

$adminToken = Get-Content "f:/Techsphere/admin_token_new.txt" | Select-Object -First 1
$supabaseUrl = "https://gzzmrwdolrhjhzpovytg.supabase.co"
$apiKey = "sb_publishable_GC9KQfkI3qw_dIOU82Bfrw_EEMGUqlL"
$functionUrl = "$supabaseUrl/functions/v1/document_publish"

# Track results
$totalProcessed = 0
$successCount = 0
$failureCount = 0
$conflictCount = 0
$failedProjects = @()
$successfulProjects = @()
$skippedProjects = @()

function Generate-Documentation {
    param($projectCode, $titleEn, $category)

    $doc = @{
        project_idea = "$titleEn - Advanced engineering project with practical implementation requirements"
        technical_details = "Advanced control system implementation with sensor integration and automated operation for $titleEn"
        tools_components = @("Microcontroller", "Sensors", "Power supply", "Control system", "User interface")
        real_life_applications = @("Industrial automation", "Educational training", "Research applications", "Technology demonstration")
        educational_benefits = @(
            "Advanced control system implementation",
            "Sensor integration and calibration",
            "Real-world problem solving",
            "Industry-standard practices",
            "Technical documentation skills"
        )
        implementation_steps = @(
            "System design and component selection",
            "Hardware assembly and wiring",
            "Software programming and testing",
            "System integration and calibration",
            "Performance optimization and validation"
        )
        troubleshooting = @(
            "Check power supply connections",
            "Verify sensor calibration",
            "Test control algorithms",
            "Validate communication protocols",
            "Monitor system performance"
        )
        learning_outcomes = @(
            "Advanced embedded systems development",
            "Industrial automation principles",
            "Sensor integration techniques",
            "Control system design",
            "Real-world project management"
        )
        difficulty_level = "Intermediate"
        estimated_completion_time = "8-16 hours"
        prerequisites = @("Basic programming knowledge", "Understanding of control systems", "Electronics fundamentals")
        extensions = @("Add wireless connectivity", "Implement data logging", "Create mobile app interface", "Add automated testing", "Integrate with other systems")
        conclusion = "$titleEn represents a cutting-edge engineering solution that combines advanced control systems with practical industrial applications. This project provides hands-on experience with real-world automation challenges."
    }

    $codePrefix = ""
    if ($projectCode -match "TXH-([A-Z]+)-") {
        $codePrefix = $matches[1]
    }

    # ESP projects - IoT focus
    if ($codePrefix -eq "ESP") {
        $doc.difficulty_level = "Advanced"
        $doc.estimated_completion_time = "12-20 hours"
        $doc.tools_components = @("ESP32", "Wi-Fi module", "Sensors", "Power supply", "Mobile app", "Cloud interface")

        if ($titleEn -like "*Weather*") {
            $doc.project_idea = "IoT weather station with environmental monitoring and data logging"
            $doc.technical_details = "Complete weather monitoring system with temperature, humidity, pressure, and environmental sensors with cloud connectivity"
            $doc.real_life_applications = @("Weather monitoring", "Environmental research", "Agriculture", "Education", "Smart cities")
        }
        elseif ($titleEn -like "*Smart Home*" -or $titleEn -like "*Home Automation*") {
            $doc.project_idea = "Comprehensive smart home automation system with IoT connectivity"
            $doc.technical_details = "Integrated home automation system with lighting, climate, security, and appliance control via mobile app"
            $doc.real_life_applications = @("Home automation", "Energy management", "Security systems", "Convenience", "Smart living")
        }
        elseif ($titleEn -like "*Agriculture*") {
            $doc.project_idea = "Smart agriculture system for precision farming and crop monitoring"
            $doc.technical_details = "Agricultural monitoring and control system with soil, weather, and crop sensors with automated irrigation"
            $doc.real_life_applications = @("Precision farming", "Crop management", "Water conservation", "Yield optimization", "Agriculture")
        }
        elseif ($titleEn -like "*Health*" -or $titleEn -like "*Wearable*") {
            $doc.project_idea = "Health monitoring wearable device with vital signs tracking"
            $doc.technical_details = "Wearable health monitoring device with sensors for heart rate, temperature, and activity tracking"
            $doc.real_life_applications = @("Health monitoring", "Fitness tracking", "Medical devices", "Wellness", "Healthcare")
        }
        elseif ($titleEn -like "*Energy*") {
            $doc.project_idea = "Energy management system for smart buildings and efficiency"
            $doc.technical_details = "Comprehensive energy monitoring and control system for building automation and efficiency optimization"
            $doc.real_life_applications = @("Energy efficiency", "Smart buildings", "Cost reduction", "Sustainability", "Utilities")
        }
        elseif ($titleEn -like "*Parking*") {
            $doc.project_idea = "Smart parking system with space detection and real-time guidance"
            $doc.technical_details = "IoT-based parking system with ultrasonic sensors and real-time space availability information"
            $doc.real_life_applications = @("Smart cities", "Parking management", "Traffic optimization", "User convenience")
        }
        elseif ($titleEn -like "*Waste*") {
            $doc.project_idea = "Smart waste management system with fill-level monitoring"
            $doc.technical_details = "Waste level monitoring and collection optimization system for smart cities and municipalities"
            $doc.real_life_applications = @("Waste management", "Smart cities", "Efficiency", "Environment")
        }
        elseif ($titleEn -like "*Traffic*") {
            $doc.project_idea = "Smart traffic management system with adaptive signal control"
            $doc.technical_details = "Intelligent traffic control system with sensor networks and adaptive signal timing optimization"
            $doc.real_life_applications = @("Traffic management", "Smart cities", "Transportation", "Public safety")
        }
        elseif ($titleEn -like "*Air Quality*") {
            $doc.project_idea = "Air quality monitoring system with environmental sensors"
            $doc.technical_details = "Comprehensive air quality monitoring with particulate matter, gases, and environmental sensors"
            $doc.real_life_applications = @("Environmental monitoring", "Health protection", "Smart cities", "Research")
        }
        elseif ($titleEn -like "*Irrigation*") {
            $doc.project_idea = "Smart irrigation system for precision agriculture"
            $doc.technical_details = "Automated irrigation system with soil moisture sensors and weather data integration"
            $doc.real_life_applications = @("Precision farming", "Water conservation", "Crop management", "Agriculture")
        }
        elseif ($titleEn -like "*Animal*") {
            $doc.project_idea = "Animal tracking system with GPS and health monitoring"
            $doc.technical_details = "GPS-based animal tracking system with location monitoring and health sensors"
            $doc.real_life_applications = @("Wildlife tracking", "Livestock management", "Research", "Conservation")
        }
        elseif ($titleEn -like "*Grid*") {
            $doc.project_idea = "Smart grid monitoring system for power distribution"
            $doc.technical_details = "Power grid monitoring system with load balancing and fault detection capabilities"
            $doc.real_life_applications = @("Power grid", "Energy distribution", "Smart grid", "Utilities")
        }
    }
    # DLG projects - Digital Logic focus
    elseif ($codePrefix -eq "DLG") {
        $doc.difficulty_level = "Beginner"
        $doc.estimated_completion_time = "3-6 hours"
        $doc.tools_components = @("Logic ICs", "Breadboard", "LEDs", "Resistors", "Power supply", "Switches")

        if ($titleEn -like "*Half Adder*") {
            $doc.project_idea = "Binary addition circuit that adds two single bits"
            $doc.technical_details = "Digital logic circuit that performs binary addition using XOR and AND gates producing sum and carry outputs"
            $doc.real_life_applications = @("Binary arithmetic", "Digital systems", "Computer architecture", "Education")
        }
        elseif ($titleEn -like "*Full Adder*") {
            $doc.project_idea = "Binary addition circuit that adds three bits including carry input"
            $doc.technical_details = "Digital logic circuit that performs binary addition with carry input using multiple logic gates"
            $doc.real_life_applications = @("Binary arithmetic", "Digital computation", "Computer design", "Education")
        }
        elseif ($titleEn -like "*Half Subtractor*") {
            $doc.project_idea = "Binary subtraction circuit that subtracts two single bits"
            $doc.technical_details = "Digital logic circuit that performs binary subtraction exposing difference and borrow outputs"
            $doc.real_life_applications = @("Binary arithmetic", "Digital systems", "Computer architecture", "Education")
        }
        elseif ($titleEn -like "*Full Subtractor*") {
            $doc.project_idea = "Binary subtraction circuit with borrow input handling"
            $doc.technical_details = "Digital logic circuit that performs binary subtraction with borrow input handling"
            $doc.real_life_applications = @("Binary arithmetic", "Digital computation", "Computer design", "Education")
        }
        elseif ($titleEn -like "*Binary Adder*") {
            $doc.project_idea = "Binary addition circuit for multi-bit arithmetic operations"
            $doc.technical_details = "Digital logic circuit that adds binary numbers with carry propagation across multiple bits"
            $doc.real_life_applications = @("Binary arithmetic", "Computer architecture", "Digital systems", "Education")
            $doc.difficulty_level = "Intermediate"
            $doc.estimated_completion_time = "5-8 hours"
        }
        elseif ($titleEn -like "*Decoder*") {
            $doc.project_idea = "BCD to seven-segment decoder for digital display"
            $doc.technical_details = "Digital circuit that converts BCD input to seven-segment display output for numeric visualization"
            $doc.real_life_applications = @("Digital displays", "Counters", "Digital clocks", "Numeric display")
        }
        elseif ($titleEn -like "*Multiplexer*") {
            $doc.project_idea = "Multiplexer circuit for data selection and signal routing"
            $doc.technical_details = "Digital multiplexer for selecting multiple input signals and routing to a single output"
            $doc.real_life_applications = @("Data selection", "Digital communication", "Signal routing", "Computer systems")
        }
        elseif ($titleEn -like "*Demultiplexer*") {
            $doc.project_idea = "Demultiplexer circuit for data distribution"
            $doc.technical_details = "Digital demultiplexer for distributing input signal to multiple outputs based on control signals"
            $doc.real_life_applications = @("Data distribution", "Digital communication", "Signal routing", "Computer systems")
        }
    }
    # EE projects - Electronics focus
    elseif ($codePrefix -eq "EE") {
        $doc.difficulty_level = "Intermediate"
        $doc.estimated_completion_time = "5-10 hours"
        $doc.tools_components = @("Op-amps", "Resistors", "Capacitors", "Transistors", "Power supply", "Breadboard", "Oscilloscope")

        if ($titleEn -like "*Operational Amplifier*") {
            $doc.project_idea = "Basic operational amplifier circuits for signal processing and conditioning"
            $doc.technical_details = "Implementation of basic op-amp circuits including amplifiers, filters, comparators, and signal conditioning"
            $doc.real_life_applications = @("Signal processing", "Audio amplification", "Sensor conditioning", "Instrumentation", "Control systems")
        }
        elseif ($titleEn -like "*555 Timer*") {
            $doc.project_idea = "555 timer integrated circuit applications and timing circuits"
            $doc.technical_details = "Implementation of various 555 timer circuits including astable, monostable, and PWM applications"
            $doc.real_life_applications = @("Timing circuits", "PWM control", "Oscillators", "Delay circuits", "Pulse generation")
        }
        elseif ($titleEn -like "*Voltage Regulator*") {
            $doc.project_idea = "Voltage regulator circuits for power supply stabilization"
            $doc.technical_details = "Implementation of linear and switching voltage regulators for stable power supply output"
            $doc.real_life_applications = @("Power conditioning", "Voltage stabilization", "Power supplies", "Electronic systems", "Voltage regulation")
        }
        elseif ($titleEn -like "*Filter Circuits*") {
            $doc.project_idea = "Filter circuits design for signal conditioning and noise reduction"
            $doc.technical_details = "Design and implementation of various filter circuits including low-pass, high-pass, band-pass, and band-stop filters"
            $doc.real_life_applications = @("Signal processing", "Noise filtering", "Audio processing", "Communication systems", "Signal conditioning")
        }
        elseif ($titleEn -like "*Oscillator Circuits*") {
            $doc.project_idea = "Oscillator circuits for generating periodic signals and clock generation"
            $doc.technical_details = "Implementation of various oscillator circuits including RC, LC, crystal, and relaxation oscillators"
            $doc.real_life_applications = @("Signal generation", "Clock circuits", "Timing systems", "Communication", "Frequency generation")
        }
        elseif ($titleEn -like "*Power Supply Circuits*") {
            $doc.project_idea = "Power supply circuits for electronic systems and devices"
            $doc.technical_details = "Design and implementation of complete power supply systems including rectification, filtering, regulation, and protection"
            $doc.real_life_applications = @("Power systems", "Electronics", "Industrial equipment", "Consumer devices", "Power management")
        }
        elseif ($titleEn -like "*Audio Amplifier*") {
            $doc.project_idea = "Audio amplifier circuits for sound amplification and processing"
            $doc.technical_details = "Implementation of various audio amplifier circuits including class A, B, AB, and D amplifiers"
            $doc.real_life_applications = @("Audio systems", "Sound reinforcement", "Music equipment", "Home theater", "Audio processing")
        }
        elseif ($titleEn -like "*LED Driver*") {
            $doc.project_idea = "LED driver circuits for efficient LED lighting control"
            $doc.technical_details = "Implementation of constant current LED drivers with dimming and control capabilities"
            $doc.real_life_applications = @("LED lighting", "Display systems", "Signage", "Lighting control", "Illumination")
        }
        elseif ($titleEn -like "*Motor Control*") {
            $doc.project_idea = "Motor control circuits for precise motor operation and speed control"
            $doc.technical_details = "Implementation of motor drivers and control circuits for DC, stepper, and servo motors"
            $doc.real_life_applications = @("Motor control", "Automation", "Robotics", "Industrial equipment", "Motion control")
        }
        elseif ($titleEn -like "*Sensor Interface*") {
            $doc.project_idea = "Sensor interface circuits for sensor signal conditioning and acquisition"
            $doc.technical_details = "Implementation of circuits for interfacing various sensors with microcontrollers and data acquisition systems"
            $doc.real_life_applications = @("Sensor networks", "Data acquisition", "Monitoring systems", "IoT devices", "Measurement systems")
        }
        elseif ($titleEn -like "*Wireless Communication*") {
            $doc.project_idea = "Wireless communication circuits for data transmission and reception"
            $doc.technical_details = "Implementation of wireless communication systems using RF modules, antennas, and communication protocols"
            $doc.real_life_applications = @("Wireless communication", "Remote control", "Data transmission", "IoT", "RF systems")
        }
        elseif ($titleEn -like "*RFID*") {
            $doc.project_idea = "RFID reader circuit for identification and tracking systems"
            $doc.technical_details = "RFID reader implementation for tag identification, data extraction, and tracking applications"
            $doc.real_life_applications = @("Access control", "Inventory tracking", "Identification", "Security", "Asset tracking")
        }
        elseif ($titleEn -like "*NFC*") {
            $doc.project_idea = "NFC communication system for contactless interaction and data exchange"
            $doc.technical_details = "NFC implementation for contactless data exchange, payment systems, and device pairing"
            $doc.real_life_applications = @("Contactless payments", "Data exchange", "Access control", "Smart devices", "Mobile communication")
        }
        elseif ($titleEn -like "*Bluetooth*") {
            $doc.project_idea = "Bluetooth module interface for wireless device connectivity"
            $doc.technical_details = "Bluetooth communication interface for device-to-device wireless connectivity and data exchange"
            $doc.real_life_applications = @("Wireless connectivity", "Device communication", "IoT", "Mobile integration", "Personal area networks")
        }
        elseif ($titleEn -like "*Wi-Fi*") {
            $doc.project_idea = "Wi-Fi communication system for network connectivity and internet access"
            $doc.technical_details = "Wi-Fi implementation for network connectivity, internet communication, and cloud integration"
            $doc.real_life_applications = @("Network connectivity", "Internet of Things", "Remote control", "Data transmission", "Cloud services")
        }
    }
    # MAT projects - Mechanical Design focus
    elseif ($codePrefix -eq "MAT") {
        $doc.difficulty_level = "Advanced"
        $doc.estimated_completion_time = "14-22 hours"
        $doc.tools_components = @("CAD software", "Analysis tools", "Material database", "Load analysis", "Testing equipment", "Simulation software")

        if ($titleEn -like "*Stress Analysis*") {
            $doc.project_idea = "Stress analysis of structural beam under various loading conditions"
            $doc.technical_details = "Structural analysis of beam stress, strain, deflection, and safety factor calculations under different loads"
            $doc.real_life_applications = @("Structural engineering", "Building design", "Safety analysis", "Construction", "Civil engineering")
        }
        elseif ($titleEn -like "*Pressure Vessel*") {
            $doc.project_idea = "Pressure vessel design and safety analysis"
            $doc.technical_details = "Design and analysis of pressure vessels with stress calculations, safety factors, and code compliance"
            $doc.real_life_applications = @("Pressure vessels", "Industrial equipment", "Safety engineering", "Manufacturing", "Oil and gas")
        }
        elseif ($titleEn -like "*Gear Design*") {
            $doc.project_idea = "Gear design and mechanical power transmission analysis"
            $doc.technical_details = "Design and analysis of gear systems with tooth geometry, strength, efficiency, and load capacity calculations"
            $doc.real_life_applications = @("Mechanical design", "Power transmission", "Industrial machinery", "Automotive", "Machine design")
        }
        elseif ($titleEn -like "*Bearing Design*") {
            $doc.project_idea = "Bearing design and life calculation analysis"
            $doc.technical_details = "Design and analysis of bearing systems with load capacity, life expectancy, and efficiency calculations"
            $doc.real_life_applications = @("Bearing design", "Rotating machinery", "Industrial equipment", "Maintenance", "Machine elements")
        }
        elseif ($titleEn -like "*Shaft Design*") {
            $doc.project_idea = "Shaft design and structural analysis for power transmission"
            $doc.technical_details = "Design and analysis of shaft systems with stress, deflection, critical speed, and torsion calculations"
            $doc.real_life_applications = @("Shaft design", "Rotating machinery", "Power transmission", "Industrial equipment", "Machine design")
        }
    }
    # FSA projects - Full Stack Software focus
    elseif ($codePrefix -eq "FSA") {
        $doc.difficulty_level = "Advanced"
        $doc.estimated_completion_time = "20-35 hours"
        $doc.tools_components = @("Frontend framework", "Backend framework", "Database", "Server", "API", "Version control", "Deployment platform")

        if ($titleEn -like "*Full-Stack Web Application*") {
            $doc.project_idea = "Full-stack web application with modern architecture and complete feature set"
            $doc.technical_details = "Complete web application with frontend, backend, database, REST API, authentication, and responsive design"
            $doc.real_life_applications = @("Web development", "Software applications", "Business solutions", "Technology platforms", "Digital services")
        }
        elseif ($titleEn -like "*E-Commerce Platform*") {
            $doc.project_idea = "E-commerce platform with shopping cart, payment integration, and order management"
            $doc.technical_details = "Complete online shopping platform with product catalog, cart, checkout, payment processing, and order management"
            $doc.real_life_applications = @("Online shopping", "E-commerce", "Retail", "Business", "Digital commerce")
        }
        elseif ($titleEn -like "*Content Management System*") {
            $doc.project_idea = "Content management system for digital content publishing and management"
            $doc.technical_details = "CMS platform for creating, editing, managing, and publishing digital content with user roles and permissions"
            $doc.real_life_applications = @("Content publishing", "Blogs", "News sites", "Digital media", "Content management")
        }
        elseif ($titleEn -like "*Social Media Platform*") {
            $doc.project_idea = "Social media platform with user profiles, posts, and interaction features"
            $doc.technical_details = "Social networking platform with user profiles, posts, messaging, comments, likes, and community features"
            $doc.real_life_applications = @("Social networking", "Community building", "Communication", "Entertainment", "Social media")
        }
        elseif ($titleEn -like "*Learning Management System*") {
            $doc.project_idea = "Learning management system for online education and course delivery"
            $doc.technical_details = "Educational platform with course management, student tracking, content delivery, assessments, and grading"
            $doc.real_life_applications = @("Online education", "Training", "E-learning", "Skill development", "Education technology")
        }
        elseif ($titleEn -like "*Project Management Tool*") {
            $doc.project_idea = "Project management tool for team collaboration and task tracking"
            $doc.technical_details = "Project management platform with task tracking, team collaboration, progress monitoring, and reporting"
            $doc.real_life_applications = @("Project management", "Team collaboration", "Productivity", "Business operations", "Task management")
        }
        elseif ($titleEn -like "*Customer Relationship*") {
            $doc.project_idea = "Customer relationship management system for business operations"
            $doc.technical_details = "CRM platform for managing customer interactions, sales pipelines, support tickets, and customer data"
            $doc.real_life_applications = @("Customer management", "Sales automation", "Business operations", "Customer service", "CRM")
        }
        elseif ($titleEn -like "*Inventory Management*") {
            $doc.project_idea = "Inventory management system for stock control and tracking"
            $doc.technical_details = "Complete inventory management with tracking, ordering, reporting, and stock optimization capabilities"
            $doc.real_life_applications = @("Inventory control", "Stock management", "Business operations", "Retail", "Warehouse management")
        }
        elseif ($titleEn -like "*HR Management*") {
            $doc.project_idea = "HR management system for employee administration and payroll"
            $doc.technical_details = "Human resources management system with employee records, payroll, benefits, attendance, and performance tracking"
            $doc.real_life_applications = @("HR management", "Employee administration", "Payroll", "Benefits", "Human resources")
        }
        elseif ($titleEn -like "*Financial Management*") {
            $doc.project_idea = "Financial management system for accounting and financial reporting"
            $doc.technical_details = "Complete financial management system with accounting, invoicing, expense tracking, and financial reporting"
            $doc.real_life_applications = @("Financial management", "Accounting", "Business finance", "Reporting", "Finance")
        }
        elseif ($titleEn -like "*Analytics Dashboard*") {
            $doc.project_idea = "Analytics dashboard for business intelligence and data visualization"
            $doc.technical_details = "Business intelligence dashboard with data visualization, analytics, reporting, and real-time metrics"
            $doc.real_life_applications = @("Business intelligence", "Data analysis", "Decision making", "Reporting", "Analytics")
        }
    }
    # IND projects - Industrial Automation focus
    elseif ($codePrefix -eq "IND") {
        $doc.difficulty_level = "Advanced"
        $doc.estimated_completion_time = "16-26 hours"
        $doc.tools_components = @("PLC", "Sensors", "Actuators", "HMI", "Power supply", "Communication module", "Industrial PC")

        if ($titleEn -like "*PLC*") {
            $doc.project_idea = "PLC-based industrial automation system with programmable logic control"
            $doc.technical_details = "Programmable logic controller implementation for industrial process automation and control"
            $doc.real_life_applications = @("Industrial automation", "Process control", "Manufacturing", "Factory automation", "Control systems")
        }
        elseif ($titleEn -like "*VFD*" -or $titleEn -like "*Variable Frequency*") {
            $doc.project_idea = "Variable frequency drive system for motor speed control"
            $doc.technical_details = "VFD implementation for precise motor speed and torque control in industrial applications"
            $doc.real_life_applications = @("Motor control", "Energy efficiency", "Industrial drives", "Pump control", "Fan control")
        }
        elseif ($titleEn -like "*SCADA*") {
            $doc.project_idea = "SCADA system for industrial process monitoring and control"
            $doc.technical_details = "Supervisory control and data acquisition system for remote monitoring and control of industrial processes"
            $doc.real_life_applications = @("Process control", "Industrial monitoring", "Remote operations", "Utilities", "Manufacturing")
        }
        elseif ($titleEn -like "*HMI*") {
            $doc.project_idea = "Human-machine interface for industrial equipment control"
            $doc.technical_details = "HMI implementation for operator interface, monitoring, and control of industrial equipment"
            $doc.real_life_applications = @("Operator interface", "Industrial control", "Monitoring", "Manufacturing", "Equipment operation")
        }
        elseif ($titleEn -like "*Robotics*") {
            $doc.project_idea = "Industrial robotics cell for automated manufacturing"
            $doc.technical_details = "Robotic cell implementation for automated manufacturing operations with safety systems"
            $doc.real_life_applications = @("Industrial robotics", "Automated manufacturing", "Assembly", "Welding", "Material handling")
        }
    }
    # ARD projects - Embedded Systems focus
    elseif ($codePrefix -eq "ARD") {
        $doc.difficulty_level = "Intermediate"
        $doc.estimated_completion_time = "10-18 hours"
        $doc.tools_components = @("Arduino", "Sensors", "Actuators", "Power supply", "Programming interface", "Breadboard")

        if ($titleEn -like "*Warehouse*" -or $titleEn -like "*AMR*") {
            $doc.project_idea = "Autonomous warehouse navigation using SLAM algorithms"
            $doc.technical_details = "Implements Extended Kalman Filter (EKF) with Lidar sensor fusion for precise indoor navigation and obstacle avoidance"
            $doc.real_life_applications = @("Automated warehouse navigation", "Material handling logistics", "Inventory management", "Smart factories", "Robotics")
        }
        elseif ($titleEn -like "*Robotic Arm*") {
            $doc.project_idea = "Precision industrial automation with closed-loop control"
            $doc.technical_details = "Six-axis closed-loop control system using stepper motors with kinematic calculations for precise positioning"
            $doc.real_life_applications = @("Manufacturing automation", "Precision assembly", "Quality inspection", "Packaging operations", "Robotics")
        }
        elseif ($titleEn -like "*AUV*") {
            $doc.project_idea = "Underwater autonomous vehicle with depth and heading control"
            $doc.technical_details = "Pressure sensor and IMU combination for depth control and heading stabilization in underwater environments"
            $doc.real_life_applications = @("Underwater exploration", "Marine research", "Pipeline inspection", "Environmental monitoring", "Robotics")
        }
        elseif ($titleEn -like "*Quadcopter*") {
            $doc.project_idea = "Self-balancing aerial platform for indoor flight"
            $doc.technical_details = "MPU6050 accelerometer/gyro with PID control for stable flight and attitude correction"
            $doc.real_life_applications = @("Aerial photography", "Indoor mapping", "Inspection services", "Recreational use", "Drone technology")
        }
        elseif ($titleEn -like "*Pipe*" -or $titleEn -like "*Inspection Crawler*") {
            $doc.project_idea = "Automated pipeline inspection system with crawler mobility"
            $doc.technical_details = "Crawler robot with motor control and camera system for internal pipe inspection and monitoring"
            $doc.real_life_applications = @("Infrastructure inspection", "Maintenance monitoring", "Quality control", "Safety assessment", "Pipeline inspection")
        }
        elseif ($titleEn -like "*Camera Gimbal*") {
            $doc.project_idea = "Stabilized camera platform for smooth video capture"
            $doc.technical_details = "3-axis brushless motor control with synchronized movement for camera stabilization"
            $doc.real_life_applications = @("Professional videography", "Drone stabilization", "Camera tracking", "Smooth motion capture", "Photography")
        }
        elseif ($titleEn -like "*Vibration*") {
            $doc.project_idea = "Predictive maintenance system using vibration analysis"
            $doc.technical_details = "FFT analysis of vibration signals with RMS calculation and communication for industrial monitoring"
            $doc.real_life_applications = @("Predictive maintenance", "Industrial monitoring", "Equipment health", "Cost reduction", "Maintenance")
        }
        elseif ($titleEn -like "*Vision*" -or $titleEn -like "*Sorting Conveyor*") {
            $doc.project_idea = "Automated product sorting using computer vision"
            $doc.technical_details = "Edge AI classification system with camera input for automated product sorting and quality control"
            $doc.real_life_applications = @("Automated sorting", "Quality control", "Manufacturing efficiency", "Reduced labor costs", "Computer vision")
        }
        elseif ($titleEn -like "*Pneumatic*" -or $titleEn -like "*Bottle Filling*") {
            $doc.project_idea = "Automated bottle filling and capping system"
            $doc.technical_details = "Pneumatic actuator control with current monitoring and automated rejection system"
            $doc.real_life_applications = @("Automated packaging", "Quality control", "Production line automation", "Cost efficiency", "Manufacturing")
        }
        elseif ($titleEn -like "*CNC*" -or $titleEn -like "*Tool-Wear*") {
            $doc.project_idea = "Tool wear monitoring system for CNC machining"
            $doc.technical_details = "Acoustic and vibration analysis for cutting tool wear detection in machining operations"
            $doc.real_life_applications = @("Manufacturing optimization", "Tool management", "Predictive maintenance", "Production efficiency", "CNC machining")
        }
        elseif ($titleEn -like "*Assembly*") {
            $doc.project_idea = "Automated robotic arm for product assembly"
            $doc.technical_details = "Robotic arm system for automated product assembly and packaging operations"
            $doc.real_life_applications = @("Manufacturing automation", "Assembly operations", "Packaging", "Quality control", "Robotics")
        }
        elseif ($titleEn -like "*Eddy-Current*") {
            $doc.project_idea = "Metal defect detection using electromagnetic sensing"
            $doc.technical_details = "Eddy-current sensing system for detecting metal flaws and material defects"
            $doc.real_life_applications = @("Quality control", "Manufacturing inspection", "Safety assurance", "Defect detection", "Non-destructive testing")
        }
        elseif ($titleEn -like "*Hydraulic Press*") {
            $doc.project_idea = "Safety-critical hydraulic press with dual safety interlocks"
            $doc.technical_details = "Hydraulic press system with two-hand safety and pressure monitoring for safe operation"
            $doc.real_life_applications = @("Industrial safety", "Manufacturing", "Press operations", "Safety compliance", "Hydraulic systems")
        }
        elseif ($titleEn -like "*Thermal Furnace*" -or $titleEn -like "*PID*") {
            $doc.project_idea = "Precision temperature control system with PID regulation"
            $doc.technical_details = "PID-controlled furnace with precise temperature profile management and control"
            $doc.real_life_applications = @("Heat treatment", "Industrial processes", "Temperature control", "Manufacturing", "Thermal systems")
        }
        elseif ($titleEn -like "*Storage*" -or $titleEn -like "*ASRS*") {
            $doc.project_idea = "Automated warehouse storage and retrieval system"
            $doc.technical_details = "Automated bin movement and retrieval system for warehouse management and inventory control"
            $doc.real_life_applications = @("Warehouse automation", "Inventory management", "Logistics", "Storage optimization", "Material handling")
        }
        elseif ($titleEn -like "*Bearing Monitor*") {
            $doc.project_idea = "Bearing health monitoring using thermal and vibration analysis"
            $doc.technical_details = "Thermal and vibration scanning for bearing lubrication and wear detection"
            $doc.real_life_applications = @("Predictive maintenance", "Equipment monitoring", "Cost reduction", "Safety", "Condition monitoring")
        }
        elseif ($titleEn -like "*Power-Quality*") {
            $doc.project_idea = "Industrial power quality monitoring with active PFC"
            $doc.technical_details = "True RMS measurement and power factor correction for industrial power systems"
            $doc.real_life_applications = @("Power quality", "Energy efficiency", "Industrial electrical", "Cost savings", "Electrical systems")
        }
        elseif ($titleEn -like "*Multi-Pump*") {
            $doc.project_idea = "Multi-pump coordinated system with PID flow control"
            $doc.technical_details = "PID coordination of multiple pumps for maintaining precise flow rates and pressure"
            $doc.real_life_applications = @("Fluid control", "Industrial pumping", "Flow management", "Process control", "Pumping systems")
        }
        elseif ($titleEn -like "*Motor Test Bench*") {
            $doc.project_idea = "Motor performance testing with hardware-in-the-loop simulation"
            $doc.technical_details = "Dynamic motor testing with torque, speed, efficiency, and performance measurement"
            $doc.real_life_applications = @("Motor testing", "Performance validation", "Quality control", "Research", "Motor development")
        }
        elseif ($titleEn -like "*Solar Tracker*") {
            $doc.project_idea = "Astronomical solar tracking system with wind protection"
            $doc.technical_details = "Sun tracking using astronomical calculations with automatic wind safety and optimal energy collection"
            $doc.real_life_applications = @("Solar energy", "Renewable energy", "Energy optimization", "Smart systems", "Solar power")
        }
        elseif ($titleEn -like "*Grid-Tied*") {
            $doc.project_idea = "Smart microgrid manager for solar power integration"
            $doc.technical_details = "Manages grid-tied solar power and network protection systems with power quality monitoring"
            $doc.real_life_applications = @("Solar energy", "Grid management", "Power quality", "Renewable energy", "Microgrids")
        }
        elseif ($titleEn -like "*Cable Fault*") {
            $doc.project_idea = "Underground cable fault locator using time-domain reflectometry"
            $doc.technical_details = "Locates underground cable faults using time-domain reflectometry and signal analysis"
            $doc.real_life_applications = @("Infrastructure maintenance", "Cable testing", "Fault detection", "Utilities", "Electrical maintenance")
        }
        elseif ($titleEn -like "*Wastewater*") {
            $doc.project_idea = "Multi-stage industrial wastewater treatment"
            $doc.technical_details = "Monitors water quality and automates chemical treatment processes for industrial wastewater"
            $doc.real_life_applications = @("Water treatment", "Environmental protection", "Industrial processes", "Quality control", "Environmental engineering")
        }
        elseif ($titleEn -like "*Chemical Mixing*") {
            $doc.project_idea = "Chemical mixing station with load-cell precision weighing"
            $doc.technical_details = "Uses load cells for precise batch liquid mixing by weight with automated control"
            $doc.real_life_applications = @("Chemical processing", "Precision manufacturing", "Batch production", "Quality control", "Chemical engineering")
        }
        elseif ($titleEn -like "*EV Charger*" -or $titleEn -like "*Battery Charger*") {
            $doc.project_idea = "Smart EV battery charger with CC/CV charging"
            $doc.technical_details = "Constant current/constant voltage charging with cell temperature monitoring and safety features"
            $doc.real_life_applications = @("EV charging", "Battery management", "Energy storage", "Transportation", "Electric vehicles")
        }
    }

    return $doc
}

function Publish-Documentation {
    param($projectCode, $documentation, $adminToken)

    $body = @{
        project_code = $projectCode
        documentation = $documentation
        version = "1.0.0"
        changelog_en = "Initial comprehensive documentation publication"
        changelog_ar = "Initial documentation"
        source_document = "Generated by Techsphere documentation system"
    } | ConvertTo-Json -Depth 10

    $headers = @{
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }

    try {
        $response = Invoke-RestMethod -Uri $functionUrl -Method POST -Headers $headers -Body $body -ErrorAction Stop
        return @{success=$true; message="Success - Doc ID: $($response.document_version_id)"}
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -match "409") {
            return @{success=$true; message="Conflict - Documentation already exists (skipped)"}
        }
        elseif ($errorMsg -match "401") {
            return @{success=$false; message="Auth failed - token may be expired"}
        }
        else {
            return @{success=$false; message="Failed: $errorMsg"}
        }
    }
}

# Define all projects to process
$allProjects = @(
    # ARD projects (Embedded Systems)
    @{project_code="TXH-ARD-001"; title_en="Autonomous Warehouse AMR with EKF/Lidar SLAM"; category="Embedded Systems"},
    @{project_code="TXH-ARD-002"; title_en="6-Axis Closed-Loop Industrial Robotic Arm"; category="Embedded Systems"},
    @{project_code="TXH-ARD-003"; title_en="Autonomous AUV with Depth/Heading Hold"; category="Embedded Systems"},
    @{project_code="TXH-ARD-004"; title_en="Self-Balancing Quadcopter"; category="Embedded Systems"},
    @{project_code="TXH-ARD-005"; title_en="Pipe and Drain Inspection Crawler"; category="Embedded Systems"},
    @{project_code="TXH-ARD-006"; title_en="3-Axis Camera Gimbal"; category="Embedded Systems"},
    @{project_code="TXH-ARD-007"; title_en="Predictive Vibration FFT Maintenance Node"; category="Embedded Systems"},
    @{project_code="TXH-ARD-008"; title_en="Vision-Guided Sorting Conveyor"; category="Embedded Systems"},
    @{project_code="TXH-ARD-009"; title_en="Pneumatic Bottle Filling and Capping Machine"; category="Embedded Systems"},
    @{project_code="TXH-ARD-010"; title_en="CNC Tool-Wear Monitoring System"; category="Embedded Systems"},
    @{project_code="TXH-ARD-011"; title_en="Smart Assembly and Packaging Robotic Arm"; category="Embedded Systems"},
    @{project_code="TXH-ARD-012"; title_en="Eddy-Current Metal Defect Detector"; category="Embedded Systems"},
    @{project_code="TXH-ARD-013"; title_en="Dual-Safety Hydraulic Press"; category="Embedded Systems"},
    @{project_code="TXH-ARD-014"; title_en="Precision PID Thermal Furnace"; category="Embedded Systems"},
    @{project_code="TXH-ARD-015"; title_en="Automated Storage and Retrieval System (ASRS)"; category="Embedded Systems"},
    @{project_code="TXH-ARD-016"; title_en="Thermal/Vibration Bearing Monitor"; category="Embedded Systems"},
    @{project_code="TXH-ARD-017"; title_en="Industrial Power-Quality and Active PFC Monitor"; category="Embedded Systems"},
    @{project_code="TXH-ARD-018"; title_en="Multi-Pump Closed-Loop PID Station"; category="Embedded Systems"},
    @{project_code="TXH-ARD-019"; title_en="Dynamic Motor Hardware-in-the-Loop Test Bench"; category="Embedded Systems"},
    @{project_code="TXH-ARD-020"; title_en="Astronomical Dual-Axis Solar Tracker"; category="Embedded Systems"},
    @{project_code="TXH-ARD-021"; title_en="Grid-Tied Solar Microgrid Manager"; category="Embedded Systems"},
    @{project_code="TXH-ARD-022"; title_en="Underground Cable Fault Locator"; category="Embedded Systems"},
    @{project_code="TXH-ARD-023"; title_en="Multi-Stage Industrial Wastewater Treatment"; category="Embedded Systems"},
    @{project_code="TXH-ARD-024"; title_en="Load-Cell Chemical Mixing Station"; category="Embedded Systems"},
    @{project_code="TXH-ARD-025"; title_en="Smart EV Battery Charger"; category="Embedded Systems"},
    @{project_code="TXH-ARD-026"; title_en="Smart EV Charging Station"; category="Embedded Systems"},
    @{project_code="TXH-ARD-027"; title_en="Industrial Robotic Welding System"; category="Embedded Systems"},
    @{project_code="TXH-ARD-028"; title_en="Automated Quality Inspection System"; category="Embedded Systems"},
    @{project_code="TXH-ARD-029"; title_en="Smart Conveyor Belt System"; category="Embedded Systems"},
    @{project_code="TXH-ARD-030"; title_en="Automated Packaging Line"; category="Embedded Systems"},

    # DLG projects (Digital Logic)
    @{project_code="TXH-DLG-001"; title_en="Half Adder"; category="Digital Logic"},
    @{project_code="TXH-DLG-002"; title_en="Full Adder"; category="Digital Logic"},
    @{project_code="TXH-DLG-003"; title_en="Half Subtractor"; category="Digital Logic"},
    @{project_code="TXH-DLG-004"; title_en="Full Subtractor"; category="Digital Logic"},
    @{project_code="TXH-DLG-005"; title_en="4-Bit Binary Adder"; category="Digital Logic"},
    @{project_code="TXH-DLG-006"; title_en="8-Bit Binary Adder"; category="Digital Logic"},
    @{project_code="TXH-DLG-007"; title_en="4-Bit Binary Subtractor"; category="Digital Logic"},
    @{project_code="TXH-DLG-008"; title_en="BCD to Seven-Segment Decoder"; category="Digital Logic"},
    @{project_code="TXH-DLG-009"; title_en="Multiplexer Circuit"; category="Digital Logic"},
    @{project_code="TXH-DLG-010"; title_en="Demultiplexer Circuit"; category="Digital Logic"},

    # EE projects (Electronics)
    @{project_code="TXH-EE-001"; title_en="Basic Operational Amplifier Circuits"; category="Electronics"},
    @{project_code="TXH-EE-002"; title_en="555 Timer Applications"; category="Electronics"},
    @{project_code="TXH-EE-003"; title_en="Voltage Regulator Circuits"; category="Electronics"},
    @{project_code="TXH-EE-004"; title_en="Filter Circuits Design"; category="Electronics"},
    @{project_code="TXH-EE-005"; title_en="Oscillator Circuits"; category="Electronics"},
    @{project_code="TXH-EE-006"; title_en="Power Supply Circuits"; category="Electronics"},
    @{project_code="TXH-EE-007"; title_en="Audio Amplifier Circuits"; category="Electronics"},
    @{project_code="TXH-EE-008"; title_en="LED Driver Circuits"; category="Electronics"},
    @{project_code="TXH-EE-009"; title_en="Motor Control Circuits"; category="Electronics"},
    @{project_code="TXH-EE-010"; title_en="Sensor Interface Circuits"; category="Electronics"},
    @{project_code="TXH-EE-011"; title_en="Wireless Communication Circuits"; category="Electronics"},
    @{project_code="TXH-EE-012"; title_en="RFID Reader Circuit"; category="Electronics"},
    @{project_code="TXH-EE-013"; title_en="NFC Communication System"; category="Electronics"},
    @{project_code="TXH-EE-014"; title_en="Bluetooth Module Interface"; category="Electronics"},
    @{project_code="TXH-EE-015"; title_en="Wi-Fi Communication System"; category="Electronics"},

    # ESP projects (IoT)
    @{project_code="TXH-ESP-001"; title_en="AI CNC Tool Wear Monitor"; category="Embedded IoT"},
    @{project_code="TXH-ESP-002"; title_en="Smart Home Automation System"; category="Embedded IoT"},
    @{project_code="TXH-ESP-003"; title_en="Weather Station with IoT"; category="Embedded IoT"},
    @{project_code="TXH-ESP-004"; title_en="Industrial Monitoring System"; category="Embedded IoT"},
    @{project_code="TXH-ESP-005"; title_en="Smart Agriculture System"; category="Embedded IoT"},
    @{project_code="TXH-ESP-006"; title_en="Health Monitoring Wearable"; category="Embedded IoT"},
    @{project_code="TXH-ESP-007"; title_en="Smart Parking System"; category="Embedded IoT"},
    @{project_code="TXH-ESP-008"; title_en="Energy Management System"; category="Embedded IoT"},
    @{project_code="TXH-ESP-009"; title_en="Smart Lighting Control"; category="Embedded IoT"},
    @{project_code="TXH-ESP-010"; title_en="Waste Management System"; category="Embedded IoT"},
    @{project_code="TXH-ESP-011"; title_en="Smart Traffic Management"; category="Embedded IoT"},
    @{project_code="TXH-ESP-012"; title_en="Air Quality Monitoring"; category="Embedded IoT"},
    @{project_code="TXH-ESP-013"; title_en="Smart Irrigation System"; category="Embedded IoT"},
    @{project_code="TXH-ESP-014"; title_en="Animal Tracking System"; category="Embedded IoT"},
    @{project_code="TXH-ESP-015"; title_en="Smart Grid Monitoring"; category="Embedded IoT"},

    # FSA projects (Full Stack Software)
    @{project_code="TXH-FSA-001"; title_en="Full-Stack Web Application"; category="Software & AI"},
    @{project_code="TXH-FSA-002"; title_en="E-Commerce Platform"; category="Software & AI"},
    @{project_code="TXH-FSA-003"; title_en="Content Management System"; category="Software & AI"},
    @{project_code="TXH-FSA-004"; title_en="Social Media Platform"; category="Software & AI"},
    @{project_code="TXH-FSA-005"; title_en="Learning Management System"; category="Software & AI"},
    @{project_code="TXH-FSA-006"; title_en="Project Management Tool"; category="Software & AI"},
    @{project_code="TXH-FSA-007"; title_en="Customer Relationship Management"; category="Software & AI"},
    @{project_code="TXH-FSA-008"; title_en="Inventory Management System"; category="Software & AI"},
    @{project_code="TXH-FSA-009"; title_en="HR Management System"; category="Software & AI"},
    @{project_code="TXH-FSA-010"; title_en="Financial Management System"; category="Software & AI"},
    @{project_code="TXH-FSA-011"; title_en="Analytics Dashboard"; category="Software & AI"},

    # MAT projects (Mechanical Design)
    @{project_code="TXH-MAT-001"; title_en="Stress Analysis of Beam"; category="Mechanical Design"},
    @{project_code="TXH-MAT-002"; title_en="Pressure Vessel Design"; category="Mechanical Design"},
    @{project_code="TXH-MAT-003"; title_en="Gear Design and Analysis"; category="Mechanical Design"},
    @{project_code="TXH-MAT-004"; title_en="Bearing Design Calculation"; category="Mechanical Design"},
    @{project_code="TXH-MAT-005"; title_en="Shaft Design and Analysis"; category="Mechanical Design"},

    # IND projects (Industrial Automation)
    @{project_code="TXH-IND-001"; title_en="PLC-Based Conveyor Control System"; category="Industrial Automation"},
    @{project_code="TXH-IND-002"; title_en="VFD Motor Speed Control System"; category="Industrial Automation"},
    @{project_code="TXH-IND-003"; title_en="SCADA Monitoring System"; category="Industrial Automation"},
    @{project_code="TXH-IND-004"; title_en="HMI Operator Interface Panel"; category="Industrial Automation"},
    @{project_code="TXH-IND-005"; title_en="Industrial Robotics Cell"; category="Industrial Automation"}
)

Write-Host "============================================="
Write-Host "TECHSPHERE DOCUMENTATION PUBLISHING SYSTEM"
Write-Host "============================================="
Write-Host "Total projects to process: $($allProjects.Count)"
Write-Host "Start time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

# Process all projects
foreach ($project in $allProjects) {
    $projectCode = $project.project_code
    $titleEn = $project.title_en
    $category = $project.category

    $totalProcessed++
    Write-Host "[$totalProcessed/$($allProjects.Count)] Processing $projectCode - $titleEn..."

    # Generate documentation
    $documentation = Generate-Documentation -projectCode $projectCode -titleEn $titleEn -category $category

    # Publish documentation
    $result = Publish-Documentation -projectCode $projectCode -documentation $documentation -adminToken $adminToken

    if ($result.success) {
        $successCount++
        $successfulProjects += $projectCode
        if ($result.message -like "*Conflict*") {
            $conflictCount++
            $skippedProjects += $projectCode
            Write-Host "  [SKIP] $($result.message)"
        } else {
            Write-Host "  [OK] $($result.message)"
        }
    } else {
        $failureCount++
        $failedProjects += @{project_code=$projectCode; error=$result.message}
        Write-Host "  [FAIL] $($result.message)"
    }

    # Rate limiting delay
    Start-Sleep -Milliseconds 400
}

# Print final summary
Write-Host ""
Write-Host "============================================="
Write-Host "FINAL SUMMARY"
Write-Host "============================================="
Write-Host "Total projects: $totalProcessed"
Write-Host "Successfully processed: $successCount"
Write-Host "  (newly published): $($successCount - $conflictCount)"
Write-Host "  (already existed - skipped): $conflictCount"
Write-Host "Failed: $failureCount"
$successRate = if ($totalProcessed -gt 0) { [Math]::Round($successCount / $totalProcessed * 100, 2) } else { 0 }
Write-Host "Success rate: $successRate%"
Write-Host "End time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

if ($failedProjects.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed projects ($($failedProjects.Count)):"
    foreach ($fp in $failedProjects) {
        Write-Host "  - $($fp.project_code): $($fp.error)"
    }
}

if ($skippedProjects.Count -gt 0) {
    Write-Host ""
    Write-Host "Skipped (already documented) projects ($($skippedProjects.Count)):"
    foreach ($sp in $skippedProjects) {
        Write-Host "  - $sp"
    }
}

Write-Host ""
Write-Host "Done!"
