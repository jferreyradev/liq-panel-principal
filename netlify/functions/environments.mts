export default async () => {
  try {
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

    if (envs.length === 0) {
      envs = [
        {
          id: 'rpi-prod',
          nombre: 'Producción (Raspberry Pi)'
        }
      ];
    }

    // Public list only: no URLs or API keys
    const publicList = envs.map(e => ({ id: e.id, nombre: e.nombre }));

    return new Response(JSON.stringify(publicList), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Error cargando entornos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/environments'
};
