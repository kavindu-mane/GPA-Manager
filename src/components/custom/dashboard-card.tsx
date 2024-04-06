import { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const DashboardCard = ({
  children,
  title,
  value,
}: {
  children: ReactElement;
  title: string;
  value: string | number;
}) => {
  return (
    <Card className="w-full max-w-[20rem]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <div className="min-w-40 text-start text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
