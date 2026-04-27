type Props = {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}

export function FeatureHeader({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <header className="pb-5">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="text-2xl font-black mt-1">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
      )}
      {children}
    </header>
  )
}
