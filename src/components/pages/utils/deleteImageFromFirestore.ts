import { deleteObject, getStorage, ref } from "firebase/storage";
import { TypeImage } from "../../..";

// Delete the file
export default async function deleteImageFromFirestore(image: TypeImage) {
  const storage = getStorage();
  const imageRef = ref(storage, "images/" + image.name);

  await deleteObject(imageRef)
    .then(() => {
      // File deleted successfully
      console.log(image.name, "deleted successfully");
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      throw new Error(error);
    });
}
