import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { IMAGE_URL } from 'src/environments/environment';
// import { CertificatePdfComponent } from '../../certificate-pdf/certificate-pdf.component';
import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-progress-complete-card',
  templateUrl: './progress-complete-card.component.html',
  styleUrls: ['./progress-complete-card.component.scss'],
})
export class ProgressCompleteCardComponent implements OnInit {
  @Input() tabType: any;
  // @ViewChild(CertificatePdfComponent) pdf: CertificatePdfComponent
  user: any;
  incompleteCourses: any = []
  defaultImage: string = "assets/img/certification/default-course.jpg";
  serverUrl: string = `${IMAGE_URL}/certification/`;
  imageToShowOnError: string = "assets/img/certification/no-img.jpg";
  constructor(
    private restApi: RestApiService,
    private auth: AuthenticationService,
    // private comp: CertificatePdfComponent
  ) { }
  @ViewChild('content') content: ElementRef

  certificateData: any = 'Noman saleem'
  ngOnInit() {


    this.user = this.auth.getSessionData().user;
    if (this.tabType === 'inprogress') {
      this.restApi.get('course/uncomplete-course', { userId: this.user.id }).subscribe((resp: any) => {
        this.incompleteCourses = resp.data
      })
    }
    else if (this.tabType === 'completed') {
      // your api end point goes here.
      this.restApi.get('course/completed-courses', { userId: this.user.id }).subscribe((resp: any) => {
        this.incompleteCourses = resp.data
      })
    }
  }
 

  downloadPdf() {
   
  
      
        let doc = new jsPDF('l', 'mm', 'a4', 1);
        // doc.image_compression()

        let specialElementHandlers = {
          '#editor': function (element, renderer) {
            return true;
          }
        }

        let content = this.content.nativeElement;
        let image = new Image();
        let image2 = new Image();
        image.src = '../../../assets/img/certification/frame.png'
        image2.src = '../../../assets/img/certification/logo.png'

        doc.fromHTML(content.innerHTML, 50, 15, {

          'width': 190,
          'elementHandlers': specialElementHandlers,

        });
        doc.addImage(image, 'PNG', 22, 12, 250, 190, '', 'FAST')
        doc.addImage(image2, 'PNG', 100, 40, 80, 36, '', 'FAST')
        doc.save('Certificate.pdf')

      }
    








    //   html2canvas(document.querySelector('#content'), 

    // 					 ).then(canvas => {
    // 
    // 	});
    // }


  }

