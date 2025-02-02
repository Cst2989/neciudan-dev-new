type ToastType = 'success' | 'error';

class Toast {
  private static container: HTMLDivElement;

  static initialize() {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(this.container);
    }
  }

  static show(message: string, type: ToastType = 'success') {
    this.initialize();

    const toast = document.createElement('div');
    toast.className = `
      transform transition-all duration-300 ease-out translate-x-full
      px-4 py-2 rounded-lg shadow-lg
      ${type === 'success' 
        ? 'bg-blue-600 text-white' 
        : 'bg-red-600 text-white'}
    `;
    toast.textContent = message;

    this.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      toast.classList.add('opacity-0');
      setTimeout(() => {
        this.container.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

export default Toast; 
