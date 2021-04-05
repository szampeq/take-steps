let $ulList;
let $popup;
let $popupInfo;
let $editedStep;
let $popupInput;
let $addPopupBtn;
let $closePopupBtn;
let $newStepsForm;
let $newStepButton;

const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
}

const prepareDOMElements = () => {
    $ulList = document.querySelector('.steps-table ul');
    $popup = document.querySelector('.popup');
    $popupInfo = document.querySelector('.popupInfo');
    $popupInput = document.querySelector('.popupInput');
    $addPopupBtn = document.querySelector('.accept');
    $closePopupBtn = document.querySelector('.cancel');
    $newStepsForm = document.querySelector('.form-window.steps');
    $newStepButton = document.querySelector('.form-button.new');
    $closeNewStepsButton = document.querySelector('.cancelForm');
}

const prepareDOMEvents = () => {
    $ulList.addEventListener('click', checkClick);
    $closePopupBtn.addEventListener('click', closePopup);
    $addPopupBtn.addEventListener('click', changeSteps);
    $newStepButton.addEventListener('click', displayForm);
    $closeNewStepsButton.addEventListener('click', closeForm);
}

const checkClick = e => {
    if (e.target.closest('button').classList.contains('edit'))
        editSteps(e);
}

const editSteps = e => {
    const oldSteps = e.target.closest('li').id;
    $editedStep = document.getElementById(oldSteps);
    $popupInput.value = '';
    $popup.style.display = 'flex';
}

const changeSteps = () => {
    if ($popupInput.value !== '') {
        $editedStep.firstdChild.textContent = $popupInput.value;
        $popup.style.display = 'none';
        $popupInfo.innerText = '';
    } else {
        $popupInfo.innerText = 'Musisz podać liczbę kroków!';
    }
}

const closePopup = () => {
    $popup.style.display = 'none';
}

const displayForm = () => {
    $newStepsForm.style.display = 'flex';
}

const closeForm = () => {
    $newStepsForm.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', main);