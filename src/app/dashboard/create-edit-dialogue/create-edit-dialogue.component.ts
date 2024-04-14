import {Component, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {RelationType} from "../../services/environment.service";
import {CommonModule, NgForOf} from "@angular/common";
import {RelationtypeService} from "../../services/relationtype.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-create-edit-dialogue',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
    FormsModule,
    CommonModule
  ],
  templateUrl: './create-edit-dialogue.component.html',
  styleUrl: './create-edit-dialogue.component.css'
})
export class CreateEditDialogueComponent implements OnInit {
  relationTypes: RelationType[] = [];
  newRelationType: string = '';

  constructor(
    private relationTypeService: RelationtypeService,
    private dialogRef: MatDialogRef<CreateEditDialogueComponent>
  ) { }

  ngOnInit() {
    this.relationTypes = this.relationTypeService.getTypes();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveDialog(): void {
    this.dialogRef.close(this.newRelationType);
  }
}
