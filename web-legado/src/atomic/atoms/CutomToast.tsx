type CustomToastProps = {
  title: string;
  description: string;
};

export const CustomToast = ({ title, description }: CustomToastProps) => {
  return (
    <div className="">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
