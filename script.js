'use strict'

class Momentum {
  constructor(timeElement, dateElement, greetingElement, nameElement, focusElement) {
    this.currentTime = timeElement;
    this.currentDate = dateElement;
    this.currentHour = undefined;
    this.currentTheme = undefined;
    this.themes = this.getThemes();
    this.greeting = greetingElement;
    this.name = nameElement;
    this.focus = focusElement;
    this.setTime();
  }

  getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getThemes() {
    let array = [];
    for (let i = 0; i < 24; i++) {
      let theme;
      if (i < 6) {
        do {
          theme = `assets/img/night/day${this.getRandom(1, 12)}.jpg`;
        } while (array.includes(theme));
        array.push(theme);
      } else if (i < 12) {
        do {
          theme = `assets/img/morning/day${this.getRandom(1, 12)}.jpg`;
        } while (array.includes(theme));
        array.push(theme);
      } else if (i < 18) {
        do {
          theme = `assets/img/day/day${this.getRandom(1, 12)}.jpg`;
        } while (array.includes(theme));
        array.push(theme);
      } else {
        do {
          theme = `assets/img/evening/day${this.getRandom(1, 12)}.jpg`;
        } while (array.includes(theme));
        array.push(theme);
      }
    }
    return array;
  }

  setTime() {
    let date = new Date();
    this.currentTime.innerHTML = date.toLocaleString('ru-RU', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit'
                                                          });
    this.currentDate.innerHTML = date.toLocaleString('en-EN', {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric'
                                                          });

    this.currentHour = date.toLocaleString('ru-RU', {hour: '2-digit'});
    this.currentMinSec = date.toLocaleString('ru-RU', {minute: '2-digit', second: '2-digit'});

    this.greeting.innerHTML = (this.currentHour < 6) ? 'night' :
                              (this.currentHour < 12) ? 'morning' :
                              (this.currentHour < 18) ? 'day' : 'evening';

    if (this.currentMinSec == '00:00') {
      this.currentTheme = +this.currentHour;
      this.changeBackground();
    }
  }

  changeBackground() {
    document.body.style = `background-image: url(${this.themes[+this.currentTheme]})`;
  }

  setTheme() {
    if (this.currentTheme == 23) {
      this.currentTheme = 0;
    } else if (this.currentTheme == undefined) {
      this.currentTheme = +this.currentHour;
    } else this.currentTheme += 1;
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

  setTimer() {
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

let time = document.querySelector('.time');
let date = document.querySelector('.date');
let greeting = document.querySelector('.greeting')
let name = document.querySelector('.name');
let focus = document.querySelector('.focus');
let btnChangeTheme = document.querySelector('.change-theme');

let momentum = new Momentum(time, date, greeting, name, focus);

momentum.setTimer();
momentum.getData();
momentum.initializeListeners();
momentum.setTheme();
momentum.changeBackground();

btnChangeTheme.addEventListener('click', function() {
  momentum.setTheme();
  momentum.changeBackground();
  btnChangeTheme.disabled = true;
  setTimeout(() => btnChangeTheme.disabled = false, 1000);
})
