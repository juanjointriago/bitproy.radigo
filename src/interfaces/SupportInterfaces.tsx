// Generated by https://quicktype.io

export interface GetSupportInfoResponse {
    ok:   boolean;
    msg:  string;
    data: Data;
}

export interface Data {
    info: Info;
}

export interface Info {
    id:              number;
    phone_primary:   string;
    phone_secondary: string;
    email:           string;
    direction:       string;
}