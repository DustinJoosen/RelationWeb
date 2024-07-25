import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CdkColumnDef} from "@angular/cdk/table";
import {EnvironmentService, RelationType} from "../../services/environment.service";
import {RelationtypeService} from "../../services/relationtype.service";

@Component({
  selector: 'app-relation-type-config',
  standalone: true,
  imports: [
    MatTableModule,
    MatButton,
    MatFormField,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    CdkColumnDef
  ],
  templateUrl: './relation-type-config.component.html',
  styleUrl: './relation-type-config.component.css'
})
export class RelationTypeConfigComponent implements OnInit {
  displayedColumns: string[] = ['name', 'color', 'actions'];
  dataSource = new MatTableDataSource<RelationType>();

  public newType: RelationType = {name: '', color: ''};

  constructor(private relationTypeService: RelationtypeService) { }

  ngOnInit() {
    let types = this.relationTypeService.getTypes();
    types.reverse();
    this.dataSource = new MatTableDataSource<RelationType>(types);
  }

  addType() {
    this.relationTypeService.addRelationType(this.newType);
    this.ngOnInit();
  }

  deleteType(relationType: RelationType) {
    this.relationTypeService.removeRelationType(relationType);
    this.ngOnInit();
  }
}
