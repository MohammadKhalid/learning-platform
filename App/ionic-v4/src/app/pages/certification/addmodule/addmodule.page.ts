import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormArray , FormControl, FormBuilder } from '@angular/forms';   


@Component({
  selector: 'app-addmodule',
  templateUrl: './addmodule.page.html',
  styleUrls: ['./addmodule.page.scss'],
})
export class AddmodulePage implements OnInit {
  addModelbutton : boolean = true;
  addDetail : FormGroup
  moduleDetail : boolean = false;
  
 
  constructor(private router: Router, private fb : FormBuilder) { }
  data: any;
  serverUrl: string="./assets/img/";
 
  ngOnInit() {
    this.data = [
      {
        id: 2,
        course: "Math",
        image: "card-img.jpg",
        title: "Math",
        xp: "990XP",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      {
        id: 2,
        course: "Math",
        image: "card-img.jpg",
        title: "Math",
        xp: "990XP",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      {
        id: 2,
        course: "Math",
        image: "card-img.jpg",
        title: "Math",
        xp: "990XP",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      {
        id: 2,
        course: "Math",
        image: "card-img.jpg",
        title: "Math",
        xp: "990XP",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      {
        id: 2,
        course: "Math",
        image: "card-img.jpg",
        title: "Math",
        xp: "990XP",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      }
    ];

  }

  loadmoduledetail() {
    this.addModelbutton = !this.addModelbutton;
    this.moduleDetail = !this.moduleDetail;
    // this.router.navigate(['/certification/moduledetail']);
  }
  

}
