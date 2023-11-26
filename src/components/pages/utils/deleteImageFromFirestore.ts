import { deleteObject, getStorage, ref } from "firebase/storage";
import { Image } from "../../../types/index";

// Delete the file
export default async function deleteImageFromFirestore(
  image: Image,
  listingId: string
) {
  const storage = getStorage();
  const imageRef = ref(storage, `images/${listingId}/` + image.name);

  await deleteObject(imageRef)
    .then(() => {
      // File deleted successfully
    })
    .catch(async (error) => {
      console.error(error);
      console.error("Could not delete image. Attempting to delete again.");
      // Try again with the old path
      const imageRef = ref(storage, `images/` + image.name);

      return await deleteObject(imageRef)
        .then(() => console.log("Successfully deleted image from old path."))
        .catch((error) => {
          console.error(error);
          console.error("Could not delete image. Attempted both paths.");
        });
    });
}
