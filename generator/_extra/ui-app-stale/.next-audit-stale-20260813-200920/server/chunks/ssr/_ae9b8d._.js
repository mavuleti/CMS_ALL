module.exports = {

"[project]/components/BrowserErrorTracker.tsx [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>BrowserErrorTracker
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
const ENDPOINT = '/api/browser-error';
const MAX_REPORTS_PER_PAGE = 10;
const enabled = process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true';
function cleanUrl(value) {
    try {
        const url = new URL(value, window.location.origin);
        return `${url.origin}${url.pathname}`;
    } catch  {
        return value.split(/[?#]/, 1)[0];
    }
}
function describeReason(reason) {
    if (reason instanceof Error) {
        return {
            message: reason.message || reason.name,
            stack: reason.stack
        };
    }
    if (typeof reason === 'string') return {
        message: reason
    };
    try {
        return {
            message: JSON.stringify(reason)
        };
    } catch  {
        return {
            message: String(reason)
        };
    }
}
function BrowserErrorTracker() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled || navigator.webdriver) return;
        if ([
            'localhost',
            '127.0.0.1'
        ].includes(window.location.hostname) || window.location.hostname.endsWith('.local')) return;
        let sent = 0;
        const recent = new Map();
        const report = (details)=>{
            if (sent >= MAX_REPORTS_PER_PAGE) return;
            const key = `${details.type}:${details.message}:${details.source ?? ''}:${details.line ?? ''}`;
            const now = Date.now();
            if (now - (recent.get(key) ?? 0) < 30_000) return;
            recent.set(key, now);
            sent += 1;
            const payload = JSON.stringify({
                ...details,
                page: cleanUrl(window.location.href),
                source: details.source ? cleanUrl(details.source) : undefined,
                userAgent: navigator.userAgent,
                language: navigator.language,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                occurredAt: new Date().toISOString()
            });
            if (navigator.sendBeacon) {
                const queued = navigator.sendBeacon(ENDPOINT, new Blob([
                    payload
                ], {
                    type: 'application/json'
                }));
                if (queued) return;
            }
            void fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: payload,
                keepalive: true,
                credentials: 'omit'
            }).catch(()=>{});
        };
        const onError = (event)=>{
            report({
                type: 'error',
                message: event.message || 'Unknown browser error',
                stack: event.error instanceof Error ? event.error.stack : undefined,
                source: event.filename,
                line: event.lineno,
                column: event.colno
            });
        };
        const onResourceError = (event)=>{
            const target = event.target;
            if (!(target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement)) return;
            const source = target instanceof HTMLLinkElement ? target.href : target.src;
            report({
                type: 'resource',
                message: `Failed to load ${target.tagName.toLowerCase()} resource`,
                source
            });
        };
        const onRejection = (event)=>{
            report({
                type: 'unhandledrejection',
                ...describeReason(event.reason)
            });
        };
        window.addEventListener('error', onError);
        window.addEventListener('error', onResourceError, true);
        window.addEventListener('unhandledrejection', onRejection);
        return ()=>{
            window.removeEventListener('error', onError);
            window.removeEventListener('error', onResourceError, true);
            window.removeEventListener('unhandledrejection', onRejection);
        };
    }, []);
    return null;
}

})()),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js server component, client modules ssr)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),

};

//# sourceMappingURL=_ae9b8d._.js.map