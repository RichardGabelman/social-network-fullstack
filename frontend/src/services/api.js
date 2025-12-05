const API_BASE = import.meta.env.VITE_API_URL;

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_BASE}${url}`, config);

  if (response.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
    throw new Error("Authentication expired. Please log in again.");
  }

  // 204 No Content
  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("API Error Response:", error);
    console.error('API Error Response:', JSON.stringify(error, null, 2));
    throw new Error(error.error || `HTTP error! status:${response.status}`);
  }

  return response.json();
};

export const authService = {
  loginWithGithub: () => {
    window.location.href = `${API_BASE}/auth/github`;
  },

  handleCallback: (token) => {
    localStorage.setItem("authToken", token);
  },

  getToken: () => {
    return localStorage.getItem("authToken");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  logout: () => {
    localStorage.removeItem("authToken");
  },
};

export const userService = {
  getAllUsers: async () => {
    return fetchWithAuth("/users");
  },
};

export const profileService = {
  getCurrentProfile: async () => {
    return fetchWithAuth("/profile/me");
  },

  updateProfile: async (data) => {
    return fetchWithAuth("/profile/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  getProfileByUsername: async (username) => {
    return fetchWithAuth(`/profile/${username}`);
  },

  getFollowers: async (username) => {
    return fetchWithAuth(`/profile/${username}/followers`);
  },

  getFollowing: async (username) => {
    return fetchWithAuth(`profile/${username}/following`);
  },
};

export const postService = {
  createPost: async (content, replyToId = null) => {
    const body = { content };

    if (replyToId) {
      body.replyToId = replyToId;
    }

    return fetchWithAuth("/posts", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  getFeed: async () => {
    return fetchWithAuth("/posts");
  },

  getExplorePosts: async () => {
    return fetchWithAuth("/posts/explore");
  },

  getPost: async (postId) => {
    return fetchWithAuth(`/posts/${postId}`);
  },

  getUserPosts: async (userId) => {
    return fetchWithAuth(`/posts/user/${userId}`);
  },

  deletePost: async (postId) => {
    return fetchWithAuth(`/posts/${postId}`, {
      method: "DELETE",
    });
  },

  likePost: async (postId) => {
    return fetchWithAuth(`/posts/${postId}/like`, {
      method: "POST",
    });
  },

  unlikePost: async (postId) => {
    return fetchWithAuth(`/posts/${postId}/like`, {
      method: "DELETE",
    });
  },
};

export const followerService = {
  followUser: async (userId) => {
    return fetchWithAuth(`/follows/${userId}`, {
      method: "POST",
    });
  },

  unfollowerUser: async (userId) => {
    return fetchWithAuth(`/follows/${userId}`, {
      method: "DELETE",
    });
  },
};
