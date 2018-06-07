/* global Dropzone */
const previewNode = document.querySelector('#template');
previewNode.id = '';
const previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);

let myDropzone;

// Bind removeAllFiles function to reset event in modal
const formModal = document.querySelector('form[action="/docs/add"]');
formModal.addEventListener('reset', () => {
  myDropzone.removeAllFiles(true);
  // document.querySelectorAll('.approver-holder input, .approver-holder a').forEach((el) => {
  //   el.removeAttribute('disabled');
  // });
  // document.querySelector('#add-approver').removeAttribute('disabled');
});

Dropzone.options.filePickers = {
  paramName: 'file-picker', // The name that will be used to transfer the file
  maxFilesize: 10, // MB
  maxFiles: 1,
  dictDefaultMessage:
    '<i class="material-icons" style="font-size: 48px; color: #b0bec5;">file_upload</i>\nDrag an image here to upload, or click to select one',
  thumbnailWidth: 1000,
  thumbnailHeight: 1000,
  thumbnailMethod: 'contain',
  previewTemplate,
  previewsContainer: '#previews',
  // autoQueue: false,
  acceptedFiles: 'image/*',
  dictFileTooBig: 'File is too big ({{filesize}} MB). Max filesize: {{maxFilesize}} MB.',
  init() {
    myDropzone = this;
    const dropzone = document.querySelector('.dropzone');
    const defaultMsg = document.querySelector('.dz-default.dz-message');
    const inputId = document.querySelector('input[name="id"]');
    const inputFilename = document.querySelector('input[name="filename"]');
    const inputOriginalname = document.querySelector('input[name="originalname"]');
    let delBtn;

    this.on('addedfile', function (file) {
      // Allow only 1 file
      if (this.files.length > 1) {
        this.removeFile(this.files[0]);
      }
      // Remove message if file exists
      if (this.files.length > 0) {
        dropzone.removeChild(defaultMsg);
      }
      // Add file type
      const typeNode = document.querySelector('[data-dz-type]');
      typeNode.innerHTML = file.type;
      // Bind enqueueFile() event to start button
      // file.previewElement.querySelector('.start').onclick = function (e) {
      //   e.preventDefault();
      //   myDropzone.enqueueFile(file);
      // };
    });

    // this.on('sending', (file) => {
    //   // And disable the start button
    //   file.previewElement.querySelector('.start').setAttribute('disabled', 'disabled');
    // });
    this.on('removedfile', (file) => {
      // Add message when there is no file
      dropzone.appendChild(defaultMsg);
      if (delBtn !== undefined) {
        console.log(delBtn.getAttribute('del-id'));
        const id = delBtn.getAttribute('del-id');
        fetch(`/docs/image/${id}`, { method: 'DELETE' });
        delBtn.setAttribute('del-id', '');
        inputId.setAttribute('value', '');
        inputFilename.setAttribute('value', '');
        inputOriginalname.setAttribute('value', '');
      }
    });

    this.on('success', (file, res) => {
      console.log(res);
      delBtn = document.querySelector('.delete');
      delBtn.setAttribute('del-id', res.id);
      inputId.setAttribute('value', res.id);
      inputFilename.setAttribute('value', res.filename);
      inputOriginalname.setAttribute('value', res.originalname);
      const formnameVal = document.querySelector('input[name="formname"]').value;
      if (formnameVal.trim() !== '') {
        document.querySelector('#btn-submit-form').removeAttribute('disabled');
      }
    });
  },
};
