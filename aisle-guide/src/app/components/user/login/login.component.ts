// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent {
//   email: string = '';
//   password: string = '';

//   constructor() {
//     console.log('LoginComponent inițializat');
//   }

//   login(email: string, password: string) {
//     console.log('Metoda login apelată');

//     this.email = email;
//     this.password = password;

//     console.log('Email:', this.email);
//     console.log('Password:', this.password);
//   }
// }

import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,  // Dacă componenta este standalone
  imports: [CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService) {
    console.log('LoginComponent inițializat');
  }

  login(email: string, password: string) {
    console.log('Metoda login apelată');
    this.email = email;
    this.password = password;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // Apelare endpoint prin serviciul UserService
    this.userService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.successMessage = 'Autentificare reușită!';
        // Aici poți salva token-ul de autentificare, redirectiona către pagina principală, etc.
        this.loading = false;
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage =
          error.message ||
          'Autentificare eșuată. Verificați datele și încercați din nou.';
        this.loading = false;
      },
    });
  }
}
