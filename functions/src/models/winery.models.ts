export interface WineryGeneralInfo {
    name: string;
    foundedOn: string;
    logo: string;
    collections: string;
    noOfProducedWines: string;
    vineyardsSurface: string;
    noOfBottlesProducedPerYear: string;
    grapeVarieties: string;
    lastUpdated: string;
    certifications: string[];
    wineryHeadquarters: CoordinateInterface;
    wineryRepresentative: {
        name: string;
        email: string;
        phone: string;
    };
}

// COORDINATE INTERFACE
export interface CoordinateInterface {
    lat: number;
    lng: number;
}
