import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/shared/services/patients/patient.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalPatients: any;

  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.getAllPatients();
  }

  getAllPatients(){
    this.patientService.getPatient().subscribe((res: any) => {
      this.totalPatients =  res.res.length;
    })
  }
}
