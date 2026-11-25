import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

doc = docx.Document()

# Set margins
sections = doc.sections
for section in sections:
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)

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
    h.paragraph_format.space_after = Pt(6)
    for run in h.runs:
        run.font.name = 'Calibri'
        if level == 1:
            run.font.size = Pt(18)
            run.font.bold = True
            run.font.color.rgb = RGBColor(16, 44, 87) # Deep Navy
        elif level == 2:
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.color.rgb = RGBColor(30, 81, 123)
        elif level == 3:
            run.font.size = Pt(12)
            run.font.bold = True
            run.font.color.rgb = RGBColor(53, 95, 142)
    return h

# Document Title
title_p = doc.add_paragraph()
title_p.paragraph_format.space_before = Pt(0)
title_p.paragraph_format.space_after = Pt(4)
title_run = title_p.add_run("Full Application UI Automation Test Suite & Scenarios")
title_run.font.name = 'Calibri'
title_run.font.size = Pt(24)
title_run.font.bold = True
title_run.font.color.rgb = RGBColor(16, 44, 87)

subtitle_p = doc.add_paragraph()
subtitle_p.paragraph_format.space_after = Pt(16)
sub_run = subtitle_p.add_run("Application URL: http://localhost:4200  |  Technology: Angular 18 Single-Page Application (SPA) with NestJS & PostgreSQL\nScope: Comprehensive End-to-End User Interface (UI) Automation with Exact Selectors, Flows & Test Data")
sub_run.font.name = 'Calibri'
sub_run.font.size = Pt(10.5)
sub_run.font.italic = True
sub_run.font.color.rgb = RGBColor(100, 100, 100)

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# Section 1: Overview
add_header("1. UI Automation Framework Architecture", level=1)
p = doc.add_paragraph(
    "This document specifies the exact User Interface (UI) automation test suite for the MBR and FERC Compliance portal. "
    "Every test scenario includes exact CSS/XPath locators, DOM interactions, modal workflows, validation error handling, "
    "and new realistic test datasets designed for tools such as Playwright, Cypress, or Selenium."
)
p.paragraph_format.line_spacing = 1.15

# Table of global navigation locators
add_header("2. Global Navigation Bar & Top Header Locators", level=1)
table = doc.add_table(rows=1, cols=3)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = table.rows[0].cells
hdr_cells[0].text = "UI Component"
hdr_cells[1].text = "CSS / XPath Selector"
hdr_cells[2].text = "Functional Purpose"

for cell in hdr_cells:
    set_cell_background(cell, "102C57")
    for prg in cell.paragraphs:
        for run in prg.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

nav_locators = [
    ("Company Header Avatar", ".user-badge .avatar or .top-nav .company-name", "Displays active company (Venus Clean Energy / ForgeByte Solar)"),
    ("Account Nav Link", "nav a[routerLink='/account']", "Navigates to /account"),
    ("Company Nav Link", "nav a[routerLink='/company']", "Navigates to /company"),
    ("Assets Nav Link", "nav a[routerLink='/assets']", "Navigates to /assets"),
    ("Screens Dropdown", "nav .dropdown:has-text('Screens') or .nav-dropdown-toggle", "Opens the 11 MBR compliance screens menu"),
    ("Filings Nav Link", "nav a[routerLink='/filings']", "Navigates to filing preparation screen"),
    ("User Nav Link", "nav a[routerLink='/user']", "Navigates to /user list"),
    ("Logout Button", "button.btn-logout", "Logs user out of portal")
]

for item in nav_locators:
    row_cells = table.add_row().cells
    row_cells[0].text = item[0]
    row_cells[1].text = item[1]
    row_cells[2].text = item[2]
    for cell in row_cells:
        cell.paragraphs[0].runs[0].font.size = Pt(9.5)

# Section 3: Core Administrative Modules
add_header("3. Core Modules UI Automation Test Scenarios", level=1)

# UI Scenario 1
add_header("UI-SCENARIO 01: Multi-Company Switching & Header State", level=2)
doc.add_paragraph("• Objective: Verify company context switching instantly refreshes top header title, badge ID, and underlying data grids.\n"
                  "• Steps:\n"
                  "   1. Navigate to http://localhost:4200/account.\n"
                  "   2. Click company selection row for 'ForgeByte Solar Ventures LLC (C100002)'.\n"
                  "• Assertions: Header text changes to 'ForgeByte Solar Ventures LLC', Badge shows 'C100002', table data reloads with CID 2 data.")

# UI Scenario 2
add_header("UI-SCENARIO 02: User Management (/user)", level=2)
doc.add_paragraph("• Locators: Add Button: button.btn-add | Table Rows: .user-table tbody tr | Edit Button: .action-btn.edit | Delete: .action-btn.delete\n"
                  "• New Test Data:\n"
                  "   - First Name: UI-Automated\n"
                  "   - Last Name: Reviewer\n"
                  "   - Email: ui.automated.test@venusenergy.com\n"
                  "   - Role: Company User (select[name='role'])\n"
                  "   - Company: Venus Clean Energy Corp\n"
                  "• Steps & Assertions: Click '+ Add User' -> Enter data -> Click 'Save' -> Toast notification verifies creation -> User appears in table -> Click Delete -> Confirm alert -> Row is removed.")

# UI Scenario 3
add_header("UI-SCENARIO 03: Generation Assets (/assets)", level=2)
doc.add_paragraph("• Locators: Add Button: button.btn-add-asset | Asset Name: input[placeholder*='asset name'] | Capacity: input[placeholder*='capacity']\n"
                  "• New Test Data:\n"
                  "   - Asset Name: Highland Valley Wind Energy Project\n"
                  "   - Asset Code: WIND-HV-2026\n"
                  "   - Type: Wind Turbine | Capacity: 225.0 MW | BAA: CAISO | EIA Plant Code: 61022\n"
                  "• Steps & Assertions: Add asset -> Verify grid displays 225.0 MW -> Click Edit -> Verify all fields pre-populate -> Update capacity to 230.0 MW -> Grid refreshes with updated capacity.")

# Section 4: All 11 Screens
add_header("4. All 11 FERC Market-Based Rate (MBR) Screens Automation", level=1)

screens_data = [
    ("01. MBR Authorizations", "/admin/entities/authorization",
     "Docket: input[name='authDocker'], Effective Date: input[name='authEffectiveDate'], Record Type: select[name='recordType']",
     "Docket: ER26-7890-001 | Date: 07/01/2026 | Type: New",
     "Click '+ Add' -> Fill fields -> Submit -> Verify toast -> Click Edit -> Verify ER26-7890-001 pre-populates -> Delete record -> Verify removed from grid."),

    ("02. Category Status", "/admin/entities/category-status",
     "Category: select[name='categoryStatus'], Region: select[name='region'], Effective Date: input[name='effectiveDate']",
     "Region: SW (Southwest) | Status: Category 1 | Date: 08/15/2026 | Docket: ER26-9902-000",
     "Click '+ Add' -> Select Region SW and Category 1 -> Save -> Click Edit on new row -> Verify Region SW and Category 1 are selected in dropdowns -> Delete."),

    ("03. Mitigations", "/admin/entities/mitigations",
     "BAA: app-balancing-authority-dropdown input, Narrative: textarea[name='mitigationNarrative'], Dates: input[name='effectiveDate'], input[name='endDate']",
     "BAA: CAISO | Narrative: Energy offer price caps at $1,000/MWh under Section 39 | Dates: 09/01/2026 to 12/31/2030",
     "Click '+ Add' -> Enter narrative and BAA CAISO -> Save -> Verify table row displays narrative -> Click Edit -> Verify text area contains narrative -> Cancel."),

    ("04. Self Limitations", "/admin/entities/self-limitations",
     "Region: select[name='region'], BAA: app-balancing-authority-dropdown input, Dates: input[name='effectiveDate'], input[name='endDate']",
     "Region: CE (Central) | BAA: MISO | Dates: 01/01/2026 to 12/31/2028 | Type: New",
     "Click '+ Add' -> Select Central & MISO -> Save -> Click Edit icon -> CRITICAL CHECK: Verify Region shows 'Central' and BAA shows 'MISO' (no blank fields) -> Update end date -> Save succeeds without validation error."),

    ("05. Operating Reserves", "/admin/entities/operating-reserves",
     "BAA: app-balancing-authority-dropdown input, Dates: input[name='effectiveDate'], input[name='endDate']",
     "BAA: SPP | Effective Date: 03/01/2026 | End Date: 03/01/2032 | Type: New",
     "Add SPP reserve -> Grid updates -> Click Delete -> Confirm alert -> API DELETE executes and removes row."),

    ("06. Entities to Entities", "/admin/entities/entities-to-entities",
     "ID Type: select[name='reportableEntityType'], Entity ID: input[name='reportableEntityId'], Docket: input[name='docket'], Start Date: input[name='relationshipStartDate']",
     "Type: CID | ID: C100002 | Docket: ER26-5500-000 | Start Date: 01/01/2026",
     "Add affiliate relationship -> Verify row rendered with badge 'CID' and ID 'C100002' -> Click Edit -> Verify values load cleanly -> Cancel."),

    ("07. Entities to Generator Assets", "/admin/entities/entities-to-generator-assets",
     "Asset Type: select[name='genAssetType'], Asset Code: input[name='assetCode'], Plant Code: input[name='eiaPlantCode'], Capacity: input[name='amount']",
     "Asset Type: Battery Storage | Code: BESS-LITHIUM-01 | Plant: 59441 | Cap: 100.0 MW | BAA: CAISO",
     "Add asset relationship -> Verify row in table -> Click Delete icon -> Confirm in alert -> Verify API call executes and row disappears."),

    ("08. Entities to PPAs", "/admin/entities/entities-to-ppas",
     "PPA ID: input[name='ppaAgreementId'], Counterparty: input[name='counterpartyId'], Amount: input[name='amount'], Source/Sink BAA: Dropdowns",
     "PPA ID: PPA-AUTOMATION-2026 | Counterparty: WEST-COAST-POWER-CORP | Amount: 60.0 MW | BAA: CAISO | 2026-2036",
     "Add 10-year PPA -> Verify in grid -> Click Copy icon -> Verify modal pre-populates with 'New' record type -> Save copy."),

    ("09. Entities to Vertical Assets", "/admin/entities/entities-to-vertical-assets",
     "Type: select[name='verticalAssetType'], Description: textarea[name='explanatoryNotes'], BAA: Dropdown",
     "Type: Transmission Facility | Description: 230kV Dual Circuit Switchyard Connection | BAA: PJM",
     "Add vertical transmission asset -> Verify in table -> Edit -> Modify description -> Save -> Verifies persistence."),

    ("10. Indicative PSS", "/admin/entities/indicative-pss",
     "Study Type: select[name='studyTypeCd'], Year: input[name='studyEndYear'], BAA: Dropdown, Scenario: select[name='scenarioType']",
     "Type: New | Year: 2026 | BAA: PJM | Scenario: Base Case (Value 1)",
     "Add study -> Verify study created with '( 0 )' parameters link -> Click '( 0 )' -> Study Parameters modal opens -> Enter parameter: 'Uncommitted Capacity' = 500 MW, Ref = 'FERC 714' -> Save -> Count updates to '( 1 )' -> Click Edit on study -> Verify Scenario Type dropdown shows 'Base Case'."),

    ("11. Indicative MSS", "/admin/entities/indicative-mss",
     "Study Type: select[name='studyTypeCd'], Year: input[name='studyEndYear'], BAA: Dropdown, Scenario: select[name='scenarioType']",
     "Type: New | Year: 2026 | BAA: CAISO | Scenario: Sensitivity Analysis (Value 2)",
     "Add MSS study -> Click Parameters link '( 0 )' -> Fill Winter/Summer values -> Save -> Click Edit on study -> Verify Scenario Type shows 'Sensitivity Analysis' -> Click Delete -> Confirm alert -> Study and parameters removed.")
]

for screen in screens_data:
    add_header(screen[0], level=2)
    doc.add_paragraph(f"• Route: {screen[1]}\n"
                      f"• Key Field Selectors: {screen[2]}\n"
                      f"• New Test Data: {screen[3]}\n"
                      f"• UI Test Actions & Assertions: {screen[4]}")

# Section 5: Playwright Spec
add_header("5. Automated Playwright Test Script Template", level=1)
code_text = (
    "import { test, expect } from '@playwright/test';\n\n"
    "test.describe('MBR Portal Full UI Automation Suite', () => {\n"
    "  const BASE_URL = 'http://localhost:4200';\n\n"
    "  test.beforeEach(async ({ page }) => {\n"
    "    await page.goto(BASE_URL);\n"
    "    await page.waitForLoadState('networkidle');\n"
    "  });\n\n"
    "  test('TC-UI-01: Company Switching & Navigation', async ({ page }) => {\n"
    "    await expect(page.locator('.user-badge, .company-name')).toBeVisible();\n"
    "    await page.click('nav a[routerLink=\"/assets\"]');\n"
    "    await expect(page).toHaveURL(/.*assets/);\n"
    "    await expect(page.locator('h1.page-title')).toContainText('Assets');\n"
    "  });\n\n"
    "  test('TC-UI-02: Self Limitations Edit Form Pre-population', async ({ page }) => {\n"
    "    await page.goto(`${BASE_URL}/admin/entities/self-limitations`);\n"
    "    await page.waitForSelector('.user-table tbody tr');\n"
    "    await page.locator('.action-btn.edit').first().click();\n"
    "    await expect(page.locator('.modal-content')).toBeVisible();\n"
    "    await expect(page.locator('select[name=\"region\"]')).not.toHaveValue('');\n"
    "    await expect(page.locator('app-balancing-authority-dropdown input')).not.toHaveValue('');\n"
    "    await page.click('.close-btn');\n"
    "  });\n"
    "});\n"
)
code_p = doc.add_paragraph()
code_run = code_p.add_run(code_text)
code_run.font.name = 'Consolas'
code_run.font.size = Pt(9.5)
code_run.font.color.rgb = RGBColor(33, 33, 33)

output_path = r"c:\Users\gunasekhar.p\Music\venus_Tech_forge_byte\FULL_APPLICATION_UI_AUTOMATION_TEST_SUITE.docx"
doc.save(output_path)
print(f"Document successfully created at: {output_path}")
