import { Timestamp } from 'firebase-admin/firestore';

export interface CreateAdminNotification {
    data: {
        requestDate: Timestamp;
        wineryName: string;
        wineryEmail: string;
        wineryPhone: string;
        wineryRepresentative: string;
    };
}

export interface CreateWineType {
    data: {
        wineTypes: string[];
    };
}
