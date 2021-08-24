let setItemSpy: jest.SpyInstance<void, [key: string, value: string]>;
let getItemSpy: jest.SpyInstance<string | null, [key: string]>;
let mockStorage: { [key: string]: string } = {};

export const mockLocalStorage = () => {
  setItemSpy = jest
    .spyOn(global.Storage.prototype, "setItem")
    .mockImplementation((key, value) => {
      mockStorage[key] = value;
    });
  getItemSpy = jest
    .spyOn(global.Storage.prototype, "getItem")
    .mockImplementation((key) => mockStorage[key]);
};

export const tearDownLocalStorage = () => {
  // then, detach our spies to avoid breaking other test suites
  getItemSpy.mockRestore();
  setItemSpy.mockRestore();
  mockStorage = {};
};
