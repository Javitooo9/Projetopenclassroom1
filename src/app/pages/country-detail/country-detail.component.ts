import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  country!: Olympic;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    const countryId = Number(this.route.snapshot.paramMap.get('id'));
    this.olympicService['getOlympicById'](countryId).subscribe((data: Olympic) => {
      this.country = data;
      this.totalMedals = this.calculateTotalMedals(data);
      this.totalAthletes = this.calculateTotalAthletes(data);
    });
  }

  private calculateTotalMedals(country: Olympic): number {
    return country.participations.reduce((sum, p) => sum + p.medalsCount, 0);
  }

  private calculateTotalAthletes(country: Olympic): number {
    return country.participations.reduce((sum, p) => sum + p.athleteCount, 0);
  }
}
