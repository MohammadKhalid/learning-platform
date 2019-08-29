import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { IMAGE_URL } from 'src/environments/environment';
import * as jsPDF from 'jspdf';
import * as moment from 'moment';


@Component({
  selector: 'app-progress-complete-card',
  templateUrl: './progress-complete-card.component.html',
  styleUrls: ['./progress-complete-card.component.scss'],
})
export class ProgressCompleteCardComponent implements OnInit {
  @Input() tabType: any;
  user: any;
  name: any
  coursename: any;
  incompleteCourses: any = []
  defaultImage: string = "assets/img/certification/default-course.jpg";
  serverUrl: string = `${IMAGE_URL}/certification/`;
  imageToShowOnError: string = "assets/img/certification/no-img.jpg";
  constructor(
    private restApi: RestApiService,
    private auth: AuthenticationService,
  ) { }
  @ViewChild('content') content: ElementRef
  datacertificate: any = [];
  date: any
  count = 0
  studentprogress :any =[];
  certificateData: any = 'Noman saleem'
  ngOnInit() {
    


    this.user = this.auth.getSessionData().user;
    if (this.tabType === 'inprogress') {
      this.restApi.get('course/uncomplete-course', { userId: this.user.id }).subscribe((resp: any) => {
        debugger
        this.incompleteCourses = resp.data
        this.studentprogress = resp.studentProgress
      })
    }
    else if (this.tabType === 'completed') {
      // your api end point goes here.
      this.restApi.get('course/completed-courses', { userId: this.user.id }).subscribe((resp: any) => {
        this.incompleteCourses = resp.data
        this.studentprogress = resp.studentProgress
      })
    }
  }


  downloadPdf(courseid) {


    this.restApi.getPromise(`course/get-certificate-details/${courseid}/${this.user.id}`).then(res => {
      this.datacertificate = res.data[0]

      debugger
      if (res.data.length > 0) {


        this.name = res.data[0].name
        this.coursename = res.data[0].Courses[0].title
        debugger
        //  2019-08-28T07:31:43.000Z
        this.date = moment(res.data[0].Courses[0].StudentCourse.updatedAt).format('MMMM,DD,YYYY')
        console.log('name :', this.date);

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

        if (this.count == 1) {
          debugger
          doc.save('Certificate.pdf')
        }
        this.count += 1
        this.downloadPdf(courseid)

      }
    }).catch(err => {

    })

  }





  progress(id,totalxp) {
     if(this.studentprogress.length > 0) {
       debugger;
    let totalCourse=this.studentprogress.filter(x=> x.courseId==id)
    let lessonExp=  totalCourse.map(x=> x.totalLessonExperience).reduce((next,current)=> next + current,0)
    let textExp=  totalCourse.map(x=> x.totalTextExperience).reduce((next,current)=> next + current,0)
    return ((lessonExp+textExp)/totalxp);
   
    
     }else {
       return 0 ;
     }
  }



  //   html2canvas(document.querySelector('#content'), 

  // 					 ).then(canvas => {
  // 
  // 	});
  // }


}

