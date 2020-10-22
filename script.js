'use strict'

class Momentum {
  constructor(timeElement, dateElement, greetingElement, nameElement,
    focusElement, quoteElement, authorElement, cityElement, iconElement, temperatureElement,
    windElement, humidityElement) {
    this.currentTime = timeElement;
    this.currentDate = dateElement;
    this.currentHour = undefined;
    this.currentTheme = undefined;
    this.currentCity = cityElement;
    this.weatherIcon = iconElement;
    this.weatherTemperature = temperatureElement;
    this.weatherWind = windElement;
    this.weatherHumidity = humidityElement;
    this.greeting = greetingElement;
    this.name = nameElement;
    this.focus = focusElement;
    this.quote = quoteElement;
    this.author = authorElement;
    this.themes = this.getThemes();
    this.setTime();
    this.getQuote();
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
    if (localStorage.getItem('city')) {
      this.currentCity.innerHTML = localStorage.getItem('city');
      this.getForecast();
    } else this.currentCity.innerHTML = `[Enter your city]`;
  }

  async getQuote() {
    const url = `https://quote-garden.herokuapp.com/api/v2/quotes/random`;
    const res = await fetch(url);
    const data = await res.json();
    const quoteLength = data.quote.quoteText.split('').length;
    if (quoteLength > 210) {
      this.getQuote();
    } else {
      this.quote.innerHTML = data.quote.quoteText;
      this.author.innerHTML = data.quote.quoteAuthor;
    }
  }

  async getForecast() {
    if (this.currentCity.innerHTML == '[Enter your city]' || this.currentCity.innerHTML == 'City not found') return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.currentCity.innerHTML}&lang=ru&appid=44b2d3fdccce84ec826b95160704c99f&units=metric`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      this.weatherIcon.classList.remove(this.weatherIcon.classList[2]);
      this.weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      this.weatherTemperature.innerHTML = `${data.main.temp}&#176;C`;
      this.weatherWind.innerHTML = `${data.wind.speed} m/s`;
      this.weatherHumidity.innerHTML = `${data.main.humidity}%`;
    } catch(err) {
      if (err.message == "Cannot read property '0' of undefined") {
        this.currentCity.innerHTML = 'City not found';
      } else this.currentCity.innerHTML = 'Sorry, service is unavailable :c';
      localStorage.removeItem('city');
      this.weatherTemperature.innerHTML = ` `;
      this.weatherWind.innerHTML = ` `;
      this.weatherHumidity.innerHTML = ` `;
    }
  }

  setData() {
    if (this.innerHTML == '') {
      if (localStorage.getItem(`${this.classList}`)) {
        this.innerHTML = localStorage.getItem(`${this.classList}`);
      } else {
        this.innerHTML = `[Enter your ${this.classList}]`;
      }
    } else {
      localStorage.setItem(`${this.classList}`, this.innerHTML);
      this.innerHTML = localStorage.getItem(`${this.classList}`);
    }
    if (this.classList == 'city') {
      momentum.getForecast();
    }
  }

  deleteData() {
    this.innerHTML = '';
  }

  checkElement(evt) {
    if (evt.key == 'Enter') this.blur();
    if (this.classList == 'name' && this.innerHTML.length == 15 && event.keyCode != 8) evt.preventDefault();
    if (this.classList == 'focus' && this.innerHTML.length == 25 && event.keyCode != 8) evt.preventDefault();
    if (this.classList == 'city' && this.innerHTML.length == 15 && event.keyCode != 8) evt.preventDefault();
  }

  setTimer() {
    setInterval(this.setTime.bind(this), 1000);
  }

  initializeListeners() {
    this.name.addEventListener('blur', this.setData);
    this.focus.addEventListener('blur', this.setData);
    this.currentCity.addEventListener('blur', this.setData);
    this.name.addEventListener('click', this.deleteData);
    this.focus.addEventListener('click', this.deleteData);
    this.currentCity.addEventListener('click', this.deleteData);
    this.name.addEventListener('keydown', this.checkElement);
    this.focus.addEventListener('keydown', this.checkElement);
    this.currentCity.addEventListener('keydown', this.checkElement);
  }
}

let city = document.querySelector('.city');
let weatherIcon = document.querySelector('.icon');
let weatherTemperature = document.querySelector('.temperature');
let weatherWind = document.querySelector('.wind');
let weatherHumidity = document.querySelector('.humidity');
let time = document.querySelector('.time');
let date = document.querySelector('.date');
let greeting = document.querySelector('.greeting')
let name = document.querySelector('.name');
let focus = document.querySelector('.focus');
let quote = document.querySelector('blockquote');
let author = document.querySelector('figcaption');
let btnChangeTheme = document.querySelector('.change-theme');
let btnChangeQuote = document.querySelector('.change-quote');

let momentum = new Momentum(time, date, greeting, name, focus, quote, author, city,
  weatherIcon, weatherTemperature, weatherWind, weatherHumidity);

momentum.setTimer();
momentum.getData();
momentum.initializeListeners();
momentum.setTheme();
momentum.changeBackground();
momentum.getForecast();

btnChangeTheme.addEventListener('click', function() {
  momentum.setTheme();
  momentum.changeBackground();
  btnChangeTheme.disabled = true;
  setTimeout(() => btnChangeTheme.disabled = false, 1000);
})

btnChangeQuote.addEventListener('click', function() {
  momentum.getQuote();
})
