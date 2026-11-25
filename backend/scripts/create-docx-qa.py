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
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    for run in h.runs:
        run.font.name = 'Calibri'
        if level == 1:
            run.font.size = Pt(16)
            run.font.bold = True
            run.font.color.rgb = RGBColor(16, 44, 87) # Deep Navy
        elif level == 2:
            run.font.size = Pt(13)
            run.font.bold = True
            run.font.color.rgb = RGBColor(30, 81, 123)
        elif level == 3:
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGBColor(53, 95, 142)
    return h

# Document Title
title_p = doc.add_paragraph()
title_p.paragraph_format.space_before = Pt(0)
title_p.paragraph_format.space_after = Pt(2)
title_run = title_p.add_run("MBR & e-Tariff Compliance Portal - Full UI Test Scenarios & Test Cases")
title_run.font.name = 'Calibri'
title_run.font.size = Pt(20)
title_run.font.bold = True
title_run.font.color.rgb = RGBColor(16, 44, 87)

meta_p = doc.add_paragraph()
meta_p.paragraph_format.space_after = Pt(12)
meta_run = meta_p.add_run("QA Test Plan & Specification  |  Scope: Complete End-to-End UI  |  Includes: Business Rules, Validation Rules, Exact Test Steps, Expected Results & Fresh Test Data")
meta_run.font.name = 'Calibri'
meta_run.font.size = Pt(10)
meta_run.font.italic = True
meta_run.font.color.rgb = RGBColor(90, 90, 90)

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

# ----------------- SECTION 1: GLOBAL RULES & CONSTRAINTS -----------------
add_header("1. Global System Rules & Compliance Standards", level=1)
doc.add_paragraph(
    "1. Multi-Company Context: A user must only see and edit data belonging to their currently selected company (CID 1 or CID 2). Switching companies must immediately reload all grids.\n"
    "2. FERC Compliance Dates: Effective Date cannot be null; if left blank, system automatically defaults to 01/01/1960. End Date must be greater than or equal to Effective Date.\n"
    "3. Record Type Lifecycle: Records can have types 'New', 'Update', or 'Deactivate'. When 'Update' is selected, Reference ID is strictly mandatory and must match an existing FERC filing ID.\n"
    "4. Soft Deletion Policy: When a record is deleted, it is flagged as inactive (isActive = false). Deletion requires user confirmation in a pop-up dialog.\n"
    "5. Filing Flags: Every entity record has an 'Include in Filing' checkbox. Checking or unchecking immediately updates the filing candidate batch without page reload.\n"
    "6. Balancing Authority Format: Must strictly match official 3 to 5 letter FERC BAA codes (e.g. CAISO, PJM, MISO, ERCOT, SPP, NYISO, ISONE)."
)

# ----------------- SECTION 2: CORE MODULES TEST SCENARIOS -----------------
add_header("2. Core Administrative Modules: Test Scenarios & Test Cases", level=1)

# Scenario 1: Navigation & Company Switcher
add_header("Scenario 1: Multi-Company Context & Navigation Switcher", level=2)
doc.add_paragraph("Business Rule: When a user switches company from Company 1 to Company 2, the UI must update the company title badge and reload all grids with Company 2 data without session loss.")

s1_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Action / Test Steps", "Expected Result"]
s1_data = [
    ["TC-NAV-01", "Verify Default Company on Login", "User: puttuguna@gmail.com", "1. Open http://localhost:4200\n2. Observe top header badge", "Header displays 'Venus Clean Energy Corp' with Company ID 'C100001'."],
    ["TC-NAV-02", "Switch Company Context", "Target: ForgeByte Solar Ventures LLC", "1. Click company switcher row/dropdown\n2. Select 'ForgeByte Solar Ventures LLC (C100002)'", "Header immediately displays 'ForgeByte Solar Ventures LLC', badge updates to 'C100002', all sub-screens reload with CID 2 records."],
    ["TC-NAV-03", "Navigate via Top Navbar", "Screens Menu", "1. Click on 'Screens' dropdown in navbar\n2. Verify 11 MBR screens are listed", "Dropdown menu displays all 11 MBR screens with working navigation links."]
]
create_table(s1_headers, s1_data, [1.0, 1.2, 1.4, 2.0, 1.6])

# Scenario 2: User Management
add_header("Scenario 2: User Management (/user)", level=2)
doc.add_paragraph("Business Rule: Users can be added with specific roles (Site Admin, Account Admin, Company User, Read Only). Site Admins can edit/delete lower roles. Deleting a user requires confirmation.")

s2_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Action / Test Steps", "Expected Result"]
s2_data = [
    ["TC-USR-01", "Add New Company User", "Name: Ronald Vance\nEmail: ronald.vance@venusenergy.com\nRole: Company User (GID 3)\nPhone: 555-0144", "1. Click '+ Add User' button\n2. Enter fresh user details\n3. Select Company: Venus Clean Energy Corp\n4. Click 'Save'", "Toast shows 'User saved successfully'. Ronald Vance appears in user grid with role 'Company User'."],
    ["TC-USR-02", "Edit User Details", "Target: Ronald Vance\nNew Role: Read Only User (GID 4)", "1. Locate Ronald Vance in table\n2. Click Edit icon\n3. Change role to 'Read Only User'\n4. Click 'Update'", "Modal saves cleanly. Table reflects updated role 'Read Only User'."],
    ["TC-USR-03", "Delete User with Confirmation", "Target: Ronald Vance", "1. Click Delete icon for Ronald Vance\n2. Verify confirmation dialog appears\n3. Click 'Delete'", "User is removed from active user list. Soft delete recorded in DB."],
    ["TC-USR-04", "Mandatory Field Validation", "Empty Email and First Name", "1. Click '+ Add User'\n2. Leave fields blank\n3. Click 'Save'", "Validation error messages display under First Name and Email. Form submission is blocked."]
]
create_table(s2_headers, s2_data, [1.0, 1.2, 1.4, 2.0, 1.6])

# Scenario 3: Assets Management
add_header("Scenario 3: Generation Assets Management (/assets)", level=2)
doc.add_paragraph("Business Rule: Generation assets must include valid EIA plant codes, generator unit IDs, nameplate capacity in MW, and physical location balancing authority.")

s3_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Action / Test Steps", "Expected Result"]
s3_data = [
    ["TC-AST-01", "Create New Generation Asset", "Name: Apex Wind Farm 1\nCode: WIND-APX-01\nType: Wind Turbine\nCapacity: 180.5 MW\nBAA: CAISO\nEIA Plant: 62001\nEIA Gen: WTG-1", "1. Navigate to /assets\n2. Click '+ Add Asset'\n3. Fill in EIA plant code, BAA, capacity\n4. Click 'Save Asset'", "Asset is saved successfully. Grid displays 'Apex Wind Farm 1', '180.5 MW', and EIA code '62001'."],
    ["TC-AST-02", "Edit Generation Asset Pre-population", "Target: Apex Wind Farm 1\nNew Capacity: 195.0 MW", "1. Click Edit icon on Apex Wind Farm 1\n2. Verify all existing values pre-populate\n3. Change capacity to 195.0 MW\n4. Click 'Update'", "Form updates without errors. Grid displays updated capacity '195.0 MW'."],
    ["TC-AST-03", "Delete Generation Asset", "Target: Apex Wind Farm 1", "1. Click Delete icon on Apex Wind Farm 1\n2. Confirm delete dialog", "Asset is deleted from grid and DB. Success toast notification displayed."]
]
create_table(s3_headers, s3_data, [1.0, 1.2, 1.4, 2.0, 1.6])

# ----------------- SECTION 3: ALL 11 MBR SCREENS TEST SCENARIOS -----------------
add_header("3. All 11 FERC Market-Based Rate (MBR) Screens: Detailed Test Cases", level=1)

screens_detail = [
    {
        "num": "01", "name": "MBR Authorizations", "route": "/admin/entities/authorization",
        "rules": "• Docket number format must follow FERC filing standards (e.g. ERxx-xxxx-xxx).\n• Authorization Effective Date defaults to 01/01/1960 if empty.\n• Record Type 'Update' requires valid Reference ID.",
        "cases": [
            ["TC-AUTH-01", "Add Authorization", "Docket: ER26-8801-000\nAuth Date: 05/01/2026\nRecord Type: New", "1. Click '+ Add'\n2. Fill Docket and Date\n3. Click 'Add'", "Authorization created successfully. Appears in table with docket 'ER26-8801-000'."],
            ["TC-AUTH-02", "Edit Authorization", "New Docket: ER26-8801-001\nRecord Type: Update\nRef ID: 1001", "1. Click Edit on row\n2. Verify existing fields pre-fill\n3. Modify docket\n4. Click 'Update'", "Authorization updated cleanly. New docket reflected in table."],
            ["TC-AUTH-03", "Delete Authorization", "Target: ER26-8801-001", "1. Click Delete icon\n2. Confirm in alert dialog", "Authorization removed from table. Database reflects soft delete."]
        ]
    },
    {
        "num": "02", "name": "Category Status", "route": "/admin/entities/category-status",
        "rules": "• Region must be one of 6 FERC regions: CE, NE, NW, SE, SPP, SW.\n• Category status must be 'Category 1' or 'Category 2'.\n• Effective date is mandatory.",
        "cases": [
            ["TC-CAT-01", "Add Category Status", "Region: NW (Northwest)\nCategory: Category 1\nDocket: ER26-9201-000\nDate: 04/01/2026", "1. Click '+ Add'\n2. Select Region 'NW' & 'Category 1'\n3. Save", "Record created. Grid displays 'Northwest', 'Category 1', and date '04/01/2026'."],
            ["TC-CAT-02", "Edit Category Status", "Target: NW Category 1\nNew Category: Category 2", "1. Click Edit icon\n2. Verify Region NW pre-selected in dropdown\n3. Change Category to 'Category 2'\n4. Save", "Dropdown pre-fills correctly. Category updates to Category 2 in table."],
            ["TC-CAT-03", "Delete Category Status", "Target: NW Category 2", "1. Click Delete icon\n2. Confirm in dialog", "Record removed from grid and database."]
        ]
    },
    {
        "num": "03", "name": "Mitigations", "route": "/admin/entities/mitigations",
        "rules": "• Balancing Authority code cannot exceed 5 characters.\n• Mitigation narrative must explain the offer cap or market power mitigation conditions.\n• End date must be greater than or equal to Effective Date.",
        "cases": [
            ["TC-MIT-01", "Add Mitigation Narrative", "BAA: PJM\nNarrative: PJM market monitor structural mitigation caps applied.\nEffective: 06/01/2026\nEnd: 12/31/2030", "1. Click '+ Add'\n2. Select PJM\n3. Enter narrative text and dates\n4. Save", "Mitigation plan created. Table displays PJM and narrative preview."],
            ["TC-MIT-02", "Edit Mitigation Narrative", "Target: PJM Mitigation\nAdd: 'Amended per Order 861'", "1. Click Edit icon\n2. Verify BAA PJM and full narrative load\n3. Edit text\n4. Save", "Full text is editable and updates successfully in grid."],
            ["TC-MIT-03", "Delete Mitigation", "Target: PJM Mitigation", "1. Click Delete icon\n2. Confirm in alert", "Record deleted from table and database."]
        ]
    },
    {
        "num": "04", "name": "Self Limitations", "route": "/admin/entities/self-limitations",
        "rules": "• Region code must match FERC standards (Central, Northeast, Northwest, Southeast, SPP, Southwest).\n• Balancing authority dropdown must be populated from lookbaa.\n• Pre-population on Edit modal must never be blank for existing saved records.",
        "cases": [
            ["TC-SL-01", "Add Self Limitation", "Region: CE (Central)\nBAA: MISO\nEffective: 01/01/2026\nEnd: 12/31/2028\nType: New", "1. Click '+ Add'\n2. Select Region Central\n3. Select BAA MISO\n4. Save", "Self limitation saved. Grid displays 'Central', 'MISO', and dates."],
            ["TC-SL-02", "Verify Edit Pre-population (Crucial)", "Target: Central / MISO record", "1. Click Edit icon on Central / MISO row\n2. Inspect Region & BAA dropdowns", "VERIFY: Region dropdown shows 'Central' and BAA shows 'MISO'. Neither field is blank."],
            ["TC-SL-03", "Update Self Limitation", "New End Date: 12/31/2029\nRef ID: Automatically pre-filled", "1. While in Edit modal, change End Date\n2. Click 'Update'", "Record updates cleanly without validation errors."],
            ["TC-SL-04", "Delete Self Limitation", "Target: Central / MISO record", "1. Click Delete icon\n2. Confirm in dialog", "Record removed from table and database."]
        ]
    },
    {
        "num": "05", "name": "Operating Reserves", "route": "/admin/entities/operating-reserves",
        "rules": "• Operating reserve authorization must specify authorized BAA.\n• Dates must be valid ISO date formats.",
        "cases": [
            ["TC-OR-01", "Add Operating Reserve", "BAA: SPP\nEffective: 02/01/2026\nEnd: 02/01/2031\nType: New", "1. Click '+ Add'\n2. Select SPP\n3. Fill dates\n4. Save", "Operating reserve saved. Appears in table with BAA 'SPP'."],
            ["TC-OR-02", "Edit Operating Reserve", "Target: SPP Record\nNew End Date: 02/01/2032", "1. Click Edit icon\n2. Verify SPP loads in dropdown\n3. Change date\n4. Save", "Updated end date is reflected in grid."],
            ["TC-OR-03", "Delete Operating Reserve", "Target: SPP Record", "1. Click Delete icon\n2. Confirm delete", "API call executes and row is removed from table."]
        ]
    },
    {
        "num": "06", "name": "Entities to Entities", "route": "/admin/entities/entities-to-entities",
        "rules": "• Reportable entity ID type must be CID, LEI, or GID.\n• Blanket authorization docket is required for utility relationships.",
        "cases": [
            ["TC-EtoE-01", "Add Entity Relationship", "ID Type: CID\nEntity ID: C100002\nDocket: ER26-4400-000\nUtility ID: UTIL-W-01\nStart: 01/01/2026", "1. Click '+ Add'\n2. Select CID, enter C100002\n3. Fill docket & utility ID\n4. Save", "Affiliate relationship added. Row rendered with CID badge and C100002."],
            ["TC-EtoE-02", "Edit Entity Relationship", "Target: C100002\nNew Docket: ER26-4400-001", "1. Click Edit icon\n2. Verify CID and C100002 pre-fill\n3. Update docket\n4. Save", "Updated docket reflected in table."],
            ["TC-EtoE-03", "Delete Entity Relationship", "Target: C100002 relationship", "1. Click Delete icon\n2. Confirm delete", "Relationship deleted from list and DB."]
        ]
    },
    {
        "num": "07", "name": "Entities to Generator Assets", "route": "/admin/entities/entities-to-generator-assets",
        "rules": "• Plant code must match official EIA plant code.\n• Capacity must be numeric rating in MW.\n• Delete action must trigger backend API call and remove record.",
        "cases": [
            ["TC-EtoGen-01", "Add Gen Asset Link", "Asset: BESS-SOLAR-02\nType: Solar/Storage\nEIA Plant: 63100\nEIA Gen: B1\nCapacity: 75.0 MW\nBAA: CAISO", "1. Click '+ Add'\n2. Fill asset code, EIA code, capacity\n3. Select CAISO\n4. Save", "Generator asset relationship added with 75.0 MW capacity."],
            ["TC-EtoGen-02", "Edit Gen Asset Link", "Target: BESS-SOLAR-02\nNew Capacity: 80.0 MW", "1. Click Edit icon\n2. Verify EIA plant 63100 and CAISO pre-fill\n3. Edit capacity\n4. Save", "Pre-population verified. Updated capacity displayed in grid."],
            ["TC-EtoGen-03", "Delete Gen Asset Link (Crucial)", "Target: BESS-SOLAR-02", "1. Click Delete icon\n2. Confirm delete dialog", "VERIFY: System sends DELETE request to backend and removes record from table."]
        ]
    },
    {
        "num": "08", "name": "Entities to PPAs", "route": "/admin/entities/entities-to-ppas",
        "rules": "• PPA Agreement ID must be unique alphanumeric identifier.\n• Source and Sink BAA must be specified for wheeling power.\n• Scheduled end date must be after start date.",
        "cases": [
            ["TC-PPA-01", "Add Power Purchase Agreement", "PPA ID: PPA-WEST-SOLAR-26\nCounterparty: EDISON-UTILITY-CORP\nAmount: 110.0 MW\nSource: CAISO\nSink: CAISO\nDates: 06/01/2026 to 05/31/2046", "1. Click '+ Add'\n2. Fill PPA ID, counterparty, MW\n3. Select source/sink CAISO\n4. Save", "PPA agreement created. Table displays 110.0 MW and counterparty name."],
            ["TC-PPA-02", "Copy PPA Agreement", "Target: PPA-WEST-SOLAR-26", "1. Click Copy icon on row\n2. Modify PPA ID to PPA-WEST-SOLAR-26-B\n3. Save", "Duplicate PPA created with 'New' status and unique agreement ID."],
            ["TC-PPA-03", "Delete PPA Agreement", "Target: PPA-WEST-SOLAR-26-B", "1. Click Delete icon\n2. Confirm alert dialog", "PPA record removed from table."]
        ]
    },
    {
        "num": "09", "name": "Entities to Vertical Assets", "route": "/admin/entities/entities-to-vertical-assets",
        "rules": "• Vertical asset covers non-generation facilities (transmission lines, gas pipelines, substations).\n• Description of facility is required.",
        "cases": [
            ["TC-EtoVA-01", "Add Vertical Asset Link", "Type: Electric Transmission\nDescription: 500kV Intertie Transmission Spur\nBAA: CAISO\nStart Date: 01/01/2026", "1. Click '+ Add'\n2. Select Electric Transmission\n3. Enter 500kV description\n4. Select CAISO\n5. Save", "Vertical asset linked. Displays Transmission type and description in table."],
            ["TC-EtoVA-02", "Edit Vertical Asset", "Target: 500kV Intertie\nAdd to Description: 'Phase 1'", "1. Click Edit icon\n2. Verify description and BAA CAISO load\n3. Update text\n4. Save", "Updated description displays in grid."],
            ["TC-EtoVA-03", "Delete Vertical Asset", "Target: 500kV Intertie", "1. Click Delete icon\n2. Confirm in alert", "Record deleted from table and database."]
        ]
    },
    {
        "num": "10", "name": "Indicative PSS (Power Supply Studies)", "route": "/admin/entities/indicative-pss",
        "rules": "• Study end year must be valid 4-digit historical or current year (<= current year).\n• Scenario type must be Base Case (1) or Sensitivity Analysis (2).\n• Study parameters must be viewable and editable via the parameter sub-modal.",
        "cases": [
            ["TC-IPSS-01", "Create Indicative PSS Study", "Study Type: New\nEnd Year: 2026\nBAA: PJM\nScenario: Base Case (Value 1)", "1. Click '+ Add'\n2. Fill Year 2026, select PJM\n3. Select Scenario 'Base Case'\n4. Save", "Study created successfully. Appears in table with '( 0 )' parameter link."],
            ["TC-IPSS-02", "Manage Study Parameters Modal", "Study: PJM 2026 Base Case\nParam: Uncommitted Capacity = 650 MW\nReference: FERC Form 714 Exhibit B", "1. Click '( 0 )' link on row\n2. Study Parameters modal opens\n3. Enter 650 MW & reference\n4. Click 'Save'", "Parameters saved. Modal closes. Link updates to '( 1 )'."],
            ["TC-IPSS-03", "Edit PSS Study Pre-population", "Target: PJM 2026 Study", "1. Click Edit icon on study row\n2. Check Scenario Type dropdown", "VERIFY: Scenario Type dropdown shows 'Base Case' properly selected (not blank)."],
            ["TC-IPSS-04", "Delete PSS Study", "Target: PJM 2026 Study", "1. Click Delete icon\n2. Confirm delete", "Study and associated parameter records deleted from database."]
        ]
    },
    {
        "num": "11", "name": "Indicative MSS (Market Screen Studies)", "route": "/admin/entities/indicative-mss",
        "rules": "• Study parameters require seasonal breakdown (Winter, Spring, Summer, Fall).\n• Balancing authority must match regional transmission organization.\n• Scenario Type dropdown must correctly bind in Edit modal.",
        "cases": [
            ["TC-IMSS-01", "Create Indicative MSS Study", "Study Type: New\nEnd Year: 2026\nBAA: CAISO\nScenario: Sensitivity Analysis (Value 2)", "1. Click '+ Add'\n2. Fill Year 2026, select CAISO\n3. Select Scenario 'Sensitivity Analysis'\n4. Save", "Study created. Appears in table with '( 0 )' parameter count."],
            ["TC-IMSS-02", "Manage Seasonal Parameters Modal", "Season: Summer (3)\nParam: Summer Peak Net Capacity = 1450 MW\nRef: CAISO OASIS Summer Assessment", "1. Click '( 0 )' link on study\n2. Study Parameters modal opens\n3. Enter Summer capacity\n4. Click 'Save'", "Seasonal parameters saved. Parameter count on study row updates to '( 1 )'."],
            ["TC-IMSS-03", "Edit MSS Study Pre-population", "Target: CAISO 2026 Study", "1. Click Edit icon on study row\n2. Check Scenario Type dropdown", "VERIFY: Scenario Type dropdown shows 'Sensitivity Analysis' selected (not blank)."],
            ["TC-IMSS-04", "Delete MSS Study", "Target: CAISO 2026 Study", "1. Click Delete icon on study\n2. Confirm delete dialog", "Study and all seasonal parameters deleted from system."]
        ]
    }
]

for s in screens_detail:
    add_header(f"Screen {s['num']}: {s['name']} ({s['route']})", level=2)
    doc.add_paragraph(f"FERC Business & Validation Rules:\n{s['rules']}")
    table_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Action / Test Steps", "Expected Result"]
    create_table(table_headers, s['cases'], [1.0, 1.2, 1.4, 2.0, 1.6])

# ----------------- SECTION 4: FERC FILINGS & FLAG TOGGLE -----------------
add_header("4. FERC Filing Selections & Flag Toggle Test Scenarios", level=1)
doc.add_paragraph("Business Rule: The 'Include in Filing' checkbox on every screen determines which records are included in the upcoming FERC e-Tariff XML package. Toggling the checkbox updates the state in the database immediately.")

flg_headers = ["Test Case ID", "Test Condition", "Fresh Test Data", "User Action / Test Steps", "Expected Result"]
flg_data = [
    ["TC-FLG-01", "Toggle Single Record Filing Checkbox", "Any saved authorization record", "1. Click checkbox in first column of row\n2. Observe checkbox state", "Checkbox toggles to checked. Backend saves flag state immediately without page refresh."],
    ["TC-FLG-02", "Select All Records Checkbox", "Table with multiple records", "1. Click 'All' header checkbox", "All rows in the table become checked. System updates filing selection count."],
    ["TC-FLG-03", "Filing Validation Summary", "Filings navigation (/filings)", "1. Navigate to /filings\n2. Inspect filing candidate counter", "Candidate count reflects all checked records across the 11 MBR screens."]
]
create_table(flg_headers, flg_data, [1.0, 1.2, 1.4, 2.0, 1.6])

output_path = r"c:\Users\gunasekhar.p\Music\venus_Tech_forge_byte\MBR_FULL_APPLICATION_TEST_SCENARIOS_AND_CASES.docx"
doc.save(output_path)
print(f"Document successfully created at: {output_path}")
