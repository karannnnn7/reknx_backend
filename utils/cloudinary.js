import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
import { extractPublicId } from 'cloudinary-build-url';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
})


const uploadOnCloudinary = async (localFilePath, folder = "") => {
    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

const deleteOnCloudinary = async (imageURL) => {
    try {
        if (!imageURL) {
           throw new Error("Image URL is required for deletion");
        }
        const publicId = extractPublicId(imageURL);
        const resourceType = imageURL.includes("/video/")
            ? "video"
            : "image";
        
        const response = await cloudinary.uploader.destroy(publicId ,{
            resource_type: resourceType
        });
        if(response.result != 'ok'){
            throw new Error("failed to delete image");
        }

        // file has been deleted
        return 1;

    } catch (error) {
        throw new Error("failed to delete catch block");
    }
}



const replaceOnCloudinary = async (localFilePath, oldFileUrl, folder = "") => {

    if (!(localFilePath && oldFileUrl)) {
      throw new Error("Both old and new files are required");
    }
    const newFile = await uploadOnCloudinary(localFilePath, folder);
    if (!newFile?.url) { 
       throw new Error("failed to upload new");
    };

     await deleteOnCloudinary(oldFileUrl);
    
    return newFile;
};

export {uploadOnCloudinary  ,replaceOnCloudinary ,deleteOnCloudinary}