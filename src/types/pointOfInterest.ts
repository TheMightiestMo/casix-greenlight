import type { AxiosResponse } from 'axios';

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  streetNr: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Attribute {
  id: string;
  name: string;
  code: string;
  isStandard: boolean;
}

export interface BookeeType {
  id: string;
  provId: string;
  name: string;
}

export interface BookingModel {
  id: string;
  interval: string;
  minBookingLength: string;
  maxBookingLength: string;
  minAdvance: string;
  maxAdvance: string;
}

export interface Remark {
  id: string;
  provId: string;
  name: string;
  subject: string;
  severity: number;
  infoType: string[];
  contentType: string;
  content?: string;
  reference?: string;
  validity: {
    start: string | null;
    end: string | null;
  };
}

export interface BookeeProduct {
  id: string;
  provId: string;
  name: string;
  brand: string;
  bookeeCategory: string;
  remarks: Remark[];
}

export interface Bookee {
  id: string;
  provId: string;
  name: string;
  isPool: boolean;
  poolElementIds: string[];
  displayName: string;
  locality: string;
  slotBased: boolean;
  doorCount: number;
  enginePowerKW: number;
  fuelLevel: number;
  fuelTypeName: string;
  isElectroMobile: boolean;
  licenseNumber: string;
  seatCount: number;
  carbonDioxideEmission: number;
  attributes: Attribute[];
  bookeeType: BookeeType;
  bookeeProduct: BookeeProduct;
  place: Place;
  useMode: string;
  returnLocation: string;
  instantAccess: boolean;
  advanceBooking: boolean;
  openEnd: boolean;
  bookableOnPremises: boolean;
  bookableRemote: boolean;
  poolElementCount: number;
  directLinks: string[];
  bookingModel: BookingModel;
  remarks: Remark[];
}

export interface Place {
  id: string;
  provId: string;
  name: string;
  geoCoordinate: GeoCoordinate;
  isFixed: boolean;
  cityId: string;
  bookees: Bookee[];
  address: Address;
  poolElementCount: number;
  distance?: number;
}

export interface PointOfInterest {
  id: string;
  geoCoordinate: GeoCoordinate;
  places: Place[];
  distance: number;
}

export interface FetchResponse {
  data: PointOfInterest[];
  duration: number;
}

export interface PoiRequestParams {
  lat: number;
  lng: number;
  range: number;
  start: string;
  end: string;
}

export interface SinglePlaceRequestParams {
  start?: string;
  end?: string;
  expands?: string[];
}

export interface AxiosResponseWithDuration<T = any> extends AxiosResponse<T> {
  duration?: number;
}
