import {Component, Input, OnInit} from '@angular/core';
import {RelationtypeService} from "../../services/relationtype.service";
import {Relation, RelationType} from "../../services/environment.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-legenda',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './legenda.component.html',
  styleUrl: './legenda.component.css'
})
export class LegendaComponent implements OnInit {
  @Input()
  public selectedType?: RelationType | null;

  @Input()
  public highlight = false;

  public relationTypes: RelationType[] = [];

  constructor(private relationTypeService: RelationtypeService) { }

  ngOnInit() {
    this.relationTypes = this.relationTypeService.getTypes();
  }

  isThisTypeSelected(type: RelationType) {
    if (this.selectedType === null)
      return false;

    if (!this.highlight)
      return false;

    return this.selectedType?.name === type.name;
  }
}
