import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageHandlerService } from '../common/services/storage-handler.service';
import { CommonConstants } from '../common/constants/Common-constants';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { NgChartsModule } from 'ng2-charts';
// import { ChartType, ChartOptions, Plugin, ChartData } from 'chart.js';
import {ChartType, ChartOptions, Plugin, ChartData ,Chart,ArcElement,Tooltip,Legend,DoughnutController} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);


interface CandidateResult {
  name: string;
  experience: number;
  relevant_experience: number;
  summery:string;
  skills: string[];
  matchingSkills: string[];
  primarySkillsScore: { [key: string]: number };
  matchPercentage: number;
  hireStatus: string;
  job_role : string;
  preferred_location : string;
}
@Component({
  selector: 'app-result',
  standalone: true,
  imports: [FormsModule,CommonModule,NavbarComponent,FooterComponent,NgChartsModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
  objectKeys = Object.keys;
  results: CandidateResult[] = [];
  sortBy: string = '';
  isLoading: boolean = true;
  resume_data:any;
  dropdownOpen = false;

  ngOnInit(): void {
    const stored = StorageHandlerService.get(CommonConstants.APPID.analysis_result);
    this.resume_data=typeof stored === 'string' ? JSON.parse(stored) : stored;
    this.sortBy = 'status'; // Default sort by match percentage
  
    this.results = Array.isArray(this.resume_data?.scores)
    ? this.resume_data.scores.map((item: any) => ({
        name: item.candidate_name,
        experience: item.experience,
        relevant_experience: item.relevant_experience,
        summery: item.summary,
        skills: item.skills,
        matchingSkills: item.matching_must_have_skills,
        primarySkillsScore:(item.must_have_skills_score || []).reduce((acc: any, score: number, idx: number) => {
          const skill = item.matching_must_have_skills?.[idx];
          if (skill !== undefined && skill !== null && skill !== '') {
            acc[skill] = score;
          }
          return acc;
        }, {}),
        matchPercentage: item.overall_match_percentage,
        hireStatus: item.Hire_status
      }))
    : [];
    this.sortResults(this.sortBy);
  this.isLoading = false;
  
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  sortResults(sort_by:string) {
    this.dropdownOpen = false;
    this.sortBy = sort_by;
    if (this.sortBy === 'match') {
      this.results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } else if (this.sortBy === 'experience') {
      this.results.sort((a, b) => b.experience - a.experience);
    } else if (this.sortBy === 'status') {
        const statusOrder = ['Selected', 'Near Fit', 'Rejected'];
        this.results.sort((a, b) => statusOrder.indexOf(a.hireStatus) - statusOrder.indexOf(b.hireStatus));
    } 
  }

  downloadCard(index: number) {
    const element = document.getElementById(`card-${index}`);
    if (element) {
      html2canvas(element).then((canvas:any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${this.results[index].name}.pdf`);
      });
    }
  }

  downloadReport(): void {
    if (!this.results || this.results.length === 0) {
      console.error('No analysis data available to download.');
      return;
    }
  
    const csvData = this.generateCSV(this.results);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'resume_analysis_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  private generateCSV(data: CandidateResult[]): string {
    const headers = [
      'Candidate Name',
      'Experience (Years)',
      'Relevant Experience (Years)',
      'Skills',
      'Primary Skills Score',
      'Matching Skills',
      'Match Percentage',
      'Hire Status',
      'Summary'
    ];
  
    const rows = data.map((candidate: CandidateResult) => {
      return [
        this.formatField(candidate.name),
        candidate.experience,
        candidate.relevant_experience,
        this.formatSkills(candidate.skills),
        this.formatSkillScores(candidate.primarySkillsScore),
        this.formatSkills(candidate.matchingSkills),
        candidate.matchPercentage,
        candidate.hireStatus,
        this.formatSummary(candidate.summery)
      ];
    });
  
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  }
  
  private formatSkills(skills: string[]): string {
    return this.formatField(skills.join('; '));
  }
  
  private formatSkillScores(scoreObj: { [key: string]: number }): string {
    const entries = Object.entries(scoreObj).map(([skill, score]) => `${skill}: ${score}`);
    return this.formatField(entries.join('; '));
  }
  
  private formatSummary(summary: string): string {
    return this.formatField(summary);
  }
  
  private formatField(field: string | number): string {
    const safeString = typeof field === 'string' ? field : field.toString();
    return `"${safeString.replace(/"/g, '""')}"`;
  }

  formatSummarywithBulletPoints(summary: string): string[] {
    return summary
      ?.split(/[.\n]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Selected':
        return 'status-selected';
      case 'Rejected':
        return 'status-rejected';
      case 'Near Fit':
        return 'status-nearfit';
      default:
        return '';
    }
  }

  getSkillBarColor(score: number): string {
    if (score <= 5) return 'bar-red';
    if (score <= 7) return 'bar-yellow';
    return 'bar-green';
  }

  getSkillBarMainColor(score: number): string {
    if (score <= 5) return 'main-bar-red';
    if (score <= 7) return 'main-bar-yellow';
    return 'main-bar-green';
  }

  getChartData(matchRaw: string | number,hireStatus : string): ChartData<'doughnut'> {
    const match =
    typeof matchRaw === 'string'
      ? parseInt(matchRaw.replace('%', ''), 10)
      : matchRaw;
    let backgroundColor = []

    switch (hireStatus.toLowerCase()) {
      case 'selected':
        backgroundColor = ['#00B500', '#C5EDD1']; // green
        break;
      case 'near fit':
        backgroundColor = ['#FF8900', '#FFD4B8']; // amber
        break;
      case 'rejected':
        backgroundColor = ['#B40000', '#FFD0E1']; // red
        break;
      default:
        backgroundColor = ['#1778EB', '#D0E4FF']; // grey
    }
  


    return {
      labels: ['Match', 'Gap'],
      datasets: [
        {
          data: [match, (100 - match)],
          backgroundColor: backgroundColor,
          borderWidth: 0
        }
      ]
    };
  }  
  
  
  getChartOptions(): ChartOptions<'doughnut'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      cutout: '70%'
    };
  }
  
  
  
  getCenterTextPlugin(match: number): Plugin {
    return {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        const { width, height, ctx } = chart;
        ctx.save(); 
  
        const percentText = `${match}%`;
        const labelText = 'Overall Match';
  
        const percentFontSize = height / 6;
        const labelFontSize = height / 12;
  
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
  
        // Draw label
        ctx.font = `normal ${labelFontSize}px sans-serif`;
        ctx.fillText(labelText, width / 2, height / 2 - 10);
  
        // Draw percent
        ctx.font = `bold ${percentFontSize}px sans-serif`;
        ctx.fillText(percentText, width / 2, height / 2 + 20);
  
        ctx.restore();
      }
    };
  }
}


