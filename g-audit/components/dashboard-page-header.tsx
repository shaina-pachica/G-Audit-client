interface DashboardPageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function DashboardPageHeader({
  title,
  subtitle,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div>
        <h2 className="text-3xl font-semibold text-black/70">{title}</h2>
        <p className="text-muted-foreground mt-1">
          {subtitle ??
            new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
        </p>
      </div>

      {actions && <div className="flex flex-col gap-3">{actions}</div>}
    </div>
  )
}
