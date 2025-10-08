export const fetchUser = async () => {
 try {
    const response = await fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const data = await response.json();
    return data.msg;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err; // important to throw so SWR or callers know an error occurred
  }
};




export const fetchProjects = async () => {
 try {
    const res = await fetch("/api/projects", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
