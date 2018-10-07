import Game from "../Game";
/* eslint-disable no-multi-assign */

describe("Game", () => {
  describe("invalid selector", () => {
    beforeEach(() => {
      window.document.querySelector = jest.fn();
    });

    it("should throw an exception if the selector does not return anything", () => {
      expect(() => new Game("invalid")).toThrowError(/^Invalid selector/);
    });
  });

  describe("valid selector", () => {
    beforeEach(() => {
      const qs = (window.document.querySelector = jest.fn());
      qs.mockReturnValue({});
    });

    it("should construct a new canvas, keyboerd, and mouse", () => {
      const game = new Game("test");
      expect(game.canvas).toBeInstanceOf(Object);
      expect(game.controls.keyboard).toBeInstanceOf(Object);
      expect(game.controls.mouse).toBeInstanceOf(Object);
    });

    it("should construct a  canvas without keyboard support", () => {
      const game = new Game("test", { contextType: "2d", keyboard: false });
      expect(game.canvas).toBeInstanceOf(Object);
      expect(game.controls.keyboard).toBeUndefined();
    });

    it("should construct a new canvas without mouse support", () => {
      const game = new Game("test", { contextType: "2d", mouse: false });
      expect(game.canvas).toBeInstanceOf(Object);
      expect(game.controls.mouse).toBeUndefined();
    });
  });

  describe("start", () => {
    beforeEach(() => {
      const qs = (window.document.querySelector = jest.fn());
      qs.mockReturnValue({ getContext: () => ({}) });
      window.requestAnimationFrame = jest.fn();
    });

    it("should throw an exception if no renderer is supplied", () => {
      const game = new Game("test");
      expect(() => game.start()).toThrowError(
        /^Missing render callback or method/
      );
    });

    it("should call the renderer", () => {
      const game = new Game("test");
      const renderer = jest.fn();
      game.start(renderer);
      expect(renderer).toHaveBeenCalled();
      expect(renderer.mock.calls).toHaveLength(1);
      const args = renderer.mock.calls[0];
      expect(args).toHaveLength(4);
      expect(args[0]).toBeInstanceOf(Object);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[1]).toEqual(game.canvas);
      expect(args[2]).toBeInstanceOf(Object);
      expect(args[2]).toEqual(game.controls);
      expect(args[3]).toBeInstanceOf(Array);
      expect(args[3]).toEqual([]);
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it("should call the initializer", () => {
      const game = new Game("test");
      const renderer = jest.fn();
      const initializer = jest.fn();
      game.start(renderer, initializer);
      expect(initializer).toHaveBeenCalled();
      expect(initializer.mock.calls).toHaveLength(1);
      const args = renderer.mock.calls[0];
      expect(args).toHaveLength(4);
      expect(args[0]).toBeInstanceOf(Object);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[1]).toEqual(game.canvas);
      expect(args[2]).toBeInstanceOf(Object);
      expect(args[2]).toEqual(game.controls);
      expect(args[3]).toBeInstanceOf(Array);
      expect(args[3]).toEqual([]);
    });

    it("should call requestAnimationFrame if the renderer returns true", () => {
      const game = new Game("test");
      const renderer = jest.fn();
      renderer.mockReturnValue(true);
      game.start(renderer);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    beforeEach(() => {
      const qs = (window.document.querySelector = jest.fn());
      qs.mockReturnValue({ getContext: () => ({}) });
      window.requestAnimationFrame = jest.fn();
      window.requestAnimationFrame.mockReturnValue(1);
      window.cancelAnimationFrame = jest.fn();
    });

    it("should call cancelAnimationFrame", () => {
      const game = new Game("test");
      const renderer = jest.fn();
      renderer.mockReturnValue(true);
      game.start(renderer);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
      game.stop();
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("render method", () => {
    beforeEach(() => {
      const qs = (window.document.querySelector = jest.fn());
      qs.mockReturnValue({ getContext: () => ({}) });
      window.requestAnimationFrame = jest.fn();
    });

    it("should call the render method", () => {
      class MyGame extends Game {
        constructor(id) {
          super(id);
          this.render = jest.fn();
          this.render.mockReturnValue(true);
        }
      }
      const game = new MyGame("test");
      game.start();
      expect(game.render).toHaveBeenCalled();
      expect(game.render.mock.calls).toHaveLength(1);
      const args = game.render.mock.calls[0];
      expect(args).toHaveLength(4);
      expect(args[0]).toBeInstanceOf(Object);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[1]).toEqual(game.canvas);
      expect(args[2]).toBeInstanceOf(Object);
      expect(args[2]).toEqual(game.controls);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("initialize method", () => {
    beforeEach(() => {
      const qs = (window.document.querySelector = jest.fn());
      qs.mockReturnValue({ getContext: () => ({}) });
      window.requestAnimationFrame = jest.fn();
    });

    it("should call the initialize method", () => {
      class MyGame extends Game {
        constructor(id) {
          super(id);
          this.initialize = jest.fn();
          this.render = jest.fn();
        }
      }
      const game = new MyGame("test");
      game.start();
      expect(game.initialize).toHaveBeenCalled();
      expect(game.initialize.mock.calls).toHaveLength(1);
      const args = game.initialize.mock.calls[0];
      expect(args).toHaveLength(4);
      expect(args[0]).toBeInstanceOf(Object);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[1]).toEqual(game.canvas);
      expect(args[2]).toBeInstanceOf(Object);
      expect(args[2]).toEqual(game.controls);
    });
  });

  describe("create", () => {
    beforeEach(() => {
      const qs = (window.document.querySelector = jest.fn());
      qs.mockReturnValue({ getContext: () => ({}) });
    });

    it("should return a Game instance", () => {
      expect(Game.create("test")).toBeInstanceOf(Game);
    });
  });
});
