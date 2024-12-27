import { Component } from '@angular/core';
import { ApiservicesService } from '../apiservices.service';


interface ChatMessage {
  text: string;
  type: string;
  columns?: string[];
  results?: any[];
}

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})


export class MainpageComponent {
  selectedModel = 'gpt3516k';
  selectedDatabase = 'schema-sqlserver';
  keepHistory = false;
  userInput = '';
  chatMessages: ChatMessage[] = [
    { text: 'Start exploring your database with AI-powered insights...', type: 'info' }
  ];

  constructor(private apiService: ApiservicesService) {}

  sendMessage() {
    if (this.userInput.trim()) {
      // Add user message
      this.chatMessages.push({ text: this.userInput, type: 'success' });
      
      const payload = {
        query: this.userInput,
        model: this.selectedModel,
        index: this.selectedDatabase
      };

      this.apiService.sendQuery(payload.query, payload.model, payload.index).subscribe({
        next: (response) => {
          // Create a new message object with both query and results
          const resultMessage: ChatMessage = {
            text: `SQL Query: ${response.query}`,
            type: 'info',
            columns: response.columns,
            results: response.results
          };
          
          // Add the message with results to chat
          this.chatMessages.push(resultMessage);
          
          // Scroll to bottom after results are added
          setTimeout(() => {
            const chatContainer = document.getElementById('chatMessages');
            if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight;
            }
          }, 100);
        },
        error: (err) => {
          console.error('Error sending query', err);
          this.chatMessages.push({
            text: 'Error sending query. Please try again.',
            type: 'info'
          });
        }
      });

      // Clear input after sending
      this.userInput = '';
    }
  }
}