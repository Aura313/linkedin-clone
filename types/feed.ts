import { User } from "./user";

// export interface UserReference {
//     id: string;
//     name: string;  // Display name of the user
//     profile: { profilePicUrl: string; } // URL to user's profile image
// }

export interface Media {
    type: 'IMAGE' | 'VIDEO'; // Add more types as needed
    url: string;
}

// export interface FeedPost {
//     id: string;
//     user: User; // Instead of just userId, we include more user info for display purposes
//     content: string;
//     reactions: Reaction[];
//     media?: Media[];  // Array of media attachments
//     postType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'ARTICLE'; // Add more types as needed
//     createdAt: Date;
//     updatedAt: Date;
//     likes: number;
//     shares: number;
//     comments: Comment[];
// }

export interface FeedPost {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    userId: string;
    user: User;
    reactions: Reaction[];
    shares: number;
    comments: Comment[];
    media: Media[];
  }

// export interface Comment {
//     id: string;
//     user: User;  // As with the post, we include user info for display
//     content: string;
//     createdAt: Date;
//     postId: string;
// }
// interface Comment {
//     id: string;
//     content: string;
//     createdAt: Date;
//     updatedAt?: Date;
//     userId: string;
//     postId: string;
//   }

export interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    userId: string;
    user: User;  // Include the User relation here
    postId: string;
    post: FeedPost
}

interface Reaction {
    id: string;
    type: ReactionType;
    createdAt: Date;
    updatedAt?: Date;
    user: User;
    userId: string;
    postId: string;
    post: FeedPost
}

enum ReactionType {
    LIKE
    // Add other reaction types as needed
}
