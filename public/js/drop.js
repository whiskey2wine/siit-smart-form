const previewNode = document.querySelector('#template');
previewNode.id = '';
const previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);

Dropzone.options.filePickers = {
  paramName: 'file-picker', // The name that will be used to transfer the file
  maxFilesize: 0.1, // MB
  maxFiles: 1,
  dictDefaultMessage:
    '<i class="material-icons" style="font-size: 48px; color: #b0bec5;">file_upload</i>\nDrag an image here to upload, or click to select one',
  thumbnailWidth: 80,
  thumbnailHeight: 80,
  previewTemplate,
  previewsContainer: '#previews',
  autoQueue: false,
  acceptedFiles: 'image/*',
  dictFileTooBig: 'File is too big ({{filesize}} MB). Max filesize: {{maxFilesize}} MB.',
  accept(file, done) {
    console.log(file);
    if (file.name == 'justinbieber.jpg') {
      done("Naha, you don't.");
    } else {
      console.log('hello');
      done();
    }
  },
  init() {
    const myDropzone = this;
    const dropzone = document.querySelector('.dropzone');
    let defaultMsg;

    this.on('addedfile', (file) => {
      const typeNode = document.querySelector('[data-dz-type]');
      defaultMsg = document.querySelector('.dz-default.dz-message');
      console.log(file);
      typeNode.innerHTML = file.type;
      file.previewElement.querySelector('.start').onclick = function (e) {
        e.preventDefault();
        myDropzone.enqueueFile(file);
      };
      dropzone.removeChild(defaultMsg);
    });
    this.on('sending', (file) => {
      // And disable the start button
      file.previewElement.querySelector('.start').setAttribute('disabled', 'disabled');
    });
    this.on('removedfile', (file) => {
      dropzone.appendChild(defaultMsg);
    });

    this.on('maxfilesreached', (file) => {
      console.log(file);
    });
  },
};
