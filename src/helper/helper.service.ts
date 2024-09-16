/* eslint-disable @typescript-eslint/no-unused-vars */
// Parameter type annotation
import { Injectable } from '@nestjs/common';
import { PrismaClientValidationError } from "@prisma/client/runtime/library"

@Injectable()
export class HelperService {
  /**
   *check if a string is null or empty
   * @param text - The string to be tested.
   */
  isStringEmptyOrNull(text: string): boolean {
    return text === null || text === undefined || text.trim().length === 0;
  }

  /**
   *convert the date string to the date object
   * @param dateString - Format YYYY-MM-DD.
   * @returns A date object.
   */
  convertDateString(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    } else {
      throw new Error('Date Format is not correct, Use yyyy-mm-dd format');
    }
  }

  /**
   * add days, hours, minutes, seconds to the date
   * @param date - The date to be modified, derived from the @param convertDateString function.
   * @param days - The number of days to be added to the date.
   * @param hours - The number of hours to be added to the date.
   * @param minutes - The number of minutes to be added to the date.
   * @param seconds - The number of seconds to be added to the date.
   * @returns A new date with the added days, hours, minutes, and seconds.
   */
  addDate(
    date: Date,
    days = 0,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
  ): Date {
    const newDate: Date = new Date(date.getTime());
    newDate.setDate(date.getDate() + days);
    newDate.setHours(date.getHours() + hours);
    newDate.setMinutes(date.getMinutes() + minutes);
    newDate.setSeconds(date.getSeconds() + seconds);
    return newDate;
  }

  //generate random n digits
  /**
   * Generate a random number with n digits.
   * @param n - The number of digits to be generated.
   * @returns A random number with n digits.
   * @throws An error if n is less than 1.
   */
  generateRandomNDigits(n: number): number {
    if (n < 1) throw new Error('n should be greater than 0');
    const lowerLimit: number = Math.pow(10, n - 1);
    const upperLimit: number = Math.pow(10, n) - 1;
    const randomNumber = Math.floor(
      Math.random() * (upperLimit - lowerLimit + 1) + lowerLimit,
    );
    return randomNumber;
  }

 // get user-friendly validation error message from Prisma error
 getValidationErrorMessage(exception: PrismaClientValidationError): string {
  const regex =
    /Argument `(\w+)`: Invalid value provided\. Expected (\w+), provided (\w+)\./;
  const match = exception.message.match(regex);

  if (match) {
    const [_, field, type, typeProvided] = match;
    return `The value for ${field} must be of type ${type}, but a value of type ${typeProvided} was provided.`;
  }

  return 'Validation error occurred. Please check the input values.';
}

  /**
   * Generate a random string with a specified length.
   * @param length - The length of the string to be generated.
   * @returns A random string with the specified length.
   */

  generateString(length: number): string {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    let otp = '';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      otp += characters[index];
    }

    return otp;
  }

  /**
   * Generate a random OTP with a specified length.
   * @param length - The length of the OTP to be generated.
   * @returns A random OTP with the specified length.
   */
  generateOTP(length: number): string {
    const characters = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      otp += characters[index];
    }

    return otp;
  }

  convertStringToObject(
    text: string,
    separator: string,
    subSeparator: string,
  ): any {
    const items = text && text?.split(separator);
    const result = items && items.reduce((acc, item) => {
      const keyValuePair = item?.split(subSeparator);
      acc[keyValuePair[0].trim()] = keyValuePair[1];
      return acc;
    }, {});
    return result;
  }

  exclude(user, ...keys) {
    for (const key of keys) {
      delete user[key]
    }
    return user
  }

  /**
   * Paginate a list of items
   * @param total - The total number of items.
   * @param page - The current page number.
   * @param limit - The number of items per page.
   * @param hasMore - Shows if there is more data in the table to be fetched
   * @returns Pagination details.
   */
  paginate(totalItems: number, page: number = 1, limit: number = 10): any {
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page > totalPages ? totalPages : page;

    return {
      totalItems,
      page: currentPage,
      limit,
      hasMore: totalPages >= currentPage,
    };
  }
}
