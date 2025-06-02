import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-home-page',
  imports: [AdminHeaderComponent],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.scss',
})
export class AdminHomePageComponent {}
