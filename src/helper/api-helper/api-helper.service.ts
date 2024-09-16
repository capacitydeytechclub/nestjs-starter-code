import { Injectable } from '@nestjs/common';
import { HelperService } from 'src/helper/helper.service';
import { Request } from 'express';
// import { ResponseHelperService } from 'src/helper/response-helper.service';
// import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class ApiHelperService {
  constructor(
    private helperService: HelperService,
    // private singleResponseHelper: ResponseHelperService<ResponseModel<data>>,
  ) {}
  /**
   * Fetch the IP address of the user.
   * @returns The IP address of the user.
   * @throws An error if the IP address cannot be fetched.
   *
   */

  // async getIpAddress(): Promise<string | null> {
  //   try {
  //     const response = await fetch('https://api.ipify.org?format=json');
  //     const data = await response.json();
  //     return data.ip;
  //   } catch (error) {
  //     throw new Error('Error fetching IP address');
  //   }
  // }

  /**
   * Fetch the location of the user using the IP address.
   * @param ip - The IP address of the user.
   * @returns The location of the user.
   * @throws An error if the location cannot be fetched.
   */
  async getUserLocation(ip: Promise<string | null>): Promise<string | null> {
    try {
      const response = await fetch(
        `https://ip-geolocation-seven.vercel.app/api/location/${ip}`,
      );
      const data = await response.json();
      return data.country;
    } catch (error) {
      throw new Error('Error fetching location');
    }
  }

  async getAddress(request: Request) {
    try {
      let ip =
        request.headers['x-forwarded-for'] || request.connection.remoteAddress;
      ip = ip.toString().replace('::ffff:', '');
      const response = await fetch(
        `https://ip-geolocation-seven.vercel.app/api/location/${ip}`,
      );
      const data = await response.json();
      return data.country;
    } catch (error) {
      throw error;
    }
  }
}