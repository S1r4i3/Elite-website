import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Elite B Tax Services. Your Taxes. Done Right. Without the Stress.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logo = await readFile(path.join(process.cwd(), "public/brand/ebt-logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: 72,
          color: "white",
          fontFamily: "sans-serif",
          background: "radial-gradient(ellipse at 75% 10%, #3a424c 0%, #1b1f24 55%, #121518 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={420} height={269} alt="" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1 }}>Your Taxes. Done Right.</div>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, color: "#FF6B78" }}>Without the Stress.</div>
          <div style={{ marginTop: 28, fontSize: 26, color: "rgba(255,255,255,0.72)", lineHeight: 1.4 }}>
            Federal & State · FBAR / FATCA · ITIN · IRS Help · Business · U.S. + India
          </div>
        </div>
      </div>
    ),
    size,
  );
}
