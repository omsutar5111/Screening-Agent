import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardService } from './dashboard.service';
import { StorageHandlerService } from '../common/services/storage-handler.service';
import { CommonConstants } from '../common/constants/Common-constants';
import { CommonModule } from '@angular/common';
import { log } from 'node:console';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { HrAgentComponent } from "../hr-agent/hr-agent.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HrAgentComponent,NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  jobId: string = 'J101'; // This would come from route or service in real use
  jobTitle: string = 'Frontend Developer';
  job_description_data:any;
  uploadedFiles: File[] = [];
  isUploading: boolean = false;
  role: string = '';
experienceRange: string = '';
primarySkills: string[] = [];
goodToHaveSkills: string[] = [];
requiredTechnologies: string[] = [];

  constructor(private router: Router,private dashboardService:DashboardService) {}

  ngOnInit(): void {
    const data = StorageHandlerService.get(CommonConstants.APPID.job_description_data);
    this.job_description_data = typeof data === 'string' ? JSON.parse(data) : data;
  
    const extractedInfo = this.job_description_data.extracted_info;
  
    this.role = extractedInfo.role;
    this.experienceRange = extractedInfo.experience_range;
    this.primarySkills = extractedInfo.primary_skills;
    const gths = extractedInfo.good_to_have_skills || [];
    const rt = extractedInfo.required_technologies || [];
    this.goodToHaveSkills = Array.from(new Set([...gths, ...rt]));
    // this.requiredTechnologies = extractedInfo.required_technologies;
    console.log(this.primarySkills);
    console.log(this.goodToHaveSkills);

  

  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.uploadedFiles = Array.from(event.target.files);
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  uploadResumes(): void {
    if (this.uploadedFiles.length === 0) {
      alert('Please upload at least one resume.');
      return;
    }
    this.isUploading = true;

  const sessionId = 'shadgciwsgu556'; // Replace with dynamic value if needed

  const jdContext = {
    role: this.role,
    experience_range: this.experienceRange,
    primary_skills: this.primarySkills,
    good_to_have_skills: this.goodToHaveSkills,
    required_technologies: this.requiredTechnologies
  };

  this.dashboardService.uploadResumesWithJD(this.uploadedFiles, sessionId, jdContext)
    .subscribe({
      next: (response) => {
        this.isUploading = false;
        console.log('Upload successful:', response);
        StorageHandlerService.set(CommonConstants.APPID.analysis_result, JSON.stringify(response));
        // alert('All resumes uploaded successfully!');
        this.router.navigate(['/results']);
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isUploading = false;
        alert('Something went wrong while uploading resumes.');
      }
    });
  }
}



