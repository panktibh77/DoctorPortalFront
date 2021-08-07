import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Patient } from 'src/app/shared/models/patient';
import { PatientService } from 'src/app/shared/services/patients/patient.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  patientForm: FormGroup;
  button: String;
  patientPageTitle: String;
  postPatientObj: Observable<Patient>;
  patientObj: Observable<Patient[]>;
  patientDetailsListing: Observable<Patient>;
  patientId: any;
  getAllPatientDetails: any;
  patientInfoById: any;
  patients$: any = [];
  patientObj$: Observable<Patient>;
  _patient: Patient;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private patientService: PatientService,
    private actRoute: ActivatedRoute

  ) {
    this._patient = new Patient();
    this.patientId = this.actRoute.snapshot.params.id;
  }

  ngOnInit() {
    if (this.router.url === '/pages/add-patient') {
      this.button = 'Submit';
      this.patientPageTitle = 'New Patient';
    } else if (this.router.url === window.location.pathname) {
      this.button = 'Update';
      this.patientPageTitle = 'Patient Profile';
      this.getPatientById();
    } else {
      this.button = 'Update';
      this.patientPageTitle = 'Update Patient';
      this.getPatientById();
    }
    this.patientForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      username: ['', Validators.required],
      mobile_number: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      password: ['', Validators.required]
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onSubmit() {
    console.log(this.patientForm.value)
    // this.patientForm.markAllAsTouched();
    this.patientForm.get('password').patchValue(this.generatePassword(8));
    if (this.patientForm.valid) {
      if (this.router.url === '/pages/add-patient') {
        this.postPatientObj = this.patientService.postPatientObj(
          this.patientForm.value
        );
        this.postPatientObj.subscribe((res: any) => {
          console.log(res);
          if (res) {
            if (res.success === true) {
              // this.toastr.success('Added consultant successfully.');
              this.patientForm.reset();
              this.router.navigate(['/pages/patient-details']);
            }
          }
        }, (error) => {
          console.log(error);
          if(error.error.errors[0].msg === 'Email is already exist.'){
            // this.toastr.error('Email is already exist!');
          }else if(error.error.errors[0].msg === 'must be at last 3 chars long.'){
            // this.toastr.error('Please enter user name more than 2 characters!');
          }
        });
      } else if (this.router.url === '/pages/PatientProfile/:id') {
        setTimeout(() => {
          this.editPatient();
        }, 1500);
      } else {
        setTimeout(() => {
          this.editPatient();
          this.router.navigate(['/pages/patient-details']);
        }, 1500);
      }
    } else {
      this.validateAllFormFields(this.patientForm);
    }
  }

  generatePassword(length, charSet = '') {
    charSet = charSet
      ? charSet
      : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789^°!"§$%&/()=?`*+~\'#,;.:-_';
    let newPass = Array.apply(null, Array(length || 10))
      .map(function () {
        return charSet.charAt(Math.random() * charSet.length);
      })
      .join('');
    // console.log(newPass);
    return newPass;
  }

  getPatientById() {
    this.patientObj = this.patientService.getPatientById(
      this.patientId
    );
    this.patientObj.subscribe((res: any) => {
      this.patientInfoById = res.res;
      console.log(this.patientInfoById);
      this.patientForm
        .get('name')
        .patchValue(this.patientInfoById.name);
      this.patientForm
        .get('email')
        .patchValue(this.patientInfoById.email);
      this.patientForm
        .get('address')
        .patchValue(this.patientInfoById.address);
      this.patientForm
        .get('mobile_number')
        .patchValue(this.patientInfoById.mobile_number);
      this.patientForm
        .get('username')
        .patchValue(this.patientInfoById.username);
    });
  }

  editPatient() {
    let patientDetailsObjForPOST = {
      name: this.patientForm.get('name').value,
      username: this.patientForm.get('username').value,
      email: this.patientForm.get('email').value,
      mobile_number: this.patientForm.get('mobile_number').value,
      address: this.patientForm.get('address').value
    };
    this.putConsultantByIdToApi(this.patientId, patientDetailsObjForPOST);
    // this.patientForm.reset();
    // setTimeout(() => {
    this.patientDetailsListing = this.patientService.getAllPatients(
      this._patient
    );
    this.patientDetailsListing.subscribe((res: any) => {
      if (res) {
        this.getAllPatientDetails = res.res;
      }
    });
    // },50);
  }
  putConsultantByIdToApi(id, patientObj) {
    //  console.log(id,consultantObj)
    this.patientService
      .updatePatientObj(id, patientObj)
      .subscribe((res: any) => {
        if (res !== undefined) {
          // this.toastr.success('Consultant Updated Successfully');
          // this.router.navigate(['/pages/search-consultants']);
        } else {
          // this.toastr.error('Something went wrong!');
        }
      });
  }

}
