import { Component } from '@angular/core';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';

@Component({
  selector: 'app-user-home-page',
  imports: [ClientHeaderComponent, ClientFooterComponent],
  templateUrl: './user-home-page.component.html',
  styleUrl: './user-home-page.component.scss',
})
export class UserHomePageComponent {}
