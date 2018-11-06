import Game from "../Game";
import Canvas from "../Canvas";
import { isNumber, timestamp } from "../utils";
/* eslint-disable no-multi-assign */

function mockQuerySelector() {
  const qs = (window.document.querySelector = jest.fn());
  qs.mockReturnValue({ getContext: () => ({}) });
}
function mockRequestAnimationFrame() {
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
    cb(timestamp());
    return 1;
  });
}

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
      expect(game.interfaces.keyboard).toBeInstanceOf(Object);
      expect(game.interfaces.mouse).toBeInstanceOf(Object);
    });

    it("should construct a  canvas without keyboard support", () => {
      const game = new Game("test", { contextType: "2d", keyboard: false });
      expect(game.canvas).toBeInstanceOf(Object);
      expect(game.interfaces.keyboard).toBeUndefined();
    });

    it("should construct a new canvas without mouse support", () => {
      const game = new Game("test", { contextType: "2d", mouse: false });
      expect(game.canvas).toBeInstanceOf(Object);
      expect(game.interfaces.mouse).toBeUndefined();
    });
  });

  describe("start", () => {
    beforeEach(() => {
      const qs = (window.document.querySelector = jest.fn());
      qs.mockReturnValue({ getContext: () => ({}) });
      mockRequestAnimationFrame();
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
      expect(args[2]).toEqual(game.interfaces);
      expect(args[3]).toBeInstanceOf(Array);
      expect(args[3]).toEqual([]);
    });

    it("should call the updater", () => {
      const game = new Game("test");
      const renderer = jest.fn();
      const updater = jest.fn();
      game.start(renderer, updater);
      expect(updater).toHaveBeenCalled();
      const args = updater.mock.calls[0];
      expect(args).toHaveLength(5);
      expect(isNumber(args[0])).toBe(true);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[2]).toBeInstanceOf(Canvas);
      expect(args[2]).toEqual(game.canvas);
      expect(args[3]).toBeInstanceOf(Object);
      expect(args[3]).toEqual(game.interfaces);
      expect(args[4]).toBeInstanceOf(Array);
      expect(args[4]).toEqual([]);
    });

    it("should call the initializer", () => {
      const game = new Game("test");
      const renderer = jest.fn();
      const updater = jest.fn();
      const initializer = jest.fn();
      game.start(renderer, updater, initializer);
      expect(initializer).toHaveBeenCalled();
      expect(initializer.mock.calls).toHaveLength(1);
      const args = renderer.mock.calls[0];
      expect(args).toHaveLength(4);
      expect(args[0]).toBeInstanceOf(Object);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[1]).toEqual(game.canvas);
      expect(args[2]).toBeInstanceOf(Object);
      expect(args[2]).toEqual(game.interfaces);
      expect(args[3]).toBeInstanceOf(Array);
      expect(args[3]).toEqual([]);
    });
  });

  describe("stop", () => {
    beforeEach(() => {
      mockQuerySelector();
      mockRequestAnimationFrame();
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
      mockQuerySelector();
      mockRequestAnimationFrame();
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
      expect(args[2]).toEqual(game.interfaces);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("update method", () => {
    beforeEach(() => {
      mockQuerySelector();
      mockRequestAnimationFrame();
    });

    it("should call the update method", () => {
      class MyGame extends Game {
        constructor(id) {
          super(id);
          this.update = jest.fn();
          this.render = jest.fn();
        }
      }
      const game = new MyGame("test");
      game.start();
      expect(game.update).toHaveBeenCalled();
      const args = game.update.mock.calls[0];
      expect(args).toHaveLength(5);
      expect(isNumber(args[0])).toBe(true);
      expect(args[1]).toBeInstanceOf(Object);
      expect(args[2]).toBeInstanceOf(Canvas);
      expect(args[2]).toEqual(game.canvas);
      expect(args[3]).toBeInstanceOf(Object);
      expect(args[3]).toEqual(game.interfaces);
      expect(args[4]).toBeInstanceOf(Array);
      expect(args[4]).toEqual([]);
    });
  });

  describe("initialize method", () => {
    beforeEach(() => {
      mockQuerySelector();
      mockRequestAnimationFrame();
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
      expect(args[2]).toEqual(game.interfaces);
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
