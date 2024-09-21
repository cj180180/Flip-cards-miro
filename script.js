const flashcard = document.getElementById('flashcard');
flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));

// Function to populate the flashcard with optional images and text
function populateFlashcard(frontText, backText, frontImage = null, backImage = null) {
  const frontContent = document.getElementById('flashcard-front-content');
  const backContent = document.getElementById('flashcard-back-content');

  frontContent.innerHTML = '';
  backContent.innerHTML = '';

  if (frontImage) {
    const frontImgElement = document.createElement('img');
    frontImgElement.src = frontImage;
    frontImgElement.alt = 'Front Image';
    frontImgElement.classList.add('flashcard-image');
    frontContent.appendChild(frontImgElement);
  }

  const frontTextElement = document.createElement('p');
  frontTextElement.classList.add('flashcard-text');
  frontTextElement.textContent = frontText;
  frontContent.appendChild(frontTextElement);

  if (backImage) {
    const backImgElement = document.createElement('img');
    backImgElement.src = backImage;
    backImgElement.alt = 'Back Image';
    backImgElement.classList.add('flashcard-image');
    backContent.appendChild(backImgElement);
  }

  const backTextElement = document.createElement('p');
  backTextElement.classList.add('flashcard-text');
  backTextElement.textContent = backText;
  backContent.appendChild(backTextElement);
}

miro.onReady(() => {
  miro.initialize({
    extensionPoints: {
      toolbar: {
        title: 'Create Flashcard',
        svgIcon: '<svg>...</svg>', // Add your custom icon here
        onClick: createFlashcard,
      },
    },
  });
});

async function createFlashcard() {
  // User can provide text, and optionally an image, for front and back
  const frontText = prompt("Enter text for the front of the flashcard:");
  const backText = prompt("Enter text for the back of the flashcard:");
  const frontImage = prompt("Enter URL for the front image (optional):");
  const backImage = prompt("Enter URL for the back image (optional):");

  // Populate the flashcard in the Miro board or the web interface
  populateFlashcard(frontText, backText, frontImage, backImage);

  const widget = await miro.board.widgets.create({
    type: 'card',
    title: frontText || 'Flashcard Front',
    description: backText || 'Flashcard Back',
    style: {
      backgroundColor: '#ADD8E6', // Light blue
    },
  });

  // Toggle between front and back on click
  widget.onClick = async () => {
    const updated = widget.title === frontText
      ? { title: backText || 'Flashcard Back', description: frontText || 'Flashcard Front', style: { backgroundColor: '#90EE90' } }
      : { title: frontText || 'Flashcard Front', description: backText || 'Flashcard Back', style: { backgroundColor: '#ADD8E6' } };
    await miro.board.widgets.update({ id: widget.id, ...updated });
  };
}
