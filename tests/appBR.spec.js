import { initBR, setCurrentFromURL } from '../src/js/appBR';
import { actions as actionsMock } from '../src/js/storeBR';
import { isRebusAnswered } from '../src/js/rebusesBR';
import * as renderMock from '../src/js/mini/render';

jest.mock('../src/js/mini/render', () => {
  const mock = {};
  function reset() {
    Object.assign(mock, {
      render: jest.fn(),
      reset
    });
  }
  reset();
  return mock;
});

jest.mock('../src/js/storeBR', () => ({
  actions: {
    next: jest.fn(),
    prev: jest.fn(),
    setCurrent: jest.fn()
  },
  connect: component => component
}));

afterEach(() => {
  renderMock.reset();
});

const setup = () => {
  const container = document.createElement('div');
  container.className = 'rootbr';
  document.body.append(container);
  return { container };
};

describe('Tests for app', () => {
  describe('initBR', () => {
    it('renders the app into the root element', () => {
      const { container } = setup();
      initBR();
      expect(renderMock.render).toHaveBeenCalledTimes(1);
      const firstCall = renderMock.render.mock.calls[0];
      const [firstArg, secondArg] = firstCall;
      expect(firstArg).toMatchSnapshot();
      expect(secondArg).toEqual(container);
    });
  });
  describe('setCurrentFromURL', () => {
    it('sets the current rebus based on the url query string', () => {
      window.history.pushState({}, 'Test', '/?rebus-br=2');
      setCurrentFromURL('rebus-br');
      expect(actionsMock.setCurrent).toHaveBeenCalledWith(2);
    });
  });
  describe('resetRebuses(BR)', () => {
    it('reset all rebusesBR', () => {
      window.localStorage.removeItem('answeredRebusesBR');
      expect(
        window.localStorage.getItem('answeredRebusesBR') === undefined &&
          isRebusAnswered(0) === false
      );
    });
  });
});
