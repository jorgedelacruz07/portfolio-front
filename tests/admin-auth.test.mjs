import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { adminApi, adminApiClient, getAdminCsrfToken, setAdminCsrfToken } from "../lib/admin-api.ts";
import { PRODUCTION_API_URL } from "../lib/api-url.ts";

describe("admin authentication client and Google login contracts", () => {
  const originalBaseURL = adminApiClient.defaults.baseURL;

  beforeEach(() => {
    setAdminCsrfToken("");
    adminApiClient.defaults.baseURL = "https://api.example.com";
  });

  afterEach(() => {
    adminApiClient.defaults.baseURL = originalBaseURL;
  });

  it("retires the legacy magic-code methods from adminApi", () => {
    assert.equal(adminApi.requestCode, undefined, "requestCode must be removed");
    assert.equal(adminApi.verifyCode, undefined, "verifyCode must be removed");
    assert.equal(typeof adminApi.loginWithGoogle, "function", "loginWithGoogle must be exported");
  });

  it("enforces withCredentials on adminApiClient to carry HTTP-only session cookies", () => {
    assert.equal(adminApiClient.defaults.withCredentials, true);
  });

  it("attaches CSRF token to mutation requests and excludes it from safe methods", async () => {
    setAdminCsrfToken("test-csrf-token-12345");
    assert.equal(getAdminCsrfToken(), "test-csrf-token-12345");

    // Test request interceptor
    const postConfig = { method: "post", headers: {}, url: "/admin/portfolio/profile" };
    const interceptedPost = await adminApiClient.interceptors.request.handlers[0].fulfilled(postConfig);
    assert.equal(interceptedPost.headers["x-csrf-token"], "test-csrf-token-12345");

    const putConfig = { method: "put", headers: {}, url: "/admin/portfolio/settings" };
    const interceptedPut = await adminApiClient.interceptors.request.handlers[0].fulfilled(putConfig);
    assert.equal(interceptedPut.headers["x-csrf-token"], "test-csrf-token-12345");

    const getConfig = { method: "get", headers: {}, url: "/admin/auth/session" };
    const interceptedGet = await adminApiClient.interceptors.request.handlers[0].fulfilled(getConfig);
    assert.equal(interceptedGet.headers["x-csrf-token"], undefined);
  });

  it("loginWithGoogle exchanges credential, updates CSRF token, and returns payload", async () => {
    const originalAdapter = adminApiClient.defaults.adapter;
    let requestMade = null;

    adminApiClient.defaults.adapter = async (config) => {
      requestMade = config;
      if (config.url === "/admin/auth/google") {
        return {
          status: 200,
          statusText: "OK",
          headers: {},
          config,
          data: {
            csrfToken: "new-server-csrf-token",
            expiresAt: "2026-11-07T08:00:00.000Z",
          },
        };
      }
      throw new Error(`Unexpected route: ${config.url}`);
    };

    try {
      const result = await adminApi.loginWithGoogle("valid-google-id-token");
      assert.equal(requestMade.method, "post");
      assert.equal(requestMade.url, "/admin/auth/google");
      assert.deepEqual(JSON.parse(requestMade.data), { credential: "valid-google-id-token" });
      assert.equal(result.csrfToken, "new-server-csrf-token");
      assert.equal(result.expiresAt, "2026-11-07T08:00:00.000Z");
      assert.equal(getAdminCsrfToken(), "new-server-csrf-token");
    } finally {
      adminApiClient.defaults.adapter = originalAdapter;
    }
  });

  it("loginWithGoogle fails closed on 401 denial without persisting state", async () => {
    const originalAdapter = adminApiClient.defaults.adapter;

    adminApiClient.defaults.adapter = async (config) => {
      const error = new Error("Request failed with status code 401");
      error.isAxiosError = true;
      error.response = {
        status: 401,
        statusText: "Unauthorized",
        data: { error: { message: "Invalid authentication credentials", status: 401 } },
        config,
      };
      throw error;
    };

    try {
      await assert.rejects(
        () => adminApi.loginWithGoogle("denied-google-id-token"),
        (err) => {
          assert.equal(err.response?.status, 401);
          assert.equal(err.response?.data?.error?.message, "Invalid authentication credentials");
          return true;
        },
      );
      assert.equal(getAdminCsrfToken(), "");
    } finally {
      adminApiClient.defaults.adapter = originalAdapter;
    }
  });

  it("getSession updates CSRF token and returns authenticated session", async () => {
    const originalAdapter = adminApiClient.defaults.adapter;

    adminApiClient.defaults.adapter = async (config) => {
      if (config.url === "/admin/auth/session") {
        return {
          status: 200,
          statusText: "OK",
          headers: {},
          config,
          data: {
            email: "jdelacruzp7@gmail.com",
            csrfToken: "session-csrf-token-987",
            expiresAt: "2026-11-07T08:00:00.000Z",
          },
        };
      }
      throw new Error(`Unexpected URL ${config.url}`);
    };

    try {
      const session = await adminApi.getSession();
      assert.equal(session.email, "jdelacruzp7@gmail.com");
      assert.equal(session.csrfToken, "session-csrf-token-987");
      assert.equal(getAdminCsrfToken(), "session-csrf-token-987");
    } finally {
      adminApiClient.defaults.adapter = originalAdapter;
    }
  });

  it("logout revokes session on server and clears CSRF token locally", async () => {
    setAdminCsrfToken("active-csrf-token");
    const originalAdapter = adminApiClient.defaults.adapter;
    let logoutCalled = false;

    adminApiClient.defaults.adapter = async (config) => {
      if (config.url === "/admin/auth/logout") {
        logoutCalled = true;
        return {
          status: 200,
          statusText: "OK",
          headers: {},
          config,
          data: { message: "Signed out" },
        };
      }
      throw new Error(`Unexpected URL ${config.url}`);
    };

    try {
      await adminApi.logout();
      assert.equal(logoutCalled, true);
      assert.equal(getAdminCsrfToken(), "", "CSRF token must be cleared after logout");
    } finally {
      adminApiClient.defaults.adapter = originalAdapter;
    }
  });

  it("defense-in-depth: redirects non-local browser requests away from localhost", async () => {
    globalThis.window = {
      location: { hostname: "jorgedelacruzpadilla.dev" },
    };

    try {
      const config = {
        baseURL: "http://localhost:3003",
        url: "/admin/auth/session",
        headers: {},
      };
      const intercepted = await adminApiClient.interceptors.request.handlers[0].fulfilled(config);
      assert.equal(intercepted.baseURL, PRODUCTION_API_URL);
    } finally {
      delete globalThis.window;
    }
  });
});
