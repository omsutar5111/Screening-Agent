import { Component } from '@angular/core';
import { Router } from '@angular/router';
interface Chatbot {
  title: string;
  description: string;
  image: string;
  route: string;
}
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})

export class HomePageComponent {
  chatbots: Chatbot[] = [
    {
      title: 'Chatbot 1',
      description: 'This is the first chatbot',
      image: 'assets/images/bajajIcon.png',
      route: 'chatbot1'
    },
    {
      title: 'Chatbot 2',
      description: 'This is the second chatbot',
      image: 'assets/images/bajajIcon.png',
      route: 'chatbot2'
    },
    {
      title: 'Chatbot 3',
      description: 'This is the third chatbot',
      image: 'assets/chatbot3.jpg',
      route: 'chatbot3'
    }
  ];

  constructor(private router: Router) {}

  navigateToComponent(route: string) {
    if(route=='hrBot'){
      window.open('https://bfsd.npu.bfsgodirect.com/hr-chatbot/');
    }
    else{
    this.router.navigate([route]);
    }
  }
 
}
