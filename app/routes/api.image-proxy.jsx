const ALLOWED_IMAGE_HOSTS = [
  'alicdn.com',
  'taobao.com',
  'tbcdn.com',
];

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({request}) {
  const requestUrl = new URL(request.url);
  const source = requestUrl.searchParams.get('url');

  if (!source) {
    throw new Response('Missing image URL', {status: 400});
  }

  let imageUrl;
  try {
    imageUrl = new URL(source);
  } catch {
    throw new Response('Invalid image URL', {status: 400});
  }

  if (imageUrl.protocol !== 'https:' || !isAllowedImageHost(imageUrl.hostname)) {
    throw new Response('Image host is not allowed', {status: 403});
  }

  const upstream = await fetch(imageUrl.toString(), {
    headers: {
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      Referer: 'https://item.taobao.com/',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
    },
  });

  if (!upstream.ok || !upstream.body) {
    throw new Response('Image could not be loaded', {status: upstream.status});
  }

  const contentType = upstream.headers.get('content-type') || 'image/jpeg';
  if (!contentType.toLowerCase().startsWith('image/')) {
    throw new Response('Unsupported upstream content type', {status: 415});
  }

  return new Response(upstream.body, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': contentType,
    },
  });
}

function isAllowedImageHost(hostname) {
  return ALLOWED_IMAGE_HOSTS.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  );
}

/** @typedef {import('./+types/api.image-proxy').Route} Route */
