/**
 * 인앱 브라우저(WebView) 감지 유틸리티
 * 카카오톡, 네이버, 인스타그램 등 인앱 브라우저에서 Google OAuth가 차단됨
 */

export function isInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || navigator.vendor || "";

  const inAppPatterns = [
    /KAKAOTALK/i,
    /NAVER/i,
    /Instagram/i,
    /FBAN|FBAV/i,       // Facebook
    /Line\//i,
    /wv\)/i,            // Android WebView
    /DaumApps/i,        // 다음
    /SamsungBrowser\/.*CrossApp/i,
    /Whale\//i,         // 네이버 웨일 (일부 인앱)
  ];

  return inAppPatterns.some((pattern) => pattern.test(ua));
}

/**
 * 외부 브라우저로 열기
 * Android: intent 스킴, iOS/기타: 새 창
 */
export function openInExternalBrowser(url?: string): void {
  const targetUrl = url || window.location.href;

  // Android intent 스킴 시도
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isAndroid) {
    window.location.href =
      `intent://${targetUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;
    return;
  }

  // iOS / 기타: 새 창으로 열기 시도
  window.open(targetUrl, "_system");
}
