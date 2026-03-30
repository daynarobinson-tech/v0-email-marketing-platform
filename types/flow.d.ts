declare module "@onflow/fcl" {
  export function config(options?: any): any;
  export function logIn(): Promise<any>;
  export function unauthenticate(): void;
  export const currentUser: {
    subscribe: (callback: (user: any) => void) => void;
  };
  export function authenticate(): Promise<any>;
  export function send(args: any): Promise<any>;
  export function tx(transactionId: any): any;
  export function query(args: any): Promise<any>;
}
