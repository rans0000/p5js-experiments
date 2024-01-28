class DialogManager {
    dialog: HTMLDialogElement;
    showButton: HTMLButtonElement;
    closeButton: HTMLButtonElement;

    constructor() {
        this.dialog = document.querySelector('dialog')!;
        this.showButton = document.querySelector('button.btn-dialog')!;
        this.closeButton = document.querySelector('button.btn-dialog-close')!;

        this.showButton.addEventListener('click', () => {
            this.openDialog();
        });

        this.closeButton.addEventListener('click', () => {
            this.closeDialog();
        });

        this.dialog.addEventListener('click', (event: MouseEvent) => {
            if ((event.target as HTMLElement).nodeName === 'DIALOG') {
                this.closeDialog();
            }
        });
    }

    openDialog() {
        this.dialog.showModal();
    }
    closeDialog() {
        this.dialog.setAttribute('close', '');
        this.dialog.addEventListener(
            'animationend',
            () => {
                this.dialog.removeAttribute('close');
                this.dialog.close();
            },
            { once: true }
        );
    }
}

new DialogManager();

export default DialogManager;
