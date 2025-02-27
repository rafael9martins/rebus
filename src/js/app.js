import * as Sentry from '@sentry/browser';
import { render } from './mini';
import { initBR } from './appBR';

import { App } from './components/App';
import { Logo } from './components/Logo';
import { GithubCorner } from './components/GithubCorner';
import { ChangeButton } from './components/ChangeButton';
import { Rebus } from './components/Rebus';
import { ProgressBar } from './components/ProgressBar';
import { Hint } from './components/Hint';

import { actions } from './store';
import '../css/main.css';
import { ButtonCountryPTBR } from './components/ButtonPTBR';
import { ResetButton, clickReset } from './components/ResetButton';

const events = function(event) {
  const keys = event.key;
  if (keys === 'ArrowRight' || keys === 39) {
    actions.next();
  }
  if (keys === 'ArrowLeft' || keys === 37) {
    actions.prev();
  }
};

export function registerListeners() {
  document.removeEventListener('keyup', events);
  document.addEventListener('keyup', events);
}

export function setCurrentFromURL(rebus) {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get(rebus));
  actions.setCurrent(id);
}

// FUNCTION DEFAULT REBUS
export function init() {
  // CONDITION: if init as reset [pt-br] rebus
  if (localStorage.getItem('resetFlagBR') === 'true') {
    document.querySelector('.root').classList.add('rootbr'); // then keep design [pt-br] & [pt-br] rebus
    initBR();

    return;
  }

  localStorage.setItem('flagBR', 'false'); // FLAG: no [pt-br] rebus
  localStorage.setItem('resetFlagBR', 'false'); // FLAG: no reset [pt-br] rebus

  try {
    render(
      App(
        { app: 'app' },
        Logo(),
        GithubCorner({ url: 'https://github.com/ollelauribostrom/rebus' }),
        ChangeButton({
          className: 'change-button--prev',
          onClick: () => actions.prev()
        }),
        ButtonCountryPTBR({ button: '/?rebus-br=1' }),
        Rebus({
          charInput: (input, wordIndex, charIndex) => {
            const confettiCanon = document.querySelector('.confetti-canon');
            actions.setInput(input, wordIndex, charIndex);
            actions.check(confettiCanon);
          }
        }),
        ChangeButton({
          className: 'change-button--next',
          onClick: () => actions.next()
        }),
        Hint(),
        ProgressBar(),
        ResetButton({ resetButton: 'reset-english' })
      ),
      document.querySelector('.root')
    );
    clickReset('reset-english');
    clickbr();
    registerListeners();
  } catch (err) {
    Sentry.captureException(err);
  }
}

if (!global || !global.isTestRun) {
  Sentry.init({ dsn: 'https://8f025bee12e84d9b8a16e9c3b9155ce8@sentry.io/1300214' });
  init();
  registerListeners();
  setCurrentFromURL('rebus');
}

// BUTTON [PT-BR] - LOAD BUTTON
export function clickbr() {
  const e = document.getElementById('button-ptbr'); // get button [pt-br]

  // HOVER FUNCTION: cursor (hover) [pt-br]
  e.addEventListener('mouseover', () => {
    document.getElementById('button-text-id-br').classList.add('button-text-show');
  });
  e.addEventListener('mouseout', () => {
    document.getElementById('button-text-id-br').classList.remove('button-text-show');
  });

  // CLICK FUNCTION: click on button [pt-br]
  e.addEventListener('click', a => {
    a.preventDefault();

    document.querySelector('.root').classList.add('rootbr'); // switch to design [pt-br]
    document.querySelector('.app').classList.add('button-spam'); // hide [english] rebus

    initBR(); // switch to [pt-br] rebus
  });
}
