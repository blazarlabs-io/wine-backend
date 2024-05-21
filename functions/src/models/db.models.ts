import { Timestamp } from 'firebase-admin/firestore';
import { WineryGeneralInfo } from './winery.models';

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

export interface NewWineryField {
    data: {
        field: string;
        value: string | number | boolean | string[];
    };
}

export interface LevelMap {
    data: {
        bronze: {
            price: number;
            qrCodes: number;
        };
        silver: {
            price: number;
            qrCodes: number;
        };
        gold: {
            price: number;
            qrCodes: number;
        };
        platinum: {
            price: number;
            qrCodes: number;
        };
    };
}

export interface StringArray {
    data: string[];
}

export interface CreateWinery {
    uid: string;
    generalInfo: WineryGeneralInfo;
}
