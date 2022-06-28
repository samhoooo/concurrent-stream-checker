import getStream from "../get-stream";

describe("get stream controller", () => {
  let mRes: any;
  let mNext: any;
  beforeEach(() => {
    mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mNext = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should throw 400 error if userId is null", () => {
    const mReq = {
      query: {
        userId: null,
      },
    };
    getStream(mReq as any, mRes as any, mNext);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.status().json).toBeCalledWith({
      message: "Missing userId",
    });
  });

  test("should throw 400 error if userId is empty string", () => {
    const mReq = {
      query: {
        userId: "",
      },
    };
    getStream(mReq as any, mRes as any, mNext);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.status().json).toBeCalledWith({
      message: "Missing userId",
    });
  });
});
