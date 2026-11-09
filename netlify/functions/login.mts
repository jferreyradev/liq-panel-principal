export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { envId, usr, pws } = body;

    if (!usr || !pws) {
      return new Response(JSON.stringify({ status: 'error', error: 'Debe ingresar usuario y contraseña.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const raw = process.env.API_ENVIRONMENTS;
    let envs: any[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) envs = parsed;
      } catch (e) {
        console.error('Error parseando API_ENVIRONMENTS en Netlify:', e);
      }
    }

    const targetEnv = envs.find(e => e.id === envId) || envs[0];

    if (!targetEnv || !targetEnv.url) {
      return new Response(JSON.stringify({ status: 'error', error: 'Entorno o servidor no configurado.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const targetUrl = `${targetEnv.url.replace(/\/+$/, '')}/api/auth/login`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (targetEnv.apiKey && targetEnv.apiKey.trim()) {
      headers['X-API-Key'] = targetEnv.apiKey.trim();
    }

    try {
      const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ usr, pws })
      });

      const responseText = await apiResponse.text();
      return new Response(responseText, {
        status: apiResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    } catch (fetchErr: any) {
      return new Response(JSON.stringify({
        status: 'error',
        code: 'SERVER_UNREACHABLE',
        error: `No se pudo conectar con el servidor "${targetEnv.nombre || 'seleccionado'}". Verifique que esté online.`
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ status: 'error', error: 'Error interno en el proxy de autenticación.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/auth/login'
};
