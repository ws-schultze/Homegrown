import { deleteObject, getStorage, ref } from "firebase/storage";
import { Image } from "../../../types/index";

// Delete the file
export default async function deleteImageFromFirestore(image: Image) {
  const storage = getStorage();
  const imageRef = ref(storage, "images/" + image.name);

  await deleteObject(imageRef)
    .then(() => {
      // File deleted successfully
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      throw new Error(error);
    });
}
