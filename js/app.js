import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://vrchosjnwejtmcfbemah.supabase.co";
const SUPABASE_KEY = "sb_publishable_WYOfsmVap3aYv9HrN-_Tgg_r5YX6NNH";
const TABLE_NAME = "short_links";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.querySelector("#shorten-form");
const originalInput = document.querySelector("#original-url");
const slugInput = document.querySelector("#custom-slug");
const statusEl = document.querySelector("#status");
const resultEl = document.querySelector("#result");
const shortUrlEl = document.querySelector("#short-url");
const longUrlEl = document.querySelector("#long-url");
const copyButton = document.querySelector("#copy-button");
const historyEl = document.querySelector("#history");

const SESSION_HISTORY = [];

const setStatus = (message, type = "") => {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
};

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const generateSlug = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
};

const buildShortUrl = (slug) => {
  const url = new URL(window.location.href);
  url.searchParams.set("s", slug);
  return url.toString();
};

const renderHistory = () => {
  historyEl.innerHTML = "";
  if (SESSION_HISTORY.length === 0) {
    historyEl.innerHTML = "<li>ยังไม่มีลิงค์ที่สร้างไว้ในเซสชันนี้</li>";
    return;
  }

  SESSION_HISTORY.forEach((item) => {
    const li = document.createElement("li");
    const shortLink = document.createElement("a");
    shortLink.href = item.short;
    shortLink.target = "_blank";
    shortLink.rel = "noopener";
    shortLink.textContent = item.short;

    const longLink = document.createElement("a");
    longLink.href = item.long;
    longLink.target = "_blank";
    longLink.rel = "noopener";
    longLink.textContent = item.long;

    li.append(shortLink, longLink);
    historyEl.appendChild(li);
  });
};

const showResult = (shortUrl, longUrl) => {
  shortUrlEl.textContent = shortUrl;
  shortUrlEl.href = shortUrl;
  longUrlEl.textContent = longUrl;
  longUrlEl.href = longUrl;
  resultEl.hidden = false;

  SESSION_HISTORY.unshift({ short: shortUrl, long: longUrl });
  SESSION_HISTORY.splice(5);
  renderHistory();
};

const insertLink = async ({ slug, originalUrl }) => {
  return supabase
    .from(TABLE_NAME)
    .insert({ slug, original_url: originalUrl })
    .select("slug")
    .single();
};

const findLink = async (slug) => {
  return supabase
    .from(TABLE_NAME)
    .select("original_url")
    .eq("slug", slug)
    .maybeSingle();
};

const handleRedirect = async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("s");
  if (!slug) {
    return;
  }

  setStatus("กำลังค้นหาลิงค์...", "");
  const { data, error } = await findLink(slug);

  if (error || !data?.original_url) {
    setStatus("ไม่พบลิงค์นี้ กรุณาตรวจสอบอีกครั้ง", "error");
    return;
  }

  setStatus("กำลังพาไปยังเว็บไซต์ต้นฉบับ...", "success");
  window.location.href = data.original_url;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");
  resultEl.hidden = true;

  const originalUrl = originalInput.value.trim();
  if (!isValidHttpUrl(originalUrl)) {
    setStatus("กรุณากรอก URL ที่ถูกต้อง (http/https)", "error");
    return;
  }

  let slug = slugInput.value.trim();
  if (slug && !/^[a-zA-Z0-9-_]{3,32}$/.test(slug)) {
    setStatus("คำย่อไม่ถูกต้อง กรุณาใช้ a-z, 0-9, - หรือ _ เท่านั้น", "error");
    return;
  }

  setStatus("กำลังสร้างลิงค์...", "");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const candidateSlug = slug || generateSlug();
    const { data, error } = await insertLink({
      slug: candidateSlug,
      originalUrl,
    });

    if (!error && data?.slug) {
      const shortUrl = buildShortUrl(candidateSlug);
      setStatus("สร้างลิงค์สำเร็จ", "success");
      showResult(shortUrl, originalUrl);
      form.reset();
      return;
    }

    if (slug) {
      setStatus("คำย่อนี้ถูกใช้งานแล้ว กรุณาเลือกใหม่", "error");
      return;
    }
  }

  setStatus("ไม่สามารถสร้างลิงค์ได้ กรุณาลองใหม่อีกครั้ง", "error");
});

copyButton.addEventListener("click", async () => {
  const value = shortUrlEl.textContent;
  if (!value || value === "-") {
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    setStatus("คัดลอกลิงค์แล้ว", "success");
  } catch {
    setStatus("ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตนเอง", "error");
  }
});

renderHistory();
handleRedirect();
