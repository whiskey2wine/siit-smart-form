/* global M Stretchy */
// M.AutoInit();
Stretchy.selectors.filter = '.foo';

document.addEventListener('DOMContentLoaded', () => {
  const elemNavs = document.querySelectorAll('.sidenav');
  const instNavs = M.Sidenav.init(elemNavs);
});

const elemModal = document.querySelector('.modal');
const instModal = M.Modal.init(elemModal, {
  opacity: 0.3,
  startingTop: '5%',
  onCloseEnd() {
    const formModal = document.querySelector('form[action="/docs/add"]');
    formModal.reset();
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
const instMatBox = M.Materialbox.init(elemMatBox);

/**
 * Remove "container" class to increase spacing in smaller devices
 */
const responsiveContainer = () => {
  const width = window.innerWidth;
  const container = document.querySelector('main > div');
  if (width <= 768) {
    container.classList.remove('container');
    // $('#container').removeClass('container');
  } else {
    container.classList.add('container');
    // $('#container').addClass('container');
  }
};

/**
 * Remove highlight from previous selected card
 */
document.querySelector('main').addEventListener('click', (e) => {
  document.querySelectorAll('.selected-doc').forEach((doc) => {
    doc.classList.remove('selected-doc');
  });
});

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
  doc.addEventListener('dblclick', function (e) {
    window.location.href = `${window.location.origin}/docs/edit/${this.id}`;
  });
});

/**
 * Function: Make toolbar stick to the top of page when scroll
 */
const stickyToolbar = () => {
  // const sticky = document.getElementById('toolbar').offsetTop;
  const toolbar = document.querySelector('#toolbar');
  const edit = document.querySelector('#edit');
  // const sticky = toolbar.offsetTop;

  if (window.pageYOffset >= 65) {
    toolbar.classList.add('sticky');
    edit.classList.add('sticky-offset');
  } else if (window.pageYOffset < 72) {
    toolbar.classList.remove('sticky');
    edit.classList.remove('sticky-offset');
  }
};

// Make the DIV element draggagle:
function dragElement(elmnt) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;
  function elementDrag(e) {
    const ev = e || window.event;
    // calculate the new cursor position:
    if (ev.clientX && ev.clientY) {
      pos1 = pos3 - ev.clientX;
      pos2 = pos4 - ev.clientY;
      pos3 = ev.clientX;
      pos4 = ev.clientY;
    } else {
      pos1 = pos3 - ev.targetTouches[0].clientX;
      pos2 = pos4 - ev.targetTouches[0].clientY;
      pos3 = ev.targetTouches[0].clientX;
      pos4 = ev.targetTouches[0].clientY;
      ev.preventDefault();
    }
    // set the element's new position:
    elmnt.style.top = `${elmnt.offsetTop - pos2}px`;
    elmnt.style.left = `${elmnt.offsetLeft - pos1}px`;
  }

  function closeDragElement() {
    /* stop moving when mouse button is released: */
    if ('ontouchstart' in window) {
      document.ontouchend = null;
      document.ontouchmove = null;
    } else {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function dragMouseDown(e) {
    const ev = e || window.event;
    // get the mouse cursor position at startup:
    if (ev.clientX && ev.clientY) {
      pos3 = ev.clientX;
      pos4 = ev.clientY;
    } else {
      pos3 = ev.targetTouches[0].clientX;
      pos4 = ev.targetTouches[0].clientY;
      ev.preventDefault();
    }
    if ('ontouchstart' in window) {
      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.ontouchmove = elementDrag;
    } else {
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  }

  // if (document.getElementById(`${elmnt.id}header`)) {
  //   /* if present, the header is where you move the DIV from: */
  //   document.getElementById(`${elmnt.id}header`).onmousedown = dragMouseDown;
  // } else {
  /* otherwise, move the DIV from anywhere inside the DIV: */
  if ('ontouchstart' in window) {
    elmnt.ontouchstart = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }
  // }
}
document.ontouchmove = (e) => {
  console.dir(e);
};
/**
 * Add textbox to edit page when clicked on the preview image
 * @param {Event} event  Click event from document image
 * @param {String} type  Type of input
 */
const insertElement = (event, type) => {
  // Create input element
  const input = document.createElement('input');
  input.setAttribute('type', type);
  if (type === 'text') {
    input.classList.add('foo', 'browser-default');
  }
  // Create close button for each element
  const close = document.createElement('i');
  close.classList.add('material-icons', 'close');
  close.innerHTML = 'close';
  close.addEventListener('click', function () {
    this.parentElement.remove();
  });
  input.addEventListener('focus', function () {
    getSiblings(this.parentElement).forEach((el) => {
      console.dir(el);
      if (el.tagName === 'LABEL') {
        Array.from(el.children).forEach((children) => {
          if (children.tagName === 'I') {
            children.remove();
          }
        });
      }
    });
    this.parentElement.appendChild(close);
  });
  // Create label element
  const label = document.createElement('label');
  label.classList.add('component');
  Object.assign(label.style, {
    left: `${event.layerX}px`,
    top: `${event.layerY}px`,
  });

  const span = document.createElement('span');

  // Add each element into label (have to be in this order)
  label.appendChild(input);
  label.appendChild(span);
  // label.appendChild(close);

  const imageBox = document.querySelector('.imageBox');
  imageBox.appendChild(label);

  const draggable = document.querySelectorAll('.component');
  draggable.forEach((el) => {
    dragElement(el);
  });
};

/**
 * Separate docs/edit from other function since some element might not appear on other page
 */
if (window.location.pathname.substr(0, 10) === '/docs/edit') {
  window.onscroll = () => stickyToolbar();
  const previewImg = document.querySelector('.preview-img');
  const textbox = document.querySelector('#insertTextbox');
  const checkbox = document.querySelector('#insertCheckbox');
  // const hint = document.querySelector('#insertHint');
  // const comment = document.querySelector('#insertComment');
  previewImg.addEventListener('click', (e) => {
    console.dir(e);
    if (textbox.getAttribute('active')) {
      insertElement(e, 'text');
    } else if (checkbox.getAttribute('active')) {
      insertElement(e, 'checkbox');
    }
  });

  /**
   * Add/Remove style and class from button in sticky toolbar
   */
  const buttons = Array.from(document.querySelector('.toolbar-inner').children);
  buttons.forEach((el) => {
    el.addEventListener('click', function () {
      getSiblings(el).forEach((sibling) => {
        sibling.classList.remove('blue-grey');
        sibling.removeAttribute('active');
      });
      if (this.classList.contains('btn-flat')) {
        this.classList.toggle('blue-grey');
        if (this.getAttribute('active')) {
          this.removeAttribute('active');
        } else {
          this.setAttribute('active', true);
        }
      }
    });
  });
}

const randomString = (length) => {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

window.onresize = () => responsiveContainer();

/**
 * Separate all modal function from other page for now
 * Remove if after implements form's data handling function
 */

/* ------- /docs/ functions -------- */
// if (window.location.pathname === '/docs') {
const formname = document.querySelector('#formname');
formname.onchange = (e) => {
  const inputIdVal = document.querySelector('input[name="id"]').value;
  const inputFilenameVal = document.querySelector('input[name="filename"]').value;
  const inputOriginalnameVal = document.querySelector('input[name="originalname"]').value;
  console.log(inputIdVal);
  console.log(inputFilenameVal);
  console.log(inputOriginalnameVal);
  if (
    e.target.value.trim() !== '' &&
    inputIdVal.trim() !== '' &&
    inputFilenameVal.trim() !== '' &&
    inputOriginalnameVal.trim() !== ''
  ) {
    document.querySelector('#btn-submit-form').removeAttribute('disabled');
  }
};

/* ------- Start Create Form Modal -------- */
const elemAddApprover = document.querySelector('#add-approver');

/**
 * Delete approver from the list
 * @param {Event} e
 */
const del = function (e) {
  e.preventDefault();
  const id = parseInt(e.currentTarget.id.substr(12));
  const last = parseInt(elemAddApprover.previousElementSibling.getAttribute('id').substr(15));
  for (let i = id; i < last; i++) {
    const nextId = i + 1;
    const nextVal = document.querySelector(`#appr${nextId}`).value;
    document.querySelector(`#appr${i}`).value = nextVal;
  }
  const removeElem = document.querySelector(`#approver-holder${last}`);
  elemAddApprover.parentElement.removeChild(removeElem);
};

// Init add approver button
(function addApprover() {
  elemAddApprover.addEventListener('click', function () {
    const i = parseInt(this.previousElementSibling.getAttribute('id').substr(15)) + 1;
    const newNode = document.createElement('div');
    newNode.setAttribute('id', `approver-holder${i}`);
    newNode.setAttribute('class', 'approver-holder input-field');
    newNode.innerHTML = `
    <input type="text" name="appr${i}" id="appr${i}">
    <label for="appr${i}">Approver ${i}</label>
    <a id="del-approver${i}" href="#!" class="btn-flat waves-effect waves-light center del-approver"><i class="material-icons">close</i></a>
    `;
    this.parentNode.insertBefore(newNode, this);

    // Bind delete function to button
    document.querySelectorAll('.del-approver').forEach((el) => {
      el.addEventListener('click', del);
    });
  });
}());

document.querySelector('[name="formType"]').addEventListener('change', function () {
  if (this.checked) {
    document.querySelectorAll('.approver-holder input, .approver-holder a').forEach((el) => {
      el.setAttribute('disabled', true);
    });
    elemAddApprover.setAttribute('disabled', true);
  } else {
    document.querySelectorAll('.approver-holder input, .approver-holder a').forEach((el) => {
      el.removeAttribute('disabled');
    });
    elemAddApprover.removeAttribute('disabled');
  }
});

/* ------- End Create Form Modal -------- */
// }

// $('.sidenav').sidenav();
// $('select').formSelect();
// $('.fixed-action-btn').floatingActionButton();
// // $('.fixed-action-btn').closeFAB();
// $('.tooltipped').tooltip({ delay: 50 });
// $('.modal').modal();

// $('.fixed-action-btn.toolbar').openToolbar();
// $('.fixed-action-btn.toolbar').closeToolbar();
// $('#homePage').hide(); // Hide for test - remove when deploy

// const initiate = () => {
//   $.get(
//     'server/fileHandler.php',
//     (data) => {
//       // console.log(data);
//       const { length } = Object.keys(data);
//       const toItems = 0;
//       const item = 0;
//       let nowHaveItemCount = 0;
//       const homePageArray = [];

//       for (let i = 0; i < length; i++) {
//         if (i < 10) {
//           $(`#Item0${i}`).html('');
//         } else {
//           $(`#Item${i}`).html('');
//         }
//       }

//       $('#homePage').html(`
//           <div id="holdItem" class="row">
//             <!-- items fetched from jsonFile.json will be inserted here! -->
//           </div>
//         `);
//       $('#preloader').remove();
//       $('#holdItem').show();

//       $.each(data, (i, subData) => {
//         // console.log(data);
//         // console.log(i);
//         console.log(subData);
//         console.log(nowHaveItemCount);
//         if (nowHaveItemCount < 10) {
//           $('#holdItem').append(`
//           <div class="col s12 m4">
//               <div class="card">
//                 <div class="card-image">
//                   <img class="mx-auto item-img" src="${subData.iPicLink}">
//                 </div>
//                 <div class="card-content blue-grey darken-1 white-text">
//                   <span class="card-title">${subData.iName}</span>
//                   <div class="fixed-action-btn" style="position: absolute; bottom: 17px;">
//                     <a class="btn-floating btn-large red">
//                       <i class="large material-icons">mode_edit</i>
//                     </a>
//                     <ul>
//                       <li title="Delete">
//                         <a class="btn-floating red">
//                           <i class="material-icons">delete</i>
//                         </a>
//                       </li>
//                       <li title="Download">
//                         <a class="btn-floating yellow darken-1">
//                           <i class="material-icons">file_download</i>
//                         </a>
//                       </li>
//                       <li title="Share">
//                         <a class="btn-floating green">
//                           <i class="material-icons">person_add</i>
//                         </a>
//                       </li>
//                       <li title="Preview">
//                         <a id="enter${nowHaveItemCount}" class="btn-floating blue">
//                           <i class="material-icons">visibility</i>
//                         </a>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//                 </div>
//             </div>
//         `);
//         } else {
//         }

//         homePageArray[nowHaveItemCount] = subData.iName;
//         nowHaveItemCount++;
//       });
//     },
//     'json',
//   ).fail(() => {
//     console.log("Error: file not found (invalid user's json), [fetching items]");
//   });
// };

// IDEA: click on form's name on homepage to rename directly
