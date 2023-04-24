export type GetAuthorizationUrlRes = {
  url: string;
  nonce: string;
};

export type GetUserInfoRes = {
  data: MyInfoData;
  sub: string;
};

export type GetCallbackRes = GetUserInfoRes;

type MyInfoData = {
  ["myinfo.name"]?: string;
};

export type GetProtectedRes = {
  message: string;
};
