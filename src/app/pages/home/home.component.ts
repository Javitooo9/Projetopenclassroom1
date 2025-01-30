import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<any> = of(null);
  countries: Olympic[] = [];
  totalParticipations: number = 0;
  totalCountries: number = 0;
  private subscription: Subscription = new Subscription();
  private chart: Chart | null = null;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    const sub = this.olympicService.getOlympics().subscribe((data) => {
      if (data) {
        this.countries = data;
        this.totalCountries = data.length;
        this.totalParticipations = data.reduce((sum, country) => 
          sum + (country.participations ? country.participations.length : 0), 0
        );
        this.createChart();
      }
    });
    this.subscription.add(sub);
    window.addEventListener('resize', this.resizeChart.bind(this));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.chart) {
      this.chart.destroy();
    }
    window.removeEventListener('resize', this.resizeChart.bind(this));
  }

  createChart() {
    const ctx = document.getElementById('medalsChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found!');
      return;
    }

    this.chart = new Chart(ctx, {
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
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const countryId = this.countries[index].id;
            this.navigateToCountryDetail(countryId);
          }
        },
      },
    });
  }

  resizeChart() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  navigateToCountryDetail(id: number): void {
    this.router.navigate([id]);
  }
}

