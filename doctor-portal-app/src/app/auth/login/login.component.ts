import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  passwordHidden = true;
  isLoading = false;
  isError = false;
  errorMessage = '';
  userAuthSubscription: Subscription;
  lastLoginSubscription: Subscription;
  loginForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder,private authService: AuthService,) {
    // this.loginForm.get('email').setValue(null);
    // this.loginForm.get('password').setValue(null);
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: [null, Validators.required],
    })
  }

  ngOnInit() {
  }

  onSubmit() {
      this.loginForm.markAllAsTouched();
      this.isError = false;
      this.errorMessage = '';

      if (this.loginForm.valid) {
        this.userAuthSubscription = this.authService.userSignin(this.loginForm.value).subscribe((res:any) => {
          if (res) {
            sessionStorage.setItem('token', res.token);
            sessionStorage.setItem('id', CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.user.id), environment.SECRET_KEY.trim()).toString());
            sessionStorage.setItem('name', CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.user.name), environment.SECRET_KEY.trim()).toString());
            sessionStorage.setItem('userObj', CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(res.user)), environment.SECRET_KEY.trim()).toString());
            window.location.href = '/pages/dashboard';
          }
          else{
            if(res.success.success === false){
              this.isError = true;
              this.errorMessage = 'Invalid Login!';
            }
          }
        },
        (error: HttpErrorResponse) => {
          console.log('Error....', error)
            if (error) {
              this.isError = true;
              this.errorMessage = 'Invalid Login!';
            }
        }
        )
      } else {
        return false;
      }
  }

  togglePassword = () => {
    this.passwordHidden = !this.passwordHidden;
  }

}
