import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

doc = docx.Document()

# Margins
for section in doc.sections:
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.7)
    section.right_margin = Inches(0.7)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def add_header(text, level=1):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(4)
    for run in h.runs:
        run.font.name = 'Calibri'
        if level == 1:
            run.font.size = Pt(17)
            run.font.bold = True
            run.font.color.rgb = RGBColor(16, 44, 87)
        elif level == 2:
            run.font.size = Pt(13)
            run.font.bold = True
            run.font.color.rgb = RGBColor(30, 81, 123)
        elif level == 3:
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGBColor(53, 95, 142)
    return h

def create_table(headers, data, col_widths=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        set_cell_background(hdr_cells[i], "102C57")
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = 'Calibri'
            run.font.size = Pt(9.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            
    for row_data in data:
        row_cells = table.add_row().cells
        for i, val in enumerate(row_data):
            row_cells[i].text = str(val)
            p = row_cells[i].paragraphs[0]
            for run in p.runs:
                run.font.name = 'Calibri'
                run.font.size = Pt(8.5)
                
    if col_widths:
        for row in table.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = Inches(w)
                
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    return table

# Document Title
title_p = doc.add_paragraph()
title_p.paragraph_format.space_before = Pt(0)
title_p.paragraph_format.space_after = Pt(2)
title_run = title_p.add_run("MBR & FERC e-Tariff Portal: Human Guide, Test Scenarios & QA Test Cases")
title_run.font.name = 'Calibri'
title_run.font.size = Pt(22)
title_run.font.bold = True
title_run.font.color.rgb = RGBColor(16, 44, 87)

meta_p = doc.add_paragraph()
meta_p.paragraph_format.space_after = Pt(14)
meta_run = meta_p.add_run("Executive Functional Guide & QA Test Specification  |  Includes: Plain-English System Overview, Business Rules, How Users Interact, Exact UI Scenarios, Test Cases & Fresh Test Datasets")
meta_run.font.name = 'Calibri'
meta_run.font.size = Pt(10)
meta_run.font.italic = True
meta_run.font.color.rgb = RGBColor(90, 90, 90)

# Section 1: Human-to-Human Explanation
add_header("1. Plain-English Project Guide: What Is This Application & How Does It Work?", level=1)

p1 = doc.add_paragraph()
p1.add_run("Imagine you own or manage clean energy power plants—such as large solar farms in California or wind parks in Texas. In the United States, electricity wholesale markets are strictly overseen by the federal government through ").font.size = Pt(10.5)
r_ferc = p1.add_run("FERC (Federal Energy Regulatory Commission)")
r_ferc.bold = True
p1.add_run(". Before your power plant is allowed to sell wholesale electricity at competitive market rates rather than government-fixed rates, you must prove to the government that your company does not monopolize the power grid or manipulate electricity prices.\n\n"
           "This application is the ").font.size = Pt(10.5)
r_portal = p1.add_run("FERC Market-Based Rate (MBR) and e-Tariff Compliance Management Portal")
r_portal.bold = True
p1.add_run(". It is the central digital ledger where clean energy corporations track all their regulatory filings, generator assets, affiliate power contracts, vertical infrastructure, market studies, and government compliance approvals.")

add_header("How a Real User Experiences the System Day-to-Day", level=2)
doc.add_paragraph(
    "1. Multi-Company Switcher (Top Navbar):\n"
    "   Energy executives manage multiple subsidiaries under one holding account. For example, a company may operate 'Venus Clean Energy Corp' (operating solar plants in California) and 'ForgeByte Solar Ventures LLC' (operating utility assets in the East Coast). The user simply selects a company from the switcher, and the entire portal immediately adjusts its numbers, assets, and regulatory documents to match that specific subsidiary.\n\n"
    "2. Tracking the Physical Power Plants (Assets Screen):\n"
    "   Companies register every solar field, battery storage facility, and wind turbine. They record official EIA plant codes, generator unit IDs, nameplate capacity in megawatts (MW), and grid balancing authorities (like CAISO or PJM).\n\n"
    "3. The 11 Regulatory Compliance Screens (Screens Dropdown):\n"
    "   To stay legally licensed, companies maintain 11 distinct compliance records required by FERC:\n"
    "   • Authorizations: Official legal permission dockets granted by the government.\n"
    "   • Category Status: Classification under federal rules (Category 1 = small/no market power; Category 2 = subject to regular market reviews).\n"
    "   • Mitigations: Formal promises and offer price caps to prevent market power abuse.\n"
    "   • Self Limitations: Voluntary limits on how much power the company can sell in specific regions.\n"
    "   • Operating Reserves: Permission to sell fast-response backup power to regional grid operators.\n"
    "   • Entities to Entities: Disclosures of corporate sister companies and parent affiliates.\n"
    "   • Entities to Generator Assets: Exact ownership percentages in power plants.\n"
    "   • Entities to PPAs: Power Purchase Agreements (contracts selling power to public utilities).\n"
    "   • Entities to Vertical Assets: Non-generation infrastructure like high-voltage substations and transmission lines.\n"
    "   • Indicative PSS & MSS: Complex mathematical studies analyzing power supply and market concentration share.\n\n"
    "4. FERC Filing Package Builder (Include in Filing):\n"
    "   Every record has an 'Include in Filing' checkbox. When a regulatory report is due to the government, compliance officers select the approved records, review the batch, and generate the official filing XML."
)

# Section 2: Global Business Rules
add_header("2. Core Business Rules & Validation Constraints", level=1)
doc.add_paragraph(
    "• Isolation Rule: Data belonging to Company 1 (Venus Energy) and Company 2 (ForgeByte Solar) must remain completely segregated.\n"
    "• Date Integrity: FERC Effective Date defaults to 01/01/1960 if left blank. End Date must be greater than or equal to Effective Date.\n"
    "• Updating Records: When updating an existing record, the Reference ID is mandatory and must correspond to an active filing ID.\n"
    "• Soft Deletion Protection: Deleting a record flags it as inactive; it is never permanently destroyed from the audit trail without confirmation.\n"
    "• Balancing Authority Standards: Location codes must match recognized 3-5 character regional grid codes (e.g., CAISO, PJM, MISO, ERCOT, SPP, NYISO, ISONE)."
)

# Section 3: Core Administrative Scenarios
add_header("3. Administrative Scenarios & Test Cases", level=1)

add_header("Scenario 1: Company Switching & Header Synchronization", level=2)
doc.add_paragraph("Human Story: The compliance manager is reviewing Venus Energy in California and needs to switch to ForgeByte Solar in Pennsylvania. The portal must update the corporate title and reload the entire workspace immediately.")

s1_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Steps", "Expected Result"]
s1_data = [
    ["TC-ADM-01", "Verify Default Company", "User: puttuguna@gmail.com", "1. Open http://localhost:4200\n2. Observe top header badge", "Header displays 'Venus Clean Energy Corp' with Company ID 'C100001'."],
    ["TC-ADM-02", "Switch Company Context", "Target: ForgeByte Solar Ventures LLC", "1. Click company switcher row/dropdown\n2. Select 'ForgeByte Solar Ventures LLC (C100002)'", "Header instantly changes to 'ForgeByte Solar Ventures LLC (C100002)', and all tables reload with ForgeByte records."],
    ["TC-ADM-03", "Navigate 'Screens' Dropdown", "Navbar 'Screens' Menu", "1. Click 'Screens' dropdown in top navbar\n2. Inspect menu items", "Dropdown opens displaying all 11 MBR screens with responsive navigation."]
]
create_table(s1_headers, s1_data, [1.0, 1.2, 1.4, 2.0, 1.6])

add_header("Scenario 2: User Team Management (/user)", level=2)
doc.add_paragraph("Human Story: The executive hires a new compliance officer and needs to give them access to Venus Energy records, edit their privileges later, or remove them when they leave.")

s2_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Steps", "Expected Result"]
s2_data = [
    ["TC-USR-01", "Add New Compliance User", "Name: Amanda Reynolds\nEmail: amanda.reynolds@venusenergy.com\nRole: Company User (GID 3)", "1. Navigate to /user\n2. Click '+ Add User'\n3. Fill in Amanda's name, email, role\n4. Click 'Save'", "Toast confirms success. Amanda Reynolds appears in the active team list with 'Company User' role."],
    ["TC-USR-02", "Edit Role Privileges", "Target: Amanda Reynolds\nNew Role: Read Only User", "1. Click Edit icon on Amanda's row\n2. Change role dropdown to 'Read Only User'\n3. Click 'Update'", "Modal updates cleanly. Table reflects 'Read Only User' role."],
    ["TC-USR-03", "Remove User Access", "Target: Amanda Reynolds", "1. Click Delete icon on Amanda's row\n2. Confirm in pop-up dialog", "Amanda is removed from active users. Database records soft delete."]
]
create_table(s2_headers, s2_data, [1.0, 1.2, 1.4, 2.0, 1.6])

add_header("Scenario 3: Generation Assets Management (/assets)", level=2)
doc.add_paragraph("Human Story: A new clean energy facility begins operations. The operations engineer logs the facility's official capacity, plant code, and regional grid interconnection.")

s3_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Steps", "Expected Result"]
s3_data = [
    ["TC-AST-01", "Register New Power Plant", "Name: High Sierra Wind Energy Center\nCode: WIND-HS-2026\nType: Wind Turbine\nCapacity: 160.0 MW\nBAA: CAISO\nEIA Plant: 62410", "1. Navigate to /assets\n2. Click '+ Add Asset'\n3. Fill name, 160.0 MW, EIA 62410\n4. Click 'Save Asset'", "Asset is registered. Table displays 'High Sierra Wind Energy Center', '160.0 MW', and EIA code 62410."],
    ["TC-AST-02", "Edit Plant Capacity Pre-population", "Target: High Sierra Wind\nNew Capacity: 175.0 MW", "1. Click Edit icon on the row\n2. Verify existing fields pre-fill\n3. Update capacity to 175.0 MW\n4. Save", "Pre-population works. Table updates to display '175.0 MW'."],
    ["TC-AST-03", "Decommission / Delete Asset", "Target: High Sierra Wind", "1. Click Delete icon\n2. Confirm delete alert", "Asset is removed from table and database."]
]
create_table(s3_headers, s3_data, [1.0, 1.2, 1.4, 2.0, 1.6])

# Section 4: All 11 Screens in Human Language
add_header("4. All 11 FERC Compliance Screens: Scenarios & Test Cases", level=1)

screens_human = [
    {
        "num": "01", "name": "MBR Authorizations", "route": "/admin/entities/authorization",
        "story": "Human Story: The regulatory lawyer receives the signed FERC order giving permission to sell power and logs the official docket number and effective date.",
        "rules": "• Docket must follow federal format (e.g., ERxx-xxxx-xxx).\n• Authorization Effective Date defaults to 01/01/1960 if empty.",
        "cases": [
            ["TC-AUTH-01", "Add Authorization", "Docket: ER26-8801-000\nDate: 05/01/2026\nType: New", "1. Click '+ Add'\n2. Fill Docket and Date\n3. Click 'Add'", "Authorization saved. Appears in table with docket 'ER26-8801-000'."],
            ["TC-AUTH-02", "Edit Pre-population", "Target: ER26-8801-000\nNew Docket: ER26-8801-001\nType: Update\nRef ID: 1001", "1. Click Edit icon\n2. Verify docket pre-fills\n3. Change to ER26-8801-001\n4. Save", "Modal pre-fills cleanly. Table updates to 'ER26-8801-001'."],
            ["TC-AUTH-03", "Delete Authorization", "Target: ER26-8801-001", "1. Click Delete icon\n2. Confirm alert", "Authorization removed from active table."]
        ]
    },
    {
        "num": "02", "name": "Category Status", "route": "/admin/entities/category-status",
        "story": "Human Story: In each transmission region, the utility classifies whether it qualifies as a small non-market power seller (Category 1) or a larger utility (Category 2).",
        "rules": "• Region must be one of 6 FERC regions: CE, NE, NW, SE, SPP, SW.\n• Category status must be 'Category 1' or 'Category 2'.",
        "cases": [
            ["TC-CAT-01", "Add Category Status", "Region: NW (Northwest)\nCategory: Category 1\nDocket: ER26-9201-000\nDate: 04/01/2026", "1. Click '+ Add'\n2. Select Region 'NW' & 'Category 1'\n3. Save", "Record created. Table displays 'Northwest', 'Category 1', and date '04/01/2026'."],
            ["TC-CAT-02", "Edit Category Dropdown", "Target: NW Category 1\nNew: Category 2", "1. Click Edit icon\n2. Verify Region NW pre-selected in dropdown\n3. Change to 'Category 2'\n4. Save", "Dropdown pre-fills accurately. Category updates to Category 2 in table."],
            ["TC-CAT-03", "Delete Category Record", "Target: NW Category 2", "1. Click Delete icon\n2. Confirm dialog", "Record removed from grid."]
        ]
    },
    {
        "num": "03", "name": "Mitigations", "route": "/admin/entities/mitigations",
        "story": "Human Story: To reassure regulators that energy prices will remain fair during hot summer peaks, the company enters an agreed offer price cap narrative.",
        "rules": "• Balancing Authority code cannot exceed 5 characters.\n• Narrative must clearly explain the mitigation conditions.",
        "cases": [
            ["TC-MIT-01", "Add Mitigation Narrative", "BAA: PJM\nNarrative: PJM market monitor structural mitigation caps applied.\nEffective: 06/01/2026\nEnd: 12/31/2030", "1. Click '+ Add'\n2. Select PJM\n3. Enter narrative text and dates\n4. Save", "Mitigation plan created. Table displays PJM and narrative snippet."],
            ["TC-MIT-02", "Edit Mitigation Text", "Target: PJM Mitigation\nAdd: 'Amended per Order 861'", "1. Click Edit icon\n2. Verify BAA PJM and full narrative load\n3. Edit text\n4. Save", "Full text is editable and updates successfully in table."],
            ["TC-MIT-03", "Delete Mitigation", "Target: PJM Mitigation", "1. Click Delete icon\n2. Confirm alert", "Record deleted from grid."]
        ]
    },
    {
        "num": "04", "name": "Self Limitations", "route": "/admin/entities/self-limitations",
        "story": "Human Story: The company voluntarily limits how much generation it sells in the Midwest (MISO) to prevent grid congestion.",
        "rules": "• Region code must match FERC standards.\n• Crucial Check: In Edit mode, Region and BAA dropdowns must never be empty.",
        "cases": [
            ["TC-SL-01", "Add Self Limitation", "Region: CE (Central)\nBAA: MISO\nEffective: 01/01/2026\nEnd: 12/31/2028\nType: New", "1. Click '+ Add'\n2. Select Region Central\n3. Select BAA MISO\n4. Save", "Record saved. Table displays 'Central', 'MISO', and dates."],
            ["TC-SL-02", "Verify Edit Pre-population (Crucial)", "Target: Central / MISO record", "1. Click Edit icon on Central / MISO row\n2. Inspect Region & BAA dropdowns", "VERIFY: Region dropdown shows 'Central' and BAA shows 'MISO'. Neither field is blank."],
            ["TC-SL-03", "Update End Date", "New End Date: 12/31/2029", "1. While in Edit modal, modify End Date\n2. Click 'Update'", "Record updates cleanly without validation errors."],
            ["TC-SL-04", "Delete Self Limitation", "Target: Central / MISO record", "1. Click Delete icon\n2. Confirm alert", "Record removed from table and database."]
        ]
    },
    {
        "num": "05", "name": "Operating Reserves", "route": "/admin/entities/operating-reserves",
        "story": "Human Story: Fast-acting battery power can spin up in seconds when the grid stumbles. The company registers its authority to sell these spinning operating reserves.",
        "rules": "• Balancing authority must match regional transmission organization.\n• Dates must be valid ISO date formats.",
        "cases": [
            ["TC-OR-01", "Add Operating Reserve", "BAA: SPP\nEffective: 02/01/2026\nEnd: 02/01/2031\nType: New", "1. Click '+ Add'\n2. Select SPP\n3. Fill dates\n4. Save", "Operating reserve saved. Appears in table with BAA 'SPP'."],
            ["TC-OR-02", "Edit Operating Reserve", "Target: SPP Record\nNew End Date: 02/01/2032", "1. Click Edit icon\n2. Verify SPP loads in dropdown\n3. Change date\n4. Save", "Updated end date is reflected in grid."],
            ["TC-OR-03", "Delete Operating Reserve", "Target: SPP Record", "1. Click Delete icon\n2. Confirm delete", "Row is removed from table."]
        ]
    },
    {
        "num": "06", "name": "Entities to Entities", "route": "/admin/entities/entities-to-entities",
        "story": "Human Story: Regulators require energy companies to disclose all corporate brothers, sisters, and affiliates so the government knows who owns whom.",
        "rules": "• Reportable entity ID type must be CID, LEI, or GID.\n• Blanket authorization docket is required for utility relationships.",
        "cases": [
            ["TC-EtoE-01", "Add Entity Relationship", "ID Type: CID\nEntity ID: C100002\nDocket: ER26-4400-000\nUtility ID: UTIL-W-01\nStart: 01/01/2026", "1. Click '+ Add'\n2. Select CID, enter C100002\n3. Fill docket & utility ID\n4. Save", "Affiliate relationship added. Row rendered with CID badge and C100002."],
            ["TC-EtoE-02", "Edit Entity Relationship", "Target: C100002\nNew Docket: ER26-4400-001", "1. Click Edit icon\n2. Verify CID and C100002 pre-fill\n3. Update docket\n4. Save", "Updated docket reflected in table."],
            ["TC-EtoE-03", "Delete Entity Relationship", "Target: C100002 relationship", "1. Click Delete icon\n2. Confirm delete", "Relationship deleted from list."]
        ]
    },
    {
        "num": "07", "name": "Entities to Generator Assets", "route": "/admin/entities/entities-to-generator-assets",
        "story": "Human Story: The company maps its corporate entity directly to its battery storage power plant, proving that Venus Energy owns 100% of the facility.",
        "rules": "• Plant code must match official EIA plant code.\n• Capacity must be numeric rating in MW.\n• Delete action must trigger backend API call and remove record.",
        "cases": [
            ["TC-EtoGen-01", "Add Gen Asset Link", "Asset: BESS-SOLAR-02\nType: Solar/Storage\nEIA Plant: 63100\nCapacity: 75.0 MW\nBAA: CAISO", "1. Click '+ Add'\n2. Fill asset code, EIA code, capacity\n3. Select CAISO\n4. Save", "Generator asset relationship added with 75.0 MW capacity."],
            ["TC-EtoGen-02", "Edit Gen Asset Link", "Target: BESS-SOLAR-02\nNew Capacity: 80.0 MW", "1. Click Edit icon\n2. Verify EIA plant 63100 and CAISO pre-fill\n3. Edit capacity\n4. Save", "Pre-population verified. Updated capacity displayed in grid."],
            ["TC-EtoGen-03", "Delete Gen Asset Link (Crucial)", "Target: BESS-SOLAR-02", "1. Click Delete icon\n2. Confirm delete dialog", "VERIFY: System sends DELETE request to backend and removes record from table."]
        ]
    },
    {
        "num": "08", "name": "Entities to PPAs", "route": "/admin/entities/entities-to-ppas",
        "story": "Human Story: The company signs a 20-year Power Purchase Agreement (PPA) to sell 110 MW of green electricity to an electric utility at a contracted price.",
        "rules": "• PPA Agreement ID must be unique alphanumeric identifier.\n• Source and Sink BAA must be specified for wheeling power.",
        "cases": [
            ["TC-PPA-01", "Add Power Purchase Agreement", "PPA ID: PPA-WEST-SOLAR-26\nCounterparty: EDISON-UTILITY-CORP\nAmount: 110.0 MW\nSource: CAISO\nSink: CAISO\nDates: 06/01/2026 to 05/31/2046", "1. Click '+ Add'\n2. Fill PPA ID, counterparty, MW\n3. Select source/sink CAISO\n4. Save", "PPA agreement created. Table displays 110.0 MW and counterparty name."],
            ["TC-PPA-02", "Copy PPA Agreement", "Target: PPA-WEST-SOLAR-26", "1. Click Copy icon on row\n2. Modify PPA ID to PPA-WEST-SOLAR-26-B\n3. Save", "Duplicate PPA created with 'New' status and unique agreement ID."],
            ["TC-PPA-03", "Delete PPA Agreement", "Target: PPA-WEST-SOLAR-26-B", "1. Click Delete icon\n2. Confirm alert dialog", "PPA record removed from table."]
        ]
    },
    {
        "num": "09", "name": "Entities to Vertical Assets", "route": "/admin/entities/entities-to-vertical-assets",
        "story": "Human Story: The company discloses that it also owns a 500kV high-voltage substation that connects its solar farm to the interstate power grid.",
        "rules": "• Vertical asset covers non-generation facilities (transmission lines, gas pipelines, substations).\n• Description of facility is required.",
        "cases": [
            ["TC-EtoVA-01", "Add Vertical Asset Link", "Type: Electric Transmission\nDescription: 500kV Intertie Transmission Spur\nBAA: CAISO\nStart Date: 01/01/2026", "1. Click '+ Add'\n2. Select Electric Transmission\n3. Enter 500kV description\n4. Select CAISO\n5. Save", "Vertical asset linked. Displays Transmission type and description in table."],
            ["TC-EtoVA-02", "Edit Vertical Asset", "Target: 500kV Intertie\nAdd to Description: 'Phase 1'", "1. Click Edit icon\n2. Verify description and BAA CAISO load\n3. Update text\n4. Save", "Updated description displays in grid."],
            ["TC-EtoVA-03", "Delete Vertical Asset", "Target: 500kV Intertie", "1. Click Delete icon\n2. Confirm in alert", "Record deleted from table."]
        ]
    },
    {
        "num": "10", "name": "Indicative PSS (Power Supply Studies)", "route": "/admin/entities/indicative-pss",
        "story": "Human Story: An economic consultant calculates whether the company has excess power that could manipulate prices. The regulatory team records the study and its numerical findings.",
        "rules": "• Scenario type must be Base Case (1) or Sensitivity Analysis (2).\n• Study parameters must be viewable and editable via the parameter sub-modal.",
        "cases": [
            ["TC-IPSS-01", "Create Indicative PSS Study", "Study Type: New\nEnd Year: 2026\nBAA: PJM\nScenario: Base Case (Value 1)", "1. Click '+ Add'\n2. Fill Year 2026, select PJM\n3. Select Scenario 'Base Case'\n4. Save", "Study created successfully. Appears in table with '( 0 )' parameter link."],
            ["TC-IPSS-02", "Manage Study Parameters Modal", "Study: PJM 2026 Base Case\nParam: Uncommitted Capacity = 650 MW\nReference: FERC Form 714 Exhibit B", "1. Click '( 0 )' link on row\n2. Study Parameters modal opens\n3. Enter 650 MW & reference\n4. Click 'Save'", "Parameters saved. Modal closes. Link updates to '( 1 )'."],
            ["TC-IPSS-03", "Edit PSS Study Pre-population", "Target: PJM 2026 Study", "1. Click Edit icon on study row\n2. Check Scenario Type dropdown", "VERIFY: Scenario Type dropdown shows 'Base Case' properly selected (not blank)."],
            ["TC-IPSS-04", "Delete PSS Study", "Target: PJM 2026 Study", "1. Click Delete icon\n2. Confirm delete", "Study and associated parameter records deleted."]
        ]
    },
    {
        "num": "11", "name": "Indicative MSS (Market Screen Studies)", "route": "/admin/entities/indicative-mss",
        "story": "Human Story: The company records seasonal market screen studies across Winter, Spring, Summer, and Fall to prove it does not exceed the 20% market share threshold.",
        "rules": "• Study parameters require seasonal breakdown (Winter, Spring, Summer, Fall).\n• Scenario Type dropdown must correctly bind in Edit modal.",
        "cases": [
            ["TC-IMSS-01", "Create Indicative MSS Study", "Study Type: New\nEnd Year: 2026\nBAA: CAISO\nScenario: Sensitivity Analysis (Value 2)", "1. Click '+ Add'\n2. Fill Year 2026, select CAISO\n3. Select Scenario 'Sensitivity Analysis'\n4. Save", "Study created. Appears in table with '( 0 )' parameter count."],
            ["TC-IMSS-02", "Manage Seasonal Parameters Modal", "Season: Summer (3)\nParam: Summer Peak Net Capacity = 1450 MW\nRef: CAISO OASIS Summer Assessment", "1. Click '( 0 )' link on study\n2. Study Parameters modal opens\n3. Enter Summer capacity\n4. Click 'Save'", "Seasonal parameters saved. Parameter count on study row updates to '( 1 )'."],
            ["TC-IMSS-03", "Edit MSS Study Pre-population", "Target: CAISO 2026 Study", "1. Click Edit icon on study row\n2. Check Scenario Type dropdown", "VERIFY: Scenario Type dropdown shows 'Sensitivity Analysis' selected (not blank)."],
            ["TC-IMSS-04", "Delete MSS Study", "Target: CAISO 2026 Study", "1. Click Delete icon on study\n2. Confirm delete dialog", "Study and all seasonal parameters deleted."]
        ]
    }
]

for s in screens_human:
    add_header(f"Screen {s['num']}: {s['name']} ({s['route']})", level=2)
    doc.add_paragraph(f"{s['story']}\n\nFederal Rules & Constraints:\n{s['rules']}")
    table_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Steps", "Expected Result"]
    create_table(table_headers, s['cases'], [1.0, 1.2, 1.4, 2.0, 1.6])

# Section 5: FERC Filings
add_header("5. FERC Filing Package Builder & Flags", level=1)
doc.add_paragraph(
    "Human Story: When an official filing deadline arrives, the compliance team reviews all 11 screens. Each approved record has its 'Include in Filing' checkbox checked. The system bundles all checked records across the screens into a formal e-Tariff submission package.\n\n"
    "Business Rule: Toggling the checkbox updates the state in the database immediately without page refresh."
)

flg_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Steps", "Expected Result"]
flg_data = [
    ["TC-FLG-01", "Toggle Single Record Filing Checkbox", "Any saved authorization record", "1. Click checkbox in first column of row\n2. Observe checkbox state", "Checkbox toggles to checked. Backend saves flag state immediately without page refresh."],
    ["TC-FLG-02", "Select All Records Checkbox", "Table with multiple records", "1. Click 'All' header checkbox", "All rows in the table become checked. System updates filing selection count."],
    ["TC-FLG-03", "Filing Validation Summary", "Filings navigation (/filings)", "1. Navigate to /filings\n2. Inspect filing candidate counter", "Candidate count reflects all checked records across the 11 MBR screens."]
]
create_table(flg_headers, flg_data, [1.0, 1.2, 1.4, 2.0, 1.6])

output_path = r"c:\Users\gunasekhar.p\Music\venus_Tech_forge_byte\MBR_PROJECT_GUIDE_AND_TEST_SCENARIOS.docx"
doc.save(output_path)
print(f"Document successfully created at: {output_path}")
