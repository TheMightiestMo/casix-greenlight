import qs from 'qs';
import type {
  AxiosResponseWithDuration,
  FetchResponse,
  Place,
  PointOfInterest,
  PoiRequestParams,
  SinglePlaceRequestParams,
} from '@/types/pointOfInterest';
import apiClient from './api.ts';

class PointOfInterestService {
  public async fetchPois(
    params: PoiRequestParams & { expands?: string[] },
  ): Promise<FetchResponse> {
    try {
      const response: AxiosResponseWithDuration<PointOfInterest[]> = await apiClient.get(
        '/pointsofinterest',
        {
          params: {
            bookeeFilterId: 'default',
            lat: params.lat,
            lng: params.lng,
            range: params.range,
            start: params.start,
            end: params.end,
            sort: 'distance',
            expand: params.expands ?? [],
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: 'repeat', encode: false }),
        },
      );

      const { data, duration = 0 } = response;
      console.log('Komplette Axios-Antwort:', response);
      return { data, duration };
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
      throw error;
    }
  }

  public async fetchPlaceById(
    placeId: string,
    params?: SinglePlaceRequestParams,
  ): Promise<{ data: Place; duration: number }> {
    try {
      const singleParams = {
        start: params?.start,
        end: params?.end,
        expand: params?.expands ?? [],
      };

      const response: AxiosResponseWithDuration<Place> = await apiClient.get(
        `/places/${placeId}`,
        {
          params: singleParams,
          paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat', encode: false }),
        },
      );
      console.log('Komplette Axios-Antwort:', response);

      return {
        data: response.data,
        duration: response.duration || 0,
      };
    } catch (error) {
      console.error(`Fehler beim Abrufen der Place mit ID ${placeId}:`, error);
      throw error;
    }
  }
}

export const poiService = new PointOfInterestService();
