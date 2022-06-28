import deleteStream from "../delete-stream";

describe("delete stream controller", () => {
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
      body: {
        userId: null,
      },
    };
    deleteStream(mReq as any, mRes as any, mNext);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.status().json).toBeCalledWith({
      message: "Missing userId",
    });
  });

  test("should throw 400 error if userId is empty string", () => {
    const mReq = {
      body: {
        userId: "",
      },
    };
    deleteStream(mReq as any, mRes as any, mNext);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.status().json).toBeCalledWith({
      message: "Missing userId",
    });
  });
});
