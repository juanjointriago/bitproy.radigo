
export interface GetTermsResponse {
    ok:   boolean;
    msg:  string;
    data: Data;
}

export interface Data {
    id:    number;
    terms: string;
}
