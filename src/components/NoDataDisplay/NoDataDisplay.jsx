

const NoDataDisplay = ({ 
  icon: Icon,
  title = "No hay datos disponibles",
  description = "No hay información para mostrar en este momento.",
  iconClassName = "w-16 h-16 mb-4 opacity-20",
  titleClassName = "text-lg font-semibold mb-2",
  descriptionClassName = "text-sm text-center max-w-[250px]"
}) => (
  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
    {Icon && <Icon className={iconClassName} />}
    <h3 className={titleClassName}>{title}</h3>
    <p className={descriptionClassName}>{description}</p>
  </div>
);

export default NoDataDisplay;