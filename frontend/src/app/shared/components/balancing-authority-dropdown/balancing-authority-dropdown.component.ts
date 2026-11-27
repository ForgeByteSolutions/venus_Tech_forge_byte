import { Component, forwardRef, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface BaaOption {
  value: string;
  text: string;
  id?: string;
  ID?: string;
  baa_desc?: string;
}

const DEFAULT_BAAS: BaaOption[] = [
  { value: 'CAISO', text: 'California Independent System Operator', id: 'CAISO', ID: 'CAISO', baa_desc: 'California Independent System Operator' },
  { value: 'CISO', text: 'California Independent System Operator (CISO)', id: 'CISO', ID: 'CISO', baa_desc: 'California Independent System Operator (CISO)' },
  { value: 'PJM', text: 'PJM Interconnection', id: 'PJM', ID: 'PJM', baa_desc: 'PJM Interconnection' },
  { value: 'MISO', text: 'Midcontinent Independent System Operator', id: 'MISO', ID: 'MISO', baa_desc: 'Midcontinent Independent System Operator' },
  { value: 'ERCOT', text: 'Electric Reliability Council of Texas', id: 'ERCOT', ID: 'ERCOT', baa_desc: 'Electric Reliability Council of Texas' },
  { value: 'SPP', text: 'Southwest Power Pool', id: 'SPP', ID: 'SPP', baa_desc: 'Southwest Power Pool' },
  { value: 'NYISO', text: 'New York Independent System Operator', id: 'NYISO', ID: 'NYISO', baa_desc: 'New York Independent System Operator' },
  { value: 'ISONE', text: 'ISO New England', id: 'ISONE', ID: 'ISONE', baa_desc: 'ISO New England' },
  { value: 'NEVP', text: 'Nevada Power Company', id: 'NEVP', ID: 'NEVP', baa_desc: 'Nevada Power Company' },
  { value: 'AZPS', text: 'Arizona Public Service Company', id: 'AZPS', ID: 'AZPS', baa_desc: 'Arizona Public Service Company' },
  { value: 'PACE', text: 'PacifiCorp East', id: 'PACE', ID: 'PACE', baa_desc: 'PacifiCorp East' },
  { value: 'PACW', text: 'PacifiCorp West', id: 'PACW', ID: 'PACW', baa_desc: 'PacifiCorp West' },
  { value: 'BANC', text: 'Balancing Authority of Northern California', id: 'BANC', ID: 'BANC', baa_desc: 'Balancing Authority of Northern California' },
  { value: 'LDWP', text: 'Los Angeles Department of Water and Power', id: 'LDWP', ID: 'LDWP', baa_desc: 'Los Angeles Department of Water and Power' },
  { value: 'TIDC', text: 'Turlock Irrigation District', id: 'TIDC', ID: 'TIDC', baa_desc: 'Turlock Irrigation District' },
  { value: 'IID', text: 'Imperial Irrigation District', id: 'IID', ID: 'IID', baa_desc: 'Imperial Irrigation District' },
  { value: 'WALC', text: 'Western Area Power Administration - DSW', id: 'WALC', ID: 'WALC', baa_desc: 'Western Area Power Administration - DSW' },
  { value: 'WAUW', text: 'Western Area Power Administration - UGP West', id: 'WAUW', ID: 'WAUW', baa_desc: 'Western Area Power Administration - UGP West' },
  { value: 'WACM', text: 'Western Area Power Administration - RMR', id: 'WACM', ID: 'WACM', baa_desc: 'Western Area Power Administration - RMR' },
  { value: 'PNM', text: 'Public Service Company of New Mexico', id: 'PNM', ID: 'PNM', baa_desc: 'Public Service Company of New Mexico' },
  { value: 'SRP', text: 'Salt River Project', id: 'SRP', ID: 'SRP', baa_desc: 'Salt River Project' },
  { value: 'TEPC', text: 'Tucson Electric Power Company', id: 'TEPC', ID: 'TEPC', baa_desc: 'Tucson Electric Power Company' },
  { value: 'PSCO', text: 'Public Service Company of Colorado', id: 'PSCO', ID: 'PSCO', baa_desc: 'Public Service Company of Colorado' },
  { value: 'SOCO', text: 'Southern Company Services', id: 'SOCO', ID: 'SOCO', baa_desc: 'Southern Company Services' },
  { value: 'TVA', text: 'Tennessee Valley Authority', id: 'TVA', ID: 'TVA', baa_desc: 'Tennessee Valley Authority' },
  { value: 'FPL', text: 'Florida Power & Light Company', id: 'FPL', ID: 'FPL', baa_desc: 'Florida Power & Light Company' },
  { value: 'CPLE', text: 'Duke Energy Progress East', id: 'CPLE', ID: 'CPLE', baa_desc: 'Duke Energy Progress East' },
  { value: 'CPLW', text: 'Duke Energy Progress West', id: 'CPLW', ID: 'CPLW', baa_desc: 'Duke Energy Progress West' },
  { value: 'DUK', text: 'Duke Energy Carolinas', id: 'DUK', ID: 'DUK', baa_desc: 'Duke Energy Carolinas' },
  { value: 'SC', text: 'South Carolina Public Service Authority (Santee Cooper)', id: 'SC', ID: 'SC', baa_desc: 'South Carolina Public Service Authority (Santee Cooper)' },
  { value: 'SCEG', text: 'Dominion Energy South Carolina', id: 'SCEG', ID: 'SCEG', baa_desc: 'Dominion Energy South Carolina' }
];

@Component({
  selector: 'app-balancing-authority-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="baa-combo">
      <input type="text" class="form-input" 
        [(ngModel)]="searchText" 
        (input)="onSearchInput()"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeydown($event)"
        placeholder="Search or select balancing authority..." 
        autocomplete="off"
        #baaInput>
      <span class="combo-arrow" (mousedown)="$event.preventDefault(); clearBlurTimer()" (click)="onToggle()">▼</span>
      
      <div class="baa-dropdown" 
        *ngIf="isDropdownOpen && filteredList.length > 0"
        [ngStyle]="dropdownStyle">
        <div class="baa-dropdown-item" 
          *ngFor="let item of filteredList" 
          (mousedown)="onItemSelect(item)">
          <div class="baa-item-code">{{ getItemCode(item) }}</div>
          <div class="baa-item-name">{{ getItemDesc(item) }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .baa-combo {
      position: relative;
      width: 100%;
    }
    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #CBD5E0;
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
      background-color: #fff;
      cursor: pointer;
      box-sizing: border-box;
    }
    .form-input:hover {
      border-color: #A0AEC0;
    }
    .form-input:focus {
      outline: none;
      border-color: #002980;
      box-shadow: 0 0 0 3px rgba(0, 41, 128, 0.1);
    }
    .combo-arrow {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 12px;
      color: #666;
      user-select: none;
    }
    .baa-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: 2px;
      background: #1a2d4d;
      border: 1px solid #ccc;
      border-radius: 8px;
      max-height: 250px;
      overflow-y: auto;
      z-index: 10000;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    }
    .baa-dropdown-item {
      padding: 10px 14px;
      cursor: pointer;
      color: white;
      border-bottom: 1px solid #333;
    }
    .baa-dropdown-item:hover {
      background-color: #2a4d7d;
    }
    .baa-item-code {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .baa-item-name {
      font-size: 12px;
      color: #ccc;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BalancingAuthorityDropdownComponent),
      multi: true
    }
  ]
})
export class BalancingAuthorityDropdownComponent implements ControlValueAccessor {
  private _balancingAuthorities: BaaOption[] = [...DEFAULT_BAAS];

  @Input() set balancingAuthorities(val: any[]) {
    if (val && Array.isArray(val) && val.length > 0) {
      // Merge with defaults to ensure comprehensive list
      const existingCodes = new Set(val.map(i => this.getItemCode(i).toUpperCase()));
      const merged = [...val];
      for (const d of DEFAULT_BAAS) {
        if (!existingCodes.has(d.value.toUpperCase())) {
          merged.push(d);
        }
      }
      this._balancingAuthorities = merged;
    } else {
      this._balancingAuthorities = [...DEFAULT_BAAS];
    }
    this.updateSearchText();
  }

  get balancingAuthorities(): BaaOption[] {
    return this._balancingAuthorities;
  }

  @ViewChild('baaInput') baaInput!: ElementRef<HTMLInputElement>;
  
  searchText: string = '';
  selectedValue: string = '';
  filteredList: BaaOption[] = [];
  isDropdownOpen: boolean = false;
  dropdownStyle: any = {};
  private blurTimer: any;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  getItemCode(item: any): string {
    return item?.value || item?.ID || item?.id || '';
  }

  getItemDesc(item: any): string {
    return item?.text || item?.baa_desc || this.getItemCode(item);
  }

  writeValue(value: any): void {
    this.selectedValue = value || '';
    this.updateSearchText();
  }

  updateSearchText(): void {
    if (!this.selectedValue) {
      this.searchText = '';
      return;
    }

    const valStr = String(this.selectedValue).trim();
    const item = this._balancingAuthorities.find(i => {
      const code = this.getItemCode(i);
      const desc = this.getItemDesc(i);
      return (
        code.toLowerCase() === valStr.toLowerCase() ||
        desc.toLowerCase() === valStr.toLowerCase()
      );
    });

    if (item) {
      const code = this.getItemCode(item);
      const desc = this.getItemDesc(item);
      this.searchText = `${code} - ${desc}`;
    } else {
      this.searchText = valStr;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  onSearchInput(): void {
    const term = (this.searchText || '').toLowerCase().trim();
    if (term.length > 0) {
      this.filteredList = this._balancingAuthorities.filter(item =>
        this.getItemDesc(item).toLowerCase().includes(term) || 
        this.getItemCode(item).toLowerCase().includes(term)
      );
    } else {
      this.filteredList = this._balancingAuthorities.slice(0, 100);
    }
    this.isDropdownOpen = true;
    this.updateDropdownPosition();
  }

  onFocus(): void {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = undefined;
    }
    const term = (this.searchText || '').toLowerCase().trim();
    if (term.length > 0) {
      this.filteredList = this._balancingAuthorities.filter(item =>
        this.getItemDesc(item).toLowerCase().includes(term) || 
        this.getItemCode(item).toLowerCase().includes(term)
      );
    } else {
      this.filteredList = this._balancingAuthorities.slice(0, 100);
    }
    this.isDropdownOpen = true;
    this.updateDropdownPosition();
  }

  onBlur(): void {
    this.blurTimer = setTimeout(() => {
      this.isDropdownOpen = false;
      this.filteredList = [];
    }, 200);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isDropdownOpen = false;
      this.filteredList = [];
    }
  }

  clearBlurTimer(): void {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = undefined;
    }
  }

  onToggle(): void {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
      return;
    }
    this.filteredList = this._balancingAuthorities.slice(0, 100);
    this.isDropdownOpen = true;
    this.updateDropdownPosition();
  }

  onItemSelect(item: BaaOption): void {
    const code = this.getItemCode(item);
    const desc = this.getItemDesc(item);
    this.searchText = `${code} - ${desc}`;
    this.selectedValue = code;
    this.isDropdownOpen = false;
    this.filteredList = [];
    this.onChange(this.selectedValue);
    this.onTouched();
  }

  private updateDropdownPosition(): void {
    if (!this.baaInput) return;
    const rect = this.baaInput.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 10;
    const maxH = Math.min(Math.max(spaceBelow, 120), 250);
    this.dropdownStyle = {
      'max-height': `${maxH}px`
    };
  }
}
