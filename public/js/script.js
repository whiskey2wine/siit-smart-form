/* global M Stretchy QRCode */
// @ts-check
Stretchy.selectors.filter = '.foo';

document.addEventListener('DOMContentLoaded', () => {
  const elemNavs = document.querySelectorAll('.sidenav');
  const instNavs = M.Sidenav.init(elemNavs);
});

const elemModal = document.querySelectorAll('#create-form');
const instModal = M.Modal.init(elemModal, {
  opacity: 0.4,
  startingTop: '5%',
  onCloseEnd() {
    const formModal = document.querySelector('form[action="/docs/add"]');
    formModal.reset();
    document.querySelector('input[name="formname"]').value = '';
  },
});

const elemTabs = document.querySelectorAll('.tabs');
const instTabs = M.Tabs.init(elemTabs);

function addOption(chip) {
  const selects = document.querySelectorAll('.approver');
  selects.forEach((select) => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
    for (let i = 0; i < chip.chipsData.length; i++) {
      const option = document.createElement('option');
      option.value = chip.chipsData[i].tag;
      option.innerHTML = chip.chipsData[i].tag;
      select.appendChild(option);
    }
  });
}

const elemChips = document.querySelector('#approvers');
const instChips = M.Chips.init(elemChips, {
  placeholder: 'Enter a name',
  secondaryPlaceholder: 'add name',
  limit: 5,
  minLength: 1,
  onChipAdd() {
    addOption(this);
  },
  onChipDelete() {
    addOption(this);
  },
});

const elemFAB = document.querySelectorAll('.fixed-action-btn');
const instFAB = M.FloatingActionButton.init(elemFAB, {
  // hoverEnabled: false,
  direction: 'top',
});

const elemTooltips = document.querySelectorAll('.tooltipped');
const instTooltips = M.Tooltip.init(elemTooltips, {
  transitionMovement: 5,
});

const elemSelect = document.querySelectorAll('select');
const instSelect = M.FormSelect.init(elemSelect);

const elemMatBox = document.querySelectorAll('.materialboxed');
const instMatBox = M.Materialbox.init(elemMatBox, {
  onOpenStart() {
    console.log(this);
  },
});

/**
 * Function: Remove "container" class to increase spacing in smaller devices
 */
const responsiveContainer = () => {
  const width = window.innerWidth;
  const container = document.querySelector('#container');
  const edit = document.querySelector('#edit');
  if (edit) {
    if (width <= 1024) {
      container.classList.remove('container');
      edit.classList.add('sticky-offset');
      // $('#container').removeClass('container');
    } else {
      container.classList.add('container');
      edit.classList.remove('sticky-offset');
      // $('#container').addClass('container');
    }
  }
};
window.onload = () => responsiveContainer();
window.onresize = () => responsiveContainer();

/**
 * Function: Get all siblings of element passing as param
 * Source: https://github.com/cferdinandi/getSiblings
 * @param {Element} elem - Element that want to get siblings
 */
const getSiblings = function (elem) {
  const siblings = [];
  let sibling = elem.parentNode.firstChild;
  for (; sibling; sibling = sibling.nextSibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
  }
  return siblings;
};

/**
 * Remove highlight from previous selected card
 */
document.querySelector('main').addEventListener('click', (e) => {
  // Remove highlight from every card when click on main
  document.querySelectorAll('.selected-doc').forEach((doc) => {
    doc.classList.remove('selected-doc');
  });
  // Remove close button from element on edit page
  document.querySelectorAll('.close-handle').forEach((close) => {
    // Don't remove close from element that is focusing
    if (document.activeElement !== close.parentElement.firstElementChild) {
      close.remove();
    }
  });
  // Remove move button from element on edit page
  document.querySelectorAll('.move-handle').forEach((move) => {
    // Don't remove move from element that is focusing
    if (document.activeElement !== move.parentElement.firstElementChild) {
      move.remove();
    }
  });
});

const docs = document.querySelectorAll('.doc');
docs.forEach((doc) => {
  // Listener: Add highlight to selecting card
  doc.addEventListener('click', function (e) {
    const card = document.getElementById(this.id);
    // Get all siblings and remove selected-doc class
    const siblings = getSiblings(card);
    siblings.forEach((sibling) => {
      sibling.firstElementChild.lastElementChild.classList.remove('selected-doc');
    });
    // Add selected-doc class to selected element
    const cardContent = card.firstElementChild.lastElementChild;
    cardContent.classList.add('selected-doc');
    e.stopPropagation();
  });
  // Listener: Handle double click on card
  if ('ontouchstart' in window) {
    doc.addEventListener('click', function (e) {
      window.location.href = `${window.location.origin}/docs/edit/${this.id}`;
    });
  } else {
    doc.addEventListener('dblclick', function (e) {
      window.location.href = `${window.location.origin}/docs/edit/${this.id}`;
    });
  }
});

const randomStringg = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

console.log(randomStringg(100));

/**
 * Generate a random string of a given length.
 * @param {number} length length of string to generate (required)
 * @param {string=} kind character sets to use for string generation (optional, default: `aA#`)
 * @returns {string} random string from selected charset
 *
 * @description Options:
 *
 *  - `a` for lowercase alphabets [a-z]
 *  - `A` for uppercase alphabets [A-Z]
 *  - `#` numbers [0-9]
 *  - `!` special character as defined
 *  - `*` all of the above
 *
 */
const randomString = function (length, kind) {
  let i;
  let str = '';
  let opts = kind || 'aA#';
  let possibleChars = '';

  if (opts.indexOf('*') > -1) opts = 'aA#!'; // use all possible charsets

  // Collate charset to use
  if (opts.indexOf('#') > -1) possibleChars += '0123456789';
  if (opts.indexOf('a') > -1) possibleChars += 'abcdefghijklmnopqrstuvwxyz';
  if (opts.indexOf('A') > -1) possibleChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.indexOf('!') > -1) possibleChars += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';

  for (i = 0; i < length; i++) {
    str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return str;
};
console.log(randomString(100));

/**
 * Separate all modal function from other page for now
 * Remove if after implements form's data handling function
 */
/* ------- /docs/ functions -------- */
const formname = document.querySelector('#formname');
formname.addEventListener('keyup', function () {
  document.querySelector('input[name="title"]').setAttribute('value', this.value);
});
formname.onchange = (e) => {
  const inputIdVal = document.querySelector('input[name="id"]').value;
  const inputFilenameVal = document.querySelector('input[name="filename"]').value;
  const inputOriginalnameVal = document.querySelector('input[name="originalname"]').value;
  const title = document.querySelector('input[name="title"]').value;
  console.log(inputIdVal);
  console.log(inputFilenameVal);
  console.log(inputOriginalnameVal);
  console.log(title);
  if (
    e.target.value.trim() !== '' &&
    inputIdVal.trim() !== '' &&
    inputFilenameVal.trim() !== '' &&
    inputOriginalnameVal.trim() !== '' &&
    title.trim() !== ''
  ) {
    document.querySelector('#btn-submit-form').removeAttribute('disabled');
  }
};

/* ------- Start Create Form Modal -------- */
// const elemAddApprover = document.querySelector('#add-approver');

/**
 * Delete approver from the list
 * @param {Event} e
 */
// const del = function (e) {
//   e.preventDefault();
//   const id = parseInt(e.currentTarget.id.substr(12));
//   const last = parseInt(elemAddApprover.previousElementSibling.getAttribute('id').substr(15));
//   for (let i = id; i < last; i++) {
//     const nextId = i + 1;
//     const nextVal = document.querySelector(`#appr${nextId}`).value;
//     document.querySelector(`#appr${i}`).value = nextVal;
//   }
//   const removeElem = document.querySelector(`#approver-holder${last}`);
//   elemAddApprover.parentElement.removeChild(removeElem);
// };

// Init add approver button
// (function addApprover() {
//   elemAddApprover.addEventListener('click', function () {
//     const i = parseInt(this.previousElementSibling.getAttribute('id').substr(15)) + 1;
//     const newNode = document.createElement('div');
//     newNode.setAttribute('id', `approver-holder${i}`);
//     newNode.setAttribute('class', 'approver-holder input-field');
//     newNode.innerHTML = `
//     <input type="text" name="appr${i}" id="appr${i}">
//     <label for="appr${i}">Approver ${i}</label>
//     <a id="del-approver${i}" href="#!" class="btn-flat waves-effect waves-light center del-approver"><i class="material-icons">close</i></a>
//     `;
//     this.parentNode.insertBefore(newNode, this);

//     // Bind delete function to button
//     document.querySelectorAll('.del-approver').forEach((el) => {
//       el.addEventListener('click', del);
//     });
//   });
// }());

// document.querySelector('[name="formType"]').addEventListener('change', function () {
//   if (this.checked) {
//     document.querySelectorAll('.approver-holder input, .approver-holder a').forEach((el) => {
//       el.setAttribute('disabled', true);
//     });
//     elemAddApprover.setAttribute('disabled', true);
//   } else {
//     document.querySelectorAll('.approver-holder input, .approver-holder a').forEach((el) => {
//       el.removeAttribute('disabled');
//     });
//     elemAddApprover.removeAttribute('disabled');
//   }
// });

/* ------- End Create Form Modal -------- */
