export async function renderNews() {
  const main = document.getElementById("main");
  main.innerHTML = `

    <div id="newsSection">
      <p style="margin-top:15px; color:white; font-size: 2rem; border-bottom: 1px solid #fff; padding-bottom: 12px; padding-left: 5px;">📰 Latest Crypto News</p>

      <div id="newsContainer"  style="display:grid; gap:1rem;"></div>
    </div>
  `;

  const container = document.getElementById("newsContainer");
  try {
    
    //  API_KEY from newsdata.io
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=pub_f8acb4d3281f4bcb9fe3bd2816f7a5ba&q=cryptocurrency&language=en`
    );

    const data = await res.json();
    console.log(data);
    if (!data.results || data.results.length === 0) {
      container.innerHTML = `<p style="color:#aaa;">No crypto news found right now.</p>`;
      return;
    }

    data.results.slice(0,10).forEach(news => {
      const card = document.createElement("div");
      card.classList.add("news-card");
      card.style = `
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding: 15px;
        transition: 0.3s;
        cursor: pointer;
        display: flex;
        gap: 15px;
      `;

      card.innerHTML = `
        <img src="${news.image_url || 'https://via.placeholder.com/100'}"
             width="100" height="80" style="border-radius:4px;">
        <div>
          <p style="color:#00ff88;">${news.title}</p>
          <p style="color:#aaa; font-size:0.9rem;">${news.source_id} • ${new Date(news.pubDate).toLocaleDateString()}</p>
        </div>
      `;
      card.addEventListener("click", () => window.open(news.link, "_blank"));
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    container.innerHTML = `<p style="color:red;">⚠️ Failed to load news.</p>`;
  }
}
