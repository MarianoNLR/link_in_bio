import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

import { useUploadAvatar } from "../api/profile.queries";

type AvatarUploaderProps = {
  avatarUrl: string | null;
  displayName: string;
};

export function AvatarUploader({
  avatarUrl,
  displayName,
}: AvatarUploaderProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 10 MB");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function handleUpload() {
    if (!file) return;

    uploadAvatar.mutate(file, {
      onSuccess: () => {
        toast.success("Imagen actualizada");
        setOpen(false);
        setFile(null);
        setPreviewUrl(null);
      },
      onError: () => {
        toast.error("No se pudo actualizar la imagen");
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (uploadAvatar.isPending) return;

        setOpen(nextOpen);
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            className="group relative rounded-full cursor-pointer"
          />
        }
      >
        <Avatar data-profile-avatar className="size-42">
          <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
          <AvatarFallback>{initials || "?"}</AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Pencil className="size-5 text-white" />
        </div>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogClose
          render={
            <Button
              variant="ghost"
              className="absolute top-2 right-2 cursor-pointer"
              size="icon-sm"
              disabled={uploadAvatar.isPending}
            >
              <X className="size-4" />
              <span className="sr-only">Cerrar</span>
            </Button>
          }
        />
        <DialogHeader>
          <DialogTitle>Cambiar imagen de perfil</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5">
          <Avatar className="size-42">
            <AvatarImage
              src={previewUrl ?? avatarUrl ?? undefined}
              alt={displayName}
            />
            <AvatarFallback>{initials || "?"}</AvatarFallback>
          </Avatar>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            disabled={uploadAvatar.isPending}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadAvatar.isPending}
            className="w-full cursor-pointer"
          >
            <Pencil className="size-4" /> Elegir imagen
          </Button>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploadAvatar.isPending}
            className="w-full enabled:cursor-pointer"
          >
            <Save className="size-4" /> {uploadAvatar.isPending ? "Guardando..." : "Guardar imagen"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
