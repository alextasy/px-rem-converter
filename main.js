// Bidirectional converter (bc)

const bcInput1 = document.getElementById('bc-input-1');
const bcInput2 = document.getElementById('bc-input-2');
const bcBaseSize = document.getElementById('bc-base-size');
const bcCopyButton = document.getElementById('bc-copy-button');
const bcInputsContainer = document.getElementById('bc-inputs-container');

let bcContainerReversed = false;

function updateBcConversion(updatebcInput1 = !bcContainerReversed) {
  if (updatebcInput1) {
    const remValue = parseFloat(bcInput1.value) / parseFloat(bcBaseSize.value);
    bcInput2.value = remValue
  } else {
    const pxValue = parseFloat(bcInput2.value) * parseFloat(bcBaseSize.value);
    bcInput1.value = pxValue
  }
}

function switchBcInputs() {
  bcContainerReversed = !bcContainerReversed;
  const rem = '(rem)', px = '(px)';
  if (bcContainerReversed) bcCopyButton.innerHTML = bcCopyButton.innerHTML.replace(rem, px);
  else bcCopyButton.innerHTML = bcCopyButton.innerHTML.replace(px, rem);
  const children = [...bcInputsContainer.children].reverse();
  bcInputsContainer.innerHTML = null;
  children.forEach(child => bcInputsContainer.appendChild(child));
}

function copyBcValueToClipboard() {
  const valueToCopy = bcContainerReversed ? `${bcInput1.value}px` : `${bcInput2.value}rem`;
  navigator.clipboard.writeText(valueToCopy);
}

bcInput1.addEventListener('input', () => updateBcConversion(true));
bcInput2.addEventListener('input', () => updateBcConversion(false));
bcBaseSize.addEventListener('input', updateBcConversion);
document.getElementById('bc-switch-button').addEventListener('click', switchBcInputs);
bcCopyButton.addEventListener('click', copyBcValueToClipboard);


// Global

function convertPxToRem(cssText, baseSize) {
  const pxRegex = /(\d+\.?\d*)px/g;
  return cssText.replace(pxRegex, (_, pxValue) => {
    const remValue = parseFloat(pxValue) / baseSize;
    return `${remValue}rem`;
  });
}

// Text area converter

const originalTextInput = document.getElementById('original-text');
const textAreaBaseSize = document.getElementById('textarea-base-size');
const convertedTextInput = document.getElementById('converted-text');

document.getElementById('textarea-convert-button').addEventListener('click', () => {
  const baseSize = parseFloat(textAreaBaseSize.value);
  const convertedText = convertPxToRem(originalTextInput.value, baseSize);
  convertedTextInput.value = convertedText;
});

document.getElementById('textarea-copy-button').addEventListener('click', () => {
  navigator.clipboard.writeText(convertedTextInput.value);
});


// File upload converter

const fileInput = document.getElementById('css-file-input');
const downloadLink = document.getElementById('download-link');
const fileBaseSize = document.getElementById('file-base-size');

document.getElementById('file-converter-form').addEventListener('submit', е => {
  е.preventDefault();
  const cssFile = fileInput.files[0];
  if (!cssFile) {
    alert('Please choose a CSS, SASS, SCSS, LESS, or Stylus file to upload');
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const fileText = e.target.result;
    const baseSize = parseFloat(fileBaseSize.value);
    const convertedText = convertPxToRem(fileText, baseSize);
    createDownloadLink(convertedText, cssFile.name);
  };

  reader.readAsText(cssFile);
});

document.getElementById('file-choose-button').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const fileName = fileInput.files[0]?.name;
  document.getElementById('file-name').textContent = fileName || 'No file chosen';
  downloadLink.classList.remove('show');
});

fileBaseSize.addEventListener('change', () => downloadLink.classList.remove('show'));

function createDownloadLink(cssText, originalFileName) {
  const newFileName = originalFileName.replace(/\.(css|scss|sass|less|styl)$/, '-converted.$1');

  const fileBlob = new Blob([cssText], { type: 'text/plain' });
  const url = URL.createObjectURL(fileBlob);

  downloadLink.href = url;
  downloadLink.download = newFileName;
  downloadLink.classList.add('show');
}