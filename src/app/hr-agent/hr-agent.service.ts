import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { EvaluationResponse } from '../models/evaluation-response.model';
import { StorageHandlerService } from '../common/services/storage-handler.service';
import { CommonConstants } from '../common/constants/Common-constants';

@Injectable({
  providedIn: 'root'
})
export class HrAgentService {

private upload_url='https://screeningbot.qa.skaleup.tech/api/v1/uploadJobDescription'
 constructor(private http:HttpClient){

 }


  uploadDocs(job_description:File):Observable<any>{
    const formData = new FormData();
    formData.append('job_description', job_description);
    return this.http.post(this.upload_url, formData).pipe(
      map((response: any) =>{
        console.log('Response from backend for job description :', response);
         return response;
      }),
    catchError((error) => {
      console.error(error);
      return of([]);
     })
  );
  }

  
}
