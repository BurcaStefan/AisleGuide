import { Component, OnInit } from '@angular/core';
import { LoginComponent } from "../../components/user/login/login.component";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [LoginComponent],
})
export class LoginPageComponent implements OnInit {
  ngOnInit(): void {}
}
