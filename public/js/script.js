// M.AutoInit();

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

const elemMatBox = document.querySelectorAll('.materialboxed');
const instMatBox = M.Materialbox.init(elemMatBox);

// Remove container class to increase spacing in smaller devices
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

document.querySelector('main').addEventListener('click', (e) => {
  document.querySelectorAll('.selected-doc').forEach((doc) => {
    doc.classList.remove('selected-doc');
  });
});

const getSiblings = function (elem) {
  const siblings = [];
  let sibling = elem.parentNode.firstChild;
  for (; sibling; sibling = sibling.nextSibling) {
    if (sibling.nodeType !== 1 || sibling === elem) continue;
    siblings.push(sibling);
  }
  return siblings;
};
/**
 * Double click on doc to enter edit-mode
 * Continue this after finished login function
 */
const docs = document.querySelectorAll('.doc');
docs.forEach((doc) => {
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
  doc.addEventListener('dblclick', function (e) {
    console.log(e);
    console.log(this);
  });
});

/**
 * Separate docs/edit from other function since some element might not appear on other page
 */
if (window.location.pathname === '/docs/edit') {
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
  window.onscroll = () => stickyToolbar();
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
if (window.location.pathname === '/docs') {
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

  /* ------- End Create Form Modal -------- */
}

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
