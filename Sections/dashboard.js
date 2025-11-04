export async function fetchCryptodata() {
  const main = document.getElementById("main");
  const loader = document.getElementById("loader");

  // Step 1: Create the dashboard layout dynamically
  main.innerHTML = `
            <div class="controls">
                <p>Crypto Market updates</p>
                <div class="search-container">
            <input
            type="text"lijs
            id="searchCoin"
            placeholder="Search for a coin..."
            />
              <button id="loadMoreBtn">Refresh
                <span class="material-symbols-outlined" id="autorenew">
                  autorenew
                </span>
              </button>
</div>

        </div>

        <div class="toast" id="toast">
          <p>Loaded more coins!</p>
        </div>
    <div class="table-container">
    <table class="crypto-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>Change (24h)</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody id="crypto-data"></tbody>
    </table>

    </div>

    <div id="coinModal" class="modal">
      <div class="modal-content">
        <span id="closeModal">&times;</span>
        <div id="modalBody"></div>
      </div>
    </div>
  `;

  // Step 2: Define elements *after* they exist in DOM
  const tableBody = document.getElementById("crypto-data");
  const searchInput = document.getElementById("searchCoin");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const modal = document.getElementById("coinModal");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");

  let allCoins = [];
  let visibleCount = 15;

  // Step 3: Fetch data
  try {

    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"
    );

    allCoins = await res.json();
    console.log(allCoins);
    renderTable(allCoins.slice(0, visibleCount));

    // 🔍 Add search
    searchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();
      const filtered = allCoins.filter((coin) =>
        coin.name.toLowerCase().includes(value)
      );
      renderTable(filtered.slice(0, visibleCount));
    });

    // ➕ Load more
    loadMoreBtn.addEventListener("click", () => {
      const autorenew = document.getElementById("autorenew");
      autorenew.style.animation = "none";
      setTimeout(() => {
        autorenew.style.animation = "spin 0.5s linear";
      });

      const toast = document.getElementById("toast");
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
      }, 2000);

      visibleCount += 10;
      renderTable(allCoins.slice(0, visibleCount));
      if (visibleCount >= allCoins.length) loadMoreBtn.style.display = "none";
    });

    // ❌ Close modal
    closeModal.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

  } catch (error) {
    console.error("Error fetching crypto data:", error);
    tableBody.innerHTML = `<tr><td colspan="5" style="color:red;">⚠️ Failed to load crypto data. Try again in a few minutes.</td></tr>`;
  } finally{
    loader.style.display = "none"; // Hide loader
  }

  // Step 4: Reusable inner render and modal functions
  function renderTable(coins) {
    tableBody.innerHTML = "";
    coins.forEach((coin, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td style="display:flex; align-items:center; gap:10px; cursor:pointer;">
          <img src="${coin.image}" alt="${coin.name}" width="25" height="25">
          <span>${coin.name}</span>
          <span style="font-size:0.9rem; color:#999;">(${coin.symbol.toUpperCase()})</span>
        </td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td style="color:${coin.price_change_percentage_24h >= 0 ? 'limegreen' : 'red'};">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </td>
        <td>$${coin.market_cap.toLocaleString()}</td>
      `;
      row.addEventListener("click", () => showCoinDetails(coin));
      tableBody.appendChild(row);
    });
  }

  // Will use this later for affiliate links

  // async function showCoinDetails(coin) {
  //   try {
  //     const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`);
  //     const fullCoin = await res.json();

  //     const affiliateLink = `https://www.binance.com/en/trade/${coin.symbol.toUpperCase()}_USDT?ref=YOUR_CODE`;
  //     const coinLink = `https://www.coingecko.com/en/coins/${coin.id}`;

  //     modalBody.innerHTML = `
  //       <div style="text-align:center; display:flex; flex-direction:column; gap:20px;">
  //         <img src="${fullCoin.image.large}" alt="${coin.name}" width="60">
  //         <h2>${fullCoin.name} (${coin.symbol.toUpperCase()})</h2>
  //         <p>💲 <strong>${fullCoin.market_data.current_price.usd.toLocaleString()}</strong></p>
  //         <p>📊 Market Cap: $${fullCoin.market_data.market_cap.usd.toLocaleString()}</p>
  //         <p>📉 24h Low: $${fullCoin.market_data.low_24h.usd.toLocaleString()}</p>
  //         <p>📈 24h High: $${fullCoin.market_data.high_24h.usd.toLocaleString()}</p>
  //         <p>🪙 Supply: ${fullCoin.market_data.circulating_supply.toLocaleString()}</p>
  //         <div style="margin-top:15px; display:flex; justify-content:center; gap:1rem;">
  //           <button onclick="window.open('${affiliateLink}','_blank')" style="background:#f3ba2f;color:#000;padding:10px 15px;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Buy on Binance</button>
  //           <button onclick="window.open('${coinLink}','_blank')" style="background:transparent;color:white;border:1px solid #fff;padding:10px 15px;border-radius:6px;cursor:pointer;">More Details</button>
  //         </div>
  //       </div>
  //     `;
  //     modal.style.display = "flex";
  //   } catch (error) {
  //     console.error("Error fetching coin details:", error);
  //     modalBody.innerHTML = `<p style="color:red;">Failed to load details.</p>`;
  //     modal.style.display = "flex";
  //   }
  // }

  setInterval(async () => {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"
    );
    const updatedCoins = await res.json();
    allCoins = updatedCoins;
    renderTable(allCoins.slice(0, visibleCount));
    console.log("✅ Prices updated!");
  } catch (error) {
    console.error("Error refreshing crypto data:", error);
  }
}, 30000);
}
