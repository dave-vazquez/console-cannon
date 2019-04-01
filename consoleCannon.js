/*********************************************************************************
*                            GLOBAL VARIABLES/FUNCTIONS                           *
**********************************************************************************/ 
let height, velocity, gravity, animationSpeed, interval, cannon;

let cannonFired = false;

const DOM = {
    heightInput: document.getElementById('height-input'),
    heightVal: document.getElementById('height-val'),

    velocityInput: document.getElementById('velocity-input'),
    velocityVal: document.getElementById('velocity-val'),

    gravityInput: document.getElementById('gravity-input'),
    gravityVal: document.getElementById('gravity-val'),

    animationInput: document.getElementById('animation-input'),
    animationVal: document.getElementById('animation-val'),

    intervalInput: document.getElementById('interval-input'),
    intervalVal: document.getElementById('interval-val'),

    fireCannonBtn: document.getElementById('fire-cannon-button'),
    stopLaunchBtn: document.getElementById('stop-launch-button'),
    clearTerminalBtn: document.getElementById('clear-terminal-button'),

    nodeTerminal: document.getElementById('node-terminal')
}

function printNodeCommand() {

    let nodeCommand = 'node consoleCannon.js \n'.split('');

    nodeCommand.forEach(async char => {
        await sleep(150);
        DOM.nodeTerminal.textContent += char;
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve,ms));
    }
}

/*********************************************************************************
*                          CONSOLE CANNON FACTORY                                *
**********************************************************************************/ 
const consoleCannonFactory = (interval = 50, animationRate = 1) => {


    let cannonBall = {
        y:  0,      // cannonBall height (y-coodinate)
        yv: 0,      // cannonBall velocity (y-axis)
        b:  0,      // number of bounces
        e:  0.6,    // coefficient of restitution (bounce half-life)
        g: 0,       // gravity
        string: '', // string representation of cannonball

        updateDisplacement: function () {

            this.calculateDisplacement();
            
            this.string = this.spaces(this.y) + '.';
        },
        
        calculateDisplacement: function () {
            this.y -= this.yv*animationRate;
            this.yv += this.g;
    
            if(this.y < 0) {
                this.y = 0;
                this.yv *= -this.e;
                this.b++;
            }

            this.y = Math.round(this.y);
        },

        spaces : function () {
            if(this.y < 0) {
                this.y = 0;
            }

            return Array(this.y).fill(' ').join('');
        },

        log: function () {
            DOM.nodeTerminal.textContent += this.string + '\n';  
            DOM.nodeTerminal.scrollTop = DOM.nodeTerminal.scrollHeight;
        },
    }

    return {
        interval: null,

        launch: function (initialHeight = 100, velocity = 7, gravity = .5) {
            cannonBall.y = initialHeight;
            cannonBall.yv = velocity;
            cannonBall.g = gravity;

            this.launchInterval = setInterval(() => {
                
                cannonBall.updateDisplacement();
                cannonBall.log();

                // if(cannonBall.yv < 0 && cannonBall.yv > -21.1) {
                //     yv = 0;
                // }

                if(cannonBall.b === 10) {
                    cannonFired = false;
                    DOM.nodeTerminal.textContent += 'Macs-MBP-3:closure-cannon davevazquez$ ';
                    clearInterval(this.launchInterval);
                }
            }, interval)
        },

        terminate: function () {
            clearInterval(this.launchInterval)
        }
    }
}

/*********************************************************************************
*                                EVENT LISTENERS                                 *
**********************************************************************************/ 

/****************************************************************
*                    HEIGHT SLIDER LISTENER                     *
*****************************************************************/ 
DOM.heightInput.addEventListener('input', () => {
    DOM.heightVal.textContent = DOM.heightInput.value;
    height = Number(DOM.heightVal.textContent);
});

/****************************************************************
*                   VELOCITY SLIDER LISTENER                    *
*****************************************************************/ 
DOM.velocityInput.addEventListener('input', () => {
    DOM.velocityVal.textContent = DOM.velocityInput.value;
    velocity = Number(DOM.velocityVal.textContent);
});

/****************************************************************
*                    GRAVITY SLIDER LISTENER                    *
*****************************************************************/ 
DOM.gravityInput.addEventListener('input', () => {
    DOM.gravityVal.textContent = DOM.gravityInput.value;
    gravity = Number(DOM.gravityVal.textContent);
});

/****************************************************************
*                 ANIMATION SPEED SLIDER LISTENER               *
*****************************************************************/ 
DOM.animationInput.addEventListener('input', () => {
    animationSpeed = Math.round(1/Number(DOM.animationInput.value) * 100) / 100;
    console.log(animationSpeed);
    DOM.animationVal.textContent = animationSpeed;
});

/****************************************************************
*                     INTERVAL SPEED LISTENER                   *
*****************************************************************/ 
DOM.intervalInput.addEventListener('input', () => {
    DOM.intervalVal.textContent = DOM.intervalInput.value;
    interval = Number(DOM.intervalVal.textContent);
});

/****************************************************************
*                        FIRE CANNON BUTTON                     *
*****************************************************************/ 
DOM.fireCannonBtn.addEventListener('click', () => {

    console.log(interval, animationSpeed, height, velocity, gravity);
    if(!cannonFired) {

        DOM.nodeTerminal.textContent += 'node consoleCannon.js \n';
    
        cannon = consoleCannonFactory(interval, animationSpeed);

        cannon.launch(height, velocity, gravity);

        cannonFired = true;
    }
});

/****************************************************************
*                    STOP LAUNCH BUTTON LISTENER                *
*****************************************************************/ 
DOM.stopLaunchBtn.addEventListener('click', ()=> {
    
    if(cannonFired) {
        cannonFired = false;
        cannon.terminate();
        DOM.nodeTerminal.textContent += 'Macs-MBP-3:closure-cannon davevazquez$ ';
    }
});

/****************************************************************
*                    CLEAR TERMINAL BUTTON LISTENER             *
*****************************************************************/ 
DOM.clearTerminalBtn.addEventListener('click', ()=> {
    if(cannonFired) {
        cannonFired = false;
        cannon.terminate();
    }

    DOM.nodeTerminal.textContent = 'Macs-MBP-3:closure-cannon davevazquez$ ';    
});

/****************************************************************
*                      WINDOW ON LOAD LISTENER                  *
*****************************************************************/ 
window.onload = () => {
    DOM.heightVal.innerText = DOM.heightInput.value;
    height = Number(DOM.heightInput.value);

    DOM.velocityVal.innerText = DOM.velocityInput.value;
    velocity = Number(DOM.velocityInput.value);

    DOM.gravityVal.innerText = DOM.gravityInput.value;
    gravity = Number(DOM.gravityInput.value);

    animationSpeed = Math.round(1/Number(DOM.animationInput.value) * 100) / 100;
    DOM.animationVal.textContent = animationSpeed;

    DOM.intervalVal.innerText = DOM.intervalInput.value;
    interval = Number(DOM.intervalInput.value);

    DOM.nodeTerminal.disabled = true;
    DOM.nodeTerminal.textContent = 'Macs-MBP-3:closure-cannon davevazquez$ ';
};