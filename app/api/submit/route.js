export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Coerce data types: Website and Email are text
    const formData = {
      name: String(body?.name ?? "").trim(),
      email: String(body?.email ?? "").trim(),
      company: String(body?.company ?? "").trim(),
      website: String(body?.website ?? "").trim()
    };

    if (!formData.name || !formData.email || !formData.company || !formData.website) {
      return Response.json(
        { error: "Name, Email, Company, and Website are all required." },
        { status: 400 }
      );
    }

    const { FORM_TOKEN, API_BASE_URL, FORM_ID } = process.env;

    if (!FORM_TOKEN || !API_BASE_URL || !FORM_ID) {
      return Response.json(
        { error: "Server is not configured. Missing FORM_TOKEN, API_BASE_URL, or FORM_ID." },
        { status: 500 }
      );
    }

    const baseUrl = API_BASE_URL.replace(/\/$/, "");
    const targetUrl = `${baseUrl}/public/forms/${FORM_ID}/submit`;

    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: FORM_TOKEN,
        data: formData
      })
    });

    const result = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return Response.json(
        { error: result?.error || result?.message || "Upstream submission failed." },
        { status: upstream.status }
      );
    }

    return Response.json({ ok: true, result }, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
