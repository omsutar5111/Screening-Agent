import { Component } from '@angular/core';
import { app } from '../../../server';
import { AppComponent } from '../app.component';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
interface Job {
  roleName: string;
  date: string;
  experience: string;
  description: string;
}
@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.scss'
})
export class PostJobComponent {
  jobForm: FormGroup;
  experienceLevels = ['Entry Level', 'Intermidiate', 'Profestional', 'Expert'];

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      jobId: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobLocation: ['', Validators.required],
      experienceMin: ['', [Validators.required, Validators.min(0)]],
      experienceMax: ['', [Validators.required, Validators.min(0)]],
      jobDescription: ['', Validators.required],
      skills: this.fb.array([this.createSkillGroup()])
    });
  }

  createSkillGroup(): FormGroup {
    return this.fb.group({
      skill: ['', Validators.required],
      experienceLevel: ['', Validators.required]
    });
  }

  get skills(): FormArray {
    return this.jobForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.createSkillGroup());
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  onSubmit() {
    if (this.jobForm.valid) {
      console.log('Generated Job Description:', this.jobForm.value);
      alert('Job Description generated successfully!\n\n' + JSON.stringify(this.jobForm.value, null, 2));
    }
  }
}

