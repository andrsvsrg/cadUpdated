
export const PopUpDecorator = {

  showPopUp(typeOfFigure) {
    const popUpBlock = document.querySelector('.popUp')
    const popUpText = document.querySelector('.popUp span')
    popUpText.textContent = `${typeOfFigure} created`
    popUpBlock.classList.remove('hidden')
    setTimeout(this.hiddenPopUp, 2000)
  },

  hiddenPopUp(){
    const popUpBlock = document.querySelector('.popUp')
    popUpBlock.classList.add('hidden')
  }



}