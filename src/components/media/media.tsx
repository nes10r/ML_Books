import Image from "next/image";
import { getMedia } from "@/lib/content/repository";
import { contentBlockSchema, type MediaAsset } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Renders any registered MediaAsset by ID. New media types are added by
 * extending `mediaAssetSchema` and adding a case to `MediaBody` — call sites
 * (`<Media id="…" />`) never change.
 */
export function Media({ id, className, priority = false }: { id: string; className?: string; priority?: boolean }) {
  contentBlockSchema.parse({ type: "media", mediaId: id });
  const asset = getMedia(id);
  if (!asset) throw new Error(`Naməlum media: '${id}'`);
  return (
    <figure className={cn("not-prose my-8", className)}>
      <div className="overflow-hidden rounded-xl border bg-white">
        <MediaBody asset={asset} priority={priority} />
      </div>
      {(asset.caption || asset.credit) && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {asset.caption}
          {asset.credit && <span className="block text-xs opacity-80">{asset.credit}{asset.license ? ` · ${asset.license}` : ""}</span>}
        </figcaption>
      )}
    </figure>
  );
}

function MediaBody({ asset, priority }: { asset: MediaAsset; priority: boolean }) {
  switch (asset.type) {
    case "image":
      return (
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          priority={priority}
          sizes="(min-width: 1024px) 768px, 100vw"
          className="h-auto w-full"
          unoptimized={asset.src.endsWith(".svg")}
        />
      );
    case "video":
      return (
        <video controls preload="metadata" poster={asset.poster} className="aspect-video w-full bg-black">
          <source src={asset.src} />
          {asset.captions.map((c) => (
            <track key={c.src} kind="captions" src={c.src} srcLang={c.srclang} label={c.label} />
          ))}
        </video>
      );
    case "embed": {
      const src =
        asset.provider === "youtube"
          ? `https://www.youtube-nocookie.com/embed/${asset.videoId}`
          : `https://player.vimeo.com/video/${asset.videoId}`;
      return (
        <iframe
          src={src}
          title={asset.title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className={cn("w-full border-0", asset.aspectRatio === "4/3" ? "aspect-[4/3]" : "aspect-video")}
        />
      );
    }
  }
}
