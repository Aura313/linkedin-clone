// // types/user.ts

// import { FeedPost } from "./feed";

// export interface User {
//     id: string;  // Change from number to string to match the response
//     name: string;
//     email: string;
//     profilePicUrl?: string;
//     bio: string;
//     profileId?: string;  // Add this to match the response
//     profile: ProfileType;
// }


// export interface UserProfileData extends User {
//     currentJob?: string;
//     previousJobs?: string[];
//     education?: string[];
//     skills?: string[];
//     posts: FeedPost[];
// }


// export interface ProfileType {
//     id: string;
//     name?: string;
//     bio?: string;
//     currentJob?: string;
//     previousJobs: string[];
//     education: string[];
//     skills: string[];
//     profilePicUrl?: string;
//     userId: string;
// }

// types/user.ts

import { FeedPost } from "./feed";

export interface User {
    id: string;
    email: string;
    name: string;
    profileId?: string; 
    profile?: UserProfileData; // Reference to UserProfileData for nested profile data.
}

export interface UserProfileData {
    id: string; // Profile ID
    name: string;
    userId: string;
    bio?: string;
    currentJob?: string;
    previousJobs: string[];
    education: string[];
    skills: string[];
    profilePicUrl?: string;
    posts: FeedPost[]; // If you want the posts to be associated with the profile.
    // ... any other fields that should be part of the user's profile.
}
