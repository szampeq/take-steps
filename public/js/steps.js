let $ulList;
let $popupInput;
let $addPopupBtn;
let $closePopupBtn;
let $newStepsForm;
let $newStepButton;
let $inputDate;
let $arrowUp;
let $arrowDown;

const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
}

const prepareDOMElements = () => {
    $ulList = document.querySelector('.steps-table ul');
    $newStepsForm = document.querySelector('.form-window.steps');
    $newStepButton = document.querySelector('.form-button.new');
    $closeNewStepsButton = document.querySelector('.cancelForm');
    $inputDate = document.querySelector('.date');
    $arrowUp = document.querySelector('.up');
    $arrowDown = document.querySelector('.down');
}

const prepareDOMEvents = () => {
    $newStepButton.addEventListener('click', displayForm);
    $closeNewStepsButton.addEventListener('click', closeForm);
}

const displayForm = () => {
    $newStepsForm.style.display = 'flex';
}

const closeForm = () => {
    $newStepsForm.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', main);