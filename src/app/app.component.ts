import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public language!: string;

  ngOnInit(): void {
    this.language = localStorage.getItem('lang') || 'ru-RU';
  }

  changeLang(lang: string): void {
    this.language = lang;
    localStorage.setItem('lang', lang);
  }
}
