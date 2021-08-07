import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PatientService } from 'src/app/shared/services/patients/patient.service';
import { Patient } from '../../shared/models/patient';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  patientObj:Observable<Patient>;
  patient:any = [];
  _deletePatientId:any;
  searchConsultant:String;
  page: any = 0;
  itemsPerPage: number = 5;
  previousPage: any;
  totalItems: any;
  _patients: Patient;
  _searchPatientDetailsId: any;

  constructor(private patientService: PatientService, private router: Router ) {
    this._patients = new Patient();
  }

  ngOnInit() {
    this.getAllPatients(this._patients);
  }

  getAllPatients(patientObj){
    this.patientObj = this.patientService.getAllPatients(patientObj);
    this.patientObj.subscribe((res:any) => {
      if(res){
        this.totalItems = res.res.total;
        this.patient = res.res.results;
      }else{
        this.patient = [];
        this.totalItems = 0;
      }
    },(error) => {
      console.log(error);
    })

  }

  deletePatient(id){
    this.deletePatientByPatientId(id);
  }

  deletePatientByPatientId(deletePatientId){
    this.patientService.deletePatientObj(deletePatientId).subscribe((res :any) => {
      if (res.success) {
        this.getAllPatients(this._patients);
      } else {
        // this.toastr.error('Soemthing is wrong');
      }
    })
  }

  editPatient(id){
    this.router.navigate(['pages/patientProfile', id]);
  }

  onSearch(searchValue){
    this._patients.SearchText = searchValue;
    this.getAllPatients(this.patient);
  }

  loadPage(page:number){
    if(page !== this.previousPage){
      this._patients.PageNo = page - 1;
      this.previousPage = page;
      this.getAllPatients(this._patients);
    }
  }

  sort(columnName:any){
    this._patients.SortItem = columnName;
    if(this._patients.SortOrder === "ASC"){
      this._patients.SortOrder = "DESC";
    }else{
      this._patients.SortOrder = "ASC";
    }
    this.getAllPatients(this._patients);
  }

}
