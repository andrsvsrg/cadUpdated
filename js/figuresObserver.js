export class Observable {
  constructor(state = 'Line') {
    this.observers = [];
    this.currentFigure = state;
    this.allButtons = document.querySelectorAll('.btn-figures img')
  }

  addAllListeners() {
    this.allButtons.forEach((button) => {
      button.addEventListener('click', this.onButtonClick.bind(this))
    })
  }

  onButtonClick(event) {
    this.currentFigure = event.target.dataset.type
    this.allButtons.forEach((el) => el.classList.remove('active'))
    event.target.classList.add('active')
    this.broadcast();
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  broadcast() {
    this.observers.forEach(observer => observer.notify(this.currentFigure));
  }
}

export class Observer {
  constructor(fn) {
    this.fn = fn;
  }

  notify(state) {
    this.fn(state);
  }
}




