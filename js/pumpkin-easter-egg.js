// Pumpkin Easter Egg
class PumpkinEasterEgg {
<<<<<<< HEAD
    triggerPumpkinAnimation() {
        // Create pumpkin element
        const pumpkin = EQuery.elemt('div', null, 'evil-pumpkin');
        EQuery('body').append(pumpkin);

        // Create CSS for the pumpkin
        const style = EQuery.elemt('style', `
=======
    constructor() {
        this.pattern = '31halloween';
        this.currentInput = '';
        this.initializeEventListener();
    }

    initializeEventListener() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e.key.toLowerCase());
        });
    }

    handleKeyPress(key) {
        this.currentInput += key;
        
        // Keep only the last N characters where N is the pattern length
        if (this.currentInput.length > this.pattern.length) {
            this.currentInput = this.currentInput.slice(-this.pattern.length);
        }

        if (this.currentInput === this.pattern) {
            this.triggerPumpkinAnimation();
            this.currentInput = ''; // Reset input
        }
    }

    triggerPumpkinAnimation() {
        // Create pumpkin element
        const pumpkin = document.createElement('div');
        pumpkin.className = 'evil-pumpkin';
        document.body.appendChild(pumpkin);

        // Create CSS for the pumpkin
        const style = document.createElement('style');
        style.textContent = `
>>>>>>> 90eb11d (added easter eggs and alot more)
            .evil-pumpkin {
                position: fixed;
                width: 100px;
                height: 100px;
                background: url('../assets/pumkin.png') no-repeat center/contain;
                z-index: 99999;
                transition: all 0.5s ease-in-out;
                transform: scale(0.1);
                top: 50%;
                left: 50%;
                filter: drop-shadow(0 0 10px #ff6600);
            }

            .evil-pumpkin.animated {
                animation: pumpkinAttack 3s forwards;
            }

            @keyframes pumpkinAttack {
                0% {
                    transform: scale(0.1) translate(-50%, -50%);
                }
                50% {
                    transform: scale(2) translate(-25%, -25%);
                }
                75% {
                    transform: scale(15) translate(-5%, -5%);
                }
                100% {
                    transform: scale(50) translate(-2%, -2%);
                }
            }

            .evil-pumpkin::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background: #000;
                mix-blend-mode: multiply;
                animation: pumpkinGlow 1s infinite alternate;
            }

            @keyframes pumpkinGlow {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 0.3;
                }
            }
<<<<<<< HEAD
        `);
        EQuery('head').append(style);
=======
        `;
        document.head.appendChild(style);
>>>>>>> 90eb11d (added easter eggs and alot more)

        // Add spooky sound
        const audio = new Audio('../assets/evil-laugh.mp3');
        audio.volume = 0.5;
        audio.play();

        // Trigger animation
        requestAnimationFrame(() => {
<<<<<<< HEAD
            pumpkin.addClass('animated');
=======
            pumpkin.classList.add('animated');
>>>>>>> 90eb11d (added easter eggs and alot more)
        });

        // Reload page after animation
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}

<<<<<<< HEAD
// Export for use in other modules if needed
export { PumpkinEasterEgg };
=======
// Initialize the easter egg
const pumpkinEasterEgg = new PumpkinEasterEgg();

// Export for use in other modules if needed
export default pumpkinEasterEgg;
>>>>>>> 90eb11d (added easter eggs and alot more)
