type Session = {
  nonce?: string;
  state?: string;
  accessToken?: string;
};

const store = new Map<string, Session>();

export { store };
