import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../components/layout/admin-footer/admin-footer.component';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { UserService } from '../../services/user/user.service';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminHeaderComponent,
    AdminFooterComponent,
    ClientHeaderComponent,
    ClientFooterComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  isAdmin: boolean = false;
  userId: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  showUpdateForm: boolean = false;
  isDeleting: boolean = false;
  isUpdating: boolean = false;
  isEditing: boolean = false;
  showPasswordChange: boolean = false;
  isUpdatingPassword: boolean = false;
  currentPassword: string = '';

  updateModel: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  } = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  passwordChangeModel: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  } = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = this.userService.getUserIdFromToken(token);

    if (!this.userId) {
      this.errorMessage = 'Invalid user token';
      this.isLoading = false;
      return;
    }

    this.userService.getUserById(this.userId).subscribe({
      next: (user: User) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.currentPassword = user.password || '';

        this.updateModel = {
          id: this.userId,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: '',
        };

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = 'Failed to load profile data';
        this.isLoading = false;
      },
    });
  }

  startEditing(): void {
    this.isEditing = true;
    this.updateModel = {
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: '',
    };
  }

  clearError(): void {
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
  }

  togglePasswordChange(): void {
    this.showPasswordChange = !this.showPasswordChange;
    if (!this.showPasswordChange) {
      this.passwordChangeModel = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
    }
  }

  cancelPasswordChange(): void {
    this.showPasswordChange = false;
    this.passwordChangeModel = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.errorMessage = '';
  }

  updatePassword(): void {
    if (!this.passwordChangeModel.oldPassword) {
      this.errorMessage = 'Please enter your current password';
      this.autoCloseError();
      return;
    }

    if (!this.passwordChangeModel.newPassword) {
      this.errorMessage = 'Please enter a new password';
      this.autoCloseError();
      return;
    }

    if (this.passwordChangeModel.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters long';
      this.autoCloseError();
      return;
    }

    if (!this.passwordChangeModel.confirmPassword) {
      this.errorMessage = 'Please confirm your new password';
      this.autoCloseError();
      return;
    }

    if (
      this.passwordChangeModel.newPassword !==
      this.passwordChangeModel.confirmPassword
    ) {
      this.errorMessage = 'New password and confirmation do not match';
      this.autoCloseError();
      return;
    }

    try {
      const isOldPasswordCorrect = bcrypt.compareSync(
        this.passwordChangeModel.oldPassword,
        this.currentPassword
      );

      if (!isOldPasswordCorrect) {
        this.errorMessage = 'Current password is incorrect';
        this.autoCloseError();
        return;
      }
    } catch (error) {
      console.error('Error comparing passwords:', error);
      this.errorMessage = 'Error validating current password';
      this.autoCloseError();
      return;
    }

    if (
      this.passwordChangeModel.newPassword ===
      this.passwordChangeModel.oldPassword
    ) {
      this.errorMessage =
        'New password must be different from current password';
      this.autoCloseError();
      return;
    }

    this.isUpdatingPassword = true;
    this.errorMessage = '';

    const hashedNewPassword = bcrypt.hashSync(
      this.passwordChangeModel.newPassword,
      11
    );

    const passwordUpdate: User = {
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: hashedNewPassword,
      isAdmin: this.isAdmin,
    };

    this.userService.updateUser(this.userId, passwordUpdate).subscribe({
      next: (success) => {
        if (success) {
          this.currentPassword = hashedNewPassword;
          this.showPasswordChange = false;
          this.passwordChangeModel = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          };
          alert('Password updated successfully');
        } else {
          this.errorMessage = 'Failed to update password';
        }
        this.isUpdatingPassword = false;
      },
      error: (error) => {
        console.error('Error updating password:', error);
        this.errorMessage = error.error?.message || 'Failed to update password';
        this.isUpdatingPassword = false;
      },
    });
  }

  private autoCloseError(): void {
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private checkUserRole(): void {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.isAdmin =
          decodedToken.IsAdmin === 'True' || decodedToken.IsAdmin === true;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openUpdateForm(): void {
    this.showUpdateForm = true;
  }

  cancelUpdate(): void {
    this.showUpdateForm = false;
    this.updateModel = {
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: '',
    };
  }

  updateProfile(): void {
    if (
      !this.updateModel.firstName ||
      !this.updateModel.lastName ||
      !this.updateModel.email
    ) {
      this.errorMessage = 'Please fill all required fields';
      this.autoCloseError();
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    const updatedUser: User = {
      id: this.userId,
      firstName: this.updateModel.firstName,
      lastName: this.updateModel.lastName,
      email: this.updateModel.email,
      password: this.currentPassword,
      isAdmin: this.isAdmin,
    };

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: (success) => {
        if (success) {
          this.firstName = updatedUser.firstName;
          this.lastName = updatedUser.lastName;
          this.email = updatedUser.email;
          this.isEditing = false;
          alert('Profile updated successfully');
        } else {
          this.errorMessage = 'Failed to update profile';
        }
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        if (error.status === 400) {
          this.errorMessage =
            'This email address is anvailable. Please use a valid email address.';
        } else {
          this.errorMessage = 'Failed to update profile. Please try again.';
        }

        this.autoCloseError();
        this.isUpdating = false;
      },
    });
  }

  deleteAccount(): void {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      this.isDeleting = true;

      this.userService.deleteUser(this.userId).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          this.errorMessage = 'Failed to delete account';
          this.isDeleting = false;
        },
      });
    }
  }
}
