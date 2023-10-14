import { v4 as uuidv4 } from "uuid";

/**
 * Create a file name for Image
 * @param userUID uid of a signed in user
 * @param fileName name of the file found in the File object
 * @returns file name
 */
export default function makeFileNameForUpload(
  userUID: string,
  fileName: string
): string {
  return `${userUID}-<>-${uuidv4()}-<>-${fileName}`;
}
