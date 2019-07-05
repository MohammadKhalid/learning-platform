import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-level-settings',
  templateUrl: './level-settings.page.html',
  styleUrls: ['./level-settings.page.scss'],
})
export class LevelSettingsPage implements OnInit {

  initialLevel : string = '';
  initialExperience : string = '';

  constructor() { }

  ngOnInit() {
  }

  saveSettings(){
    alert(this.initialExperience)
  }
}
