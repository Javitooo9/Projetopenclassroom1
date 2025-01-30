import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Subscription } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  country!: Olympic;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  totalParticipations: number = 0;
  private subscription!: Subscription;
  private chart!: Chart;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const countryId = Number(this.route.snapshot.paramMap.get('id'));
    this.subscription = this.olympicService.getOlympicById(countryId).subscribe((data) => {
      if (data) {
        this.country = data;
        this.totalMedals = this.calculateTotalMedals(data);
        this.totalAthletes = this.calculateTotalAthletes(data);
        this.totalParticipations = data.participations.length;
        this.createChart();
      } else {
        console.error(`Country with ID ${countryId} not found.`);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private calculateTotalMedals(country: Olympic): number {
    return country.participations.reduce((sum, p) => sum + (p.medalsCount || 0), 0);
  }

  private calculateTotalAthletes(country: Olympic): number {
    return country.participations.reduce((sum, p) => sum + (p.athleteCount || 0), 0);
  }

  createChart(): void {
    const ctx = document.getElementById('medalsChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found!');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.country.participations.map((p) => p.year.toString()),
        datasets: [
          {
            label: 'Nombre de médailles',
            data: this.country.participations.map((p) => p.medalsCount || 0),
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54,162,235,0.2)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Année',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Nombre de médailles',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
