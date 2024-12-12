import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  countries: Olympic[] = [];

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((data) => {
      if (data) {
        this.countries = data;
        this.createChart();
      }
    });
  }

  createChart() {
    const ctx = document.getElementById('medalsChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found!');
      return;
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.countries.map((country) => country.country),
        datasets: [
          {
            data: this.countries.map((country) =>
              country.participations
                ? country.participations.reduce(
                    (sum, p) => sum + (p.medalsCount || 0),
                    0
                  )
                : 0
            ),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      },
      options: {
        responsive: true,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index; // Get index of clicked slice
            const countryId = this.countries[index].id; // Get country ID
            this.navigateToCountryDetail(countryId); // Navigate with ID
          }
        },
      },
    });
  }

  navigateToCountryDetail(id: number): void {
    this.router.navigate([id]);
  }
}

