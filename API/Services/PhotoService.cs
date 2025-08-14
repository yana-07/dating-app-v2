using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services;

public class PhotoService(Cloudinary cloudinary) : IPhotoService
{
    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deletionParams = new DeletionParams(publicId);

        return await cloudinary.DestroyAsync(deletionParams);
    }

    public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length > 0)
        {
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation()
                    .Height(500).Width(500)
                    .Crop("fill").Gravity("face"),
                Folder = "dating-app"
            };

            uploadResult = await cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }
}
