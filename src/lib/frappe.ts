const FRAPPE_URL = import.meta.env.VITE_FRAPPE_URL || "";

interface FrappeResponse<T> {
  message: T;
  exc?: string;
  exc_type?: string;
}

interface FrappeUser {
  name: string;
  email: string;
  role: string;
  enabled: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mapFrappeUser = (frappeUser: FrappeUser): User => ({
  id: frappeUser.name, // In Frappe, name is the unique identifier
  name: frappeUser.name,
  email: frappeUser.email,
  role: frappeUser.role,
  status: frappeUser.enabled ? "Active" : "Inactive",
});

export const frappeApi = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(
        `${FRAPPE_URL}/api/method/frappe.desk.search.search_link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctype: "User",
            txt: "",
            page_length: 20,
          }),
          credentials: "include",
        },
      );

      const data: FrappeResponse<FrappeUser[]> = await response.json();
      if (data.exc) throw new Error(data.exc);

      return data.message.map(mapFrappeUser);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async createUser(userData: Omit<User, "id">): Promise<User> {
    try {
      const response = await fetch(
        `${FRAPPE_URL}/api/method/frappe.core.doctype.user.user.create_user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            full_name: userData.name,
            roles: [{ role: userData.role }],
            enabled: userData.status === "Active" ? 1 : 0,
          }),
          credentials: "include",
        },
      );

      const data: FrappeResponse<FrappeUser> = await response.json();
      if (data.exc) throw new Error(data.exc);

      return mapFrappeUser(data.message);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(
        `${FRAPPE_URL}/api/resource/User/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            full_name: userData.name,
            roles: userData.role ? [{ role: userData.role }] : undefined,
            enabled: userData.status === "Active" ? 1 : 0,
          }),
          credentials: "include",
        },
      );

      const data: FrappeResponse<FrappeUser> = await response.json();
      if (data.exc) throw new Error(data.exc);

      return mapFrappeUser(data.message);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(
        `${FRAPPE_URL}/api/resource/User/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data: FrappeResponse<null> = await response.json();
      if (data.exc) throw new Error(data.exc);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
