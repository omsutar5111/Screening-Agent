import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private  api_url = 'https://screeningbot.qa.skaleup.tech/api/v1/analyse/resume'
  constructor(private http:HttpClient) { }

  uploadResumesWithJD(files: File[], sessionId: string, jdContext: any): Observable<any> {
    const formData = new FormData();
  
    files.forEach(file => {
      formData.append('resumes', file);
    });
  
    formData.append('session_id', sessionId);
    formData.append('jd_context', JSON.stringify(jdContext));
  
    return this.http.post(this.api_url, formData);
  }
  
  
}
