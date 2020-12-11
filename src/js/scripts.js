
class Booking {
  constructor(submitBtn, form, okBtn) {
    this.submitBtn = document.querySelector(submitBtn);
    this.okBtn = document.querySelector(okBtn);
    this.form = document.querySelector(form);
    this.validateNumber = this.validateNumber.bind(this);
    this.hideInfoblok = this.hideInfoblok.bind(this);
    this.activeRequest = false;
    this.evnetsHandler(this.submitBtn, this.form, this.okBtn);
  }

  async validateNumber(e) {
    e.preventDefault();
    if (this.activeRequest === true) return false;
    const regex = /375([25|29|33|44])[\d]{8}/g;
    const number = document.querySelector('input[name="phone"]').value;
    if (!regex.test(number)) {
      this.activeRequest = true;
      this.infoblockLayout();
      return false;
    };
    const url = `http://apilayer.net/api/validate?access_key=29016d7b1f5f6d97371b2778dae48a7f&number=${number}`;
    try {
      const request = await fetch(url);
      const result = await request.json();
      this.activeRequest = true;
      this.infoblockLayout(result);
    } catch (e) {
      console.log(e.message);
    }
  }

  hideInfoblok() {
    const infoblockWrapper = document.querySelector('.infoblock-wrapper');
    const infoblockContent = document.querySelector('.infoblock__content');
    infoblockWrapper.classList.remove('active-window');
    infoblockWrapper.classList.add('hide');
    setTimeout(() => {
      infoblockWrapper.classList.remove('hide')
      this.activeRequest = false;
    }, 1000);
    infoblockContent.innerHTML = '';
  }

  infoblockLayout(obj) {
    const infoblockWrapper = document.querySelector('.infoblock-wrapper');
    const infoblockContent = document.querySelector('.infoblock__content');
    if (obj !== undefined) {
      const {valid, number} = obj;
      const successLayout = 
      `
        <h1 class="infoblock__title">Заказ принят!</h1>
        <p class="infoblock__number">Номер вашего телефона: ${number}</p>
      `;

      const failureLayout = 
      `
      <h1 class="infoblock__title">Телефон не найден!</h1>
      `;
      const layout = (valid) ? successLayout : failureLayout;
      infoblockContent.insertAdjacentHTML('afterbegin', layout);
    } else {
      const layout = 
      `
      <h1 class="infoblock__title">Некорректный номер!</h1>
      <p class="infoblock__number">Номер телефона должен быть заполнен шаблону мобильных сетей РБ, например:
      375292562321</p>
      `;
      infoblockContent.insertAdjacentHTML('afterbegin', layout);
    }
    

    infoblockWrapper.classList.add('active-window');
    infoblockWrapper.classList.remove('hide');
  }

  evnetsHandler(submitBtn, form, okBtn) {
    submitBtn.addEventListener('click', this.validateNumber);
    form.addEventListener('submit', this.validateNumber);
    okBtn.addEventListener('click', this.hideInfoblok);
  }

}

new Booking('.form__submit-label', '.form', '.infoblock__ok');