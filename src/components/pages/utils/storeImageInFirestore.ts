import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import makeFileNameForUpload from "./makeFileNameForUpload";
import { Image } from "../../../types/index";

interface Props {
  file: File;
  userUID: string;
  listingId: string;
}

/**
 * Store an image in firestore
 * @param file File
 * @returns Image {fileName: string, url: string}
 */
export default async function storeImageInFirestore({
  file,
  userUID,
  listingId,
}: Props): Promise<Image> {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const fileName = makeFileNameForUpload(userUID, file.name);
    const storageRef = ref(storage, `images/${listingId}/` + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    if (!userUID) {
      throw new Error("Bad userRef.uid");
    } else if (!file.name) {
      throw new Error("Bad file.name");
    } else if (!fileName) {
      throw new Error("Bad fileName.");
    } else if (!storageRef) {
      throw new Error("Bad storageRef.");
    } else if (!uploadTask) {
      throw new Error("Bad uploadTask.");
    }

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve({ name: fileName, url: downloadURL });
        });
      }
    );
  });
}
