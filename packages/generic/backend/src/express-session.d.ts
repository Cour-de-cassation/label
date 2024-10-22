import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      _id: string;
      name: string;
      role: string;
      email: string;
      sessionIndex: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      session: session.Session & Partial<session.SessionData>;
    }
  }
}
