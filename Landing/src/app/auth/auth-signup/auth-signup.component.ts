import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule} from '@angular/forms';
import { NgForm, Validators } from '@angular/forms';
import {ChangeDetectorRef} from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {PatientService} from "../../shared/services/patient.service";
import {MustMatch} from "../../shared/match_validator/must_match.validator";



@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.css']
})

/**
 * Auth Signup Component
 */
export class AuthSignupComponent implements OnInit {

    information_to_user = '';
    web = true;

    registerForm: FormGroup;
    submitted = false;

    constructor(private userService: UserService,
                private patientService: PatientService,
                private router: Router,
                private formBuilder: FormBuilder){
    }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
            password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$")]),
            confirmPassword: new FormControl('', [Validators.required]),
            rules: new FormControl(false,[Validators.requiredTrue]),
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
        if (window.innerWidth <= 768) { // 768px portrait
            this.web = false;
        }
    }
    get f() { return this.registerForm.controls; }

    addNewUser(form: any) {
        this.submitted = true;


        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        else{
            this.patientService.existsEmail(form.value.email).subscribe(
            (data: any) => {
                if (data.exists == false) {
                    this.userService.registerUser(form.value.firstName, form.value.lastName, form.value.email, form.value.password).subscribe(
                        (response: any) => {
                            this.router.navigate(['/confirm-mail', form.value.firstName]);
                        },
                        (error: HttpErrorResponse) => {
                            form.reset();
                        }
                    );
                }
                else {
                    this.information_to_user = 'Podany email jest już użyty';
                }
            },
            () => {
            }
        );
        }
    }
}
