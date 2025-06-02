import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../components/layout/admin-footer/admin-footer.component';

@Component({
  selector: 'app-admin-home-page',
  imports: [AdminHeaderComponent, AdminFooterComponent],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.scss',
})
export class AdminHomePageComponent {}
