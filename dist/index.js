// src/index.ts
import z from "@deepseek-ai/schemastery";
import { WebError } from "@deepseek-ai/dsh-web";

// src/catalog.ts
var NS = "dsh-search-providers";
var CAPABILITIES = ["news", "papers", "code", "people", "companies", "images", "videos", "extract", "map", "x"];
var PROVIDERS = [
  { id: "keenable", label: "Keenable", env: "KEENABLE_API_KEY", keyOptional: true, capabilities: ["extract"] },
  { id: "nimble", label: "Nimble", env: "NIMBLE_API_KEY", capabilities: ["news", "papers", "code", "extract", "map"] },
  { id: "tinyfish", label: "TinyFish", env: "TINYFISH_API_KEY", capabilities: ["news", "papers", "extract"] },
  { id: "parallel", label: "Parallel", env: "PARALLEL_API_KEY", capabilities: ["extract"] },
  { id: "exa", label: "Exa", env: "EXA_API_KEY", capabilities: ["news", "papers", "people", "companies", "extract"] },
  { id: "brave", label: "Brave", env: "BRAVE_API_KEY", capabilities: ["news", "images", "videos"] },
  { id: "perplexity", label: "Perplexity", env: "PERPLEXITY_API_KEY", capabilities: ["people"] },
  { id: "fxtwitter", label: "FxTwitter", keyOptional: true, webSearch: false, capabilities: ["x"] }
];
function providerOf(id) {
  const provider = PROVIDERS.find((row) => row.id === id);
  if (!provider) throw new SearchError("invalid-request", "Unknown search provider");
  return provider;
}
var providerRoute = (id) => `${NS}-${id}`;
function capabilityOf(value) {
  const capability = CAPABILITIES.find((id) => id === value);
  if (!capability) throw new SearchError("invalid-request", "Unknown search capability");
  return capability;
}
var SearchError = class extends Error {
  code;
  status;
  constructor(code, message, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
};
function object(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new SearchError("invalid-response", "Expected an object");
  return value;
}
function validateSettings(settings) {
  for (const [id, profile] of Object.entries(settings.providers)) {
    providerOf(id);
    if (profile.enabled !== void 0 && typeof profile.enabled !== "boolean") throw new SearchError("invalid-request", "Invalid provider state");
  }
  for (const [id, profile] of Object.entries(settings.tools)) {
    const feature = capabilityOf(id), provider = providerOf(profile.provider);
    if (typeof profile.enabled !== "boolean" || !provider.capabilities.includes(feature)) throw new SearchError("invalid-request", "Unsupported capability");
  }
}

// src/http.ts
function httpUrl(value) {
  if (typeof value !== "string" || value.length > 8192) throw new SearchError("invalid-request", "Invalid URL");
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new SearchError("invalid-request", "Invalid URL");
  }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new SearchError("invalid-request", "Expected an HTTP URL without credentials");
  return url.href;
}
function publicUrl(value) {
  const parsed = new URL(httpUrl(value)), host = parsed.hostname.toLowerCase().replace(/\.$/, "");
  if (!host.includes(".") || [".local", ".localhost", ".internal", ".lan", ".home"].some((suffix) => host.endsWith(suffix)) || host === "localhost" || host.includes(":") || /^(?:0|10|127)\./.test(host) || /^169\.254\./.test(host) || /^192\.168\./.test(host) || /^172\.(?:1[6-9]|2\d|3[01])\./.test(host) || /^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(host) || /^198\.(?:18|19)\./.test(host) || /^(?:22[4-9]|23\d|24\d|25[0-5])\./.test(host)) throw new SearchError("blocked-url", "Expected a public web URL");
  return parsed.href;
}
var MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
async function jsonRequest(transport, url, init, signal) {
  const deadline = AbortSignal.timeout(45e3);
  const combined = signal ? AbortSignal.any([signal, deadline]) : deadline;
  combined.throwIfAborted();
  const response = await transport(url, { ...init, redirect: "error", signal: combined });
  if (!response.ok) {
    await response.body?.cancel();
    throw new SearchError(response.status === 429 ? "rate-limited" : response.status === 401 || response.status === 403 ? "authentication-failed" : "provider-failed", `Search API returned HTTP ${response.status}`, response.status);
  }
  if (!response.body) throw new SearchError("invalid-response", "Empty API response");
  const reader = response.body.getReader(), chunks = [];
  let length = 0;
  try {
    while (true) {
      combined.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_RESPONSE_BYTES) throw new SearchError("response-too-large", "Search API response exceeds the size limit");
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {
    });
    throw error;
  } finally {
    reader.releaseLock();
  }
  combined.throwIfAborted();
  try {
    return object(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch (error) {
    if (error instanceof SearchError) throw error;
    throw new SearchError("invalid-response", "Invalid JSON response");
  }
}
var RequestGate = class {
  active = 0;
  queue = [];
  constructor(limit = 4) {
    if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("Invalid request concurrency limit");
    this.limit = limit;
  }
  limit;
  async run(operation, signal) {
    signal?.throwIfAborted();
    if (this.active >= this.limit) await new Promise((resolve, reject) => {
      const ticket = { resolve, ...signal ? { signal } : {}, abort: () => {
        const index = this.queue.indexOf(ticket);
        if (index !== -1) this.queue.splice(index, 1);
        reject(signal?.reason);
      } };
      this.queue.push(ticket);
      signal?.addEventListener("abort", ticket.abort, { once: true });
    });
    else this.active++;
    try {
      signal?.throwIfAborted();
      return await operation();
    } finally {
      const next = this.queue.shift();
      if (next) {
        next.signal?.removeEventListener("abort", next.abort);
        next.resolve();
      } else this.active--;
    }
  }
};

// src/fxtwitter.ts
var HOSTS = /* @__PURE__ */ new Set(["x.com", "twitter.com", "mobile.twitter.com", "fxtwitter.com", "fixupx.com"]);
function xPostId(query) {
  if (!/^https?:\/\//i.test(query)) return void 0;
  const url = new URL(httpUrl(query));
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const match = /^\/(?:[a-zA-Z0-9_]{1,15}|i\/web)\/status\/(\d{1,30})(?:\/(?:photo|video)\/\d+)?\/?$/.exec(url.pathname);
  if (!HOSTS.has(host) || !match) throw new SearchError("invalid-request", "Expected an X post URL or search keywords");
  return match[1];
}
function xSources(rows, limit, hasMore = false) {
  const sources = [], seen = /* @__PURE__ */ new Set();
  let truncated = hasMore || rows.length > limit;
  for (const raw of rows) {
    const row = object(raw);
    if (row.type === "tombstone") {
      truncated = true;
      continue;
    }
    if (row.type !== "status" || typeof row.id !== "string" || !/^\d{1,30}$/.test(row.id) || typeof row.text !== "string") throw new SearchError("invalid-response", "FxTwitter returned an invalid post");
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    const author = row.author === void 0 || row.author === null ? {} : object(row.author);
    const handle = typeof author.screen_name === "string" && /^[a-zA-Z0-9_]{1,15}$/.test(author.screen_name) ? author.screen_name : void 0;
    const source = { url: `https://x.com/${handle ?? "i"}/status/${row.id}`, snippet: row.text.slice(0, 6e3) };
    truncated ||= row.text.length > 6e3;
    if (typeof author.name === "string" && author.name) source.author = author.name.slice(0, 200);
    if (handle) source.authorHandle = handle;
    if (source.author || handle) source.title = [source.author, handle ? `(@${handle})` : void 0].filter(Boolean).join(" ");
    if (typeof row.created_at === "string" && Number.isFinite(Date.parse(row.created_at))) source.publishedAt = new Date(row.created_at).toISOString();
    for (const key of ["likes", "reposts", "replies", "views"]) {
      const value = row[key];
      if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) source[key] = value;
    }
    sources.push(source);
  }
  return { sources: sources.slice(0, limit), truncated };
}

// src/adapters.ts
var SNIPPET_LIMIT = 6e3;
var TEXT_LIMIT = 1e5;
function list(value) {
  if (!Array.isArray(value)) throw new SearchError("invalid-response", "Missing API results");
  return value;
}
function text(value) {
  return typeof value === "string" ? value : void 0;
}
function excerpts(value) {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string").join("\n\n") : void 0;
}
function normalized(rows, limit, id, capability) {
  const sources = [], seen = /* @__PURE__ */ new Set();
  let truncated = rows.length > limit;
  for (const value of rows) {
    const row = object(value);
    let url;
    try {
      url = httpUrl(row.url);
    } catch {
      truncated = true;
      continue;
    }
    if (seen.has(url)) continue;
    seen.add(url);
    const source = { url };
    if (typeof row.title === "string") source.title = row.title.slice(0, 1e3);
    const snippet = id === "parallel" ? excerpts(row.excerpts) : id === "exa" ? excerpts(row.highlights) : text(row.snippet) ?? text(row.description);
    if (snippet) {
      source.snippet = snippet.slice(0, SNIPPET_LIMIT);
      truncated ||= snippet.length > SNIPPET_LIMIT;
    }
    const published = id === "nimble" ? void 0 : text(row.publishedDate) ?? text(row.published_at) ?? text(row.publish_date) ?? text(row.date);
    if (published) source.publishedAt = published.slice(0, 100);
    if (capability === "papers") {
      if (Array.isArray(row.authors)) source.authors = row.authors.filter((v) => typeof v === "string").slice(0, 50).map((author) => author.slice(0, 200));
      if (typeof row.year === "number" && Number.isInteger(row.year)) source.year = row.year;
      if (typeof row.venue === "string") source.venue = row.venue.slice(0, 1e3);
      if (typeof row.doi === "string") source.doi = row.doi.slice(0, 1e3);
    }
    if (capability === "images") {
      const properties = row.properties === void 0 ? {} : object(row.properties);
      if (typeof properties.url === "string") {
        try {
          source.mediaUrl = httpUrl(properties.url);
        } catch {
        }
      }
    }
    sources.push(source);
  }
  return { sources: sources.slice(0, limit), truncated };
}
var SearchAdapter = class {
  gate = new RequestGate();
  transport;
  options;
  lifetime = new AbortController();
  constructor(options) {
    this.options = options;
    this.transport = options.transport ?? fetch;
  }
  available() {
    return !this.lifetime.signal.aborted && this.options.enabled();
  }
  dispose() {
    this.lifetime.abort(new SearchError("unavailable", "Search plugin unloaded"));
  }
  async headers() {
    if (!this.available()) throw new SearchError("provider-disabled", `${providerOf(this.options.id).label} is disabled`);
    if (this.options.id === "fxtwitter") return { accept: "application/json" };
    const key = await this.options.resolveKey();
    if (!key && !providerOf(this.options.id).keyOptional) throw new SearchError("missing-key", `No API key for ${providerOf(this.options.id).label}`);
    const headers = { "content-type": "application/json", accept: "application/json" };
    if (this.options.id === "keenable") {
      headers["X-Keenable-Title"] = "DSH Search Providers";
      if (key) headers["X-API-Key"] = key;
    } else if (this.options.id === "brave") headers["X-Subscription-Token"] = key;
    else if (this.options.id === "tinyfish" || this.options.id === "parallel" || this.options.id === "exa") headers["x-api-key"] = key;
    else headers.authorization = `Bearer ${key}`;
    return headers;
  }
  async request(url, body, signal) {
    const combined = signal ? AbortSignal.any([signal, this.lifetime.signal]) : this.lifetime.signal;
    return this.gate.run(async () => {
      const headers = await this.headers();
      if (this.options.id === "keenable" && !headers["X-API-Key"]) {
        const endpoint = new URL(url);
        endpoint.pathname += "/public";
        url = endpoint;
      }
      try {
        return await jsonRequest(this.transport, url, { headers, method: body ? "POST" : "GET", ...body ? { body: JSON.stringify(body) } : {} }, combined);
      } catch (error) {
        if (combined.aborted || error instanceof SearchError) throw error;
        throw new SearchError("provider-failed", "Search API request failed");
      }
    }, combined);
  }
  async search(request, signal, capability) {
    const { query } = request, limit = request.maxResults ?? 8, id = this.options.id;
    if (providerOf(id).webSearch === false) throw new SearchError("unsupported-capability", "This provider does not support web search");
    if (typeof query !== "string" || !query.trim() || query.length > (id === "brave" ? 600 : 2e3) || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new SearchError("invalid-request", "Invalid search query or result limit");
    if (capability && !providerOf(id).capabilities.includes(capability)) throw new SearchError("unsupported-capability", "This provider does not support the selected capability");
    let response;
    switch (id) {
      case "keenable":
        response = await this.request("https://api.keenable.ai/v1/search", { query, max_results: Math.min(limit, 50) }, signal);
        break;
      case "nimble":
        response = await this.request("https://sdk.nimbleway.com/v2/search", {
          query,
          max_results: limit,
          search_depth: "lite",
          full_content: false,
          focus: capability === "news" ? "news" : capability === "papers" ? "academic" : capability === "code" ? "coding" : "general"
        }, signal);
        break;
      case "tinyfish": {
        const url = new URL("https://api.search.tinyfish.ai");
        url.searchParams.set("query", query);
        url.searchParams.set("domain_type", capability === "news" ? "news" : capability === "papers" ? "research_paper" : "web");
        response = await this.request(url, void 0, signal);
        break;
      }
      case "parallel":
        response = await this.request("https://api.parallel.ai/v1/search", { search_queries: [query], mode: "fast", advanced_settings: { max_results: Math.min(limit, 20) } }, signal);
        break;
      case "exa":
        response = await this.request("https://api.exa.ai/search", {
          query,
          type: "auto",
          numResults: limit,
          contents: { highlights: true },
          ...capability ? { category: capability === "papers" ? "publication" : capability === "companies" ? "company" : capability } : {}
        }, signal);
        break;
      case "brave": {
        const vertical = capability === "images" ? "images" : capability === "videos" ? "videos" : capability === "news" ? "news" : "web";
        const url = new URL(`https://api.search.brave.com/res/v1/${vertical}/search`);
        url.searchParams.set("q", query);
        url.searchParams.set("count", String(Math.min(limit, vertical === "web" ? 20 : 50)));
        response = await this.request(url, void 0, signal);
        if (vertical === "web") response = object(response.web);
        break;
      }
      case "perplexity":
        response = await this.request("https://api.perplexity.ai/search", { query, search_type: capability === "people" ? "people" : "web", max_results: Math.min(limit, 20) }, signal);
        break;
      case "fxtwitter":
        throw new SearchError("unsupported-capability", "Use x_search for FxTwitter");
    }
    return normalized(list(response.results), limit, id, capability);
  }
  async xSearch(request, signal) {
    if (this.options.id !== "fxtwitter") throw new SearchError("unsupported-capability", "This provider does not support X search");
    const { query } = request, limit = request.maxResults ?? 8, sort = request.sort ?? "latest";
    if (typeof query !== "string" || !query.trim() || query.length > 8192 || !["latest", "top"].includes(sort) || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new SearchError("invalid-request", "Invalid X search query, order, or result limit");
    const id = xPostId(query.trim());
    const endpoint = new URL(id ? `https://api.fxtwitter.com/2/status/${id}` : "https://api.fxtwitter.com/2/search");
    if (!id) {
      if (query.trim().length > 512) throw new SearchError("invalid-request", "X search queries must be at most 512 characters");
      endpoint.searchParams.set("q", query.trim());
      endpoint.searchParams.set("feed", sort);
      endpoint.searchParams.set("count", String(limit));
    }
    let response;
    try {
      response = await this.request(endpoint, void 0, signal);
    } catch (error) {
      if (error instanceof SearchError && error.status === 404) throw new SearchError(id ? "x-post-unavailable" : "x-search-unavailable", id ? "FxTwitter could not retrieve this post" : "FxTwitter could not retrieve search results; it does not distinguish no matches from unavailable search", 404);
      throw error;
    }
    if (response.code !== 200) {
      if (response.code === 404) throw new SearchError(id ? "x-post-unavailable" : "x-search-unavailable", id ? "FxTwitter could not retrieve this post" : "FxTwitter could not retrieve search results; it does not distinguish no matches from unavailable search", 404);
      throw new SearchError("provider-failed", "FxTwitter returned an unsuccessful response");
    }
    if (id) {
      if (response.status === null) throw new SearchError("x-post-unavailable", "FxTwitter could not retrieve this post");
      const post = object(response.status);
      if (post.type === "tombstone") throw new SearchError("x-post-unavailable", "FxTwitter could not retrieve this post");
      if (post.id !== id) throw new SearchError("invalid-response", "FxTwitter returned a different post");
      return xSources([post], 1);
    }
    const cursor = response.cursor === void 0 || response.cursor === null ? {} : object(response.cursor);
    return xSources(list(response.results), limit, typeof cursor.bottom === "string" && cursor.bottom.length > 0);
  }
  async extract(input, signal) {
    const url = publicUrl(input), id = this.options.id;
    if (!providerOf(id).capabilities.includes("extract")) throw new SearchError("unsupported-capability", "This provider does not support extraction");
    let response, row, content;
    switch (id) {
      case "keenable": {
        const endpoint = new URL("https://api.keenable.ai/v1/fetch");
        endpoint.searchParams.set("url", url);
        endpoint.searchParams.set("live", "true");
        endpoint.searchParams.set("max_chars", String(TEXT_LIMIT + 1));
        response = await this.request(endpoint, void 0, signal);
        row = response;
        content = row.content;
        break;
      }
      case "nimble":
        response = await this.request("https://sdk.nimbleway.com/v2/extract", { url, formats: ["markdown"], request_timeout: 4e4 }, signal);
        row = response;
        if (typeof row.status_code !== "number" || row.status_code < 200 || row.status_code >= 300) throw new SearchError("extract-failed", "The requested page could not be retrieved");
        content = object(row.data).markdown;
        break;
      case "tinyfish":
        response = await this.request("https://api.fetch.tinyfish.ai", { urls: [url], format: "markdown", per_url_timeout_ms: 4e4 }, signal);
        row = object(list(response.results)[0]);
        content = row.text;
        break;
      case "parallel":
        response = await this.request("https://api.parallel.ai/v1/extract", { urls: [url], advanced_settings: { full_content: { max_chars_per_result: TEXT_LIMIT + 1 } } }, signal);
        row = object(list(response.results)[0]);
        content = row.full_content;
        break;
      case "exa":
        response = await this.request("https://api.exa.ai/contents", { ids: [url], text: { maxCharacters: TEXT_LIMIT + 1 } }, signal);
        row = object(list(response.results)[0]);
        content = row.text;
        break;
      default:
        throw new SearchError("unsupported-capability", "This provider does not support extraction");
    }
    if (typeof content !== "string") throw new SearchError("extract-failed", "The API did not return page text");
    const result = { url: httpUrl(row.final_url ?? row.url ?? url), content: content.slice(0, TEXT_LIMIT), truncated: content.length > TEXT_LIMIT };
    if (typeof row.title === "string") result.title = row.title.slice(0, 1e3);
    return result;
  }
  async map(input, signal) {
    if (this.options.id !== "nimble") throw new SearchError("unsupported-capability", "This provider does not support site mapping");
    const url = publicUrl(input);
    const response = await this.request("https://sdk.nimbleway.com/v2/map", { url, domain_filter: "domain", limit: 50 }, signal);
    return normalized(list(response.links), 50, "nimble");
  }
};

// src/broker.ts
import { credentialKey, credentialRef } from "@deepseek-ai/dsh-credentials";
import { createHash } from "node:crypto";
var fingerprint = (config) => createHash("sha256").update(JSON.stringify(config)).digest("hex");
var SearchBroker = class {
  ctx;
  constructor(ctx) {
    this.ctx = ctx;
  }
  section() {
    const section = this.ctx.settings.describe({ redactSecrets: true }).find((row) => row.ns === NS);
    if (!section) throw new SearchError("unavailable", "Search settings are unavailable");
    return section;
  }
  webEntry() {
    const entry = this.ctx.configEditor.entries().find((row) => row.options.id === "web" && row.options.name === "@deepseek-ai/dsh-web");
    if (!entry) throw new SearchError("unavailable", "The standard web service is unavailable");
    return entry;
  }
  async key(id) {
    const env = providerOf(id).env;
    if (!env) return void 0;
    const saved = await this.ctx.credentials.readRecord(credentialKey(NS, id));
    if (saved?.kind === "api-key" && saved.key) return saved.key;
    return (await this.ctx.credentials.resolve(credentialRef(env)))?.value;
  }
  async credential(id) {
    const env = providerOf(id).env;
    if (!env) return { configured: false, writable: false };
    const saved = await this.ctx.credentials.describeRecord(credentialKey(NS, id));
    const ambient = await this.ctx.credentials.describe(credentialRef(env));
    return {
      configured: saved.configured || ambient.configured,
      writable: saved.writable,
      ...saved.configured ? { source: "saved" } : ambient.configured ? { source: env } : {}
    };
  }
  async snapshot() {
    const section = this.section(), value = object(section.value), providers = object(value.providers ?? {}), config = this.webEntry().options.config ?? {};
    const searchProvider = typeof config.searchProvider === "string" ? config.searchProvider : process.env.DSH_WEB_SEARCH_PROVIDER ?? "deepseek-official";
    return {
      revision: section.revision,
      searchProvider,
      searchRevision: fingerprint(config),
      nativeSearchProvider: typeof value.nativeSearchProvider === "string" ? value.nativeSearchProvider : "deepseek-official",
      tools: value.tools,
      entries: await Promise.all(PROVIDERS.map(async (row) => {
        const provider = providerOf(row.id);
        return {
          ...provider,
          keyOptional: !!provider.keyOptional,
          supportsKeys: !!provider.env,
          webSearch: provider.webSearch !== false,
          enabled: Object.hasOwn(providers, row.id) && object(providers[row.id]).enabled === true,
          ...await this.credential(row.id)
        };
      }))
    };
  }
  checkRevision(revision) {
    if (!Number.isSafeInteger(revision)) throw new SearchError("invalid-request", "Invalid settings revision");
    const current = this.section().revision;
    if (revision !== current) throw new SearchError("settings-changed", "Settings changed in another window");
    return current;
  }
  async dispatch(method, payload) {
    const data = object(payload);
    if (method === "list") return this.snapshot();
    const id = method === "default" && data.provider === "native" ? void 0 : providerOf(data.provider).id;
    if (method === "save-key") {
      if (!id || !providerOf(id).env || typeof data.key !== "string" || !data.key.trim() || data.key.length > 16384 || /[\r\n]/.test(data.key)) throw new SearchError("invalid-request", "Invalid API key");
      const key = data.key.trim();
      await this.ctx.credentials.modifyRecord(credentialKey(NS, id), async () => ({ kind: "api-key", key }));
      return { saved: true };
    }
    if (method === "delete-key") {
      if (!id || !providerOf(id).env) throw new SearchError("invalid-request", "Invalid provider");
      await this.ctx.credentials.deleteRecord(credentialKey(NS, id));
      return { saved: true };
    }
    const revision = this.checkRevision(data.revision);
    if (method === "provider") {
      if (!id || typeof data.enabled !== "boolean") throw new SearchError("invalid-request", "Invalid provider state");
      if (data.enabled && !providerOf(id).keyOptional && !(await this.credential(id)).configured) throw new SearchError("missing-key", "Save an API key first");
      await this.ctx.settings.update(NS, { providers: { [id]: { enabled: data.enabled } } }, revision);
    } else if (method === "tool") {
      const capability = capabilityOf(data.capability);
      if (!id || typeof data.enabled !== "boolean" || !providerOf(id).capabilities.includes(capability)) throw new SearchError("invalid-request", "Unsupported capability");
      const snapshot = await this.snapshot(), entry = snapshot.entries.find((row) => row.id === id);
      if (data.enabled && !entry.enabled) throw new SearchError("provider-disabled", "Enable the provider first");
      if (!data.enabled && snapshot.tools[capability]?.provider !== id) throw new SearchError("settings-changed", "Another provider supplies this capability");
      await this.ctx.settings.update(NS, { tools: { [capability]: { provider: id, enabled: data.enabled } } }, revision);
    } else if (method === "default") {
      if (id && providerOf(id).webSearch === false) throw new SearchError("invalid-request", "This provider only supplies additional tools");
      const snapshot = await this.snapshot(), entry = this.webEntry();
      if (typeof data.searchRevision !== "string" || snapshot.searchRevision !== data.searchRevision) throw new SearchError("settings-changed", "The search provider changed");
      if (id && !snapshot.entries.find((row) => row.id === id)?.enabled) throw new SearchError("provider-disabled", "Enable the provider first");
      let native = snapshot.nativeSearchProvider;
      if (!snapshot.searchProvider.startsWith(`${NS}-`)) {
        native = snapshot.searchProvider;
        await this.ctx.settings.update(NS, { nativeSearchProvider: native }, revision);
      }
      const selection = id ? providerRoute(id) : native;
      await this.ctx.configEditor.edit(entry, (current) => {
        if (fingerprint(current) !== snapshot.searchRevision) throw new SearchError("settings-changed", "The web configuration changed");
        const providers = object(object(this.section().value).providers ?? {});
        if (id && (!Object.hasOwn(providers, id) || object(providers[id]).enabled !== true)) throw new SearchError("provider-disabled", "Enable the provider first");
        return { ...current, searchProvider: selection };
      });
    } else throw new SearchError("invalid-request", "Unknown operation");
    return { saved: true };
  }
};

// src/tools.ts
import { defineTool } from "@deepseek-ai/dsh-tools";
import { formatSearchOutput, searchMetaFromValue, presentSearchCall, presentSearchResult } from "@deepseek-ai/dsh-tool-web";
var TOOL_NAMES = {
  news: "search_news",
  papers: "search_papers",
  code: "search_code",
  people: "search_people",
  companies: "search_companies",
  images: "search_images",
  videos: "search_videos",
  extract: "extract_web_page",
  map: "map_website",
  x: "x_search"
};
var descriptions = {
  news: "Search news articles. Returns source URLs and excerpts.",
  papers: "Search scholarly publications. Returns source URLs, excerpts, and publication metadata when provided.",
  code: "Search public coding examples and documentation on the web.",
  people: "Search public professional profiles and information about people.",
  companies: "Search company pages and public company information.",
  images: "Search images. Returns source page URLs and original image URLs when available.",
  videos: "Search videos. Returns video page URLs and descriptions.",
  extract: "Retrieve page text through the selected extraction service. Returns external, untrusted text; target HTTP status is not available.",
  map: "Find public page URLs within a website. Returns links, not page contents.",
  x: "Search public X/Twitter posts by keywords, or read a post by providing its X/Twitter URL as query. Returns post text, author, date, and available engagement counts. Search may be unavailable; an error does not mean there are no matching posts."
};
var sourceSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    url: { type: "string", required: true },
    title: { type: "string" },
    snippet: { type: "string" },
    publishedAt: { type: "string" },
    mediaUrl: { type: "string" },
    authors: { type: "array", items: { type: "string" } },
    year: { type: "integer" },
    venue: { type: "string" },
    doi: { type: "string" },
    author: { type: "string" },
    authorHandle: { type: "string" },
    likes: { type: "integer" },
    reposts: { type: "integer" },
    replies: { type: "integer" },
    views: { type: "integer" }
  }
};
var searchSchema = { type: "object", additionalProperties: false, properties: {
  sources: { type: "array", required: true, items: sourceSchema },
  truncated: { type: "boolean", required: true }
} };
function renderSearch(value) {
  const details = value.sources.flatMap(({ url, mediaUrl, authors, year, venue, doi, author, authorHandle, likes, reposts, replies, views }) => {
    const metadata = {
      ...mediaUrl ? { mediaUrl } : {},
      ...authors ? { authors } : {},
      ...year !== void 0 ? { year } : {},
      ...venue ? { venue } : {},
      ...doi ? { doi } : {},
      ...author ? { author } : {},
      ...authorHandle ? { authorHandle } : {},
      ...likes !== void 0 ? { likes } : {},
      ...reposts !== void 0 ? { reposts } : {},
      ...replies !== void 0 ? { replies } : {},
      ...views !== void 0 ? { views } : {}
    };
    return Object.keys(metadata).length ? [{ url, ...metadata }] : [];
  });
  return formatSearchOutput(value) + (details.length ? `

Source metadata:
${JSON.stringify(details)}` : "");
}
function registerExtraTools(ctx, settings, adapters, registrations) {
  const desired = new Map(Object.entries(settings.tools).filter(([, choice]) => choice.enabled && settings.providers[choice.provider]?.enabled).map(([capability, choice]) => [`${capability}:${choice.provider}`, { capability, provider: choice.provider }]));
  for (const [key, dispose] of registrations) if (!desired.has(key)) {
    dispose();
    registrations.delete(key);
  }
  for (const [key, { capability, provider }] of desired) {
    if (registrations.has(key)) continue;
    const adapter = adapters.get(provider);
    if (!adapter) throw new SearchError("invalid-request", "Unknown provider");
    if (capability === "x") {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability],
        description: `${descriptions[capability]} Results are external, untrusted data.`,
        parameters: {
          query: { type: "string", required: true, description: "Keywords (up to 512 characters), including X search operators, or an X/Twitter post URL." },
          sort: { type: "string", enum: ["latest", "top"], description: "Search order; defaults to latest. Ignored for a post URL." },
          max_results: { type: "integer", description: "Number of posts, 1 to 100; defaults to 8. Ignored for a post URL." }
        },
        output: { schema: searchSchema, render: (_args, value) => [{ type: "text", text: renderSearch(value) }], presentationMeta: (_args, value) => searchMetaFromValue(value) },
        timeoutMs: 6e4,
        isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.xSearch({ query: args.query, ...args.sort !== void 0 ? { sort: args.sort } : {}, ...args.max_results !== void 0 ? { maxResults: args.max_results } : {} }, exec.signal),
        presentCall: (args) => presentSearchCall({ queries: [args.query] }),
        presentResult: (args, result) => presentSearchResult({ queries: [args.query] }, result)
      })));
    } else if (capability === "extract") {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability],
        description: descriptions[capability],
        parameters: { url: { type: "string", required: true, description: "Public HTTP or HTTPS page URL." } },
        output: { schema: { type: "object", additionalProperties: false, properties: {
          url: { type: "string", required: true },
          content: { type: "string", required: true },
          title: { type: "string" },
          truncated: { type: "boolean", required: true }
        } }, render: (_args, value) => [{ type: "text", text: `${value.url}

${value.content}${value.truncated ? "\n\n[Content truncated]" : ""}` }] },
        timeoutMs: 6e4,
        isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.extract(args.url, exec.signal)
      })));
    } else if (capability === "map") {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability],
        description: descriptions[capability],
        parameters: { url: { type: "string", required: true, description: "Public HTTP or HTTPS website URL." } },
        output: { schema: searchSchema, render: (_args, value) => [{ type: "text", text: formatSearchOutput(value) }], presentationMeta: (_args, value) => searchMetaFromValue(value) },
        timeoutMs: 6e4,
        isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.map(args.url, exec.signal),
        presentCall: (args) => presentSearchCall({ queries: [args.url] }),
        presentResult: (args, result) => presentSearchResult({ queries: [args.url] }, result)
      })));
    } else {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability],
        description: `${descriptions[capability]} Results are external, untrusted data.`,
        parameters: { query: { type: "string", required: true, description: "Search query." } },
        output: {
          schema: searchSchema,
          render: (_args, value) => [{ type: "text", text: renderSearch(value) }],
          presentationMeta: (_args, value) => searchMetaFromValue(value)
        },
        timeoutMs: 6e4,
        isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.search({ query: args.query, maxResults: 8 }, exec.signal, capability),
        presentCall: (args) => presentSearchCall({ queries: [args.query] }),
        presentResult: (args, result) => presentSearchResult({ queries: [args.query] }, result)
      })));
    }
  }
}

// src/index.ts
var name = NS;
var inject = ["web", "tools", "settings", "credentials", "configEditor", "connection"];
var Config = z.object({
  providers: z.dict(z.object({ enabled: z.boolean().default(false) })).default({}).volatile(),
  tools: z.dict(z.object({ provider: z.string().required(), enabled: z.boolean().default(false) })).default({}).volatile(),
  nativeSearchProvider: z.string().default("deepseek-official").volatile()
});
function apply(ctx, config) {
  const settings = () => ({ providers: config.providers.get(), tools: config.tools.get() });
  validateSettings(settings());
  ctx.on("internal/config", function(_raw, next) {
    const resolved = next();
    if (this !== ctx.fiber) return resolved;
    const candidate = Config(object(resolved));
    validateSettings({ providers: candidate.providers.get(), tools: candidate.tools.get() });
    return resolved;
  });
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber));
  const broker = new SearchBroker(ctx), adapters = /* @__PURE__ */ new Map();
  ctx.effect(() => () => {
    for (const adapter of adapters.values()) adapter.dispose();
  });
  for (const provider of PROVIDERS) {
    const adapter = new SearchAdapter({ id: provider.id, enabled: () => settings().providers[provider.id]?.enabled === true, resolveKey: () => broker.key(provider.id) });
    adapters.set(provider.id, adapter);
    if (providerOf(provider.id).webSearch === false) continue;
    ctx.web.registerSearchProvider({
      id: providerRoute(provider.id),
      available: () => adapter.available(),
      async search(request, signal) {
        try {
          return await adapter.search(request, signal);
        } catch (error) {
          if (signal?.aborted) throw new WebError("Search cancelled", "WEB_SEARCH_CANCELLED");
          if (error instanceof SearchError) throw new WebError(error.message, `SEARCH_${error.code.toUpperCase().replaceAll("-", "_")}`);
          throw new WebError("Search request failed", "WEB_PROVIDER_FAILURE");
        }
      }
    });
  }
  const registrations = /* @__PURE__ */ new Map();
  const refreshTools = () => {
    const value = settings();
    validateSettings(value);
    registerExtraTools(ctx, value, adapters, registrations);
  };
  refreshTools();
  ctx.on("settings/document-updated", (namespace) => {
    if (namespace === NS) refreshTools();
  });
  ctx.on("loader/volatile-update", refreshTools);
  ctx.effect(() => () => {
    for (const dispose of registrations.values()) dispose();
    registrations.clear();
  });
  for (const method of ["list", "save-key", "delete-key", "provider", "tool", "default"]) {
    const endpoint = `${NS}/${method}`;
    ctx.connection.fetch.register({
      path: `/api/${endpoint}`,
      methods: ["POST"],
      requestBody: "buffered",
      async fetch(request) {
        let rpcId;
        try {
          if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return new Response("unsupported media type", { status: 415 });
          const envelope = object(await request.json());
          if (envelope.type !== "client-request" || typeof envelope.rpcId !== "string" || envelope.rpcId.length > 100 || envelope.method !== endpoint) return new Response("invalid request", { status: 400 });
          rpcId = envelope.rpcId;
          request.signal.throwIfAborted();
          const value = await broker.dispatch(method, envelope.payload);
          return Response.json({ type: "server-response", rpcId, result: { ok: true, value } }, { headers: { "cache-control": "no-store" } });
        } catch (error) {
          if (rpcId === void 0) return new Response("invalid request", { status: 400 });
          const code = error instanceof SearchError ? error.code : "unavailable";
          return Response.json({ type: "server-response", rpcId, result: { ok: false, error: { code: `${NS}/${code}`, message: code, details: {} } } }, { headers: { "cache-control": "no-store" } });
        }
      }
    });
  }
}
export {
  Config,
  apply,
  inject,
  name
};
