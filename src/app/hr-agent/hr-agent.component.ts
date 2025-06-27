import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { HrAgentService } from './hr-agent.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { error } from 'console';
import { EvaluationResponse } from '../models/evaluation-response.model';
import { Router } from '@angular/router';
import { StorageHandlerService } from '../common/services/storage-handler.service';
import { CommonConstants } from '../common/constants/Common-constants';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-hr-agent',
  standalone: true,
  imports: [AppComponent, CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './hr-agent.component.html',
  styleUrl: './hr-agent.component.scss'
})
export class HrAgentComponent implements OnInit{
  objectKeys = Object.keys;
  isLoading = false; 
  flag: boolean = true;
  fileName: any = '';
  file: any;
  uploadInProgress: boolean = false;
  selectedDocument: string = '';

  jobDescriptionFile: File | null = null;
  jobOptions = [
    { id: 'new', title: 'Create New' }
  ];

  selectedJobId: string = '';

  constructor(private router: Router,private uploadService:HrAgentService) {}

  ngOnInit(): void {}

  proceed() {
    if (this.selectedJobId === 'new') {
      this.router.navigate(['/job-post']);
    } else {
      // For now, we just log the selected job id
       this.onSubmit();
      // alert('Proceeding with Job ID: ' + this.selectedJobId);
    }
  }

  onFileChange(event: any, type: string): void {
    const files = event.target.files;
    if (type === 'jobDescription') {
      this.jobDescriptionFile = files[0];
    }
  }
  isFormValid(): boolean {
    return !!this.jobDescriptionFile ;
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;
    this.isLoading = true; 

    this.uploadDocs();
  }

  uploadDocs():void{
    // this.isLoading=true;
    this.uploadService.uploadDocs(this.jobDescriptionFile!).subscribe(
       {
        next: (response) => {
        

          StorageHandlerService.set(CommonConstants.APPID.job_description_data, JSON.stringify(response));
          console.log('Response from service set for job description :', StorageHandlerService.get(CommonConstants.APPID.job_description_data));

          this.isLoading=false;
            this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error(error);
          this.isLoading=false;
        }
       }
    )
  }
  ///


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.file = file;
    console.log(this.file);
    if (file) {
      this.fileName = file.name;
      if (this.selectedDocument != '') {
        this.flag = false;
      }
    }
  }

  
 
}
