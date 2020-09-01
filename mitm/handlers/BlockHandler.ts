import IMitmRequestContext from '../interfaces/IMitmRequestContext';

export default class BlockHandler {
  public static shouldBlockRequest(ctx: IMitmRequestContext) {
    const session = ctx.requestSession;
    if (!session) return false;
    if (session.isClosing) return true;

    const shouldBlock =
      (ctx.resourceType && session.blockResourceTypes.includes(ctx.resourceType)) ||
      session.shouldBlockRequest(ctx.url.href);

    if (!shouldBlock) return false;
    ctx.didBlockResource = shouldBlock;

    let contentType = 'text/html';
    if (ctx.resourceType === 'Image') {
      contentType = `image/${ctx.url.pathname.split('.').pop()}`;
    }

    if (ctx.proxyToClientResponse) {
      if (session.blockHandler(ctx.clientToProxyRequest, ctx.proxyToClientResponse)) {
        return true;
      }

      ctx.proxyToClientResponse.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      });
      ctx.proxyToClientResponse.end();
    }
    // don't proceed
    return true;
  }
}
