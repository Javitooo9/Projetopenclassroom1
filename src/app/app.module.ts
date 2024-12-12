import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OlympicService } from './core/services/olympic.service';

import { CountryDetailComponent } from './pages/country-detail/country-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    CountryDetailComponent, // Assurez-vous que ce composant est déclaré ici
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [OlympicService], // Vérifiez que le service est listé ici
  bootstrap: [AppComponent],
})
export class AppModule {}

