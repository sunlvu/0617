console.log("list.js called.")

document.addEventListener("DOMContentLoaded", async () => {
    const ul = document.getElementById("list");
    const res = await fetch("/imagelist");
    const files = await res.json();

    for (const file of files) {
        console.log(file);
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = file;
        li.appendChild(img);
        ul.appendChild(li);
    } 
})