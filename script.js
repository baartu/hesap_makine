class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷': // Using the division symbol from the HTML
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';

        // CHECK ID 0: The Special 31 Check
        if (String(computation).includes('31')) {
            triggerLaughReaction();
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

document.querySelectorAll('[data-key]').forEach(button => {
    button.addEventListener('click', () => {
        const key = button.getAttribute('data-key');
        if (['+', '-', '*', '/'].includes(key)) {
            calculator.chooseOperation(key);
        } else {
            calculator.appendNumber(key);
        }
        calculator.updateDisplay();
    });
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', event => {
    let key = event.key;
    if (/[0-9.]/.test(key)) {
        calculator.appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        calculator.chooseOperation(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculator.compute();
    } else if (key === 'Backspace') {
        calculator.delete();
    } else if (key === 'Escape') {
        calculator.clear();
    }
    calculator.updateDisplay();
});


// -----------------------------------------------------
// SPECIAL REACTION LOGIC
// -----------------------------------------------------

function triggerLaughReaction() {
    console.log("31 DETECTED! INITIATING LAUGH SEQUENCE.");

    const calcContainer = document.getElementById('calculator');
    // 1. Shake Effect
    calcContainer.classList.add('shake');
    calcContainer.classList.add('laughing-mode');

    setTimeout(() => {
        calcContainer.classList.remove('shake');
        setTimeout(() => calcContainer.classList.remove('laughing-mode'), 2000);
    }, 1000);

    // 2. Audio Effect (MP3)
    const audio = new Audio('gulme_efekti.mp3');
    audio.play().catch(e => console.log("Audio play failed:", e));
}
