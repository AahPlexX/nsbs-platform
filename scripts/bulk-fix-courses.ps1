$courses = @(
    @{id="brand-strategy-positioning-expert-bspe"; title="Brand Strategy & Positioning Expert"; subtitle="Strategic brand positioning and market differentiation"; category="Marketing & Brand Management"},
    @{id="change-management-specialist-cms"; title="Change Management Specialist"; subtitle="Organizational transformation and change leadership"; category="Organizational Development"},
    @{id="cloud-infrastructure-architect-cia"; title="Cloud Infrastructure Architect"; subtitle="Enterprise cloud architecture and infrastructure design"; category="Cloud Computing"},
    @{id="content-marketing-strategy-consultant-cmsc"; title="Content Marketing Strategy Consultant"; subtitle="Strategic content marketing and brand storytelling"; category="Digital Marketing"},
    @{id="corporate-governance-compliance-manager-cgcm"; title="Corporate Governance & Compliance Manager"; subtitle="Corporate governance and regulatory compliance"; category="Corporate Governance"},
    @{id="crisis-management-specialist-cms"; title="Crisis Management Specialist"; subtitle="Emergency response and business continuity planning"; category="Risk Management"},
    @{id="customer-experience-journey-architect-cxja"; title="Customer Experience Journey Architect"; subtitle="Customer experience design and journey optimization"; category="Customer Experience"},
    @{id="cybersecurity-threat-intelligence-analyst-ctia"; title="Cybersecurity Threat Intelligence Analyst"; subtitle="Threat intelligence and cybersecurity analysis"; category="Cybersecurity"},
    @{id="data-analytics-for-business-intelligence-dabip"; title="Data Analytics for Business Intelligence Professional"; subtitle="Advanced data analytics and business intelligence"; category="Data Analytics"},
    @{id="digital-marketing-ecosystem-specialist-dmes"; title="Digital Marketing Ecosystem Specialist"; subtitle="Comprehensive digital marketing strategy and execution"; category="Digital Marketing"},
    @{id="digital-transformation-leader-dtl"; title="Digital Transformation Leader"; subtitle="Leading organizational digital transformation"; category="Digital Strategy"},
    @{id="enterprise-architecture-designer-ead"; title="Enterprise Architecture Designer"; subtitle="Enterprise architecture design and technology strategy"; category="Enterprise Architecture"},
    @{id="environmental-sustainability-manager-esm"; title="Environmental Sustainability Manager"; subtitle="Sustainability strategy and environmental management"; category="Sustainability"},
    @{id="ethical-compliance-expert-ece"; title="Ethical Compliance Expert"; subtitle="Business ethics and regulatory compliance"; category="Ethics & Compliance"},
    @{id="financial-forecasting-modeling-professional-ffmp"; title="Financial Forecasting & Modeling Professional"; subtitle="Advanced financial modeling and forecasting"; category="Finance"},
    @{id="financial-technology-innovation-manager-ftim"; title="Financial Technology Innovation Manager"; subtitle="FinTech innovation and financial technology management"; category="Financial Technology"},
    @{id="healthcare-quality-improvement-manager-hqim"; title="Healthcare Quality Improvement Manager"; subtitle="Healthcare quality management and improvement"; category="Healthcare Management"},
    @{id="human-capital-analytics-professional-hcap"; title="Human Capital Analytics Professional"; subtitle="HR analytics and workforce data analysis"; category="Human Resources"},
    @{id="innovation-management-facilitator-imf"; title="Innovation Management Facilitator"; subtitle="Innovation strategy and organizational innovation"; category="Innovation Management"},
    @{id="international-business-strategy-specialist-ibss"; title="International Business Strategy Specialist"; subtitle="Global business strategy and international expansion"; category="International Business"},
    @{id="market-research-analysis-fellow-mraf"; title="Market Research Analysis Fellow"; subtitle="Market research methodology and consumer insights"; category="Market Research"},
    @{id="operational-efficiency-specialist-oes"; title="Operational Efficiency Specialist"; subtitle="Process optimization and operational excellence"; category="Operations Management"},
    @{id="organizational-development-consultant-odc"; title="Organizational Development Consultant"; subtitle="Organizational development and culture transformation"; category="Organizational Development"},
    @{id="product-lifecycle-management-specialist-plms"; title="Product Lifecycle Management Specialist"; subtitle="Product development and lifecycle management"; category="Product Management"},
    @{id="project-portfolio-manager-ppm"; title="Project Portfolio Manager"; subtitle="Strategic project portfolio management"; category="Project Management"},
    @{id="quality-assurance-manager-qam"; title="Quality Assurance Manager"; subtitle="Quality management and process improvement"; category="Quality Management"},
    @{id="renewable-energy-systems-engineer-rese"; title="Renewable Energy Systems Engineer"; subtitle="Renewable energy technology and sustainability"; category="Energy & Environment"},
    @{id="retail-management-professional-rmp"; title="Retail Management Professional"; subtitle="Retail operations and customer experience management"; category="Retail Management"},
    @{id="sales-process-optimization-engineer-spoe"; title="Sales Process Optimization Engineer"; subtitle="Sales process improvement and optimization"; category="Sales Management"},
    @{id="social-media-marketing-strategist-smms"; title="Social Media Marketing Strategist"; subtitle="Social media strategy and digital engagement"; category="Social Media Marketing"},
    @{id="strategic-business-planning-analyst-sbpa"; title="Strategic Business Planning Analyst"; subtitle="Strategic planning and business analysis"; category="Strategic Planning"},
    @{id="strategic-planning-architect"; title="Strategic Planning Architect"; subtitle="Enterprise strategic planning and execution"; category="Strategic Planning"},
    @{id="supply-chain-optimization-practitioner-scop"; title="Supply Chain Optimization Practitioner"; subtitle="Supply chain optimization and logistics management"; category="Supply Chain Management"},
    @{id="user-experience-research-specialist-uxrs"; title="User Experience Research Specialist"; subtitle="UX research and user-centered design"; category="User Experience"}
)

foreach ($course in $courses) {
    $metaContent = @"
{
  "id": "$($course.id)",
  "title": "$($course.title)",
  "subtitle": "$($course.subtitle)",
  "description": "Professional certification course in $($course.title.ToLower()) covering essential skills and knowledge for career advancement.",
  "price": 298,
  "currency": "USD",
  "language": "en",
  "category": "$($course.category)",
  "tags": [],
  "certification": {
    "name": "$($course.title) ($($course.id.Split('-')[-1].ToUpper()))",
    "authority": "The National Society of Business Sciences"
  },
  "learningOutcomes": [
    "Master core competencies in $($course.title.ToLower())",
    "Apply professional best practices",
    "Develop strategic thinking capabilities",
    "Implement effective solutions",
    "Lead successful initiatives"
  ]
}
"@
    
    $metaPath = "c:\Users\eastm\Desktop\nsbs0820\data\courses\$($course.id)\course\meta.json"
    Write-Host "Creating: $($course.id)" -ForegroundColor Yellow
    $metaContent | Out-File -FilePath $metaPath -Encoding UTF8
}

Write-Host "All courses fixed!" -ForegroundColor Green
