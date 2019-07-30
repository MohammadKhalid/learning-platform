import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  name: string;
  quizes: any[];
  // options: [];

  quizForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.quizes = [{
      question: '',
      options: [
        { option: '', answer: false }
      ],
      experience: ''
    }];
    /* Initiate the form structure */
    // this.quizForm = this.fb.group({
    //   quizes: this.fb.array([
    //     this.fb.group(
    //       { question: '', options: '' }
    //     )
    //   ])
    // })
    // this.quizForm = this.fb.group({
    //   quizes: this.fb.array([
    //     this.fb.group(
    //       {
    //         question: '',
    //         options:
    //           this.fb.array([
    //             this.fb.group(
    //               { option: '' }
    //             )
    //           ])
    //       }
    //     )
    //   ])
    // })
  }

  // get quizesQues() {
  //   return this.quizForm.get('quizes') as FormArray;
  // }
  addOption(obj) {
    obj.push({ text: '', answer: false });
  }
  addQuestion() {
    this.quizes.push({
      question: '',
      options: [
        { text: '', answer: false }
      ],
      experience:''
    });
  }
  // addQuestion() {
  //   this.quizesQues.push(
  //     this.fb.group(
  //       {
  //         question: '', options:
  //           this.fb.array([
  //             this.fb.group(
  //               { option: '' }
  //             )
  //           ])
  //       }
  //     ));
  // }

  deleteQuestion(index) {
    this.quizes.splice(index, 1);
  }


  // // get set option
  // get optionsQues() {
  //   return this.quizForm.get('options') as FormArray;
  // }

  // //add option
  // addOption() {
  //   this.optionsQues.push(this.fb.group({ option: '' }));
  // }

  // //delete option
  // deleteOption(index) {
  //   this.optionsQues.removeAt(index);
  // }
}