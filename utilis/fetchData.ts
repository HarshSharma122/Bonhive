export const fetchUser = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errMsg = `Failed to fetch user: ${response.status}`;
      throw new Error(errMsg); // ✅ Throw error for SWR to catch
    }

    const data = await response.json();
    return data.msg;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err; // important to throw so SWR or callers know an error occurred
  }
};

export const fetchProjects = async (url: string) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.status}`);
    }

    const project = await res.json();
    return project.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error; // throw again for SWR or hooks to catch
  }
};
