export interface SendPasswordEmail {
    data: {
        from: string;
        to: string;
        subject: string;
        text: string;
        html: string;
    };
}
