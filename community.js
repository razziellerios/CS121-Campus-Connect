const API = "/posts";
let currentUser = null;

async function checkUser() {
    const res = await fetch("/api/user");
    if (res.ok) {
        currentUser = await res.json();
        if (currentUser && currentUser.role === "admin") {
            const createSection = document.getElementById("createPostSection");
            if (createSection) createSection.style.display = "none";
        }
    }
}

async function loadPosts() {
    const searchTitle = document.getElementById("searchTitle") ? document.getElementById("searchTitle").value : "";
    const filterCategory = document.getElementById("filterCategory") ? document.getElementById("filterCategory").value : "";
    
    let queryParams = new URLSearchParams();
    if (searchTitle) queryParams.append("title", searchTitle);
    if (filterCategory) queryParams.append("category", filterCategory);

    let url = API;
    if (queryParams.toString()) {
        url += "?" + queryParams.toString();
    }

    const res = await fetch(url);
    const data = await res.json();

    const list = document.getElementById("postList");
    list.innerHTML = "";

    data.forEach(post => {
        const li = document.createElement("li");
        li.innerText = post.title + " (" + post.category + ")";

        const btn = document.createElement("button");
        btn.innerText = "Delete";
        btn.onclick = () => deletePost(post._id);

        li.appendChild(btn);
        list.appendChild(li);
    });
}

async function addPost() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category })
    });

    loadPosts();
}

async function deletePost(id) {
    await fetch(API + "/" + id, {
        method: "DELETE"
    });

    loadPosts();
}

checkUser().then(loadPosts);