export interface PartnerData {
    id: string;
    name: string;
    phone: string;
}

export const callTypeMapping: { [key: string]: string } = {
    '1': "входящий звонок",
    '0': "исходящий звонок",
    'all': "все звонки",
};


export interface CallInterface {
    id: number;
    partnership_id: string;
    partner_data: PartnerData;
    date: string;
    date_notime: string;
    time: number;
    from_number: string;
    from_extension: string;
    to_number: string;
    to_extension: string;
    is_skilla: number;
    status: string;
    record: string;
    line_number: string;
    line_name: string;
    in_out: 1 | 0| undefined;
    from_site: number;
    source: string;
    errors: string[];
    disconnect_reason: string;
    results: [];
    stages: [];
    abuse: [];
    contact_name: string;
    contact_company: string;
    person_id: number;
    person_name: string;
    person_surname: string;
    person_avatar: string;
    candidate_id: number;
    candidate_name: string;
    candidate_link: string;
    candidate_vacancy_name: string;
}

export interface CallsApiResponse {
    total_rows: string;
    results: CallInterface[];
}
