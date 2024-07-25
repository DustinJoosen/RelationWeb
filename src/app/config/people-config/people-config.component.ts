import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CdkColumnDef} from "@angular/cdk/table";
import {PersonService} from "../../services/person.service";
import {Person} from "../../services/environment.service";
import {ImgurService} from "../../services/imgur.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-people-config',
  standalone: true,
  imports: [
    MatTableModule,
    MatButton,
    MatFormField,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    NgIf
  ],
  providers: [
    CdkColumnDef
  ],
  templateUrl: './people-config.component.html',
  styleUrl: './people-config.component.css'
})
export class PeopleConfigComponent implements OnInit {
  displayedColumns: string[] = ['name', 'imageAdd', 'image', 'actions'];
  dataSource = new MatTableDataSource<Person>();

  public newPerson: Person = {name: ''};

  public names?: string;

  constructor(private personService: PersonService, private imgur: ImgurService) { }

  ngOnInit() {
    let people = this.personService.getPeople();
    people.reverse();
    this.dataSource = new MatTableDataSource<Person>(people);
  }

  addPerson() {
    this.names?.split('\n').forEach(person => {
      this.personService.addPerson({name: person})
    })

    this.ngOnInit();
  }

  deletePerson(name: string) {
    this.personService.removePerson({name: name})
    this.ngOnInit();
  }

  async setImage(event: any, element: Person) {
    let file = event.target.files[0];
    if (!file) {
      return;
    }

    await this.imgur.uploadImage(file)
      .then(response => {
        this.personService.addPicture({
          name: element.name,
          picture: response?.data?.link
        });
        this.ngOnInit();
      })
      .catch(error => {
        alert("nope, didn't work. send me a message :p");
      });
  }
}
