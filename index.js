// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='timer'>
    <h1>Timer</h1>
    <form data-form=''>
      <label>
        <input type='text' name='time' placeholder='Enter number of minutes:'>
      </label>
    </form>
    <div class='timer__content hide'>
      <div class='h1'>
        <span data-minutes=''>00</span>
        <span>:</span>
        <span data-second=''>00</span>
      </div>
      <button data-control=''>${feather.icons.play.toSvg()}</button>
      <button data-reset=''>Reset Timer</button>
    </div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️ Class App
class App {
  constructor() {
    this.DOM = {
      form: document.querySelector('[data-form]'),
      minutes: document.querySelector('[data-minutes]'),
      seconds: document.querySelector('[data-second]'),
      control: document.querySelector('[data-control]'),
      reset: document.querySelector('[data-reset]'),
    };

    this.PROPS = {
      interval: null,
      secondsRemaining: 0,
    };

    this.DOM.form.addEventListener('submit', this.onSubmit);
    this.DOM.control.addEventListener('click', this.onControl);
    this.DOM.reset.addEventListener('click', this.onReset);
  }

  /**
   * @function onSubmit - Form submit handler
   * @param event
   */
  onSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const { time } = Object.fromEntries(new FormData(form).entries());

    if (isNaN(time) || !time) {
      showNotification('warning', 'Please set a number');
      return;
    }

    if (time < 60) {
      this.stop();
      this.PROPS.secondsRemaining = time * 60;
      this.updateTime();
      document.querySelector('.timer__content').classList.remove('hide');
      form.classList.add('hide');
      form.reset();
    }
  };

  /**
   * @function stop - Stop timer
   */
  stop = () => {
    clearInterval(this.PROPS.interval);
    this.PROPS.interval = null;
    this.updateControl();
  };

  /**
   * @function updateControl - Update control icon
   */
  updateControl = () => {
    this.DOM.control.innerHTML = this.PROPS.interval === null ? `${feather.icons.play.toSvg()}` : `${feather.icons.pause.toSvg()}`;
  };

  /**
   * @function updateTime - Update time
   */
  updateTime = () => {
    this.DOM.minutes.textContent = Math.floor(this.PROPS.secondsRemaining / 60).toString().padStart(2, '0');
    this.DOM.seconds.textContent = (this.PROPS.secondsRemaining % 60).toString().padStart(2, '0');
  };

  /**
   * @function onControl - Play/Pause timer
   */
  onControl = () => {
    this.PROPS.interval === null ? this.start() : this.stop();
  };

  /**
   * @function start - Start timer
   */
  start = () => {
    if (this.PROPS.secondsRemaining === 0) {
      return;
    }

    this.PROPS.interval = setInterval(() => {
      this.PROPS.secondsRemaining--;
      this.updateTime();

      if (this.PROPS.secondsRemaining === 0) {
        this.stop();
      }
    }, 1000);

    this.updateControl();
  };

  /**
   * @function onReset - Reset Timer
   */
  onReset = () => {
    this.stop()
    this.PROPS.secondsRemaining = 0
    this.updateTime()
    document.querySelector('.timer__content').classList.add('hide');
    this.DOM.form.classList.remove('hide');
  };
}


// ⚡️Class instance
new App();
