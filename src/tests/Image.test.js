import Image from "../Image";

const setup = () => {
  const mockImage = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
  const mockCreateElement = jest.fn();
  mockCreateElement.mockReturnValue(mockImage);
  window.document.createElement = mockCreateElement;
};

describe("Image", () => {
  beforeEach(setup);

  it("should construct", () => {
    const image = new Image();
    expect(image).toBeInstanceOf(Image);
  });

  describe("load", () => {
    it("should return an Image for a loaded src", () => {
      const image = Image.create();
      const img = image.load("tile.png");
      expect(img).toBeInstanceOf(Image);
    });

    it("should call the callback param (if supplied)", () => {
      const image = Image.create();
      const callback = jest.fn();
      image.load("test", callback);
      expect(image.element.addEventListener).toHaveBeenCalled();
      expect(image.element.addEventListener.mock.calls[0][0]).toEqual("load");
      // expect(callback).toHaveBeenCalled();
    });
  });

  describe("Image.create", () => {
    it("should return an Image instance", () => {
      expect(Image.create()).toBeInstanceOf(Image);
    });
  });

  describe("Image.createElement", () => {
    it('should call createElement with a "img" param', () => {
      Image.createElement();
      expect(window.document.createElement).toHaveBeenCalledWith("img");
    });

    it("should set src attribute", () => {
      const image = Image.createElement("test");
      expect(image.src).toEqual("test");
    });

    it("should call addEventListener when a loadCallback is supplied ", () => {
      const callback = jest.fn();
      const image = Image.createElement(null, callback);
      expect(window.document.createElement).toHaveBeenCalledWith("img");
      expect(image.addEventListener).toHaveBeenCalledWith(
        "load",
        callback,
        false
      );
    });
  });
});
