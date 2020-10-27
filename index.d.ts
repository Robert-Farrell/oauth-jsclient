import Tokens from 'csrf';
// import csrf from 'csrf';

declare class AuthResponse {
    constructor(params: AuthResponse.AuthResponseParams);
    processResponse(response: Response): void;
    getToken(): Token; 
    text(): string;    
    status(): number;
    headers(): Object;    
    valid(): boolean;    
    getJson(): object; // possibly null, so object rather than Object
    get_intuit_tid(): string;
    isContentType(): boolean;
    getContentType(): string;
    isJson(): boolean;
}

declare namespace AuthResponse {
    export interface AuthResponseParams {
        token?: Token;
        response?: Response;
        body?: string;
        json?: object;
        intuit_tid?: string;
    }
}

declare class Token implements Token.TokenData {
    
    realmId: string;
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    x_refresh_token_expires_in: number;
    id_token: string;
    latency: number;

    createdAt: Date; 

    accessToken(): string;
    refreshToken(): string;    
    tokenType(): string;    
    getToken(): Token.TokenData; 

    setToken(tokenData: Token.TokenData): Token;    
    clearToken(): Token;
    _checkExpiry(seconds: number): boolean;
    isAccessTokenValid(): boolean;
    isRefreshTokenValid(): boolean;
}

declare namespace Token {
    export interface TokenData {
        realmId: string; 
        token_type: string;
        access_token: string;
        refresh_token: string;
        expires_in: number;
        x_refresh_token_expires_in: number;
        id_token: string;        
        createdAt: Date;        
    }
}

declare class OAuthClient {
    constructor(config: OAuthClient.OAuthClientConfig);
    authorizeUri(params: OAuthClient.AuthorizeParams): string;
    createToken(uri: string): Promise<AuthResponse>;
    refresh(): Promise<AuthResponse>;
    refreshUsingToken(refresh_token: string): Promise<AuthResponse>;
    revoke(params?: OAuthClient.RevokeParams): Promise<AuthResponse>;
    getUserInfo(): Promise<AuthResponse>; 
    makeApiCall(params: OAuthClient.MakeApiCallParams): Promise<AuthResponse>; 
    validateIdToken(params?: OAuthClient.ValidateIdTokenParams ): Promise<AuthResponse>;
    getKeyFromJWKsURI(id_token: string, kid: string, request: Request): Promise<object | string>;
    getPublicKey(modulus: string, exponent: string): string;
    getTokenRequest(request: Request): Promise<AuthResponse>;
    validateToken(): void;
    loadResponse(request: Request): Promise<Response>;
    loadResponseFromJWKsURI(request: Request): Promise<Response>;
    createError(e: Error, authResponse?: AuthResponse): OAuthClient.OAuthClientError; 
    isAccessTokenValid(): boolean;
    getToken(): Token;
    setToken(params: Token.TokenData): Token;
    authHeader(): string;
    log(level: string, message: string, messageData: any): void;

    // Not present on OAuthClient
    // generateOauth1Sign(params: OAuthClient.GenerateOAuth1SignParams): string; 
    // migrate(params: OAuthClient.MigrateParams): Promise<AuthResponse>;
    
}

declare namespace OAuthClient {
    export interface OAuthClientConfig {
        clientId: string;
        clientSecret: string;
        redirectUri?: string;
        environment?: string;
        logging?: boolean;
    }

    export enum environment {
        sandbox = 'https://sandbox-quickbooks.api.intuit.com/',
        production = 'https://quickbooks.api.intuit.com/'
    }

    export enum scopes {
        Accounting = 'com.intuit.quickbooks.accounting',
        Payment = 'com.intuit.quickbooks.payment',
        Payroll = 'com.intuit.quickbooks.payroll',
        TimeTracking = 'com.intuit.quickbooks.payroll.timetracking',
        Benefits = 'com.intuit.quickbooks.payroll.benefits',
        Profile = 'profile',
        Email = 'email',
        Phone = 'phone',
        Address = 'address',
        OpenId = 'openid',
        Intuit_name = 'intuit_name'
    }

    export interface AuthorizeParams {
        scope: scopes | scopes[] | string;
        state?: Tokens | string;        
    }

    export interface RevokeParams {
        access_token?: string;
        refresh_token?: string;
    }

    // export interface GetUserInfoParams { }

    export interface MakeApiCallParams {
        url: string;
    }

    // export interface MigrateParams extends GenerateOAuth1SignParams {
    //     scope?: scopes | scopes[] | string;
    // }

    // export interface GenerateOAuth1SignParams {
    //     oauth_consumer_key: string;
    //     oauth_consumer_secret: string;
    //     access_token: string;
    //     access_secret: string;
    //     method: 'GET' | 'POST';
    //     uri: string;
    // }

    export interface ValidateIdTokenParams {
        id_token?: string;
    }

    export interface OAuthClientError extends Error {
        intuit_tid: string;
        authResponse: AuthResponse;
        originalMessage: string;
        error_description: string;
    }
}

export = OAuthClient;
