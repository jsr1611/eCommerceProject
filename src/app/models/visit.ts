//Visit.js

export interface Visit{
    id?: string,
    date: Date,
    count: number,
    uniqueVisitors: number,
    visits: Device[],
}

export interface Device{
    ip: string,
    location?: {
        country: string,
        region: string,
        city: string
    },
    timestamp: Date,
}