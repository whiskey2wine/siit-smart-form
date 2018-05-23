/* global getSiblings */

/**
 * Function: Make toolbar stick to the top of page when scroll
 */
const stickyToolbar = () => {
  // const sticky = document.getElementById('toolbar').offsetTop;
  const toolbar = document.querySelector('#toolbar');
  // const edit = document.querySelector('#edit');
  // const sticky = toolbar.offsetTop;

  if (window.pageYOffset >= 65) {
    toolbar.classList.add('sticky');
    // edit.classList.add('sticky-offset');
  } else if (window.pageYOffset < 72) {
    toolbar.classList.remove('sticky');
    // edit.classList.remove('sticky-offset');
  }
};

window.onscroll = () => stickyToolbar();

/**
 * Function: Make the DIV element draggable
 * @param {Element} elmnt  Draggable element
 */
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
    if ('ontouchend' in window) {
      document.ontouchend = null;
      document.ontouchmove = null;
    } else {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function dragMouseDown(e) {
    console.log(e);
    const ev = e || window.event;
    // get the mouse cursor position at startup:
    if (ev.clientX && ev.clientY) {
      pos3 = ev.clientX;
      pos4 = ev.clientY;
    } else {
      pos3 = ev.targetTouches[0].clientX;
      pos4 = ev.targetTouches[0].clientY;
      // ev.preventDefault();
    }
    if ('ontouchend' in window) {
      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.ontouchmove = elementDrag;
      // document.addEventListener('touchmove', () => elementDrag, { passive: false });
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
    // elmnt.ontouchstart = dragMouseDown;
    elmnt.addEventListener('touchstart', evt => dragMouseDown(evt), { passive: false });
  } else {
    elmnt.onmousedown = dragMouseDown;
  }
  // }
}

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
  const move = document.createElement('i');
  move.classList.add('material-icons', 'move-handle');
  move.innerHTML = 'open_with';

  // Create close button for each element
  const close = document.createElement('i');
  close.classList.add('material-icons', 'close');
  close.innerHTML = 'close';
  close.addEventListener('click', function (e) {
    this.parentElement.remove();
  });

  const textboxLength = document.querySelector('#textboxLength input');
  input.addEventListener('focus', function (e) {
    input.classList.add('selectedBox');
    textboxLength.value = input.offsetWidth;
    // remove close button from siblings
    getSiblings(this.parentElement).forEach((el) => {
      console.dir(el);
      if (el.tagName === 'LABEL') {
        Array.from(el.children).forEach((children) => {
          console.dir(children);
          if (children.tagName === 'I') {
            children.remove();
          }
          if (children.tagName === 'INPUT') {
            children.classList.remove('selectedBox');
          }
        });
      }
    });
    // add move & close button on target item
    this.parentElement.appendChild(move);
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

  const imageBox = document.querySelector('.image-box');
  imageBox.appendChild(label);

  const draggable = document.querySelectorAll('.component');
  draggable.forEach((el) => {
    dragElement(el);
  });
};

/**
 * Init function for each button in directionPad
 */
(function moveTextbox() {
  /**
   * Create 4 directional pad
   */
  const elmnt = document.createElement('div');
  elmnt.setAttribute('id', 'directionPad');
  const directionPad = `
      <i class="material-icons blue-grey lighten-1">keyboard_arrow_up</i>
      <i class="material-icons blue-grey lighten-1">keyboard_arrow_right</i>
      <i class="material-icons blue-grey lighten-1">keyboard_arrow_down</i>
      <i class="material-icons blue-grey lighten-1">keyboard_arrow_left</i>
  `;
  elmnt.innerHTML = directionPad;
  document.querySelector('#edit').appendChild(elmnt);
  // Attached each function to arrow button
  Array.from(elmnt.children).forEach((child, i) => {
    if (i === 0) {
      child.addEventListener('click', (e) => {
        const select = document.querySelector('.selectedBox');
        if (select) {
          let top = select.parentElement.offsetTop;
          top -= 1;
          select.parentElement.style.top = `${top}px`;
        }
      });
    } else if (i === 1) {
      child.addEventListener('click', (e) => {
        const select = document.querySelector('.selectedBox');
        if (select) {
          let left = select.parentElement.offsetLeft;
          left += 1;
          select.parentElement.style.left = `${left}px`;
        }
      });
    } else if (i === 2) {
      child.addEventListener('click', (e) => {
        const select = document.querySelector('.selectedBox');
        if (select) {
          let top = select.parentElement.offsetTop;
          top += 1;
          select.parentElement.style.top = `${top}px`;
        }
      });
    } else if (i === 3) {
      child.addEventListener('click', (e) => {
        const select = document.querySelector('.selectedBox');
        if (select) {
          let left = select.parentElement.offsetLeft;
          left -= 1;
          select.parentElement.style.left = `${left}px`;
        }
      });
    }
  });
}());

(function initTextboxLength() {
  const textboxLength = document.querySelector('#textboxLength input');
  if (textboxLength) {
    textboxLength.addEventListener('keyup', function (e) {
      const selected = document.querySelector('.selectedBox');
      if (selected) {
        selected.style.width = `${this.value}px`;
        selected.style.minWidth = `${this.value}px`;
      }
    });
    textboxLength.addEventListener('keydown', function (e) {
      const keycode = e.which ? e.which : e.keyCode;
      if (keycode === 38 || keycode === 40) {
        e.preventDefault();
      }
      if (e.shiftKey && keycode === 38) {
        this.value = parseInt(this.value) + 10;
      } else if (e.shiftKey && keycode === 40) {
        this.value = parseInt(this.value) - 10;
      } else if (keycode === 38) {
        this.value = parseInt(this.value) + 1;
      } else if (keycode === 40) {
        this.value = parseInt(this.value) - 1;
      }
    });
  }
}());

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
