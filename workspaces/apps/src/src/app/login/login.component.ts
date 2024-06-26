import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { Customer } from '../models/Customer';

interface SignInForm {
  customerNumber: number | null;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent {
  signInForm: SignInForm;
  customerNumber: number | null = null;
  showBackButton: boolean = false;
  password: string | null = null;
  customer!: Customer;

  constructor(private apiService: ApiService, private router: Router) {
    this.signInForm = {
      customerNumber: null,
      password: ''
    };
  }
  
  submitForm() {
    if (!this.signInForm.customerNumber) {
      alert("Enter a customer number.")
      return;
    }

    this.customerNumber = this.signInForm.customerNumber as number;

    this.apiService.findCustomerNumber(this.customerNumber).subscribe(
      (data) => {   //when server response is 200        
        this.showBackButton = true;
        this.customer = data as Customer;
      },
      () => {       //when server response is 404
        alert("Enter a valid customer number.")
      }
    );
  }

  checkPassword() {
    if (!this.signInForm.customerNumber) {
      alert("Enter password.")
      return;
    }

    this.password = this.signInForm.password;

    if (this.customer.password == this.password)
      this.redirectToLoggedPage(this.customer);
    else
      alert("Enter a valid password.")    
  }

  redirectToLoggedPage(customer: Customer): void {
    const navigationExtras: NavigationExtras = {
      state: { customer: customer }
    };
    
    this.router.navigate(["my_account"], navigationExtras);
  }
}
