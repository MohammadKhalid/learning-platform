import { Component, OnInit, Input } from '@angular/core';
import { IMAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'certificate-card',
  templateUrl: './cartificate-card.component.html',
  styleUrls: ['./cartificate-card.component.scss'],
})
export class CartificateCardComponent implements OnInit {
  private _scrollbarHidden: boolean;
  @Input() courses: any;
  data: any;
  serverUrl: string = `${IMAGE_URL}uploads/certifications/`;
  constructor() { }
  ngOnInit() {
    // this.data = [
    //   {
    //     id: 2,
    //     course: "Math",
    //     image: "card-img.jpg",
    //     title: "Math",
    //     xp: "990XP",
    //     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   },
    //   {
    //     id: 2,
    //     course: "Math",
    //     image: "card-img.jpg",
    //     title: "Math",
    //     xp: "990XP",
    //     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   },
    //   {
    //     id: 2,
    //     course: "Math",
    //     image: "card-img.jpg",
    //     title: "Math",
    //     xp: "990XP",
    //     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   },
    //   {
    //     id: 2,
    //     course: "Math",
    //     image: "card-img.jpg",
    //     title: "Math",
    //     xp: "990XP",
    //     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   },
    //   {
    //     id: 2,
    //     course: "Math",
    //     image: "card-img.jpg",
    //     title: "Math",
    //     xp: "990XP",
    //     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   }
    // ];

  }

}
