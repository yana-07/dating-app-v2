import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css'
})
export class StarButton {
  disabled = input.required<boolean>();
  selected = input.required<boolean>();
  clickEvent = output<Event>();

  onClick(event: Event) {
    this.clickEvent.emit(event)
  }
}
