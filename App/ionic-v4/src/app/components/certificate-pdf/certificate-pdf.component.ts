import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-certificate-pdf',
  templateUrl: './certificate-pdf.component.html',
  styleUrls: ['./certificate-pdf.component.scss'],
})
export class CertificatePdfComponent implements OnInit {
@ViewChild('content') content:ElementRef 
  constructor() { }

  ngOnInit() {}
  public downloadPdf(){
    let doc = new jsPDF('l', 'mm',[594, 841]);
    let specialElementHandlers = {
      '#editor' : function(element,renderer){
        return true;
      }
    }
    
    let content = this.content.nativeElement;
    let image = new Image();
    image.src ='../../../assets/img/browser/firefoxlanescape.png'
    doc.fromHTML(content.innerHTML,50,15,{
      'width': 190,
      'elementHandlers': specialElementHandlers,
     
    });
    doc.addImage(image,'PNG',14,15)
    doc.save('done.pdf')
  }


}
