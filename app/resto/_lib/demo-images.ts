function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function initialsAvatar(text: string, bg: string, fg = "#ffffff"): string {
  return svgDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="200" height="200" fill="${bg}" rx="24"/>
      <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`,
  );
}

export const DEMO_LOGO = initialsAvatar("OR", "#7967FF");
