// M.AutoInit();

const elem = document.querySelector('.modal');
const instance = M.Modal.init(elem, {
  opacity: 0.3,
  startingTop: '5%',
});

// $('.sidenav').sidenav();
// $('select').formSelect();
// $('.fixed-action-btn').floatingActionButton();
// // $('.fixed-action-btn').closeFAB();
// $('.tooltipped').tooltip({ delay: 50 });
// $('.modal').modal();

// $('.fixed-action-btn.toolbar').openToolbar();
// $('.fixed-action-btn.toolbar').closeToolbar();
// $('#homePage').hide(); // Hide for test - remove when deploy

/* ------- Global variable declaration area ------- */
let UPLOADED_FILE;
let UPLOAD_STAT;
let FORM_NAME_STAT;
let CREATED_FORM;

const initiate = () => {
  $.get(
    'server/fileHandler.php',
    (data) => {
      // console.log(data);
      const { length } = Object.keys(data);
      const toItems = 0;
      const item = 0;
      let nowHaveItemCount = 0;
      const homePageArray = [];

      for (let i = 0; i < length; i++) {
        if (i < 10) {
          $(`#Item0${i}`).html('');
        } else {
          $(`#Item${i}`).html('');
        }
      }

      $('#homePage').html(`
          <div id="holdItem" class="row">
            <!-- items fetched from jsonFile.json will be inserted here! -->
          </div>
        `);
      $('#preloader').remove();
      $('#holdItem').show();

      $.each(data, (i, subData) => {
        // console.log(data);
        // console.log(i);
        console.log(subData);
        console.log(nowHaveItemCount);
        if (nowHaveItemCount < 10) {
          $('#holdItem').append(`
          <div class="col s12 m4">
              <div class="card">
                <div class="card-image">
                  <img class="mx-auto item-img" src="${subData.iPicLink}">
                </div>
                <div class="card-content blue-grey darken-1 white-text">
                  <span class="card-title">${subData.iName}</span>
                  <div class="fixed-action-btn" style="position: absolute; bottom: 17px;">
                    <a class="btn-floating btn-large red">
                      <i class="large material-icons">mode_edit</i>
                    </a>
                    <ul>
                      <li title="Delete">
                        <a class="btn-floating red">
                          <i class="material-icons">delete</i>
                        </a>
                      </li>
                      <li title="Download">
                        <a class="btn-floating yellow darken-1">
                          <i class="material-icons">file_download</i>
                        </a>
                      </li>
                      <li title="Share">
                        <a class="btn-floating green">
                          <i class="material-icons">person_add</i>
                        </a>
                      </li>
                      <li title="Preview">
                        <a id="enter${nowHaveItemCount}" class="btn-floating blue">
                          <i class="material-icons">visibility</i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                </div>
            </div>
        `);
        } else {
        }

        homePageArray[nowHaveItemCount] = subData.iName;
        nowHaveItemCount++;
      });
    },
    'json',
  ).fail(() => {
    console.log("Error: file not found (invalid user's json), [fetching items]");
  });
};

const stickyToolbar = () => {
  const sticky = document.getElementById('toolbar').offsetTop;

  if (window.pageYOffset >= 65) {
    $('#toolbar').addClass('sticky');
    $('#edit').addClass('sticky-offset');
  } else if (window.pageYOffset < 72) {
    $('#toolbar').removeClass('sticky');
    $('#edit').removeClass('sticky-offset');
  }
};

// Remove container class to increase spacing in smaller devices
const responsiveContainer = () => {
  const width = window.innerWidth;
  if (width <= 768) {
    $('#container').removeClass('container');
  } else {
    $('#container').addClass('container');
  }
};

/* ------- Start Create Form Modal -------- */
const addApprover = () => {
  $(document).on('click', '#add-approver', () => {
    const i =
      parseInt($('#add-approver')
        .prev()
        .attr('id')
        .substr(15)) + 1;
    const template = `
        <div id="approver-holder${i}" class="approver-holder input-field">
          <input type="text" name="appr${i}" id="appr${i}">
          <label for="appr${i}">Approver ${i}</label>
          <a id="del-approver${i}" href="#!" class="btn-flat waves-effect waves-light center del-approver"><i class="material-icons">close</i></a>
        </div>
      `;
    $(template).insertBefore('#add-approver');
  });
};

const delApprover = () => {
  $(document).on('click', '.del-approver', (e) => {
    let id = e.currentTarget.id;
    id = parseInt(id.substr(12));
    const last = parseInt($('#add-approver')
      .prev()
      .attr('id')
      .substr(15));
    for (let i = id; i < last; i++) {
      const next_id = i + 1;
      const next_val = $(`#appr${next_id}`).val();
      $(`#appr${i}`).val(next_val);
    }
    $(`#approver-holder${last}`).remove();
  });
};

// File upload and preview img
const humanFileSize = (bytes, si) => {
  $('#confirmNew').show();

  const thresh = si ? 1000 : 1024;

  if (bytes < thresh) return `${bytes} B`;
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh);
  return `${bytes.toFixed(1)} ${units[u]}`;
};

const renderImage = (file) => {
  $('#drop-zone').hide();
  const reader = new FileReader();
  reader.onload = function (event) {
    const fileSource = event.target.result;
    const fileName = file.name;
    const fileSize = humanFileSize(file.size, 'MB');
    const fileType = file.type;
    const filePath = `../upload_img/${fileName}`;
    const content = `
        <img src="${fileSource}" class="file-preview">
        <div class="center-align">
          <strong>Name: </strong><span id="filesize">${fileName}</span><br>
          <strong>Size: </strong><span id="filesize">${fileSize}</span><br>
          <strong>Type: </strong><span id="filetype">${fileType}</span>
        </div>
      `;
    $('#upload-preview').html(content);
  };

  // console.log(file);

  // when the file is read it triggers the onload event above.
  reader.readAsDataURL(file);
};

const filePicker = () => {
  $(document).on('change', '#file-picker', (e) => {
    const file = e.target.files[0];
    fileUpload(file);
  });
};

const fileUpload = (file) => {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    const type = file.type.substr(6);
    const filename = `${randomString(40)}.${type}`;

    if (!file || !file.type.match(/image.*/)) return;
    const formdata = new FormData();
    formdata.append('file', file, filename);

    UPLOAD_STAT = true;

    // $.ajax({
    //   url: 'server/upload.php',
    //   data: formdata,
    //   cache: false,
    //   contentType: false,
    //   processData: false,
    //   type: 'POST',
    //   success(data, textStatus, jqXHR) {
    //     // Callback code
    //     // console.log(data);
    //     if (data.file.error != 0) {
    //       console.log('Something wrong with file or server.');
    //     } else {
    //       UPLOADED_FILE = {
    //         name: data.file.name,
    //         type: data.file.type,
    //         path: `upload_img/${data.file.name}`,
    //         size: data.file.size,
    //         uploaded_date: Date.now(),
    //       };
    //       console.log(UPLOADED_FILE);
    //       UPLOAD_STAT = true;
    //       if (UPLOAD_STAT === true && FORM_NAME_STAT === true) {
    //         $('#btn-submit-form').attr('disabled', false);
    //       }
    //       renderImage(file);
    //     }
    //   },
    // });
  } else {
    console.log('The File APIs are not fully supported in this browser.');
  }
};

const randomString = (length) => {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Dropzone function
const dragenter = (e) => {
  console.log(e);
  e.stopPropagation();
  e.preventDefault();
};

const dragover = (e) => {
  console.log(e);
  e.stopPropagation();
  e.preventDefault();
};

const drop = (e) => {
  e.stopPropagation();
  e.preventDefault();
  console.log(e);

  const dt = e.dataTransfer;
  console.log(dt);
  const file = dt.files[0];

  if (!file || !file.type.match(/image.*/)) return;
  fileUpload(file);
  // renderImage(file);
};

const dragNdrop = (() => {
  const dropbox = document.getElementById('drop-zone');
  dropbox.addEventListener('dragenter', dragenter, false);
  dropbox.addEventListener('dragover', dragover, false);
  dropbox.addEventListener('drop', drop, false);
})();

// Disable submit button if no img and no form name
$(document).on('change', '#formname', () => {
  const formname = $('#formname')
    .val()
    .trim();

  if (formname != '') {
    FORM_NAME_STAT = true;
  } else {
    FORM_NAME_STAT = false;
    $('#btn-submit-form').attr('disabled', true);
  }

  if (UPLOAD_STAT === true && FORM_NAME_STAT === true) {
    $('#btn-submit-form').attr('disabled', false);
  }
});

// Handle submit btn
// $(document).on('click', '#btn-submit-form', () => {
//   const apprs = [];
//   const last = parseInt($('#add-approver')
//     .prev()
//     .attr('id')
//     .substr(15));
//   for (let i = 1; i <= last; i++) {
//     apprs.push($(`#appr${i}`).val());
//   }
//   CREATED_FORM = {
//     name: $('#form-name')
//       .val()
//       .trim(),
//     apprs,
//     img_info: UPLOADED_FILE,
//     created_date: Date.now(),
//   };
//   console.log(CREATED_FORM);

//   $('#homePage').css('display', 'none');
//   $('#edit').css('display', 'block');
//   $('#edit').append(`<img class="preview-img" src="${CREATED_FORM.img_info.path}">`);
//   $('#apprList').empty();
//   $('#apprList').append('<option value="" disabled selected>Choose approvers</option>');

//   for (let i = 0; i < CREATED_FORM.apprs.length; i++) {
//     const appr = CREATED_FORM.apprs[i];
//     $('#apprList').append(`<option value="${appr}">${appr}</option>`);
//   }
//   $('#apprList').material_select();
// });

// Handle create form reset
const resetForm = () => {
  UPLOAD_STAT = false;
  FORM_NAME_STAT = false;
  $('#drop-zone').show();
  const content = `
      <div class="modal-content">
        <h4>Create new form</h4>
        <div class="create-form-container">
          <div class="create-form-left">
            <div class="file-field input-field">
              <div class="btn">
                <span>File</span>
                <input id="file-picker" type="file" accept="image/*">
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text">
              </div>
            </div>
            <div id="drop-zone">
              <i class="material-icons" style="font-size: 48px; color: #b0bec5;">file_upload</i>
              <span><strong>Choose a file </strong>or drag it here.</span>
            </div>
            <div id="upload-preview" style="display: block;">
              <!-- Preview image and info will be inserted here! -->
            </div>
          </div>
          <div class="create-form-right">
            <div class="input-field">
              <input type="text" name="form-name" id="form-name">
              <label for="form-name">Form name</label>
            </div>
            <div id="approver-holder1" class="approver-holder input-field">
              <input type="text" name="appr1" id="appr1">
              <label class="active" for="appr1">Approver 1</label>
            </div>
            <a id="add-approver" href="#!" class="btn-floating waves-effect waves-block" style="margin: 0 auto;"><i class="material-icons">add</i></a>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a id="btn-submit-form" disabled class="modal-action modal-close waves-effect waves-green btn-flat">Submit</a>
        <a id="btn-reset-form" class="waves-effect waves-green btn-flat">Reset</a>
      </div>
    `;
  $('#create-form').html(content);
};

// Reset button - create form modal
$(document).on('click', '#btn-reset-form', () => {
  resetForm();
  dragNdrop();
});

// $('#create-form').modal({
//   complete: () => {
//     resetForm();
//     dragNdrop();
//   },
// });
/* ------- End Create Form Modal -------- */

window.onscroll = () => stickyToolbar();
window.onresize = () => responsiveContainer();

// IDEA: click on form's name on homepage to rename directly
