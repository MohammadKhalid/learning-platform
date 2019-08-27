import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import { toBase64String } from '@angular/compiler/src/output/source_map';


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
    let image2 = new Image();
    image.src ='../../../assets/img/certification/frame.png'
    image2.src='../../../assets/img/certification/logo.png'

    doc.fromHTML(content.innerHTML,50,15,{
      
      'width': 190,
      'elementHandlers': specialElementHandlers,
     
    });
    doc.addImage(image, 'PNG',22,12,250,190)
    doc.addImage(image2,'PNG', 100,40,80,36)
    doc.save('done.pdf')
    doc.output('done.pdf')





  //   html2canvas(document.querySelector('#content'), 
								
	// 					 ).then(canvas => {
	// 		let pdf = new jsPDF('p', 'mm', 'a4');
	// 		pdf.addImage(canvas.toDataURL('image/png'), 'png',  211, 298);
	// 		pdf.save('noman.pdf');
	// 	});
  // }


}
}



