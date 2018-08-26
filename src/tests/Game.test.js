import Game from '../game';

describe('Game', () => {

  describe('invalid or missing selector', () => {
    beforeEach(() => {
      window.document.querySelector = jest.fn();
    });

    it('should throw an exception if a selector is not supplied', () => {
      expect(() => new Game()).toThrowError(/^Invalid selector/); 
    });

    it('should throw an exception if the selector does not return anything', () => {
      expect(() => new Game('invalid')).toThrowError(/^Invalid selector/); 
    });
  });

  describe('valid selector', () => {

    beforeEach(() => {
      const qs = window.document.querySelector = jest.fn();
      qs.mockReturnValue({});
    });
    
    it('should construct a new canvas and mouse', () => {
      const game = new Game('test');
      expect(game.canvas).toBeInstanceOf(Object);
      expect(game.mouse).toBeInstanceOf(Object);
    });

    it('should construct a new canvas without mouse support', () => {
      const game = new Game('test', { contextType: '2d', mouse: false });
      expect(game.canvas).toBeInstanceOf(Object);
      expect(game.mouse).toBeUndefined();
    });
  });

  describe('animate callback', ()=> {

    beforeEach(() => {
      const qs = window.document.querySelector = jest.fn();
      qs.mockReturnValue({ getContext: () => ({}) });
      window.requestAnimationFrame = jest.fn();
    });

    it('should throw an exception if no callback is supplied', () => {
      const game = new Game('test');
      expect(() => game.animate()).toThrowError(/^Missing render callback or method/); 
    });

    it('should call the animate callback', () => {
      const game = new Game('test');
      const callback = jest.fn();
      game.animate(callback);
      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls).toHaveLength(1);
      const args = callback.mock.calls[0];
      expect(args).toHaveLength(3);
      expect(args[0]).toBeInstanceOf(Object);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[1]).toEqual(game.canvas);
      expect(args[2]).toBeInstanceOf(Object);
      expect(args[2]).toEqual(game.mouse);
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should call requestAnimationFrame if the callback returns true', () => {
      const game = new Game('test');
      const callback = jest.fn();
      callback.mockReturnValue(true);
      game.animate(callback);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

  });

  describe('render method', ()=> {

    beforeEach(() => {
      const qs = window.document.querySelector = jest.fn();
      qs.mockReturnValue({ getContext: () => ({}) });
      window.requestAnimationFrame = jest.fn();
    });

    it('should call the render method', () => {
      class MyGame extends Game {
        constructor(selector) {
          super(selector);
        }

        render(context, canvas, mouse) {
          return true;
        }
      }
      const game = new MyGame('test');
      const callback = jest.fn();
      callback.mockReturnValue(true);
      game.animate(callback);
      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls).toHaveLength(1);
      const args = callback.mock.calls[0];
      expect(args).toHaveLength(3);
      expect(args[0]).toBeInstanceOf(Object);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[1]).toEqual(game.canvas);
      expect(args[2]).toBeInstanceOf(Object);
      expect(args[2]).toEqual(game.mouse);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    beforeEach(() => {
      const qs = window.document.querySelector = jest.fn();
      qs.mockReturnValue({ getContext: () => ({}) });
    });

    it('should return a Game instance', () => {
      expect(Game.create('test')).toBeInstanceOf(Game);
    });
  });
});
