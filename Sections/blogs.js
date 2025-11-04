export async function renderBlogs() {
     const main = document.getElementById("main");
     main.innerHTML = `
         <section id="blogSection" style="padding:10px;">
            <p style="margin-bottom:15px; font-size: 2rem; color: white">Crypto Blog & Insights</p>
            <div id="blogContainer" style="display:grid; gap:1.5rem;"></div>
        </section>

    `   
    
    const container = document.getElementById("blogContainer");

    try {

        const res = await fetch(`https://newsdata.io/api/1/news?apikey=pub_f8acb4d3281f4bcb9fe3bd2816f7a5ba&q=cryptocurrency+analysis&language=en`);

        const data = await res.json();

        if(!data.results || data.results.length === 0) {
            container.innerHTML = `<p style="color:#aaa;">No crypto blog posts found right now.</p>`;
            return;
        }

        data.results.forEach(blog =>{
            const card = document.createElement("div");
            card.classList.add("blog-card");
            card.style = `
            max-width: 350px;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 10px;
            transition: 0.3s;
            cursor: pointer;

            `;
        card.innerHTML = `

            <img src="${blog.image_url || 'https://via.placeholder.com/100'}"
             style="width:100%; height: 250px; border-radius:8px; margin-bottom:10px;">
            <h3 style="color:#00ff88;">${blog.title}</h3>
            <p style="color:#aaa;">${blog.description?.slice(0, 200) || "No summary available..."}...</p>
        
        `

        card.addEventListener("click", () => window.open(blog.link, "_blank"));
        container.appendChild(card);

        })
        
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        container.innerHTML = `<p style="color:red;">⚠️ Failed to load blog posts.</p>`;
        
    }

}