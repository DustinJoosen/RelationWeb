import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import {RouterModule} from "@angular/router";
import {LegendaComponent} from "./dashboard/legenda/legenda.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
