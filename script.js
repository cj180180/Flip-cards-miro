miro.onReady(async () => {
    try {
        // Retrieve the current user's permissions
        const userPermissions = await miro.currentUser.getScopes();
        console.log('Permissions granted:', userPermissions); // Debugging

        // Check for critical permissions
        const canCreateWidgets = userPermissions.includes('board:widgets:create');
        const canReadWidgets = userPermissions.includes('board:widgets:read');

        // Disable button if the permission to create widgets is not granted
        if (!canCreateWidgets) {
            alert('This app requires permission to create widgets on the board.');
            document.getElementById('createFlashcardButton').disabled = true; // Disable button
        } else {
            // Enable button if permission is granted
            document.getElementById('createFlashcardButton').addEventListener('click', createFlashcard);
        }

        // Optional: Handle the flashcard flip feature
        const flashcard = document.getElementById('flashcard');
        flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));

    } catch (error) {
        console.error('Error checking permissions:', error);
    }
});

// Function to create a flashcard
async function createFlashcard() {
    // Check permissions again before proceeding to create
    const userPermissions = await miro.currentUser.getScopes();
    if (!userPermissions.includes('board:widgets:create')) {
        alert('Cannot create a flashcard without permission.');
        return; // Exit if permission is missing
    }

    // Logic for creating a flashcard in Miro
    const widget = await miro.board.widgets.create({
        type: 'card',
        title: 'Flashcard Front',
        description: 'Flashcard Back',
    });

    widget.onClick = async () => {
        const updated = widget.title === 'Flashcard Front'
            ? { title: 'Flashcard Back', description: 'Flashcard Front' }
            : { title: 'Flashcard Front', description: 'Flashcard Back' };
        await miro.board.widgets.update({ id: widget.id, ...updated });
    };
}
