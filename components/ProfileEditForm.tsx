import React, { useState, useEffect } from 'react';
import { User, UserProfileData } from '../types/user'; // Import the UserProfileData type

interface ProfileEditProps {
  userData: User;
  onSave: (updatedData: User) => void;
}

const ProfileEditForm: React.FC<ProfileEditProps> = React.memo(
  ({ userData, onSave }) => {
    const [formData, setFormData] = useState<User>(userData || null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [s3Data, setS3Data] = useState<any | null>(null);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;

      if (name.startsWith('profile.')) {
        const profileProperty = name.split('.')[1]; // get the property name after 'profile.'
        setFormData((prev) => ({
          ...prev,
          profile: {
            ...(prev.profile as UserProfileData), // Explicitly typecast to UserProfileData
            [profileProperty]: value || '',
          },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    };

    type ArrayFields = 'previousJobs' | 'education' | 'skills';

    const handleArrayChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
      field: ArrayFields
    ) => {
      setFormData((prev) => {
        // Create a copy of the existing profile or an empty object if it doesn't exist
        const profileCopy = prev.profile
          ? { ...prev.profile }
          : ({} as UserProfileData);

        const newArray = [...(profileCopy[field] || [])];
        newArray[index] = e.target.value;
        profileCopy[field] = newArray;

        return { ...prev, profile: profileCopy };
      });
    };

    const addArrayField = (field: ArrayFields) => {
      setFormData((prev) => {
        const profileCopy = prev.profile
          ? { ...prev.profile }
          : ({} as UserProfileData);

        const currentArray = profileCopy[field] || [];
        const newArray = [...currentArray, ''];
        profileCopy[field] = newArray;

        return { ...prev, profile: profileCopy };
      });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);

        const fileName = e.target.files[0].name;

        // Fetch the presigned URL from your API
        const response = await fetch(`/api/upload-image?file=${fileName}`);
        const data = await response.json();

        setS3Data(data);
      }
    };
    const uploadToS3 = async () => {
      if (selectedFile && s3Data) {
        const formData = new FormData();

        Object.keys(s3Data.fields).forEach((key) => {
          formData.append(key, s3Data.fields[key]);
        });

        formData.append('file', selectedFile);

        const uploadResult = await fetch(s3Data.url, {
          method: 'POST',
          body: formData,
        });

        if (uploadResult.ok) {
          // Construct the URL of the uploaded image in S3
          const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_APP_AWS_REGION}.amazonaws.com/${s3Data.fields.key}`;
          console.log(imageUrl, 'imageUrlimageUrl');
          return imageUrl;
        } else {
          console.error('Error uploading to S3:', uploadResult.statusText);
          return null;
        }
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const imageUrl = await uploadToS3();
      console.log(imageUrl, 'handleSubmitlimageUrl');

      // Create a copy of the current formData
      const updatedFormData: User = { ...formData };

      if (imageUrl) {
        // Check if the profile exists on formData, if not create an empty object
        if (!updatedFormData.profile) {
          updatedFormData.profile = {} as UserProfileData;
        }
        // Set the imageUrl on the profile object
        updatedFormData.profile.profilePicUrl = imageUrl;
      }

      // Use the updated copy of formData to call onSave
      onSave(updatedFormData);
    };

    const addSkill = () => addArrayField('skills');

    const removeSkill = (indexToRemove: number) => {
      console.log('Requested to remove skill at index:', indexToRemove);

      setFormData((prev) => {
        // Ensure there's a profile or create an empty one
        const profileCopy = prev.profile
          ? { ...prev.profile }
          : ({} as UserProfileData);

        const currentSkills = profileCopy.skills || [];
        const newSkills = currentSkills.filter(
          (_, index) => index !== indexToRemove
        );

        console.log('Previous skills:', currentSkills);
        console.log('Skills after removal:', newSkills);

        profileCopy.skills = newSkills;

        return {
          ...prev,
          profile: profileCopy,
        };
      });
    };

    useEffect(() => {
      console.log('Updated formData:', formData);
    }, [formData]);

    return (
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-md space-y-6'
      >

        
        <div className='space-y-4'>
          <label className='block text-gray-700 font-medium mb-2' htmlFor='profile.bio'>
            Bio
          </label>

          <textarea
            name='profile.bio'
            rows={2}
            value={formData.profile?.bio}
            onChange={handleInputChange}
            className='resize-none w-full text-gray-700 p-2 border rounded '
          />
          {/* <textarea
            name='bio'
            rows={3}
            value={formData.profile?.bio || ''}
            onChange={(e) => handleInputChange(e)}
            className='resize-none w-full p-2 border rounded focus:outline-none focus:border-blue-500'
          /> */}
        </div>

        <div className='space-y-4'>
          <label className='block text-gray-700 font-medium mb-2' htmlFor='profile.currentJob'>
            Current Job
          </label>

          <textarea
            name='profile.currentJob'
            rows={2}
            value={formData.profile?.currentJob}
            onChange={handleInputChange}
            className='resize-none w-full text-gray-700 p-2 border rounded '
          />
          {/* <textarea
            name='bio'
            rows={3}
            value={formData.profile?.bio || ''}
            onChange={(e) => handleInputChange(e)}
            className='resize-none w-full p-2 border rounded focus:outline-none focus:border-blue-500'
          /> */}
        </div>
        <div className='space-y-4'>
          <label
            className='block text-gray-700 font-medium mb-2'
            htmlFor='profilePic'
          >
            Profile Picture
          </label>
          <input
            type='file'
            id='profilePic'
            name='profilePic'
            accept='image/*'
            onChange={handleFileChange}
            className='w-full p-3 border rounded focus:outline-none focus:border-blue-500 transition duration-200'
          />
          {selectedFile && (
            <div className='mt-4'>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt='Selected profile'
                className='h-32 w-32 object-cover rounded'
              />
            </div>
          )}

          {formData.profile?.profilePicUrl && !selectedFile && (
            <div className='mt-4 justify-center'>
              <img
                src={formData.profile?.profilePicUrl}
                alt='Current profile'
                className='h-32  w-32 object-cover rounded'
              />
              <br />
              <span>
                <strong>File:</strong> {formData.profile?.profilePicUrl}{' '}
              </span>
            </div>
          )}
        </div>
        <div className='space-y-4'>
          <label className='block text-gray-700 font-medium mb-2'>Skills</label>
          {formData.profile?.skills &&
            formData.profile.skills.map((skill, index) => (
              <div key={index} className='flex items-center mb-2'>
                <input
                  type='text'
                  name={`skill-${index}`}
                  value={skill}
                  onChange={(e) => handleArrayChange(e, index, 'skills')}
                  className='w-full p-3 border rounded focus:outline-none focus:border-blue-500 transition duration-200'
                />
                <button
                  type='button'
                  onClick={() => removeSkill(index)}
                  className='ml-2 text-sm bg-white border-gray-200 hover:bg-gray-200 text-slate py-2 px-4 rounded focus:outline-none transition duration-200'
                >
                  X
                </button>
              </div>
            ))}
          <button
            type='button'
            onClick={addSkill}
            className='text-sm border border-cyan-900 hover:bg-cyan-800 hover:text-white py-2 px-4 rounded-full focus:outline-none transition duration-200'
          >
            + Add Skill
          </button>
        </div>

        {/* ... Repeat for other fields ... */}

        <div className='mt-8  flex justify-items-center items-center justify-center'>
          <button
            type='submit'
            className='bg-cyan-900 text-center hover:bg-cyan-800  w-1/2 text-white px-6 py-2 rounded-full focus:outline-none transition duration-200'
          >
            Save Changes
          </button>
        </div>
      </form>
    );
  }
);

export default ProfileEditForm;
