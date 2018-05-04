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

const insertTextbox = (event) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.classList.add('browser-default');
  input.classList.add('foo');
  input.style.position = 'absolute';
  input.style.left = `${event.pageX}px`;
  input.style.top = `${event.pageY}px`;
  input.style.minWidth = '150px';
  input.style.zIndex = 100;
  const edit = document.querySelector('#edit');
  edit.appendChild(input);
  console.dir(`x: ${event.pageX}, y: ${event.pageY}`);
};

const insertCheckbox = (event) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  const label = document.createElement('label');
  label.style.position = 'absolute';
  label.style.left = `${event.pageX}px`;
  label.style.top = `${event.pageY}px`;
  label.style.zIndex = 100;
  const span = document.createElement('span');
  label.appendChild(input);
  label.appendChild(span);
  const edit = document.querySelector('#edit');
  edit.appendChild(label);
  console.dir(`x: ${event.pageX}, y: ${event.pageY}`);
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
    if (textbox.getAttribute('active')) {
      insertTextbox(e);
    } else if (checkbox.getAttribute('active')) {
      insertCheckbox(e);
    }
  });

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

  // textbox.addEventListener('click', function () {
  //   this.classList.add('blue-grey');
  //   this.setAttribute('active', true);
  // });

  // checkbox.addEventListener('click', function () {
  //   this.classList.add('blue-grey');
  //   this.setAttribute('active', true);
  // });

  // document.querySelector('.preview-img').addEventListener('click', function (e) {
  //   // console.dir(e);
  //   console.dir(this);
  //   insertTextbox(e);
  // });
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

// Delete approver function
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
