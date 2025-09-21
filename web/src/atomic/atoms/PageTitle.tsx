type PageTitleProps = {
  name: string;
  title: string;
};

export const PageTitle = ({ name, title }: PageTitleProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-title text-muted-foreground text-md">{name}</h3>
      <h1 className="font-title  text-2xl ">{title}</h1>
    </div>
  );
};
