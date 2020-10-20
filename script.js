'use strict'

class Momentum {
  constructor(timeElement, greetingElement, nameElement, focusElement) {
    this.currentTime = timeElement;
    this.currentHour = undefined;
    this.greeting = greetingElement;
    this.name = nameElement;
    this.focus = focusElement;
    this.setTime();
  }

  setTime() {
    let date = new Date();
    this.currentTime.innerHTML = date.toLocaleString('ru-RU', {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit'
                                                          });
    this.currentHour = date.toLocaleString('ru-RU', {hour: '2-digit'});
    this.greeting.innerHTML = (this.currentHour >= 0 && this.currentHour <= 6) ? 'night, ' :
                              (this.currentHour > 6 && this.currentHour <= 12) ? 'morning, ' :
                              (this.currentHour > 12 && this.currentHour <= 18) ? 'day, ' : 'evening, ';
    this.changeBackground();
  }

  changeBackground() {
    document.body.style = `background-image: url("assets/img/day${+this.currentHour+1}.jpg")`
  }

  getData() {
    if (localStorage.getItem('name')) {
      this.name.innerHTML = localStorage.getItem('name');
    } else this.name.innerHTML = `[Enter your name]`;
    if (localStorage.getItem('focus')) {
      this.focus.innerHTML = localStorage.getItem('focus');
    } else this.focus.innerHTML = `[Enter your focus]`;
  }

  setData() {
    if (this.innerHTML) localStorage.setItem(`${this.classList}`, this.innerHTML);
    else {
      localStorage.removeItem(`${this.classList}`);
      this.innerHTML = `[Enter your ${this.classList}]`;
    }
  }

  deleteData() {
    if (this.textContent == `[Enter your ${this.classList}]`) {
      this.innerHTML = '';
    }
  }

  leaveFocus(evt) {
    if (evt.key == 'Enter') this.blur();
  }

  timer() {
    setInterval(this.setTime.bind(this), 1000);
  }

  initializeListeners() {
    this.name.addEventListener('blur', this.setData);
    this.focus.addEventListener('blur', this.setData);
    this.name.addEventListener('click', this.deleteData);
    this.focus.addEventListener('click', this.deleteData);
    this.name.addEventListener('keydown', this.leaveFocus);
    this.focus.addEventListener('keydown', this.leaveFocus);
  }
}

let time = document.querySelector('time');
let greeting = document.querySelector('.greeting')
let name = document.querySelector('.name');
let focus = document.querySelector('.focus');

let momentum = new Momentum(time, greeting, name, focus);

momentum.timer();
momentum.getData();
momentum.initializeListeners();
