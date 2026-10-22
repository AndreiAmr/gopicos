import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Toast do DS: elevation.2, 4 s, icone + texto (nunca so cor), z-index 60.
 * Use `notify` (`@/lib/notify`) para disparar.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={4000}
      icons={{
        success: <CircleCheckIcon className="size-5 text-gp-success" />,
        info: <InfoIcon className="size-5 text-gp-info" />,
        warning: <TriangleAlertIcon className="size-5 text-gp-warning" />,
        error: <OctagonXIcon className="size-5 text-gp-error" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!shadow-2 !text-body-sm",
          actionButton: "!bg-gp-primary !text-gp-on-primary",
        },
      }}
      style={
        {
          "--normal-bg": "var(--gp-surface)",
          "--normal-text": "var(--gp-text)",
          "--normal-border": "var(--gp-divider)",
          "--border-radius": "var(--radius-md)",
          zIndex: 60,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
